# Tourmate Website

Customer-facing site for The Wild Oasis, built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

This README is intentionally short and practical: how to run the app, how the repo is laid out, and which env vars you need.

## Table of contents

- [Getting started](#getting-started)
  - [Requirements](#requirements)
  - [Quick start](#quick-start)
  - [Environment variables](#environment-variables)
- [Project guide](#project-guide)
  - [Scripts](#scripts)
  - [Project map](#project-map)
  - [Routes](#routes)
  - [Next.js notes](#nextjs-notes)
- [Architecture notes](#architecture-notes)
  - [Core principle](#core-principle)
  - [Strategy 1: fetch in `page.js` blocks streaming](#1-strategy-1-anti-pattern-fetch-in-pagejs)
  - [Strategy 2: granular fetching enables streaming](#2-strategy-2-granular-fetching-enables-streaming)
  - [Deep dive: reservation reminder & `resetRange`](#deep-dive-reservation-reminder--resetrange)
- [API guide (route handlers)](#api-guide-route-handlers)
  - [What route handlers are](#1-what-route-handlers-are)
  - [File-system routing](#3-file-system-routing)
  - [HTTP verbs](#4-http-verbs-as-first-class-functions)
  - [Returning responses](#6-returning-responses-the-right-way)
  - [Error handling](#8-error-handling-pattern)
  - [Authentication & security](#9-authentication--security)

## Getting started

### Requirements

- Node.js 18+ (recommended)
- npm

### Quick start

    npm install
    npm run dev

Then open <http://localhost:3000>

### Environment variables

Supabase is configured in app/_lib/supabase.js using:

- SUPABASE_URL
- SUPABASE_KEY

Create .env.local in the project root:

    SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"

Note: keep these server-side. Do not expose service role keys to the browser.

## Project guide

### Scripts

- npm run dev: start dev server
- npm run build: production build
- npm run start: start production server
- npm run prod: build + start
- npm run lint: run ESLint

### Project map

    app/
      _components/      UI components
      _lib/             data + Supabase client
      _styles/          global styles
      about/            /about
      account/          /account (+ nested routes)
      cabins/           /cabins (+ dynamic cabin page)
      error.js          segment error boundary
      loading.js        root loading UI
      not-found.js      root 404
      layout.js         root layout
      page.js           /
    public/

Path alias: @/* maps to the project root (see jsconfig.json).

### Routes

- / -> app/page.js
- /cabins -> app/cabins/page.js
- /cabins/[cabinid] -> app/cabins/[cabinid]/page.js
- /about -> app/about/page.js
- /account -> app/account/page.js
- /account/profile -> app/account/profile/page.js
- /account/reservations -> app/account/reservations/page.js

### Next.js notes

- app/error.js and app/not-found.js control error/404 UI.
- Use notFound() for "missing resource" flows (see getCabin() in app/_lib/data-service.js).
- fetch() is cached by default in Server Components; opt out explicitly when you need always-fresh reads.

---

## Architecture notes

### Core principle

> **Fetch data as low in the tree as possible — but no lower than necessary.**

Everything in this lecture flows from that rule.

---

### 1. Strategy 1 (anti-pattern): fetch in `page.js`

Fetching everything in `page.js` looks clean:

```js
await Promise.all([
  getCabin(id),
  getSettings(),
  getBookedDatesByCabinId(id)
]);
```

From a *data* perspective:

- ✅ Parallel
- ✅ Simple
- ✅ No duplication

From a *rendering* perspective:

- ❌ Catastrophic for UX

### The Key Problem: Server Components Are Blocking

A Server Component:

- **Does not render progressively**
- **Waits for *all* awaited data**
- **Blocks HTML streaming**

So even though:

- `getCabin()` = 100ms
- `getSettings()` = 5s

The user sees **nothing** for 5 seconds.

This violates the golden UX rule:

> *Fast data should never wait for slow data.*

---

### 2. Strategy 2: granular fetching enables streaming

Moving slow data into `<Reservation />` changes everything.

### What Actually Happens Now

1. `Page.js` fetches **only fast cabin data**
2. HTML for cabin title, image, description starts streaming immediately
3. `<Reservation />` is rendered **later**, when its data is ready

This unlocks:

- Streaming
- Suspense boundaries
- Partial page rendering

Even though everything is still a **Server Component**, the experience feels “client-like”.

---

### 3. Why `<Reservation />` is the correct fetch boundary

This is the most important architectural decision in the lecture.

### Look at the Data Dependencies

| Component       | Needs Settings | Needs Booked Dates |
| --------------- | -------------- | ------------------ |
| DateSelector    | ✅              | ✅                  |
| ReservationForm | ✅              | ❌                  |

Two children.
One shared dependency.

### The Wrong Approaches

❌ Fetch in both children
→ Duplicate requests
→ Possible waterfalls

❌ Fetch in `page.js`
→ Blocks the entire page

---

### 4. Fetch in the nearest common parent

`<Reservation />` is:

- The **lowest common ancestor**
- The **smallest blocking boundary**
- The **logical domain owner** of reservation logic

So it becomes the data-fetching hub:

```js
const [settings, bookedDates] = await Promise.all([
  getSettings(),
  getBookedDatesByCabinId(cabinId)
]);
```

Then:

- `settings + bookedDates` → `<DateSelector />`
- `settings` → `<ReservationForm />`

This keeps:

- Fetching centralized
- UI decoupled
- Performance optimal

---

### 5. Why this architecture scales

This pattern gives you:

### ✅ Progressive Rendering

Fast cabin content renders immediately.

### ✅ No Waterfalls

Parallel fetching at each level.

### ✅ No Overfetching

Each component fetches exactly what it owns.

### ✅ Clean Ownership

- Page = routing + layout
- Reservation = reservation domain
- Children = presentation + interaction

---

### 6. Data-islands mental model

Think in **data islands**:

- The page is not one data island.
- Each slow feature is its own island.
- Islands stream independently.

> **Pages orchestrate.
> Sections fetch.
> Children consume.**

---

### Rule of thumb

> **If multiple components need the same data, fetch it once in their closest shared parent — but never higher than needed.**

That single sentence explains:

- This lecture
- The previous Server/Client composition lecture
- And 90% of App Router performance decisions

---

### Deep dive: reservation reminder & `resetRange`

This part is *sneakily important* because it shows **why Context beats URL state for UI-only interactions**.

---

#### A. What problem the reservation reminder actually solves

Imagine the user flow:

1. User opens **Cabin A**
2. Selects a date range (e.g., Jan 10 → Jan 15)
3. Scrolls down, gets distracted
4. Clicks another cabin
5. Forgets they already selected dates 😵

Without a reminder:

- The selection exists in memory
- But the user has **no visual feedback**
- UX feels broken or confusing

👉 The **Reservation Reminder** acts as a **persistent UI cue** that says:

> “Hey — you’ve already selected dates. Want to continue or clear them?”

---

#### B. Why the reminder must be a Client Component

The reminder depends on:

- `range` (state)
- `resetRange()` (function)

Both come from **React Context**, which:

- Uses `useState`
- Uses `useContext`

⛔ Server Components cannot access this state
✅ So the reminder **must** be a Client Component

That’s fine — it’s purely UI.

---

#### C. Conditional rendering based on context state

The entire reminder logic boils down to **one condition**:

```js
const { range } = useReservation();

if (!range?.from || !range?.to) return null;
```

### What this means

- If **no date range exists** → render nothing
- If **both dates exist** → show the reminder

This is important:

> ❗ The component doesn’t “hide itself”
> ❗ It simply **does not render at all**

That’s idiomatic React.

---

#### D. Why `resetRange` belongs in context (not the component)

### ❌ Bad approach (anti-pattern)

```js
setRange({ from: undefined, to: undefined });
```

Problems:

- Repeated logic
- Easy to make mistakes
- Harder to refactor later
- Couples UI to state shape

---

### ✅ Correct approach (what the lecture teaches)

```js
function resetRange() {
  setRange({ from: undefined, to: undefined });
}
```

And expose it via context:

```js
<ReservationContext.Provider
  value={{ range, setRange, resetRange }}
>
```

### Why this is **architecturally clean**

| Benefit                    | Explanation                                        |
| -------------------------- | -------------------------------------------------- |
| **Encapsulation**          | Components don’t care how state is reset           |
| **Single source of truth** | Reset logic lives in one place                     |
| **Future-proof**           | You can add side effects later (analytics, toasts) |
| **Cleaner UI code**        | Components just call `resetRange()`                |

Think of it like an API:

> Components don’t mutate state — they **ask** the context to do it.

---

#### E. How reset instantly updates the UI

This is the *magic moment* ✨

When `resetRange()` runs:

1. `setRange({ from: undefined, to: undefined })`
2. Context state updates
3. **ALL subscribed components re-render**

   - `DateSelector` → clears calendar
   - `ReservationForm` → clears dates
   - `ReservationReminder` → condition fails → disappears

No prop drilling
No manual syncing
No hacks

That’s **reactive state done right**.

---

#### F. Why the reminder persists across pages

This happens because of **where the Provider lives**:

```txt
RootLayout (Server)
 └── ReservationProvider (Client)
      └── Pages
           ├── Cabin A
           ├── Cabin B
           └── ...
```

### Key insight

- Navigating between cabins does **not unmount** the layout
- The provider stays alive
- State stays in memory

This gives you:

- Cross-page persistence
- Zero re-fetch
- Instant UX

---

#### G. Why context is better than URL state here

Let’s compare:

### URL-based approach

```txt
/cabin/1?from=2026-01-10&to=2026-01-15
```

Problems:

- Triggers navigation
- Re-runs Server Components
- Re-fetches data
- Slower
- Not semantically correct (this is UI state, not app state)

---

### Context-based approach

- No navigation
- No server re-render
- Instant UI updates
- Clean separation of concerns

📌 **Rule of Thumb (from the lecture)**

> If state affects **what data is fetched** → URL
> If state affects **only UI behavior** → Context

---

#### H. Mental model to remember

Think of Context here as:

> 🧠 “Temporary client memory that follows the user around”

And `resetRange()` as:

> 🧹 “Clear all booking intent everywhere, instantly”

---

#### I. Final big picture

You now have:

✔ Shared state without prop drilling
✔ No unnecessary server work
✔ Instant UI feedback
✔ Clean architecture
✔ Scalable pattern for future features

This is **production-grade Next.js design**, not tutorial fluff.

---

## API guide (route handlers)

---

### 1. What route handlers are

At a conceptual level, a **Route Handler** is:

> A thin HTTP interface that lets Next.js behave like a backend API server.

They:

- Run **only on the server**
- Use **standard Web APIs** (`Request`, `Response`)
- Can talk directly to databases, Supabase, Stripe, etc.
- Are framework-aware (cookies, headers, caching)

They are **not React components**.
They are **request handlers**.

---

### 2. Why route handlers still matter (even with Server Actions)

### 🔹 Server Actions

Best for:

- Form submissions
- Internal mutations
- UI-triggered updates
- Tight coupling to components

### 🔹 Route Handlers

Still essential for:

- External clients (mobile apps, Postman, third-party services)
- Webhooks (Stripe, GitHub, Clerk, etc.)
- Public APIs
- Fine-grained HTTP control (status codes, headers, auth)

📌 **Rule of Thumb**

> If a browser form submits it → Server Action
> If a non-browser client calls it → Route Handler

---

### 3. File-system routing

### Basic API Route

```txt
app/
 └── api/
      └── cabins/
           └── route.js   → /api/cabins
```

### Dynamic Route

```txt
app/
 └── api/
      └── cabins/
           └── [cabinId]/
                └── route.js → /api/cabins/123
```

### ❌ Important Restriction

You **cannot** have:

```txt
app/cabins/page.js
app/cabins/route.js ❌
```

Why?

- `page.js` → browser navigation
- `route.js` → API response

Next.js refuses ambiguity.

---

### 4. HTTP verbs as first-class functions

This is a **huge design improvement** over the Pages Router.

### Old (Pages Router)

```js
export default function handler(req, res) {
  if (req.method === 'GET') {}
  if (req.method === 'POST') {}
}
```

### New (App Router)

```js
export async function GET() {}
export async function POST() {}
export async function DELETE() {}
```

### Why this is better

- Clear intent
- Tree-shakeable
- Easier to reason about
- Matches REST semantics

Each function:

- Is **independent**
- Handles exactly **one HTTP verb**

---

### 5. The Request & params objects

### Function signature

```js
export async function DELETE(request, { params }) {}
```

### `request`

Standard Web API `Request`:

- `request.headers`
- `request.cookies`
- `request.json()`
- `request.method`

### `{ params }`

Only exists for **dynamic routes**:

```js
/api/cabins/[cabinId]
```

```js
params = { cabinId: "123" }
```

---

### 6. Returning responses the right way

### ❌ Don’t do this

```js
return { success: true };
```

### ✅ Always use `NextResponse`

```js
import { NextResponse } from 'next/server';

return NextResponse.json(data);
```

Why?

- Correct headers
- Streaming support
- Middleware compatibility
- Future-proof

---

### 7. Status codes matter

The transcript shows:

```js
return NextResponse.json({ success: true });
```

But in **real apps**, do this:

```js
return NextResponse.json(
  { success: true },
  { status: 200 }
);
```

And for errors:

```js
return NextResponse.json(
  { error: "Cabin not found" },
  { status: 404 }
);
```

This is **critical** for:

- Frontend error handling
- External clients
- API consumers

---

### 8. Error handling pattern

### Recommended structure

```js
export async function DELETE(request, { params }) {
  try {
    const { cabinId } = params;
    await deleteCabin(cabinId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete cabin" },
      { status: 500 }
    );
  }
}
```

Why:

- Never leak internal errors
- Predictable API shape
- Safe for production

---

### 9. Authentication & security

Route Handlers:

- **Do NOT inherit client auth automatically**
- Must manually check cookies / headers

Example:

```js
import { cookies } from 'next/headers';

const cookieStore = cookies();
const session = cookieStore.get('session');
```

If this endpoint deletes data:

- You **must** validate user permissions
- Otherwise anyone can hit `/api/cabins/123`

📌 **Server Actions auto-protect UI flows**
📌 **Route Handlers must be secured explicitly**

---

### 10. Route handlers vs Server Components

| Feature                    | Server Component | Route Handler |
| -------------------------- | ---------------- | ------------- |
| Returns JSX                | ✅                | ❌             |
| Returns JSON               | ❌                | ✅             |
| Used by browser navigation | ✅                | ❌             |
| Used by external clients   | ❌                | ✅             |
| Uses HTTP verbs            | ❌                | ✅             |

They serve **entirely different purposes**.

---

### 11. Caching behavior

By default:

- Route Handlers are **dynamic**
- Not cached like Server Components

You can control caching via:

```js
export const dynamic = "force-dynamic";
```

Or headers:

```js
return NextResponse.json(data, {
  headers: {
    "Cache-Control": "no-store"
  }
});
```

This is **huge** for APIs.

---

### 12. When not to use route handlers

❌ Don’t use them for:

- Simple form submissions
- UI-only mutations
- Internal app state

Server Actions are:

- Faster
- Simpler
- More secure
- Better DX

---

### 13. Mental model to lock this in

Think of Route Handlers as:

> 🧱 “A backend API surface living *inside* your Next.js app”

And Server Actions as:

> 🎯 “UI-triggered server logic tightly coupled to React”

Once you see this split, everything clicks.

---

### 14. Final architecture summary

```txt
UI Event
 ├── Needs API? → Route Handler (/api/...)
 └── Needs mutation? → Server Action
```

You now understand:

- Why Route Handlers exist
- When to use them
- How they differ from old API routes
- How they fit into modern Next.js architecture

---

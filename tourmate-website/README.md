# Tourmate Website

Customer-facing site for The Wild Oasis, built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

This README is intentionally short and practical: how to run the app, how the repo is laid out, and which env vars you need.

## Requirements

- Node.js 18+ (recommended)
- npm

## Quick start

    npm install
    npm run dev

Then open http://localhost:3000

## Environment variables

Supabase is configured in app/_lib/supabase.js using:

- SUPABASE_URL
- SUPABASE_KEY

Create .env.local in the project root:

    SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"

Note: keep these server-side. Do not expose service role keys to the browser.

## Scripts

- npm run dev: start dev server
- npm run build: production build
- npm run start: start production server
- npm run prod: build + start
- npm run lint: run ESLint

## Project map

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

## Routes

- / -> app/page.js
- /cabins -> app/cabins/page.js
- /cabins/[cabinid] -> app/cabins/[cabinid]/page.js
- /about -> app/about/page.js
- /account -> app/account/page.js
- /account/profile -> app/account/profile/page.js
- /account/reservations -> app/account/reservations/page.js

## Next.js notes

- app/error.js and app/not-found.js control error/404 UI.
- Use notFound() for "missing resource" flows (see getCabin() in app/_lib/data-service.js).
- fetch() is cached by default in Server Components; opt out explicitly when you need always-fresh reads.

---

### Client and server interactions

## **What This Section Is *Really* About**

This section focuses on **the boundary between the server and the client** in Next.js — and how to *intentionally* design that boundary.

> Not “server vs client”, but **server *with* client**.

The goal is to build **true full-stack React applications**, where:

* Data lives on the server
* Interactivity lives on the client
* And both cooperate efficiently

---

## **1. Component Composition (Server ↔ Client)**

### **What You Learn**

You’ll learn:

* **When** to use Server Components
* **When** to use Client Components
* **How to compose them together correctly**

### **Key Concept**

> Server Components can be rendered *inside* Client Components — but with rules.

This matters because:

* Server Components are faster
* Client Components enable interactivity
* Bad composition leads to performance issues

You’re learning **architectural decision-making**, not just syntax.

---

## **2. State Management Across Server and Client**

This is one of the most advanced ideas in modern Next.js.

### **A. Using the URL as State**

* Search params
* Route segments
* Filters, sorting, pagination

Why this is powerful:

* Server can read it
* Client can update it
* State becomes shareable and bookmarkable

---

### **B. Using React Context**

* Share state between Client Components
* Coordinate UI behavior
* Avoid prop drilling

Combined with Server Components, this forces you to think:

> *Where should this state live — server or client?*

That’s the skill being trained.

---

## **3. Data Fetching Strategy (The Big One)**

This section teaches **how to think**, not just how to fetch.

You learn to ask:

* What data is needed for the entire page?
* What data can be streamed later?
* What data depends on user interaction?
* What should block rendering vs what shouldn’t?

This leads to:

* Smarter `Suspense` boundaries
* Better streaming
* Faster perceived performance

---

## **4. Why the Instructor Calls This “Pretty Advanced”**

Because this section requires you to understand **multiple systems at once**:

* React Server Components
* Client-side interactivity
* Streaming and Suspense
* Caching implications
* State synchronization
* URL-driven architecture

Most developers:

* Either overuse client components
* Or misunderstand server components

This section fixes that.

---

## **Big Picture Takeaway**

> **You’re learning how to design the “seam” between server and client.**

Once you understand this:

* Your apps scale better
* Your pages load faster
* Your architecture becomes intentional, not accidental

This is exactly the kind of thinking used in **production-grade Next.js apps** — including dashboards, booking systems, and data-heavy UIs (👀 sounds familiar).

---

## **One-Line Summary**

> **This advanced section teaches how Server Components, Client Components, shared state, and data fetching work together to build efficient full-stack Next.js applications.**

![img](https://i.ibb.co.com/LhYx4GNL/Screenshot-from-2026-01-26-09-53-54.png)
![img](https://i.ibb.co.com/mVx8JGny/Screenshot-from-2026-01-26-10-25-03.png)

## 1. The Big Shift: From “Backend vs Frontend” to **One Knitted Tree**

### Traditional Mental Model (Old World)

Think of this as a **hard wall**:

```
[ Backend ]  ---> JSON --->  [ Frontend ]
```

* Separate codebases
* Separate deployments
* APIs are mandatory
* Backend never touches UI
* Frontend owns rendering entirely

The server’s job **ends** once JSON is sent.

---

### RSC Mental Model (Next.js World)

Now think **one tree**, not two apps:

```
Server
 └─ Client
     └─ Server
         └─ Client
```

This is what the instructor means by **“knitting”**.

Key consequences:

* No strict backend/frontend split
* One component tree
* One repo
* Server and client logic interwoven *by design*

This is not MVC.
This is **component-driven full-stack architecture**.

---

## 2. Why the API Layer Disappears (and Why That’s Huge)

### Data Fetching (Read)

**Before:**

```text
Client → API → DB → JSON → Client → Render
```

**With RSC:**

```text
Server Component → DB → Render → Stream to Client
```

* No REST endpoint
* No serialization boilerplate
* No over-fetching
* No client-side parsing

If a Client Component needs data:
👉 **The Server Component just passes it as props**

---

### Data Mutation (Write)

**Before:**

```text
Client → POST /api/booking → Server → DB
```

**Now (Server Actions):**

```ts
<form action={createBooking}>
```

* Client triggers a function
* Function runs on the server
* Database is mutated directly

This removes **an entire architectural layer**.

That’s why this section is called *advanced*.

---

## 3. The “Impossible” Thing: Client Rendering Server Components 🤯

You’re absolutely right — **this feels illegal at first**.

### The Rule That Never Breaks

> Once code runs in the browser, it can never go back to the server.

So how does this work?

---

### The Trick: **Composition, Not Execution**

The key idea:

> A Client Component never executes a Server Component.

Instead:

1. A **Server Component** imports both:

   * A Client Component
   * Another Server Component

2. The child Server Component is rendered **on the server first**

3. Its rendered output is passed as a **slot** (`children` or prop)

4. The Client Component just **renders what it received**

So the client is not “calling” the server —
it’s **receiving pre-rendered UI**.

This is why `children` is so important in RSC architecture.

---

## 4. Component Tree vs Dependency Tree (THE RULEBOOK)

This is the single most important mental model.

### Component Tree (What You See)

This answers:

> “What renders inside what?”

This tree can look like:

```
Server
 └─ Client
     └─ Server
```

✅ Totally valid

---

### Dependency Tree (What You Import)

This answers:

> “Who imports whom?”

This is where rules apply.

### 🔒 The Golden Rule

> **Client Components may NOT import Server Components**

Once you see `'use client'`:

* Everything it imports becomes client-side
* Server-only code is forbidden

---

### Why This Works

Even if a Server Component appears *below* a Client Component visually:

* It was imported **above**, by a Server Component
* So the boundary is preserved

**Boundaries are enforced by imports, not JSX nesting.**

That sentence alone is worth the section.

---

## 5. The “Chameleon” Component (Context Is Everything)

This is subtle — and extremely powerful.

### Default Behavior

Any component **without** `'use client'` is:
👉 A **Server Component by default**

---

### But Its Identity Depends on Who Imports It

| Imported by      | Result          |
| ---------------- | --------------- |
| Server Component | Server instance |
| Client Component | Client instance |

So the *same file* can exist as:

* A Server Component in one branch
* A Client Component in another

This is **intentional**, not a hack.

---

### Why This Matters

It allows:

* Maximum reuse
* Zero duplication
* Context-aware optimization

Next.js doesn’t care *what the file is* —
it cares **where it’s imported from**.

---

## Final Mental Model (Lock This In)

> **Next.js is no longer “frontend calling backend.”
> It is one tree where execution moves between server and client based on imports.**

If you understand:

* Dependency Tree vs Component Tree
* Server-first execution
* Slot-based composition
* Context-dependent components

You officially understand **React Server Components**.

Most developers don’t.

---

### One-Line Summary

> **RSC turns a full-stack app into a single, interwoven component tree where server and client cooperate without APIs, enforced by import boundaries rather than visual structure.**

---

## 1. The Core Problem (Why This Even Exists)

You’re starting from a **Server Component page**, which is ideal because it:

* Fetches data directly from the database
* Is fast and SEO-friendly
* Ships minimal JavaScript

But then reality hits 😄:

> “I need a button. I need state. I need interaction.”

### The Hard Limitation

Server Components:

* ❌ No `useState`
* ❌ No event handlers
* ❌ No browser APIs

So you **cannot** just add:

```js
const [isExpanded, setIsExpanded] = useState(false);
```

inside `page.js`.

That would violate the model.

---

## 2. The Solution Pattern: **Islands of Interactivity**

This lecture introduces one of the most important App Router patterns:

> **Keep pages server-first, and add tiny client islands only where needed.**

You don’t convert the whole page into a Client Component.
You **extract only the interactive fragment**.

This preserves:

* Performance
* Streaming
* Caching
* SEO

---

## 3. Why `'use client'` Is Non-Negotiable

Placing:

```js
'use client';
```

at the **very top** of `TextExpander.js` tells Next.js:

> “This file must execute in the browser.”

Only then are you allowed to:

* Use `useState`
* Attach `onClick`
* Access browser APIs

Without this directive:

* The file is treated as a Server Component
* Hooks will crash the build

This is not optional — it defines the execution environment.

---

## 4. The Architectural Rule Being Reinforced

### 🔑 Golden Rule (Revisited)

> **Server Components can import Client Components.
> Client Components cannot import Server Components.**

Your example follows this perfectly:

* `page.js` → Server Component
* `TextExpander.js` → Client Component
* Import direction is ✅ valid

This is the **intended default architecture** of Next.js App Router.

---

## 5. Why Wrapping `children` Is So Important

This line is doing more than it seems:

```jsx
<TextExpander>{description}</TextExpander>
```

What’s happening:

* The **text is rendered on the server**
* The **interactivity is handled on the client**
* No extra data fetching
* No duplication

This is the **slot-based composition pattern** that makes RSC powerful.

The client never fetches the description.
It only **controls visibility**.

---

## 6. Execution & Logging — How You *Prove* It

The transcript’s logging tip is crucial for debugging.

| Log Location    | Meaning                    |
| --------------- | -------------------------- |
| Terminal        | Server Component execution |
| Browser console | Client Component execution |

If you log inside:

* `page.js` → terminal
* `TextExpander.js` → browser console

That’s your proof the boundary is working correctly.

---

## 7. Why This Pattern Matters in Real Apps

This isn’t a toy example.

This exact pattern is used for:

* “Show more / less”
* Tabs
* Accordions
* Filters
* Modals
* Toggles
* Carousels

All **without** turning the entire page into a Client Component.

This is how you scale Next.js apps properly.

---

## Final Mental Model (Memorize This)

> **Pages fetch and render data on the server.
> Client components add interaction in small, isolated islands.**

If you follow this rule:

* Your JS bundle stays small
* Your pages stay fast
* Your architecture stays clean

---

### One-Line Summary

> **Interactivity in Next.js is added by extracting small Client Components (“islands”) and embedding them inside Server Components, preserving performance while enabling state and events.**

---

## 1. The Real Goal (Beyond Styling)

Yes, the visible goal is:

> “Highlight the active sidebar link.”

But the *real lesson* of this lecture is:

> **Reading browser state = client-side responsibility**

Even if there is **no click handler**, **no state**, and **no animation**.

---

## 2. Why `usePathname` Is the Correct Tool

`usePathname` exists for one reason:

* To let React read the **current URL inside the browser**

```js
import { usePathname } from 'next/navigation';
```

When called, it returns:

```txt
/cabins
/settings
/account
```

This value:

* Changes when navigation happens
* Exists only in the browser
* Is therefore **client-side data**

That single fact dictates everything else.

---

## 3. Why This Forces a Client Component

### The Important Rule

> **All React hooks run on the client.**

So when you do this:

```js
const pathname = usePathname();
```

You are implicitly saying:

> “This component must execute in the browser.”

Next.js enforces this strictly.

---

### The Fix (Not Optional)

You must add:

```js
'use client';
```

at the **very top** of the file.

This:

* Switches execution to the browser
* Enables hooks
* Makes `usePathname` legal

Without it → build-time error.

---

## 4. Implementation Logic (Why It’s Simple by Design)

The transcript intentionally keeps the logic minimal:

```js
pathname === link.href
```

Why?

* Predictable
* Fast
* Easy to reason about

This avoids:

* Regex complexity
* Over-engineering
* Hard-to-debug edge cases

Styling is just a consequence of this comparison.

---

## 5. The Key Architectural Lesson (This Is the Point)

This line from the lecture is subtle but powerful:

> *You don’t need clicks or state to justify a Client Component.*

Reading **any browser-only information** is enough.

That includes:

* URL (`usePathname`)
* Search params
* Window size
* Media queries

So “interactivity” in Next.js really means:

> **Dependence on browser-only data**

---

## 6. How This Fits the Bigger Architecture

This pattern matches everything you’ve learned so far:

* Pages → Server Components (data, layout, performance)
* Navigation UI → Client Components (URL-aware)
* Small, focused client islands
* No unnecessary JS

This is **intentional, professional architecture**.

---

## Final Mental Model

> **If a component needs to *know* what the browser is doing, it must be a Client Component — even if it never handles an event.**

Once you internalize this, App Router decisions become obvious.

---

### One-Line Summary

> **Highlighting the active navigation link requires a Client Component because reading the current URL via `usePathname` is a browser-only concern, even without traditional interactivity.**
---

## 1. The Real Problem Being Solved

You already know:

* **Server → Client** data flow = props (easy)
* **Client → Server** data flow = ❓ (hard)

Traditionally, this meant:

* Local state + effects
* API calls
* Global state libraries

This lecture introduces a **simpler and more scalable idea**:

> **Use the URL as the shared state between client and server.**

---

## 2. Why the URL Is the Perfect State Container

The transcript’s arguments are spot-on — and together they form a killer case.

### ✅ Shareable

The URL fully represents the app state:

```txt
/cabins?capacity=small
```

Anyone opening this link sees **the same view**.

---

### ✅ Server-Readable

The URL exists **before any JS runs**.

That means:

* Server Components can read it
* Data can be fetched correctly
* HTML is rendered already filtered

This is **true SSR**, not client-side filtering.

---

### ✅ Observable

Analytics, logs, and monitoring tools see:

* What users filter by
* How they navigate
* What content matters

Local React state is invisible to the outside world.
URLs are not.

---

## 3. Client Side: Writing State *Into* the URL

The `Filter` component becomes a **URL writer**.

### Why it must be a Client Component

* Uses hooks
* Responds to clicks
* Manipulates browser navigation

So `'use client'` is mandatory.

---

### The Three Hooks (Each Has a Role)

| Hook              | Purpose                |
| ----------------- | ---------------------- |
| `useSearchParams` | Read current URL state |
| `usePathname`     | Preserve current route |
| `useRouter`       | Update the URL         |

This is deliberate — no hook is redundant.

---

### Why `URLSearchParams` Is Copied

```js
new URLSearchParams(searchParams)
```

Because:

* `searchParams` is read-only
* Mutation must be explicit
* Prevents accidental side effects

This mirrors good backend practices.

---

### Why `router.replace` (Not `push`)

* `replace` avoids polluting browser history
* Filters feel like state, not navigation
* Back button remains meaningful

This is a **UX decision**, not just technical.

---

## 4. Server Side: Reading State *From* the URL

This is where the magic happens.

### The Key Fact

> **Every Page automatically receives `searchParams`.**

No imports.
No hooks.
No client code.

Just:

```js
export default function Page({ searchParams }) {}
```

---

### Defaulting Logic

```js
const filter = searchParams?.capacity ?? 'all';
```

This ensures:

* Clean URLs
* Safe rendering
* Predictable server behavior

---

### Data Fetching Becomes Deterministic

```js
getCabins(filter);
```

Now:

* UI state
* URL state
* Database query

…are **perfectly aligned**.

---

## 5. The Scroll Optimization (Small but Important)

By default:

* URL change = scroll reset

For filters, that feels wrong.

```js
router.replace(url, { scroll: false });
```

This:

* Keeps context
* Feels instant
* Preserves SPA smoothness

While still:

* Triggering a server render
* Updating real state

Best of both worlds.

---

## 6. The Full Data Flow (Mental Model)

Lock this sequence in:

```
Client click
   ↓
URL update
   ↓
Server re-render
   ↓
Data refetch
   ↓
Streamed HTML
   ↓
UI updates
```

No API.
No global state.
No hacks.

Just **URL-driven architecture**.

---

## Why This Pattern Is So Powerful

This is not just for filters.

Same pattern applies to:

* Sorting
* Pagination
* Tabs
* Search queries
* View modes

Once you master this:

> **You stop fighting server/client boundaries — you use them.**

---

## One-Line Summary

> **Using search parameters as shared state lets Client Components communicate with Server Components through the URL, enabling SSR, shareable views, and clean architecture without APIs or global state.**


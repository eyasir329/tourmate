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
- [API endpoints](#api-endpoints)
- [Authentication](#authentication-authjs--supabase)
  - [Auth flow](#auth-flow)
  - [Where the code lives](#where-the-code-lives)
  - [Auth environment variables](#auth-environment-variables)
  - [Auth.js configuration](#authjs-configuration)
  - [Route protection (middleware)](#route-protection-middleware)
  - [Supabase guest sync](#supabase-guest-sync)
  - [Using auth in components](#using-auth-in-components)
  - [Troubleshooting](#troubleshooting)

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

## API endpoints

- `GET /api/cabins/[cabinid]` → [app/api/cabins/[cabinid]/route.js](app/api/cabins/%5Bcabinid%5D/route.js)

---

## Authentication (Auth.js + Supabase)

This project uses **Auth.js (NextAuth v5)** for Google OAuth + sessions, and **Supabase** for application data (guests, bookings, cabins).

The key idea is separation of concerns:

- Auth.js answers: “Who is this person?” (identity + session)
- Supabase answers: “Who is this person *in our domain*?” (guest row + ids + bookings)

### Table of contents

- [Auth flow](#auth-flow)
- [Where the code lives](#where-the-code-lives)
- [Auth environment variables](#auth-environment-variables)
- [Auth.js configuration](#authjs-configuration)
- [Route protection (middleware)](#route-protection-middleware)
- [Supabase guest sync](#supabase-guest-sync)
- [Using auth in components](#using-auth-in-components)
- [Troubleshooting](#troubleshooting)

---

### Auth flow

At a high level, the happy path looks like this:

```txt
User clicks “Continue with Google”
  → POST Server Action (signIn)
  → /api/auth/* handled by Auth.js
  → Google OAuth callback
  → callbacks.signIn() runs (optional side effects)
  → session cookie created
  → redirect to /account
  → middleware checks session
  → Server Components can call auth() for user info
```

---

### Where the code lives

| Concern | File | Notes |
| --- | --- | --- |
| Auth config + exports | app/_lib/auth.js | Defines providers, callbacks, and exports `auth`, `signIn`, `signOut`, and route `handlers` |
| Auth route handler | app/api/auth/[...nextauth]/route.js | Wires Auth.js handlers to Next.js route handlers |
| Route protection | middleware.js | Uses `auth` as middleware and limits it via `matcher` |
| Server Actions | app/_lib/actions.js | `signInAction()` and `signOutAction()` call `signIn()` / `signOut()` |
| Supabase DB reads/writes | app/_lib/data-service.js | `getGuest()` and `createGuest()` are used by auth callbacks |
| Supabase client | app/_lib/supabase.js | Initializes the Supabase client used by `data-service.js` |

---

### Auth environment variables

Create a `.env.local` in the project root.

| Variable | Required | Used for |
| --- | --- | --- |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth Client Secret |
| `AUTH_SECRET` | Yes | Signing/cryptographic secret for Auth.js |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_KEY` | Yes | Supabase anon key (never commit service role keys) |

Local Google OAuth redirect URI (must match in Google console):

```txt
http://localhost:3000/api/auth/callback/google
```

---

### Auth.js configuration

Auth.js is configured in app/_lib/auth.js. The exported helpers are used across the app:

| Export | What it does | Where it’s used |
| --- | --- | --- |
| `auth` | Reads the current session (Server Components + middleware) | middleware.js, server components |
| `signIn` | Starts OAuth login | app/_lib/actions.js |
| `signOut` | Ends session | app/_lib/actions.js |
| `GET/POST` handlers | Powers `/api/auth/*` endpoints | app/api/auth/[...nextauth]/route.js |

Important callbacks in this repo:

| Callback | Purpose | Runs when |
| --- | --- | --- |
| `authorized` | Authorization gate for protected routes | Every request intercepted by middleware |
| `signIn` | Place for side effects (ex: create missing guest row) | During sign-in after provider success |
| `session` | Enriches the session object sent to the app | Whenever `auth()` is called |

Note: This repo uses a custom sign-in page:

```js
pages: {
  signIn: "/login",
}
```

---

### Route protection (middleware)

Routes under `/account` are protected by middleware in middleware.js:

- Auth.js runs before the request reaches the page
- If there is no session, the user is redirected to the sign-in flow
- `matcher: ["/account"]` ensures middleware doesn’t run on every request

If you protect too broadly (e.g. also protecting `/login`), you can get an infinite redirect loop.

---

### Supabase guest sync

Authentication (Google) does not automatically create a domain record in your database.

This repo syncs a “guest” in Supabase using the `callbacks.signIn` hook:

1. Look up guest by email via `getGuest(email)`
2. If not found, insert a guest row via `createGuest({ email, fullName })`

Then it enriches the session in `callbacks.session` by fetching the guest again and attaching the database id:

```js
session.user.id = guest.id;
```

This gives the rest of the app a stable database identifier to associate bookings with.

#### Important note about Supabase security (RLS)

If your Supabase table has **Row Level Security enabled**, inserts/reads may fail unless you have policies that allow them.

Typical options:

- Create RLS policies to allow the server-side anon key to read/insert (careful!)
- Or use a server-only Supabase client with a **service role key** (recommended for privileged inserts, but never expose it to the browser)

---

### Using auth in components

This repo triggers auth using **Server Actions** (App Router friendly):

- Sign in: app/_components/SignInButton.js submits a form to `signInAction` in app/_lib/actions.js
- Sign out: similar approach via `signOutAction`

In Server Components, you can fetch the current session with `await auth()` (imported from app/_lib/auth.js).

---

### Troubleshooting

If a new guest is not being created in Supabase:

1. Check the server logs during sign-in for the error printed by `callbacks.signIn`.
2. Verify the auth callback is actually running (ensure you’re logging in through the Auth.js flow).
3. Confirm `SUPABASE_URL` and `SUPABASE_KEY` are set and correct.
4. Check Supabase RLS policies on the `guests` table:
   - Inserts may be silently blocked by RLS.
   - Reads may return `null`, causing confusing “guest doesn’t exist” behavior.
5. Confirm the `guests` table schema matches what you insert (column names like `email`, `fullName`).

If login itself fails:

- Confirm Google OAuth redirect URI is exactly `http://localhost:3000/api/auth/callback/google`.
- Confirm `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, and `AUTH_SECRET` are present.

Nice, this is the **scene-setting lecture** — short, but it frames *everything* that follows. I’ll tighten it into a **clean, course-ready overview** that clearly signals *why this section matters* and *what skills you’re about to unlock*.

---

## **Interactivity & Mutations**

### **1. The Big Shift: From Read-Only to Interactive**

Up to now, the application has been **read-only**:

- Cabins are fetched
- Data is displayed
- Nothing changes on the server

This section marks a major transition.

👉 You’ll start **mutating data** — creating, updating, and deleting records — using **Server Actions**, which are the modern, recommended way to handle mutations in the **React Server Components** model.

---

### **2. Core Concept: Server Actions**

Server Actions allow you to:

- Run server-side logic directly from React components
- Mutate the database securely
- Avoid traditional API routes for most use cases
- Keep your app fast, simple, and type-safe

They are the foundation for all interactivity in this section.

---

### **3. Real Features You’ll Build**

Using Server Actions, you’ll implement real, production-grade functionality:

- **Reserve a cabin**
  Create new bookings tied to authenticated users

- **Manage reservations**
  Update or delete existing bookings

- **Profile management**
  Allow users to update their personal information

These are not toy examples — they mirror how modern Next.js apps work in the real world.

---

### **4. Advanced React Hooks for Great UX**

To make mutations feel instant and smooth, the section introduces several modern React hooks:

- **`useFormStatus`**
  Track pending form submissions (loading, disabled buttons, spinners)

- **`useTransition`**
  Perform non-blocking state updates without freezing the UI

- **`useOptimistic`**
  Show immediate UI updates *before* the server confirms the change (optimistic UI)

Together, these hooks help you build apps that feel fast—even when the server is doing real work.

---

### **5. Why This Section Matters**

By the end of this section, you’ll understand how to:

- Mutate data without API routes
- Build forms that submit directly to the server
- Handle loading, success, and error states cleanly
- Create modern, responsive UX with Server Components

---

### **Mental Model**

> **Data fetching shows information.
> Server Actions change the world.**

This section is where your app stops being a brochure and starts being a **real product**.

---

## **What Are Server Actions?**

### **1. What Are Server Actions?**

Server Actions are **asynchronous functions that run exclusively on the server**, but can be **invoked directly from UI components** (Server or Client Components).

They act as a **direct bridge** between your interface and your backend logic.

> You write a function once — and Next.js handles the network layer for you.

![img](https://i.ibb.co.com/CZhFvkh/Screenshot-from-2026-01-31-06-19-16.png)
![img](https://i.ibb.co.com/q6HnKwW/Screenshot-from-2026-01-31-06-43-36.png)

---

### **Core Purpose**

Server Actions are designed primarily for:

- **Data mutations**

  - Create
  - Update
  - Delete
- **Form submissions**
- **Secure server-side logic**

They replace the traditional “API route + fetch” pattern for most use cases.

---

## **2. What’s Really Happening Behind the Scenes**

Calling a Server Action *looks* like calling a normal function — but it isn’t.

Here’s what Next.js does for you automatically:

### **A. Hidden API Generation**

When you define a Server Action:

- Next.js generates an internal API endpoint
- You never write `route.js`
- You never call `fetch`

This API is invisible, managed, and optimized by the framework.

---

### **B. Network Communication**

When the action is invoked:

- A standard **HTTP POST request** is sent
- The function arguments are included in the request body
- The server executes the function
- The result is streamed back to React

---

### **C. Serializable Arguments**

Because arguments travel over the network:

- They **must be serializable**
- Plain objects, strings, numbers, arrays are fine
- Functions, class instances, DOM nodes are not

---

## **3. Why Server Actions Matter (Key Benefits)**

### **A. No More Manual API Routes**

**Before Server Actions:**

1. Create an API route
2. Write server-side DB logic
3. Call it with `fetch`
4. Handle JSON + errors manually

**With Server Actions:**

- Write one function
- Call it directly

Less boilerplate.
Less duplication.
Fewer bugs.

---

### **B. Progressive Enhancement (Huge Win)**

Server Actions work seamlessly with **plain HTML forms**.

That means:

- Forms work even if JavaScript fails
- Submissions still reach the server
- When hydration completes, the UI upgrades automatically

This gives you:

- Better accessibility
- Better reliability
- Better UX on slow networks

---

### **C. Full Type Safety**

Because:

- Client and server live in the same project
- Functions are shared
- Types are inferred end-to-end

You get:

- Compile-time safety
- No mismatched request/response shapes
- No duplicated DTOs

This is very hard to achieve with traditional APIs.

---

![img](https://i.ibb.co.com/hxQ2WSTC/Screenshot-from-2026-01-31-06-46-41.png)

## **4. What You Can Do Inside a Server Action**

Server Actions are **real backend functions**.

Inside them, you can:

- **Mutate the database**

  - Insert, update, delete records

- **Revalidate cached data**

  - `revalidatePath()`
  - `revalidateTag()`
  - Instantly update the UI after a mutation

- **Redirect the user**

  - `redirect("/account")`

- **Access cookies**

  - Read auth/session cookies
  - Set preferences

They run with full server privileges.

---

## **5. Where Can Server Actions Be Used?**

Although most commonly seen in forms, Server Actions are flexible.

You can use them in:

- **Forms**

  ```jsx
  <form action={myAction}>
  ```

- **Event handlers**

  ```js
  onClick={async () => await myAction()}
  ```

- **Hooks**

  ```js
  useEffect(() => { myAction(); }, []);
  ```

- **Third-party libraries**
  Anywhere a function is accepted

They are not limited to forms — forms are just the most common and ergonomic case.

---

## **Mental Model to Remember**

> **Server Actions are server functions with a UI trigger**

They:

- Feel like local functions
- Behave like secure APIs
- Eliminate boilerplate
- Enable modern UX patterns

---

### **Why This Is a Big Shift**

Server Actions blur the line between frontend and backend — *on purpose*.

Once you understand them:

- You stop thinking in terms of API endpoints
- You start thinking in terms of **user intent + server logic**

That’s the mindset this section is building.

---

### 1. Server → Client architecture

- ✔️ Data fetching **must happen in a Server Component**
- ✔️ Interactive form **must be a Client Component**
- ✔️ Passing the full `guest` object as a prop is intentional and correct

This is the *canonical* Next.js App Router pattern.

---

### 2. `page.js` responsibilities

You nailed this:

- ✔️ `auth()` to get the session
- ✔️ `getGuest(session.user.email)` to fetch the full profile
- ✔️ Passing `guest` down to the form

> ⚠️ Important nuance (you already hinted at it):
>
> Even if the session stores `guestId`, **this page still needs the full guest object**, so fetching again is correct.

---

### 3. Form pre-filling using `defaultValue`

Spot on.

- ✔️ `defaultValue` is the right choice (not `value`)
- ✔️ Keeps inputs uncontrolled
- ✔️ Avoids unnecessary client state

This is *exactly* how Server → Client forms should work.

---

### 4. Editable vs Read-only fields

Correct interpretation of the business rules:

| Field       | Editable |
| ----------- | -------- |
| Full Name   | ❌        |
| Email       | ❌        |
| Nationality | ✅        |
| National ID | ✅        |

---

## ⚠️ What’s Missing (But Required in the Transcript)

The transcript **does not stop at rendering**.
This page exists **only because a Server Action will update the profile**.

So there are **three critical pieces missing** from your breakdown.

---

## 🔴 1. The Server Action (Core of the Feature)

There **must** be a server action like this:

```js
'use server';

export async function updateProfile(formData) {
  const session = await auth();

  if (!session) throw new Error('Not authenticated');

  const nationalID = formData.get('nationalID');
  const nationality = formData.get('nationality');

  await updateGuest(session.user.email, {
    nationalID,
    nationality,
  });

  revalidatePath('/account/profile');
}
```

👉 Without this, the form does nothing.

---

## 🔴 2. The Form Must Use `action={updateProfile}`

Your form currently has no submission logic.

Correct version:

```jsx
<form action={updateProfile}>
```

This is **the whole point** of “Updating the Profile Using a Server Action”.

No `onSubmit`, no API route, no client fetch.

---

## 🔴 3. Inputs Must Have `name` Attributes

Server Actions read from `FormData`.

So these are required:

```jsx
<input name="nationalID" defaultValue={nationalID} />

<SelectCountry name="nationality" defaultCountry={guest.nationality} />
```

Without `name`, `formData.get()` returns `null`.

---

## ✅ Corrected Mental Model (Very Important)

Think of it like this:

```
Server Page
 ├── fetch session
 ├── fetch guest
 └── render Client Form with default data
        ├── user edits fields
        └── submit → Server Action
                ├── re-authenticate
                ├── update DB
                └── revalidate page
```

This is **pure App Router philosophy**:

- No API routes
- No client fetching
- No state syncing

---

## 🧠 Final Verdict

Your explanation is:

- **Accurate**
- **Well-structured**
- **Faithful to the transcript**

But it is **incomplete** without:

- the **Server Action**
- the **form action**
- the **input `name`s**

---

### 1. The stale data problem

✔️ Correct root cause
✔️ Correct symptom
✔️ Correct cache involved (**Router Cache**, not Data Cache)

Your emphasis on *“even navigating away and back doesn’t fix it”* is exactly the teaching moment of the lecture.

---

### 2. Why `revalidatePath` is needed

You nailed the intent:

- Server Action mutates data
- Client still sees cached UI
- We must manually invalidate the route

This is **the mental shift** App Router forces.

---

### 3. Correct placement

✔️ Inside the Server Action
✔️ After successful mutation
✔️ Imported from `next/cache`

That placement is non-negotiable, and you got it right.

---

## ⚠️ Subtle but Important Nuances (Worth Adding)

These are things students often misunderstand, and the transcript *implies* them.

---

### 🔹 1. This is **NOT** about the database or fetch cache

`revalidatePath` does **not**:

- re-run the Server Action
- update the database
- invalidate Supabase / Prisma caches

It **only** clears Next.js’s **Router Cache** for that route.

That distinction matters.

---

### 🔹 2. Why the UI updates “immediately”

The “instant update” feels magical, but here’s what actually happens:

1. Server Action finishes
2. `revalidatePath()` clears cached route
3. Next.js automatically **re-renders the current route**
4. Server Component runs again
5. Fresh data is fetched
6. Client receives updated HTML/Flight payload

No page refresh. No client fetch.

---

### 🔹 3. Path must match the rendering route

This is a common gotcha:

```js
revalidatePath("/account/profile");
```

✔️ Must match the route **where the data is fetched**
✔️ Not where the action is defined
✔️ Not a parent layout unless that layout fetches the data

If the profile data were fetched in `/account/layout.js`, then:

```js
revalidatePath("/account");
```

would be required instead.

---

## 🧠 Best-Practice Rule (Refined)

Your rule of thumb is correct — here’s the **production-grade version**:

> **Revalidate whenever a Server Action mutates data that is read by a Server Component and cached by the router.**

If:

- ❌ data isn’t displayed → no revalidation
- ❌ data is client-fetched → no revalidation
- ✅ data is server-rendered → revalidate

---

## ✅ Final Verdict

Your explanation is:

- **Technically correct**
- **Well-structured**
- **Aligned with the instructor’s intent**
- **Clear enough for lecture notes**

---

## **Displaying a Loading Indicator with `useFormStatus`**

### **1. Why you need this**

When a form triggers a Server Action (profile update, reservation change, etc.), the request can take noticeable time.

Without feedback:

- Users can’t tell if the submit worked
- They may click multiple times (duplicate submissions)

The UX goal is simple:

- Disable the submit button while the action runs
- Show a pending label (and optionally a spinner)

---

### **2. What `useFormStatus` does**

`useFormStatus` (from `react-dom`) exposes the status of the *nearest parent form submission*.

- `pending: boolean` → `true` while the form’s Server Action is in-flight, `false` when it completes

This is the cleanest way to wire “Submitting…” UI to Server Actions because it tracks the form lifecycle automatically.

---

### **3. Constraints (the part that usually trips people up)**

`useFormStatus` only works when:

- It runs in a **Client Component** (`'use client'`)
- The component calling it is rendered **inside** the `<form>...</form>`

That’s why you generally **should not** call `useFormStatus` in the same component that *declares* the `<form>` — extract the submit button into its own child component.

---

### **4. Recommended pattern: a reusable `SubmitButton`**

```jsx
'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  pendingLabel = 'Working...',
  className = '',
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`rounded bg-primary px-4 py-2 text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        {pending ? pendingLabel : children}
        {pending ? (
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        ) : null}
      </span>
    </button>
  );
}
```

---

### **5. Using it inside a form**

```jsx
import { updateProfileAction } from '@/app/_lib/actions';
import SubmitButton from '@/app/_components/SubmitButton';

export default function UpdateProfileForm({ guest }) {
  return (
    <form action={updateProfileAction}>
      {/* inputs with name=... so FormData works */}
      <SubmitButton pendingLabel="Updating...">Update profile</SubmitButton>
    </form>
  );
}
```

---

### **6. Common gotchas checklist**

- If `pending` never turns `true`, check that the `<form>` uses `action={someServerAction}`.
- Ensure the submit button component is *inside* the form tree (not alongside it).
- Inputs must have `name` attributes if your action reads from `formData.get('...')`.
- If you switch to manual `onSubmit` + `fetch`, `useFormStatus` won’t track that—use `useTransition`/state instead.

---

## **Building the Guest's Reservations Page**

### **1. The Goal**

The objective is to create a route (likely `/account/reservations`) that displays a list of all reservations—both past and future—belonging specifically to the currently logged-in user.

### **2. Data Fetching Strategy**

The critical challenge here is fetching the *correct* data. You cannot simply fetch "all bookings" from the database; you need to filter them by the current user.

* **The Chain of Requests:**
1. **Get Session:** Call `auth()` to identify the logged-in user.
2. **Identify Guest:** The session contains the user's *email*, but the bookings table is linked via the *guest ID*. You must query your `guests` table using the email to retrieve the `guestId`.
3. **Fetch Bookings:** Create/call a specific function (e.g., `getBookings(guestId)`) that returns only the reservations associated with that ID.



### **3. Handling Empty States**

The UI handles the scenario where a user has no history.

* **Logic:** Check the length of the `bookings` array.
* **If Empty:** Render a helpful message with a link to the Cabins page to encourage them to start exploring.
* **If Not Empty:** Render the list of reservations.

### **4. Component Structure (`ReservationList`)**

Instead of rendering a massive list directly in the `page.js` file, the transcript recommends extracting the list logic into a separate component called `ReservationList`.

* **Purpose:** It accepts the `bookings` array as a prop and maps over it.
* **Item Rendering:** For each booking, it renders a `ReservationCard` component, passing the individual booking data to it.

### **5. Conditional UI Logic (Past vs. Future)**

A key UX detail implemented in the `ReservationCard` is handling "actions" like **Edit** and **Delete**.

* **The Rule:** Users should not be able to edit or delete a reservation that has already passed.
* **Implementation:** Inside the card, check if the `startDate` of the booking is in the past using a helper function (e.g., `isPast(startDate)`).
* **Result:**
* **Future Stays:** Render the "Edit" (Pencil icon) and "Delete" (Trash icon) buttons.
* **Past Stays:** Do not render these buttons, making the history read-only.

---

## 1. Server Action: `deleteReservation`

**`lib/actions.js`**

```js
"use server";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function deleteReservation(bookingId) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be logged in");
  }

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, guestId")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    throw new Error("Booking not found");
  }

  if (booking.guestId !== session.user.guestId) {
    throw new Error("You are not allowed to delete this booking");
  }

  await supabase.from("bookings").delete().eq("id", bookingId);

  revalidatePath("/account/reservations");
}
```

### Why this matters

* **Auth check** → prevents anonymous deletes
* **Ownership check** → prevents horizontal privilege escalation
* **Revalidation** → forces fresh data after mutation

This is the *security-critical* part of the lecture.

---

## 2. Client Component: `DeleteReservation`

**`components/DeleteReservation.jsx`**

```jsx
"use client";

import { useTransition } from "react";
import { deleteReservation } from "@/lib/actions";

function DeleteReservation({ bookingId }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    startTransition(() => {
      deleteReservation(bookingId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn btn-danger"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}

export default DeleteReservation;
```

### Key lecture takeaways reflected here

* ❌ **No direct `onClick={deleteReservation}`**
* ✅ Wrapped inside `startTransition`
* ✅ Local pending state without blocking the page
* ✅ Ready for `useOptimistic` in the next lecture

---

## 3. Mental Model (Exam / Interview Gold)

> **Server Actions are NOT trusted by default.**
> Every destructive action must re-check:
>
> **Who is calling it?**
> **Do they own the resource?**

Client checks ≠ security.
Server checks = security.

---

Perfect — this lecture is really about understanding **when `useFormStatus` stops working and why `useTransition` is the correct tool instead**.

Here’s a refined, production-ready breakdown with deeper intuition.

---

# Another Loading Indicator: The `useTransition` Hook

## 1️⃣ The Core Problem

`useFormStatus()` only works:

* ✅ Inside a `<form>`
* ✅ When the Server Action is attached to `action={serverAction}`

But in this case:

```jsx
<button onClick={handleDelete}>Delete</button>
```

There is **no form submission happening**.

So `useFormStatus()` has no context to subscribe to.

That’s why we need a different tool.

---

## 2️⃣ Why `useTransition` Works Here

`useTransition` is a **React 18 concurrency hook**.

It allows you to mark something as a **non-urgent state update** (a transition).

When you wrap your Server Action in `startTransition()`:

* React keeps the UI responsive
* React tracks the async work
* React exposes `isPending`
* Next.js integrates this seamlessly with Server Actions

So we get:

```js
const [isPending, startTransition] = useTransition();
```

* `isPending` → true while action runs
* `startTransition()` → wraps the async call

---

## 3️⃣ Full Clean Implementation

### ✅ Client Component

```jsx
"use client";

import { useTransition } from "react";
import { deleteReservation } from "@/lib/actions";
import SpinnerMini from "./SpinnerMini";
import { TrashIcon } from "@heroicons/react/24/outline";

function DeleteReservation({ bookingId }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    startTransition(() => {
      deleteReservation(bookingId);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 text-red-600"
    >
      {!isPending ? (
        <>
          <TrashIcon className="w-5 h-5" />
          <span>Delete</span>
        </>
      ) : (
        <SpinnerMini />
      )}
    </button>
  );
}

export default DeleteReservation;
```

---

## 4️⃣ Why You Can’t Call the Action Directly

❌ This is wrong:

```jsx
onClick={() => deleteReservation(bookingId)}
```

Because:

* React doesn’t treat it as a transition
* You get no pending state
* UI feedback becomes difficult
* You lose concurrency benefits

Instead:

```jsx
startTransition(() => {
  deleteReservation(bookingId);
});
```

This tells React:

> “This update may take time — treat it as background work.”

---

## 5️⃣ What Happens Internally

1. User clicks delete
2. `startTransition()` marks work as low priority
3. Server Action executes
4. `isPending` becomes `true`
5. Button re-renders with spinner
6. Server finishes
7. Cache revalidates
8. UI updates
9. `isPending` becomes `false`

---

## 6️⃣ Mental Model: When to Use What

| Scenario                       | Use                                   |
| ------------------------------ | ------------------------------------- |
| `<form action={serverAction}>` | `useFormStatus()`                     |
| Button with `onClick`          | `useTransition()`                     |
| Navigation                     | `useTransition()` (built-in)          |
| Optimistic UI                  | `useOptimistic()` + `useTransition()` |

---

## 7️⃣ Important Subtlety (Advanced Insight)

`useTransition` does **not** make the server action faster.

It changes:

* React scheduling
* Rendering priority
* UI responsiveness

That’s why it’s called a **concurrent feature**, not a loading hook.

The loading state is just a convenient side effect.

---

## 8️⃣ How This Connects to the Next Lecture

In the next step, you’ll combine:

```js
useOptimistic()
+
useTransition()
```

Which gives you:

* Immediate UI removal (optimistic)
* Background server confirmation
* Automatic rollback on error

That’s when the UX becomes truly smooth.

---

# Final Summary

✔ `useFormStatus` → only works in forms
✔ `useTransition` → for button-triggered Server Actions
✔ Wrap Server Actions inside `startTransition()`
✔ Use `isPending` to render spinners
✔ Keeps UI responsive during async work

---

# Updating a Reservation

# 1️⃣ Folder Structure

You create:

```
app/account/reservations/edit/[bookingId]/page.js
```

This is a **dynamic route** using `bookingId`.

---

# 2️⃣ Step A — Server Page Component

This page must:

* Extract `bookingId` from `params`
* Fetch booking
* Fetch cabin (for maxCapacity)
* Pass data to a Client Form

---

### 📄 `app/account/reservations/edit/[bookingId]/page.js`

```js
import { notFound } from "next/navigation";
import { getBooking, getCabin } from "@/lib/data-service";
import UpdateReservationForm from "@/components/UpdateReservationForm";

export default async function Page({ params }) {
  const { bookingId } = params;

  const booking = await getBooking(bookingId);
  if (!booking) notFound();

  const cabin = await getCabin(booking.cabinId);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Edit Reservation #{booking.id}
      </h2>

      <UpdateReservationForm
        booking={booking}
        maxCapacity={cabin.maxCapacity}
      />
    </div>
  );
}
```

---

## Why This Is a Server Component

* It fetches secure data
* No client JS needed here
* Cleaner separation of concerns

---

# 3️⃣ Step B — Client Form Component

This component:

* Renders form
* Generates guest dropdown dynamically
* Uses `useFormStatus` for loading
* Submits to a Server Action

---

### 📄 `UpdateReservationForm.jsx`

```jsx
"use client";

import { updateBooking } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

function UpdateReservationForm({ booking, maxCapacity }) {
  const { id, numGuests, observations } = booking;

  return (
    <form action={updateBooking}>
      <input type="hidden" name="bookingId" value={id} />

      <div className="mb-4">
        <label className="block mb-1">Number of guests</label>
        <select
          name="numGuests"
          defaultValue={numGuests}
          className="border px-3 py-2 w-full"
        >
          {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>
              {n} guest{n > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block mb-1">Observations</label>
        <textarea
          name="observations"
          defaultValue={observations}
          className="border px-3 py-2 w-full"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

export default UpdateReservationForm;
```

---

# 4️⃣ Submit Button with `useFormStatus`

This only works because it is **inside a form**.

---

### 📄 `SubmitButton.jsx`

```jsx
"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-primary text-white px-4 py-2"
    >
      {pending ? "Updating..." : "Update Reservation"}
    </button>
  );
}

export default SubmitButton;
```

---

# 5️⃣ Step C — Server Action

This is where security matters most.

---

### 📄 `lib/actions.js`

```js
"use server";

import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateBooking(formData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("You must be logged in");
  }

  const bookingId = formData.get("bookingId");
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations");

  // 1️⃣ Fetch booking for ownership check
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, guestId")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 2️⃣ Ownership verification
  if (booking.guestId !== session.user.guestId) {
    throw new Error("You are not allowed to update this booking");
  }

  // 3️⃣ Perform update
  await supabase
    .from("bookings")
    .update({
      numGuests,
      observations,
    })
    .eq("id", bookingId);

  // 4️⃣ Revalidate affected pages
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  // 5️⃣ Redirect back to list
  redirect("/account/reservations");
}
```

---

# 🔐 Critical Security Insight

Never trust:

```js
bookingId
numGuests
```

From the client.

Always:

1. Authenticate
2. Fetch booking
3. Verify ownership
4. THEN mutate

This prevents:

* Horizontal privilege escalation
* Malicious form tampering
* Manual API calls

---

# 🧠 Architecture Flow

1. User clicks Edit
2. Dynamic route loads
3. Server fetches booking + cabin
4. Form renders with defaults
5. User edits
6. Form submits to Server Action
7. Server verifies ownership
8. Updates DB
9. Revalidates cache
10. Redirects to reservations list

---

# 🎯 Why Only Guests + Observations?

Because:

* Changing dates → recalculating availability
* Changing cabin → new pricing logic
* Changing price → business rule violation

Those require full booking recreation logic.

This challenge teaches:

> “Editing” ≠ “Rebuilding booking logic”

---

# 📌 What You Just Mastered

* Dynamic routes
* Secure server mutations
* Form-based Server Actions
* `useFormStatus`
* Cache revalidation
* Post-mutation redirect
* Ownership validation patterns

---
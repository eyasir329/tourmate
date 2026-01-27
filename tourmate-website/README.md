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

## The Core Principle Behind This Lecture

> **Fetch data as low in the tree as possible — but no lower than necessary.**

Everything in this lecture flows from that rule.

---

## 1. Why Strategy 1 Feels “Correct” but Is Actually Wrong

Fetching everything in `page.js` looks clean:

```js
await Promise.all([
  getCabin(id),
  getSettings(),
  getBookedDatesByCabinId(id)
]);
```

From a *data* perspective:

* ✅ Parallel
* ✅ Simple
* ✅ No duplication

From a *rendering* perspective:

* ❌ Catastrophic for UX

### The Key Problem: Server Components Are Blocking

A Server Component:

* **Does not render progressively**
* **Waits for *all* awaited data**
* **Blocks HTML streaming**

So even though:

* `getCabin()` = 100ms
* `getSettings()` = 5s

The user sees **nothing** for 5 seconds.

This violates the golden UX rule:

> *Fast data should never wait for slow data.*

---

## 2. Strategy 2: Granular Fetching Enables Streaming

Moving slow data into `<Reservation />` changes everything.

### What Actually Happens Now

1. `Page.js` fetches **only fast cabin data**
2. HTML for cabin title, image, description starts streaming immediately
3. `<Reservation />` is rendered **later**, when its data is ready

This unlocks:

* Streaming
* Suspense boundaries
* Partial page rendering

Even though everything is still a **Server Component**, the experience feels “client-like”.

---

## 3. Why `<Reservation />` Is the Correct Fetch Boundary

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

## 4. The Correct Solution: Fetch in the Nearest Common Parent

`<Reservation />` is:

* The **lowest common ancestor**
* The **smallest blocking boundary**
* The **logical domain owner** of reservation logic

So it becomes the data-fetching hub:

```js
const [settings, bookedDates] = await Promise.all([
  getSettings(),
  getBookedDatesByCabinId(cabinId)
]);
```

Then:

* `settings + bookedDates` → `<DateSelector />`
* `settings` → `<ReservationForm />`

This keeps:

* Fetching centralized
* UI decoupled
* Performance optimal

---

## 5. Why This Architecture Scales Beautifully

This pattern gives you:

### ✅ Progressive Rendering

Fast cabin content renders immediately.

### ✅ No Waterfalls

Parallel fetching at each level.

### ✅ No Overfetching

Each component fetches exactly what it owns.

### ✅ Clean Ownership

* Page = routing + layout
* Reservation = reservation domain
* Children = presentation + interaction

---

## 6. The Big Picture Mental Model

Think in **data islands**:

* The page is not one data island.
* Each slow feature is its own island.
* Islands stream independently.

> **Pages orchestrate.
> Sections fetch.
> Children consume.**

---

## Final Rule of Thumb (From the Lecture)

> **If multiple components need the same data, fetch it once in their closest shared parent — but never higher than needed.**

That single sentence explains:

* This lecture
* The previous Server/Client composition lecture
* And 90% of App Router performance decisions

---
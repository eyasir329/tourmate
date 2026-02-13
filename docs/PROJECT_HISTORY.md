# Project History (from Git commits)

This document is a curated, readable timeline of how **Tourmate (The Wild Oasis customer site)** evolved, based on the commit history on `main`.

The repo’s commits read like a build log / learning journal. To keep this “proper documentation” useful, the timeline is grouped into phases and ends with a complete commit index.

## Timeline

### 1) Early prototyping: SSR + hydration fundamentals (2025-12-30 → 2025-12-31)

Work started with manual server rendering + client hydration experiments before moving fully into Next.js.

- **frontend work started** → initial UI experimentation
- **manual_ssr with react-dom and nodejs** → server-render output manually
- **manual hydration** → hydrate client-side behavior

### 2) Next.js App Router foundations (2025-12-31 → 2026-01-01)

Introduced Next.js, created the project structure, then implemented the first routes/layout/data fetching.

- Next.js introduction + project setup
- Pages/routes + navigation
- Root layout + basic page-level data fetching
- First Client Components + loading spinner
- Notes/overview around SSR + RSC concepts

### 3) Planning + styling baseline (2026-01-02 → 2026-01-03)

Moved from “just working” to “structured and styled”.

- Project organization/planning
- Tailwind CSS styling
- Metadata, favicon, fonts, and image optimization
- Homepage + About page
- Nested routes and nested layout under `/account`

### 4) Supabase + cabins + streaming UI (2026-01-03 → 2026-01-10)

Added a real backend (Supabase) and built out the core cabin experience.

- Supabase client setup + data reads
- Cabin listing and cabin details page (dynamic route segments)
- Streaming route segments with `loading.js` and React Suspense
- Dynamic metadata generation

### 5) Error handling + rendering strategies (2026-01-19 → 2026-01-26)

Hardened UX and explored Next.js rendering tradeoffs.

- Error boundaries and “not found” handling
- Static vs dynamic rendering, SSG, caching, ISR, partial pre-rendering

### 6) Client/server interactions + reservations architecture (2026-01-26 → 2026-01-27)

Built out richer interactivity patterns that are common in the App Router.

- Bridging client + server concerns
- Highlighting the current side nav route
- Sharing state via URL
- Reservation data-fetching strategies
- Context API introduced for state management
- Route Handlers API endpoint added

### 7) Authentication + route protection (2026-01-27 → 2026-01-31)

Introduced Auth.js (NextAuth v5) with Google OAuth and protected account routes.

- Auth setup and session retrieval
- Middleware-based route protection
- Custom sign-in and sign-out UX
- “Guest sync” in Supabase: create a guest row on first sign-in

### 8) Mutations via Server Actions (2026-01-31 → 2026-02-14)

Added “real app” flows: profile updates and reservation CRUD with modern UX primitives.

- Server Actions overview + details
- Profile updates
- Manual cache revalidation
- Loading indicators via `useFormStatus`
- Reservations: create, update, delete
- Transition + optimistic UI patterns (`useTransition`, `useOptimistic`)
- Date selector improvements

### 9) Deployment preparation + final cleanup (2026-02-14)

Prepared for deployment and reorganized customer site layout/structure.

---

## Commit index (complete)

<details>
<summary>Show all commits (oldest → newest)</summary>

| Date | Hash | Summary |
| --- | --- | --- |
| 2026-02-14 | b72d4efa | Initial commit |
| 2025-12-30 | 97809a5d | frontend work started |
| 2025-12-30 | 88d56f37 | manual_ssr with react-dom and nodejs |
| 2025-12-31 | 615afd93 | manual hydration |
| 2025-12-31 | 3e980218 | nextjs introduction |
| 2025-12-31 | e368377d | before setting up nextjs project |
| 2025-12-31 | f424c931 | next.js project setup |
| 2025-12-31 | 190e0eae | create pages and routes |
| 2025-12-31 | 95de89e0 | navigating between pages |
| 2025-12-31 | 3c96eb35 | creating a layout |
| 2026-01-01 | d2ffa694 | fetching data in a page |
| 2026-01-01 | 3ec7f221 | adding interectivity with client components |
| 2026-01-01 | 4aeb2084 | add loading spinner |
| 2026-01-01 | e70b8a5b | overview of SSR & RSC |
| 2026-01-02 | 14233b5f | before starting the project |
| 2026-01-02 | e74b171b | project planning and organization |
| 2026-01-02 | ee8b1f57 | styling with tailwind css |
| 2026-01-02 | e04d99a5 | add metadata & favicon |
| 2026-01-02 | 07664e4d | optimizing fonts |
| 2026-01-03 | 004de2a5 | improving navigation and root layout |
| 2026-01-03 | 509aa9d8 | image optimization |
| 2026-01-03 | cdf548ef | building the homepage |
| 2026-01-03 | 16f86ab3 | building about page |
| 2026-01-03 | f5a4fac1 | add nested routes & pages |
| 2026-01-03 | 059f0684 | add nested layout |
| 2026-01-03 | f1d54c8f | before data fetching |
| 2026-01-03 | 214d3e74 | supabase setup |
| 2026-01-03 | 9c7c2746 | fetching and displaying cabins |
| 2026-01-03 | 18e5628c | streaming route segments with loading.js |
| 2026-01-07 | f5d843f2 | introduction to react suspense |
| 2026-01-07 | d08bb56a | streaming ui with react suspense |
| 2026-01-07 | 79f2e247 | dynamic route segments - building the cabin page |
| 2026-01-10 | e95945e4 | generate dynamic metadata |
| 2026-01-19 | ff40ab2c | error handling setting |
| 2026-01-20 | a2db6843 | error handling not found |
| 2026-01-20 | 26b39558 | different types oof SSR static vs dynamic rendering |
| 2026-01-20 | 1c37f273 | analyzing rendering |
| 2026-01-20 | 5b1f5666 | dynamic to static with generateStringParams |
| 2026-01-20 | 665247fa | static side generation(SSG) |
| 2026-01-23 | 850f10f4 | partial pre-rendering |
| 2026-01-23 | 9d8e0d64 | how nextjs caches dara |
| 2026-01-26 | 37ca83f8 | experimenting with cashing and ISR |
| 2026-01-26 | 0ec90c5a | before client and server interactions |
| 2026-01-26 | 4cb7eb48 | blurring the boundary between server and client |
| 2026-01-26 | 70e9e7f5 | client components in server components |
| 2026-01-26 | 6c69237a | highlighting current side navigation link |
| 2026-01-27 | 3f9a3548 | sharing state between client and server using url |
| 2026-01-27 | 05f6a8af | advanced server components in client components |
| 2026-01-27 | b415ba0c | data fetching strategies for the reservation section |
| 2026-01-27 | 9b64ad81 | using the context api for state management |
| 2026-01-27 | cae005bb | creating an API endpoint with route handlers |
| 2026-01-27 | aa36d112 | before go to nextauth |
| 2026-01-27 | 3a4c93b4 | authentication started |
| 2026-01-27 | 186dd111 | setting up NextAuth |
| 2026-01-27 | 5834e011 | getting the user session |
| 2026-01-31 | 4a615745 | middleware in nextjs |
| 2026-01-31 | 390fc991 | protecting routes with nextauth middleware |
| 2026-01-31 | 8db638c1 | building a custom sign in page |
| 2026-01-31 | 5759cc36 | building a custom signout button |
| 2026-01-31 | 68946475 | creating a new guest on first sign in |
| 2026-01-31 | b46a8e15 | before go to mutations with server actions |
| 2026-01-31 | 88940bd7 | interactivity and mutation overview |
| 2026-01-31 | b39bca46 | server actions details |
| 2026-02-02 | 364f8fbe | updating the profile using server actions |
| 2026-02-02 | 5b1d81bd | manual cache revalidation |
| 2026-02-04 | 6a8ff88f | loading indicator using useFormStatusHook |
| 2026-02-04 | 4243decb | building the reservation page |
| 2026-02-10 | ecc1a7f0 | delete reservation |
| 2026-02-13 | 2074c203 | useTransition Hooks |
| 2026-02-13 | 757e59d9 | updating reservation |
| 2026-02-13 | 6422d117 | removing reservations immediately using useOptimistic hooks |
| 2026-02-14 | db037607 | updating date selector |
| 2026-02-14 | 5d6b0c5b | creating a new reservation |
| 2026-02-14 | 3ac8e32e | before deploying |
| 2026-02-14 | 4c8b58ae | rearrange customer site |
| 2026-02-14 | 48f3fc15 | before deployment ready |

</details>

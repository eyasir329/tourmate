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

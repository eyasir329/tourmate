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
- [Interactivity & mutations](#interactivity--mutations)
  - [Concepts](#concepts)
  - [Server Actions 101](#server-actions-101)
  - [Caching & revalidation](#caching--revalidation)
  - [UX hooks](#ux-hooks)
  - [Feature walkthroughs](#feature-walkthroughs)

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

## Interactivity & mutations

This app uses Next.js App Router + Server Actions to handle mutations (create/update/delete) without building separate REST endpoints for every form.

### Concepts

- **Mutations live on the server**: Server Actions run in a trusted environment, so they’re the right place for authorization and DB writes.
- **Never trust client input**: validate and normalize numbers/dates/strings before inserting or updating.
- **UI freshness is explicit**: after a mutation, revalidate the routes that render the changed data.

### Server Actions 101

Server Actions are async functions marked with `"use server"` (see `app/_lib/actions.js`). You can call them from forms or from Client Components.

Typical pattern:

1. Read data from `formData`
2. Get the current user/session (`auth()`)
3. Validate/normalize
4. Write to Supabase
5. `revalidatePath()` (and often `redirect()`)

### Caching & revalidation

In the App Router, data can be cached at multiple layers. If you mutate data and the UI doesn’t update, it usually means the route that renders that data wasn’t revalidated.

Common approach after a booking mutation:

- `revalidatePath('/account/reservations')` to refresh the reservations list
- `revalidatePath(`/cabins/${cabinId}`)` to refresh availability/calendar
- `redirect('/account/reservations')` to take the user back to the updated view

### UX hooks

| Hook | Best for | What it changes |
| --- | --- | --- |
| `useFormStatus` | Pending state for a `<form>` action | Disables buttons, shows loading state |
| `useTransition` | Running async work without blocking UI | Marks state updates as non-urgent |
| `useOptimistic` | Immediate UI updates before server confirms | Great for “feels instant” deletes/edits |

### Feature walkthroughs

- **Create a booking**
  - UI: `app/_components/ReservationForm.js` submits a form to `createBooking`.
  - State: selected dates come from `app/_components/ReservationContext.js`.
  - Server: `createBooking` in `app/_lib/actions.js` validates inputs, inserts into `bookings`, then revalidates and redirects.

- **Update a reservation**
  - Server: `updateReservation` in `app/_lib/actions.js` validates inputs and updates the booking.

- **Delete a reservation**
  - UI: `app/_components/ReservationList.js` triggers deletion.
  - Server: `deleteBooking` in `app/_lib/actions.js` should enforce ownership on the delete query (not just client checks).

On the server, always validate and normalize inputs (dates, numbers), then insert and revalidate.


Here’s a **complete, production-ready deployment guide** for **The Wild Oasis** using Vercel and GitHub — including the critical authentication configuration with Google Cloud Console.

---

# 🚀 Deploying *The Wild Oasis* to Production

## 1️⃣ Push the Project to GitHub

Before deployment, your code must live in a remote repository.

### (Optional) Reset Git

If your project was bootstrapped with `create-next-app`, it may already contain a `.git` folder. You can delete it to start fresh (optional).

### Initialize & Commit

```bash
git init
git status
git add .
git commit -m "first commit"
```

### Create a GitHub Repository

1. Go to GitHub.
2. Create a **Private** repository (e.g. `the-wild-oasis-website`).
3. Copy the push commands provided by GitHub.

Example:

```bash
git branch -M main
git remote add origin https://github.com/<your-username>/the-wild-oasis-website.git
git push -u origin main
```

Your project is now hosted on GitHub.

---

# 2️⃣ Deploy with Vercel

Since this is a Next.js application, Vercel is the ideal deployment platform.

### Import the Project

1. Log in to Vercel.
2. Click **Add New → Project**
3. Import your GitHub repository.

### Configure the Project

* **Framework Preset:** Ensure **Next.js** is selected.
* **Root Directory:** Leave default unless your app is inside a subfolder.

---

## 🔐 Environment Variables (Critical Step)

Expand **Environment Variables** during setup.

Copy the entire content of your local:

```
.env.local
```

Paste it directly into Vercel’s environment variable input.

Vercel will automatically parse:

```
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

Then click **Deploy**.

---

# 3️⃣ Fix Authentication in Production

After deployment, login may fail or redirect to:

```
localhost:3000
```

This happens because your auth credentials still reference your local environment.

---

## ✅ Step A: Update Vercel Environment Variables

1. Copy your **Production URL** from Vercel, for example:

```
https://the-wild-oasis-website.vercel.app
```

2. Go to:

```
Vercel → Project → Settings → Environment Variables
```

3. Update:

```
NEXTAUTH_URL
```

Change it from:

```
http://localhost:3000
```

To:

```
https://the-wild-oasis-website.vercel.app
```

Save and **Redeploy**.

---

## ✅ Step B: Update Google OAuth Credentials

Now update OAuth settings in Google Cloud Console.

### Navigate to:

```
APIs & Services → Credentials
```

Select your **OAuth 2.0 Client ID**.

---

### Add Authorized JavaScript Origins

Add:

```
https://the-wild-oasis-website.vercel.app
```

---

### Add Authorized Redirect URI

Add:

```
https://the-wild-oasis-website.vercel.app/api/auth/callback/google
```

Save changes.

---

# 🔄 Redeploy

Return to Vercel and trigger a redeploy if necessary.

Your Google login will now:

* Redirect to Google
* Authenticate successfully
* Redirect back to your production domain
* Create a valid session

---

# 🧠 What’s Actually Happening?

Authentication providers (like Google) must:

1. Know where your app lives
2. Know which URLs are allowed to receive callbacks

If they don’t match exactly, OAuth fails.

That’s why:

* `NEXTAUTH_URL`
* Authorized Origins
* Authorized Redirect URIs

must all match your production domain exactly.

---

# 🎉 Final Result

You now have:

✅ Code hosted on GitHub
✅ Continuous deployment via Vercel
✅ Production environment variables configured
✅ Working Google OAuth in production
✅ A publicly accessible Wild Oasis website

---
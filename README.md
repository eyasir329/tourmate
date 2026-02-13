# Tourmate Website

Customer-facing site for Tourmate (It's a learning project), built with Next.js 14 (App Router), Tailwind CSS, Supabase, and Auth.js (NextAuth v5 beta).

This README is the entry point (run locally + where to find docs). Longer guides live in `docs/`.

Live:  <https://tourmate-iota.vercel.app/>

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
- [Project history](#project-history)
- [Documentation](#documentation)

## Getting started

### Requirements

- Node.js 18+ (recommended)
- npm

### Quick start

    npm install
    npm run dev

Then open <http://localhost:3000>

### Environment variables

Create `.env.local` in the project root.

Auth.js (Google OAuth):

  AUTH_GOOGLE_ID="..."
  AUTH_GOOGLE_SECRET="..."
  AUTH_SECRET="..."

# Optional locally; recommended in production

  AUTH_URL="<http://localhost:3000>"

Supabase:

  SUPABASE_URL="<https://YOUR_PROJECT.supabase.co>"
  SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"

Note: keep keys server-side. Never expose Supabase service role keys to the browser.

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

## Authentication

Auth.js configuration + flows are documented in:

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

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

---

## Project history

This repo’s development timeline (derived from the full git commit history) lives here:

- [docs/PROJECT_HISTORY.md](docs/PROJECT_HISTORY.md)

## Documentation

Long-form docs live in `docs/`:

- [docs/README.md](docs/README.md)
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

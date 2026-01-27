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

## Authentication in a Real Next.js App

This section is about one thing:

> **Teaching you a reusable, production-ready authentication recipe**

Not theory. Not demos. A pattern you’ll reuse again and again.

---

## **1. Why Authentication Is the Core Feature**

Authentication is described as *mandatory* for real-world apps because it enables:

* Personal dashboards
* Bookings, payments, saved data
* Permissions and access control
* Secure mutations (create / update / delete)

Without auth:

* Your app is just a brochure
* Anyone can do anything

With auth:

* Users become **stateful entities**
* The server can make **trusted decisions**

---

## **2. Auth.js (NextAuth) — Why This Library**

### What it gives you **out of the box**

* OAuth (Google, GitHub, etc.)
* Secure sessions
* Cookie handling
* CSRF protection
* Token management

### Why not roll your own?

Because authentication is:

* Easy to get *mostly* right
* Hard to get *fully* secure

Auth.js is:

* Battle-tested
* Maintained
* Deeply integrated with Next.js App Router

> 💡 The rename from **NextAuth → Auth.js** matters conceptually:
> it’s no longer “just” a Next.js plugin — it’s a general auth framework.

---

## **3. Supabase — Where Users Actually Live**

Auth.js:

* Handles **authentication** (who you are)

Supabase:

* Handles **persistence** (who you are *in the database*)

### The flow you’ll implement:

1. User logs in with Google
2. Auth.js verifies identity
3. Supabase:

   * Creates a user record if one doesn’t exist
   * Stores app-specific user data (role, bookings, etc.)

This separation is intentional and **correct architecture**.

---

## **4. Providers — Why Google Login Matters**

Using Google is not about convenience — it teaches you:

* OAuth flow
* Third-party identity providers
* Multi-provider extensibility

Once you understand Google:

* GitHub
* Facebook
* Email/password
* Magic links

…all become trivial.

---

## **5. Authentication vs Authorization (Critical Distinction)**

### Authentication

> “Who are you?”

Handled by:

* Auth.js
* Sessions
* Cookies

### Authorization

> “What are you allowed to do?”

Handled by:

* **Next.js Middleware**
* Route protection
* Role checks

The course explicitly separates these — **this is a big green flag**.

---

## **6. Middleware — Why It’s Used for Authorization**

Middleware runs:

* Before the request reaches a page
* On every navigation
* On the server (or edge)

This allows:

* Redirect unauthenticated users
* Block access to protected routes
* Enforce role-based access

Example conceptually:

```txt
User → /account
 ├─ logged in? → allow
 └─ not logged in? → redirect /login
```

This is:

* Centralized
* Declarative
* Impossible to bypass via client-side hacks

---

## **7. What You’re Really Learning (The “Recipe”)**

By the end of this section, you’ll know how to:

1. Configure Auth.js in App Router
2. Connect OAuth providers
3. Sync authenticated users with Supabase
4. Access sessions in:

   * Server Components
   * Client Components
5. Protect routes using middleware
6. Build auth-aware UI (login/logout buttons)
7. Secure mutations and API access

This is **transferable knowledge**, not project-specific code.

---

## **8. How This Fits With Previous Sections**

This section builds directly on what you already learned:

* **Server vs Client boundaries**
* **URL state vs Context**
* **Route Handlers vs Server Actions**
* **Server Components data fetching**

Auth touches *all of them*.

Once auth is added:

* Server Components become *personalized*
* Data fetching becomes *user-scoped*
* Mutations become *secure*

---

## **9. Mental Model to Carry Forward**

Think of authentication as:

> 🧠 “A global server-side truth about the user”

And authorization as:

> 🛡️ “Rules enforced before the UI even exists”

That’s why:

* Auth lives on the server
* Middleware guards routes
* Client only *reflects* auth state

---

## **10. Why This Section Is a Big Deal**

After this section:

* You’re no longer building demos
* You’re building **applications**
* You can confidently add auth to:

  * SaaS apps
  * Dashboards
  * Booking systems
  * Admin panels

This is one of the **most valuable sections** in the entire course.

---
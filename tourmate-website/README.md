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

## **Setting Up NextAuth (Auth.js) in Next.js App Router**

This lecture is about **bootstrapping authentication correctly** in the App Router world — no hacks, no legacy patterns.

---

## **1. Why NextAuth v5 (Beta) Matters**

### What changed in v5

* Built **specifically** for the App Router
* Uses **Web APIs** instead of Node-only APIs
* Integrates cleanly with:

  * Server Components
  * Server Actions
  * Route Handlers
  * Middleware

> ⚠️ v4 patterns (`pages/api/auth`) are **not compatible** with App Router best practices.

That’s why the course explicitly installs:

```bash
npm install next-auth@beta
```

You’re opting into the **future-proof** API.

---

## **2. The Heart of Auth.js: `auth.js` (Root-Level)**

### Why this file exists

In v5, **all auth configuration lives in one place** — not scattered across API routes and helpers.

📍 **Location**

```
/auth.js   ← project root (NOT inside /app)
```

### What happens in this file

* You define providers
* You initialize Auth.js
* You export utilities used everywhere else

---

### **Minimal Working Setup**

```js
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],
});
```

### What each export is used for

| Export     | Purpose                                   |
| ---------- | ----------------------------------------- |
| `auth`     | Read the session in **Server Components** |
| `handlers` | Plug into API Route Handlers              |
| `signIn`   | Server Action to trigger login            |
| `signOut`  | Server Action to trigger logout           |

> 💡 This design eliminates helper boilerplate you had to write manually in v4.

---

## **3. Exposing Auth Routes with Route Handlers**

Auth.js **does not automatically create routes** — you must explicitly expose them.

### Required Path

```
app/api/auth/[...nextauth]/route.js
```

This is a **catch-all route**, meaning:

* `/api/auth/signin`
* `/api/auth/callback/google`
* `/api/auth/signout`
* etc.

…are all handled by this single file.

---

### **Implementation (Dead Simple)**

```js
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

That’s it.

Why this works:

* Auth.js already defines the logic
* You’re just wiring it into Next.js routing

---

## **4. Google OAuth — The Only “External” Setup**

Authentication always requires **trusting an identity provider**. Here, that’s Google.

---

### **OAuth Consent Screen**

* User type: **External**
* Required fields:

  * App name
  * Support email
  * Developer contact email

This is not optional — Google blocks OAuth without it.

---

### **OAuth Credentials**

Create a **Web Application** client.

#### 🚨 Critical Redirect URI

```txt
http://localhost:3000/api/auth/callback/google
```

Why this exact URL?

* Auth.js expects this path
* Google must explicitly whitelist it
* Any mismatch = authentication failure

> 🔁 When deploying, you must add the **production domain** version too.

---

## **5. Environment Variables (Strict Naming Rules)**

Auth.js v5 **auto-detects** environment variables — but **only** if named exactly right.

### Required `.env.local` entries

```env
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_SECRET=some_random_string
```

### Generating `AUTH_SECRET`

```bash
openssl rand -base64 32
```

### Why names matter

Auth.js scans for:

* `AUTH_<PROVIDER>_ID`
* `AUTH_<PROVIDER>_SECRET`

❌ `GOOGLE_CLIENT_ID` → ignored
✅ `AUTH_GOOGLE_ID` → detected

This is one of the **most common failure points**.

---

## **6. Testing Without Writing Any UI**

One of the best parts of Auth.js is **instant validation**.

### Manual Test

Visit:

```
http://localhost:3000/api/auth/signin
```

### Expected behavior

* Auth.js-generated login page
* “Sign in with Google” button
* Full OAuth flow
* Redirect back to your app

If this works:
✅ Providers configured correctly
✅ Route handler wired
✅ Environment variables detected

---

## **7. Architectural Takeaways (Important)**

### What this setup gives you immediately

* Secure authentication
* Session handling
* OAuth integration
* Server-side session access
* Zero custom auth logic

### What it does *not* yet do

* Protect routes
* Sync users with Supabase
* Handle authorization rules
* Customize UI

Those come **next**, and now you have the foundation to do them *cleanly*.

---

## **Mental Model to Keep**

Think of Auth.js as:

> 🧠 **A session engine that lives on the server**
> 🎛️ Controlled via Server Actions
> 🌍 Exposed via Route Handlers
> 🔐 Backed by trusted OAuth providers

Everything else in the app **reacts to that truth**.

---
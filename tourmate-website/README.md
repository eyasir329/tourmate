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

## **Getting the User Session & Protecting Routes (Auth.js v5)**

This lesson answers two fundamental questions:

1. **Who is the current user?** → Authentication
2. **Are they allowed to be here?** → Authorization

---

## **1. Retrieving the User Session (Authentication)**

### The key idea

With Auth.js v5, **you fetch the session directly inside Server Components** — no API calls, no hooks, no context.

### Why this is possible

* Server Components run on the server
* `auth()` is a **server-only function**
* So you can `await` it like a database call

---

### **Canonical Pattern**

```js
import { auth } from "@/auth";

export default async function Navigation() {
  const session = await auth();
}
```

### What `auth()` returns

| Case            | Value            |
| --------------- | ---------------- |
| User logged in  | `Session` object |
| User logged out | `null`           |

### Session structure (simplified)

```js
{
  user: {
    name: "John Doe",
    email: "john@gmail.com",
    image: "https://lh3.googleusercontent.com/..."
  },
  expires: "2026-01-01T12:00:00Z"
}
```

This data comes **directly from the OAuth provider** (Google in this case).

---

## **2. Using the Session to Customize UI**

Once you have the session, rendering logic becomes trivial.

### Typical Pattern

```jsx
{session?.user?.image ? (
  <img
    src={session.user.image}
    alt={session.user.name}
    referrerPolicy="no-referrer"
  />
) : (
  <Link href="/login">Guest Area</Link>
)}
```

### Why `referrerPolicy="no-referrer"` matters

Google-hosted images often **block requests with referrer headers**, especially in production.
This attribute prevents broken avatars.

---

## **3. Authentication vs Authorization (Critical Distinction)**

| Concept            | Meaning               |
| ------------------ | --------------------- |
| **Authentication** | Who are you?          |
| **Authorization**  | Are you allowed here? |

Fetching the session solves **authentication**.
Protecting routes requires **authorization** → Middleware.

---

## **4. Middleware in Auth.js v5 (The Elegant Part)**

### Old mental model (v4)

* Custom middleware
* Manual redirects
* Token parsing
* Boilerplate

### New mental model (v5)

> **Auth.js itself *is* the middleware**

---

### **Minimal Middleware Setup**

```js
export { auth as middleware } from "@/auth";
```

That single line:

* Checks the session
* Handles redirects
* Integrates with Next.js routing
* Works at the **Edge**

No logic needed.

---

## **5. Route Protection with `matcher`**

Middleware runs on **every request** by default — which is unnecessary and slow.

### Solution: `matcher`

```js
export const config = {
  matcher: ["/account"],
};
```

### What this does

* Middleware only runs for `/account`
* All other routes bypass it
* Performance stays optimal

You can also do:

```js
matcher: ["/account/:path*"]
```

to protect nested routes.

---

## **6. Automatic Redirect Behavior (Zero Code)**

Auth.js middleware gives you **opinionated defaults**:

### Flow

1. User visits `/account`
2. Middleware intercepts
3. Session check runs
4. Result:

   * ✅ Logged in → request continues
   * ❌ Logged out → redirect to `/api/auth/signin`

You didn’t write **any redirect logic** — Auth.js handles it.

---

## **7. Why This Architecture Is Powerful**

### What you gain

* Server-first auth
* No client-side auth hacks
* No loading spinners for session
* Secure route protection
* Edge-compatible authorization

### What you avoid

* `useSession()` waterfalls
* Flash of unauthenticated content
* Client-only guards
* Duplicated logic

---

## **8. The Mental Model to Lock In**

> 🔐 **Authentication lives in Server Components**
> 🛂 **Authorization lives in Middleware**
> 🧠 **Auth.js connects both with one config**

This is the **canonical, production-grade Next.js auth setup** in 2025.

---

## **What is Middleware in Next.js**

![img](https://i.ibb.co.com/bRyYgFtm/Screenshot-from-2026-01-31-02-11-40.png)

### **1. What is Middleware?**

Middleware is a function that executes **before a request reaches a route handler or page component** in Next.js.

Think of it as a **gatekeeper** that sits between:

```
User Request → Middleware → Page / API Route → Response
```

Because it runs *before* rendering or data fetching, middleware is ideal for **early decision-making**—such as blocking, redirecting, or modifying requests.

---

### **2. How Middleware Works (Request Flow)**

When a user visits a route (for example, `/account`), the request is intercepted by middleware first.

At this stage, middleware can do one of four things:

#### **1. Allow the request to continue**

```js
NextResponse.next()
```

The request proceeds normally to the page or route handler.

---

#### **2. Redirect the user**

```js
NextResponse.redirect()
```

The user is sent to a **different URL**, and the browser URL changes
(e.g., redirecting unauthenticated users to `/login`).

---

#### **3. Rewrite the request**

```js
NextResponse.rewrite()
```

The user sees content from another route **without changing the URL**.

Common use cases:

* A/B testing
* Legacy URL support
* Locale-based routing

---

#### **4. Send a response directly**

```js
NextResponse.json()
```

Middleware can completely **short-circuit the request** and return a response without rendering any page.

---

### **3. Implementing Middleware**

#### **A. File Placement**

Middleware must follow strict conventions:

* **Filename:** `middleware.js` (or `middleware.ts`)
* **Location:**

  * Project root, **or**
  * Inside `src/` if your app uses a `src` directory

🚫 It **does not** go inside the `app/` folder.

---

#### **B. Basic Middleware Structure**

```js
import { NextResponse } from "next/server";

export function middleware(request) {
  return NextResponse.redirect(new URL("/about", request.url));
}
```

**Key points:**

* The function receives a `request` object
* `request.url` provides the full URL (used to build absolute redirects)
* `NextResponse` is used for redirects, rewrites, and responses

---

### **4. Route Matching (Critical for Performance)**

By default, middleware runs on **every request**, including:

* Images
* Fonts
* Static files
* API calls

This is inefficient.

To limit where middleware runs, use a **matcher configuration**.

```js
export const config = {
  matcher: ["/account", "/cabins"],
};
```

✅ Middleware will now run **only** for these routes
🚀 This significantly improves performance

---

### **5. Primary Use Case: Authorization**

The most common real-world use of middleware is **authentication & authorization**.

Instead of repeating login checks in every page:

* You check authentication **once** in middleware
* Unauthorized users are redirected immediately
* Authorized users proceed normally

This approach is:

* Cleaner
* More secure
* Easier to maintain
* Less error-prone

---

### **Mental Model to Remember**

> **Middleware = global, early, request-level logic**

If something should happen **before** a page loads
→ middleware is the right place

---

## **Protecting Routes With NextAuth Middleware**

### **1. The Goal: Protect Private Routes**

We want to restrict access to certain parts of the application—specifically the **Guest Area**—so that:

* ❌ **Unauthenticated users** cannot access routes under `/account`
* ✅ **Authenticated users** can access those routes normally

In short:

> `/account/*` should only be visible to logged-in users.

---

### **2. The Solution: NextAuth v5 Middleware**

NextAuth v5 makes this extremely simple.

Instead of writing custom middleware logic, we reuse the **`auth` configuration** we already set up.
That `auth` function can be exported **directly** as middleware.

This works because:

* `auth` already knows how to read the session
* It automatically handles redirects
* It appends callback URLs correctly

---

### **3. Implementation Steps**

---

### **Step A: Create the Middleware File**

* **File name:** `middleware.js` (or `middleware.ts`)
* **Location:**

  * Project root
  * Or inside `src/` if your app uses it

🚫 Do **not** place it inside the `app/` folder.

---

### **Step B: Export NextAuth as Middleware**

```js
// middleware.js
import { auth } from "@/auth";

export const middleware = auth;
```

That’s it.

No conditionals.
No manual redirects.
No session parsing.

NextAuth handles everything internally.

---

### **Step C: Configure the Matcher (Very Important)**

Without a matcher, the middleware would run on **every route**, including:

* Homepage
* Public pages
* Static assets

To limit protection to the Guest Area, define a matcher.

```js
export const config = {
  matcher: ["/account"],
};
```

✅ This protects:

* `/account`
* `/account/profile`
* `/account/reservations`
* Any nested route under `/account/*`

---

### **4. How It Works at Runtime**

Once configured, the behavior is automatic:

#### **1. Request Interception**

When a user visits `/account`, the middleware runs **before** the page loads.

---

#### **2. Session Check**

NextAuth checks whether a valid session exists.

* **If authenticated:**
  The request is allowed to continue.

* **If unauthenticated:**
  The user is redirected automatically.

---

#### **3. Redirect + Callback URL**

Unauthenticated users are redirected to:

```
/api/auth/signin?callbackUrl=/account
```

This is critical.

After the user logs in (e.g., with Google):

* NextAuth reads `callbackUrl`
* Redirects them **back to the original page**
* The user lands exactly where they intended

No extra logic required.

---

### **Why This Approach Is Ideal**

* ✅ Centralized authorization logic
* ✅ Zero duplication across pages
* ✅ Secure by default
* ✅ Works at the **Edge** (fast)
* ✅ Official NextAuth v5 pattern

---

### **Mental Model to Remember**

> **`auth` is not just configuration — it *is* middleware**

If a route must be protected:

* Add it to the matcher
* Let NextAuth handle the rest

---

## **Building a Custom Sign-In Page (NextAuth v5 + Server Actions)**

### **1. The Goal: A Better Sign-In UX**

By default, NextAuth ships with a very basic sign-in page at:

```
/api/auth/signin
```

While functional, it:

* Is unstyled
* Doesn’t match your app’s design
* Offers limited UX control

The goal is to **replace this page entirely** with a custom route such as:

```
/login
```

that integrates seamlessly with your application’s UI.

---

### **2. Telling NextAuth to Use Your Custom Page**

This is done inside your **`auth.js`** configuration.

#### **The `pages` Option**

NextAuth allows you to override built-in pages via the `pages` object.

```js
export const { auth, handlers, signIn, signOut } = NextAuth({
  // providers, callbacks, etc.
  pages: {
    signIn: "/login",
  },
});
```

#### **What This Changes**

* Middleware redirects unauthenticated users to `/login`
* Calling `signIn()` without arguments sends users to `/login`
* `/api/auth/signin` is no longer used for UI

NextAuth still handles authentication — you’re only replacing the **interface**.

---

### **3. Implementing Sign-In Using Server Actions**

In the App Router, the cleanest way to trigger authentication from a server component is with **Server Actions**.

---

### **A. The Constraint (Important)**

Server Components:

* ❌ Cannot use `onClick`
* ❌ Cannot attach client event handlers

So this will **not work**:

```jsx
<button onClick={signIn}>Sign in</button>
```

---

### **B. The Solution: Forms + Server Actions**

HTML forms can submit directly to **server functions**, which makes them perfect for authentication.

#### **Steps**

1. Import `signIn` from your NextAuth config
2. Create an async Server Action
3. Call `signIn(provider, options)`
4. Bind the action to a `<form>`

---

### **C. Example: Google Sign-In Button**

```js
import { signIn } from "@/auth";

export default function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/account" });
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
```

#### **What’s Happening Here**

* `"use server"` marks this function as a Server Action
* The form submission triggers the action
* `signIn("google")` starts the OAuth flow
* `redirectTo` defines where the user lands after login

No client JavaScript needed.

---

### **4. Avoiding the Infinite Redirect Trap**

This is a **very common pitfall**.

#### **The Problem**

If your middleware protects **every route**, including `/login`:

* User tries to visit `/login`
* Middleware sees they’re unauthenticated
* Middleware redirects them to `/login`
* 🔁 Infinite loop

---

### **The Fix: Exclude the Login Route**

Make sure `/login` is **not** part of your middleware matcher.

```js
// middleware.js
export const config = {
  matcher: ["/account", "/about"],
};
```

Unauthenticated users must be allowed to access `/login`.

---

### **Key Takeaways**

* `pages.signIn` replaces the default NextAuth UI
* Server Actions are the correct way to trigger auth in Server Components
* Forms replace `onClick` in the App Router
* Middleware must **not** protect the login page

---

### **Mental Model**

> **NextAuth handles auth logic — you control the UI**

Once you internalize that, custom auth flows become simple and predictable.

---

## **Building a Custom Sign-Out Button (NextAuth v5 + Server Actions)**

### **1. The Goal**

The goal is to create a reusable **Sign Out button** that:

* Can live anywhere (sidebar, navbar, dropdown)
* Securely terminates the user session
* Updates the UI back to the “Guest” state
* Uses **Server Actions** (no client-side handlers)

---

### **2. The Core Pattern (Same as Sign-In)**

Just like the custom Sign-In button:

* ❌ No `onClick`
* ❌ No client-side logic
* ✅ Use a **Server Action**
* ✅ Trigger it via a standard HTML `<form>`

This keeps authentication logic **server-only**, secure, and predictable.

---

### **3. Implementation Breakdown**

---

### **Step A: Define the Server Action**

Inside the component, define an async function and mark it as a Server Action.

**Key points:**

* `"use server"` is required
* Import `signOut` from your centralized `@/auth` file
* Optionally pass a redirect destination

---

### **Step B: Bind the Action to a Form**

* Attach the Server Action to the form’s `action` prop
* Clicking the button submits the form
* Submission triggers the server-side sign-out logic

---

### **4. Complete Example**

```js
import { signOut } from "@/auth";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

function SignOutButton() {
  // 1. Server Action
  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    // 2. Bind action to form
    <form action={signOutAction}>
      <button className="...">
        <ArrowRightOnRectangleIcon />
        <span>Sign out</span>
      </button>
    </form>
  );
}

export default SignOutButton;
```

---

### **5. What Happens at Runtime**

#### **Before Clicking**

* User is authenticated
* UI shows profile image / user info
* “Sign out” button is visible

#### **After Clicking**

1. Form submits to the server
2. `signOut()` destroys the session
3. User is redirected (or page refreshes)
4. UI re-renders automatically
5. App switches back to **Guest mode**

   * Profile image disappears
   * “Sign in” button reappears

No manual state updates required.

---

### **6. Icon Choice (UX Detail)**

The transcript uses:

```
ArrowRightOnRectangleIcon
```

from **Heroicons (`24/solid`)**

This visually communicates:

* Exit
* Logout
* Leaving a protected area

A small touch, but excellent UX clarity.

---

### **Key Takeaways**

* Sign-out uses the **same Server Action pattern** as sign-in
* Forms replace click handlers in Server Components
* Session state updates automatically after sign-out
* No client-side auth logic is needed

---

### **Mental Model**

> **Auth actions = server-only, form-triggered, stateless**

Once you accept that model, custom auth UI becomes trivial.

---
# Tourmate Website

Customer-facing website for **The Wild Oasis**, built with **Next.js 14 (App Router)** and **Tailwind CSS**.

This README contains only project-related information (setup, structure, routes, and implementation notes).

---

## Table of Contents

- [Overview](#overview)
- [Status](#status)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Path Aliases](#path-aliases)
- [Styling (Tailwind CSS)](#styling-tailwind-css)
- [Images (next/image)](#images-nextimage)
- [Metadata, Fonts, and Icons](#metadata-fonts-and-icons)
- [Account Area (Nested Layout)](#account-area-nested-layout)
- [Data Layer Notes](#data-layer-notes)
- [Developer Notes](#developer-notes)

---

## Overview

Tourmate is a Next.js App Router project where guests can:

- Browse cabins
- View their reservations
- Update profile information

Next.js renders HTML on the server for the initial request, and then uses React Server Components (RSC) to keep most UI server-only while still enabling SPA-style navigation.

## Status

This repo is actively being built and some parts are still **stubbed**:

- Some pages currently use placeholder arrays (e.g., cabins and bookings)
- The server data module references Supabase, but the Supabase client wiring is not included yet

The UI structure, routing, and layouts are in place.

## Tech Stack

- **Next.js** 14 (App Router)
- **React** 18
- **Tailwind CSS**
- **Heroicons** (`@heroicons/react`)
- **date-fns**

## Requirements

- Node.js (LTS recommended)
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

- <http://localhost:3000>

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run lint checks |

## Project Structure

High-level structure (as it exists in this repo):

```text
app/
  _components/        # Shared UI components (Header, Navigation, cards, etc.)
  _lib/               # Data helpers (server-side modules)
  _styles/            # Global styles (Tailwind directives live here)
  about/page.js       # /about
  account/            # /account + nested routes + nested layout
    layout.js         # Account-area nested layout (sidebar)
    page.js           # /account
    profile/page.js   # /account/profile
    reservations/page.js # /account/reservations
  cabins/page.js      # /cabins
  icon.png            # App icon (auto-detected)
  layout.js           # Root layout (required)
  loading.js          # Route-level loading UI
  page.js             # Home route (/)
public/               # Static assets
```

## Routes

Routes in this repo:

| URL | File |
| --- | --- |
| `/` | `app/page.js` |
| `/cabins` | `app/cabins/page.js` |
| `/about` | `app/about/page.js` |
| `/account` | `app/account/page.js` |
| `/account/profile` | `app/account/profile/page.js` |
| `/account/reservations` | `app/account/reservations/page.js` |

## Path Aliases

This project uses an `@` alias (configured in `jsconfig.json`):

```js
import bg from "@/public/bg.png";
import SelectCountry from "@/app/_components/SelectCountry";
```

## Styling (Tailwind CSS)

Tailwind is configured via:

- `tailwind.config.js`
- `postcss.config.mjs`
- `app/_styles/globals.css` (imports Tailwind layers)

If VS Code shows `Unknown at rule @tailwind`, it’s editor CSS validation (not Tailwind). This repo already includes workspace settings to ignore unknown at-rules in `.vscode/settings.json`.

## Images (next/image)

This project uses Next.js `Image` for optimized images.

### Home page background

The home page renders a full-screen background image as a **fixed layer** (so it doesn’t require a positioned parent for `fill`):

```js
<Image
  src={bg_img}
  placeholder="blur"
  quality={80}
  sizes="100vw"
  className="fixed inset-0 -z-10 h-full w-full object-cover object-top"
  alt="Mountains and forests with two cabins"
/>
```

### About page patterns

The About page shows two common patterns:

- **Static import** (dimensions inferred, blur placeholder supported)
- **Responsive fill** inside a sized, positioned parent (`relative` + `aspect-square`)

## Metadata, Fonts, and Icons

### Metadata

Pages and layouts export `metadata`. The root layout uses a title template:

- Template: `%s - tourmate`
- Default: `Welcome - tourmate`

### Fonts

The root layout loads **Josefin Sans** using `next/font/google` for automatic optimization.

### App icon

The app icon is provided via `app/icon.png` (auto-detected by Next.js).

## Account Area (Nested Layout)

The account section has its own nested layout:

- File: `app/account/layout.js`
- UI: renders `SideNavigation` alongside `{children}`
- Result: `/account/*` pages get the sidebar automatically

This is the cleanest way to apply section-specific UI while still inheriting the root layout.

## Data Layer Notes

`app/_lib/data-service.js` contains data helpers (cabins, bookings, guests, settings, etc.).

Important note:

- The module currently references `supabase` but does not import/create a Supabase client in this repo yet.
- Treat it as “in-progress scaffolding” until the Supabase client setup is added.

## Developer Notes

### Verifying server-rendered HTML

To sanity-check SSR:

1. Open the app in a browser
2. Use View Page Source (not DevTools Elements)
3. Confirm the HTML contains meaningful content (e.g., headings)

### VS Code tip: Custom Labels

App Router projects have many `page.js` files. VS Code Custom Labels can show the parent folder in the tab title (for example, “page (cabins)”).

### Keeping dependencies current

```bash
npm install next@latest react@latest react-dom@latest eslint-config-next@latest
```

---

## Key Section Objectives

The primary goal of this section is to deliver data to users **as fast as possible** by fully leveraging the **Next.js App Router** and its server-first architecture.

### 1. Content Streaming

Learn how to stream UI incrementally so users see meaningful content immediately:

- **Route-level streaming** using the `loading.js` convention
- **Component-level streaming** with **React Suspense**
- Progressive rendering of data-heavy sections while layouts render instantly

### 2. Rendering Strategies

Understand when to use:

- **Static Rendering** – pre-rendered at build time or cached
- **Dynamic Rendering** – rendered on every request

You will establish clear criteria for choosing the correct strategy per route.

### 3. Performance Optimization

Leverage Next.js caching layers to:

- Avoid redundant database queries
- Reduce server load
- Improve Time to First Byte (TTFB)

---

## Core Techniques Covered

### Data Fetching (Server Components)

- Fetch data directly inside **Server Components**
- Secure access to the database without exposing credentials
- No need for an intermediate REST or API route

```js
// app/cabins/page.js
import { getCabins } from "@/lib/data-service";

export default async function Page() {
  const cabins = await getCabins();
  return <CabinList cabins={cabins} />;
}
```

---

### Caching

Next.js provides automatic and configurable caching:

- **Request Memoization** – deduplicates identical fetches
- **Data Cache** – persists data between requests
- **Full Route Cache** – caches rendered output

```js
fetch(url, { cache: "force-cache" }); // static
fetch(url, { cache: "no-store" });    // dynamic
```

---

### Streaming with Suspense

Break pages into chunks so users don’t wait for all data to load:

```jsx
<Suspense fallback={<Spinner />}>
  <CabinList />
</Suspense>
```

- Layout renders immediately
- Data-heavy components load in parallel

---

## Supabase Integration

To integrate hotel data into **The Wild Oasis** website, the project uses **Supabase** as a backend connected to a PostgreSQL database.

### Supabase Client Setup

```js
// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

### Environment Variables

Stored securely in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Data Access Architecture

### Direct Server Access

- Server Components run **only on the server**
- Database credentials are never sent to the browser
- Faster and more secure than client-side fetching

### Data Service Layer

All database logic is encapsulated in reusable services:

```js
// lib/data-service.js
export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) throw new Error(error.message);
  return data;
}
```

### Shared with Management App

- Same Supabase project
- Same query logic
- Guaranteed data consistency between admin dashboard and public website

---

## Implementation Strategy

By connecting the website to the **existing Supabase project**:

- No schema duplication
- No redundant API logic
- Immediate access to live cabin and booking data

This allows the developer to focus on:

- UI composition
- Streaming strategy
- Caching and performance

---

## Outcome

After completing this section, you will be able to:

- Choose between **static vs dynamic rendering** confidently
- Stream content effectively using **Suspense** and `loading.js`
- Optimize data delivery with **Next.js caching**
- Build fast, scalable, server-first routes in Next.js App Router

---

Building the cabin list for **The Wild Oasis** is a great fit for the Next.js App Router: we fetch cabin data on the server and render a clean, responsive overview—fast, secure, and SEO-friendly by default.

### Data Fetching and Rendering

In this project, the cabins overview is a **Server Component**, which means the data is loaded during server rendering:

- **Server-side fetching**: Cabins are queried on the server through a dedicated data service, so the initial page load does not need `useEffect` or `useState`.
- **Async/await flow**: The route component is an `async` function, allowing the UI to wait for the database query before rendering the list.
- **Loading states**: If a `loading.js` file exists for the route, Next.js can show a loading UI while data is being fetched.

### Component Structure

The cabins UI is split into focused parts to keep the codebase tidy and reusable:

- **CabinPage**: The route component (`app/cabins/page.js`) is responsible for fetching cabin data and orchestrating the page layout.
- **CabinCard**: A presentational component for a single cabin—typically showing the image, name, capacity, and price.

### Display and Optimization

The cabins overview is designed to be both fast and visually polished:

- **Image optimization**: Cabin images are rendered with Next.js `<Image />`, which handles efficient sizing and modern image delivery.
- **Tailwind styling**: The list is laid out with Tailwind CSS utilities for a responsive grid or list presentation.
- **Navigation links**: Each cabin entry uses `next/link` so users can navigate to a cabin detail page with smooth, client-side routing.

### Key Code Patterns

These are the core patterns used throughout the implementation:

1. **Service integration**: Cabin queries are centralized in a reusable `getCabins` helper in the data service layer.
2. **Defensive UI**: Empty or missing data states are handled gracefully to avoid broken layouts.
3. **Client/server boundary**: Data fetching and rendering stay server-side, while Client Components are reserved for interactive features when needed.

---

In Next.js, **streaming** lets the server send a page in **chunks** as they become ready. Instead of waiting for every data request to finish, the user can start seeing (and often interacting with) the page immediately—while slower sections continue loading in the background.

### The `loading.js` Convention (Route-Level Streaming)

`loading.js` is a built-in Next.js convention that enables streaming at the **route segment** level:

- **Automatic Suspense boundary**: adding a `loading.js` file causes Next.js to wrap the corresponding `page.js` in a Suspense boundary automatically.
- **Instant loading UI**: the UI exported from `loading.js` (spinner, skeleton, etc.) is sent to the client immediately on navigation.
- **Progressive rendering**: while “heavy” server work (like database queries) runs, the route can still display stable UI such as layouts, headers, and navigation.

### Global vs Route-Specific Loading

You can control where loading indicators appear:

- **Global loading**: `app/loading.js` applies to the entire app and can be used as a site-wide fallback.
- **Route-specific loading**: `app/cabins/loading.js` applies only to the `/cabins` route segment, giving you a more tailored loading experience.
- **Nested precedence**: when both exist, the most specific `loading.js` wins for its segment—so `/cabins` can show a cabin-specific loader rather than a generic global one.

### Why “Selective” Streaming Matters

A key insight in modern Next.js is that not everything on a page depends on data:

- The **heading** and **intro text** can render immediately because they don’t require a database query.
- The **cabin list** is the data-heavy part that depends on Supabase.
- With streaming, users see the page structure right away, and the loader only occupies the space where the cabin results will appear—making the app feel faster and more responsive.

---

# React Suspense — Concise Technical Summary

## 1. Definition & Core Concept

- **React Suspense** is a built-in React component that **pauses rendering** of part of the UI while asynchronous work is in progress.
- Conceptually similar to a **`catch` block**, but instead of catching errors, it catches **“suspending” components**.
- Enables **declarative async handling in JSX**, removing the need for:

  - `isLoading` flags
  - conditional rendering (`ternary`, `&&`) for loading states

---

![a](https://i.ibb.co.com/Nn90hqw7/a1.png)
![a](https://i.ibb.co.com/bRHgHXXM/a2.png)
![a](https://i.ibb.co.com/4nbP71Gt/a3.png)

## 2. Primary Use Cases

### 1️⃣ Data Fetching (Main Use Case)

- Works **only with Suspense-aware data sources**, such as:

  - **Next.js (App Router)**
  - **React Query (with Suspense enabled)**
  - **Remix**
- ❌ `fetch` inside `useEffect` or event handlers **does not trigger Suspense** automatically.

### 2️⃣ Code Splitting (Lazy Loading)

- Used with `React.lazy()` to load components asynchronously.

---

## 3. Runtime Flow (What Happens)

1. A child component **suspends**
2. React walks **up the tree** to find the nearest **Suspense Boundary**
3. React:

   - Temporarily **hides the suspended subtree**
   - Renders the **fallback UI**
4. When async work finishes:

   - React retries rendering
   - The fallback is removed
   - The subtree becomes visible again

---

## 4. Internal Mechanics (Fiber-Level)

### Suspense Boundary Internals

- Suspended children are **not unmounted**
- Instead, React moves them into an internal Fiber component called **`Activity`**

### Activity Component

- Has a `mode` flag:

  - `hidden` → fallback shown
  - `visible` → real UI shown
- The fallback exists as a **sibling Fiber**, not a replacement

### State Preservation (Critical Insight)

- Because components are **hidden, not destroyed**:

  - ✅ Local state
  - ✅ Effects
  - ✅ Memoized values
    are **preserved** during suspension

---

## 5. Tricky Behaviors & Edge Cases

### Suspense + Transitions

- If suspension happens inside `startTransition()`:

  - ❌ fallback is **not shown**
  - UI remains stable (prevents flashing)
- Common in **Next.js route navigation**

**Force fallback rendering**

```jsx
<Suspense fallback={<Spinner />} key={route}>
```

---

### How Suspension Is Triggered

- A component **throws a Promise**
- React intercepts it (not an error)
- Promise resolution signals React to retry rendering

> This is intentional and core to Suspense’s design.

---

## One-Line Mental Model

> **Suspense hides UI instead of unmounting it, waits for async work, then reveals it again—state intact.**

---

# Streaming UI with React Suspense (Next.js App Router)

## 1. The Problem: Route-Level Blocking (`loading.js`)

Using a `loading.js` file creates a **route-level loading state**.

### What happens

- The **entire page** is blocked until *all* required data finishes loading.
- Static UI (headings, intro text, layout) is hidden behind the spinner.

### Result

- Users see a **full-page loader**
- No progressive rendering
- Poor perceived performance

---

## 2. The Solution: Granular Streaming with Suspense

React Suspense enables **partial UI streaming**.

### Core Idea

- Render **static UI immediately**
- Stream in **data-dependent components** independently

### Outcome

- Page shell appears instantly
- Only the slow data section shows a loading indicator
- Dramatically better UX

---

## 3. Implementation Strategy

### Step A — Isolate the Async Work

You **cannot** achieve streaming by wrapping the entire page in Suspense.
You must **extract the async logic**.

#### 1️⃣ Create a Data Component

Move both:

- data fetching
- rendering logic

into a new component.

```jsx
// app/cabins/CabinList.jsx
export default async function CabinList() {
  const cabins = await fetchCabins();

  return (
    <ul>
      {cabins.map(cabin => (
        <Cabin key={cabin.id} cabin={cabin} />
      ))}
    </ul>
  );
}
```

> This is a **Server Component** and must be `async`.

---

#### 2️⃣ Clean the Page Component

The page itself should:

- NOT be async
- Render only static content + the async child

```jsx
// app/cabins/page.jsx
import CabinList from "./CabinList";
import { Suspense } from "react";
import Spinner from "@/components/Spinner";

export default function CabinsPage() {
  return (
    <>
      <h1>Our Cabins</h1>
      <p>Choose from our luxury cabins.</p>

      <Suspense fallback={<Spinner />}>
        <CabinList />
      </Suspense>
    </>
  );
}
```

---

### Step B — Apply the Suspense Boundary

#### Key Rules

✔ Suspense **must wrap the async component**
✔ Suspense must be **outside** the component doing async work
✔ `fallback` must be a **React element**, not a function

❌ This will NOT work:

```jsx
async function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      ...
    </Suspense>
  );
}
```

---

## 4. How Streaming Works at Runtime

1. Static JSX renders immediately
2. React encounters `<CabinList />`
3. Component suspends (throws a Promise)
4. Suspense renders `<Spinner />`
5. Data resolves
6. CabinList streams in and replaces fallback

---

## 5. Best Practices

### Data Fetching

- Keep data fetching **as close as possible** to the component that consumes it
- Avoid lifting async logic to the page unless necessary

### When to Use `loading.js`

Use `loading.js` if:

- The page is **entirely dynamic**
- There is no meaningful static UI to show early

Use Suspense if:

- Static + dynamic UI are mixed
- You want progressive rendering

---

## 6. One-Line Mental Model

> **`loading.js` blocks the route — Suspense streams the page.**

---

# Dynamic Route Segments in Next.js (App Router)

## 1. The Core Idea

### The Problem

When building individual item pages (e.g., a specific cabin), URLs must include a unique identifier:

```
/cabins/91
/cabins/89
```

Manually creating folders for every ID is impossible.

### The Solution

**Dynamic Route Segments** let Next.js match parts of the URL at runtime using placeholders.

---

## 2. Folder & File Structure

Dynamic routes are created using **square brackets**.

```
app/
└── cabins/
    └── [cabinId]/
        └── page.jsx
```

- `[cabinId]` becomes a **variable segment**
- `page.jsx` renders **all matching routes**

---

## 3. Accessing the Dynamic Parameter

Every dynamic route page automatically receives a `params` object.

```jsx
export default function Page({ params }) {
  console.log(params.cabinId);
}
```

### Key Rules

- The key name **must match the folder name**
- `[cabinId]` → `params.cabinId`
- Value is always a **string**

---

## 4. Fetching Data for the Dynamic Page

Dynamic pages typically fetch data based on the URL parameter.

```jsx
import { getCabin } from "@/lib/data-service";

export default async function CabinPage({ params }) {
  const cabin = await getCabin(params.cabinId);

  return (
    <section>
      <h1>{cabin.name}</h1>
      <p>{cabin.description}</p>
    </section>
  );
}
```

### Important Notes

- Page must be an **async Server Component**
- Data fetching happens **during rendering**
- No `useEffect` or client-side fetching needed

---

## 5. Loading States for Dynamic Routes

### Default Behavior

If you already have:

```
app/cabins/loading.jsx
```

It will automatically apply to:

- `/cabins`
- `/cabins/91`
- `/cabins/any-id`

### Override for Dynamic Route

Add a specific loader:

```
app/cabins/[cabinId]/loading.jsx
```

This loader **only affects the dynamic page**, not the parent route.

---

## 6. Images in Dynamic Pages (Common Pattern)

Dynamic content often has varying image sizes. Best practice:

```jsx
<div className="relative h-[400px]">
  <Image
    src={cabin.image}
    alt={cabin.name}
    fill
    className="object-cover"
  />
</div>
```

### Why This Works

- `relative` → required for `fill`
- `fill` → responsive sizing
- `object-cover` → preserves aspect ratio

---

## 7. Mental Model

> **Dynamic route folders turn URL segments into function arguments.**

---

## 8. Common Mistakes to Avoid

❌ Expecting `params` in client components
❌ Forgetting to make the page `async`
❌ Mismatching folder name and `params` key
❌ Parsing `params.cabinId` as a number without conversion

---

Here’s a **cleaned-up, corrected, and transcript-faithful explanation** of **Dynamic Metadata in Next.js**, suitable for documentation or notes. I’ve fixed minor issues, improved flow, and kept it concise and accurate.

---

## Dynamic Metadata in Next.js (Dynamic Routes)

### **1. The Problem: Static Metadata**

By default, all pages inherit metadata from the **root layout** (e.g., a generic title like `"Welcome"`).

While you *can* export a static `metadata` object from a page, this approach **fails for dynamic routes**, where the page title must depend on runtime data—such as a cabin’s ID or name (`/cabins/004`, `/cabins/091`, etc.).

---

### **2. The Solution: `generateMetadata`**

Next.js provides a special convention for this case:

> Export an **async function** named `generateMetadata` from your page.

This function allows metadata to be generated dynamically using route parameters and fetched data.

---

### **3. Implementation Steps**

#### **1. Define the Function**

Create an asynchronous function named `generateMetadata` in your dynamic route’s `page.js`.

#### **2. Access Route Params**

The function receives the same `params` object as the page component, allowing access to dynamic values like `cabinId`.

#### **3. Fetch Required Data**

Use the route parameter to fetch the specific data (e.g., a cabin record from the database).

#### **4. Return Metadata**

Return a metadata object with dynamic values such as the page title.

---

### **4. Important Behavior: Blocking for SEO**

A critical detail is **when** this function runs.

Next.js will **wait for `generateMetadata` to finish** before it starts streaming the page UI.

#### **Why this matters**

- Ensures the correct `<title>` and `<meta>` tags are included in the **initial HTML response**
- Essential for **SEO and social sharing**
- Prevents search engines from indexing pages with generic titles

---

### **Code Example**

```js
// app/cabins/[cabinId]/page.js

// 1. Export the dynamic metadata function
export async function generateMetadata({ params }) {
  // 2. Fetch data using the dynamic route param
  const cabin = await getCabin(params.cabinId);

  // 3. Return dynamic metadata
  return {
    title: `Cabin ${cabin.name}`,
  };
}

// Page component
export default async function Page({ params }) {
  // Page rendering logic
}
```

---

### **Key Takeaways**

- `metadata` → static, compile-time only
- `generateMetadata` → dynamic, data-driven, SEO-safe
- Next.js **blocks rendering** until metadata is resolved
- Ideal for dynamic routes like `/cabins/[id]`

If you want, I can also:

- Add **description**, **Open Graph**, or **Twitter metadata**
- Show how to **reuse the same fetch** between `generateMetadata` and the page
- Compare this with **CSR-based metadata (not recommended for SEO)**

---

## Global Error Handling in Next.js (App Router)

### 1. Goal: Global Error Boundaries

The purpose of global error handling is to **gracefully recover from rendering failures** instead of showing a broken UI or dev stack trace.

Next.js achieves this using **React Error Boundaries**, exposed via the `error.js` convention.

---

## 2. `error.js` – Route Segment Error Boundary

### File Location

```txt
app/error.js
```

You can also scope error boundaries:

```txt
app/cabins/error.js
```

### Client Component Requirement

`error.js` **must** be a Client Component because it relies on user interaction (`reset()`).

```js
'use client'
```

---

## 3. Error Component API

Next.js injects **two props** automatically:

| Prop    | Purpose                                            |
| ------- | -------------------------------------------------- |
| `error` | The thrown error (`error.message`, `error.digest`) |
| `reset` | Retries rendering the failed route segment         |

---

### Minimal Example

```js
'use client'

export default function Error({ error, reset }) {
  return (
    <main className="error">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>

      <button onClick={reset}>
        Try again
      </button>
    </main>
  )
}
```

✔ `reset()` re-renders the route
✔ No manual try/catch required
✔ Automatically wired by Next.js

---

## 4. What `error.js` Catches (and Doesn’t)

### ✅ Catches

* Errors during **rendering**
* Errors in **Server Components**
* Errors in **data fetching during render**
* Errors in **nested layouts and pages**

### ❌ Does NOT Catch

* Errors inside **event handlers**
* Errors inside `useEffect`
* Errors inside the **root layout (`app/layout.js`)**

> React Error Boundaries only work during the render phase.

---

## 5. Handling Root Layout Errors → `global-error.js`

Errors inside `app/layout.js` bypass `error.js`.

### Solution

Create:

```txt
app/global-error.js
```

### Key Difference

This file **replaces the entire document**, so you must include `<html>` and `<body>`.

---

### Example `global-error.js`

```js
'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <main className="error">
          <h1>Application Error</h1>
          <p>{error.message}</p>

          <button onClick={reset}>
            Reload app
          </button>
        </main>
      </body>
    </html>
  )
}
```

Use this for:

* Root-level data fetching failures
* Theme/provider crashes
* Auth/session initialization errors

---

## 6. Recommended File Summary

```txt
app/
├── layout.js
├── error.js           ← Segment-level errors
├── global-error.js    ← Root layout errors
├── not-found.js       ← 404 handling (next topic)
```

---

## Handling **Not Found (404)** Errors in Next.js (App Router)

Unlike runtime errors (handled by `error.js`), **404s are a routing concern**, and Next.js treats them as a **separate rendering flow**.

---

## 1. Global 404 Page (`not-found.js`)

### Purpose

Replaces the default Next.js 404 screen with a **custom, user-friendly page** when:

* A route does not exist
* A `notFound()` call is triggered and no closer boundary exists

---

### File Convention

```txt
app/not-found.js
```

---

### Minimal Implementation

```js
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>

      <Link href="/">
        ← Back to home
      </Link>
    </main>
  )
}
```

✅ Server Component by default
✅ No `'use client'` needed
✅ Automatically picked up by Next.js

---

## 2. Manually Triggering 404s with `notFound()`

### When This Is Needed

Dynamic routes may exist structurally, but the **data does not**.

Example:

```txt
/cabins/999   ← route exists
               ← cabin does not
```

Showing an error page here would be **wrong** — this is a **404**, not a crash.

---

### The `notFound()` Function

#### Import

```js
import { notFound } from 'next/navigation'
```

#### Usage (Server Components only)

```js
export async function getCabin(id) {
  const cabin = await fetchCabinFromDB(id)

  if (!cabin) notFound()

  return cabin
}
```

📌 Important:

* Immediately **halts execution**
* Does **not throw** a traditional error
* Skips `error.js`
* Renders the nearest `not-found.js`

---

### Common Use Cases

* Invalid dynamic route IDs
* Deleted resources
* Unauthorized access masked as non-existent content
* Empty database results

---

## 3. Scoped (Segment-Level) 404 Pages

Just like layouts and loading states, 404 pages can be **scoped**.

---

### Example Structure

```txt
app/
├── cabins/
│   ├── [cabinId]/
│   │   ├── page.js
│   │   ├── not-found.js
```

---

### Scoped `not-found.js`

```js
import Link from 'next/link'

export default function CabinNotFound() {
  return (
    <main>
      <h1>Cabin not found</h1>
      <p>This cabin does not exist or was removed.</p>

      <Link href="/cabins">
        ← Back to all cabins
      </Link>
    </main>
  )
}
```

### Behavior

* `notFound()` inside `[cabinId]` → renders this page
* Falls back to `app/not-found.js` if no closer match exists

---

## 4. Error vs Not Found — Critical Distinction

| Scenario                       | Use            |
| ------------------------------ | -------------- |
| Data fetch failed (500)        | `error.js`     |
| Rendering crash                | `error.js`     |
| Invalid URL                    | `not-found.js` |
| Missing DB record              | `notFound()`   |
| Unauthorized masked as missing | `notFound()`   |

🚫 **Do NOT** use `error.js` for missing data
🚫 **Do NOT** throw errors for 404 cases

---

## 5. SEO & UX Benefits

* Correct **HTTP 404 status**
* Prevents indexing of invalid pages
* Clean separation between crashes and missing content
* Better analytics and monitoring

---

## Recommended File Setup

```txt
app/
├── layout.js
├── error.js
├── global-error.js
├── not-found.js
├── cabins/
│   └── [cabinId]/
│       ├── page.js
│       └── not-found.js
```

---
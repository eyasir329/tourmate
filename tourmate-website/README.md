## Setting Up a Next.js Project (Next.js 14)

Creating a Next.js project is very similar to initializing a React app with Vite or Create React App, but with **SSR and full-stack features enabled by default**.

---

## Step 1: Project Initialization

To avoid version mismatches and ensure alignment with modern documentation, explicitly use **Next.js 14**.

### Command

```bash
npx create-next-app@14 tourmate-website
# npx create-next-app@latest tourmate-website
```

### Project Context

This project represents the **customer-facing website** for **The Wild Oasis**, where users can:

* View cabins
* Make and manage reservations
* Update profile information

---

## Step 2: Configuration Options

During setup, select the following options:

| Option       | Choice | Reason                             |
| ------------ | ------ | ---------------------------------- |
| TypeScript   | ❌ No   | Keeps setup beginner-friendly      |
| ESLint       | ✅ Yes  | Enforces code quality              |
| Tailwind CSS | ✅ Yes  | Deeply integrated and efficient    |
| App Router   | ✅ Yes  | Modern, recommended routing system |
| Import Alias | ❌ No   | Defaults are sufficient            |

![n1](https://i.ibb.co.com/HDwM2nBL/N1.png)

---

## Step 3: Project Structure Overview

After installation, open the project:

```bash
code .
```

### Key Files & Folders

#### `package.json`

* Confirms Next.js is a **Node.js application**
* Defines scripts and dependencies

#### `app/`

* **Core directory** for the App Router
* Contains routes, layouts, and server components

#### `public/`

* Stores static assets (images, icons, fonts)

#### `next.config.js`

* Used for custom framework configuration

---

## Step 4: Running the Development Server

### Command

```bash
npm run dev
```

### Notes

* Development server runs at:

  ```
  http://localhost:3000
  ```

* `create-next-app` often initializes a **Git repository** automatically

---

## Verifying Server-Side Rendering

To confirm SSR is working:

1. Open the app in your browser
2. View **Page Source** (not DevTools Elements)
3. Check for content such as:

   ```html
   <h1>...</h1>
   ```

   rendered directly in the HTML

If the content is present, the page is **server-side rendered**.

---

## Key Takeaway

> **Next.js apps render HTML on the server by default, providing fast initial loads and SEO benefits without manual SSR setup.**

---

## Routing in Next.js (App Router)

Next.js uses **file system–based routing**, removing the need for manual route configuration tools like **React Router**. Routes are created automatically based on the structure of the `app/` directory.

---

## Core Routing Principles

### 1. Folder-Based Routes

* Each folder inside `app/` represents **one URL segment**.
* Folder names map directly to the URL path.

---

### 2. `page.js` Is Required

* A folder becomes a **public route only if it contains `page.js`**.
* Without `page.js`, the folder is ignored by the router.

---

### 3. Default Exported Component

* Every `page.js` must:

  ```js
  export default function Page() { ... }
  ```

* The exported component defines the UI for that route.

---

### 4. Server Components by Default

* `page.js` files are **React Server Components** unless explicitly marked with:

  ```js
  "use client";
  ```

* This enables SSR, data fetching, and reduced client-side JavaScript.

---

## Defining Routes with Folder Structure

| URL        | Folder Structure      |
| ---------- | --------------------- |
| `/`        | `app/page.js`         |
| `/cabins`  | `app/cabins/page.js`  |
| `/about`   | `app/about/page.js`   |
| `/account` | `app/account/page.js` |

> Folder name = URL segment
> `page.js` = entry point for the route

---

## Nested Routes

Nested URLs are created by **nesting folders**.

Example:

```text
/cabins/test
```

Structure:

```text
app/
 └─ cabins/
     └─ test/
         └─ page.js
```

Each folder adds **one path segment**.

---

## Developer Productivity Tips

### VS Code Custom Labels

* Since many files are named `page.js`, enable **Custom Labels** to display the parent folder:

  ```
  page (cabins)
  page (about)
  ```

* This greatly improves navigation in large projects.

---

### Other Reserved File Names

Next.js defines special files for common behaviors:

| File           | Purpose                           |
| -------------- | --------------------------------- |
| `layout.js`    | Shared UI (headers, footers, nav) |
| `loading.js`   | Route-level loading state         |
| `error.js`     | Error boundary                    |
| `not-found.js` | 404 handling                      |

---

## Version Awareness

This project uses **Next.js 14**.

To stay current:

```bash
npm install next@latest react@latest react-dom@latest eslint-config-next@latest
```

Professional Next.js development requires **regularly checking official docs and release notes** due to rapid framework evolution.

---

## One-Line Summary (Exam-Friendly)

> **In Next.js App Router, routes are defined by folders inside `app/`, and a route becomes public only when a `page.js` file is present.**

---

## Navigation in Next.js (App Router)

Next.js uses its own **`Link` component** for navigation instead of plain HTML `<a>` tags. This preserves the **single-page application (SPA)** experience while still benefiting from server-side rendering.

---

## Why Not Use `<a>` Tags?

Standard anchor tags:

```html
<a href="/about">About</a>
```

❌ Cause a **full page reload**
❌ Reset client-side state
❌ Slower navigation

---

## The `Link` Component

`Link` is imported from `next/link` and enables **client-side navigation**.

### Key Benefits

### 1. Client-Side Transitions

* Navigation happens in JavaScript
* No full reload
* State is preserved

---

### 2. Automatic Prefetching

* When a `<Link>` enters the viewport, Next.js:

  * Prefetches the route’s JavaScript
  * Optionally prefetches data
* Results in near-instant navigation

> Prefetching occurs only in production builds.

---

### 3. Seamless SPA Experience

* Pages feel instant
* Works seamlessly with SSR and hydration

---

## Basic Navigation Example

```js
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/cabins">Cabins</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/account">Guest area</Link></li>
      </ul>
    </nav>
  );
}
```

---

## How This Compares to React Router

| Feature       | Next.js    | React Router         |
| ------------- | ---------- | -------------------- |
| Link prop     | `href`     | `to`                 |
| Routing setup | File-based | Manual configuration |
| Prefetching   | Built-in   | Manual               |
| SSR support   | Native     | Limited              |

---

## Important Notes (App Router)

* `<Link>` works in **Client Components**
* If used inside a Server Component, the surrounding component must include:

  ```js
  "use client";
  ```

* Styling can be applied directly to `<Link>` or via child elements

---

## One-Line Summary (Exam-Friendly)

> **Next.js uses the `Link` component for client-side navigation, preventing full page reloads and enabling fast, prefetch-optimized route transitions.**

---

## Layouts in Next.js (App Router)

**Layouts** define shared UI that persists across multiple pages, such as **navigation bars, footers, and sidebars**.
Unlike pages, layouts **do not re-render when navigating between sibling routes**, which improves performance and preserves state.

---

## The Root Layout (`app/layout.js`)

Every App Router project **must** have a root layout.

### Key Properties

### 1. Required File

* `app/layout.js` is mandatory
* If deleted, Next.js automatically regenerates a default layout

---

### 2. HTML & Body Tags

* The root layout must define:

  ```html
  <html>
  <body>
  ```

* This is where global document structure lives

---

### 3. `children` Prop

* Every layout receives a `children` prop
* It represents:

  * The active page
  * Or a nested layout

---

## Using Layouts for Shared UI

Layouts are ideal for UI that should **persist across routes**.

### Example: Global Navigation

```js
import Navigation from "@/components/Navigation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />      {/* Persistent UI */}
        <main>{children}</main> {/* Route-specific content */}
      </body>
    </html>
  );
}
```

### Benefits

* Navigation does not re-mount on route changes
* Client-side state is preserved
* Fewer re-renders → better performance

---

## Global Styles

The root layout is the **correct place** to import global CSS:

```js
import "./globals.css";
```

* Styles apply to the entire app
* Imported only once

---

## Nested Layouts

Layouts can be **nested** by adding `layout.js` to subfolders.

Example:

```text
app/
 ├─ layout.js        (root layout)
 └─ cabins/
     ├─ layout.js    (cabins layout)
     └─ page.js
```

### How Nesting Works

* `/cabins` uses:

  * Root layout
  * Cabins layout
  * Cabins page
* Layouts wrap each other hierarchically

---

## Key Differences: Layout vs Page

| Feature                  | Layout | Page  |
| ------------------------ | ------ | ----- |
| Re-renders on navigation | ❌ No   | ✅ Yes |
| Can define shared UI     | ✅ Yes  | ❌ No  |
| Must render `children`   | ✅ Yes  | ❌ No  |

---

## One-Line Summary (Exam-Friendly)

> **Layouts in Next.js define persistent UI that wraps pages, improving performance by avoiding unnecessary re-renders during navigation.**
---

## React Server Components (RSC)

**React Server Components (RSC)** fundamentally change how React applications are built by **moving most rendering work from the browser to the server**.
They are a **core pillar of the Next.js App Router** and the reason modern Next.js apps ship far less JavaScript.

![n1](https://i.ibb.co.com/r2t6v2c8/N2.png)

![n1](https://i.ibb.co.com/r2CpLFz4/N3.png)

---

## The Core Idea

### Traditional Client-Side React

1. Server sends minimal HTML
2. Browser downloads a large JS bundle
3. React executes in the browser
4. Data is fetched after mount
5. UI is constructed on the client

---

### React Server Components Model

1. Components **execute on the server**
2. Data is fetched **during render**
3. Server sends a **serialized component tree**
4. Client React reconciles it with the DOM
5. Only interactive parts ship JavaScript

> The browser never receives the code for Server Components.

![n1](https://i.ibb.co.com/gMWnb7qs/N4.png)

---

## Server vs Client Components in Next.js

![n1](https://i.ibb.co.com/23Xj1WwD/N5.png)

### 1. Server Components (Default)

* Run **only on the server**
* Zero JavaScript sent to the client
* Can access:

  * Databases
  * File system
  * Private environment variables
* Cannot use:

  * `useState`
  * `useEffect`
  * Event handlers

```js
// Server Component (default)
export default async function Page() {
  const data = await fetchData();
  return <h1>{data.title}</h1>;
}
```

---

### 2. Client Components

* Run in the browser
* Marked explicitly with:

  ```js
  "use client";
  ```

* Can use:

  * State
  * Effects
  * Event handlers
* Required for interactivity

```js
"use client";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

## How RSC Communicates with the Client

* Server sends a **serialized description** (not HTML, not JS)
* Client React:

  * Reconstructs the tree
  * Integrates it into the DOM
* Client Components are loaded **only where needed**

---

## Key Benefits of React Server Components

### 1. Zero Bundle Size

* Server Component code never reaches the browser
* Dramatically smaller JS payloads

---

### 2. Direct Backend Access

* Fetch directly from:

  * Databases
  * ORMs
  * File system
* No REST or GraphQL API layer required

---

### 3. No Request Waterfalls

* Data fetching happens **before the response**
* Eliminates `useEffect`-based fetch chains

---

### 4. Stronger Security

* Secrets stay on the server
* No accidental credential leaks

---

## Performance Impact

* Faster **Largest Contentful Paint (LCP)**
* Less JavaScript parsing and execution
* Faster time to interactive for real content

> RSC shifts work from the weakest machine (the browser) to the strongest (the server).

---

## One-Line Summary (Exam-Friendly)

> **React Server Components allow React components to run on the server, sending only serialized UI data to the client, drastically reducing JavaScript and improving performance.**

---

![n1](https://i.ibb.co.com/1Jht6nCh/N6.png)

## Mental Model (Critical)

* **Server Components = data + structure**
* **Client Components = interactivity**
* Use the **minimum number of Client Components**

![n1](https://i.ibb.co.com/GQKZFw0X/N7.png)

---

## Data Fetching in Next.js App Router (Server Components)

In the **Next.js App Router**, data fetching is greatly simplified because **Server Components** can fetch data directly inside the component using standard JavaScript.

By default, **all components in the `app/` directory are Server Components** unless explicitly marked with `"use client"`.

---

## Why Server Components Are Powerful for Data Fetching

### 1. Async / Await Directly in Components

Server Components can be declared as `async` functions, allowing you to fetch data directly in the component body:

```js
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

No hooks, no side effects—just plain JavaScript.

---

### 2. Direct Backend Access

Because Server Components run **only on the server**, you can:

* Query a database directly
* Read from the file system
* Call internal services
* Use secrets (env variables) safely

👉 This often eliminates the need for an intermediate API route.

---

### 3. Enhanced `fetch()` API

Next.js extends the native `fetch` API with **built-in caching and revalidation**:

```js
const res = await fetch("https://api.example.com/cabins", {
  cache: "force-cache", // default
});
```

Or with revalidation:

```js
const res = await fetch("https://api.example.com/cabins", {
  next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
});
```

---

## Example: Fetching Data in a Server Component

```js
// app/cabins/page.js
export default async function CabinsPage() {
  const res = await fetch("https://api.example.com/cabins", {
    next: { revalidate: 60 },
  });

  const cabins = await res.json();

  return (
    <div>
      <h1>Our Cabins</h1>
      <ul>
        {cabins.map((cabin) => (
          <li key={cabin.id}>{cabin.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Key Differences from Client-Side React

### ❌ No `useEffect` or `useState`

Traditional React fetches data like this:

```js
useEffect(() => {
  fetch(...)
}, []);
```

Server Components **do not use hooks for data fetching**.

---

### ✅ Automatic Loading States

Instead of managing loading state manually, you can define:

```bash
app/cabins/loading.js
```

```js
export default function Loading() {
  return <p>Loading cabins...</p>;
}
```

Next.js automatically shows this while data is being fetched.

---

### ✅ No Request Waterfalls

Client-side fetching often causes:

```
HTML → JS → fetch → render
```

Server-side fetching allows:

```
fetch → render → HTML sent to browser
```

This avoids chained requests and improves performance.

---

## Performance Benefits

Server-side data fetching:

* Reduces client-side JavaScript
* Improves **Largest Contentful Paint (LCP)**
* Sends **fully populated HTML** to the browser
* Works seamlessly with streaming and Suspense

The user sees **content immediately**, not a spinner.

---

## When You Still Need API Routes

You still need API routes when:

* Data is fetched from **Client Components**
* Handling **mutations** (POST, PUT, DELETE)
* Exposing endpoints for external consumers

Otherwise, **Server Components + direct data access** are preferred.

---

### ✅ Verdict

Your explanation is **accurate**, modern, and aligned with best practices.
The biggest mental shift is this:

> **Server Components replace `useEffect`-based data fetching entirely.**

---

## Client Components in the Next.js App Router

While **Server Components** are the default in the App Router, they **cannot provide interactivity** because they execute only on the server and do not ship JavaScript to the browser.
To enable interactivity, you must use **Client Components**.

---

## Why Server Components Cannot Be Interactive

Server Components run exclusively on the server, which implies:

### ❌ No React Hooks

Hooks such as:

* `useState`
* `useEffect`
* `useReducer`
* `useContext`

are **not available**, because they rely on a persistent client-side runtime.

---

### ❌ No Event Handlers

Event handlers like:

* `onClick`
* `onChange`
* `onSubmit`

**compile**, but they do nothing—because **no JavaScript is sent to the browser** for Server Components.

---

### ❌ No Browser APIs

Server Components cannot access:

* `window`
* `document`
* `localStorage`
* `navigator`

These APIs exist only in the browser environment.

---

## The `"use client"` Directive

To opt into client-side behavior, you must add the directive:

```js
"use client";
```

### Key Properties

* **Must be the first line** in the file (before imports)
* Creates a **client-side boundary**
* All imported components become **Client Components transitively**

---

### Hydration Explained

Client Components are:

1. **Pre-rendered to HTML on the server**
2. **Hydrated in the browser** once the JS bundle loads
3. Become fully interactive after hydration

This gives you **fast initial paint + interactivity**.

---

## When to Use Client Components

Use Client Components **only when necessary**:

### ✅ Interactive UI

* Buttons
* Forms
* Modals
* Carousels
* Search inputs

### ✅ State Management

* `useState`
* `useReducer`

### ✅ Side Effects

* Timers
* DOM manipulation
* Subscriptions (`useEffect`)

### ✅ Browser APIs

* `window`
* `document`
* `localStorage`

---

## Best Practice: Move Interactivity to the Leaves

A core Next.js pattern is:

> **Keep Server Components high in the tree and push Client Components to the leaves**

### Benefits

* Minimal JavaScript sent to the browser
* Better performance and LCP
* Direct server access for data fetching
* Smaller hydration surface

### Composition Model

* ✅ Server Components **can render** Client Components
* ❌ Client Components **cannot import** Server Components

This enables **islands of interactivity** inside mostly static pages.

---

## Example: Client Component Counter

```js
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Count is {count}
    </button>
  );
}
```

✔ Hooks work
✔ Events work
✔ JavaScript is shipped to the browser

---

## Mental Model (Important)

| Feature           | Server Component | Client Component   |
| ----------------- | ---------------- | ------------------ |
| Runs on server    | ✅                | ✅ (initial render) |
| Runs in browser   | ❌                | ✅                  |
| Hooks             | ❌                | ✅                  |
| Event handlers    | ❌                | ✅                  |
| Browser APIs      | ❌                | ✅                  |
| JS sent to client | ❌                | ✅                  |

---

### Final Verdict

Your explanation is **technically sound** and reflects **Next.js best practices**.
The key principle to remember is:

> **Server Components render UI. Client Components enable interaction.**

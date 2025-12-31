# Tourmate — React SSR & Hydration Notes

This repository is a small learning project + notes on **Server-Side Rendering (SSR)**, **Hydration**, and how frameworks like **Next.js** make these workflows production-ready.

## Quick Start

### Install

```bash
npm install
```

### Run (auto-restart)

```bash
npm run dev
```

### Run (single start)

```bash
npm start
```

> Notes:
>
> - The dev script uses Node’s built-in file watcher (`node --watch start.js`).
> - SSR output is served as HTML; hydration adds client-side interactivity.

---

## Table of Contents

- [SSR with Next.js (high level)](#ssr-with-nextjs-high-level)
- [SSR vs CSR](#ssr-vs-csr)
- [Static vs Dynamic Rendering (SSR)](#static-vs-dynamic-rendering-ssr)
- [Hydration (why SSR alone is not enough)](#hydration-why-ssr-alone-is-not-enough)
- [Manual SSR with Node.js + React](#manual-ssr-with-nodejs--react)
- [Hydration deep dive](#hydration-deep-dive)
- [Next.js overview](#nextjs-overview)

---

## SSR with Next.js (high level)

![N1](https://i.ibb.co.com/TBCz7147/N1.png)
![N2](https://i.ibb.co.com/6JYks15D/N2.png)

---

## SSR vs CSR

**Server-Side Rendering (SSR)** generates HTML on the **server** and sends a fully rendered page to the browser.
**Client-Side Rendering (CSR)** sends a minimal HTML shell and relies on JavaScript to render content in the browser.

Modern web development initially shifted heavily toward CSR (React, Vue), but SSR has regained importance for **SEO, performance, and content-heavy applications**.

### Comparing Rendering Methods

| Feature                | Client-Side Rendering (CSR)               | Server-Side Rendering (SSR)              |
| ---------------------- | ----------------------------------------- | ---------------------------------------- |
| **Rendering Location** | Browser (client)                          | Server                                   |
| **Initial Load Speed** | Slower (JS must download & execute first) | Faster (HTML arrives pre-rendered)       |
| **Data Fetching**      | After mount → possible request waterfalls | Before render on the server              |
| **Interactivity**      | High (SPA-like experience)                | Initially static, enhanced via hydration |
| **SEO**                | Challenging (JS-dependent indexing)       | Excellent (content visible immediately)  |

![N3](https://i.ibb.co.com/RTrQ66KD/N3.png)
![N4](https://i.ibb.co.com/kVHYGqf9/N4.png)

---

## Static vs Dynamic Rendering (SSR)

### 1) Static Rendering (SSG)

- HTML generated **at build time**
- Same content served for every request
- Extremely fast and cache-friendly

**Best for:** blogs, documentation, landing pages

### 2) Dynamic Rendering

- HTML generated **per request**
- Can include user-specific or frequently changing data

**Best for:** dashboards, personalized pages, real-time data

![N5](https://i.ibb.co.com/twgJWRgV/N5.png)

---

## Hydration (why SSR alone is not enough)

After the server sends static HTML:

1. The browser displays content immediately
2. JavaScript loads in the background
3. **Hydration** attaches event listeners and state
4. Page becomes fully interactive

This bridges SSR performance with SPA-like UX.

### When to Use Each

**Use SSR when:**

- SEO is critical
- Fast first contentful paint matters
- Content is public and crawlable
  **Examples:** e-commerce, blogs, news, marketing sites

**Use CSR when:**

- App is highly interactive
- SEO is irrelevant
- App is behind authentication
  **Examples:** admin panels, internal tools, dashboards

---

## Manual SSR with Node.js + React

Manually implementing SSR reveals the core mechanics behind frameworks like **Next.js**.
At its heart, SSR is simply **rendering React components to HTML on the server and sending that HTML to the browser**.

### 1) Setting Up the Node.js Server

A basic Node.js HTTP server is sufficient to handle SSR.

**Creating the server** (conceptually):

```js
http.createServer((req, res) => {
  // ...
});
```

**Routing** usually looks like:

- `/` → render main React app
- `/test` → send a simple response or alternate render

**Auto-restart (development):**

```bash
node --watch start.js
```

### 2) Preparing the React Environment (Node Compatibility)

Node.js does **not** understand JSX or modern ES syntax by default.

**Runtime dependencies:**

```bash
npm install react react-dom
```

**Development dependencies (Babel):**

```bash
npm install -D @babel/core @babel/preset-env @babel/preset-react @babel/register
```

**Babel registration** (typical pattern):

```js
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

require('./server');
```

### 3) Rendering React to HTML

This is the **core SSR step**.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Use an `index.html` template such as:

```html
<div id="root">__CONTENT__</div>
```

Then on each request:

1. Read `index.html`
2. Replace `__CONTENT__` with rendered HTML
3. Send the result as the response

Make sure to set the correct header:

```js
res.setHeader('Content-Type', 'text/html');
```

### 4) The Interactivity Gap

At this stage, the app **looks complete but behaves like static HTML**.

**What works:**

- Markup is visible
- Data is rendered
- SEO crawlers see full content

**What breaks:**

- `useState`, `onClick`, `useEffect` do nothing
- Buttons don’t respond
- No client-side JavaScript is running

**Why?**

- The browser received **HTML only**
- React’s runtime logic was never loaded on the client

### 5) Hydration (The Missing Piece)

Hydration solves the interactivity problem:

- Client downloads the same React bundle
- React matches existing HTML
- Event listeners and state are attached
- Page becomes fully interactive **without re-rendering DOM**

---

## Hydration deep dive

**Hydration** is the process by which a client-side JavaScript framework (such as React) **attaches interactivity and state to server-rendered HTML**.
SSR delivers fast initial visibility, but without hydration the page remains **static** and non-interactive.

### Mental Model

Think of hydration as **watering dry HTML**:

- **SSR** → creates the HTML structure (shape)
- **Hydration** → adds behavior (events, state, effects)

The DOM already exists; React’s job is to **reuse it**, not recreate it.

### How Hydration Works (Step-by-Step)

1. **HTML first**: browser receives fully rendered HTML.
2. **JavaScript bundle loads** in the background.
3. **Client render (reconciliation)**: React builds a tree client-side and compares it to the DOM.
4. **DOM adoption**: if markup matches, React reuses DOM nodes.
5. **Event binding**: listeners attach; hooks activate; page becomes interactive.

### Hydration Requirements

Hydration requires **deterministic rendering**:

- Same components
- Same structure
- Same data
- Same order

Any mismatch can break hydration.

### Hydration Errors (Common Causes)

**1) Invalid HTML structure**

```html
<p>
  <div>Invalid</div>
</p>
```

**2) Non-deterministic data**

- `Date.now()`
- `Math.random()`
- API responses that differ between server and client

**3) Browser-only APIs during render**

```js
window;
document;
localStorage;
```

> These do not exist on the server.

**4) Side effects during render**

- DOM mutations during render
- Effects that should run in `useEffect`

### One-Line Summary (Exam-Friendly)

> Hydration is the process by which React attaches event handlers and state to server-rendered HTML, transforming a static page into a fully interactive application.

![hydration](https://i.ibb.co.com/h19KNtn4/H1.png)

### Manual Hydration in React SSR

Hydration restores interactivity by connecting a client-side JavaScript bundle to the static DOM.

**1) Client-side script setup**

- Create a `client.js` file containing the **same React components** used on the server.
- Serve this script with:

  ```http
  Content-Type: application/javascript
  ```

- Enable JSX in the browser using Babel (`text/babel`) if not precompiled.

**2) Loading React in the browser**

```html
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

**3) Hydrating with `hydrateRoot`**

```js
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
```

> The client-side tree must match the server HTML to avoid hydration mismatches.

---

## Next.js overview

**Next.js** is an opinionated React meta-framework (by Vercel) that provides SSR, routing, data fetching, and performance optimizations out of the box.

![nextjs](https://i.ibb.co.com/KcgFqZp4/N6.png)

### The Four Core Capabilities of Next.js

**1) Server-side rendering**

- Supports **Static Rendering (SSG)** and **Dynamic Rendering (per request)**
- Rendering strategy can be configured **per route**

**2) File system–based routing**

Routes are created by files and folders, e.g.:

```
app/blog/page.tsx → /blog
```

**3) Server-side data operations**

- Built on **React Server Components**
- Supports **Server Actions** for mutations
- Data fetching happens directly on the server:

  ```js
  await fetch(...)
  ```

**4) Built-in optimizations**

- Automatic code splitting
- Route prefetching
- Image optimization (`next/image`)
- Font optimization (`next/font`)
- SEO and metadata handling

![nextjs](https://i.ibb.co.com/ZRP85qXZ/N7.png)

### App Router vs Pages Router

| Feature               | App Router                          | Pages Router                           |
| --------------------- | ----------------------------------- | -------------------------------------- |
| **Status**            | Recommended (since 2023)            | Legacy (maintained)                    |
| **Rendering Model**   | Server Components by default        | Client Components only                 |
| **Data Fetching**     | Native `fetch` in Server Components | `getStaticProps`, `getServerSideProps` |
| **Layouts**           | Nested layouts, error boundaries    | Complex and limited                    |
| **Advanced Features** | Streaming, Suspense, Server Actions | Not supported                          |

![nextjs](https://i.ibb.co.com/GfXsB28F/N8.png)

### Trade-Offs of the App Router

**Advantages:**

- Better performance
- Less JavaScript sent to the client
- True full-stack React
- Streaming and partial rendering

**Challenges:**

- Steeper learning curve
- Aggressive caching behavior
- Requires careful mental model of server vs client code

### One-Line Summary (Exam-Friendly)

> Next.js is an opinionated React meta-framework that provides built-in routing, server-side rendering, data fetching, and performance optimizations for full-stack web applications.

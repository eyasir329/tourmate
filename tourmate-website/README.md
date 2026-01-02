# Tourmate Website

Customer-facing website for **The Wild Oasis**, built with **Next.js 14 (App Router)**.

This README is intentionally split into two parts:

- **Project README**: how to run the app + what’s inside the repo
- **Next.js Notes**: SSR/RSC/App Router concepts used in this codebase

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Next.js App Router Notes](#nextjs-app-router-notes)
  - [Routing](#routing)
  - [Navigation with Link](#navigation-with-link)
  - [Layouts](#layouts)
  - [Loading UI with loadingjs](#loading-ui-with-loadingjs)
  - [Server vs Client Components](#server-vs-client-components)
  - [Data Fetching in Server Components](#data-fetching-in-server-components)
  - [React Server Components RSC](#react-server-components-rsc)
  - [How RSC Works Internally](#how-rsc-works-internally)
  - [RSC vs SSR in Nextjs](#rsc-vs-ssr-in-nextjs)
- [Developer Notes](#developer-notes)
- [Scaffolding Notes](#scaffolding-notes)

---

## Overview

Tourmate is a Next.js App Router project where users can:

- View cabins
- Make and manage reservations
- Update profile information

Next.js renders HTML on the server for the initial request, then uses React Server Components (RSC) to keep most UI server-only while still enabling SPA-like navigation.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open:

- `http://localhost:3000`

### Common scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run lint checks |

## Project Structure

```text
app/
  layout.js        # Root layout (required)
  page.js          # Home route (/)
  loading.js       # Route-level loading UI
  about/page.js    # /about
  cabins/page.js   # /cabins
  account/page.js  # /account
  components/      # Shared UI components
public/            # Static assets
```

---

## Next.js App Router Notes

### Routing

Next.js routing is **file system–based** in the `app/` directory.

- Each folder maps to a URL segment
- A route becomes public only when the folder contains `page.js`

Routes in this repo:

| URL | File |
| --- | --- |
| `/` | `app/page.js` |
| `/cabins` | `app/cabins/page.js` |
| `/about` | `app/about/page.js` |
| `/account` | `app/account/page.js` |

Reserved route files (common ones):

| File | Purpose |
| --- | --- |
| `layout.js` | Shared UI wrapper for a route segment |
| `loading.js` | Loading UI (automatic Suspense boundary) |
| `error.js` | Error boundary for a route segment |
| `not-found.js` | 404 handling |

### Navigation with Link

Use `next/link` for navigation. It prevents full page reloads and can prefetch routes in production.

```js
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/cabins">Cabins</Link>
      <Link href="/about">About</Link>
      <Link href="/account">Guest area</Link>
    </nav>
  );
}
```

### Layouts

Layouts define shared UI that persists across route changes.

Key points:

- `app/layout.js` is required
- Root layout must render `<html>` and `<body>`
- Layout receives `children` (active page / nested layout)

Nested layouts work by placing `layout.js` inside a nested folder.

### Loading UI with loadingjs

`loading.js` is the App Router convention for route-level loading UI.

- Creating `loading.js` in a segment adds an automatic Suspense boundary
- The loading UI can be streamed while server rendering/data are still resolving
- Parent `loading.js` applies to nested routes unless overridden

### Server vs Client Components

In the App Router:

- **Server Components are the default**
- Client Components are opt-in using:

```js
"use client";
```

Server Components cannot:

- Use client hooks (`useState`, `useEffect`, etc.)
- Attach event handlers (`onClick`, etc.)
- Access browser APIs (`window`, `document`, `localStorage`, etc.)

Client Components are for:

- Interactivity (forms, buttons)
- Local state/effects
- Browser-only APIs

Best practice: keep most of the tree server-rendered; push interactivity to smaller “leaf” components.

### Data Fetching in Server Components

Server Components can fetch data directly with `async/await` (no `useEffect` needed):

```js
export default async function CabinsPage() {
  const res = await fetch("https://example.com/api/cabins");
  const cabins = await res.json();

  return <pre>{JSON.stringify(cabins, null, 2)}</pre>;
}
```

Why this matters:

- Avoids client-side request waterfalls
- Keeps secrets/server-only logic out of the browser
- Reduces client JavaScript and improves performance

---

### React Server Components RSC

React Server Components (RSC) move most rendering work from the browser to the server.

![n1](https://i.ibb.co.com/r2t6v2c8/N2.png)

![n1](https://i.ibb.co.com/r2CpLFz4/N3.png)

Core idea:

- Server Components execute on the server and do not ship their code to the browser
- Only Client Components ship JavaScript and get hydrated

![n1](https://i.ibb.co.com/gMWnb7qs/N4.png)

Server vs Client Components overview:

![n1](https://i.ibb.co.com/23Xj1WwD/N5.png)

Mental model:

- Server Components = data + structure
- Client Components = interactivity

![n1](https://i.ibb.co.com/1Jht6nCh/N6.png)

Keep Client Components minimal:

![n1](https://i.ibb.co.com/GQKZFw0X/N7.png)

### How RSC Works Internally

React Server Components split rendering into two phases.

- Server phase: render Server Components and fetch data
- Client phase: hydrate only Client Components

Pipeline overview:

![n1](https://i.ibb.co.com/k2D2YxNx/N8.png)

![n1](https://i.ibb.co.com/fGB7PcKB/N9.png)

![n1](https://i.ibb.co.com/jvcSR70x/N10.png)

Streaming fits naturally with Suspense:

- Layout renders immediately
- `loading.js` can stream first
- Server renders the rest when data is ready

Why it’s fast:

- Less JavaScript shipped
- Less hydration work
- Server-only logic never reaches the browser

![n1](https://i.ibb.co.com/dJWsQnN6/N11.png)

![n1](https://i.ibb.co.com/Y7qPqCHs/N12.png)

### RSC vs SSR in Nextjs

RSC and SSR are different concepts that Next.js combines.

Definitions:

- **SSR (Server-Side Rendering)**: a delivery strategy that renders HTML on the server for faster first paint
- **RSC (React Server Components)**: a component execution model where components run on the server and their code does not ship to the client

Illustrations:

![n1](https://i.ibb.co.com/k281vFB1/N13.png)

![n1](https://i.ibb.co.com/s9gB9d26/N14.png)

How they work together:

- Initial request: SSR HTML + RSC payload
- Client navigation: mostly RSC payload updates (SPA-like), preserving client state

Summary comparison:

| Feature | SSR | RSC |
| --- | --- | --- |
| What it is | Rendering/delivery strategy | Component execution model |
| Output | HTML | Serialized React tree (RSC payload) |
| JavaScript sent | Client Components only | Client Components only |
| Hydration needed | Yes (for Client Components) | Server Components never hydrate |

Most important takeaway:

- SSR decides how content is delivered
- RSC decides where components execute

---

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

## Scaffolding Notes

This project was scaffolded using `create-next-app`.

```bash
npx create-next-app@14 tourmate-website
```

Suggested options during setup:

| Option | Choice |
| --- | --- |
| TypeScript | No |
| ESLint | Yes |
| Tailwind CSS | Yes |
| App Router | Yes |
| Import Alias | No |

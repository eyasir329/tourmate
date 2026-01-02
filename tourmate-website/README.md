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

---

## Project Planning

![img](https://i.ibb.co.com/WvTByRN1/P1.png)

## Transition to Building a Real-World Next.js Application

This section marks the shift from **learning Next.js concepts in isolation** to **building a real-world, production-style application**. Instead of experimenting with small demo routes, we now focus on establishing a scalable architecture for **The Wild Oasis** customer-facing website.

This is where the project starts to resemble how modern Next.js applications are built in professional environments.

---

## Key Objectives of This Section

### 1. Establish a Professional Project Structure

You will reorganize the codebase into a **clean, scalable, and maintainable structure**, following widely accepted industry best practices for Next.js App Router projects.

This includes:

- Logical folder organization
- Clear separation of concerns
- Reusable components and layouts

---

### 2. Transition from Demos to Real Development

Up to this point, the focus has been on:

- Understanding routing
- Exploring layouts
- Learning Server vs Client Components
- Experimenting with data fetching

Now, those concepts will be **applied together** to build a cohesive, real product rather than isolated examples.

---

### 3. Project Context

The application built in this section is the **customer-facing website** for **The Wild Oasis**.

- It consumes the **same core data** as the internal hotel management app built earlier in the course
- The emphasis is on **user experience**, **performance**, and **clean UI architecture**
- The app is designed for real users, not just developers

---

## Core Features to Be Implemented

Over the course of this section, the following high-level features will be built:

### 🏕️ Cabin Exploration

A public-facing area where visitors can:

- Browse all available cabins
- View cabin details and pricing
- Explore the resort visually

---

### 📅 Reservations

Authenticated users will be able to:

- Create new reservations
- Update existing bookings
- Cancel reservations when needed

This feature will introduce real-world data mutations and server interactions.

---

### 👤 Guest Accounts

A secure user area where guests can:

- Manage personal profile information
- View booking history
- Access account-specific data

---

## Outcome

By the end of this section, you will have transitioned from a **basic Next.js setup** to a **fully structured, real-world application foundation**, ready for:

- Complex server-side data fetching
- Authentication and authorization
- Full-stack interactivity using Server and Client Components

This marks the point where **Next.js stops being theoretical** and starts becoming a practical tool for building production-ready web applications.

---

## Project Planning & Architecture Overview

Building a production-grade application like **The Wild Oasis** customer website requires a deliberate planning phase. Before writing features, we define **what the app does**, **which technologies it uses**, and **how responsibilities are split between server and client**.

This planning ensures the project scales cleanly and remains maintainable as complexity increases.

---

![img](https://i.ibb.co.com/hJRXtfBQ/P2.png)
![img](https://i.ibb.co.com/99SSMykB/P3.png)

## Project Goals & Core Features

The goal is to build a **customer-facing companion application** that integrates with the same backend used by the internal hotel management system.

The website focuses on three core functional areas:

### 🏕️ Cabin Exploration

Public pages where users can:

- Browse all available cabins
- View detailed cabin information
- Explore pricing, capacity, and availability

These pages are optimized for SEO and fast initial load.

---

### 📅 Reservations

Authenticated users can:

- Create new cabin reservations
- Update existing bookings
- Cancel reservations

This feature introduces server mutations, authorization, and real-time data consistency.

---

### 👤 Guest Management

A private **Guest Area** where users can:

- Authenticate using Google
- Manage personal profile information
- View reservation history and account data

---

## Technology Stack

The project uses a modern, server-first React architecture built around Next.js:

### Core Framework

- **Next.js (App Router)**
  Handles routing, server-side rendering, streaming, layouts, and full-stack data operations using Server Components and Server Actions.

---

### Styling

- **Tailwind CSS**
  Used exclusively for styling. Most utility classes are pre-configured, allowing focus on application logic and architecture rather than design decisions.

![img](https://i.ibb.co.com/ccqH33ps/P4.png)

---

### Backend & Authentication

- **Supabase**

  - PostgreSQL database
  - Authentication services
  - Secure server-side data access

- **NextAuth.js**

  - Handles authentication flows
  - Integrates Google OAuth for social login
  - Works seamlessly with Next.js App Router

---

## Application Architecture

To balance performance, security, and interactivity, the application follows a **hybrid Server / Client Component architecture**.

### Server Components (Default)

Used for:

- Pages
- Data fetching
- Secure backend access
- SEO-critical content

Benefits:

- Zero client-side bundle size
- Direct database access
- Faster Largest Contentful Paint (LCP)

---

### Client Components (Selective)

Used only where necessary:

- Forms
- Buttons
- Interactive UI elements
- State-driven behavior

These components act as **small interactive islands** embedded inside mostly server-rendered pages.

---

### Rendering Strategy

Different pages use different rendering strategies based on their requirements:

| Page Type            | Rendering Mode        | Reason                            |
| -------------------- | --------------------- | --------------------------------- |
| Home, About          | **Static Rendering**  | Maximum performance and SEO       |
| Cabins               | **Dynamic Rendering** | Always show fresh availability    |
| Account / Guest Area | **Dynamic Rendering** | User-specific, authenticated data |

---

## Why This Approach Works

This architecture provides:

- **Excellent performance** through server-first rendering
- **Minimal JavaScript** sent to the browser
- **Secure data access** with no exposed credentials
- **Scalability** as features and complexity grow
- **Clean separation of concerns** between UI, data, and interactivity

By defining these decisions upfront, the project avoids common architectural pitfalls and sets a strong foundation for building a real-world Next.js application.

---

## Organizing the Project Structure

As a Next.js application grows, **project organization becomes critical** for maintainability, scalability, and team collaboration. This section focuses on transitioning from the default scaffold into a **clean, professional structure**, with special emphasis on **component organization**.

---

## Common Component Organization Strategies

There is no single “correct” way to organize React components, but several patterns are commonly used in production projects:

### 1️⃣ Single Global Components Folder

All components live in one top-level `components` directory.

**Pros**

- Simple and easy to understand
- Good for small projects

**Cons**

- Quickly becomes cluttered
- Hard to reason about ownership and responsibility as the app grows

---

### 2️⃣ Route-Based Component Folders

Each route has its own local `components` folder (e.g. `app/cabins/components`).

**Pros**

- Components live close to where they are used
- Clear ownership per route

**Cons**

- Sharing components across routes becomes awkward
- Can lead to duplication

---

### 3️⃣ Atomic Design

Components are grouped by abstraction level (atoms, molecules, organisms, templates).

**Pros**

- Highly systematic
- Works well in large design systems

**Cons**

- Adds conceptual overhead
- Often overkill for most product-focused apps

---

## Chosen Strategy for *The Wild Oasis*

For this project, the goal is **clarity, scalability, and simplicity**.

### 🧼 Keep the `app` Folder Clean

The `app` directory should contain **only**:

- Routes
- Next.js special files (`page.js`, `layout.js`, `loading.js`, etc.)

It should **not** become a dumping ground for reusable UI logic.

---

### 📁 Global `components` Folder

All reusable React components live in a **top-level `components` directory**, outside the `app` folder.

```txt
components/
  ui/
  navigation/
  cabins/
  auth/
```

**Benefits**

- Clear separation between routing and UI logic
- Easy to reuse components across multiple routes
- Scales well as features grow

---

### 🗂️ Internal Categorization

Inside `components`, related components are grouped logically:

- `ui/` → Generic, reusable UI primitives (buttons, spinners, badges)
- `navigation/` → Header, nav links, menus
- `cabins/` → Cabin-related components
- `auth/` → Authentication and user-related UI

This structure reflects **domain-driven design** rather than file-type grouping.

---

## Using Path Aliases

To avoid deeply nested relative imports like:

```js
import Button from "../../../components/ui/Button";
```

Next.js supports **path aliases**.

### The `@` Alias

By default, the `@` alias points to the project root (or `src/` if used).

This enables clean, predictable imports:

```js
import Button from "@/components/ui/Button";
import Navigation from "@/components/navigation/Navigation";
```

**Advantages**

- Readable imports
- No dependency on folder depth
- Easier refactoring

---

## Cleaning Up the Initial Project

Before building real features, the initial scaffold must be cleaned.

### 🧹 Standardize Page Components

- Each `page.js` exports a default component named `Page`
- Remove placeholder text like `Hello Next!`

```js
export default function Page() {
  return <h1>Cabins</h1>;
}
```

---

### 🗑️ Remove Boilerplate & Experiments

- Delete unused files from the learning phase
- Remove experimental code
- Ensure the project reflects **intentional structure**, not tutorials

---

## Why This Matters

This organization:

- Reduces cognitive load
- Encourages reuse
- Keeps routing and UI concerns separate
- Matches how professional Next.js teams structure projects

With a clean foundation in place, the project is now ready to scale into real-world features like authentication, reservations, and complex data fetching.

---

## Styling with Tailwind CSS

**Tailwind CSS** is a modern, utility-first CSS framework that integrates seamlessly with Next.js. Since Tailwind was selected during the initial `create-next-app` setup, the project comes fully configured out of the box.

In **The Wild Oasis** customer website, Tailwind is used to build a clean, modern UI while keeping styling tightly coupled to components.

---

## Core Tailwind Integration in Next.js

When Tailwind is enabled during project creation, Next.js automatically sets up the required tooling:

### `tailwind.config.js`

* Central configuration for Tailwind
* Used to customize:

  * Colors
  * Fonts
  * Spacing
  * Breakpoints
* Can be extended later for branding and design tokens

---

### `postcss.config.js`

* Configures PostCSS to process Tailwind at build time
* Enables features like:

  * Utility generation
  * Vendor prefixing
  * Tree-shaking unused styles

---

### `globals.css`

* Global stylesheet imported in the root layout
* Includes Tailwind’s core directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

This makes all Tailwind utility classes available throughout the application.

---

## Styling Philosophy for This Project

Although Tailwind is the primary styling solution, **this section of the course prioritizes Next.js architecture and logic over manual CSS authoring**.

### Pre-Written Styles

* Most Tailwind class strings are provided
* Reduces cognitive load
* Keeps focus on:

  * Server Components
  * Data fetching
  * Routing
  * Authentication flows

---

### Tailwind vs Styled Components

* The internal management app used **styled-components**
* The customer-facing site uses **Tailwind CSS**, reflecting current industry trends
* Tailwind is increasingly preferred for:

  * Full-stack React apps
  * Server Components
  * Performance-sensitive UIs

---

## Why Tailwind Works Well with Next.js

Tailwind and Next.js complement each other exceptionally well:

### ⚡ Performance

* Tailwind generates **only the CSS that is actually used**
* Results in smaller CSS bundles and faster page loads

---

### 🧠 Developer Experience

* Styles live directly alongside markup
* No context switching between CSS files and components
* Fits naturally with the component-driven mindset of React and Next.js

---

### 📱 Responsive Design

* Mobile-first by default
* Built-in responsive modifiers (`sm:`, `md:`, `lg:`)
* Makes it easy to ensure the Wild Oasis website looks great on all screen sizes

---

## Summary

Using Tailwind CSS in this project provides:

* A modern, scalable styling approach
* Excellent performance characteristics
* A workflow that aligns perfectly with Next.js Server Components

With styling infrastructure in place, the focus can now shift fully toward **building real features**, **fetching data**, and **creating interactive user experiences**.

---

## Metadata & Favicon in Next.js (App Router)

Next.js provides a **built-in, file-based convention** for handling metadata and favicons, improving **SEO** and **UX** with minimal configuration.

---

## 1. Adding Page Metadata

Metadata is defined by exporting a special constant from a `layout.js` or `page.js` file.

### Metadata Basics

* You must export a constant named **`metadata`**
* It must be an **object**
* Supported in both `layout.js` and `page.js`

```js
export const metadata = { ... };
```

### Common Static Metadata Fields

* **`title`**

  * Appears in the browser tab
  * Used as the clickable title in search results
* **`description`**

  * Used by search engines as the page summary

```js
export const metadata = {
  title: "Cabins",
  description: "Explore our luxury cabins",
};
```

---

## 2. Metadata Title Templates

Next.js allows defining a **global title template** in the root layout.

### Why Use Templates?

* Avoid repetition
* Enforce consistent branding
* Child pages only define their unique title segment

### Root Layout Example

```js
// app/layout.js
export const metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel located in the heart of the Italian Dolomites.",
};
```

### Child Page Example

```js
// app/cabins/page.js
export const metadata = {
  title: "Cabins",
};
```

**Final browser tab title:**

```
Cabins | The Wild Oasis
```

---

## 3. Dynamic Metadata (Overview)

For pages that depend on dynamic data (e.g., fetching cabin info):

* Use **`generateMetadata()`**
* Runs on the server
* Can fetch data before setting metadata

> ⚠️ Not covered in this lecture, but fully supported by Next.js.

---

## 4. Adding a Favicon

Next.js 14 uses **automatic file detection** for favicons.

### How It Works

* Place an image file in the **root of the `app/` folder**
* Supported names:

  * `icon.png`
  * `favicon.ico`
  * `icon.jpg`

```txt
app/
 ├─ icon.png
 ├─ layout.js
 └─ page.js
```

### Key Advantages

* No `<link rel="icon">` needed
* Next.js auto-generates `<head>` tags
* Works across all routes automatically

### Best Practice

* Use **PNG**
* Prefer **transparent backgrounds**
* Size: `32×32` or `64×64`

---

## Summary

* Metadata is handled via exported `metadata` objects
* Title templates ensure consistent branding
* Favicons are auto-detected via file conventions
* No manual `<head>` manipulation required

This approach aligns perfectly with **Next.js server-first architecture** and keeps your app **SEO-friendly and maintainable**.


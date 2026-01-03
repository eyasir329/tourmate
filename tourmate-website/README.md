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

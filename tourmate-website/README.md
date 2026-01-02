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

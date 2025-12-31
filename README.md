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
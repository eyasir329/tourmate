# Frontend Started

- server side rendering
- Next.js
- React server components


## Server side rendering(SSR) with Next.js

![N1](https://i.ibb.co.com/TBCz7147/N1.png)
![N2](https://i.ibb.co.com/6JYks15D/N2.png)

## Server-Side Rendering (SSR) vs Client-Side Rendering (CSR)

**Server-Side Rendering (SSR)** generates HTML on the **server** and sends a fully rendered page to the browser.
**Client-Side Rendering (CSR)** sends a minimal HTML shell and relies on JavaScript to render content in the browser.

Modern web development initially shifted heavily toward CSR (React, Vue), but SSR has regained importance for **SEO, performance, and content-heavy applications**.

---

## Comparing Rendering Methods

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

### 1. Static Rendering (SSG)

- HTML generated **at build time**
- Same content served for every request
- Extremely fast and cache-friendly

**Best for:** blogs, documentation, landing pages

### 2. Dynamic Rendering

- HTML generated **per request**
- Can include user-specific or frequently changing data

**Best for:** dashboards, personalized pages, real-time data

![N5](https://i.ibb.co.com/twgJWRgV/N5.png)

---

## Hydration: Adding Interactivity to SSR

After the server sends static HTML:

1. The browser displays content immediately
2. JavaScript loads in the background
3. **Hydration** attaches event listeners and state
4. Page becomes fully interactive

This bridges SSR performance with SPA-like UX.

---

## When to Use Each

### ✅ Use SSR when

- SEO is critical
- Fast first contentful paint matters
- Content is public and crawlable
  **Examples:** e-commerce, blogs, news, marketing sites

### ✅ Use CSR when

- App is highly interactive
- SEO is irrelevant
- App is behind authentication
  **Examples:** admin panels, internal tools, dashboards

---

## Manual Server-Side Rendering (SSR) with Node.js and React

Manually implementing SSR reveals the core mechanics behind frameworks like **Next.js**. At its heart, SSR is simply **rendering React components to HTML on the server and sending that HTML to the browser**.

---

## 1. Setting Up the Node.js Server

A basic Node.js HTTP server is sufficient to handle SSR.

### Initialization

- Create a project using:

  ```bash
  npm init
  ```

### Creating the Server

- Use Node’s built-in `http` module:

  ```js
  http.createServer((req, res) => { ... })
  ```

* Listen on a port (e.g., **8000**) to accept incoming requests.

### Routing

- Inspect `req.url` to determine the route:

  - `/` → render main React app
  - `/test` → send a simple response or alternate render

- Server not restart with new version of code... (nodemon previously)

### Auto-Restart (Development)

- Node.js **v20+** supports:

  ```bash
  node --watch server.js
  ```

* Automatically restarts the server on file changes.

---

## 2. Preparing the React Environment (Node Compatibility)

Node.js does **not** understand JSX or modern ES syntax by default.

### Required Dependencies

- Runtime:

  ```bash
  npm install react react-dom
  ```

- Development (Babel):

  ```bash
  npm install -D @babel/core @babel/preset-env @babel/preset-react @babel/register
  ```

### Babel Registration

- A `start.js` file registers Babel:

  ```js
  require('@babel/register')({
    presets: ['@babel/preset-env', '@babel/preset-react']
  });

  require('./server');
  ```

* This allows Node.js to execute JSX and ES modules on the server.

---

## 3. Rendering React to HTML

This is the **core SSR step**.

### React → HTML

- Use:

  ```js
  import { renderToString } from 'react-dom/server';
  ```

* Convert a React component into an HTML string:

  ```js
  const html = renderToString(<App />);
  ```

### HTML Template

- Use an `index.html` template:

  ```html
  <div id="root">__CONTENT__</div>
  ```

### Server-Side Injection

- On each request:

  1. Read `index.html`
  2. Replace `__CONTENT__` with rendered HTML
  3. Send the result as the response

### Correct Headers

- Required for browser rendering:

  ```js
  res.setHeader('Content-Type', 'text/html');
  ```

---

## 4. The Interactivity Gap (Why SSR Alone Is Not Enough)

At this stage, the app **looks complete but behaves like static HTML**.

### What Works

- Markup is visible
- Data is rendered
- SEO crawlers see full content

### What Breaks

- `useState`, `onClick`, `useEffect` do nothing
- Buttons don’t respond
- No client-side JavaScript is running

### Why?

- The browser received **HTML only**
- React’s runtime logic was never loaded on the client

---

## 5. Hydration (The Missing Piece)

**Hydration** solves the interactivity problem.

- Client downloads the same React bundle
- React matches existing HTML
- Event listeners and state are attached
- Page becomes fully interactive **without re-rendering DOM**

This is what modern frameworks automate.

---

## Key Takeaway

Manual SSR consists of **four fundamental steps**:

1. Run a Node.js server
2. Render React components using `renderToString`
3. Inject HTML into a template
4. Send HTML to the browser

Without hydration, SSR provides **visibility but not interactivity**.

---

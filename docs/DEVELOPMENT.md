# Development guide

## Requirements

- Node.js 18+
- npm

## Setup

```bash
npm install
```

Create `.env.local` in the repo root.

### Required environment variables

Auth.js (NextAuth v5 beta) + Google OAuth:

```bash
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_SECRET="..."  # generate a strong random secret
```

Supabase:

```bash
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
```

Optional (recommended in production):

```bash
AUTH_URL="http://localhost:3000"  # set to your production domain on deploy
```

> Note: `SUPABASE_KEY` should be an anon key. Never commit a Supabase service-role key.

## Run

```bash
npm run dev
```

Open <http://localhost:3000>

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run production server
- `npm run prod` – build + start
- `npm run lint` – run ESLint

## Common tasks

### Lint

```bash
npm run lint
```

### Where to start in the code

- UI components: `app/_components/`
- Data access (Supabase): `app/_lib/data-service.js`
- Server Actions (mutations): `app/_lib/actions.js`
- Auth.js config: `app/_lib/auth.js`
- Route protection: `middleware.js`

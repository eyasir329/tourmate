# Deployment (Vercel + Google OAuth)

This project is a Next.js app, so Vercel is the simplest deployment target.

## 1) Deploy on Vercel

1. Import the GitHub repository in Vercel.
2. Keep the framework preset as **Next.js**.

## 2) Configure environment variables

Set these in **Vercel → Project → Settings → Environment Variables**.

### Auth.js (Google OAuth)

```bash
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_SECRET=...
AUTH_URL=https://YOUR-PROD-DOMAIN
```

### Supabase

```bash
SUPABASE_URL=...
SUPABASE_KEY=...
```

## 3) Update Google Cloud OAuth settings

In **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID**:

### Authorized JavaScript origins

Add:

```txt
https://YOUR-PROD-DOMAIN
```

### Authorized redirect URIs

Add:

```txt
https://YOUR-PROD-DOMAIN/api/auth/callback/google
```

## 4) Redeploy

After changing env vars or OAuth settings, redeploy in Vercel.

## Troubleshooting

- If login redirects to localhost: `AUTH_URL` is missing or incorrect.
- If Google rejects the callback: check the redirect URI matches exactly.
- If guest rows don’t appear in Supabase: check RLS policies on `guests`.

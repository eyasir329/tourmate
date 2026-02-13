# Architecture

## Tech stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Supabase (application data)
- Auth.js / NextAuth v5 beta (Google OAuth + sessions)

## App structure (high level)

The app uses the App Router in `app/`:

- `app/page.js` – home
- `app/about/page.js` – about
- `app/cabins/page.js` – cabins list
- `app/cabins/[cabinid]/page.js` – cabin details
- `app/account/*` – protected account area (profile + reservations)
- `app/api/*` – route handlers (API endpoints)

UI components live in `app/_components/`.

## Data layer (Supabase)

The Supabase client is created in `app/_lib/supabase.js` using:

- `SUPABASE_URL`
- `SUPABASE_KEY`

Reads are implemented in `app/_lib/data-service.js` (examples):

- `getCabins()`, `getCabin(id)`
- `getBookings(guestId)`, `getBooking(id)`
- `getGuest(email)`, `createGuest()`
- `getBookedDatesByCabinId(cabinId)`

## Mutations (Server Actions)

Mutations live in `app/_lib/actions.js` and run on the server:

- `updateProfile(formData)`
- `createBooking(bookingData, formData)`
- `updateReservation(formData)`
- `deleteBooking(bookingId)`

After writes, the UI is refreshed using:

- `revalidatePath(...)`
- `redirect(...)` where appropriate

Important ownership checks:

- Deletes are scoped by both booking `id` and `guestId`.
- Reservation updates verify the booking belongs to the current guest.

## Authentication (Auth.js + Supabase guest sync)

Auth.js configuration lives in `app/_lib/auth.js`.

### Flow

1. User clicks “Continue with Google”
2. Server Action calls `signIn("google", { redirectTo: "/account" })`
3. Google OAuth callback handled under `/api/auth/*`
4. Auth.js callback `signIn` runs and ensures a “guest” exists in Supabase
5. `session` callback enriches the session with `session.user.id = guest.id`

### Why “guest sync” exists

OAuth identifies the user, but your domain logic needs a stable DB row ID to associate bookings with. This repo creates/looks up a guest by email and attaches the DB id onto the session.

## Route protection (middleware)

`middleware.js` uses `auth` as middleware and protects `/account` routes via:

```js
export const config = { matcher: ["/account"] };
```

If there is no session, users are redirected into the sign-in flow.

## API endpoints

- `GET /api/cabins/[cabinid]` returns cabin details + booked dates.

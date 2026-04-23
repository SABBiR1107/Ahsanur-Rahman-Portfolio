# Portfolio (Next.js + Drizzle + Better Auth + Supabase)

## Prerequisites

- Node.js 18+
- npm
- A Supabase project

## Environment Setup

Create/update `.env` with:

```env
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
BETTER_AUTH_SECRET=[LONG_RANDOM_SECRET]
```

## Install Dependencies

```bash
npm install
```

## Generate and Run Database Migrations

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Run the App

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Data and auth are configured for Supabase Postgres.
- API routes in `src/app/api/*` keep the same endpoint structure.

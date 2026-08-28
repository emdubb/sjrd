# Sacramento Junior Roller Derby

This repository is a monorepo for the Sacramento Junior Roller Derby web landing site, Expo app splash page, and Supabase backend schema.

## Structure

- `apps/web` — Next.js public landing site
- `apps/app` — Expo Router app splash page
- `packages/backend` — Supabase schema and seed data
- `packages/types` — shared type package for generated database types

## Local setup

1. Install `pnpm` and Node 20+.

   macOS (Homebrew):

   ```bash
   brew install pnpm
   node -v    # verify Node 20+
   pnpm -v    # verify pnpm is available
   ```

2. Run `pnpm install` from the repo root.
3. Install the Supabase CLI locally or globally.
4. Copy environment files from example files in each app, then update them to match your local Supabase instance.
5. Start the local Supabase stack from the backend package:
   - `pnpm db:start`
6. Seed data:
   - `pnpm db:seed`
7. Run the web app:
   - `pnpm dev:web`
8. Run the Expo web app:
   - `pnpm dev:app`

## Notes

- `apps/web` and `apps/app` both use Supabase for the demo user fetch.
- `packages/backend/migrations/0001_init.sql` creates a simple `users` table.
- `packages/backend/seed.sql` inserts one seeded user record.

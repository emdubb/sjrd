# Deployment Guide

**Status:** Draft
**Date:** 2026-08-28
**Audience:** Human maintainers and AI coding agents deploying this repo. Complements `reference/ARCHITECTURE.md` (the "why"); this document is the "how."

## Current State

| Component                           | Status                                                                                                                                                                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/web`                          | Next.js public site. Single demo/landing page. Not yet deployed anywhere.                                                                                                                                                                          |
| `apps/app`                          | Expo Router app. Dashboard + calendar UI now read/write live Supabase data via `src/lib/events.ts` (`event_instances`, `event_series`, `teams`, `event_teams`). `mockEvents.ts` now holds shared types/formatting only. Not yet deployed anywhere. |
| `packages/backend`                  | Supabase schema (`migrations/0001_init.sql`) implements the full ADR data model (`profiles`, `teams`, `event_instances`, `attendances`, `push_tokens`, etc.). No hosted Supabase project linked yet.                                               |
| `packages/types`                    | DB types generated from the real schema above (matches `profiles`, not the stale demo schema — see Known Issues).                                                                                                                                  |
| `packages/api-client`               | Shared `supabase-js` client, used by both apps.                                                                                                                                                                                                    |
| `.github/workflows/deploy.yml`      | Runs lint, typecheck, `build:web` / `build:app`, and (new) auto-pushes migrations to the **dev** Supabase project on every push to `main`. **Cloudflare Pages and EAS deploy steps still don't exist** — only the Supabase piece is wired so far.  |
| `.github/workflows/deploy-prod.yml` | New. Manual-only (`workflow_dispatch`) job that pushes migrations to the **prod** Supabase project, gated by a `production` GitHub Environment.                                                                                                    |
| `eas.json` / `wrangler.toml`        | Do not exist yet — need to be generated as part of first Cloudflare/EAS deploy.                                                                                                                                                                    |

Target hosting, per `reference/ARCHITECTURE.md`: **Cloudflare Pages** for `apps/web` and `apps/app`'s web export, **EAS Build** for native iOS/Android, **Supabase** (hosted) for the backend, **Resend** for email.

## Known Issues to Fix Before Deploying

- **`apps/web/pages/index.tsx` and `packages/backend/seed.sql` reference a `users` table that doesn't exist.** The real schema (`migrations/0001_init.sql`) defines `profiles`, not `users` — this is leftover from the very first scaffold and was never reconciled. Effects:
  - `pnpm db:seed` fails (`insert into users` has no target table).
  - The public site's demo fetch will always show "Error loading user" against a real Supabase project (no local-only fallback).
  - **Fix:** remove the Supabase fetch from `apps/web/pages/index.tsx` (the public site shouldn't need backend calls per the ADR) and delete/rewrite `seed.sql` to seed real tables (`profiles`, `teams`, etc.) if seed data is still wanted for demos.

## Supabase Environments (local → dev → prod)

Three tiers, promoted in one direction only. **Migration files in `packages/backend/supabase/migrations/` are the single source of truth for schema in every tier** — never hand-edit schema in the dev or prod dashboards, or the tiers drift and `db push` starts failing with conflicts.

| Tier  | Purpose                                                                                                                     | How schema gets there                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Local | Day-to-day schema work against the Supabase CLI's local Postgres.                                                           | `supabase migration new <name>` → edit SQL → `pnpm db:reset` / `supabase db reset`                                                    |
| Dev   | The hosted project already created — integration testing against real Postgres/Auth/RLS before anything reaches real users. | Automatic: `pnpm db:push:dev`, and CI runs this on every push to `main` (see `db-push-dev` job).                                      |
| Prod  | A separate hosted Supabase project, created only when going live. Never shares a project with dev.                          | Manual/gated: `pnpm db:push:prod`, or the `Push Migrations to Production` GitHub Action (`workflow_dispatch` only — never automatic). |

### 1. Stand up the two hosted Supabase projects

1. **Dev** — already exists; treat it as the integration/staging tier going forward.
2. **Prod** — create a second, separate project at supabase.com when you're ready to go live (free tier to start — auto-pauses after 7 days idle; see the ADR's cost table for when to upgrade to Pro).
3. For each project, grab from Settings → Database: the project ref and DB password (for CLI pushes), and from Settings → API: the URL, `anon` key, and `service_role` key (for app runtime config).
4. Copy `packages/backend/.env.example` to `packages/backend/.env` and fill in `SUPABASE_ACCESS_TOKEN` (from your [Supabase account tokens page](https://supabase.com/dashboard/account/tokens)) plus the dev/prod project ref + DB password pairs, so `pnpm db:push:dev` / `pnpm db:push:prod` work from your machine.
5. Push the schema to dev now: `pnpm db:push:dev` (applies `migrations/0001_init.sql`). Leave prod unpushed until you're actually ready to launch.
6. Seed data (after fixing `seed.sql` per Known Issues above) targets local/dev only — never seed prod with demo data.

### 2. GitHub setup (one-time, manual)

The CI wiring in `deploy.yml` / `deploy-prod.yml` expects these repo secrets (Settings → Secrets and variables → Actions):

- `SUPABASE_ACCESS_TOKEN` — same personal access token as above.
- `SUPABASE_DEV_PROJECT_REF`, `SUPABASE_DEV_DB_PASSWORD`
- `SUPABASE_PROD_PROJECT_REF`, `SUPABASE_PROD_DB_PASSWORD`

Both jobs also reference GitHub Environments (`dev` and `production`) — create these under Settings → Environments. For `production`, add a required reviewer so pushing migrations to prod always needs a manual approval click, even though the workflow itself is `workflow_dispatch`-only. This is the safety net for a solo maintainer: no automatic path to prod, and even the manual path has a confirmation step.

### 3. Deploy `apps/web` to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect the GitHub repo.
2. Build settings: root directory `apps/web`; build command `pnpm install --frozen-lockfile && pnpm --filter @sjrd/web build`; output via Cloudflare's Next.js adapter (`@cloudflare/next-on-pages` or Cloudflare's native Next.js support) — plain `next build` output alone isn't Pages-compatible.
3. Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — use the **prod** Supabase project's values here (the public site should point at prod once it's live).
4. Deploy, then attach the apex domain under Pages → Custom domains.

### 4. Deploy `apps/app`'s web export to Cloudflare Pages

1. Create a second Pages project on the same repo.
2. Build settings: root directory `apps/app`; build command `pnpm install --frozen-lockfile && pnpm --filter @sjrd/app build` (runs `expo export --platform web`); output directory `dist`.
3. Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` — set the `main`-branch (production) deploy to the **prod** project's values, and any preview/non-main deploys to the **dev** project's values, so preview builds never touch prod data.
4. Attach `app.yourdomain.org` as the custom domain, per the ADR's subdomain split.

### 5. Wire the remaining deploys into CI

`deploy.yml` builds but doesn't yet deploy `apps/web`/`apps/app`. Add deploy jobs (e.g. `cloudflare/pages-action`) gated on `main`, depending on the existing build jobs, using `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` GitHub Actions secrets. This keeps both Pages projects in "direct upload" mode (Actions builds, Cloudflare just serves) so the existing lint/typecheck gate blocks bad deploys. (The Supabase migration jobs are already wired — see above.)

### 6. Native builds (iOS/Android, when ready)

1. `pnpm --filter @sjrd/app exec eas login`, then `eas build:configure` to generate `eas.json`.
2. Store `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` as EAS secrets (`eas secret:create`).
3. `eas build --platform ios` / `--platform android`. Requires an active Apple Developer account ($99/yr) and Google Play registration ($25 one-time).
4. Submit via `eas submit`.

### 7. Domain, DNS, and deep linking

1. Point the registrar's DNS at Cloudflare for both the apex domain and the `app` subdomain.
2. Once native builds exist, add `apple-app-site-association` and `assetlinks.json` under `apps/web/public/.well-known/` so Universal/App Links work (not needed for the initial web-only deploy).

## Suggested Order of Operations

1. Fix the `users`/`profiles` mismatch (Known Issues).
2. Set `SUPABASE_ACCESS_TOKEN` + dev project ref/password locally, run `pnpm db:push:dev`, and confirm `apps/app` reads/writes correctly against it (it already targets `event_instances` etc. via `src/lib/events.ts`).
3. Add the GitHub secrets and `dev`/`production` Environments so CI's `db-push-dev` job and the manual `deploy-prod.yml` workflow work.
4. Deploy `apps/web` — it's functionally complete and public-facing.
5. Create the prod Supabase project, push migrations via the manual `Push Migrations to Production` workflow, then deploy `apps/app`'s web export to Cloudflare Pages.
6. Add the Cloudflare Pages deploy jobs so future merges to `main` ship the frontends automatically.
7. Tackle native builds (EAS) once the web app is stable in production.

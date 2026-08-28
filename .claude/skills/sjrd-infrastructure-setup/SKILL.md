---
name: sjrd-infrastructure-setup
description: 'Infrastructure setup and deployment guidance for the Sacramento Junior Roller Derby monorepo. Use this skill to scaffold local development, hosting, and deployment files for the web landing site, Expo app, and Supabase backend.'
---

# SJRD Infrastructure Setup

This skill defines the infrastructure and file scaffolding needed to support:

- `apps/web`: public landing site (Next.js)
- `apps/app`: authenticated app shell / splash page (Expo Router Web)
- `packages/backend`: shared backend schema and seed data files for Supabase
- `packages/types`: shared TypeScript types generated from the database
- `github/workflows`: CI/CD for deployments and local checks

Use this skill when creating or extending the repository bootstrap, deployment pipeline, local dev scripts, and database-backed demo pages.

## Goals

1. Scaffold a working monorepo structure for local development.
2. Provide a public landing page that can fetch a backend user name.
3. Provide an app splash page that also fetches a backend user name.
4. Seed a simple `users` table with one record.
5. Create deployment pipeline files for Cloudflare Pages, Supabase, and EAS.
6. Offer developer guidance so future contributors can build consistently.

## Required Files and Structure

- `package.json`
- `pnpm-workspace.yaml`
- `apps/web/package.json`
- `apps/web/next.config.mjs`
- `apps/web/pages/index.tsx`
- `apps/web/src/lib/supabaseClient.ts`
- `apps/app/package.json`
- `apps/app/app.json` or `app.config.ts`
- `apps/app/app/(index).tsx`
- `apps/app/src/lib/supabaseClient.ts`
- `packages/backend/schema.sql`
- `packages/backend/seed.sql`
- `packages/backend/supabase/.env.example`
- `packages/types/README.md`
- `.github/workflows/deploy.yml`
- `README.md`

## Local Development Setup

1. Install pnpm and Node 20+.
2. Run `pnpm install` from repo root.
3. Create local environment files:
   - `apps/web/.env.local`
   - `apps/app/.env`
   - `packages/backend/supabase/.env`
4. Use Supabase CLI for local dev or connect to a dev Supabase project.
5. Run `pnpm dev --filter apps/web` and `pnpm dev --filter apps/app`.

## Backend Schema

- Create `users` table with `id`, `full_name`, `email`.
- Seed one user named `Alex Roller`.
- Expose simple REST query via Supabase and shared client.

## Web Landing Page

- Simple Next.js homepage with a hero section.
- Fetch `/api/user` or call Supabase directly from the browser.
- Display `Hello, {user.full_name}` with a CTA.

## App Splash Page

- Simple Expo Router page with a styled splash screen.
- On mount, load the same user record and show the name.
- Use the same Supabase backend client package.

## Deployment Pipeline

- Cloudflare Pages deploy for both `apps/web` and `apps/app`
- Supabase deploy for schema and local migrations
- EAS build trigger stub for native builds
- GitHub Actions workflow with build/test/deploy jobs

## Developer Guidelines

- Keep shared API client code under `packages/api-client` or `apps/*/src/lib`.
- Prefer environment variables for all backend endpoints and keys.
- Use the `sacramento-roller-derby-brand` skill for UI design consistency.
- Use explicit names and consistent folder names between web and app.

## Questions to Clarify

- Do you want the backend to run locally with Supabase CLI or only against a hosted Supabase project?
- Should the app splash page be a fully authenticated page or a public demo page for now?
- Do you want the seed data to be created from SQL only, or via a Node script / migration tool?
- Will the initial user fetch be done using Supabase client directly in both sites, or should the web app call a Next.js API route?

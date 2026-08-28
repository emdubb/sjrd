# ADR-0001: Youth League Platform — Architecture

**Status:** Accepted
**Date:** 2026-08-03
**Deciders:** Bull (solo engineer/maintainer, nonprofit youth sports league)
**Audience:** This document is intended for both human maintainers and AI coding agents scaffolding or extending this project. Decisions and rationale are stated explicitly so they can be acted on without additional context.

## Context

The organization is a nonprofit youth sports league that needs a platform covering:

- Public informational pages (league info, coaches, about) — no login required
- Member signups for a training program
- A member-facing view of schedules, with notifications
- Coach tools for planning
- Admin controls (roles: member, coach, admin)

Constraints:

- **Low hosting cost** — nonprofit budget, must stay cheap at low-to-moderate scale
- **Static public pages + login** — public content must not require auth; authenticated areas must exist alongside it
- **Mobile app required**, must run on iOS, Android, **and web**, from a single codebase (hybrid, one team to maintain)
- **Push notifications** are a priority for schedule/training updates
- **Built by one proficient engineer**, but must be maintainable long-term with minimal ongoing operational burden (no team of DevOps/SRE to lean on)

## Decision

Build a two-application system sharing one backend:

1. **Public site** (`yourdomain.org`) — Next.js, statically generated. League info, coach bios, about, signup landing/CTA. No auth.
2. **App** (`app.yourdomain.org` + native iOS/Android builds) — Expo + Expo Router, targeting iOS, Android, and Web from one codebase (React Native Web). Contains everything behind login: member schedule view, notifications, coach planning tools, admin controls.
3. **Backend** — Supabase (managed Postgres + Auth + Row Level Security + Storage + Edge Functions). No hand-written REST/GraphQL API server; both clients call Supabase directly via `supabase-js`, authorized by RLS policies tied to the user's role.
4. **Notifications** — Expo push service for native iOS/Android; browser Web Push (VAPID) for the web build; Resend for transactional email as the reliable fallback channel.
5. **Language** — TypeScript across both frontends and all backend logic (Edge Functions), in a single monorepo with shared `types` and `api-client` packages.

## Options Considered

### Frontend/mobile split

#### Option A: Two separate apps — Next.js (public + portal) and Expo (mobile only)
| Dimension | Assessment |
|---|---|
| Complexity | Medium — two codebases, some shared types |
| Cost | Low |
| SEO/content quality | High (Next.js SSG) |
| Maintenance | Two UIs to update in parallel for portal features |

#### Option B: Everything in Expo (Expo Router web export for public pages too)
| Dimension | Assessment |
|---|---|
| Complexity | Low — one codebase for all three platforms + web |
| Cost | Low |
| SEO/content quality | Lower — React Native Web is optimized for app UI, not content-heavy public pages; static web export for Expo Router is less mature than Next.js SSG |
| Maintenance | Lowest — single UI codebase |

#### Option C (chosen): Next.js for public content, Expo (iOS + Android + Web) for the authenticated app
| Dimension | Assessment |
|---|---|
| Complexity | Medium — two codebases, but cleanly divided by responsibility (content vs. app) rather than duplicated |
| Cost | Low |
| SEO/content quality | High for public pages (Next.js), and irrelevant for the app (auth-gated, not discovered via search) |
| Maintenance | Low — Expo Router already produces the web build "for free" from the same code as iOS/Android; no separate portal implementation needed in Next.js |

**Rationale:** The public pages (league info, coach bios) are genuine content that benefits from Next.js's SSG strengths (SEO, image handling, flexible layout). The authenticated app (schedules, coach tools, admin) is used deliberately by logged-in users, not discovered via search, so React Native Web's app-shaped primitives are a good fit there and cost nothing extra — Expo Router already builds to web alongside iOS/Android from one codebase. This gives the lowest-maintenance split without sacrificing public-page quality.

### Backend

#### Option A: Custom Node/Express (or similar) API + hosted Postgres
**Pros:** Full control over API contract and business logic.
**Cons:** You own provisioning, patching, scaling, and monitoring a server. Auth has to be built or bolted on. Meaningfully more ongoing operational burden for a solo maintainer.

#### Option B: Firebase (Firestore + Auth + Cloud Messaging)
**Pros:** Very mature native push notification integration (FCM).
**Cons:** Firestore's document model is a weaker fit for this domain's relational data (teams, rosters, sessions, signups, attendance all have real foreign-key relationships). More vendor lock-in — no open-source self-host path.

#### Option C (chosen): Supabase (Postgres + Auth + RLS + Storage + Edge Functions)
**Pros:** Relational data model fits the domain well. Row Level Security enforces the member/coach/admin permission model at the database layer, so both clients (Next.js and Expo) get consistent authorization automatically — no duplicated logic. Auto-generated REST API (PostgREST) means no server to write or host for standard CRUD. Open source and Postgres-based, so it's portable if a future maintainer ever needs to move off it. Generous free tier.
**Cons:** Coupled to Supabase's RLS/PostgREST conventions; complex multi-step business logic that isn't pure data access needs Edge Functions rather than a general-purpose API layer.

**Rationale:** Given the low-cost and low-maintenance constraints, avoiding a self-hosted API server is the single highest-leverage decision in this stack. Supabase's relational model and RLS-based authorization map directly onto the member/coach/admin role structure this app needs.

### API layer

**Decision:** No hand-written API server. Clients call Supabase's auto-generated REST API (PostgREST) directly via `supabase-js`, authorized by RLS policies keyed off the authenticated user's role. Supabase Edge Functions (small serverless TypeScript functions) handle anything that needs elevated privilege or isn't pure data access: sending push notifications, processing a payment webhook (if/when added), cron-triggered reminders (e.g., night-before-session notifications).

**When to revisit:** If business logic grows complex enough that expressing it in RLS/SQL and Edge Functions becomes awkward, or a stable versioned contract is needed for a third-party integration, add a thin layer (tRPC or a few API routes) in front of Supabase rather than replacing it.

## System Overview

```
                        ┌─────────────────────────┐
   Public (no auth)     │   yourdomain.org         │
   ────────────────►    │   Next.js (SSG)          │
                        │   League info, coaches   │
                        └───────────┬───────────────┘
                                    │ deep links (Universal/App Links)
                                    ▼
┌───────────────┐   ┌─────────────────────────────┐   ┌───────────────┐
│  iOS (native)  │   │  app.yourdomain.org          │   │ Android(native)│
│  Expo build    │◄──┤  Expo Router (web export)    ├──►│  Expo build    │
└───────┬────────┘   │  Schedules, notifications,   │   └───────┬────────┘
        │             │  coach planning, admin       │           │
        │             └───────────────┬───────────────┘           │
        │                             │ supabase-js                │
        └─────────────────────────────┼─────────────────────────────┘
                                       ▼
                        ┌─────────────────────────────┐
                        │  Supabase                    │
                        │  - Postgres (RLS enforced)   │
                        │  - Auth (JWT)                │
                        │  - Storage                    │
                        │  - Edge Functions             │
                        │    (notifications, cron,      │
                        │     future webhooks)          │
                        └───────────┬───────────────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     ▼                              ▼
           Expo Push Service              Resend (transactional email)
           (native push)                  + Web Push/VAPID (web app)
```

## Authentication & Authorization

- **Auth:** Supabase Auth (email/password and/or magic link) issues a JWT used by all three clients (iOS, Android, web app).
- **Roles:** Seven user types — `guardian`, `skater`, `coach`, `trainer`, `medic`, `official`, `admin` — stored in a `profile_user_types` join table keyed to a `profiles` record (which extends `auth.users`). A single profile can hold multiple types (e.g. a coach who is also a guardian). See `DATA.md` for per-type permission definitions.
- **Enforcement:** Row Level Security policies on every table reference the requesting user's type(s) and relationships (e.g., a coach can write attendance for events they are assigned to; a skater can read their own roster and attendance; a guardian can read their children's events; an admin can read/write everything). This is enforced at the database layer, so there is no separate authorization code path to keep in sync across clients.
- **Deep linking:** iOS Universal Links and Android App Links tie native apps to `yourdomain.org`/`app.yourdomain.org` URLs via `apple-app-site-association` and `assetlinks.json`, served as static files from the Next.js app's `/.well-known/` path. A link (in a push notification or email) to a schedule page opens the native app if installed, or falls back to the web app/public site in-browser if not. Also used for auth email redirects (magic link, password reset).

## Data Model

See `reference/DATA.md` for the full schema. Key tables:

- `profiles` — extends `auth.users`; holds league-specific fields (names, derby name, skater number, phone, status)
- `profile_user_types` — join table assigning one or more user types to a profile
- `guardian_relationships` — links guardian profiles to child (skater) profiles
- `locations` — venues; one flagged `is_default` as the league home rink
- `teams` / `team_members` — teams and their skater rosters
- `registrations` — skater applications to the league program (pending | approved | waitlisted | rejected)
- `event_series` — recurring event templates with RRULE
- `event_instances` — individual occurrences; join tables for teams, coaches, and medics
- `rosters` — skaters selected for a game event, with `is_alternate` flag
- `attendances` — per-skater attendance per event (present | partial | absent | excused)
- `push_tokens` — per-device Expo push tokens, pruned on `DeviceNotRegistered` error
- `notification_log` — audit log of automated notifications sent; prevents duplicate sends on Edge Function retry
- `drills` / `drill_drill_types` — coach drill library

RLS policy sketch: skaters can `select` their own profile, events, attendance, and roster entries; guardians can `select` children's events and attendance; coaches can `select`/`update` events and attendance for events they are assigned to via `event_coaches`; admins bypass all restrictions via a role check in each policy.

## Notifications

- **Native (iOS/Android):** Expo push service (built on FCM/APNs), free, integrates directly with the Expo build.
- **Web app:** Browser Web Push (service worker + VAPID keys). Treat as best-effort — browser support and reliability (especially Safari) are less consistent than native push.
- **Email (all platforms):** Resend, used as the reliable fallback for anything notification-worthy (signup confirmation, schedule changes, session reminders).
- **Triggering:** Supabase Edge Functions, invoked either on a database event (e.g., new signup → confirmation) or on a schedule via cron (e.g., reminder the evening before a session).

## Deployment & Hosting

| Component | Host | Why |
|---|---|---|
| Next.js public site | Cloudflare Pages | Free tier explicitly allows commercial/nonprofit use, unlimited bandwidth — cleaner fit than Vercel's Hobby tier, which is personal-use-only by ToS |
| Expo web export (app) | Cloudflare Pages (separate project, `app.yourdomain.org`) | Same reasoning as above |
| Native iOS/Android builds | EAS Build | Free tier: 15 iOS + 15 Android builds/month, sufficient for infrequent releases |
| Database/Auth/Storage/Functions | Supabase | See Backend decision above |
| Email | Resend | Free tier: 3,000 emails/month (100/day cap) |
| DNS/domain | Any registrar | ~$12–20/year |

## Cost Breakdown

| Item | Cost | Notes |
|---|---|---|
| Cloudflare Pages (both static sites) | $0 | Free tier, no bandwidth limit, commercial use allowed |
| Supabase | $0 to start, $25/mo (Pro) later | Free: 500MB DB, 50K MAUs, 1GB storage, 5GB egress. **Free projects pause after 7 days of inactivity** — relevant for a seasonal league with an off-season; Pro removes this |
| EAS Build | $0 | Free tier covers infrequent app releases (15+15 builds/mo) |
| Resend | $0 | Free tier: 3,000 emails/mo |
| Apple Developer Program | $99/year | Mandatory, recurring, required for iOS App Store distribution |
| Google Play | $25 one-time | One-time registration fee, no recurring cost |
| Domain | ~$12–20/year | |

**Estimated total:** ~$0/month in active hosting costs to start; effectively ~$8–10/month once the Apple fee is amortized. Expect to add Supabase Pro ($25/mo) once the league is active enough that the inactivity-pause becomes a problem, or once free-tier limits are exceeded — bringing steady-state cost to roughly $25–35/month.

## Consequences

- **Easier:** No server to provision or patch. Authorization logic lives in one place (RLS) instead of being duplicated across clients. The web app ships "for free" from the same Expo codebase as the native apps. Very low fixed monthly cost.
- **Harder:** Business logic that doesn't map cleanly to CRUD + RLS needs to live in Edge Functions, which are less flexible than a full application server. Web push notifications are less reliable than native and need an email fallback to compensate. React Native Web app UI will look and feel more "app-like" than "website-like," which is intentional but worth setting expectations on.
- **To revisit:** Whether training program signups will collect payment (Stripe integration would hang off an Edge Function webhook — not yet designed). Whether Supabase Pro is needed sooner than expected due to the inactivity-pause behavior during the league's off-season.

## Action Items

1. [ ] Scaffold monorepo (pnpm workspaces) with `apps/web` (Next.js), `apps/app` (Expo Router), `packages/types`, `packages/api-client`
2. [ ] Stand up Supabase project; define initial schema and RLS policies per the proposed data model above
3. [ ] Generate TypeScript types from the Supabase schema (`supabase gen types`) and wire into `packages/types`
4. [ ] Implement auth flows (signup/login, role assignment) in the Expo app
5. [ ] Set up `apple-app-site-association` and `assetlinks.json` for deep linking
6. [ ] Configure Expo push + Web Push (VAPID) + Resend, and a first Edge Function for a triggered notification
7. [ ] Deploy Next.js and Expo web export to Cloudflare Pages; configure EAS Build for native
8. [ ] Decide on payment handling for training program signups (if applicable) and design the Stripe/Edge Function integration

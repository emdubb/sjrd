# Data Design

See `ARCHITECTURE.md` for backend decisions (Supabase, RLS enforcement, Edge Functions).

---

## Shared Fields

Every table includes:

| Field        | Notes                             |
| ------------ | --------------------------------- |
| `created_at` | Timestamp, set on insert          |
| `updated_at` | Timestamp, updated on every write |
| `created_by` | FK to `profiles.id`               |
| `updated_by` | FK to `profiles.id`               |

---

## Profiles

Extends Supabase `auth.users`. The `id` column is a foreign key to `auth.users.id` — Supabase Auth owns the record; this table holds league-specific fields.

| Field            | Type | Notes                                     |
| ---------------- | ---- | ----------------------------------------- |
| `id`             | uuid | FK to `auth.users`, primary key           |
| `first_name`     | text |                                           |
| `last_name`      | text |                                           |
| `preferred_name` | text | Optional                                  |
| `derby_name`     | text | Optional                                  |
| `skater_number`  | text | Optional                                  |
| `phone`          | text | Required for all user types except Skater |
| `status`         | enum | `active` (default) \| `inactive`          |

---

## User Types

A profile can hold one or more user types, stored in a join table. Each type carries defined permissions enforced via RLS policies.

| Type       | Permissions                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `guardian` | Read own profile; read children's profiles, events, and attendance; receive notifications for children |
| `skater`   | Read own profile, events, attendance, and roster entries                                               |
| `coach`    | Read/write events they are assigned to; read/write attendance; read rosters; read team member profiles |
| `trainer`  | Read events they are assigned to; read skater profiles on those events                                 |
| `medic`    | Read events they are assigned to; read basic profile info for assigned events                          |
| `official` | Read game events and rosters                                                                           |
| `admin`    | Full read/write access to all data                                                                     |

### profile_user_types

| Field        | Notes                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------- |
| `profile_id` | FK to `profiles`                                                                         |
| `user_type`  | enum: `guardian` \| `skater` \| `coach` \| `trainer` \| `medic` \| `official` \| `admin` |

Unique on (`profile_id`, `user_type`).

---

## Guardian Relationships

Links a guardian profile to a child (skater) profile. Must be unique — a guardian/child pair cannot be duplicated.

| Field                 | Notes            |
| --------------------- | ---------------- |
| `guardian_profile_id` | FK to `profiles` |
| `child_profile_id`    | FK to `profiles` |

Unique on (`guardian_profile_id`, `child_profile_id`).

---

## Locations

Stores venues used by events. One location should be flagged as the league default; events with no explicit location assigned fall back to it.

| Field        | Type    | Notes                                        |
| ------------ | ------- | -------------------------------------------- |
| `name`       | text    |                                              |
| `address`    | text    | Optional                                     |
| `notes`      | text    | Optional                                     |
| `is_default` | boolean | Only one location should be `true` at a time |

---

## Teams

| Field  | Notes |
| ------ | ----- |
| `name` |       |

### team_members

| Field        | Notes                     |
| ------------ | ------------------------- |
| `team_id`    | FK to `teams`             |
| `profile_id` | FK to `profiles` (skater) |

Unique on (`team_id`, `profile_id`).

---

## Registrations

Tracks a skater's application to join the league program.

| Field           | Type      | Notes                                                 |
| --------------- | --------- | ----------------------------------------------------- |
| `profile_id`    | FK        | `profiles`                                            |
| `status`        | enum      | `pending` \| `approved` \| `waitlisted` \| `rejected` |
| `notes`         | text      | Optional — admin notes on the registration            |
| `registered_at` | timestamp |                                                       |

---

## Event Series

Defines a recurring event template. Individual occurrences are generated as Event Instances from this record.

| Field               | Type | Notes                                                  |
| ------------------- | ---- | ------------------------------------------------------ |
| `title`             | text |                                                        |
| `description`       | text | Optional                                               |
| `location_id`       | FK   | `locations`, nullable — falls back to default location |
| `series_date_start` | date |                                                        |
| `series_date_end`   | date | Optional — null means open-ended                       |
| `start_time`        | time |                                                        |
| `end_time`          | time |                                                        |
| `recurrence_rule`   | text | iCal RRULE string                                      |

---

## Event Instances

A single occurrence of an event, either standalone or generated from a series.

| Field                 | Type | Notes                                                  |
| --------------------- | ---- | ------------------------------------------------------ |
| `series_id`           | FK   | `event_series`, nullable — null means one-off event    |
| `event_type`          | enum | `game` \| `practice` \| `scrimmage` \| `other`         |
| `title`               | text |                                                        |
| `description`         | text | Optional                                               |
| `topics`              | text | Optional                                               |
| `notes`               | text | Optional                                               |
| `status`              | enum | `scheduled` (default) \| `cancelled`                   |
| `location_id`         | FK   | `locations`, nullable — falls back to default location |
| `date_start`          | date |                                                        |
| `date_end`            | date | Optional                                               |
| `original_start_time` | time | Preserved when start time is changed                   |
| `start_time`          | time |                                                        |
| `end_time`            | time |                                                        |

**Relationships:** teams via `event_teams`; coaches via `event_coaches`; medics via `event_medics`; skater attendance via `attendances`; game roster via `rosters`; planned drills (practice events) via `event_drills`.

### event_teams

| Field      | Notes                   |
| ---------- | ----------------------- |
| `event_id` | FK to `event_instances` |
| `team_id`  | FK to `teams`           |

Unique on (`event_id`, `team_id`).

### event_coaches

| Field        | Type    | Notes              |
| ------------ | ------- | ------------------ |
| `event_id`   | FK      | `event_instances`  |
| `profile_id` | FK      | `profiles` (coach) |
| `is_primary` | boolean |                    |

Unique on (`event_id`, `profile_id`).

### event_medics

| Field        | Notes                    |
| ------------ | ------------------------ |
| `event_id`   | FK to `event_instances`  |
| `profile_id` | FK to `profiles` (medic) |

Unique on (`event_id`, `profile_id`).

### event_drills

The ordered practice plan for a practice event.

| Field      | Type    | Notes                                 |
| ---------- | ------- | ------------------------------------- |
| `event_id` | FK      | `event_instances`                     |
| `drill_id` | FK      | `drills`                              |
| `position` | integer | Sort order within the practice's plan |

Unique on (`event_id`, `drill_id`).

---

## Rosters

The list of skaters selected to skate in a game event. Constrained to events of type `game`.

| Field          | Type    | Notes                                    |
| -------------- | ------- | ---------------------------------------- |
| `event_id`     | FK      | `event_instances` (game type)            |
| `profile_id`   | FK      | `profiles` (skater)                      |
| `is_alternate` | boolean | True if skater is listed as an alternate |

Unique on (`event_id`, `profile_id`).

---

## Attendances

Tracks skater attendance at any event type.

| Field        | Type | Notes                                           |
| ------------ | ---- | ----------------------------------------------- |
| `event_id`   | FK   | `event_instances`                               |
| `profile_id` | FK   | `profiles` (skater)                             |
| `status`     | enum | `present` \| `partial` \| `absent` \| `excused` |

Unique on (`event_id`, `profile_id`).

---

## Push Tokens

When a user grants notification permission, Expo issues a push token per device. A single profile can have tokens across multiple devices. Tokens must be stored to deliver targeted push notifications.

Tokens expire silently — the Expo push API returns a `DeviceNotRegistered` error for invalid tokens. Those records should be deleted on receipt of that error.

| Field          | Type      | Notes                                                               |
| -------------- | --------- | ------------------------------------------------------------------- |
| `profile_id`   | FK        | `profiles`                                                          |
| `token`        | text      | Expo push token, e.g. `ExponentPushToken[xxxx]`                     |
| `platform`     | enum      | `ios` \| `android` \| `web`                                         |
| `last_seen_at` | timestamp | Updated on each app launch; used to identify and prune stale tokens |

---

## Notification Log

For MVP, all notifications are automated (event created, event changed, event cancelled, registration status changed, etc.). A log table is still included for three reasons:

1. **Idempotency** — Edge Functions can be retried by Supabase; this prevents duplicate sends.
2. **Debugging** — know what was sent, to whom, and when.
3. **Future-proofing** — user notification preferences can filter against this log.

| Field        | Type      | Notes                                                                                    |
| ------------ | --------- | ---------------------------------------------------------------------------------------- |
| `profile_id` | FK        | `profiles`                                                                               |
| `event_id`   | FK        | `event_instances`, nullable (some notifications are not event-specific)                  |
| `type`       | enum      | `event_created` \| `event_updated` \| `event_cancelled` \| `registration_status_changed` |
| `channel`    | enum      | `push` \| `email`                                                                        |
| `sent_at`    | timestamp |                                                                                          |
| `status`     | enum      | `sent` \| `failed`                                                                       |

---

## Drills

| Field              | Type    | Notes                                                     |
| ------------------ | ------- | --------------------------------------------------------- |
| `title`            | text    |                                                           |
| `author_id`        | FK      | `profiles`                                                |
| `description`      | text    | Short summary of the drill's focus, optional              |
| `instructions`     | text    | Step-by-step instructions for running the drill, optional |
| `duration_minutes` | integer |                                                           |

**Relationships:** types via `drill_drill_types`; categories via `drill_drill_categories`; equipment via `drill_drill_equipment`.

### drill_drill_types

| Field        | Notes                                      |
| ------------ | ------------------------------------------ |
| `drill_id`   | FK to `drills`                             |
| `drill_type` | enum: `jamming` \| `blocking` \| `offense` |

Unique on (`drill_id`, `drill_type`).

### drill_drill_categories

Independent from `drill_drill_types` — a drill can carry both a type (e.g. `jamming`) and a category (e.g. `individual_skills`).

| Field            | Notes                                                                          |
| ---------------- | ------------------------------------------------------------------------------ |
| `drill_id`       | FK to `drills`                                                                 |
| `drill_category` | enum: `warm_up` \| `endurance` \| `individual_skills` \| `partner_pack_skills` |

Unique on (`drill_id`, `drill_category`).

### drill_drill_equipment

Independent from `drill_drill_types` and `drill_drill_categories` — equipment needed to run the drill.

| Field             | Notes                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `drill_id`        | FK to `drills`                                                                            |
| `drill_equipment` | enum: `disc_cones` \| `pointed_cones` \| `hitting_bags` \| `weaving_poles` \| `pvc_poles` |

Unique on (`drill_id`, `drill_equipment`).

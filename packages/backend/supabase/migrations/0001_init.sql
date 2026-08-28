-- =============================================================
-- SJRD Initial Schema
-- =============================================================

-- =============================================================
-- Extensions
-- =============================================================

create extension if not exists pgcrypto;

-- =============================================================
-- Enums
-- =============================================================

create type user_type as enum (
  'guardian', 'skater', 'coach', 'trainer', 'medic', 'official', 'admin'
);

create type profile_status as enum ('active', 'inactive');

create type event_type as enum ('game', 'practice', 'scrimmage', 'other');

create type event_status as enum ('scheduled', 'cancelled');

create type registration_status as enum (
  'pending', 'approved', 'waitlisted', 'rejected'
);

create type attendance_status as enum (
  'present', 'partial', 'absent', 'excused'
);

create type push_platform as enum ('ios', 'android', 'web');

create type notification_type as enum (
  'event_created',
  'event_updated',
  'event_cancelled',
  'registration_status_changed'
);

create type notification_channel as enum ('push', 'email');

create type notification_status as enum ('sent', 'failed');

create type drill_type as enum ('jamming', 'blocking', 'endurance', 'offense');

-- =============================================================
-- Shared updated_at trigger function
-- =============================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================
-- Profiles
-- Extends auth.users. Supabase Auth owns the auth.users record;
-- this table holds all league-specific fields.
-- =============================================================

create table profiles (
  id              uuid primary key references auth.users on delete cascade,
  first_name      text not null,
  last_name       text not null,
  preferred_name  text,
  derby_name      text,
  skater_number   text,
  phone           text,
  status          profile_status not null default 'active',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references profiles(id),
  updated_by      uuid references profiles(id)
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Auto-create a minimal profile row when a new auth.users record is inserted.
-- The client is expected to pass first_name and last_name in raw_user_meta_data.
create or replace function handle_new_auth_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', '')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- =============================================================
-- Profile User Types
-- A profile can hold one or more user types.
-- =============================================================

create table profile_user_types (
  profile_id  uuid not null references profiles(id) on delete cascade,
  user_type   user_type not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (profile_id, user_type)
);

create trigger trg_profile_user_types_updated_at
  before update on profile_user_types
  for each row execute function set_updated_at();

-- =============================================================
-- Guardian Relationships
-- =============================================================

create table guardian_relationships (
  id                    uuid primary key default gen_random_uuid(),
  guardian_profile_id   uuid not null references profiles(id) on delete cascade,
  child_profile_id      uuid not null references profiles(id) on delete cascade,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references profiles(id),
  updated_by            uuid references profiles(id),
  unique (guardian_profile_id, child_profile_id)
);

create trigger trg_guardian_relationships_updated_at
  before update on guardian_relationships
  for each row execute function set_updated_at();

-- =============================================================
-- Locations
-- One location should have is_default = true as the league home rink.
-- The partial unique index enforces only one default at a time.
-- =============================================================

create table locations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text,
  notes       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create unique index locations_one_default on locations ((is_default)) where is_default = true;

create trigger trg_locations_updated_at
  before update on locations
  for each row execute function set_updated_at();

-- =============================================================
-- Teams
-- =============================================================

create table teams (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create trigger trg_teams_updated_at
  before update on teams
  for each row execute function set_updated_at();

create table team_members (
  team_id     uuid not null references teams(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (team_id, profile_id)
);

create trigger trg_team_members_updated_at
  before update on team_members
  for each row execute function set_updated_at();

-- =============================================================
-- Registrations
-- Tracks a skater's application to join the league program.
-- =============================================================

create table registrations (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  status        registration_status not null default 'pending',
  notes         text,
  registered_at timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references profiles(id),
  updated_by    uuid references profiles(id)
);

create trigger trg_registrations_updated_at
  before update on registrations
  for each row execute function set_updated_at();

-- =============================================================
-- Event Series
-- Recurring event template. Instances are generated from this.
-- =============================================================

create table event_series (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text,
  location_id       uuid references locations(id) on delete set null,
  series_date_start date not null,
  series_date_end   date,
  start_time        time not null,
  end_time          time not null,
  recurrence_rule   text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references profiles(id),
  updated_by        uuid references profiles(id)
);

create trigger trg_event_series_updated_at
  before update on event_series
  for each row execute function set_updated_at();

-- =============================================================
-- Event Instances
-- A single event occurrence. location_id null means use the
-- default location at query time.
-- =============================================================

create table event_instances (
  id                  uuid primary key default gen_random_uuid(),
  series_id           uuid references event_series(id) on delete set null,
  event_type          event_type not null,
  title               text not null,
  description         text,
  topics              text,
  notes               text,
  status              event_status not null default 'scheduled',
  location_id         uuid references locations(id) on delete set null,
  date_start          date not null,
  date_end            date,
  original_start_time time,
  start_time          time not null,
  end_time            time not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  created_by          uuid references profiles(id),
  updated_by          uuid references profiles(id)
);

create trigger trg_event_instances_updated_at
  before update on event_instances
  for each row execute function set_updated_at();

-- =============================================================
-- Event join tables
-- =============================================================

create table event_teams (
  event_id    uuid not null references event_instances(id) on delete cascade,
  team_id     uuid not null references teams(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (event_id, team_id)
);

create trigger trg_event_teams_updated_at
  before update on event_teams
  for each row execute function set_updated_at();

create table event_coaches (
  event_id    uuid not null references event_instances(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (event_id, profile_id)
);

create trigger trg_event_coaches_updated_at
  before update on event_coaches
  for each row execute function set_updated_at();

create table event_medics (
  event_id    uuid not null references event_instances(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (event_id, profile_id)
);

create trigger trg_event_medics_updated_at
  before update on event_medics
  for each row execute function set_updated_at();

-- =============================================================
-- Rosters
-- Skaters selected for a game event. Constrained to event_type = 'game'
-- by application logic and ideally a check constraint or trigger.
-- =============================================================

create table rosters (
  event_id      uuid not null references event_instances(id) on delete cascade,
  profile_id    uuid not null references profiles(id) on delete cascade,
  is_alternate  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references profiles(id),
  updated_by    uuid references profiles(id),
  primary key (event_id, profile_id)
);

create trigger trg_rosters_updated_at
  before update on rosters
  for each row execute function set_updated_at();

-- =============================================================
-- Attendances
-- =============================================================

create table attendances (
  event_id    uuid not null references event_instances(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,
  status      attendance_status not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (event_id, profile_id)
);

create trigger trg_attendances_updated_at
  before update on attendances
  for each row execute function set_updated_at();

-- =============================================================
-- Push Tokens
-- One row per device. Stale tokens (DeviceNotRegistered error
-- from Expo push API) should be deleted by the Edge Function.
-- =============================================================

create table push_tokens (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  token         text not null unique,
  platform      push_platform not null,
  last_seen_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  created_by    uuid references profiles(id),
  updated_by    uuid references profiles(id)
);

create trigger trg_push_tokens_updated_at
  before update on push_tokens
  for each row execute function set_updated_at();

-- =============================================================
-- Notification Log
-- Written by Edge Functions (service role, bypasses RLS).
-- Prevents duplicate sends when Edge Functions are retried.
-- =============================================================

create table notification_log (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  event_id    uuid references event_instances(id) on delete set null,
  type        notification_type not null,
  channel     notification_channel not null,
  sent_at     timestamptz not null default now(),
  status      notification_status not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create trigger trg_notification_log_updated_at
  before update on notification_log
  for each row execute function set_updated_at();

-- =============================================================
-- Drills
-- =============================================================

create table drills (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  author_id         uuid not null references profiles(id) on delete restrict,
  description       text,
  duration_minutes  integer not null check (duration_minutes > 0),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid references profiles(id),
  updated_by        uuid references profiles(id)
);

create trigger trg_drills_updated_at
  before update on drills
  for each row execute function set_updated_at();

create table drill_drill_types (
  drill_id    uuid not null references drills(id) on delete cascade,
  drill_type  drill_type not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (drill_id, drill_type)
);

create trigger trg_drill_drill_types_updated_at
  before update on drill_drill_types
  for each row execute function set_updated_at();

-- =============================================================
-- RLS Helper Functions
-- security definer so these can read profile_user_types without
-- the caller needing direct SELECT on that table mid-policy eval.
-- =============================================================

create or replace function has_user_type(t user_type)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profile_user_types
    where profile_id = auth.uid()
      and user_type = t
  )
$$;

create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select has_user_type('admin')
$$;

create or replace function is_event_coach(eid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from event_coaches
    where event_id = eid
      and profile_id = auth.uid()
  )
$$;

create or replace function is_guardian_of(child_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from guardian_relationships
    where guardian_profile_id = auth.uid()
      and child_profile_id = child_id
  )
$$;

-- =============================================================
-- Row Level Security Policies
-- =============================================================

-- ---- profiles ----
alter table profiles enable row level security;

-- Coaches and officials need to see other profiles (team members, skaters).
create policy "profiles_select"
  on profiles for select to authenticated
  using (
    id = auth.uid()
    or is_admin()
    or has_user_type('coach')
    or has_user_type('official')
  );

create policy "profiles_insert"
  on profiles for insert to authenticated
  with check (id = auth.uid() or is_admin());

create policy "profiles_update"
  on profiles for update to authenticated
  using (id = auth.uid() or is_admin());

create policy "profiles_delete"
  on profiles for delete to authenticated
  using (is_admin());

-- ---- profile_user_types ----
alter table profile_user_types enable row level security;

create policy "profile_user_types_select"
  on profile_user_types for select to authenticated
  using (true);

create policy "profile_user_types_all"
  on profile_user_types for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- guardian_relationships ----
alter table guardian_relationships enable row level security;

create policy "guardian_relationships_select"
  on guardian_relationships for select to authenticated
  using (
    guardian_profile_id = auth.uid()
    or child_profile_id = auth.uid()
    or is_admin()
  );

create policy "guardian_relationships_all"
  on guardian_relationships for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- locations ----
alter table locations enable row level security;

create policy "locations_select"
  on locations for select to authenticated
  using (true);

create policy "locations_all"
  on locations for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- teams ----
alter table teams enable row level security;

create policy "teams_select"
  on teams for select to authenticated
  using (true);

create policy "teams_all"
  on teams for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- team_members ----
alter table team_members enable row level security;

create policy "team_members_select"
  on team_members for select to authenticated
  using (true);

create policy "team_members_all"
  on team_members for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- registrations ----
alter table registrations enable row level security;

create policy "registrations_select"
  on registrations for select to authenticated
  using (
    profile_id = auth.uid()
    or is_admin()
    or is_guardian_of(profile_id)
  );

create policy "registrations_insert"
  on registrations for insert to authenticated
  with check (profile_id = auth.uid() or is_admin());

create policy "registrations_update"
  on registrations for update to authenticated
  using (is_admin());

create policy "registrations_delete"
  on registrations for delete to authenticated
  using (is_admin());

-- ---- event_series ----
alter table event_series enable row level security;

create policy "event_series_select"
  on event_series for select to authenticated
  using (true);

create policy "event_series_all"
  on event_series for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- event_instances ----
alter table event_instances enable row level security;

create policy "event_instances_select"
  on event_instances for select to authenticated
  using (true);

create policy "event_instances_insert"
  on event_instances for insert to authenticated
  with check (is_admin() or has_user_type('coach'));

create policy "event_instances_update"
  on event_instances for update to authenticated
  using (is_admin() or is_event_coach(id));

create policy "event_instances_delete"
  on event_instances for delete to authenticated
  using (is_admin());

-- ---- event_teams ----
alter table event_teams enable row level security;

create policy "event_teams_select"
  on event_teams for select to authenticated
  using (true);

create policy "event_teams_all"
  on event_teams for all to authenticated
  using (is_admin() or is_event_coach(event_id))
  with check (is_admin() or is_event_coach(event_id));

-- ---- event_coaches ----
alter table event_coaches enable row level security;

create policy "event_coaches_select"
  on event_coaches for select to authenticated
  using (true);

create policy "event_coaches_all"
  on event_coaches for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- event_medics ----
alter table event_medics enable row level security;

create policy "event_medics_select"
  on event_medics for select to authenticated
  using (true);

create policy "event_medics_all"
  on event_medics for all to authenticated
  using (is_admin()) with check (is_admin());

-- ---- rosters ----
alter table rosters enable row level security;

create policy "rosters_select"
  on rosters for select to authenticated
  using (true);

create policy "rosters_all"
  on rosters for all to authenticated
  using (is_admin() or is_event_coach(event_id))
  with check (is_admin() or is_event_coach(event_id));

-- ---- attendances ----
alter table attendances enable row level security;

create policy "attendances_select"
  on attendances for select to authenticated
  using (
    profile_id = auth.uid()
    or is_admin()
    or is_guardian_of(profile_id)
    or is_event_coach(event_id)
    or has_user_type('trainer')
  );

create policy "attendances_all"
  on attendances for all to authenticated
  using (is_admin() or is_event_coach(event_id))
  with check (is_admin() or is_event_coach(event_id));

-- ---- push_tokens ----
alter table push_tokens enable row level security;

create policy "push_tokens_select"
  on push_tokens for select to authenticated
  using (profile_id = auth.uid() or is_admin());

create policy "push_tokens_insert"
  on push_tokens for insert to authenticated
  with check (profile_id = auth.uid());

create policy "push_tokens_update"
  on push_tokens for update to authenticated
  using (profile_id = auth.uid() or is_admin());

create policy "push_tokens_delete"
  on push_tokens for delete to authenticated
  using (profile_id = auth.uid() or is_admin());

-- ---- notification_log ----
-- Written exclusively by Edge Functions using the service role key,
-- which bypasses RLS entirely. These policies guard direct client access only.
alter table notification_log enable row level security;

create policy "notification_log_select"
  on notification_log for select to authenticated
  using (profile_id = auth.uid() or is_admin());

-- ---- drills ----
alter table drills enable row level security;

create policy "drills_select"
  on drills for select to authenticated
  using (true);

create policy "drills_insert"
  on drills for insert to authenticated
  with check (is_admin() or has_user_type('coach') or has_user_type('trainer'));

create policy "drills_update"
  on drills for update to authenticated
  using (author_id = auth.uid() or is_admin());

create policy "drills_delete"
  on drills for delete to authenticated
  using (author_id = auth.uid() or is_admin());

-- ---- drill_drill_types ----
alter table drill_drill_types enable row level security;

create policy "drill_drill_types_select"
  on drill_drill_types for select to authenticated
  using (true);

create policy "drill_drill_types_all"
  on drill_drill_types for all to authenticated
  using (
    is_admin()
    or exists (
      select 1 from drills where id = drill_id and author_id = auth.uid()
    )
  )
  with check (
    is_admin()
    or exists (
      select 1 from drills where id = drill_id and author_id = auth.uid()
    )
  );

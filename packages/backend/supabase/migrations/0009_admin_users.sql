-- =============================================================
-- Admin Users
-- Adds invite tracking to profiles, and a staging table for users
-- an admin has added but not yet invited (no auth.users row exists
-- for these yet — they graduate to a real profile on invite, which
-- is out of scope for this migration).
-- =============================================================

alter table profiles add column invited_at timestamptz;

create table pending_users (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  invited_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create trigger trg_pending_users_updated_at
  before update on pending_users
  for each row execute function set_updated_at();

create table pending_user_types (
  pending_user_id  uuid not null references pending_users(id) on delete cascade,
  user_type        user_type not null,
  primary key (pending_user_id, user_type)
);

create table pending_user_teams (
  pending_user_id  uuid not null references pending_users(id) on delete cascade,
  team_id          uuid not null references teams(id) on delete cascade,
  primary key (pending_user_id, team_id)
);

-- ---- pending_users / pending_user_types / pending_user_teams ----
alter table pending_users enable row level security;
alter table pending_user_types enable row level security;
alter table pending_user_teams enable row level security;

create policy "pending_users_admin_all"
  on pending_users for all to authenticated
  using (is_admin()) with check (is_admin());

create policy "pending_user_types_admin_all"
  on pending_user_types for all to authenticated
  using (is_admin()) with check (is_admin());

create policy "pending_user_teams_admin_all"
  on pending_user_teams for all to authenticated
  using (is_admin()) with check (is_admin());

-- =============================================================
-- Admin directory of real accounts.
-- auth.users isn't exposed to PostgREST, so admins need a security
-- definer function to read email alongside profile fields.
-- =============================================================

create or replace function admin_list_profile_users()
returns table (
  id              uuid,
  first_name      text,
  last_name       text,
  preferred_name  text,
  derby_name      text,
  status          profile_status,
  invited_at      timestamptz,
  email           text,
  created_at      timestamptz
)
language sql security definer stable as $$
  select p.id, p.first_name, p.last_name, p.preferred_name, p.derby_name,
         p.status, p.invited_at, u.email, p.created_at
  from profiles p
  join auth.users u on u.id = p.id
  where is_admin()
$$;

grant execute on function admin_list_profile_users() to authenticated;

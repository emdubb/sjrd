-- =============================================================
-- Guardian Skaters
-- Skaters are minors and don't get an account by default, so a
-- guardian being added can attach existing or brand-new skaters.
-- New skaters land in pending_users (like the guardian) and may
-- have no email, hence dropping the not-null constraint below.
-- =============================================================

alter table pending_users alter column email drop not null;

create table pending_user_guardians (
  id                        uuid primary key default gen_random_uuid(),
  guardian_pending_user_id  uuid not null references pending_users(id) on delete cascade,
  skater_pending_user_id    uuid references pending_users(id) on delete cascade,
  skater_profile_id         uuid references profiles(id) on delete cascade,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  created_by                uuid references profiles(id),
  updated_by                uuid references profiles(id),
  constraint pending_user_guardians_one_skater check (
    (skater_pending_user_id is not null) <> (skater_profile_id is not null)
  ),
  unique (guardian_pending_user_id, skater_pending_user_id),
  unique (guardian_pending_user_id, skater_profile_id)
);

create trigger trg_pending_user_guardians_updated_at
  before update on pending_user_guardians
  for each row execute function set_updated_at();

alter table pending_user_guardians enable row level security;

create policy "pending_user_guardians_admin_all"
  on pending_user_guardians for all to authenticated
  using (is_admin()) with check (is_admin());

-- =============================================================
-- Derby 101: Sessions & Curriculum
-- A "session" is a batch of weekly practices (event_instances rows,
-- reusing all existing practice plumbing — drills, coaches, attendance).
-- Curriculum is a master, week-numbered syllabus; its content and
-- drills are copied onto each practice instance at session-creation
-- time, so later edits to the master curriculum don't retroactively
-- change practices that already ran.
-- =============================================================

create table training_sessions (
  id          uuid primary key default gen_random_uuid(),
  weeks       integer not null default 6,
  location_id uuid references locations(id) on delete set null,
  start_time  time not null default '12:30:00',
  end_time    time not null default '14:30:00',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create trigger trg_training_sessions_updated_at
  before update on training_sessions
  for each row execute function set_updated_at();

alter table event_instances
  add column training_session_id  uuid references training_sessions(id) on delete cascade,
  add column session_week_number  integer;

create table curriculum (
  id          uuid primary key default gen_random_uuid(),
  week_number integer not null unique,
  content     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id)
);

create trigger trg_curriculum_updated_at
  before update on curriculum
  for each row execute function set_updated_at();

create table curriculum_drills (
  curriculum_id  uuid not null references curriculum(id) on delete cascade,
  drill_id       uuid not null references drills(id) on delete restrict,
  position       integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references profiles(id),
  updated_by     uuid references profiles(id),
  primary key (curriculum_id, drill_id)
);

create trigger trg_curriculum_drills_updated_at
  before update on curriculum_drills
  for each row execute function set_updated_at();

-- One row per practice instance, snapshotting the master curriculum
-- (content + drills copied into event_drills separately) at creation time.
create table event_curriculum (
  event_id              uuid primary key references event_instances(id) on delete cascade,
  source_curriculum_id  uuid references curriculum(id) on delete set null,
  week_number           integer not null,
  content               text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references profiles(id),
  updated_by            uuid references profiles(id)
);

create trigger trg_event_curriculum_updated_at
  before update on event_curriculum
  for each row execute function set_updated_at();

-- ---- training_sessions ----
alter table training_sessions enable row level security;

create policy "training_sessions_select"
  on training_sessions for select to authenticated
  using (true);

create policy "training_sessions_all"
  on training_sessions for all to authenticated
  using (is_admin() or has_user_type('coach'))
  with check (is_admin() or has_user_type('coach'));

-- ---- curriculum ----
alter table curriculum enable row level security;

create policy "curriculum_select"
  on curriculum for select to authenticated
  using (true);

create policy "curriculum_all"
  on curriculum for all to authenticated
  using (is_admin() or has_user_type('coach') or has_user_type('trainer'))
  with check (is_admin() or has_user_type('coach') or has_user_type('trainer'));

-- ---- curriculum_drills ----
alter table curriculum_drills enable row level security;

create policy "curriculum_drills_select"
  on curriculum_drills for select to authenticated
  using (true);

create policy "curriculum_drills_all"
  on curriculum_drills for all to authenticated
  using (is_admin() or has_user_type('coach') or has_user_type('trainer'))
  with check (is_admin() or has_user_type('coach') or has_user_type('trainer'));

-- ---- event_curriculum ----
alter table event_curriculum enable row level security;

create policy "event_curriculum_select"
  on event_curriculum for select to authenticated
  using (true);

create policy "event_curriculum_all"
  on event_curriculum for all to authenticated
  using (is_admin() or is_event_coach(event_id))
  with check (is_admin() or is_event_coach(event_id));

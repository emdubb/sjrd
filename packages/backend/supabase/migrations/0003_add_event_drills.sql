-- =============================================================
-- Event Drills
-- Attaches an ordered list of drills to a practice event, forming
-- the practice plan shown in the schedule detail view.
-- =============================================================

create table event_drills (
  event_id    uuid not null references event_instances(id) on delete cascade,
  drill_id    uuid not null references drills(id) on delete restrict,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  created_by  uuid references profiles(id),
  updated_by  uuid references profiles(id),
  primary key (event_id, drill_id)
);

create trigger trg_event_drills_updated_at
  before update on event_drills
  for each row execute function set_updated_at();

alter table event_drills enable row level security;

create policy "event_drills_select"
  on event_drills for select to authenticated
  using (true);

create policy "event_drills_all"
  on event_drills for all to authenticated
  using (is_admin() or is_event_coach(event_id))
  with check (is_admin() or is_event_coach(event_id));

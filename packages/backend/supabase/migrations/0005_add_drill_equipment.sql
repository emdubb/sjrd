-- =============================================================
-- Drill Equipment
-- Independent classification of equipment needed to run a drill.
-- =============================================================

create type drill_equipment as enum (
  'disc_cones', 'pointed_cones', 'hitting_bags', 'weaving_poles', 'pvc_poles'
);

create table drill_drill_equipment (
  drill_id         uuid not null references drills(id) on delete cascade,
  drill_equipment  drill_equipment not null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by       uuid references profiles(id),
  updated_by       uuid references profiles(id),
  primary key (drill_id, drill_equipment)
);

create trigger trg_drill_drill_equipment_updated_at
  before update on drill_drill_equipment
  for each row execute function set_updated_at();

alter table drill_drill_equipment enable row level security;

create policy "drill_drill_equipment_select"
  on drill_drill_equipment for select to authenticated
  using (true);

create policy "drill_drill_equipment_all"
  on drill_drill_equipment for all to authenticated
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

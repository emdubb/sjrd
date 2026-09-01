-- =============================================================
-- Drill Category
-- Adds a second, independent classification for drills (distinct from
-- drill_type). "Endurance" moves from drill_type to drill_category.
-- =============================================================

-- No existing drill currently uses the 'endurance' drill_type, but guard
-- against it anyway before the type swap below.
delete from drill_drill_types where drill_type = 'endurance';

alter type drill_type rename to drill_type_old;

create type drill_type as enum ('jamming', 'blocking', 'offense');

alter table drill_drill_types
  alter column drill_type type drill_type using drill_type::text::drill_type;

drop type drill_type_old;

create type drill_category as enum (
  'warm_up', 'endurance', 'individual_skills', 'partner_pack_skills'
);

create table drill_drill_categories (
  drill_id        uuid not null references drills(id) on delete cascade,
  drill_category  drill_category not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  created_by      uuid references profiles(id),
  updated_by      uuid references profiles(id),
  primary key (drill_id, drill_category)
);

create trigger trg_drill_drill_categories_updated_at
  before update on drill_drill_categories
  for each row execute function set_updated_at();

alter table drill_drill_categories enable row level security;

create policy "drill_drill_categories_select"
  on drill_drill_categories for select to authenticated
  using (true);

create policy "drill_drill_categories_all"
  on drill_drill_categories for all to authenticated
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

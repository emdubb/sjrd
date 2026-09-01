-- ── Teams ────────────────────────────────────────────────────────────────────

insert into public.teams (id, name, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', 'Sabotage',      now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'Intergalactic',  now(), now())
on conflict (id) do nothing;

-- ── Admin dev user ───────────────────────────────────────────────────────────
-- Email: coach@sjrd.local  |  Password: password123

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'authenticated', 'authenticated',
  'coach@sjrd.local',
  crypt('password123', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"first_name":"Coach","last_name":"Bull"}',
  '', '', '', ''
) on conflict (id) do nothing;

-- Trigger auto-creates the profile row; fill in the remaining fields.
update public.profiles
set first_name = 'Coach', last_name = 'Bull', phone = '555-000-0000', updated_at = now()
where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

insert into public.profile_user_types (profile_id, user_type, created_at, updated_at)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', now(), now()),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'coach', now(), now())
on conflict (profile_id, user_type) do nothing;

-- ── Skaters ──────────────────────────────────────────────────────────────────
-- Six skaters split across the two teams, for exercising team rosters/games.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', 'b1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'skater1@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Danger","last_name":"Mouse"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'skater2@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Corgi","last_name":"Skater"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'skater3@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Bull","last_name":"Doze-Her"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b4444444-4444-4444-4444-444444444444', 'authenticated', 'authenticated', 'skater4@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Roll","last_name":"Model"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b5555555-5555-5555-5555-555555555555', 'authenticated', 'authenticated', 'skater5@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Slam","last_name":"Duncan"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b6666666-6666-6666-6666-666666666666', 'authenticated', 'authenticated', 'skater6@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Wreck-It","last_name":"Wren"}', '', '', '', '')
on conflict (id) do nothing;

-- Trigger auto-creates each profile row; fill in derby names.
update public.profiles set derby_name = data.derby_name, updated_at = now()
from (values
  ('b1111111-1111-1111-1111-111111111111'::uuid, 'Danger Mouse'),
  ('b2222222-2222-2222-2222-222222222222'::uuid, 'Corgi'),
  ('b3333333-3333-3333-3333-333333333333'::uuid, 'Bull Doze-Her'),
  ('b4444444-4444-4444-4444-444444444444'::uuid, 'Roll Model'),
  ('b5555555-5555-5555-5555-555555555555'::uuid, 'Slam Duncan'),
  ('b6666666-6666-6666-6666-666666666666'::uuid, 'Wreck-It Wren')
) as data(id, derby_name)
where profiles.id = data.id;

insert into public.profile_user_types (profile_id, user_type, created_at, updated_at)
select id, 'skater', now(), now() from (values
  ('b1111111-1111-1111-1111-111111111111'::uuid),
  ('b2222222-2222-2222-2222-222222222222'::uuid),
  ('b3333333-3333-3333-3333-333333333333'::uuid),
  ('b4444444-4444-4444-4444-444444444444'::uuid),
  ('b5555555-5555-5555-5555-555555555555'::uuid),
  ('b6666666-6666-6666-6666-666666666666'::uuid)
) as s(id)
on conflict (profile_id, user_type) do nothing;

insert into public.team_members (team_id, profile_id, created_at, updated_at)
values
  ('22222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', now(), now()), -- Intergalactic
  ('22222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', now(), now()),
  ('22222222-2222-2222-2222-222222222222', 'b3333333-3333-3333-3333-333333333333', now(), now()),
  ('11111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', now(), now()), -- Sabotage
  ('11111111-1111-1111-1111-111111111111', 'b5555555-5555-5555-5555-555555555555', now(), now()),
  ('11111111-1111-1111-1111-111111111111', 'b6666666-6666-6666-6666-666666666666', now(), now())
on conflict (team_id, profile_id) do nothing;

-- ── Default location ─────────────────────────────────────────────────────────

insert into public.locations (id, name, address, is_default, created_at, updated_at)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'SJRD Home Rink',
  '1701 Thorton Ave, Sacramento CA 95811',
  true,
  now(), now()
) on conflict (id) do nothing;

-- ── Additional team ──────────────────────────────────────────────────────────

insert into public.teams (id, name, created_at, updated_at)
values ('33333333-3333-3333-3333-333333333333', '201', now(), now())
on conflict (id) do nothing;

-- ── Skater profile details ──────────────────────────────────────────────────
-- Allergies and likes/dislikes for the Skaters page detail drawer.

update public.profiles set allergies = 'Peanuts', updated_at = now()
where id = 'b2222222-2222-2222-2222-222222222222'; -- Corgi

update public.profiles set allergies = 'Bee stings', updated_at = now()
where id = 'b6666666-6666-6666-6666-666666666666'; -- Wreck-It Wren

update public.profiles
set likes = 'Blocking drills, team scrimmages', dislikes = 'Early morning practices', updated_at = now()
where id = 'b1111111-1111-1111-1111-111111111111'; -- Danger Mouse

update public.profiles
set likes = 'Speed skating', dislikes = 'Running laps', updated_at = now()
where id = 'b2222222-2222-2222-2222-222222222222'; -- Corgi

-- ── Guardians ────────────────────────────────────────────────────────────────
-- For the Skaters page detail drawer's guardian names/contact numbers.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  confirmation_token, email_change, email_change_token_new, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', 'c1111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated', 'guardian1@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Jane","last_name":"Mouse"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'c2222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated', 'guardian2@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"John","last_name":"Mouse"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'c3333333-3333-3333-3333-333333333333', 'authenticated', 'authenticated', 'guardian3@sjrd.local', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"first_name":"Pat","last_name":"Doze"}', '', '', '', '')
on conflict (id) do nothing;

update public.profiles set phone = data.phone, updated_at = now()
from (values
  ('c1111111-1111-1111-1111-111111111111'::uuid, '555-111-2222'),
  ('c2222222-2222-2222-2222-222222222222'::uuid, '555-111-3333'),
  ('c3333333-3333-3333-3333-333333333333'::uuid, '555-333-4444')
) as data(id, phone)
where profiles.id = data.id;

insert into public.profile_user_types (profile_id, user_type, created_at, updated_at)
select id, 'guardian', now(), now() from (values
  ('c1111111-1111-1111-1111-111111111111'::uuid),
  ('c2222222-2222-2222-2222-222222222222'::uuid),
  ('c3333333-3333-3333-3333-333333333333'::uuid)
) as g(id)
on conflict (profile_id, user_type) do nothing;

insert into public.guardian_relationships (guardian_profile_id, child_profile_id, created_at, updated_at)
values
  ('c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', now(), now()), -- Jane Mouse -> Danger Mouse
  ('c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', now(), now()), -- John Mouse -> Danger Mouse
  ('c3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', now(), now())  -- Pat Doze -> Bull Doze-Her
on conflict (guardian_profile_id, child_profile_id) do nothing;

-- ── Historical practices + attendance ───────────────────────────────────────
-- Three touchpoints per team (two 2+ weeks back, one recent) so the Skaters
-- page has real attendance-rate and "2+ weeks since last practice" data to
-- compute from. Seed-owned events (not the ones created interactively through
-- the app) so this stays reproducible on a fresh `db reset`.

insert into public.event_instances (id, event_type, title, date_start, start_time, end_time, created_at, updated_at)
values
  ('e0000001-0000-0000-0000-000000000001', 'practice', 'Practice', '2026-08-03', '18:00:00', '20:00:00', now(), now()),
  ('e0000002-0000-0000-0000-000000000002', 'practice', 'Practice', '2026-08-03', '18:00:00', '20:00:00', now(), now()),
  ('e0000003-0000-0000-0000-000000000003', 'practice', 'Practice', '2026-08-10', '18:00:00', '20:00:00', now(), now()),
  ('e0000004-0000-0000-0000-000000000004', 'practice', 'Practice', '2026-08-10', '18:00:00', '20:00:00', now(), now()),
  ('e0000005-0000-0000-0000-000000000005', 'practice', 'Practice', '2026-08-28', '18:00:00', '20:00:00', now(), now()),
  ('e0000006-0000-0000-0000-000000000006', 'practice', 'Practice', '2026-08-28', '18:00:00', '20:00:00', now(), now())
on conflict (id) do nothing;

insert into public.event_teams (event_id, team_id, created_at, updated_at)
values
  ('e0000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', now(), now()), -- Aug 3 Intergalactic
  ('e0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', now(), now()), -- Aug 3 Sabotage
  ('e0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', now(), now()), -- Aug 10 Intergalactic
  ('e0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', now(), now()), -- Aug 10 Sabotage
  ('e0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', now(), now()), -- Aug 28 Intergalactic
  ('e0000006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', now(), now())  -- Aug 28 Sabotage
on conflict (event_id, team_id) do nothing;

insert into public.attendances (event_id, profile_id, status, created_at, updated_at)
values
  -- Danger Mouse (Intergalactic): attended every practice
  ('e0000001-0000-0000-0000-000000000001', 'b1111111-1111-1111-1111-111111111111', 'present', now(), now()),
  ('e0000003-0000-0000-0000-000000000003', 'b1111111-1111-1111-1111-111111111111', 'present', now(), now()),
  ('e0000005-0000-0000-0000-000000000005', 'b1111111-1111-1111-1111-111111111111', 'present', now(), now()),
  -- Corgi (Intergalactic): mixed, but attended recently
  ('e0000001-0000-0000-0000-000000000001', 'b2222222-2222-2222-2222-222222222222', 'present', now(), now()),
  ('e0000003-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'absent', now(), now()),
  ('e0000005-0000-0000-0000-000000000005', 'b2222222-2222-2222-2222-222222222222', 'present', now(), now()),
  -- Bull Doze-Her (Intergalactic): stopped attending after Aug 10 -> 2+ week warning
  ('e0000001-0000-0000-0000-000000000001', 'b3333333-3333-3333-3333-333333333333', 'present', now(), now()),
  ('e0000003-0000-0000-0000-000000000003', 'b3333333-3333-3333-3333-333333333333', 'present', now(), now()),
  ('e0000005-0000-0000-0000-000000000005', 'b3333333-3333-3333-3333-333333333333', 'absent', now(), now()),
  -- Roll Model (Sabotage): no attendance on file at all -> warning + no data
  -- Slam Duncan (Sabotage): attended every practice
  ('e0000002-0000-0000-0000-000000000002', 'b5555555-5555-5555-5555-555555555555', 'present', now(), now()),
  ('e0000004-0000-0000-0000-000000000004', 'b5555555-5555-5555-5555-555555555555', 'present', now(), now()),
  ('e0000006-0000-0000-0000-000000000006', 'b5555555-5555-5555-5555-555555555555', 'present', now(), now()),
  -- Wreck-It Wren (Sabotage): missed the older ones, present at the most recent
  ('e0000002-0000-0000-0000-000000000002', 'b6666666-6666-6666-6666-666666666666', 'absent', now(), now()),
  ('e0000004-0000-0000-0000-000000000004', 'b6666666-6666-6666-6666-666666666666', 'absent', now(), now()),
  ('e0000006-0000-0000-0000-000000000006', 'b6666666-6666-6666-6666-666666666666', 'present', now(), now())
on conflict (event_id, profile_id) do nothing;

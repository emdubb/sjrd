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

-- ── Default location ─────────────────────────────────────────────────────────

insert into public.locations (id, name, address, is_default, created_at, updated_at)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'SJRD Home Rink',
  '1701 Thorton Ave, Sacramento CA 95811',
  true,
  now(), now()
) on conflict (id) do nothing;

-- Admin contact-info reveal needs phone alongside email.
-- Return columns changed, so the function must be dropped and recreated.
drop function if exists admin_list_profile_users();

create function admin_list_profile_users()
returns table (
  id              uuid,
  first_name      text,
  last_name       text,
  preferred_name  text,
  derby_name      text,
  status          profile_status,
  invited_at      timestamptz,
  email           text,
  phone           text,
  created_at      timestamptz
)
language sql security definer stable as $$
  select p.id, p.first_name, p.last_name, p.preferred_name, p.derby_name,
         p.status, p.invited_at, u.email, p.phone, p.created_at
  from profiles p
  join auth.users u on u.id = p.id
  where is_admin()
$$;

grant execute on function admin_list_profile_users() to authenticated;

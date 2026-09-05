-- Coaches need to change a skater's status (active/inactive) from the Skaters
-- page without being granted broad write access to the rest of that profile
-- row. A SECURITY DEFINER function scoped to just this column is safer than
-- widening the profiles_update RLS policy.
create or replace function set_skater_status(p_skater_id uuid, p_status profile_status)
returns void language plpgsql security definer as $$
begin
  if not (is_admin() or has_user_type('coach')) then
    raise exception 'not authorized';
  end if;

  update profiles set status = p_status, updated_at = now() where id = p_skater_id;
end;
$$;

grant execute on function set_skater_status(uuid, profile_status) to authenticated;

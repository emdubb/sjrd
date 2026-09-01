-- Coaches need guardian names/contact numbers on the Skaters page detail
-- drawer; the original policy only let a guardian read their own rows.
drop policy "guardian_relationships_select" on guardian_relationships;

create policy "guardian_relationships_select"
  on guardian_relationships for select to authenticated
  using (
    guardian_profile_id = auth.uid()
    or child_profile_id = auth.uid()
    or is_admin()
    or has_user_type('coach')
  );

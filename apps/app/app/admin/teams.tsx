import { AdminPageShell } from '../../src/components/AdminPageShell';
import { AdminComingSoon } from '../../src/components/AdminComingSoon';

export default function AdminTeamsPage() {
  return (
    <AdminPageShell tab="teams">
      <AdminComingSoon label="Team" />
    </AdminPageShell>
  );
}

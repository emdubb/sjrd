import { AdminPageShell } from '../../src/components/AdminPageShell';
import { AdminComingSoon } from '../../src/components/AdminComingSoon';

export default function AdminDuesPage() {
  return (
    <AdminPageShell tab="dues">
      <AdminComingSoon label="Dues" />
    </AdminPageShell>
  );
}

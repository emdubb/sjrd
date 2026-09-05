import { useRouter } from 'expo-router';
import { Tabs, Tab } from '@mui/material';
import { BRAND } from '../lib/brand';

export type AdminTab = 'users' | 'teams' | 'dues';

const TAB_TO_ROUTE: Record<AdminTab, string> = {
  users: '/admin',
  teams: '/admin/teams',
  dues: '/admin/dues',
};
const TAB_ORDER: AdminTab[] = ['users', 'teams', 'dues'];
const TAB_LABELS: Record<AdminTab, string> = { users: 'Users', teams: 'Teams', dues: 'Dues' };

export function AdminTabs({ current }: { current: AdminTab }) {
  const router = useRouter();

  return (
    <Tabs
      value={current}
      onChange={(_, value: AdminTab) => router.replace(TAB_TO_ROUTE[value] as `/${string}`)}
      variant="scrollable"
      scrollButtons={false}
      sx={{
        borderBottom: '1px solid #E0E6ED',
        px: { xs: 2, md: 5 },
        '& .MuiTab-root': {
          color: '#6B7A8D',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          minHeight: 44,
        },
        '& .MuiTab-root.Mui-selected': { color: BRAND.navy },
        '& .MuiTabs-indicator': { backgroundColor: BRAND.navy, height: 3 },
      }}
    >
      {TAB_ORDER.map((tab) => (
        <Tab key={tab} value={tab} label={TAB_LABELS[tab]} />
      ))}
    </Tabs>
  );
}

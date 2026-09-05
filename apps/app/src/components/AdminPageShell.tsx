import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@mui/material';
import { AppNav } from './AppNav';
import { BackHeader } from './BackHeader';
import { AdminTabs, type AdminTab } from './AdminTabs';

interface Props {
  tab: AdminTab;
  children: ReactNode;
}

export function AdminPageShell({ tab, children }: Props) {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="more" />
      <BackHeader title="Admin" onBack={() => router.replace('/more')} />
      <AdminTabs current={tab} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          px: { xs: 2, md: 5 },
          py: 2,
          pb: { xs: '88px', md: 3 },
          maxWidth: { md: 1140 },
          width: '100%',
          mx: { md: 'auto' },
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

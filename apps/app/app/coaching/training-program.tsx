import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Box, Typography, Tabs, Tab, Chip, TextField } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppNav } from '../../src/components/AppNav';
import { BackHeader } from '../../src/components/BackHeader';
import { SkaterRow } from '../../src/components/SkaterRow';
import { SkaterDetailDrawer } from '../../src/components/SkaterDetailDrawer';
import { BRAND, pillChipSx } from '../../src/lib/brand';
import { fetchSkaters, filterSkaters, type SkaterListItem } from '../../src/lib/skaters';

type DerbyTab = 'sessions' | 'curriculum' | 'skaters';

const TAB_CONTENT: Record<
  'sessions' | 'curriculum',
  { icon: ReactNode; title: string; blurb: string }
> = {
  sessions: {
    icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
    title: 'Sessions',
    blurb: 'Schedule and track Derby 101 training sessions.',
  },
  curriculum: {
    icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
    title: 'Curriculum',
    blurb: 'Build and organize the Derby 101 skill curriculum.',
  },
};

export default function TrainingProgramPage() {
  const router = useRouter();
  const [tab, setTab] = useState<DerbyTab>('sessions');
  const [currentOnly, setCurrentOnly] = useState(true);
  const [search, setSearch] = useState('');
  const [skaters, setSkaters] = useState<SkaterListItem[]>([]);
  const [selectedSkaterId, setSelectedSkaterId] = useState<string | null>(null);

  const loadSkaters = useCallback((currentFilter: boolean) => {
    fetchSkaters({ teamId: null, currentOnly: currentFilter })
      .then(setSkaters)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'skaters') loadSkaters(currentOnly);
  }, [tab, currentOnly, loadSkaters]);

  const visibleSkaters = filterSkaters(skaters, search);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />
      <BackHeader title="Derby 101" onBack={() => router.replace('/coaching')} />

      <Tabs
        value={tab}
        onChange={(_: unknown, v: DerbyTab) => setTab(v)}
        centered
        sx={{
          px: 2,
          minHeight: 0,
          borderBottom: '1px solid #E0E6ED',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            color: '#6B7A8D',
            minHeight: 0,
            py: 2,
            fontSize: '0.95rem',
          },
          '& .MuiTab-root.Mui-selected': { color: BRAND.navy, fontWeight: 700 },
          '& .MuiTabs-indicator': { bgcolor: BRAND.navy, height: 2 },
        }}
      >
        <Tab value="sessions" label="Sessions" />
        <Tab value="curriculum" label="Curriculum" />
        <Tab value="skaters" label="Skaters" />
      </Tabs>

      {tab === 'skaters' ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            px: 2,
            py: 2,
            pb: { xs: '88px', md: 3 },
            overflowY: 'auto',
          }}
        >
          <TextField
            label="Search skaters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            variant="outlined"
            fullWidth
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip
              label="Current Skaters"
              onClick={() => setCurrentOnly(true)}
              sx={pillChipSx(currentOnly)}
            />
            <Chip
              label="All Skaters"
              onClick={() => setCurrentOnly(false)}
              sx={pillChipSx(!currentOnly)}
            />
          </Box>

          {visibleSkaters.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
              {skaters.length === 0 ? 'No skaters found.' : 'No skaters match your search.'}
            </Typography>
          ) : (
            visibleSkaters.map((skater) => (
              <SkaterRow
                key={skater.id}
                skater={skater}
                onOpen={() => setSelectedSkaterId(skater.id)}
              />
            ))
          )}
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 1.5,
            px: 3,
            py: 6,
            pb: { xs: '88px', md: 6 },
          }}
        >
          <Box sx={{ color: BRAND.steel, display: 'flex' }}>{TAB_CONTENT[tab].icon}</Box>
          <Typography sx={{ color: BRAND.navy, fontWeight: 700, fontSize: '1.05rem' }}>
            {TAB_CONTENT[tab].title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7A8D', maxWidth: 360 }}>
            {TAB_CONTENT[tab].blurb}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9AABBD', fontSize: '0.8rem' }}>
            Coming soon
          </Typography>
        </Box>
      )}

      <SkaterDetailDrawer skaterId={selectedSkaterId} onClose={() => setSelectedSkaterId(null)} />
    </Box>
  );
}

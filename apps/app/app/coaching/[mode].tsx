import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Box, Typography } from '@mui/material';
import { AppNav } from '../../src/components/AppNav';
import { CoachingBackHeader } from '../../src/components/CoachingBackHeader';
import { BRAND } from '../../src/lib/brand';
import { COACHING_MODES } from '../../src/lib/coachingModes';

export default function CoachingModeScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const coachingMode = COACHING_MODES.find((m) => m.slug === mode);

  useEffect(() => {
    if (!coachingMode) router.replace('/coaching');
  }, [coachingMode, router]);

  if (!coachingMode) return null;

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />
      <CoachingBackHeader title={coachingMode.label} onBack={() => router.replace('/coaching')} />

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
        <Box sx={{ color: BRAND.steel, fontSize: 40, display: 'flex' }}>{coachingMode.icon}</Box>
        <Typography sx={{ color: BRAND.navy, fontWeight: 700, fontSize: '1.05rem' }}>
          {coachingMode.label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', maxWidth: 360 }}>
          {coachingMode.blurb}
        </Typography>
        <Typography variant="body2" sx={{ color: '#9AABBD', fontSize: '0.8rem' }}>
          Coming soon
        </Typography>
      </Box>
    </Box>
  );
}

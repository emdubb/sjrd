import { useRouter } from 'expo-router';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AppNav } from '../../src/components/AppNav';
import { BRAND } from '../../src/lib/brand';
import { COACHING_MODES, COACHING_SECTIONS } from '../../src/lib/coachingModes';

export default function CoachingPage() {
  const router = useRouter();

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, md: 5 },
          pt: { xs: 3, md: 3.5 },
          pb: { xs: '88px', md: 3.5 },
          maxWidth: { md: 1140 },
          width: '100%',
          mx: { md: 'auto' },
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {COACHING_SECTIONS.map((section) => {
          const modes = COACHING_MODES.filter((mode) => mode.section === section);
          if (modes.length === 0) return null;

          return (
            <Box key={section}>
              <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.05rem', mb: 1 }}>
                {section}
              </Typography>
              <List
                disablePadding
                sx={{ border: '1px solid #E0E6ED', borderRadius: 2, overflow: 'hidden' }}
              >
                {modes.map(({ slug, label, icon }, i) => (
                  <ListItemButton
                    key={slug}
                    onClick={() => router.push(`/coaching/${slug}`)}
                    sx={{
                      py: 2,
                      px: 2.5,
                      minHeight: 44,
                      borderTop: i === 0 ? 'none' : '1px solid #E0E6ED',
                      '&:hover': { bgcolor: BRAND.notifBg },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 44, color: BRAND.navy }}>{icon}</ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        color: BRAND.navy,
                        fontSize: '1rem',
                      }}
                    />
                    <ChevronRightIcon sx={{ color: '#9AABBD' }} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

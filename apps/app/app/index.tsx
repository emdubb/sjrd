import { useMemo } from 'react';
import { Typography, Box, Paper, Card, CardContent } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AppNav } from '../src/components/AppNav';
import { BRAND, formatEventDate, upcomingEvents } from '../src/lib/mockEvents';

const TODAY = new Date(2026, 7, 27); // Aug 27 2026

export default function Dashboard() {
  const events = useMemo(() => upcomingEvents(TODAY).slice(0, 3), []);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="home" />

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
        }}
      >
        <Typography variant="h5" sx={{ color: BRAND.navy, fontWeight: 700, mb: 2.5 }}>
          Good to see you, Coach Bull
        </Typography>

        {/* Notification banner */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: BRAND.notifBg,
            borderRadius: 2,
            px: 2.5,
            py: 1.5,
            mb: 3.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <NotificationsNoneIcon sx={{ color: BRAND.steel, fontSize: 20, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: '#4A5568' }}>
            Practice moved to 5:30 PM this Thursday.
          </Typography>
        </Paper>

        {/* Section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarTodayIcon sx={{ color: BRAND.navy, fontSize: 22 }} />
          <Typography variant="h6" sx={{ color: BRAND.navy }}>
            My Upcoming Events
          </Typography>
        </Box>

        {/* Event cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
          }}
        >
          {events.map((event) => (
            <Card
              key={event.id}
              elevation={0}
              sx={{
                border: '1px solid #E0E6ED',
                borderLeft: `4px solid ${event.accentColor}`,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'box-shadow 0.15s',
                '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
              }}
            >
              <CardContent sx={{ pb: '20px !important', pt: 2.5, px: 2.5 }}>
                <Typography
                  sx={{
                    color: event.accentColor,
                    fontWeight: 800,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                    mb: 1,
                  }}
                >
                  {event.type}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: BRAND.navy,
                    fontSize: '1.4rem',
                    lineHeight: 1.1,
                    mb: 0.5,
                  }}
                >
                  {formatEventDate(event)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.75 }}>
                  {event.time}
                </Typography>
                <Typography
                  sx={{
                    color: '#9AABBD',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    borderTop: '1px solid #F0F3F6',
                    pt: 1.25,
                  }}
                >
                  {event.team}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

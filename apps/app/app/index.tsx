import { useState, useEffect, useCallback } from 'react';
import { Typography, Box, Paper, Button } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AppNav } from '../src/components/AppNav';
import { EventCard } from '../src/components/EventCard';
import { EventTypeFilterBar } from '../src/components/EventTypeFilterBar';
import { EventDrawer } from '../src/components/EventDrawer';
import { BRAND } from '../src/lib/brand';
import { fetchUpcomingEvents, type AppEvent } from '../src/lib/events';

export default function Dashboard() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<AppEvent | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const toggleTypeFilter = (type: string) =>
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const loadEvents = useCallback(async (currentOffset = 0, append = false) => {
    try {
      const { events: newEvents, hasMore: more } = await fetchUpcomingEvents(
        new Date(),
        currentOffset
      );
      setEvents((prev) => (append ? [...prev, ...newEvents] : newEvents));
      setOffset(currentOffset + newEvents.length);
      setHasMore(more);
    } catch {
      // silently ignore
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const filteredEvents =
    typeFilters.length === 0 ? events : events.filter((e) => typeFilters.includes(e.type));

  return (
    <>
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

          <Box sx={{ mb: 2 }}>
            <EventTypeFilterBar selectedTypes={typeFilters} onToggleType={toggleTypeFilter} />
          </Box>

          {/* Event cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            {filteredEvents.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#9AABBD', py: 4 }}>
                {events.length === 0 ? 'No upcoming events.' : 'No events match your filters.'}
              </Typography>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => setViewingEvent(event)} />
              ))
            )}
          </Box>
          {hasMore && (
            <Button
              onClick={() => loadEvents(offset, true)}
              sx={{ mt: 2, color: BRAND.navy, textTransform: 'none', fontWeight: 600 }}
            >
              Load more
            </Button>
          )}
        </Box>
      </Box>

      <EventDrawer event={viewingEvent} onClose={() => setViewingEvent(null)} />
    </>
  );
}

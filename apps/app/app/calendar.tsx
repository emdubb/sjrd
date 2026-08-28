import { useState, useMemo } from 'react';
import {
  Box, Typography, IconButton, Card, CardContent,
  Fab, Divider, useTheme, useMediaQuery,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { AppNav } from '../src/components/AppNav';
import { NewEventDialog } from '../src/components/NewEventDialog';
import { ViewEventDialog } from '../src/components/ViewEventDialog';
import { BRAND, MOCK_EVENTS, MONTH_NAMES, formatEventDate, AppEvent } from '../src/lib/mockEvents';

const CANCELLED_RED = '#C62828';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TODAY = new Date(2026, 7, 27);

function EventCard({ event, onClick }: { event: AppEvent; onClick: () => void }) {
  const cancelled = !!event.cancelled;
  const accentColor = cancelled ? CANCELLED_RED : event.accentColor;

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        border: `1px solid ${cancelled ? '#FFCDD2' : '#E0E6ED'}`,
        borderLeft: `4px solid ${accentColor}`,
        bgcolor: cancelled ? '#FFF8F8' : '#fff',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ pb: '20px !important', pt: 2.5, px: 2.5 }}>
        <Typography sx={{ color: accentColor, fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1.2, mb: 1 }}>
          {cancelled ? `CANCELLED · ${event.type}` : event.type}
        </Typography>
        <Typography sx={{ fontWeight: 700, color: cancelled ? CANCELLED_RED : BRAND.navy, fontSize: '1.4rem', lineHeight: 1.1, mb: 0.5, textDecoration: cancelled ? 'line-through' : 'none' }}>
          {formatEventDate(event)}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.75 }}>
          {event.time}
        </Typography>
        <Typography sx={{ color: '#9AABBD', fontSize: '0.72rem', fontWeight: 500, borderTop: '1px solid #F0F3F6', pt: 1.25 }}>
          {event.team}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function CalendarPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(7);
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<AppEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);

  const handleDelete = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setEditingEvent(null);
  };

  const handleCancelEvent = (id: number) => {
    setEvents(prev => prev.map(e =>
      e.id === id ? { ...e, cancelled: true, accentColor: CANCELLED_RED } : e
    ));
    setEditingEvent(null);
  };

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth + 1, 0).getDate(), [viewYear, viewMonth]);
  const firstDayOfWeek = useMemo(() => new Date(viewYear, viewMonth, 1).getDay(), [viewYear, viewMonth]);
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const monthEvents = useMemo(
    () => events.filter(e => e.year === viewYear && e.month === viewMonth).sort((a, b) => a.day - b.day),
    [events, viewYear, viewMonth],
  );

  // Map of day → accent colors (supports multiple events per day)
  const eventDayColors = useMemo(() => {
    const map = new Map<number, string[]>();
    monthEvents.forEach(e => {
      map.set(e.day, [...(map.get(e.day) ?? []), e.accentColor]);
    });
    return map;
  }, [monthEvents]);

  const visibleEvents = useMemo(
    () => selectedDay ? monthEvents.filter(e => e.day === selectedDay) : monthEvents,
    [monthEvents, selectedDay],
  );

  const prevMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (day: number) =>
    day === TODAY.getDate() && viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();

  const MonthNav = (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 1, md: 2.5 } }}>
      <IconButton onClick={prevMonth} size="small" sx={{ color: BRAND.navy }}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.navy }}>
        {MONTH_NAMES[viewMonth]} {viewYear}
      </Typography>
      <IconButton onClick={nextMonth} size="small" sx={{ color: BRAND.navy }}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  const DayHeaders = (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: { xs: 0.5, md: 0.75 } }}>
      {DAY_LABELS.map((d, i) => (
        <Typography key={i} sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#9AABBD', fontWeight: 600 }}>
          {d}
        </Typography>
      ))}
    </Box>
  );

  const DayCells = ({ flexible }: { flexible: boolean }) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: { xs: 0.5, md: 0.75 },
        ...(flexible ? { flex: 1, minHeight: 0, gridAutoRows: '1fr' } : {}),
      }}
    >
      {Array.from({ length: totalCells }, (_, i) => {
        const day = i - firstDayOfWeek + 1;
        const valid = day >= 1 && day <= daysInMonth;
        const colors = valid ? (eventDayColors.get(day) ?? []) : [];
        const todayCell = valid && isToday(day);
        const selected = valid && day === selectedDay;

        return (
          <Box
            key={i}
            onClick={() => valid && setSelectedDay(d => d === day ? null : day)}
            sx={{
              ...(!flexible ? { aspectRatio: '1' } : {}),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: { xs: 1.5, md: 2 },
              cursor: valid ? 'pointer' : 'default',
              border: valid ? '1px solid #E0E6ED' : 'none',
              bgcolor: selected ? BRAND.navy : todayCell ? BRAND.notifBg : 'transparent',
              transition: 'background-color 0.1s',
              '&:hover': valid ? { bgcolor: selected ? BRAND.navy : '#F5F7FA' } : {},
              gap: 0.5,
            }}
          >
            {valid && (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: '0.82rem', md: '0.9rem' },
                    fontWeight: todayCell || selected ? 700 : 400,
                    color: selected ? '#fff' : todayCell ? BRAND.navy : '#333',
                    lineHeight: 1,
                  }}
                >
                  {day}
                </Typography>
                {colors.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {(colors.length > 3 ? colors.slice(0, 2) : colors).map((color, idx) => (
                      <Box
                        key={idx}
                        sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: selected ? '#fff' : color }}
                      />
                    ))}
                    {colors.length > 3 && (
                      <Typography sx={{ fontSize: '0.6rem', lineHeight: 1, color: selected ? '#fff' : '#9AABBD', ml: '1px' }}>
                        …
                      </Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>
        );
      })}
    </Box>
  );

  const EventList = (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarTodayIcon sx={{ color: BRAND.navy, fontSize: 22 }} />
          <Typography variant="h6" sx={{ color: BRAND.navy }}>
            {selectedDay ? `${MONTH_NAMES[viewMonth].slice(0, 3)} ${selectedDay}` : 'All Events'}
          </Typography>
        </Box>
        <Fab size="small" onClick={() => setNewEventOpen(true)} sx={{ bgcolor: BRAND.navy, color: '#fff', boxShadow: 2, '&:hover': { bgcolor: '#112C56' } }}>
          <AddIcon />
        </Fab>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleEvents.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', textAlign: 'center', py: 6 }}>
            No events {selectedDay ? 'on this day' : 'this month'}
          </Typography>
        ) : (
          visibleEvents.map(event => <EventCard key={event.id} event={event} onClick={() => setViewingEvent(event)} />)
        )}
      </Box>
    </>
  );

  return (
    <Box sx={{ bgcolor: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppNav current="calendar" />

      {isDesktop ? (
        /* ── DESKTOP: side-by-side ── */
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Box sx={{ width: '52%', borderRight: '1px solid #E0E6ED', px: 5, py: 4, overflowY: 'auto' }}>
            {MonthNav}
            {DayHeaders}
            <DayCells flexible={false} />
          </Box>
          <Box sx={{ flex: 1, px: 4, py: 4, overflowY: 'auto' }}>
            {EventList}
          </Box>
        </Box>
      ) : (
        /* ── MOBILE: fixed 50/50 split ── */
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Top half: calendar fills exactly 50% */}
          <Box sx={{ height: '50%', display: 'flex', flexDirection: 'column', px: 2, pt: 2, pb: 1 }}>
            {MonthNav}
            {DayHeaders}
            <DayCells flexible />
          </Box>

          <Divider />

          {/* Bottom half: events scroll independently */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2, pb: '76px' }}>
            {EventList}
          </Box>
        </Box>
      )}
      {/* Create new event */}
      <NewEventDialog
        open={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        defaultDate={
          selectedDay
            ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
            : undefined
        }
      />

      {/* View event */}
      <ViewEventDialog
        event={viewingEvent}
        onClose={() => setViewingEvent(null)}
        onEdit={event => { setViewingEvent(null); setEditingEvent(event); }}
      />

      {/* Edit event */}
      <NewEventDialog
        key={editingEvent?.id}
        open={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        editEvent={editingEvent ?? undefined}
        onDelete={() => editingEvent && handleDelete(editingEvent.id)}
        onCancelEvent={() => editingEvent && handleCancelEvent(editingEvent.id)}
      />
    </Box>
  );
}

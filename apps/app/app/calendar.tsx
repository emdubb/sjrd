/* eslint-disable max-lines -- TODO: extract DayCells, EventCard, and event list into separate files */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton, Fab, Divider, useTheme, useMediaQuery } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { AppNav } from '../src/components/AppNav';
import { EventCard } from '../src/components/EventCard';
import { EventTypeFilterBar } from '../src/components/EventTypeFilterBar';
import { NewEventDrawer } from '../src/components/NewEventDrawer';
import { EventDrawer } from '../src/components/EventDrawer';
import { HolidayConflictDialog } from '../src/components/HolidayConflictDialog';
import { BRAND, MONTH_NAMES } from '../src/lib/brand';
import { useHolidayCalendar } from '../src/lib/useHolidayCalendar';
import {
  fetchEventsForMonth,
  updateEvent,
  deleteEvent,
  cancelEvent,
  CANCELLED_COLOR,
  type AppEvent,
  type EventFormData,
} from '../src/lib/events';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const TODAY = new Date();

interface DayCellsProps {
  flexible: boolean;
  totalCells: number;
  firstDayOfWeek: number;
  daysInMonth: number;
  selectedDay: number | null;
  eventDayColors: Map<number, string[]>;
  holidayDays: Set<number>;
  isToday: (day: number) => boolean;
  onDayClick: (day: number) => void;
}

function DayCells({
  flexible,
  totalCells,
  firstDayOfWeek,
  daysInMonth,
  selectedDay,
  eventDayColors,
  holidayDays,
  isToday,
  onDayClick,
}: DayCellsProps) {
  return (
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
        const holiday = valid && holidayDays.has(day);

        return (
          <Box
            key={i}
            onClick={() => valid && onDayClick(day)}
            sx={{
              ...(!flexible ? { aspectRatio: '1' } : {}),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: { xs: 1.5, md: 2 },
              cursor: valid ? 'pointer' : 'default',
              border: valid ? '1px solid #E0E6ED' : 'none',
              bgcolor: selected
                ? BRAND.navy
                : holiday
                  ? BRAND.holidayBlue
                  : todayCell
                    ? BRAND.todayBg
                    : 'transparent',
              transition: 'background-color 0.1s',
              '&:hover': valid
                ? {
                    bgcolor: selected
                      ? BRAND.navy
                      : holiday
                        ? '#A9D5F0'
                        : todayCell
                          ? 'rgba(242, 191, 53, 0.3)'
                          : '#F5F7FA',
                  }
                : {},
              gap: 0.5,
            }}
          >
            {valid && (
              <>
                <Typography
                  sx={{
                    fontSize: { xs: '0.82rem', md: '0.9rem' },
                    fontWeight: todayCell || selected || holiday ? 700 : 400,
                    color: selected ? '#fff' : todayCell || holiday ? BRAND.navy : '#333',
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
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: selected ? '#fff' : color,
                        }}
                      />
                    ))}
                    {colors.length > 3 && (
                      <Typography
                        sx={{
                          fontSize: '0.6rem',
                          lineHeight: 1,
                          color: selected ? '#fff' : '#9AABBD',
                          ml: '1px',
                        }}
                      >
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
}

export default function CalendarPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newEventOpen, setNewEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
  const [typeFilters, setTypeFilters] = useState<string[]>([]);

  const toggleTypeFilter = (type: string) =>
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const loadEvents = useCallback(async () => {
    try {
      setEvents(await fetchEventsForMonth(viewYear, viewMonth));
    } catch {
      // silently ignore — empty calendar is better than a crash
    }
  }, [viewYear, viewMonth]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const {
    holidayDays,
    conflictEvents,
    saving: holidaySaving,
    saveEvent: handleSave,
    confirmConflicts: handleConflictConfirm,
    cancelConflicts: handleConflictCancel,
  } = useHolidayCalendar(viewYear, viewMonth, loadEvents);

  const handleUpdate = async (id: string, data: EventFormData) => {
    await updateEvent(id, data);
    await loadEvents();
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  const handleCancelEvent = async (id: string) => {
    await cancelEvent(id);
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, cancelled: true, accentColor: CANCELLED_COLOR } : e))
    );
    setSelectedEvent(null);
  };

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth]
  );
  const firstDayOfWeek = useMemo(
    () => new Date(viewYear, viewMonth, 1).getDay(),
    [viewYear, viewMonth]
  );
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const monthEventsAll = useMemo(
    () => events.filter((e) => e.year === viewYear && e.month === viewMonth),
    [events, viewYear, viewMonth]
  );

  const monthEvents = useMemo(
    () =>
      monthEventsAll
        .filter((e) => typeFilters.length === 0 || typeFilters.includes(e.type))
        .sort((a, b) => a.day - b.day),
    [monthEventsAll, typeFilters]
  );

  const eventDayColors = useMemo(() => {
    const map = new Map<number, string[]>();
    monthEvents.forEach((e) => {
      map.set(e.day, [...(map.get(e.day) ?? []), e.accentColor]);
    });
    return map;
  }, [monthEvents]);

  const visibleEvents = useMemo(
    () => (selectedDay ? monthEvents.filter((e) => e.day === selectedDay) : monthEvents),
    [monthEvents, selectedDay]
  );

  const prevMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    setSelectedDay(null);
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isToday = (day: number) =>
    day === TODAY.getDate() && viewMonth === TODAY.getMonth() && viewYear === TODAY.getFullYear();

  const MonthNav = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: { xs: 1, md: 2.5 },
      }}
    >
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
        <Typography
          key={i}
          sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#9AABBD', fontWeight: 600 }}
        >
          {d}
        </Typography>
      ))}
    </Box>
  );

  const handleDayClick = (day: number) => setSelectedDay((d) => (d === day ? null : day));

  const emptyEventsMessage =
    monthEventsAll.length === 0
      ? `No events ${selectedDay ? 'on this day' : 'this month'}`
      : 'No events match your filters.';

  const EventList = (
    <>
      <Box sx={{ mb: 2 }}>
        <EventTypeFilterBar selectedTypes={typeFilters} onToggleType={toggleTypeFilter} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {visibleEvents.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', textAlign: 'center', py: 6 }}>
            {emptyEventsMessage}
          </Typography>
        ) : (
          visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event)} />
          ))
        )}
      </Box>
    </>
  );

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AppNav current="calendar" />

      {isDesktop ? (
        /* ── DESKTOP: side-by-side ── */
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Box
            sx={{ width: '52%', borderRight: '1px solid #E0E6ED', px: 5, py: 4, overflowY: 'auto' }}
          >
            {MonthNav}
            {DayHeaders}
            <DayCells
              flexible={false}
              totalCells={totalCells}
              firstDayOfWeek={firstDayOfWeek}
              daysInMonth={daysInMonth}
              selectedDay={selectedDay}
              eventDayColors={eventDayColors}
              holidayDays={holidayDays}
              isToday={isToday}
              onDayClick={handleDayClick}
            />
          </Box>
          <Box sx={{ flex: 1, px: 4, py: 4, overflowY: 'auto' }}>{EventList}</Box>
        </Box>
      ) : (
        /* ── MOBILE: fixed 50/50 split ── */
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            sx={{ height: '50%', display: 'flex', flexDirection: 'column', px: 2, pt: 2, pb: 1 }}
          >
            {MonthNav}
            {DayHeaders}
            <DayCells
              flexible
              totalCells={totalCells}
              firstDayOfWeek={firstDayOfWeek}
              daysInMonth={daysInMonth}
              selectedDay={selectedDay}
              eventDayColors={eventDayColors}
              holidayDays={holidayDays}
              isToday={isToday}
              onDayClick={handleDayClick}
            />
          </Box>

          <Divider />

          <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pt: 2, pb: '76px' }}>{EventList}</Box>
        </Box>
      )}

      {/* Add event FAB */}
      <Fab
        onClick={() => setNewEventOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 80, md: 32 },
          right: { xs: 20, md: 32 },
          bgcolor: BRAND.navy,
          color: '#fff',
          boxShadow: 3,
          '&:hover': { bgcolor: '#112C56' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Create new event */}
      <NewEventDrawer
        open={newEventOpen}
        onClose={() => setNewEventOpen(false)}
        onSave={handleSave}
        defaultDate={
          selectedDay
            ? `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
            : undefined
        }
      />

      {/* View / edit event */}
      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onSave={(data) => handleUpdate(selectedEvent!.id, data)}
        onDelete={() => selectedEvent && handleDelete(selectedEvent.id)}
        onCancelEvent={() => selectedEvent && handleCancelEvent(selectedEvent.id)}
      />

      {/* Existing-event conflicts when adding a multi-day holiday */}
      <HolidayConflictDialog
        conflicts={conflictEvents}
        saving={holidaySaving}
        onCancel={handleConflictCancel}
        onConfirm={handleConflictConfirm}
      />
    </Box>
  );
}

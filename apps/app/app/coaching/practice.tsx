import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Box, Typography, Tabs, Tab, Button, Fab, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AppNav } from '../../src/components/AppNav';
import { BackHeader } from '../../src/components/BackHeader';
import { PracticeScheduleCard } from '../../src/components/PracticeScheduleCard';
import { DrillRow } from '../../src/components/DrillRow';
import { DrillDrawer } from '../../src/components/DrillDrawer';
import { DrillFilterBar } from '../../src/components/DrillFilterBar';
import { PracticeDetailDrawer } from '../../src/components/PracticeDetailDrawer';
import { PracticeFilterPopover } from '../../src/components/PracticeFilterPopover';
import { BRAND, pillChipSx } from '../../src/lib/brand';
import {
  fetchPracticeSchedule,
  fetchCoaches,
  type PracticeEvent,
  type ScheduleScope,
  type PracticeFilters,
  type CoachOption,
} from '../../src/lib/practice';
import { fetchTeams } from '../../src/lib/events';
import {
  fetchDrills,
  createDrill,
  updateDrill,
  deleteDrill,
  filterDrills,
  type Drill,
  type DrillFormData,
  type DrillCategory,
  type DrillType,
} from '../../src/lib/drills';

type DrillDrawerState = { open: false } | { open: true; drill: Drill | null };

type PracticeTab = 'drills' | 'schedule';

const NO_FILTERS: PracticeFilters = { startDate: null, endDate: null, teamId: null };

function EmptyTabState({ text }: { text: string }) {
  return (
    <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
      {text}
    </Typography>
  );
}

function LoadMoreButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      sx={{ alignSelf: 'flex-start', color: BRAND.navy, textTransform: 'none', fontWeight: 600 }}
    >
      Load more
    </Button>
  );
}

export default function PracticePage() {
  const router = useRouter();
  const [tab, setTab] = useState<PracticeTab>('schedule');
  const [scope, setScope] = useState<ScheduleScope>('upcoming');
  const [filters, setFilters] = useState<PracticeFilters>(NO_FILTERS);

  const [practiceEvents, setPracticeEvents] = useState<PracticeEvent[]>([]);
  const [eventOffset, setEventOffset] = useState(0);
  const [hasMoreEvents, setHasMoreEvents] = useState(false);

  const [drills, setDrills] = useState<Drill[]>([]);
  const [drillDrawer, setDrillDrawer] = useState<DrillDrawerState>({ open: false });
  const [drillSearch, setDrillSearch] = useState('');
  const [drillCategoryFilter, setDrillCategoryFilter] = useState<DrillCategory | null>(null);
  const [drillTypeFilters, setDrillTypeFilters] = useState<DrillType[]>([]);

  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [scheduleDrawerEvent, setScheduleDrawerEvent] = useState<PracticeEvent | null>(null);

  const loadSchedule = useCallback(
    async (targetScope: ScheduleScope, offset = 0, append = false, targetFilters = filters) => {
      try {
        const { events, hasMore } = await fetchPracticeSchedule(offset, targetScope, targetFilters);
        setPracticeEvents((prev) => (append ? [...prev, ...events] : events));
        setEventOffset(offset + events.length);
        setHasMoreEvents(hasMore);
      } catch {
        // silently ignore
      }
    },
    [filters]
  );

  useEffect(() => {
    loadSchedule(scope, 0, false, filters);
  }, [scope, filters, loadSchedule]);

  useEffect(() => {
    fetchDrills()
      .then(setDrills)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchCoaches()
      .then(setCoaches)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch(() => {});
  }, []);

  const editingDrill = drillDrawer.open ? drillDrawer.drill : null;

  const toggleDrillTypeFilter = (type: DrillType) =>
    setDrillTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );

  const selectDrillCategoryFilter = (category: DrillCategory) =>
    setDrillCategoryFilter((prev) => (prev === category ? null : category));

  const clearDrillFilters = () => {
    setDrillCategoryFilter(null);
    setDrillTypeFilters([]);
  };

  const filteredDrills = filterDrills(drills, {
    search: drillSearch,
    category: drillCategoryFilter,
    types: drillTypeFilters,
  });

  const handleSaveDrill = async (data: DrillFormData) => {
    if (editingDrill) {
      const updated = await updateDrill(editingDrill.id, data);
      setDrills((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    } else {
      const created = await createDrill(data);
      setDrills((prev) => [created, ...prev]);
    }
  };

  const handleDeleteDrill = async () => {
    if (!editingDrill) return;
    await deleteDrill(editingDrill.id);
    setDrills((prev) => prev.filter((d) => d.id !== editingDrill.id));
    setDrillDrawer({ open: false });
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />
      <BackHeader title="Practice" onBack={() => router.replace('/coaching')} />

      <Tabs
        value={tab}
        onChange={(_: unknown, v: PracticeTab) => setTab(v)}
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
        <Tab value="schedule" label="Practices" />
        <Tab value="drills" label="Drills" />
      </Tabs>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: tab === 'schedule' ? 2 : 0,
          px: 2,
          py: 2,
          pb: { xs: '88px', md: 3 },
          overflowY: 'auto',
        }}
      >
        {tab === 'schedule' && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label="Upcoming"
              onClick={() => setScope('upcoming')}
              sx={pillChipSx(scope === 'upcoming')}
            />
            <Chip label="Past" onClick={() => setScope('past')} sx={pillChipSx(scope === 'past')} />
            <PracticeFilterPopover filters={filters} onChange={setFilters} teams={teams} />
          </Box>
        )}

        {tab === 'schedule' && (
          <>
            {practiceEvents.length === 0 && (
              <EmptyTabState
                text={scope === 'upcoming' ? 'No upcoming practices.' : 'No past practices.'}
              />
            )}
            {practiceEvents.map((event) => (
              <PracticeScheduleCard
                key={event.id}
                event={event}
                isPast={scope === 'past'}
                onOpen={() => setScheduleDrawerEvent(event)}
              />
            ))}
            {hasMoreEvents && (
              <LoadMoreButton onClick={() => loadSchedule(scope, eventOffset, true)} />
            )}
          </>
        )}

        {tab === 'drills' && (
          <>
            <DrillFilterBar
              search={drillSearch}
              onSearchChange={setDrillSearch}
              category={drillCategoryFilter}
              onSelectCategory={selectDrillCategoryFilter}
              types={drillTypeFilters}
              onToggleType={toggleDrillTypeFilter}
              onClearFilters={clearDrillFilters}
            />
            {filteredDrills.length === 0 ? (
              <EmptyTabState
                text={drills.length === 0 ? 'No drills yet.' : 'No drills match your filters.'}
              />
            ) : (
              filteredDrills.map((drill) => (
                <DrillRow
                  key={drill.id}
                  drill={drill}
                  onClick={() => setDrillDrawer({ open: true, drill })}
                />
              ))
            )}
          </>
        )}
      </Box>

      {tab === 'drills' && (
        <Fab
          onClick={() => setDrillDrawer({ open: true, drill: null })}
          aria-label="Add drill"
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
      )}

      <DrillDrawer
        open={drillDrawer.open}
        editDrill={editingDrill}
        onClose={() => setDrillDrawer({ open: false })}
        onSave={handleSaveDrill}
        onDelete={handleDeleteDrill}
      />

      <PracticeDetailDrawer
        event={scheduleDrawerEvent}
        coaches={coaches}
        onClose={() => setScheduleDrawerEvent(null)}
        onEventUpdated={() => loadSchedule(scope, 0, false)}
      />
    </Box>
  );
}

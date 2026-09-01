import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Box, Typography, Button, Chip } from '@mui/material';
import { AppNav } from '../../src/components/AppNav';
import { CoachingBackHeader } from '../../src/components/CoachingBackHeader';
import { GameScheduleCard } from '../../src/components/GameScheduleCard';
import { GameDetailDrawer } from '../../src/components/GameDetailDrawer';
import { PracticeFilterPopover } from '../../src/components/PracticeFilterPopover';
import { BRAND, pillChipSx } from '../../src/lib/brand';
import { fetchGameSchedule, type GameEvent } from '../../src/lib/games';
import {
  fetchCoaches,
  type ScheduleScope,
  type PracticeFilters,
  type CoachOption,
} from '../../src/lib/practice';
import { fetchTeams } from '../../src/lib/events';

const NO_FILTERS: PracticeFilters = { startDate: null, endDate: null, teamId: null };

function EmptyState({ text }: { text: string }) {
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

export default function GamesPage() {
  const router = useRouter();
  const [scope, setScope] = useState<ScheduleScope>('upcoming');
  const [filters, setFilters] = useState<PracticeFilters>(NO_FILTERS);

  const [games, setGames] = useState<GameEvent[]>([]);
  const [gameOffset, setGameOffset] = useState(0);
  const [hasMoreGames, setHasMoreGames] = useState(false);

  const [coaches, setCoaches] = useState<CoachOption[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const [drawerEvent, setDrawerEvent] = useState<GameEvent | null>(null);

  const loadSchedule = useCallback(
    async (targetScope: ScheduleScope, offset = 0, append = false, targetFilters = filters) => {
      try {
        const { events, hasMore } = await fetchGameSchedule(offset, targetScope, targetFilters);
        setGames((prev) => (append ? [...prev, ...events] : events));
        setGameOffset(offset + events.length);
        setHasMoreGames(hasMore);
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
    fetchCoaches()
      .then(setCoaches)
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchTeams()
      .then(setTeams)
      .catch(() => {});
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav current="coaching" />
      <CoachingBackHeader title="Games" onBack={() => router.replace('/coaching')} />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          px: 2,
          py: 2,
          pb: { xs: '88px', md: 3 },
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label="Upcoming"
            onClick={() => setScope('upcoming')}
            sx={pillChipSx(scope === 'upcoming')}
          />
          <Chip label="Past" onClick={() => setScope('past')} sx={pillChipSx(scope === 'past')} />
          <PracticeFilterPopover filters={filters} onChange={setFilters} teams={teams} />
        </Box>

        {games.length === 0 && (
          <EmptyState text={scope === 'upcoming' ? 'No upcoming games.' : 'No past games.'} />
        )}
        {games.map((game) => (
          <GameScheduleCard
            key={game.id}
            event={game}
            isPast={scope === 'past'}
            onOpen={() => setDrawerEvent(game)}
          />
        ))}
        {hasMoreGames && <LoadMoreButton onClick={() => loadSchedule(scope, gameOffset, true)} />}
      </Box>

      <GameDetailDrawer
        event={drawerEvent}
        coaches={coaches}
        onClose={() => setDrawerEvent(null)}
        onEventUpdated={() => loadSchedule(scope, 0, false)}
      />
    </Box>
  );
}

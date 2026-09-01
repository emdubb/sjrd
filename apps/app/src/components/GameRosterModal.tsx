import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { RosterSkaterRow } from './RosterSkaterRow';
import { BRAND } from '../lib/brand';
import {
  fetchTeamSkaters,
  fetchAllSkaters,
  fetchGameRoster,
  saveGameRoster,
  type GameEvent,
  type RosterSkater,
} from '../lib/games';

interface Props {
  event: GameEvent | null;
  onClose: () => void;
}

export function GameRosterModal({ event, onClose }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [teamSkaters, setTeamSkaters] = useState<RosterSkater[]>([]);
  const [allSkaters, setAllSkaters] = useState<RosterSkater[]>([]);
  const [showAllSkaters, setShowAllSkaters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!event) return;
    setShowAllSkaters(false);
    setLoaded(false);
    Promise.all([
      Promise.all(event.teamIds.map((teamId) => fetchTeamSkaters(teamId))),
      fetchAllSkaters(),
      fetchGameRoster(event.id),
    ])
      .then(([teamSkaterLists, all, roster]) => {
        const merged = new Map<string, RosterSkater>();
        teamSkaterLists.flat().forEach((s) => merged.set(s.id, s));
        setTeamSkaters(Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name)));
        setAllSkaters(all);
        setSelectedIds(roster);
        setLoaded(true);
      })
      .catch(() => {});
  }, [event]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!event) return null;

  const visibleSkaters = showAllSkaters ? allSkaters : teamSkaters;

  const toggleSkater = (skaterId: string) =>
    setSelectedIds((prev) =>
      prev.includes(skaterId) ? prev.filter((id) => id !== skaterId) : [...prev, skaterId]
    );

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveGameRoster(event.id, selectedIds);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullScreen={!isDesktop}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: isDesktop ? 2 : 0,
          height: isDesktop ? '85vh' : '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader title="Build Roster" onClose={onClose} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3 }}>
        <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.5 }}>
          {event.dateLabel} · {event.team}
        </Typography>

        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}
        >
          <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
            {selectedIds.length} on roster
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={showAllSkaters}
                onChange={(e) => setShowAllSkaters(e.target.checked)}
              />
            }
            label="Show all skaters"
            sx={{
              m: 0,
              minHeight: 44,
              '& .MuiFormControlLabel-label': {
                fontSize: '0.85rem',
                fontWeight: 600,
                color: BRAND.navy,
              },
            }}
          />
        </Box>

        <Divider sx={{ mb: 0.5 }} />

        {!loaded ? null : visibleSkaters.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 2, textAlign: 'center' }}>
            {showAllSkaters
              ? 'No skaters found.'
              : 'No skaters on this team yet. Try "Show all skaters."'}
          </Typography>
        ) : (
          visibleSkaters.map((skater) => (
            <RosterSkaterRow
              key={skater.id}
              skater={skater}
              selected={selectedIds.includes(skater.id)}
              onToggle={() => toggleSkater(skater.id)}
            />
          ))
        )}
      </Box>

      <Box
        sx={{
          px: 3,
          pt: 1.5,
          pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleSave}
          disabled={saving}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {saving ? 'Saving…' : 'Save Roster'}
        </Button>
      </Box>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { AttendanceSkaterRow } from './AttendanceSkaterRow';
import { BRAND } from '../lib/brand';
import { updateEventNotes, type PracticeEvent } from '../lib/practice';
import { fetchTeamSkaters, type RosterSkater } from '../lib/games';
import {
  fetchAttendanceStatuses,
  saveAttendanceStatuses,
  type AttendanceStatus,
} from '../lib/attendance';

interface Props {
  event: PracticeEvent | null;
  onClose: () => void;
  onSaved?: () => void;
}

export function PracticeAttendanceModal({ event, onClose, onSaved }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [skaters, setSkaters] = useState<RosterSkater[]>([]);
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!event) return;
    setNotes(event.notes ?? '');
    Promise.all([
      Promise.all(event.teamIds.map((teamId) => fetchTeamSkaters(teamId))),
      fetchAttendanceStatuses(event.id),
    ])
      .then(([teamSkaterLists, fetchedStatuses]) => {
        const merged = new Map<string, RosterSkater>();
        teamSkaterLists.flat().forEach((s) => merged.set(s.id, s));
        setSkaters(Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name)));
        setStatuses(fetchedStatuses);
      })
      .catch(() => {});
  }, [event]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!event) return null;

  const statusFor = (skaterId: string): AttendanceStatus => statuses[skaterId] ?? 'absent';

  const setStatus = (skaterId: string, status: AttendanceStatus) =>
    setStatuses((prev) => ({ ...prev, [skaterId]: status }));

  const presentCount = skaters.filter((s) => statusFor(s.id) === 'present').length;
  const allPresent = skaters.length > 0 && presentCount === skaters.length;

  const handleToggleAll = () => {
    const nextStatus: AttendanceStatus = allPresent ? 'absent' : 'present';
    setStatuses(Object.fromEntries(skaters.map((s) => [s.id, nextStatus])));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fullStatuses = Object.fromEntries(skaters.map((s) => [s.id, statusFor(s.id)]));
      await Promise.all([
        saveAttendanceStatuses(event.id, fullStatuses),
        updateEventNotes(event.id, notes),
      ]);
      onSaved?.();
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
      <EventDrawerHeader title="Attendance" onClose={onClose} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3 }}>
        <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.5 }}>
          {event.dateLabel} · Practice
        </Typography>

        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}
        >
          <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
            {presentCount} of {skaters.length} present
          </Typography>
          <Button
            onClick={handleToggleAll}
            disabled={skaters.length === 0}
            sx={{ color: BRAND.navy, textTransform: 'none', fontWeight: 700, minHeight: 44 }}
          >
            {allPresent ? 'Deselect All' : 'Select All'}
          </Button>
        </Box>

        <Divider sx={{ mb: 0.5 }} />

        {skaters.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 2, textAlign: 'center' }}>
            No skaters found.
          </Typography>
        ) : (
          skaters.map((skater) => (
            <AttendanceSkaterRow
              key={skater.id}
              skater={skater}
              status={statusFor(skater.id)}
              onChange={(status) => setStatus(skater.id, status)}
            />
          ))
        )}

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem', mb: 1 }}>
          Notes
        </Typography>
        <TextField
          label="Notes"
          placeholder="Injuries, late arrivals, early leaves, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 1 }}
        />
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
          {saving ? 'Saving…' : 'Save Attendance'}
        </Button>
      </Box>
    </Dialog>
  );
}

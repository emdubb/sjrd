import { useState, useEffect } from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { EventDrawerHeader } from './EventDrawerHeader';
import { ColoredTag } from './ColoredTag';
import { DetailRow } from './DetailRow';
import { AssignField } from './AssignField';
import { GameRosterModal } from './GameRosterModal';
import { BRAND } from '../lib/brand';
import { setEventCoaches, type CoachOption } from '../lib/practice';
import type { GameEvent } from '../lib/games';

interface Props {
  event: GameEvent | null;
  coaches: CoachOption[];
  onClose: () => void;
  onEventUpdated: () => void;
}

export function GameDetailDrawer({ event, coaches, onClose, onEventUpdated }: Props) {
  const [coachId, setCoachId] = useState<string | null>(null);
  const [assistantIds, setAssistantIds] = useState<string[]>([]);
  const [rosterOpen, setRosterOpen] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!event) return;
    setRosterOpen(false);
    setCoachId(event.coachId);
    setAssistantIds(event.assistantIds);
  }, [event]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!event) return null;

  const coachName = (id: string) => coaches.find((c) => c.id === id)?.name ?? '';

  const handleCoachChange = async (ids: string[]) => {
    const newCoachId = ids[0] ?? null;
    setCoachId(newCoachId);
    await setEventCoaches(event.id, newCoachId, assistantIds);
    onEventUpdated();
  };

  const handleAssistantsChange = async (ids: string[]) => {
    setAssistantIds(ids);
    await setEventCoaches(event.id, coachId, ids);
    onEventUpdated();
  };

  return (
    <Drawer
      anchor="bottom"
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader onClose={onClose} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, pb: 3 }}>
        <ColoredTag label="Game" color={BRAND.amber} />
        <Typography
          sx={{
            fontWeight: 700,
            color: BRAND.navy,
            fontSize: '1.4rem',
            lineHeight: 1.15,
            mt: 0.25,
          }}
        >
          {event.title || event.fullDateLabel}
        </Typography>

        <Button
          onClick={() => setRosterOpen(true)}
          fullWidth
          variant="outlined"
          startIcon={<GroupsIcon />}
          sx={{
            mt: 1.5,
            borderColor: BRAND.navy,
            color: BRAND.navy,
            borderRadius: 1,
            py: 1.25,
            fontSize: '0.95rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: BRAND.notifBg, borderColor: BRAND.navy },
          }}
        >
          Build Roster
        </Button>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <DetailRow
            icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
            text={`${event.fullDateLabel} · ${event.time}`}
          />
          <DetailRow icon={<GroupIcon sx={{ fontSize: 18 }} />} text={event.team} />
          {event.description && (
            <DetailRow icon={<NotesIcon sx={{ fontSize: 18 }} />} text={event.description} />
          )}
          <AssignField
            icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
            label="Coach"
            valueText={coachId ? coachName(coachId) : ''}
            hasValue={!!coachId}
            options={coaches}
            selectedIds={coachId ? [coachId] : []}
            multiple={false}
            onChange={handleCoachChange}
          />
          <AssignField
            icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
            label="Asst"
            valueText={assistantIds.map(coachName).join(', ')}
            hasValue={assistantIds.length > 0}
            options={coaches.filter((c) => c.id !== coachId)}
            selectedIds={assistantIds}
            multiple
            onChange={handleAssistantsChange}
          />
        </Box>
      </Box>

      <GameRosterModal event={rosterOpen ? event : null} onClose={() => setRosterOpen(false)} />
    </Drawer>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { Drawer, Box, Typography, Button, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import NotesIcon from '@mui/icons-material/Notes';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { EventDrawerHeader } from './EventDrawerHeader';
import { ColoredTag } from './ColoredTag';
import { DetailRow } from './DetailRow';
import { AssignField } from './AssignField';
import { PracticeDrillRow } from './PracticeDrillRow';
import { DrillPickerDialog } from './DrillPickerDialog';
import { PracticeModeView } from './PracticeModeView';
import { PracticeAttendanceModal } from './PracticeAttendanceModal';
import { BRAND } from '../lib/brand';
import { setEventCoaches, type PracticeEvent, type CoachOption } from '../lib/practice';
import {
  fetchPracticeDrills,
  addPracticeDrill,
  removePracticeDrill,
  swapPracticeDrillPositions,
  type PracticeDrill,
} from '../lib/practicePlan';

interface Props {
  event: PracticeEvent | null;
  coaches: CoachOption[];
  onClose: () => void;
  onEventUpdated: () => void;
}

export function PracticeDetailDrawer({ event, coaches, onClose, onEventUpdated }: Props) {
  const [drills, setDrills] = useState<PracticeDrill[]>([]);
  const [coachId, setCoachId] = useState<string | null>(null);
  const [assistantIds, setAssistantIds] = useState<string[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [practiceModeOpen, setPracticeModeOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);

  const loadDrills = useCallback((eventId: string) => {
    fetchPracticeDrills(eventId)
      .then(setDrills)
      .catch(() => {});
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!event) return;
    setPickerOpen(false);
    setPracticeModeOpen(false);
    setAttendanceOpen(false);
    setCoachId(event.coachId);
    setAssistantIds(event.assistantIds);
    loadDrills(event.id);
  }, [event, loadDrills]);
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

  const handleAddDrill = async (drillId: string) => {
    const nextPosition = drills.length > 0 ? Math.max(...drills.map((d) => d.position)) + 1 : 0;
    await addPracticeDrill(event.id, drillId, nextPosition);
    loadDrills(event.id);
  };

  const handleRemoveDrill = async (drillId: string) => {
    await removePracticeDrill(event.id, drillId);
    loadDrills(event.id);
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const current = drills[index];
    const other = drills[index + direction];
    if (!other) return;
    await swapPracticeDrillPositions(
      event.id,
      { drillId: current.drillId, position: current.position },
      { drillId: other.drillId, position: other.position }
    );
    loadDrills(event.id);
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

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3 }}>
        <ColoredTag label="Practice" color={BRAND.navy} />
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

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1.5 }}>
          <Button
            onClick={() => setPracticeModeOpen(true)}
            fullWidth
            variant="outlined"
            startIcon={<OpenInFullIcon />}
            sx={{
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
            Practice Mode
          </Button>
          <Button
            onClick={() => setAttendanceOpen(true)}
            fullWidth
            variant="outlined"
            startIcon={<HowToRegIcon />}
            sx={{
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
            Take Attendance
          </Button>
        </Box>

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

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
          <EmojiEventsIcon sx={{ fontSize: 20, color: BRAND.navy }} />
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.15rem' }}>
            Drills
          </Typography>
        </Box>

        {drills.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 2, textAlign: 'center' }}>
            No drills planned yet.
          </Typography>
        ) : (
          drills.map((drill, index) => (
            <PracticeDrillRow
              key={drill.drillId}
              drill={drill}
              canMoveUp={index > 0}
              canMoveDown={index < drills.length - 1}
              onMoveUp={() => handleMove(index, -1)}
              onMoveDown={() => handleMove(index, 1)}
              onRemove={() => handleRemoveDrill(drill.drillId)}
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
          onClick={() => setPickerOpen(true)}
          fullWidth
          variant="contained"
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#112C56' },
          }}
        >
          Add Drill
        </Button>
      </Box>

      <DrillPickerDialog
        open={pickerOpen}
        excludeDrillIds={drills.map((d) => d.drillId)}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddDrill}
      />

      <PracticeModeView
        event={practiceModeOpen ? event : null}
        onClose={() => setPracticeModeOpen(false)}
        onNotesSaved={onEventUpdated}
      />

      <PracticeAttendanceModal
        event={attendanceOpen ? event : null}
        onClose={() => setAttendanceOpen(false)}
        onSaved={onEventUpdated}
      />
    </Drawer>
  );
}

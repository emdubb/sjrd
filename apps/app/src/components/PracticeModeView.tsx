import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { EventDrawerHeader } from './EventDrawerHeader';
import { DrillViewBody } from './DrillViewBody';
import { TagChip } from './TagChip';
import { BRAND } from '../lib/brand';
import { updateEventNotes, type PracticeEvent } from '../lib/practice';
import { DRILL_EQUIPMENT_LABELS } from '../lib/drills';
import { fetchPracticeModeDrills, type PracticeModeDrill } from '../lib/practicePlan';

interface Props {
  event: PracticeEvent | null;
  onClose: () => void;
  onNotesSaved: () => void;
}

export function PracticeModeView({ event, onClose, onNotesSaved }: Props) {
  const [drills, setDrills] = useState<PracticeModeDrill[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!event) return;
    setNotes(event.notes ?? '');
    setCompleted({});
    fetchPracticeModeDrills(event.id)
      .then((fetched) => {
        setDrills(fetched);
        setExpanded(Object.fromEntries(fetched.map((d) => [d.id, true])));
      })
      .catch(() => {});
  }, [event]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleExpanded = useCallback((drillId: string) => {
    setExpanded((prev) => ({ ...prev, [drillId]: !prev[drillId] }));
  }, []);

  const toggleCompleted = (drillId: string) => {
    setCompleted((prev) => {
      const isNowComplete = !prev[drillId];
      if (isNowComplete) setExpanded((exp) => ({ ...exp, [drillId]: false }));
      return { ...prev, [drillId]: isNowComplete };
    });
  };

  if (!event) return null;

  const equipmentNeeded = Array.from(new Set(drills.flatMap((d) => d.equipment)));
  const completedCount = drills.filter((d) => completed[d.id]).length;

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await updateEventNotes(event.id, notes);
      onNotesSaved();
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullScreen
      PaperProps={{ sx: { display: 'flex', flexDirection: 'column' } }}
    >
      <EventDrawerHeader title="Practice Mode" onClose={onClose} />

      <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: 3, py: 2 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem', mb: 1 }}>
          Equipment Needed
        </Typography>
        {equipmentNeeded.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD' }}>
            No equipment needed.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {equipmentNeeded.map((item) => (
              <TagChip key={item} label={DRILL_EQUIPMENT_LABELS[item]} />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem' }}>
            Drills
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
            {completedCount} of {drills.length} complete
          </Typography>
        </Box>

        {drills.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 2, textAlign: 'center' }}>
            No drills planned yet.
          </Typography>
        ) : (
          drills.map((drill) => {
            const isComplete = !!completed[drill.id];
            return (
              <Accordion
                key={drill.id}
                expanded={!!expanded[drill.id]}
                onChange={() => toggleExpanded(drill.id)}
                disableGutters
                elevation={0}
                sx={{
                  border: '1px solid #E0E6ED',
                  borderRadius: 2,
                  mb: 1.5,
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Checkbox
                      checked={isComplete}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleted(drill.id);
                      }}
                      sx={{ p: 0.5 }}
                    />
                    <Typography
                      noWrap
                      sx={{
                        fontWeight: 700,
                        color: isComplete ? '#9AABBD' : BRAND.navy,
                        textDecoration: isComplete ? 'line-through' : 'none',
                        fontSize: '1rem',
                      }}
                    >
                      {drill.title}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <DrillViewBody drill={drill} />
                </AccordionDetails>
              </Accordion>
            );
          })
        )}

        <Divider sx={{ my: 2 }} />

        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem', mb: 1 }}>
          Practice Notes
        </Typography>
        <TextField
          label="Notes"
          placeholder="What went well, what to adjust next time, attendance callouts, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 1.5 }}
        />
        <Button
          onClick={handleSaveNotes}
          disabled={savingNotes}
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 1,
            px: 3,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {savingNotes ? 'Saving…' : 'Save Notes'}
        </Button>
      </Box>
    </Dialog>
  );
}

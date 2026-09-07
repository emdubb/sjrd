import { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { PracticeDrillRow } from './PracticeDrillRow';
import { DrillPickerDialog } from './DrillPickerDialog';
import { BRAND } from '../lib/brand';
import type { CurriculumDrill } from '../lib/curriculum';

interface Props {
  weekNumber: string;
  onWeekNumberChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  drills: CurriculumDrill[];
  onDrillsChange: (drills: CurriculumDrill[]) => void;
}

export function CurriculumForm({
  weekNumber,
  onWeekNumberChange,
  content,
  onContentChange,
  drills,
  onDrillsChange,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const reorder = (index: number, direction: -1 | 1) => {
    const next = [...drills];
    const other = index + direction;
    if (other < 0 || other >= next.length) return;
    [next[index], next[other]] = [next[other], next[index]];
    onDrillsChange(next.map((d, i) => ({ ...d, position: i })));
  };

  const removeDrill = (id: string) => onDrillsChange(drills.filter((d) => d.id !== id));

  const addDrill = (drillId: string, title: string, durationMinutes: number) => {
    onDrillsChange([...drills, { id: drillId, title, durationMinutes, position: drills.length }]);
    setPickerOpen(false);
  };

  return (
    <Box
      sx={{
        px: 3,
        pt: 1,
        pb: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
      }}
    >
      <TextField
        label="Week Number"
        type="number"
        value={weekNumber}
        onChange={(e) => onWeekNumberChange(e.target.value)}
        variant="outlined"
        fullWidth
        slotProps={{ htmlInput: { min: 1 } }}
      />

      <TextField
        label="Content"
        placeholder="What this week covers — skills, focus areas, goals, etc."
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        variant="outlined"
        fullWidth
        multiline
        rows={5}
      />

      <Box>
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
          Drills
        </Typography>
        {drills.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#9AABBD', py: 1 }}>
            No drills added yet.
          </Typography>
        ) : (
          drills.map((drill, index) => (
            <PracticeDrillRow
              key={drill.id}
              drill={{
                drillId: drill.id,
                title: drill.title,
                durationMinutes: drill.durationMinutes,
                position: index,
              }}
              canMoveUp={index > 0}
              canMoveDown={index < drills.length - 1}
              onMoveUp={() => reorder(index, -1)}
              onMoveDown={() => reorder(index, 1)}
              onRemove={() => removeDrill(drill.id)}
            />
          ))
        )}
        <Button
          onClick={() => setPickerOpen(true)}
          startIcon={<AddIcon />}
          sx={{ color: BRAND.navy, fontWeight: 700, textTransform: 'none', mt: 1, minHeight: 44 }}
        >
          Add Drill
        </Button>
      </Box>

      <DrillPickerDialog
        open={pickerOpen}
        excludeDrillIds={drills.map((d) => d.id)}
        onClose={() => setPickerOpen(false)}
        onSelect={(drill) => addDrill(drill.id, drill.title, drill.durationMinutes)}
      />
    </Box>
  );
}

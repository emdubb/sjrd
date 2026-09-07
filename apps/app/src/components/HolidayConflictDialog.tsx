import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { EventDrawerHeader } from './EventDrawerHeader';
import { BRAND, formatEventDateRange } from '../lib/brand';
import type { AppEvent } from '../lib/events';

interface Props {
  conflicts: AppEvent[];
  saving: boolean;
  onCancel: () => void;
  onConfirm: (selectedIds: string[]) => void;
}

export function HolidayConflictDialog({ conflicts, saving, onCancel, onConfirm }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setSelectedIds([]);
  }, [conflicts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const open = conflicts.length > 0;
  if (!open) return null;

  const toggle = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const allSelected = selectedIds.length === conflicts.length;
  const toggleAll = () => setSelectedIds(allSelected ? [] : conflicts.map((c) => c.id));

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2, display: 'flex', flexDirection: 'column' } }}
    >
      <EventDrawerHeader title="Existing Events Found" onClose={onCancel} />

      <Box sx={{ px: 3, pb: 1 }}>
        <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
          These events fall within the holiday&apos;s date range. Select any you&apos;d like to
          cancel — they won&apos;t be deleted, just marked cancelled.
        </Typography>
      </Box>

      <Box sx={{ px: 3, pb: 1 }}>
        <FormControlLabel
          control={<Checkbox checked={allSelected} onChange={toggleAll} />}
          label="Select all"
          sx={{ '& .MuiFormControlLabel-label': { fontWeight: 600, color: BRAND.navy } }}
        />
        <Divider />
      </Box>

      <Box sx={{ px: 3, pb: 1, maxHeight: '50vh', overflowY: 'auto' }}>
        {conflicts.map((event) => (
          <FormControlLabel
            key={event.id}
            control={
              <Checkbox
                checked={selectedIds.includes(event.id)}
                onChange={() => toggle(event.id)}
              />
            }
            label={
              <Box>
                <Typography sx={{ fontWeight: 600, color: BRAND.navy, fontSize: '0.95rem' }}>
                  {event.title} ({event.type})
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7A8D' }}>
                  {formatEventDateRange(event)} · {event.time}
                </Typography>
              </Box>
            }
            sx={{ display: 'flex', alignItems: 'flex-start', py: 0.75, ml: 0 }}
          />
        ))}
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
          onClick={() => onConfirm(selectedIds)}
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
            '&:hover': { bgcolor: '#112C56' },
            '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
          }}
        >
          {saving
            ? 'Saving…'
            : selectedIds.length > 0
              ? `Cancel ${selectedIds.length} Event${selectedIds.length > 1 ? 's' : ''} & Save Holiday`
              : 'Save Holiday'}
        </Button>
      </Box>
    </Dialog>
  );
}

import { Box, Chip } from '@mui/material';
import { pillChipSx } from '../lib/brand';
import { EVENT_TYPE_LABELS } from '../lib/events';

interface Props {
  selectedTypes: string[];
  onToggleType: (type: string) => void;
}

export function EventTypeFilterBar({ selectedTypes, onToggleType }: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
      {EVENT_TYPE_LABELS.map((type) => (
        <Chip
          key={type}
          label={type}
          onClick={() => onToggleType(type)}
          sx={pillChipSx(selectedTypes.includes(type))}
        />
      ))}
    </Box>
  );
}

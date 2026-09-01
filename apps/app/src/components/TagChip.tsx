import { Chip } from '@mui/material';
import { BRAND } from '../lib/brand';

interface Props {
  label: string;
}

// For multi-tag groups (e.g. drill types); ColoredTag is for a single eyebrow label instead.
export function TagChip({ label }: Props) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: BRAND.steel,
        color: BRAND.steel,
        bgcolor: '#fff',
        fontWeight: 700,
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        height: 22,
        borderRadius: '11px',
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

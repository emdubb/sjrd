import { Box, Typography, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BRAND } from '../lib/brand';

interface Props {
  name: string;
  onRemove: () => void;
}

export function AttachedSkaterRow({ name, onRemove }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        py: 1,
        borderBottom: '1px solid #E0E6ED',
      }}
    >
      <Typography sx={{ color: BRAND.navy, fontWeight: 600, fontSize: '1rem' }}>{name}</Typography>
      <IconButton
        onClick={onRemove}
        aria-label={`Remove ${name}`}
        sx={{ color: '#C62828', width: 44, height: 44 }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

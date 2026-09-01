import { Box, Typography, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { BRAND } from '../lib/brand';
import type { PracticeDrill } from '../lib/practicePlan';

interface Props {
  drill: PracticeDrill;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export function PracticeDrillRow({
  drill,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
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
      <Typography sx={{ color: BRAND.navy, fontWeight: 600, fontSize: '1rem' }}>
        {drill.title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {canMoveUp && (
          <IconButton
            onClick={onMoveUp}
            aria-label={`Move ${drill.title} up`}
            sx={{ color: '#6B7A8D', width: 44, height: 44 }}
          >
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
        )}
        {canMoveDown && (
          <IconButton
            onClick={onMoveDown}
            aria-label={`Move ${drill.title} down`}
            sx={{ color: '#6B7A8D', width: 44, height: 44 }}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
        )}
        <IconButton
          onClick={onRemove}
          aria-label={`Remove ${drill.title}`}
          sx={{ color: '#C62828', width: 44, height: 44 }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

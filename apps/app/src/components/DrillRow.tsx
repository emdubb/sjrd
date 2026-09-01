import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { ReactNode } from 'react';
import { BRAND } from '../lib/brand';
import {
  DRILL_TYPE_LABELS,
  DRILL_CATEGORY_LABELS,
  DRILL_CATEGORY_COLORS,
  type Drill,
} from '../lib/drills';
import { ColoredTag } from './ColoredTag';
import { TagChip } from './TagChip';

interface Props {
  drill: Drill;
  onClick: () => void;
  trailingIcon?: ReactNode;
}

export function DrillRow({
  drill,
  onClick,
  trailingIcon = <ChevronRightIcon sx={{ color: '#9AABBD', flexShrink: 0 }} />,
}: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        py: 1.5,
        px: 1.5,
        mx: -1.5,
        borderBottom: '1px solid #E0E6ED',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: BRAND.notifBg },
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {drill.categories.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0.25 }}>
            {drill.categories.map((category) => (
              <ColoredTag
                key={category}
                label={DRILL_CATEGORY_LABELS[category]}
                color={DRILL_CATEGORY_COLORS[category]}
              />
            ))}
          </Box>
        )}
        <Typography
          sx={{ color: BRAND.navy, fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, mb: 0.25 }}
        >
          {drill.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', fontSize: '0.78rem' }}>
          {drill.durationMinutes} min
        </Typography>

        {drill.description && (
          <Typography variant="body2" sx={{ color: '#6B7A8D', fontSize: '0.8rem', mt: 0.5 }}>
            {drill.description}
          </Typography>
        )}

        {drill.types.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 0.75 }}>
            {drill.types.map((type) => (
              <TagChip key={type} label={DRILL_TYPE_LABELS[type]} />
            ))}
          </Box>
        )}
      </Box>

      {trailingIcon}
    </Box>
  );
}

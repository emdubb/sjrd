import { Box, Typography, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HandymanIcon from '@mui/icons-material/Handyman';
import { BRAND } from '../lib/brand';
import {
  DRILL_TYPE_LABELS,
  DRILL_CATEGORY_LABELS,
  DRILL_CATEGORY_COLORS,
  DRILL_EQUIPMENT_LABELS,
  type Drill,
} from '../lib/drills';
import { ColoredTag } from './ColoredTag';
import { TagChip } from './TagChip';
import { DetailRow } from './DetailRow';

interface Props {
  drill: Drill;
}

export function DrillViewBody({ drill }: Props) {
  return (
    <Box sx={{ px: 3, pt: 0.5, pb: 3 }}>
      {drill.categories.length > 0 && (
        <Box sx={{ mb: 1, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
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
        sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.6rem', lineHeight: 1.15, mb: 0.5 }}
      >
        {drill.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box>
        <DetailRow
          icon={<AccessTimeIcon sx={{ fontSize: 18 }} />}
          text={`${drill.durationMinutes} min`}
        />
        {drill.description && (
          <DetailRow icon={<NotesIcon sx={{ fontSize: 18 }} />} text={drill.description} />
        )}
        {drill.equipment.length > 0 && (
          <DetailRow
            icon={<HandymanIcon sx={{ fontSize: 18 }} />}
            text={drill.equipment.map((item) => DRILL_EQUIPMENT_LABELS[item]).join(', ')}
          />
        )}
        {drill.createdByName && (
          <DetailRow
            icon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
            text={`Created by ${drill.createdByName}`}
          />
        )}
      </Box>

      {drill.instructions && (
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 0.5 }}>
            Instructions
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: '#4A5568', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
          >
            {drill.instructions}
          </Typography>
        </Box>
      )}

      {drill.types.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {drill.types.map((type) => (
            <TagChip key={type} label={DRILL_TYPE_LABELS[type]} />
          ))}
        </Box>
      )}
    </Box>
  );
}

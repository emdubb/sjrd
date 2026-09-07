import { Typography, Box, ButtonBase } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND } from '../lib/brand';
import type { CurriculumItem } from '../lib/curriculum';

interface Props {
  item: CurriculumItem;
  onOpen: () => void;
}

export function CurriculumRow({ item, onOpen }: Props) {
  return (
    <ButtonBase
      onClick={onOpen}
      focusRipple
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: '1px solid #E0E6ED',
        borderLeft: `4px solid ${BRAND.navy}`,
        bgcolor: '#fff',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem' }}>
            Week {item.weekNumber}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: '#6B7A8D', mt: 0.25 }}>
            {item.content || 'No content added yet.'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#9AABBD', mt: 0.25, fontSize: '0.8rem' }}>
            {item.drills.length} drill{item.drills.length === 1 ? '' : 's'}
          </Typography>
        </Box>
        <ChevronRightIcon sx={{ color: '#9AABBD', flexShrink: 0 }} />
      </Box>
    </ButtonBase>
  );
}

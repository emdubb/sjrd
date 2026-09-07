import { Box, Typography, Divider } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { BRAND } from '../lib/brand';
import type { EventCurriculum } from '../lib/curriculum';

export function PracticeCurriculumSection({ curriculum }: { curriculum: EventCurriculum }) {
  return (
    <>
      <Divider sx={{ my: 1.5 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
        <MenuBookIcon sx={{ fontSize: 20, color: BRAND.navy }} />
        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.15rem' }}>
          Week {curriculum.weekNumber} Curriculum
        </Typography>
      </Box>
      <Typography
        variant="body2"
        sx={{ color: '#4A5568', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}
      >
        {curriculum.content || 'No curriculum notes for this week.'}
      </Typography>
    </>
  );
}

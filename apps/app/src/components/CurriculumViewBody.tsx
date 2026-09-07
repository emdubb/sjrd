import { Box, Typography, Divider } from '@mui/material';
import { ColoredTag } from './ColoredTag';
import { TagChip } from './TagChip';
import { BRAND } from '../lib/brand';
import type { CurriculumItem } from '../lib/curriculum';

export function CurriculumViewBody({ item }: { item: CurriculumItem }) {
  return (
    <Box sx={{ px: 3, pt: 0.5, pb: 3 }}>
      <ColoredTag label={`Week ${item.weekNumber}`} color={BRAND.navy} />

      <Typography
        variant="body2"
        sx={{ color: '#4A5568', lineHeight: 1.6, whiteSpace: 'pre-wrap', mt: 1 }}
      >
        {item.content || 'No content added yet.'}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.1rem', mb: 1 }}>
        Drills
      </Typography>
      {item.drills.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#9AABBD' }}>
          No drills added yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {item.drills.map((drill) => (
            <TagChip key={drill.id} label={drill.title} />
          ))}
        </Box>
      )}
    </Box>
  );
}

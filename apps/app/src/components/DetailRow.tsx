import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  text: string;
}

export function DetailRow({ icon, text }: Props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box sx={{ color: '#9AABBD', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.6 }}>
        {text}
      </Typography>
    </Box>
  );
}

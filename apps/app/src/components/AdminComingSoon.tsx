import { Typography } from '@mui/material';

export function AdminComingSoon({ label }: { label: string }) {
  return (
    <Typography variant="body2" sx={{ color: '#9AABBD', py: 4, textAlign: 'center' }}>
      {label} management is coming soon.
    </Typography>
  );
}

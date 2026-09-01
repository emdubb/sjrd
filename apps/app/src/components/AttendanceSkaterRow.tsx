import { Box, Typography } from '@mui/material';
import { AttendanceStatusToggle } from './AttendanceStatusToggle';
import { BRAND } from '../lib/brand';
import type { AttendanceStatus } from '../lib/attendance';

interface Props {
  skater: { id: string; name: string };
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

export function AttendanceSkaterRow({ skater, status, onChange }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        py: 1.25,
        borderBottom: '1px solid #E0E6ED',
      }}
    >
      <Typography sx={{ color: BRAND.navy, fontWeight: 600, fontSize: '1rem' }}>
        {skater.name}
      </Typography>
      <AttendanceStatusToggle skaterName={skater.name} status={status} onChange={onChange} />
    </Box>
  );
}

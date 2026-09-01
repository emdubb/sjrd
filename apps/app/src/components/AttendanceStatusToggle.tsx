import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { BRAND } from '../lib/brand';
import type { AttendanceStatus } from '../lib/attendance';

interface Props {
  skaterName: string;
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

const OPTIONS: { value: AttendanceStatus; label: string; name: string }[] = [
  { value: 'present', label: 'P', name: 'Present' },
  { value: 'partial', label: '½', name: 'Partial' },
  { value: 'absent', label: 'A', name: 'Absent' },
];

export function AttendanceStatusToggle({ skaterName, status, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      onChange={(_, value: AttendanceStatus | null) => {
        if (value) onChange(value);
      }}
      sx={{ flexShrink: 0 }}
    >
      {OPTIONS.map((opt) => (
        <ToggleButton
          key={opt.value}
          value={opt.value}
          aria-label={`Mark ${skaterName} ${opt.name.toLowerCase()}`}
          sx={{
            minWidth: 44,
            minHeight: 44,
            fontWeight: 700,
            fontSize: '0.95rem',
            color: BRAND.navy,
            borderColor: '#C8D0DA',
            textTransform: 'none',
            '&.Mui-selected': {
              bgcolor: BRAND.navy,
              color: '#fff',
              '&:hover': { bgcolor: '#112C56' },
            },
          }}
        >
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

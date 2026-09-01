import { Typography } from '@mui/material';

interface Props {
  label: string;
  color: string;
}

export function ColoredTag({ label, color }: Props) {
  return (
    <Typography
      sx={{
        color,
        fontWeight: 800,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}
    >
      {label}
    </Typography>
  );
}

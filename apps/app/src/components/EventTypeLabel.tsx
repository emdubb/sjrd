import { Typography } from '@mui/material';
import { getAccentColor, type AppEvent } from '../lib/events';

interface Props {
  event: AppEvent;
}

export function EventTypeLabel({ event }: Props) {
  const cancelled = !!event.cancelled;
  const accentColor = getAccentColor(event);

  return (
    <Typography
      sx={{
        color: accentColor,
        fontWeight: 800,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
      }}
    >
      {cancelled ? `Cancelled · ${event.type}` : event.type}
    </Typography>
  );
}

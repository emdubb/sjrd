import { Card, CardContent, Typography, Box } from '@mui/material';
import { BRAND, formatEventDateRange } from '../lib/brand';
import { getAccentColor, type AppEvent } from '../lib/events';
import { EventTypeLabel } from './EventTypeLabel';

interface Props {
  event: AppEvent;
  onClick: () => void;
}

export function EventCard({ event, onClick }: Props) {
  const cancelled = !!event.cancelled;
  const accentColor = getAccentColor(event);

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        border: `1px solid ${cancelled ? '#FFCDD2' : '#E0E6ED'}`,
        borderLeft: `4px solid ${accentColor}`,
        bgcolor: cancelled ? '#FFF8F8' : '#fff',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ pb: '14px !important', pt: 1.75, px: 2 }}>
        <Box sx={{ mb: 0.5 }}>
          <EventTypeLabel event={event} />
        </Box>
        <Typography
          sx={{
            fontWeight: 700,
            color: cancelled ? accentColor : BRAND.navy,
            fontSize: '1rem',
            lineHeight: 1.2,
            mb: 0.5,
            textDecoration: cancelled ? 'line-through' : 'none',
          }}
        >
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', fontSize: '0.78rem' }}>
          {event.type === 'Holiday'
            ? formatEventDateRange(event)
            : `${formatEventDateRange(event)} · ${event.time}`}
        </Typography>
        <Typography
          sx={{
            color: '#9AABBD',
            fontSize: '0.7rem',
            fontWeight: 500,
            borderTop: '1px solid #F0F3F6',
            pt: 1,
            mt: 1,
          }}
        >
          {event.team}
        </Typography>
      </CardContent>
    </Card>
  );
}

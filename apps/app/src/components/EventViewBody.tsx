import { Box, Typography, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import RepeatIcon from '@mui/icons-material/Repeat';
import NotesIcon from '@mui/icons-material/Notes';
import { BRAND, MONTH_NAMES } from '../lib/brand';
import { getAccentColor, DEFAULT_LOCATION, type AppEvent } from '../lib/events';
import { EventTypeLabel } from './EventTypeLabel';
import { DetailRow } from './DetailRow';

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

interface Props {
  event: AppEvent;
}

export function EventViewBody({ event }: Props) {
  const cancelled = !!event.cancelled;
  const accentColor = getAccentColor(event);
  const isHoliday = event.type === 'Holiday';
  const startLabel = `${MONTH_NAMES[event.month]} ${event.day}, ${event.year}`;
  const dateLabel =
    event.dateEnd && event.dateEnd !== event.dateStartRaw
      ? (() => {
          const [ey, em, ed] = event.dateEnd!.split('-').map(Number);
          return `${startLabel} – ${MONTH_NAMES[em - 1]} ${ed}, ${ey}`;
        })()
      : startLabel;

  return (
    <Box sx={{ px: 3, pt: 0.5, pb: 3 }}>
      {/* Type / cancelled label */}
      <Box sx={{ mb: 1 }}>
        <EventTypeLabel event={event} />
      </Box>

      {/* Title / date as hero */}
      <Typography
        sx={{
          fontWeight: 700,
          color: cancelled ? accentColor : BRAND.navy,
          fontSize: '1.6rem',
          lineHeight: 1.15,
          mb: 0.5,
          textDecoration: cancelled ? 'line-through' : 'none',
        }}
      >
        {event.title || dateLabel}
      </Typography>
      {event.title && (
        <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1 }}>
          {dateLabel}
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      {/* Details */}
      <Box>
        {!isHoliday && (
          <>
            <DetailRow icon={<AccessTimeIcon sx={{ fontSize: 18 }} />} text={event.time} />
            <DetailRow
              icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
              text={event.location ?? DEFAULT_LOCATION}
            />
            <DetailRow icon={<GroupIcon sx={{ fontSize: 18 }} />} text={event.team} />
          </>
        )}
        {event.recurrence && event.recurrence !== 'none' && (
          <DetailRow
            icon={<RepeatIcon sx={{ fontSize: 18 }} />}
            text={
              event.recurrenceEndDate
                ? `${RECURRENCE_LABELS[event.recurrence] ?? event.recurrence} · until ${new Date(event.recurrenceEndDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                : (RECURRENCE_LABELS[event.recurrence] ?? event.recurrence)
            }
          />
        )}
        {event.description && (
          <DetailRow icon={<NotesIcon sx={{ fontSize: 18 }} />} text={event.description} />
        )}
      </Box>
    </Box>
  );
}

import { Box, Typography } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { PracticeScheduleCard } from './PracticeScheduleCard';
import { BRAND } from '../lib/brand';
import { formatTime } from '../lib/events';
import type { TrainingSessionGroup } from '../lib/sessions';
import type { PracticeEvent } from '../lib/practice';

interface Props {
  session: TrainingSessionGroup;
  onOpenPractice: (practice: PracticeEvent) => void;
}

export function SessionGroupCard({ session, onOpenPractice }: Props) {
  const timeLabel = `${formatTime(`${session.startTime}:00`)} – ${formatTime(`${session.endTime}:00`)}`;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <EventNoteIcon sx={{ fontSize: 20, color: BRAND.navy }} />
        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1.05rem' }}>
          {session.weeks}-Week Session
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#6B7A8D', mb: 1.5 }}>
        {session.dateRangeLabel}
        {session.locationName && ` · ${session.locationName}`} · {timeLabel}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {session.practices.map((practice) => (
          <PracticeScheduleCard
            key={practice.id}
            event={practice}
            onOpen={() => onOpenPractice(practice)}
          />
        ))}
      </Box>
    </Box>
  );
}

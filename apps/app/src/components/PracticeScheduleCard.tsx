import { Typography, Box, ButtonBase } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND } from '../lib/brand';
import type { PracticeEvent } from '../lib/practice';
import { ColoredTag } from './ColoredTag';

const PAST_ACCENT = '#9AABBD';

interface Props {
  event: PracticeEvent;
  onOpen: () => void;
  isPast?: boolean;
}

export function PracticeScheduleCard({ event, onOpen, isPast = false }: Props) {
  const assistantLabel = event.assistantNames.length > 0 ? event.assistantNames.join(', ') : '—';
  const accentColor = isPast ? PAST_ACCENT : BRAND.navy;
  const actionLabel = isPast ? 'View Practice' : 'Plan & Run Practice';

  return (
    <ButtonBase
      onClick={onOpen}
      focusRipple
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        border: '1px solid #E0E6ED',
        borderLeft: `4px solid ${accentColor}`,
        bgcolor: '#fff',
        borderRadius: 2,
        px: 2,
        py: 1.5,
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}
        >
          <ColoredTag label="Practice" color={accentColor} />
          <Typography sx={{ color: '#9AABBD', fontSize: '0.7rem', fontWeight: 500 }}>
            {event.team}
          </Typography>
        </Box>

        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: '1rem', lineHeight: 1.2 }}>
          {event.title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7A8D', fontSize: '0.78rem', mb: 1 }}>
          {event.dateLabel} · {event.time}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          {!event.hasCoach && (
            <WarningAmberIcon sx={{ fontSize: 16, color: '#E65100', flexShrink: 0 }} />
          )}
          <Typography
            variant="body2"
            noWrap
            sx={{
              color: event.hasCoach ? '#4A5568' : '#E65100',
              fontWeight: event.hasCoach ? 400 : 600,
            }}
          >
            Coach: {event.coachName ?? '—'} · Asst: {assistantLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 0.5,
            mt: 1,
            pt: 1,
            borderTop: '1px solid #F0F3F6',
          }}
        >
          <OpenInFullIcon sx={{ fontSize: 14, color: BRAND.navy }} />
          <Typography sx={{ color: BRAND.navy, fontWeight: 700, fontSize: '0.78rem' }}>
            {actionLabel}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 18, color: BRAND.navy }} />
        </Box>
      </Box>
    </ButtonBase>
  );
}

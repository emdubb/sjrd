import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import RepeatIcon from '@mui/icons-material/Repeat';
import NotesIcon from '@mui/icons-material/Notes';
import { BRAND, MONTH_NAMES, type AppEvent } from '../lib/mockEvents';

const CANCELLED_RED = '#C62828';
const DEFAULT_LOCATION = '1701 Thorton Ave, Sacramento CA 95811';

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'Does not repeat',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box sx={{ color: '#9AABBD', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: '#4A5568', lineHeight: 1.6 }}>
        {text}
      </Typography>
    </Box>
  );
}

interface Props {
  event: AppEvent | null;
  onClose: () => void;
  onEdit: (event: AppEvent) => void;
}

export function ViewEventDialog({ event, onClose, onEdit }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!event) return null;

  const cancelled = !!event.cancelled;
  const accentColor = cancelled ? CANCELLED_RED : event.accentColor;
  const dateLabel = `${MONTH_NAMES[event.month]} ${event.day}, ${event.year}`;

  return (
    <Dialog
      open
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          borderTop: `4px solid ${accentColor}`,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ── HEADER ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 2.5,
          pb: 0,
        }}
      >
        <IconButton onClick={onClose} size="small" sx={{ color: '#9AABBD' }}>
          <CloseIcon />
        </IconButton>
        <Button
          onClick={() => onEdit(event)}
          variant="outlined"
          size="small"
          sx={{
            borderColor: BRAND.navy,
            color: BRAND.navy,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2,
          }}
        >
          Edit
        </Button>
      </DialogTitle>

      {/* ── CONTENT ── */}
      <DialogContent sx={{ px: 3, pt: 2.5, pb: 3 }}>
        {/* Type / cancelled badge */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={cancelled ? 'Cancelled' : event.type}
            size="small"
            sx={{
              bgcolor: cancelled ? '#FDEDED' : `${accentColor}18`,
              color: accentColor,
              fontWeight: 800,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: '6px',
              height: 26,
            }}
          />
          {cancelled && (
            <Chip
              label={event.type}
              size="small"
              sx={{
                bgcolor: '#F5F7FA',
                color: '#9AABBD',
                fontWeight: 600,
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                borderRadius: '6px',
                height: 26,
              }}
            />
          )}
        </Box>

        {/* Title / date as hero */}
        <Typography
          sx={{
            fontWeight: 700,
            color: cancelled ? CANCELLED_RED : BRAND.navy,
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
          <DetailRow icon={<AccessTimeIcon sx={{ fontSize: 18 }} />} text={event.time} />
          <DetailRow
            icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
            text={event.location ?? DEFAULT_LOCATION}
          />
          <DetailRow icon={<GroupIcon sx={{ fontSize: 18 }} />} text={event.team} />
          {event.recurrence && event.recurrence !== 'none' && (
            <DetailRow
              icon={<RepeatIcon sx={{ fontSize: 18 }} />}
              text={RECURRENCE_LABELS[event.recurrence] ?? event.recurrence}
            />
          )}
          {event.description && (
            <DetailRow icon={<NotesIcon sx={{ fontSize: 18 }} />} text={event.description} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

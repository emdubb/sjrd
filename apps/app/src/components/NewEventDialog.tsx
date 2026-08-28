/* eslint-disable max-lines, max-lines-per-function -- TODO: extract form sections into sub-components */
import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { BRAND, type AppEvent } from '../lib/mockEvents';

const TYPES = ['Practice', 'Game', 'Scrimmage', 'Other'];
const TEAMS = ['Team 1', 'Team 2'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];
const DEFAULT_LOCATION = '1701 Thorton Ave, Sacramento CA 95811';

const nth = (n: number) => {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const parseTeams = (team: string): string[] =>
  team
    .split(/\s*&\s*/)
    .map((t) => t.trim())
    .filter((t) => TEAMS.includes(t));

const pillChipSx = (selected: boolean) => ({
  borderRadius: '50px',
  border: `1px solid ${selected ? BRAND.navy : '#C8D0DA'}`,
  bgcolor: selected ? BRAND.navy : 'transparent',
  color: selected ? '#fff' : BRAND.navy,
  fontWeight: selected ? 700 : 400,
  cursor: 'pointer',
  '&:hover': { bgcolor: selected ? BRAND.navy : '#F5F7FA' },
  '& .MuiChip-label': { px: 1.75 },
  height: 36,
});

interface Props {
  open: boolean;
  onClose: () => void;
  defaultDate?: string;
  // edit mode
  editEvent?: AppEvent;
  onDelete?: () => void;
  onCancelEvent?: () => void;
}

export function NewEventDialog({
  open,
  onClose,
  defaultDate,
  editEvent,
  onDelete,
  onCancelEvent,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isEditMode = !!editEvent;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate ?? '2026-08-24');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [monthlyMode, setMonthlyMode] = useState<'date' | 'weekday'>('date');
  const [eventType, setEventType] = useState('Practice');
  const [teams, setTeams] = useState<string[]>(['Team 1']);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);

  // Pre-fill form when opening in edit mode. Multiple setState calls are intentional
  // to reset all fields atomically; the `key` prop on the parent resets state on mount.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title ?? '');
      const m = String(editEvent.month + 1).padStart(2, '0');
      const d = String(editEvent.day).padStart(2, '0');
      setDate(`${editEvent.year}-${m}-${d}`);
      setStartTime('');
      setEndTime('');
      setRecurrence(editEvent.recurrence ?? 'none');
      setMonthlyMode('date');
      setEventType(editEvent.type);
      setTeams(parseTeams(editEvent.team));
      setDescription(editEvent.description ?? '');
      setLocation(editEvent.location ?? DEFAULT_LOCATION);
    } else {
      setTitle('');
      setDate(defaultDate ?? '2026-08-24');
      setStartTime('');
      setEndTime('');
      setRecurrence('none');
      setMonthlyMode('date');
      setEventType('Practice');
      setTeams(['Team 1']);
      setDescription('');
      setLocation(DEFAULT_LOCATION);
    }
  }, [editEvent, open]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleTeam = (team: string) =>
    setTeams((prev) => (prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]));

  const { monthlyDateLabel, monthlyWeekdayLabel } = useMemo(() => {
    const [y, m, d] = date.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const day = dateObj.getDate();
    const dayName = DAY_NAMES[dateObj.getDay()];
    const daysInMonth = new Date(y, m, 0).getDate();
    const weekNum = Math.ceil(day / 7);
    const isLast = day + 7 > daysInMonth;
    const ordinal = isLast ? 'last' : (ORDINALS[weekNum - 1] ?? 'last');
    return {
      monthlyDateLabel: `On the ${day}${nth(day)} of the month`,
      monthlyWeekdayLabel: `On the ${ordinal} ${dayName}`,
    };
  }, [date]);

  const fieldSx = { bgcolor: '#F8FAFC', borderRadius: 2 };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: isMobile ? 0 : 3, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* ── HEADER ── */}
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          pt: 3,
          pb: 1,
          fontWeight: 700,
          fontSize: '1.25rem',
          color: BRAND.navy,
        }}
      >
        {isEditMode ? 'Edit Event' : 'New Event'}
        <IconButton onClick={onClose} size="small" sx={{ color: '#9AABBD' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ── FIELDS ── */}
      <DialogContent
        sx={{ px: 3, pt: 2, pb: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <TextField
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
          fullWidth
          sx={fieldSx}
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setMonthlyMode('date');
          }}
          variant="outlined"
          fullWidth
          sx={{
            ...fieldSx,
            '& input[type=date]::-webkit-calendar-picker-indicator': {
              opacity: 0,
              position: 'absolute',
              right: 0,
              width: '100%',
              cursor: 'pointer',
            },
          }}
          InputProps={{
            sx: { borderRadius: 2 },
            startAdornment: (
              <InputAdornment position="start">
                <CalendarMonthIcon sx={{ fontSize: 18, color: '#9AABBD' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Start time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            variant="outlined"
            fullWidth
            sx={fieldSx}
            InputProps={{ sx: { borderRadius: 2 } }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            variant="outlined"
            fullWidth
            sx={fieldSx}
            InputProps={{ sx: { borderRadius: 2 } }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <FormControl variant="outlined" fullWidth sx={fieldSx}>
            <InputLabel>Recurrence</InputLabel>
            <Select
              value={recurrence}
              onChange={(e) => {
                setRecurrence(e.target.value);
                setMonthlyMode('date');
              }}
              label="Recurrence"
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="none">Does not repeat</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          {recurrence === 'monthly' && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pl: 0.5 }}>
              <Chip
                label={monthlyDateLabel}
                onClick={() => setMonthlyMode('date')}
                sx={pillChipSx(monthlyMode === 'date')}
              />
              <Chip
                label={monthlyWeekdayLabel}
                onClick={() => setMonthlyMode('weekday')}
                sx={pillChipSx(monthlyMode === 'weekday')}
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
            Type
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {TYPES.map((t) => (
              <Chip
                key={t}
                label={t}
                onClick={() => setEventType(t)}
                sx={pillChipSx(eventType === t)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
            Team(s)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {TEAMS.map((t) => (
              <Chip
                key={t}
                label={t}
                onClick={() => toggleTeam(t)}
                sx={pillChipSx(teams.includes(t))}
              />
            ))}
          </Box>
        </Box>

        <TextField
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          variant="outlined"
          fullWidth
          sx={fieldSx}
          InputProps={{
            sx: { borderRadius: 2 },
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ fontSize: 18, color: '#9AABBD' }} />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          fullWidth
          multiline
          minRows={3}
          sx={fieldSx}
          InputProps={{ sx: { borderRadius: 2 } }}
        />
      </DialogContent>

      {/* ── ACTIONS ── */}
      <DialogActions
        sx={{ px: 3, pt: 1.5, pb: isMobile ? 3 : 2.5, flexDirection: 'column', gap: 1 }}
      >
        <Button
          onClick={onClose}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            bgcolor: BRAND.navy,
            color: '#fff',
            borderRadius: 2,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 700,
            '&:hover': { bgcolor: '#112C56' },
          }}
        >
          Save
        </Button>

        {isEditMode && (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button
              onClick={onCancelEvent}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#E65100',
                color: '#E65100',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#FFF3E0', borderColor: '#E65100' },
              }}
            >
              Cancel Event
            </Button>
            <Button
              onClick={onDelete}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: '#C62828',
                color: '#C62828',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { bgcolor: '#FFEBEE', borderColor: '#C62828' },
              }}
            >
              Delete
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}

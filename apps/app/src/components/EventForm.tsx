/* eslint-disable max-lines, max-lines-per-function -- TODO: extract form sections into sub-components */
import { useState, useMemo, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Button,
  Chip,
  InputAdornment,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import dayjs, { type Dayjs } from 'dayjs';
import { BRAND, pillChipSx } from '../lib/brand';
import { type AppEvent, fetchTeams, DEFAULT_LOCATION, type EventFormData } from '../lib/events';

const TYPES = ['Practice', 'Game', 'Scrimmage', 'Other', 'Holiday'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];

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

interface Props {
  open: boolean;
  onSave: (data: EventFormData) => Promise<void>;
  onSaved: () => void;
  defaultDate?: string;
  editEvent?: AppEvent;
  onDelete?: () => void;
  onCancelEvent?: () => void;
}

export function EventForm({
  open,
  onSave,
  onSaved,
  defaultDate,
  editEvent,
  onDelete,
  onCancelEvent,
}: Props) {
  const isEditMode = !!editEvent;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Dayjs | null>(defaultDate ? dayjs(defaultDate) : null);
  const [endDate, setEndDate] = useState<Dayjs | null>(defaultDate ? dayjs(defaultDate) : null);
  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);
  const [recurrence, setRecurrence] = useState('none');
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Dayjs | null>(null);
  const [monthlyMode, setMonthlyMode] = useState<'date' | 'weekday'>('date');
  const [eventType, setEventType] = useState('Practice');
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [saving, setSaving] = useState(false);
  const [availableTeams, setAvailableTeams] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    fetchTeams()
      .then(setAvailableTeams)
      .catch(() => {});
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title ?? '');
      const m = String(editEvent.month + 1).padStart(2, '0');
      const d = String(editEvent.day).padStart(2, '0');
      setDate(dayjs(`${editEvent.year}-${m}-${d}`));
      setEndDate(
        editEvent.dateEnd ? dayjs(editEvent.dateEnd) : dayjs(`${editEvent.year}-${m}-${d}`)
      );
      setStartTime(editEvent.startTimeRaw ? dayjs(`2000-01-01T${editEvent.startTimeRaw}`) : null);
      setEndTime(editEvent.endTimeRaw ? dayjs(`2000-01-01T${editEvent.endTimeRaw}`) : null);
      setRecurrence(editEvent.recurrence ?? 'none');
      setRecurrenceEndDate(editEvent.recurrenceEndDate ? dayjs(editEvent.recurrenceEndDate) : null);
      setMonthlyMode('date');
      setEventType(editEvent.type);
      setSelectedTeamIds(editEvent.teamIds ?? []);
      setDescription(editEvent.description ?? '');
      setLocation(editEvent.location ?? DEFAULT_LOCATION);
    } else {
      setTitle('');
      setDate(defaultDate ? dayjs(defaultDate) : null);
      setEndDate(defaultDate ? dayjs(defaultDate) : null);
      setStartTime(null);
      setEndTime(null);
      setRecurrence('none');
      setRecurrenceEndDate(null);
      setMonthlyMode('date');
      setEventType('Practice');
      setSelectedTeamIds([]);
      setDescription('');
      setLocation(DEFAULT_LOCATION);
    }
  }, [editEvent, open]); // eslint-disable-line react-hooks/exhaustive-deps
  /* eslint-enable react-hooks/set-state-in-effect */

  const toggleTeam = (teamId: string) =>
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );

  const { monthlyDateLabel, monthlyWeekdayLabel } = useMemo(() => {
    if (!date?.isValid()) {
      return { monthlyDateLabel: 'On the Nth of the month', monthlyWeekdayLabel: 'On a weekday' };
    }
    const js = date.toDate();
    const day = js.getDate();
    const dayName = DAY_NAMES[js.getDay()];
    const daysInMonth = new Date(js.getFullYear(), js.getMonth() + 1, 0).getDate();
    const weekNum = Math.ceil(day / 7);
    const isLast = day + 7 > daysInMonth;
    const ordinal = isLast ? 'last' : (ORDINALS[weekNum - 1] ?? 'last');
    return {
      monthlyDateLabel: `On the ${day}${nth(day)} of the month`,
      monthlyWeekdayLabel: `On the ${ordinal} ${dayName}`,
    };
  }, [date]);

  const isHoliday = eventType === 'Holiday';

  const canSave = isHoliday
    ? !!title && date?.isValid() && endDate?.isValid() && !endDate.isBefore(date, 'day')
    : !!title && date?.isValid() && startTime?.isValid() && endTime?.isValid();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSave({
        title,
        date: date!.format('YYYY-MM-DD'),
        dateEnd: isHoliday ? endDate!.format('YYYY-MM-DD') : '',
        startTime: isHoliday ? '00:00' : startTime!.format('HH:mm'),
        endTime: isHoliday ? '23:59' : endTime!.format('HH:mm'),
        recurrence: isHoliday ? 'none' : recurrence,
        monthlyMode,
        recurrenceEndDate: recurrenceEndDate?.isValid()
          ? recurrenceEndDate.format('YYYY-MM-DD')
          : '',
        eventType,
        teamIds: isHoliday ? [] : selectedTeamIds,
        description,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const pickerSlotProps = { textField: { fullWidth: true as const } };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* ── FIELDS ── */}
        <Box
          sx={{
            px: 3,
            pt: 1,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
          }}
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            fullWidth
          />

          <DatePicker
            label={isHoliday ? 'Start Date' : 'Date'}
            value={date}
            onChange={(val) => {
              setDate(val);
              setMonthlyMode('date');
              if (val && endDate?.isBefore(val, 'day')) setEndDate(val);
            }}
            slotProps={pickerSlotProps}
          />

          {isHoliday && (
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              minDate={date ?? undefined}
              slotProps={pickerSlotProps}
            />
          )}

          {!isHoliday && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TimePicker
                label="Start time"
                value={startTime}
                onChange={setStartTime}
                slotProps={pickerSlotProps}
              />
              <TimePicker
                label="End time"
                value={endTime}
                onChange={setEndTime}
                slotProps={pickerSlotProps}
              />
            </Box>
          )}

          {!isHoliday && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel>Recurrence</InputLabel>
                <Select
                  value={recurrence}
                  onChange={(e) => {
                    setRecurrence(e.target.value);
                    setMonthlyMode('date');
                  }}
                  label="Recurrence"
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
              {recurrence !== 'none' && (
                <DatePicker
                  label="End date (optional)"
                  value={recurrenceEndDate}
                  onChange={setRecurrenceEndDate}
                  slotProps={pickerSlotProps}
                />
              )}
            </Box>
          )}

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

          {!isHoliday && availableTeams.length > 0 && (
            <Box>
              <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
                Team(s)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {availableTeams.map((team) => (
                  <Chip
                    key={team.id}
                    label={team.name}
                    onClick={() => toggleTeam(team.id)}
                    sx={pillChipSx(selectedTeamIds.includes(team.id))}
                  />
                ))}
              </Box>
            </Box>
          )}

          {!isHoliday && (
            <TextField
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon sx={{ fontSize: 18, color: '#9AABBD' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          )}

          <TextField
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            InputProps={{ inputComponent: 'textarea' }}
          />
        </Box>

        {/* ── ACTIONS ── */}
        <Box
          sx={{
            px: 3,
            pt: 1.5,
            pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            flexShrink: 0,
          }}
        >
          <Button
            onClick={handleSave}
            disabled={saving || !canSave}
            fullWidth
            variant="contained"
            disableElevation
            sx={{
              bgcolor: BRAND.navy,
              color: '#fff',
              borderRadius: 1,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              '&:hover': { bgcolor: '#112C56' },
              '&.Mui-disabled': { bgcolor: '#C8D0DA', color: '#fff' },
            }}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>

          {isEditMode && (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button
                onClick={onCancelEvent}
                fullWidth
                variant="outlined"
                sx={{
                  borderColor: '#E65100',
                  color: '#E65100',
                  borderRadius: 1,
                  py: 1.5,
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
                sx={{
                  borderColor: '#C62828',
                  color: '#C62828',
                  borderRadius: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#FFEBEE', borderColor: '#C62828' },
                }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}

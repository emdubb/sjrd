import { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import { EventDrawerHeader } from './EventDrawerHeader';
import { SessionDatePicker } from './SessionDatePicker';
import { BRAND } from '../lib/brand';
import { fetchLocations, defaultLocationId, type LocationOption } from '../lib/locations';
import { createSession } from '../lib/sessions';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const DEFAULT_WEEKS = '6';

export function AddSessionDialog({ open, onClose, onCreated }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [weeks, setWeeks] = useState(DEFAULT_WEEKS);
  const [dates, setDates] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('2000-01-01T12:30'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('2000-01-01T14:30'));
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!open) return;
    setWeeks(DEFAULT_WEEKS);
    setDates([]);
    setStartTime(dayjs('2000-01-01T12:30'));
    setEndTime(dayjs('2000-01-01T14:30'));
    fetchLocations()
      .then((options) => {
        setLocations(options);
        setLocationId(defaultLocationId(options));
      })
      .catch(() => {});
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const weeksValue = Number(weeks);
  const toggleDate = (date: string) =>
    setDates((prev) => (prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]));

  const canSave =
    weeksValue > 0 && dates.length === weeksValue && startTime?.isValid() && endTime?.isValid();

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await createSession({
        weeks: weeksValue,
        dates,
        startTime: startTime!.format('HH:mm'),
        endTime: endTime!.format('HH:mm'),
        locationId,
      });
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={!isDesktop}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: isDesktop ? 2 : 0,
          height: isDesktop ? '85vh' : '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <EventDrawerHeader title="Add Session" onClose={onClose} />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            label="Number of Weeks"
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            variant="outlined"
            fullWidth
            slotProps={{ htmlInput: { min: 1 } }}
          />

          <Box>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: BRAND.navy, mb: 1 }}>
              Practice Dates ({dates.length} of {weeksValue || 0} selected)
            </Typography>
            <SessionDatePicker
              selectedDates={dates}
              onToggleDate={toggleDate}
              maxDates={weeksValue}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TimePicker
              label="Start time"
              value={startTime}
              onChange={setStartTime}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TimePicker
              label="End time"
              value={endTime}
              onChange={setEndTime}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Box>

          <FormControl variant="outlined" fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              value={locationId ?? ''}
              onChange={(e) => setLocationId(e.target.value || null)}
              label="Location"
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </LocalizationProvider>

      <Box
        sx={{ px: 3, pt: 1.5, pb: 'calc(env(safe-area-inset-bottom, 0px) + 20px)', flexShrink: 0 }}
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
          {saving ? 'Creating…' : 'Create Session'}
        </Button>
      </Box>
    </Dialog>
  );
}

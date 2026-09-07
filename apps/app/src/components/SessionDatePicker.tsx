import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { BRAND, MONTH_NAMES } from '../lib/brand';
import { eachDateInRange } from '../lib/dateRange';
import { getUsHolidaysForMonth } from '../lib/usHolidays';
import { fetchHolidayEventsForMonth } from '../lib/events';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface Props {
  selectedDates: string[];
  onToggleDate: (date: string) => void;
  maxDates: number;
}

export function SessionDatePicker({ selectedDates, onToggleDate, maxDates }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [holidayDates, setHolidayDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const usHolidays = getUsHolidaysForMonth(viewYear, viewMonth).map((h) => h.date);
    fetchHolidayEventsForMonth(viewYear, viewMonth)
      .then((events) => {
        const dbDates = events.flatMap((e) =>
          eachDateInRange(e.dateStartRaw, e.dateEnd ?? e.dateStartRaw)
        );
        setHolidayDates(new Set([...usHolidays, ...dbDates]));
      })
      .catch(() => setHolidayDates(new Set(usHolidays)));
  }, [viewYear, viewMonth]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStrFor = (day: number) => `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
  const atCap = selectedDates.length >= maxDates;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          onClick={prevMonth}
          size="small"
          aria-label="Previous month"
          sx={{ color: BRAND.navy }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 700, color: BRAND.navy }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Typography>
        <IconButton
          onClick={nextMonth}
          size="small"
          aria-label="Next month"
          sx={{ color: BRAND.navy }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {DAY_LABELS.map((d, i) => (
          <Typography
            key={i}
            sx={{ textAlign: 'center', fontSize: '0.7rem', color: '#9AABBD', fontWeight: 600 }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - firstDayOfWeek + 1;
          const valid = day >= 1 && day <= daysInMonth;
          const dateStr = valid ? dateStrFor(day) : '';
          const selected = valid && selectedDates.includes(dateStr);
          const holiday = valid && holidayDates.has(dateStr);
          const disabled = valid && !selected && atCap;

          return (
            <Box
              key={i}
              onClick={() => {
                if (!valid || disabled) return;
                onToggleDate(dateStr);
              }}
              sx={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.5,
                cursor: valid ? (disabled ? 'not-allowed' : 'pointer') : 'default',
                border: valid ? '1px solid #E0E6ED' : 'none',
                bgcolor: selected ? BRAND.navy : holiday ? BRAND.holidayBlue : 'transparent',
                opacity: disabled ? 0.4 : 1,
                transition: 'background-color 0.1s',
                '&:hover': valid && !disabled ? { bgcolor: selected ? BRAND.navy : '#F5F7FA' } : {},
              }}
            >
              {valid && (
                <Typography
                  sx={{
                    fontSize: '0.85rem',
                    fontWeight: selected ? 700 : 400,
                    color: selected ? '#fff' : holiday ? BRAND.navy : '#333',
                  }}
                >
                  {day}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

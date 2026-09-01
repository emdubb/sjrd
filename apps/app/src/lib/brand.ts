import type { AppEvent } from './events';

export const BRAND = {
  navy: '#0B233F',
  gold: '#F2BF35',
  steel: '#3D6B9E',
  amber: '#C49A00',
  notifBg: '#EAF0F8',
} as const;

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatEventDate = (e: AppEvent) => `${MONTH_NAMES[e.month].slice(0, 3)} ${e.day}`;

export const pillChipSx = (selected: boolean) => ({
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

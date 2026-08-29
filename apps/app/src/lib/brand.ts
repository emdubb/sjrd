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

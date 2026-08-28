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

export interface AppEvent {
  id: number;
  type: string;
  team: string;
  year: number;
  month: number; // 0-indexed (JS Date convention)
  day: number;
  time: string;
  accentColor: string;
  // optional enriched fields
  title?: string;
  location?: string;
  description?: string;
  recurrence?: string;
  cancelled?: boolean;
}

export const MOCK_EVENTS: AppEvent[] = [
  // August 2026
  {
    id: 1,
    type: 'Practice',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 7,
    day: 5,
    time: '5:00 – 7:00 PM',
    accentColor: BRAND.navy,
  },
  {
    id: 10,
    type: 'Game',
    team: 'Team 2',
    year: 2026,
    month: 7,
    day: 5,
    time: '7:30 – 9:00 PM',
    accentColor: BRAND.amber,
  },
  {
    id: 2,
    type: 'Scrimmage',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 7,
    day: 10,
    time: '3:00 – 5:00 PM',
    accentColor: BRAND.steel,
  },
  {
    id: 11,
    type: 'Practice',
    team: 'Team 1',
    year: 2026,
    month: 7,
    day: 10,
    time: '5:30 – 7:00 PM',
    accentColor: BRAND.navy,
  },
  {
    id: 12,
    type: 'Game',
    team: 'Team 2',
    year: 2026,
    month: 7,
    day: 10,
    time: '7:30 – 9:00 PM',
    accentColor: BRAND.amber,
  },
  {
    id: 13,
    type: 'Scrimmage',
    team: 'Team 1',
    year: 2026,
    month: 7,
    day: 10,
    time: '9:30 – 11:00 PM',
    accentColor: BRAND.steel,
  },
  {
    id: 3,
    type: 'Practice',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 7,
    day: 13,
    time: '5:00 – 7:00 PM',
    accentColor: BRAND.navy,
  },
  {
    id: 4,
    type: 'Game',
    team: 'Team 2',
    year: 2026,
    month: 7,
    day: 17,
    time: '2:00 – 4:00 PM',
    accentColor: BRAND.amber,
  },
  {
    id: 5,
    type: 'Scrimmage',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 7,
    day: 20,
    time: '6:00 – 7:30 PM',
    accentColor: BRAND.steel,
  },
  {
    id: 6,
    type: 'Practice',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 7,
    day: 28,
    time: '5:00 – 7:00 PM',
    accentColor: BRAND.navy,
  },
  // September 2026
  {
    id: 7,
    type: 'Game',
    team: 'Team 2',
    year: 2026,
    month: 8,
    day: 5,
    time: '2:00 – 4:00 PM',
    accentColor: BRAND.amber,
  },
  {
    id: 8,
    type: 'Practice',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 8,
    day: 9,
    time: '5:00 – 7:00 PM',
    accentColor: BRAND.navy,
  },
  {
    id: 9,
    type: 'Scrimmage',
    team: 'Team 1 & Team 2',
    year: 2026,
    month: 8,
    day: 14,
    time: '3:00 – 5:00 PM',
    accentColor: BRAND.steel,
  },
];

export const formatEventDate = (e: AppEvent) => `${MONTH_NAMES[e.month].slice(0, 3)} ${e.day}`;

/** Events on or after `fromDate`, sorted ascending. */
export const upcomingEvents = (fromDate: Date) =>
  MOCK_EVENTS.filter((e) => new Date(e.year, e.month, e.day) >= fromDate).sort(
    (a, b) =>
      new Date(a.year, a.month, a.day).getTime() - new Date(b.year, b.month, b.day).getTime()
  );

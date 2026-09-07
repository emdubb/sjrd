export interface UsHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// month is 0-indexed, weekday follows Date#getDay (0 = Sunday), n is 1-based occurrence.
function nthWeekdayOfMonth(year: number, month: number, weekday: number, n: number): Date {
  const firstWeekday = new Date(year, month, 1).getDay();
  const offset = (weekday - firstWeekday + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

function lastWeekdayOfMonth(year: number, month: number, weekday: number): Date {
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - offset);
}

export function getUsHolidaysForYear(year: number): UsHoliday[] {
  return [
    { date: fmt(new Date(year, 0, 1)), name: "New Year's Day" },
    { date: fmt(nthWeekdayOfMonth(year, 0, 1, 3)), name: 'Martin Luther King Jr. Day' },
    { date: fmt(nthWeekdayOfMonth(year, 1, 1, 3)), name: "Presidents' Day" },
    { date: fmt(lastWeekdayOfMonth(year, 4, 1)), name: 'Memorial Day' },
    { date: fmt(new Date(year, 5, 19)), name: 'Juneteenth' },
    { date: fmt(new Date(year, 6, 4)), name: 'Independence Day' },
    { date: fmt(nthWeekdayOfMonth(year, 8, 1, 1)), name: 'Labor Day' },
    { date: fmt(nthWeekdayOfMonth(year, 9, 1, 2)), name: 'Columbus Day' },
    { date: fmt(new Date(year, 10, 11)), name: 'Veterans Day' },
    { date: fmt(nthWeekdayOfMonth(year, 10, 4, 4)), name: 'Thanksgiving Day' },
    { date: fmt(new Date(year, 11, 25)), name: 'Christmas Day' },
  ];
}

export function getUsHolidaysForMonth(year: number, month: number): UsHoliday[] {
  const prefix = `${year}-${pad(month + 1)}`;
  return getUsHolidaysForYear(year).filter((h) => h.date.startsWith(prefix));
}

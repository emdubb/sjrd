import { supabase } from '@sjrd/api-client';
import { BRAND } from './brand';

export interface AppEvent {
  id: string;
  type: string;
  team: string;
  year: number;
  month: number; // 0-indexed (JS Date convention)
  day: number;
  time: string;
  accentColor: string;
  title?: string;
  location?: string;
  description?: string;
  recurrence?: string;
  recurrenceEndDate?: string;
  cancelled?: boolean;
  seriesId?: string;
  teamIds?: string[];
  startTimeRaw?: string;
  endTimeRaw?: string;
}

type DbEventType = 'game' | 'practice' | 'scrimmage' | 'other';

const EVENT_LABELS: Record<DbEventType, string> = {
  game: 'Game',
  practice: 'Practice',
  scrimmage: 'Scrimmage',
  other: 'Other',
};

const EVENT_COLORS: Record<DbEventType, string> = {
  game: BRAND.amber,
  practice: BRAND.navy,
  scrimmage: BRAND.steel,
  other: BRAND.gold,
};

const TYPE_TO_ENUM: Record<string, DbEventType> = {
  Practice: 'practice',
  Game: 'game',
  Scrimmage: 'scrimmage',
  Other: 'other',
};

const DAY_ABBR = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function parseRruleRecurrence(rule: string): string {
  if (rule.includes('FREQ=DAILY')) return 'daily';
  if (rule.includes('FREQ=WEEKLY')) return 'weekly';
  if (rule.includes('FREQ=MONTHLY')) return 'monthly';
  return 'none';
}

export function buildRRule(
  recurrence: string,
  date: string,
  monthlyMode: 'date' | 'weekday',
  endDate?: string
): string {
  const [y, m, d] = date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);

  let rule = '';
  if (recurrence === 'daily') {
    rule = 'FREQ=DAILY';
  } else if (recurrence === 'weekly') {
    rule = 'FREQ=WEEKLY';
  } else if (recurrence === 'monthly') {
    if (monthlyMode === 'date') {
      rule = `FREQ=MONTHLY;BYMONTHDAY=${d}`;
    } else {
      const dayName = DAY_ABBR[dateObj.getDay()];
      const daysInMonth = new Date(y, m, 0).getDate();
      const weekNum = Math.ceil(d / 7);
      const ordinal = d + 7 > daysInMonth ? -1 : weekNum;
      rule = `FREQ=MONTHLY;BYDAY=${ordinal}${dayName}`;
    }
  }

  if (endDate) {
    rule += `;UNTIL=${endDate.replace(/-/g, '')}T235959Z`;
  }

  return rule;
}

type TeamRow = { id: string; name: string } | null;
type EventTeamRow = { team_id: string; teams: TeamRow };
type SeriesRow = { recurrence_rule: string; series_date_end: string | null } | null;

type EventRow = {
  id: string;
  title: string;
  event_type: DbEventType;
  status: 'scheduled' | 'cancelled';
  date_start: string;
  start_time: string;
  end_time: string;
  description: string | null;
  series_id: string | null;
  event_teams: EventTeamRow[];
  event_series: SeriesRow;
};

export const CANCELLED_COLOR = '#C62828';
export const DEFAULT_LOCATION = '1701 Thorton Ave, Sacramento CA 95811';

export function getAccentColor(event: AppEvent): string {
  return event.cancelled ? CANCELLED_COLOR : event.accentColor;
}

function rowToAppEvent(row: EventRow): AppEvent {
  const [y, m, d] = row.date_start.split('-').map(Number);
  const teamNames = row.event_teams
    .map((et) => et.teams?.name)
    .filter(Boolean)
    .join(' & ');
  const teamIds = row.event_teams.map((et) => et.team_id);

  const cancelled = row.status === 'cancelled';
  const recurrence = row.event_series
    ? parseRruleRecurrence(row.event_series.recurrence_rule)
    : undefined;
  const recurrenceEndDate = row.event_series?.series_date_end ?? undefined;

  return {
    id: row.id,
    type: EVENT_LABELS[row.event_type] ?? row.event_type,
    team: teamNames || '—',
    year: y,
    month: m - 1,
    day: d,
    time: `${formatTime(row.start_time)} – ${formatTime(row.end_time)}`,
    accentColor: cancelled ? CANCELLED_COLOR : (EVENT_COLORS[row.event_type] ?? BRAND.navy),
    title: row.title,
    description: row.description ?? undefined,
    recurrence: recurrence ?? undefined,
    recurrenceEndDate: recurrenceEndDate ?? undefined,
    cancelled,
    seriesId: row.series_id ?? undefined,
    teamIds,
    startTimeRaw: row.start_time.slice(0, 5),
    endTimeRaw: row.end_time.slice(0, 5),
  };
}

const EVENT_SELECT = `
  id, title, event_type, status, date_start, start_time, end_time, description, series_id,
  event_teams(team_id, teams(id, name)),
  event_series(recurrence_rule, series_date_end)
` as const;

const PAGE_SIZE = 15;

export interface PagedEvents {
  events: AppEvent[];
  hasMore: boolean;
}

export async function fetchEventsForMonth(
  year: number,
  month: number,
  offset = 0
): Promise<PagedEvents> {
  const pad = (n: number) => String(n).padStart(2, '0');
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dateFrom = `${year}-${pad(month + 1)}-01`;
  const dateTo = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`;

  const { data, error } = await supabase
    .from('event_instances')
    .select(EVENT_SELECT)
    .gte('date_start', dateFrom)
    .lte('date_start', dateTo)
    .order('date_start')
    .order('start_time')
    .range(offset, offset + PAGE_SIZE);

  if (error) throw error;
  const rows = data ?? [];
  return {
    events: rows.slice(0, PAGE_SIZE).map((row) => rowToAppEvent(row as unknown as EventRow)),
    hasMore: rows.length > PAGE_SIZE,
  };
}

export async function fetchUpcomingEvents(from: Date, offset = 0): Promise<PagedEvents> {
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateFrom = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`;

  const { data, error } = await supabase
    .from('event_instances')
    .select(EVENT_SELECT)
    .gte('date_start', dateFrom)
    .neq('status', 'cancelled')
    .order('date_start')
    .order('start_time')
    .range(offset, offset + PAGE_SIZE);

  if (error) throw error;
  const rows = data ?? [];
  return {
    events: rows.slice(0, PAGE_SIZE).map((row) => rowToAppEvent(row as unknown as EventRow)),
    hasMore: rows.length > PAGE_SIZE,
  };
}

export async function fetchTeams(): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase.from('teams').select('id, name').order('name');
  if (error) throw error;
  return data ?? [];
}

export interface EventFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  recurrence: string;
  monthlyMode: 'date' | 'weekday';
  recurrenceEndDate: string;
  eventType: string;
  teamIds: string[];
  description: string;
}

async function fetchEventById(id: string): Promise<AppEvent> {
  const { data, error } = await supabase
    .from('event_instances')
    .select(EVENT_SELECT)
    .eq('id', id)
    .single();
  if (error) throw error;
  return rowToAppEvent(data as unknown as EventRow);
}

function generateRecurrenceDates(
  startDate: string,
  recurrence: string,
  monthlyMode: 'date' | 'weekday',
  endDate?: string
): string[] {
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = endDate
    ? (() => {
        const [ey, em, ed] = endDate.split('-').map(Number);
        return new Date(ey, em - 1, ed);
      })()
    : new Date(sy + 1, sm - 1, sd);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dates: string[] = [];

  if (recurrence === 'daily') {
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(fmt(cur));
      cur.setDate(cur.getDate() + 1);
    }
  } else if (recurrence === 'weekly') {
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(fmt(cur));
      cur.setDate(cur.getDate() + 7);
    }
  } else if (recurrence === 'monthly') {
    if (monthlyMode === 'date') {
      const cur = new Date(start);
      while (cur <= end) {
        dates.push(fmt(cur));
        const nextMonth = cur.getMonth() + 1;
        cur.setMonth(nextMonth);
        // Handle months shorter than the target day (e.g. Jan 31 → Mar 3)
        if (cur.getDate() !== sd) cur.setDate(0);
      }
    } else {
      const targetDow = start.getDay();
      const daysInStartMonth = new Date(sy, sm, 0).getDate();
      const weekNum = Math.ceil(sd / 7);
      const isLast = sd + 7 > daysInStartMonth;
      let year = sy;
      let month = sm - 1;
      while (true) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let targetDay: number;
        if (isLast) {
          const lastDay = new Date(year, month + 1, 0);
          targetDay = daysInMonth - ((lastDay.getDay() - targetDow + 7) % 7);
        } else {
          const firstDow = new Date(year, month, 1).getDay();
          targetDay = 1 + ((targetDow - firstDow + 7) % 7) + (weekNum - 1) * 7;
          if (targetDay > daysInMonth) {
            month++;
            if (month > 11) {
              month = 0;
              year++;
            }
            continue;
          }
        }
        const cur = new Date(year, month, targetDay);
        if (cur > end) break;
        if (cur >= start) dates.push(fmt(cur));
        month++;
        if (month > 11) {
          month = 0;
          year++;
        }
      }
    }
  }

  return dates;
}

export async function createEvent(formData: EventFormData): Promise<AppEvent> {
  const eventType = TYPE_TO_ENUM[formData.eventType] ?? 'other';
  let seriesId: string | null = null;

  if (formData.recurrence !== 'none') {
    const rule = buildRRule(
      formData.recurrence,
      formData.date,
      formData.monthlyMode,
      formData.recurrenceEndDate || undefined
    );
    const { data: series, error: seriesError } = await supabase
      .from('event_series')
      .insert({
        title: formData.title,
        description: formData.description || null,
        series_date_start: formData.date,
        series_date_end: formData.recurrenceEndDate || null,
        start_time: `${formData.startTime}:00`,
        end_time: `${formData.endTime}:00`,
        recurrence_rule: rule,
      })
      .select('id')
      .single();
    if (seriesError) throw seriesError;
    seriesId = series.id;
  }

  const instanceBase = {
    title: formData.title,
    event_type: eventType,
    start_time: `${formData.startTime}:00`,
    end_time: `${formData.endTime}:00`,
    description: formData.description || null,
    series_id: seriesId,
  };

  let firstInstanceId: string;

  if (formData.recurrence === 'none') {
    const { data: instance, error } = await supabase
      .from('event_instances')
      .insert({ ...instanceBase, date_start: formData.date })
      .select('id')
      .single();
    if (error) throw error;
    firstInstanceId = instance.id;
  } else {
    const dates = generateRecurrenceDates(
      formData.date,
      formData.recurrence,
      formData.monthlyMode,
      formData.recurrenceEndDate || undefined
    );
    const { data: instances, error } = await supabase
      .from('event_instances')
      .insert(dates.map((date_start) => ({ ...instanceBase, date_start })))
      .select('id');
    if (error) throw error;
    firstInstanceId = instances[0].id;

    if (formData.teamIds.length > 0) {
      const teamRows = instances.flatMap(({ id: event_id }) =>
        formData.teamIds.map((team_id) => ({ event_id, team_id }))
      );
      const { error: teamsError } = await supabase.from('event_teams').insert(teamRows);
      if (teamsError) throw teamsError;
    }
    return fetchEventById(firstInstanceId);
  }

  if (formData.teamIds.length > 0) {
    const { error: teamsError } = await supabase
      .from('event_teams')
      .insert(formData.teamIds.map((teamId) => ({ event_id: firstInstanceId, team_id: teamId })));
    if (teamsError) throw teamsError;
  }

  return fetchEventById(firstInstanceId);
}

export async function updateEvent(id: string, formData: EventFormData): Promise<AppEvent> {
  const eventType = TYPE_TO_ENUM[formData.eventType] ?? 'other';

  const { error } = await supabase
    .from('event_instances')
    .update({
      title: formData.title,
      event_type: eventType,
      date_start: formData.date,
      start_time: `${formData.startTime}:00`,
      end_time: `${formData.endTime}:00`,
      description: formData.description || null,
    })
    .eq('id', id);
  if (error) throw error;

  await supabase.from('event_teams').delete().eq('event_id', id);
  if (formData.teamIds.length > 0) {
    await supabase
      .from('event_teams')
      .insert(formData.teamIds.map((teamId) => ({ event_id: id, team_id: teamId })));
  }

  return fetchEventById(id);
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('event_instances').delete().eq('id', id);
  if (error) throw error;
}

export async function cancelEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('event_instances')
    .update({ status: 'cancelled' })
    .eq('id', id);
  if (error) throw error;
}

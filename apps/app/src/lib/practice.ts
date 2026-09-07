import { supabase } from '@sjrd/api-client';
import { MONTH_NAMES } from './brand';
import { formatTime } from './events';

export interface PracticeEvent {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  dateLabel: string;
  fullDateLabel: string;
  time: string;
  team: string;
  teamIds: string[];
  coachId: string | null;
  coachName: string | null;
  assistantIds: string[];
  assistantNames: string[];
  hasCoach: boolean;
  location: string | null;
  trainingSessionId: string | null;
  sessionWeekNumber: number | null;
}

export type ProfileRow = {
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
};
type EventCoachRow = { profile_id: string; is_primary: boolean; profiles: ProfileRow | null };
type TeamRow = { id: string; name: string } | null;
type EventTeamRow = { team_id: string; teams: TeamRow };
type LocationRow = { name: string; address: string | null } | null;

type PracticeRow = {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  date_start: string;
  start_time: string;
  end_time: string;
  training_session_id: string | null;
  session_week_number: number | null;
  locations: LocationRow;
  event_teams: EventTeamRow[];
  event_coaches: EventCoachRow[];
};

export function formatDisplayName(profile: ProfileRow | null): string {
  if (!profile) return 'Unknown';
  const legalName = `${profile.preferred_name || profile.first_name} ${profile.last_name}`;
  return profile.derby_name ? `${profile.derby_name} (${legalName})` : legalName;
}

function rowToPracticeEvent(row: PracticeRow): PracticeEvent {
  const [y, m, d] = row.date_start.split('-').map(Number);
  const dateLabel = `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}`;
  const fullDateLabel = `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
  const team =
    row.event_teams
      .map((et) => et.teams?.name)
      .filter(Boolean)
      .join(' & ') || '—';
  const teamIds = row.event_teams.map((et) => et.team_id);

  const primaryCoach = row.event_coaches.find((c) => c.is_primary);
  const assistantCoaches = row.event_coaches.filter((c) => !c.is_primary);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    notes: row.notes,
    dateLabel,
    fullDateLabel,
    time: `${formatTime(row.start_time)} – ${formatTime(row.end_time)}`,
    team,
    teamIds,
    coachId: primaryCoach ? primaryCoach.profile_id : null,
    coachName: primaryCoach ? formatDisplayName(primaryCoach.profiles) : null,
    assistantIds: assistantCoaches.map((c) => c.profile_id),
    assistantNames: assistantCoaches.map((c) => formatDisplayName(c.profiles)),
    hasCoach: !!primaryCoach,
    location: row.locations ? row.locations.name : null,
    trainingSessionId: row.training_session_id,
    sessionWeekNumber: row.session_week_number,
  };
}

const practiceSelect = (teamId: string | null) => `
  id, title, description, notes, date_start, start_time, end_time,
  training_session_id, session_week_number, locations(name, address),
  event_teams${teamId ? '!inner' : ''}(team_id, teams(id, name)),
  event_coaches(profile_id, is_primary, profiles!event_coaches_profile_id_fkey(first_name, last_name, preferred_name, derby_name))
`;

const PAGE_SIZE = 15;
const PAST_WINDOW_DAYS = 30;

export interface PagedPracticeEvents {
  events: PracticeEvent[];
  hasMore: boolean;
}

export type ScheduleScope = 'upcoming' | 'past';

export interface PracticeFilters {
  startDate: string | null;
  endDate: string | null;
  teamId: string | null;
}

const NO_FILTERS: PracticeFilters = { startDate: null, endDate: null, teamId: null };

export async function fetchPracticeSchedule(
  offset = 0,
  scope: ScheduleScope = 'upcoming',
  filters: PracticeFilters = NO_FILTERS
): Promise<PagedPracticeEvents> {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = toDateStr(today);

  const hasFilters = !!(filters.startDate || filters.endDate || filters.teamId);

  let query = supabase
    .from('event_instances')
    .select(practiceSelect(filters.teamId))
    .eq('event_type', 'practice')
    .neq('status', 'cancelled')
    .is('training_session_id', null);

  query =
    scope === 'upcoming'
      ? query.gte('date_start', todayStr).order('date_start', { ascending: true })
      : query.lt('date_start', todayStr).order('date_start', { ascending: false });

  // Past practices default to the last 30 days on the first page, so the list
  // doesn't dump a league's entire history — "Load more" reaches further back.
  const applyPastWindow = scope === 'past' && offset === 0 && !hasFilters;
  if (applyPastWindow) {
    const windowStart = new Date(today);
    windowStart.setDate(windowStart.getDate() - PAST_WINDOW_DAYS);
    query = query.gte('date_start', toDateStr(windowStart));
  }

  if (filters.startDate) query = query.gte('date_start', filters.startDate);
  if (filters.endDate) query = query.lte('date_start', filters.endDate);
  if (filters.teamId) query = query.eq('event_teams.team_id', filters.teamId);

  const { data, error } = await query.range(offset, offset + PAGE_SIZE);

  if (error) throw error;
  const rows = data ?? [];
  const events = rows
    .slice(0, PAGE_SIZE)
    .map((row) => rowToPracticeEvent(row as unknown as PracticeRow));

  return {
    events,
    hasMore: applyPastWindow ? true : rows.length > PAGE_SIZE,
  };
}

export async function fetchSessionPractices(): Promise<PracticeEvent[]> {
  const { data, error } = await supabase
    .from('event_instances')
    .select(practiceSelect(null))
    .not('training_session_id', 'is', null)
    .order('date_start', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => rowToPracticeEvent(row as unknown as PracticeRow));
}

export interface CoachOption {
  id: string;
  name: string;
}

type CoachProfileRow = { profile_id: string; profiles: ProfileRow | null };

export async function fetchCoaches(): Promise<CoachOption[]> {
  const { data, error } = await supabase
    .from('profile_user_types')
    .select(
      'profile_id, profiles!profile_user_types_profile_id_fkey(first_name, last_name, preferred_name, derby_name)'
    )
    .eq('user_type', 'coach');
  if (error) throw error;
  return (data ?? [])
    .map((row) => {
      const { profile_id: profileId, profiles } = row as unknown as CoachProfileRow;
      return { id: profileId, name: formatDisplayName(profiles) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function setEventCoaches(
  eventId: string,
  coachId: string | null,
  assistantIds: string[]
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('event_coaches')
    .delete()
    .eq('event_id', eventId);
  if (deleteError) throw deleteError;

  const rows = [
    ...(coachId ? [{ event_id: eventId, profile_id: coachId, is_primary: true }] : []),
    ...assistantIds
      .filter((profileId) => profileId !== coachId)
      .map((profileId) => ({ event_id: eventId, profile_id: profileId, is_primary: false })),
  ];
  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from('event_coaches').insert(rows);
  if (insertError) throw insertError;
}

export async function updateEventNotes(eventId: string, notes: string): Promise<void> {
  const { error } = await supabase
    .from('event_instances')
    .update({ notes: notes || null })
    .eq('id', eventId);
  if (error) throw error;
}

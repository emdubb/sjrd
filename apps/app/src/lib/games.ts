import { supabase } from '@sjrd/api-client';
import { MONTH_NAMES } from './brand';
import { formatTime } from './events';
import {
  formatDisplayName,
  type ProfileRow,
  type ScheduleScope,
  type PracticeFilters,
} from './practice';

export interface GameEvent {
  id: string;
  title: string;
  description: string | null;
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
}

type EventCoachRow = { profile_id: string; is_primary: boolean; profiles: ProfileRow | null };
type TeamRow = { id: string; name: string } | null;
type EventTeamRow = { team_id: string; teams: TeamRow };

type GameRow = {
  id: string;
  title: string;
  description: string | null;
  date_start: string;
  start_time: string;
  end_time: string;
  event_teams: EventTeamRow[];
  event_coaches: EventCoachRow[];
};

function rowToGameEvent(row: GameRow): GameEvent {
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
  };
}

const gameSelect = (teamId: string | null) => `
  id, title, description, date_start, start_time, end_time,
  event_teams${teamId ? '!inner' : ''}(team_id, teams(id, name)),
  event_coaches(profile_id, is_primary, profiles!event_coaches_profile_id_fkey(first_name, last_name, preferred_name, derby_name))
`;

const PAGE_SIZE = 15;
const PAST_WINDOW_DAYS = 30;

export interface PagedGameEvents {
  events: GameEvent[];
  hasMore: boolean;
}

const NO_FILTERS: PracticeFilters = { startDate: null, endDate: null, teamId: null };

export async function fetchGameSchedule(
  offset = 0,
  scope: ScheduleScope = 'upcoming',
  filters: PracticeFilters = NO_FILTERS
): Promise<PagedGameEvents> {
  const today = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayStr = toDateStr(today);

  const hasFilters = !!(filters.startDate || filters.endDate || filters.teamId);

  let query = supabase
    .from('event_instances')
    .select(gameSelect(filters.teamId))
    .eq('event_type', 'game')
    .neq('status', 'cancelled');

  query =
    scope === 'upcoming'
      ? query.gte('date_start', todayStr).order('date_start', { ascending: true })
      : query.lt('date_start', todayStr).order('date_start', { ascending: false });

  // Past games default to the last 30 days on the first page, so the list
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
  const events = rows.slice(0, PAGE_SIZE).map((row) => rowToGameEvent(row as unknown as GameRow));

  return {
    events,
    hasMore: applyPastWindow ? true : rows.length > PAGE_SIZE,
  };
}

export type AvailabilityStatus = 'available' | 'not_available' | 'no_response';

export interface RosterSkater {
  id: string;
  name: string;
  availability: AvailabilityStatus;
  eligible: boolean;
}

type SkaterProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
};

const AVAILABILITY_STATUSES: AvailabilityStatus[] = ['available', 'not_available', 'no_response'];

// FNV-1a: plain polynomial hashing collides on the repeated-digit mock skater
// UUIDs (e.g. "b1111111-...-111111111111"), so every skater lands on the same
// bucket. FNV-1a's per-character XOR/multiply mix avoids that.
function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// RSVP and eligibility aren't tracked yet — mocked from a stable per-skater hash
// so the same skater shows the same status across reloads until that data lands.
function mockAvailability(skaterId: string): AvailabilityStatus {
  return AVAILABILITY_STATUSES[hashString(skaterId) % AVAILABILITY_STATUSES.length];
}

function mockEligible(skaterId: string): boolean {
  return hashString(`${skaterId}:eligible`) % 5 !== 0;
}

function rowToRosterSkater(row: SkaterProfileRow): RosterSkater {
  return {
    id: row.id,
    name: formatDisplayName(row),
    availability: mockAvailability(row.id),
    eligible: mockEligible(row.id),
  };
}

function sortByName(skaters: RosterSkater[]): RosterSkater[] {
  return [...skaters].sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchTeamSkaters(teamId: string): Promise<RosterSkater[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select(
      'profiles!team_members_profile_id_fkey(id, first_name, last_name, preferred_name, derby_name)'
    )
    .eq('team_id', teamId);
  if (error) throw error;
  const rows = (data ?? []) as unknown as { profiles: SkaterProfileRow | null }[];
  return sortByName(
    rows.filter((row) => !!row.profiles).map((row) => rowToRosterSkater(row.profiles!))
  );
}

export async function fetchAllSkaters(): Promise<RosterSkater[]> {
  const { data, error } = await supabase
    .from('profile_user_types')
    .select(
      'profiles!profile_user_types_profile_id_fkey(id, first_name, last_name, preferred_name, derby_name)'
    )
    .eq('user_type', 'skater');
  if (error) throw error;
  const rows = (data ?? []) as unknown as { profiles: SkaterProfileRow | null }[];
  return sortByName(
    rows.filter((row) => !!row.profiles).map((row) => rowToRosterSkater(row.profiles!))
  );
}

export async function fetchGameRoster(eventId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('rosters')
    .select('profile_id')
    .eq('event_id', eventId);
  if (error) throw error;
  return (data ?? []).map((row) => row.profile_id as string);
}

export async function saveGameRoster(eventId: string, skaterIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase.from('rosters').delete().eq('event_id', eventId);
  if (deleteError) throw deleteError;
  if (skaterIds.length === 0) return;

  const { error: insertError } = await supabase.from('rosters').insert(
    skaterIds.map((profileId) => ({
      event_id: eventId,
      profile_id: profileId,
      is_alternate: false,
    }))
  );
  if (insertError) throw insertError;
}

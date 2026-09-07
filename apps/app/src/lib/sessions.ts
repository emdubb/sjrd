import { supabase } from '@sjrd/api-client';
import { fetchSessionPractices, type PracticeEvent } from './practice';
import { syncEventCurriculum } from './curriculum';

export interface TrainingSessionGroup {
  id: string;
  weeks: number;
  locationName: string | null;
  startTime: string;
  endTime: string;
  dateRangeLabel: string;
  practices: PracticeEvent[];
}

type SessionRow = {
  id: string;
  weeks: number;
  start_time: string;
  end_time: string;
  locations: { name: string } | null;
};

function dateRangeLabel(practices: PracticeEvent[]): string {
  if (practices.length === 0) return 'No practices scheduled';
  const first = practices[0];
  const last = practices[practices.length - 1];
  return first.dateLabel === last.dateLabel
    ? first.fullDateLabel
    : `${first.dateLabel} – ${last.fullDateLabel}`;
}

export async function fetchSessions(): Promise<TrainingSessionGroup[]> {
  const [sessionResult, practices] = await Promise.all([
    supabase
      .from('training_sessions')
      .select('id, weeks, start_time, end_time, locations(name)')
      .order('created_at', { ascending: false }),
    fetchSessionPractices(),
  ]);
  if (sessionResult.error) throw sessionResult.error;

  const practicesBySession = new Map<string, PracticeEvent[]>();
  practices.forEach((p) => {
    if (!p.trainingSessionId) return;
    const list = practicesBySession.get(p.trainingSessionId) ?? [];
    list.push(p);
    practicesBySession.set(p.trainingSessionId, list);
  });

  return ((sessionResult.data ?? []) as unknown as SessionRow[]).map((row) => {
    const sessionPractices = (practicesBySession.get(row.id) ?? []).sort(
      (a, b) => (a.sessionWeekNumber ?? 0) - (b.sessionWeekNumber ?? 0)
    );

    return {
      id: row.id,
      weeks: row.weeks,
      locationName: row.locations?.name ?? null,
      startTime: row.start_time.slice(0, 5),
      endTime: row.end_time.slice(0, 5),
      dateRangeLabel: dateRangeLabel(sessionPractices),
      practices: sessionPractices,
    };
  });
}

export interface NewSessionInput {
  weeks: number;
  dates: string[];
  startTime: string;
  endTime: string;
  locationId: string | null;
}

// Every Derby 101 practice is always shared by both the 101 (recruit) and
// 201 teams, so session creation doesn't offer a team picker.
const SESSION_TEAM_NAMES = ['101', '201'];

async function fetchSessionTeamIds(): Promise<string[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('id, name')
    .in('name', SESSION_TEAM_NAMES);
  if (error) throw error;
  return (data ?? []).map((team) => team.id);
}

export async function createSession(input: NewSessionInput): Promise<void> {
  const { data: session, error: sessionError } = await supabase
    .from('training_sessions')
    .insert({
      weeks: input.weeks,
      location_id: input.locationId,
      start_time: `${input.startTime}:00`,
      end_time: `${input.endTime}:00`,
    })
    .select('id')
    .single();
  if (sessionError) throw sessionError;

  const sortedDates = [...input.dates].sort();

  const [{ data: events, error: eventsError }, teamIds] = await Promise.all([
    supabase
      .from('event_instances')
      .insert(
        sortedDates.map((dateStart, index) => ({
          title: `Derby 101 – Week ${index + 1}`,
          event_type: 'practice' as const,
          date_start: dateStart,
          start_time: `${input.startTime}:00`,
          end_time: `${input.endTime}:00`,
          location_id: input.locationId,
          training_session_id: session.id,
          session_week_number: index + 1,
        }))
      )
      .select('id'),
    fetchSessionTeamIds(),
  ]);
  if (eventsError) throw eventsError;

  if (teamIds.length > 0) {
    const teamRows = events.flatMap((event) =>
      teamIds.map((teamId) => ({ event_id: event.id, team_id: teamId }))
    );
    const { error: teamsError } = await supabase.from('event_teams').insert(teamRows);
    if (teamsError) throw teamsError;
  }

  await Promise.all(
    events.map(({ id: eventId }, index) => syncEventCurriculum(eventId, index + 1))
  );
}

import { supabase } from '@sjrd/api-client';
import { MONTH_NAMES } from './brand';
import { shortName, type ProfileRow } from './practice';

const ATTENDANCE_WARNING_DAYS = 14;

export interface SkaterListItem {
  id: string;
  name: string;
  teamIds: string[];
  teamName: string;
  attendanceRate: number | null;
  attendanceWarning: boolean;
  lastAttendedLabel: string | null;
  hasAllergies: boolean;
  isCurrent: boolean;
}

export interface GuardianContact {
  name: string;
  lastName: string;
  phone: string | null;
}

export interface SkaterDetail {
  id: string;
  name: string;
  firstName: string;
  preferredName: string | null;
  lastName: string;
  teamName: string;
  attendanceRate: number | null;
  allergies: string | null;
  likes: string | null;
  dislikes: string | null;
  guardians: GuardianContact[];
}

type TeamMemberRow = { team_id: string; teams: { id: string; name: string } | null };

type SkaterProfileRow = {
  id: string;
  first_name: string;
  preferred_name: string | null;
  derby_name: string | null;
  allergies: string | null;
  status: string;
  team_members: TeamMemberRow[];
};

type SkaterDetailProfileRow = SkaterProfileRow & {
  last_name: string;
  likes: string | null;
  dislikes: string | null;
};

function teamInfo(teamMembers: TeamMemberRow[]): { teamIds: string[]; teamName: string } {
  return {
    teamIds: teamMembers.map((tm) => tm.team_id),
    teamName:
      teamMembers
        .map((tm) => tm.teams?.name)
        .filter(Boolean)
        .join(' & ') || '—',
  };
}

interface AttendanceRecord {
  date: string;
  status: string;
}

type AttendanceRow = {
  profile_id: string;
  status: string;
  event_instances: { date_start: string } | null;
};

async function fetchAttendanceHistory(
  profileIds: string[]
): Promise<Map<string, AttendanceRecord[]>> {
  const byProfile = new Map<string, AttendanceRecord[]>();
  if (profileIds.length === 0) return byProfile;

  const { data, error } = await supabase
    .from('attendances')
    .select('profile_id, status, event_instances!inner(date_start, event_type)')
    .in('profile_id', profileIds)
    .eq('event_instances.event_type', 'practice');
  if (error) throw error;

  ((data as unknown as AttendanceRow[] | null) ?? []).forEach((row) => {
    if (!row.event_instances) return;
    const list = byProfile.get(row.profile_id) ?? [];
    list.push({ date: row.event_instances.date_start, status: row.status });
    byProfile.set(row.profile_id, list);
  });
  return byProfile;
}

function formatDateLabel(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${MONTH_NAMES[m - 1].slice(0, 3)} ${d}, ${y}`;
}

function computeAttendance(records: AttendanceRecord[] | undefined): {
  rate: number | null;
  warning: boolean;
  lastAttendedLabel: string | null;
} {
  if (!records || records.length === 0) {
    return { rate: null, warning: true, lastAttendedLabel: null };
  }

  const attended = records.filter((r) => r.status === 'present' || r.status === 'partial');
  const rate = Math.round((attended.length / records.length) * 100);

  const attendedDates = attended.map((r) => r.date).sort();
  const lastAttendedDate = attendedDates[attendedDates.length - 1];
  if (!lastAttendedDate) return { rate, warning: true, lastAttendedLabel: null };

  const daysSince = Math.floor(
    (Date.now() - new Date(`${lastAttendedDate}T00:00:00`).getTime()) / (1000 * 60 * 60 * 24)
  );
  return {
    rate,
    warning: daysSince >= ATTENDANCE_WARNING_DAYS,
    lastAttendedLabel: formatDateLabel(lastAttendedDate),
  };
}

const SKATER_SELECT = `
  profiles!profile_user_types_profile_id_fkey(
    id, first_name, preferred_name, derby_name, allergies, status,
    team_members!team_members_profile_id_fkey(team_id, teams(id, name))
  )
`;

export interface SkaterFilters {
  teamId: string | null;
  currentOnly: boolean;
}

export async function fetchSkaters(filters: SkaterFilters): Promise<SkaterListItem[]> {
  const { data, error } = await supabase
    .from('profile_user_types')
    .select(SKATER_SELECT)
    .eq('user_type', 'skater');
  if (error) throw error;

  const rows = (data ?? [])
    .map((row) => (row as unknown as { profiles: SkaterProfileRow | null }).profiles)
    .filter((p): p is SkaterProfileRow => !!p);

  const filtered = rows
    .filter(
      (row) => !filters.teamId || row.team_members.some((tm) => tm.team_id === filters.teamId)
    )
    .filter((row) => !filters.currentOnly || row.status === 'active');

  const attendanceByProfile = await fetchAttendanceHistory(filtered.map((row) => row.id));

  return filtered
    .map((row) => {
      const { teamIds, teamName } = teamInfo(row.team_members);
      const { rate, warning, lastAttendedLabel } = computeAttendance(
        attendanceByProfile.get(row.id)
      );
      return {
        id: row.id,
        name: shortName(row),
        teamIds,
        teamName,
        attendanceRate: rate,
        attendanceWarning: warning,
        lastAttendedLabel,
        hasAllergies: !!row.allergies,
        isCurrent: row.status === 'active',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

type GuardianRow = {
  profiles: (ProfileRow & { last_name: string; phone: string | null }) | null;
};

export async function fetchSkaterDetail(skaterId: string): Promise<SkaterDetail | null> {
  const [profileResult, guardianResult, attendanceByProfile] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        `id, first_name, last_name, preferred_name, derby_name, allergies, likes, dislikes,
         team_members!team_members_profile_id_fkey(team_id, teams(id, name))`
      )
      .eq('id', skaterId)
      .maybeSingle(),
    supabase
      .from('guardian_relationships')
      .select(
        'profiles!guardian_relationships_guardian_profile_id_fkey(first_name, last_name, preferred_name, derby_name, phone)'
      )
      .eq('child_profile_id', skaterId),
    fetchAttendanceHistory([skaterId]),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (guardianResult.error) throw guardianResult.error;
  if (!profileResult.data) return null;

  const row = profileResult.data as unknown as SkaterDetailProfileRow;
  const { teamName } = teamInfo(row.team_members);
  const { rate } = computeAttendance(attendanceByProfile.get(skaterId));

  const guardians: GuardianContact[] = ((guardianResult.data ?? []) as unknown as GuardianRow[])
    .filter((r) => !!r.profiles)
    .map((r) => ({
      name: shortName(r.profiles),
      lastName: r.profiles!.last_name,
      phone: r.profiles!.phone,
    }));

  return {
    id: row.id,
    name: shortName(row),
    firstName: row.first_name,
    preferredName: row.preferred_name,
    lastName: row.last_name,
    teamName,
    attendanceRate: rate,
    allergies: row.allergies,
    likes: row.likes,
    dislikes: row.dislikes,
    guardians,
  };
}

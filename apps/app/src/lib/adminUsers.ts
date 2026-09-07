import { supabase } from '@sjrd/api-client';
import { formatDisplayName } from './practice';
import { attachGuardianSkaters, type SkaterAttachment } from './guardianSkaters';
import type { UserType } from './userTypes';

export type AdminUserSource = 'account' | 'pending';

export interface AdminUser {
  id: string;
  source: AdminUserSource;
  firstName: string;
  lastName: string;
  name: string;
  email: string | null;
  phone: string | null;
  userTypes: UserType[];
  teamIds: string[];
  teamNames: string[];
  status: 'active' | 'inactive' | null;
  invited: boolean;
}

export interface AdminUserAssignments {
  userTypes: UserType[];
  teamIds: string[];
}

type ProfileAccountRow = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
  status: string;
  invited_at: string | null;
  email: string;
  phone: string | null;
};

type PendingUserRow = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
  email: string | null;
  invited_at: string | null;
};

type ProfileTypeRow = { profile_id: string; user_type: UserType };
type PendingTypeRow = { pending_user_id: string; user_type: UserType };
type ProfileTeamRow = { profile_id: string; teams: { id: string; name: string } | null };
type PendingTeamRow = { pending_user_id: string; teams: { id: string; name: string } | null };

function groupTeams<T extends { teams: { id: string; name: string } | null }>(
  rows: T[],
  idOf: (row: T) => string
): Map<string, { teamIds: string[]; teamNames: string[] }> {
  const byId = new Map<string, { teamIds: string[]; teamNames: string[] }>();
  rows
    .filter((row) => !!row.teams)
    .forEach((row) => {
      const id = idOf(row);
      const entry = byId.get(id) ?? { teamIds: [], teamNames: [] };
      entry.teamIds.push(row.teams!.id);
      entry.teamNames.push(row.teams!.name);
      byId.set(id, entry);
    });
  return byId;
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const [
    accountsResult,
    pendingResult,
    profileTypesResult,
    pendingTypesResult,
    profileTeamsResult,
    pendingTeamsResult,
  ] = await Promise.all([
    supabase.rpc('admin_list_profile_users'),
    supabase
      .from('pending_users')
      .select('id, first_name, last_name, preferred_name, derby_name, email, invited_at'),
    supabase.from('profile_user_types').select('profile_id, user_type'),
    supabase.from('pending_user_types').select('pending_user_id, user_type'),
    supabase.from('team_members').select('profile_id, teams(id, name)'),
    supabase.from('pending_user_teams').select('pending_user_id, teams(id, name)'),
  ]);

  if (accountsResult.error) throw accountsResult.error;
  if (pendingResult.error) throw pendingResult.error;
  if (profileTypesResult.error) throw profileTypesResult.error;
  if (pendingTypesResult.error) throw pendingTypesResult.error;
  if (profileTeamsResult.error) throw profileTeamsResult.error;
  if (pendingTeamsResult.error) throw pendingTeamsResult.error;

  const typesByProfile = new Map<string, UserType[]>();
  ((profileTypesResult.data ?? []) as ProfileTypeRow[]).forEach((row) => {
    const list = typesByProfile.get(row.profile_id) ?? [];
    list.push(row.user_type);
    typesByProfile.set(row.profile_id, list);
  });

  const typesByPending = new Map<string, UserType[]>();
  ((pendingTypesResult.data ?? []) as PendingTypeRow[]).forEach((row) => {
    const list = typesByPending.get(row.pending_user_id) ?? [];
    list.push(row.user_type);
    typesByPending.set(row.pending_user_id, list);
  });

  const teamsByProfile = groupTeams(
    (profileTeamsResult.data ?? []) as unknown as ProfileTeamRow[],
    (row) => row.profile_id
  );
  const teamsByPending = groupTeams(
    (pendingTeamsResult.data ?? []) as unknown as PendingTeamRow[],
    (row) => row.pending_user_id
  );

  const accounts: AdminUser[] = ((accountsResult.data ?? []) as ProfileAccountRow[]).map((row) => {
    const { teamIds, teamNames } = teamsByProfile.get(row.id) ?? { teamIds: [], teamNames: [] };
    return {
      id: row.id,
      source: 'account',
      firstName: row.first_name,
      lastName: row.last_name,
      name: formatDisplayName(row),
      email: row.email,
      phone: row.phone,
      userTypes: typesByProfile.get(row.id) ?? [],
      teamIds,
      teamNames,
      status: row.status === 'inactive' ? 'inactive' : 'active',
      invited: !!row.invited_at,
    };
  });

  const pending: AdminUser[] = ((pendingResult.data ?? []) as PendingUserRow[]).map((row) => {
    const { teamIds, teamNames } = teamsByPending.get(row.id) ?? { teamIds: [], teamNames: [] };
    return {
      id: row.id,
      source: 'pending',
      firstName: row.first_name,
      lastName: row.last_name,
      name: formatDisplayName(row),
      email: row.email,
      phone: null,
      userTypes: typesByPending.get(row.id) ?? [],
      teamIds,
      teamNames,
      status: null,
      invited: !!row.invited_at,
    };
  });

  return [...accounts, ...pending].sort((a, b) => a.name.localeCompare(b.name));
}

export interface NewPendingUserInput {
  firstName: string;
  lastName: string;
  email: string;
  preferredName?: string;
  derbyName?: string;
  userTypes: UserType[];
  teamIds: string[];
  skaters?: SkaterAttachment[];
}

export async function addPendingUser(input: NewPendingUserInput): Promise<void> {
  const { data, error } = await supabase
    .from('pending_users')
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      preferred_name: input.preferredName || null,
      derby_name: input.derbyName || null,
    })
    .select('id')
    .single();
  if (error) throw error;

  const pendingUserId = (data as { id: string }).id;

  const [typesResult, teamsResult] = await Promise.all([
    input.userTypes.length > 0
      ? supabase.from('pending_user_types').insert(
          input.userTypes.map((userType) => ({
            pending_user_id: pendingUserId,
            user_type: userType,
          }))
        )
      : Promise.resolve({ error: null }),
    input.teamIds.length > 0
      ? supabase
          .from('pending_user_teams')
          .insert(
            input.teamIds.map((teamId) => ({ pending_user_id: pendingUserId, team_id: teamId }))
          )
      : Promise.resolve({ error: null }),
  ]);
  if (typesResult.error) throw typesResult.error;
  if (teamsResult.error) throw teamsResult.error;

  if (input.skaters && input.skaters.length > 0) {
    await attachGuardianSkaters(pendingUserId, input.skaters);
  }
}

export async function invitePendingUser(pendingUserId: string): Promise<void> {
  const { error } = await supabase
    .from('pending_users')
    .update({ invited_at: new Date().toISOString() })
    .eq('id', pendingUserId);
  if (error) throw error;
}

export async function inviteAccountUser(profileId: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ invited_at: new Date().toISOString() })
    .eq('id', profileId);
  if (error) throw error;
}

async function syncJoinTable(
  table: 'profile_user_types' | 'pending_user_types',
  idColumn: 'profile_id' | 'pending_user_id',
  id: string,
  nextUserTypes: UserType[],
  currentUserTypes: UserType[]
): Promise<void> {
  const toAdd = nextUserTypes.filter((t) => !currentUserTypes.includes(t));
  const toRemove = currentUserTypes.filter((t) => !nextUserTypes.includes(t));

  if (toRemove.length > 0) {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(idColumn, id)
      .in('user_type', toRemove);
    if (error) throw error;
  }
  if (toAdd.length > 0) {
    const { error } = await supabase
      .from(table)
      .insert(toAdd.map((userType) => ({ [idColumn]: id, user_type: userType })));
    if (error) throw error;
  }
}

async function syncTeamTable(
  table: 'team_members' | 'pending_user_teams',
  idColumn: 'profile_id' | 'pending_user_id',
  id: string,
  nextTeamIds: string[],
  currentTeamIds: string[]
): Promise<void> {
  const toAdd = nextTeamIds.filter((t) => !currentTeamIds.includes(t));
  const toRemove = currentTeamIds.filter((t) => !nextTeamIds.includes(t));

  if (toRemove.length > 0) {
    const { error } = await supabase.from(table).delete().eq(idColumn, id).in('team_id', toRemove);
    if (error) throw error;
  }
  if (toAdd.length > 0) {
    const { error } = await supabase
      .from(table)
      .insert(toAdd.map((teamId) => ({ [idColumn]: id, team_id: teamId })));
    if (error) throw error;
  }
}

export async function updateUserAssignments(
  user: AdminUser,
  next: AdminUserAssignments
): Promise<void> {
  const table = user.source === 'account' ? 'profile_user_types' : 'pending_user_types';
  const idColumn = user.source === 'account' ? 'profile_id' : 'pending_user_id';
  const teamTable = user.source === 'account' ? 'team_members' : 'pending_user_teams';

  await Promise.all([
    syncJoinTable(table, idColumn, user.id, next.userTypes, user.userTypes),
    syncTeamTable(teamTable, idColumn, user.id, next.teamIds, user.teamIds),
  ]);
}

export function filterAdminUsers(
  users: AdminUser[],
  search: string,
  typeFilter: UserType | null
): AdminUser[] {
  const query = search.trim().toLowerCase();
  return users
    .filter((u) => !typeFilter || u.userTypes.includes(typeFilter))
    .filter(
      (u) =>
        !query ||
        u.name.toLowerCase().includes(query) ||
        (u.email ?? '').toLowerCase().includes(query)
    );
}

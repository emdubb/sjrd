import { supabase } from '@sjrd/api-client';
import { formatDisplayName } from './practice';

export type SkaterSource = 'account' | 'pending';

export interface ExistingSkaterOption {
  id: string;
  source: SkaterSource;
  name: string;
}

export interface NewSkaterInput {
  firstName: string;
  lastName: string;
  preferredName?: string;
  derbyName?: string;
  email?: string;
  teamIds?: string[];
}

export type SkaterAttachment =
  | { kind: 'existing'; id: string; source: SkaterSource; name: string }
  | { kind: 'new'; skater: NewSkaterInput; name: string };

type SkaterNameRow = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
};

export async function fetchExistingSkaters(): Promise<ExistingSkaterOption[]> {
  const [accountsResult, pendingResult] = await Promise.all([
    supabase
      .from('profile_user_types')
      .select(
        'profiles!profile_user_types_profile_id_fkey(id, first_name, last_name, preferred_name, derby_name)'
      )
      .eq('user_type', 'skater'),
    supabase
      .from('pending_user_types')
      .select(
        'pending_users!pending_user_types_pending_user_id_fkey(id, first_name, last_name, preferred_name, derby_name)'
      )
      .eq('user_type', 'skater'),
  ]);
  if (accountsResult.error) throw accountsResult.error;
  if (pendingResult.error) throw pendingResult.error;

  const accounts = ((accountsResult.data ?? []) as unknown as { profiles: SkaterNameRow | null }[])
    .filter((row): row is { profiles: SkaterNameRow } => !!row.profiles)
    .map((row) => ({
      id: row.profiles.id,
      source: 'account' as const,
      name: formatDisplayName(row.profiles),
    }));

  const pending = (
    (pendingResult.data ?? []) as unknown as { pending_users: SkaterNameRow | null }[]
  )
    .filter((row): row is { pending_users: SkaterNameRow } => !!row.pending_users)
    .map((row) => ({
      id: row.pending_users.id,
      source: 'pending' as const,
      name: formatDisplayName(row.pending_users),
    }));

  return [...accounts, ...pending].sort((a, b) => a.name.localeCompare(b.name));
}

export async function attachGuardianSkaters(
  guardianPendingUserId: string,
  skaters: SkaterAttachment[]
): Promise<void> {
  for (const attachment of skaters) {
    if (attachment.kind === 'existing') {
      const { error } = await supabase.from('pending_user_guardians').insert({
        guardian_pending_user_id: guardianPendingUserId,
        skater_pending_user_id: attachment.source === 'pending' ? attachment.id : null,
        skater_profile_id: attachment.source === 'account' ? attachment.id : null,
      });
      if (error) throw error;
      continue;
    }

    const { data, error } = await supabase
      .from('pending_users')
      .insert({
        first_name: attachment.skater.firstName,
        last_name: attachment.skater.lastName,
        preferred_name: attachment.skater.preferredName || null,
        derby_name: attachment.skater.derbyName || null,
        email: attachment.skater.email || null,
      })
      .select('id')
      .single();
    if (error) throw error;
    const skaterId = (data as { id: string }).id;

    const typeResult = await supabase
      .from('pending_user_types')
      .insert({ pending_user_id: skaterId, user_type: 'skater' });
    if (typeResult.error) throw typeResult.error;

    const linkResult = await supabase.from('pending_user_guardians').insert({
      guardian_pending_user_id: guardianPendingUserId,
      skater_pending_user_id: skaterId,
    });
    if (linkResult.error) throw linkResult.error;

    const teamIds = attachment.skater.teamIds ?? [];
    if (teamIds.length > 0) {
      const teamsResult = await supabase
        .from('pending_user_teams')
        .insert(teamIds.map((teamId) => ({ pending_user_id: skaterId, team_id: teamId })));
      if (teamsResult.error) throw teamsResult.error;
    }
  }
}

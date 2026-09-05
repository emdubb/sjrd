import { supabase } from '@sjrd/api-client';

export type ProfileStatus = 'active' | 'inactive';

export interface MyProfile {
  id: string;
  firstName: string;
  lastName: string;
  preferredName: string | null;
  derbyName: string | null;
  skaterNumber: string | null;
  phone: string | null;
  allergies: string | null;
  likes: string | null;
  dislikes: string | null;
  teamName: string;
  status: ProfileStatus;
}

export interface MyProfileFormData {
  firstName: string;
  lastName: string;
  preferredName: string;
  derbyName: string;
  skaterNumber: string;
  phone: string;
  allergies: string;
  likes: string;
  dislikes: string;
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not signed in');
  return data.user.id;
}

type MyProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  derby_name: string | null;
  skater_number: string | null;
  phone: string | null;
  allergies: string | null;
  likes: string | null;
  dislikes: string | null;
  status: string;
};

type TeamMemberRow = { teams: { id: string; name: string } | null };

export async function fetchMyProfile(): Promise<MyProfile> {
  const userId = await getCurrentUserId();

  const [profileResult, teamResult] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        'id, first_name, last_name, preferred_name, derby_name, skater_number, phone, allergies, likes, dislikes, status'
      )
      .eq('id', userId)
      .single(),
    supabase.from('team_members').select('teams(id, name)').eq('profile_id', userId),
  ]);

  if (profileResult.error) throw profileResult.error;
  if (teamResult.error) throw teamResult.error;

  const row = profileResult.data as unknown as MyProfileRow;
  const teamName =
    ((teamResult.data ?? []) as unknown as TeamMemberRow[])
      .map((t) => t.teams?.name)
      .filter(Boolean)
      .join(' & ') || '—';

  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    preferredName: row.preferred_name,
    derbyName: row.derby_name,
    skaterNumber: row.skater_number,
    phone: row.phone,
    allergies: row.allergies,
    likes: row.likes,
    dislikes: row.dislikes,
    teamName,
    status: row.status === 'inactive' ? 'inactive' : 'active',
  };
}

export async function updateMyProfile(data: MyProfileFormData): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      preferred_name: data.preferredName || null,
      derby_name: data.derbyName || null,
      skater_number: data.skaterNumber || null,
      phone: data.phone || null,
      allergies: data.allergies || null,
      likes: data.likes || null,
      dislikes: data.dislikes || null,
    })
    .eq('id', userId);
  if (error) throw error;
}

export async function updateMyStatus(status: ProfileStatus): Promise<void> {
  const userId = await getCurrentUserId();
  const { error } = await supabase.rpc('set_skater_status', {
    p_skater_id: userId,
    p_status: status,
  });
  if (error) throw error;
}

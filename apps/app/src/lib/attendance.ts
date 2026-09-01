import { supabase } from '@sjrd/api-client';

export type AttendanceStatus = 'present' | 'partial' | 'absent';

export async function fetchAttendanceStatuses(
  eventId: string
): Promise<Record<string, AttendanceStatus>> {
  const { data, error } = await supabase
    .from('attendances')
    .select('profile_id, status')
    .eq('event_id', eventId);
  if (error) throw error;

  const statuses: Record<string, AttendanceStatus> = {};
  (data ?? []).forEach((row) => {
    const status = row.status as string;
    statuses[row.profile_id as string] =
      status === 'present' || status === 'partial' ? status : 'absent';
  });
  return statuses;
}

export async function saveAttendanceStatuses(
  eventId: string,
  statuses: Record<string, AttendanceStatus>
): Promise<void> {
  const { error: deleteError } = await supabase
    .from('attendances')
    .delete()
    .eq('event_id', eventId);
  if (deleteError) throw deleteError;

  const rows = Object.entries(statuses).map(([profileId, status]) => ({
    event_id: eventId,
    profile_id: profileId,
    status,
  }));
  if (rows.length === 0) return;

  const { error: insertError } = await supabase.from('attendances').insert(rows);
  if (insertError) throw insertError;
}

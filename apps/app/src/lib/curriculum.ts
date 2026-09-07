import { supabase } from '@sjrd/api-client';

export interface CurriculumDrill {
  id: string;
  title: string;
  durationMinutes: number;
  position: number;
}

export interface CurriculumItem {
  id: string;
  weekNumber: number;
  content: string | null;
  drills: CurriculumDrill[];
}

type CurriculumDrillRow = {
  drill_id: string;
  position: number;
  drills: { id: string; title: string; duration_minutes: number } | null;
};

type CurriculumRow = {
  id: string;
  week_number: number;
  content: string | null;
  curriculum_drills: CurriculumDrillRow[];
};

const CURRICULUM_SELECT = `
  id, week_number, content,
  curriculum_drills(drill_id, position, drills(id, title, duration_minutes))
` as const;

function rowToCurriculum(row: CurriculumRow): CurriculumItem {
  return {
    id: row.id,
    weekNumber: row.week_number,
    content: row.content,
    drills: row.curriculum_drills
      .filter((cd) => !!cd.drills)
      .sort((a, b) => a.position - b.position)
      .map((cd) => ({
        id: cd.drills!.id,
        title: cd.drills!.title,
        durationMinutes: cd.drills!.duration_minutes,
        position: cd.position,
      })),
  };
}

export async function fetchCurriculum(): Promise<CurriculumItem[]> {
  const { data, error } = await supabase
    .from('curriculum')
    .select(CURRICULUM_SELECT)
    .order('week_number');
  if (error) throw error;
  return (data ?? []).map((row) => rowToCurriculum(row as unknown as CurriculumRow));
}

export async function fetchCurriculumByWeek(weekNumber: number): Promise<CurriculumItem | null> {
  const { data, error } = await supabase
    .from('curriculum')
    .select(CURRICULUM_SELECT)
    .eq('week_number', weekNumber)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToCurriculum(data as unknown as CurriculumRow) : null;
}

export interface EventCurriculum {
  weekNumber: number;
  content: string | null;
}

// Curriculum is normally copied onto a practice when its session is created, but a
// week's curriculum may not exist yet at that point (e.g. added afterward), or
// drills may be added to it later. Called every time a Derby 101 practice is
// viewed: the content snapshot is only taken once a practice has one (so it won't
// retroactively change), but drills are topped up on every call, so ones added to
// the curriculum after the initial snapshot still make it onto a practice that
// hasn't run yet.
export async function syncEventCurriculum(
  eventId: string,
  weekNumber: number
): Promise<EventCurriculum | null> {
  const [curriculum, snapshotResult] = await Promise.all([
    fetchCurriculumByWeek(weekNumber),
    supabase
      .from('event_curriculum')
      .select('week_number, content')
      .eq('event_id', eventId)
      .maybeSingle(),
  ]);
  if (snapshotResult.error) throw snapshotResult.error;
  const existingSnapshot = snapshotResult.data;

  // No master curriculum for this week (never existed, or was since removed) — fall
  // back to whatever snapshot this practice already has, if any.
  if (!curriculum) {
    return existingSnapshot
      ? { weekNumber: existingSnapshot.week_number, content: existingSnapshot.content }
      : null;
  }

  if (!existingSnapshot) {
    const { error: insertError } = await supabase.from('event_curriculum').insert({
      event_id: eventId,
      source_curriculum_id: curriculum.id,
      week_number: weekNumber,
      content: curriculum.content,
    });
    if (insertError) throw insertError;
  }

  if (curriculum.drills.length > 0) {
    const { data: existingDrills, error: existingError } = await supabase
      .from('event_drills')
      .select('drill_id, position')
      .eq('event_id', eventId);
    if (existingError) throw existingError;

    const existingDrillIds = new Set((existingDrills ?? []).map((d) => d.drill_id));
    const nextPosition =
      (existingDrills ?? []).reduce((max, d) => Math.max(max, d.position), -1) + 1;

    const newDrills = curriculum.drills.filter((drill) => !existingDrillIds.has(drill.id));
    if (newDrills.length > 0) {
      const { error: drillsError } = await supabase.from('event_drills').insert(
        newDrills.map((drill, index) => ({
          event_id: eventId,
          drill_id: drill.id,
          position: nextPosition + index,
        }))
      );
      if (drillsError) throw drillsError;
    }
  }

  return existingSnapshot
    ? { weekNumber: existingSnapshot.week_number, content: existingSnapshot.content }
    : { weekNumber, content: curriculum.content };
}

export interface CurriculumFormData {
  weekNumber: number;
  content: string;
  drillIds: string[];
}

async function replaceCurriculumDrills(curriculumId: string, drillIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('curriculum_drills')
    .delete()
    .eq('curriculum_id', curriculumId);
  if (deleteError) throw deleteError;

  if (drillIds.length > 0) {
    const rows = drillIds.map((drillId, position) => ({
      curriculum_id: curriculumId,
      drill_id: drillId,
      position,
    }));
    const { error: insertError } = await supabase.from('curriculum_drills').insert(rows);
    if (insertError) throw insertError;
  }
}

export async function createCurriculum(data: CurriculumFormData): Promise<void> {
  const { data: curriculum, error } = await supabase
    .from('curriculum')
    .insert({ week_number: data.weekNumber, content: data.content || null })
    .select('id')
    .single();
  if (error) throw error;

  await replaceCurriculumDrills(curriculum.id, data.drillIds);
}

export async function updateCurriculum(id: string, data: CurriculumFormData): Promise<void> {
  const { error } = await supabase
    .from('curriculum')
    .update({ week_number: data.weekNumber, content: data.content || null })
    .eq('id', id);
  if (error) throw error;

  await replaceCurriculumDrills(id, data.drillIds);
}

export async function deleteCurriculum(id: string): Promise<void> {
  const { error } = await supabase.from('curriculum').delete().eq('id', id);
  if (error) throw error;
}

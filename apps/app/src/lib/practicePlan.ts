import { supabase } from '@sjrd/api-client';
import { rowToDrill, DRILL_SELECT, type Drill, type DrillDbRow } from './drills';

export interface PracticeDrill {
  drillId: string;
  title: string;
  durationMinutes: number;
  position: number;
}

type EventDrillRow = {
  drill_id: string;
  position: number;
  drills: { title: string; duration_minutes: number } | null;
};

function rowToPracticeDrill(row: EventDrillRow): PracticeDrill {
  return {
    drillId: row.drill_id,
    title: row.drills?.title ?? 'Untitled Drill',
    durationMinutes: row.drills?.duration_minutes ?? 0,
    position: row.position,
  };
}

const EVENT_DRILL_SELECT = `
  drill_id, position,
  drills(title, duration_minutes)
` as const;

export async function fetchPracticeDrills(eventId: string): Promise<PracticeDrill[]> {
  const { data, error } = await supabase
    .from('event_drills')
    .select(EVENT_DRILL_SELECT)
    .eq('event_id', eventId)
    .order('position', { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => rowToPracticeDrill(row as unknown as EventDrillRow));
}

export interface PracticeModeDrill extends Drill {
  position: number;
}

type EventDrillFullRow = {
  position: number;
  drills: DrillDbRow | null;
};

const EVENT_DRILL_FULL_SELECT = `
  position,
  drills(${DRILL_SELECT})
` as const;

export async function fetchPracticeModeDrills(eventId: string): Promise<PracticeModeDrill[]> {
  const { data, error } = await supabase
    .from('event_drills')
    .select(EVENT_DRILL_FULL_SELECT)
    .eq('event_id', eventId)
    .order('position', { ascending: true });
  if (error) throw error;
  return ((data ?? []) as unknown as EventDrillFullRow[])
    .filter((row) => !!row.drills)
    .map((row) => ({ ...rowToDrill(row.drills as DrillDbRow), position: row.position }));
}

export async function addPracticeDrill(
  eventId: string,
  drillId: string,
  position: number
): Promise<void> {
  const { error } = await supabase
    .from('event_drills')
    .insert({ event_id: eventId, drill_id: drillId, position });
  if (error) throw error;
}

export async function removePracticeDrill(eventId: string, drillId: string): Promise<void> {
  const { error } = await supabase
    .from('event_drills')
    .delete()
    .eq('event_id', eventId)
    .eq('drill_id', drillId);
  if (error) throw error;
}

export async function swapPracticeDrillPositions(
  eventId: string,
  a: { drillId: string; position: number },
  b: { drillId: string; position: number }
): Promise<void> {
  const { error: errorA } = await supabase
    .from('event_drills')
    .update({ position: b.position })
    .eq('event_id', eventId)
    .eq('drill_id', a.drillId);
  if (errorA) throw errorA;

  const { error: errorB } = await supabase
    .from('event_drills')
    .update({ position: a.position })
    .eq('event_id', eventId)
    .eq('drill_id', b.drillId);
  if (errorB) throw errorB;
}

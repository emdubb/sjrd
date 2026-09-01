import { supabase } from '@sjrd/api-client';
import { BRAND } from './brand';
import { shortName, type ProfileRow } from './practice';

export type DrillType = 'jamming' | 'blocking' | 'offense';

export const DRILL_TYPES: DrillType[] = ['jamming', 'blocking', 'offense'];

export const DRILL_TYPE_LABELS: Record<DrillType, string> = {
  jamming: 'Jamming',
  blocking: 'Blocking',
  offense: 'Offense',
};

export type DrillCategory = 'warm_up' | 'endurance' | 'individual_skills' | 'partner_pack_skills';

export const DRILL_CATEGORIES: DrillCategory[] = [
  'warm_up',
  'endurance',
  'individual_skills',
  'partner_pack_skills',
];

export const DRILL_CATEGORY_LABELS: Record<DrillCategory, string> = {
  warm_up: 'Warm Up',
  endurance: 'Endurance',
  individual_skills: 'Individual Skills',
  partner_pack_skills: 'Partner & Pack Skills',
};

export const DRILL_CATEGORY_COLORS: Record<DrillCategory, string> = {
  warm_up: BRAND.gold,
  endurance: BRAND.steel,
  individual_skills: BRAND.navy,
  partner_pack_skills: BRAND.amber,
};

export type DrillEquipment =
  'disc_cones' | 'pointed_cones' | 'hitting_bags' | 'weaving_poles' | 'pvc_poles';

export const DRILL_EQUIPMENT: DrillEquipment[] = [
  'disc_cones',
  'pointed_cones',
  'hitting_bags',
  'weaving_poles',
  'pvc_poles',
];

export const DRILL_EQUIPMENT_LABELS: Record<DrillEquipment, string> = {
  disc_cones: 'Disc Cones',
  pointed_cones: 'Pointed Cones',
  hitting_bags: 'Hitting Bags',
  weaving_poles: 'Weaving Poles',
  pvc_poles: 'PVC Poles',
};

export interface Drill {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  durationMinutes: number;
  types: DrillType[];
  categories: DrillCategory[];
  equipment: DrillEquipment[];
  createdByName: string | null;
}

export type DrillDbRow = {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  duration_minutes: number;
  drill_drill_types: { drill_type: DrillType }[];
  drill_drill_categories: { drill_category: DrillCategory }[];
  drill_drill_equipment: { drill_equipment: DrillEquipment }[];
  profiles: ProfileRow | null;
};

export function rowToDrill(row: DrillDbRow): Drill {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    instructions: row.instructions,
    durationMinutes: row.duration_minutes,
    types: row.drill_drill_types.map((t) => t.drill_type),
    categories: row.drill_drill_categories.map((c) => c.drill_category),
    equipment: row.drill_drill_equipment.map((e) => e.drill_equipment),
    createdByName: row.profiles ? shortName(row.profiles) : null,
  };
}

export const DRILL_SELECT = `
  id, title, description, instructions, duration_minutes,
  drill_drill_types(drill_type),
  drill_drill_categories(drill_category),
  drill_drill_equipment(drill_equipment),
  profiles!drills_created_by_fkey(first_name, preferred_name, derby_name)
` as const;

export interface DrillSearchFilters {
  search: string;
  category: DrillCategory | null;
  types: DrillType[];
}

export function filterDrills(drills: Drill[], filters: DrillSearchFilters): Drill[] {
  const query = filters.search.trim().toLowerCase();
  return drills.filter((d) => {
    const matchesQuery = query === '' || d.title.toLowerCase().includes(query);
    const matchesCategory = !filters.category || d.categories.includes(filters.category);
    const matchesType =
      filters.types.length === 0 || filters.types.some((t) => d.types.includes(t));
    return matchesQuery && matchesCategory && matchesType;
  });
}

export async function fetchDrills(): Promise<Drill[]> {
  const { data, error } = await supabase
    .from('drills')
    .select(DRILL_SELECT)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => rowToDrill(row as unknown as DrillDbRow));
}

async function fetchDrillById(id: string): Promise<Drill> {
  const { data, error } = await supabase.from('drills').select(DRILL_SELECT).eq('id', id).single();
  if (error) throw error;
  return rowToDrill(data as unknown as DrillDbRow);
}

export interface DrillFormData {
  title: string;
  description: string;
  instructions: string;
  durationMinutes: number;
  types: DrillType[];
  categories: DrillCategory[];
  equipment: DrillEquipment[];
}

async function replaceDrillTypes(drillId: string, types: DrillType[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('drill_drill_types')
    .delete()
    .eq('drill_id', drillId);
  if (deleteError) throw deleteError;

  if (types.length > 0) {
    const typeRows = types.map((drillType) => ({ drill_id: drillId, drill_type: drillType }));
    const { error: insertError } = await supabase.from('drill_drill_types').insert(typeRows);
    if (insertError) throw insertError;
  }
}

async function replaceDrillCategories(drillId: string, categories: DrillCategory[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('drill_drill_categories')
    .delete()
    .eq('drill_id', drillId);
  if (deleteError) throw deleteError;

  if (categories.length > 0) {
    const categoryRows = categories.map((drillCategory) => ({
      drill_id: drillId,
      drill_category: drillCategory,
    }));
    const { error: insertError } = await supabase
      .from('drill_drill_categories')
      .insert(categoryRows);
    if (insertError) throw insertError;
  }
}

async function replaceDrillEquipment(drillId: string, equipment: DrillEquipment[]): Promise<void> {
  const { error: deleteError } = await supabase
    .from('drill_drill_equipment')
    .delete()
    .eq('drill_id', drillId);
  if (deleteError) throw deleteError;

  if (equipment.length > 0) {
    const equipmentRows = equipment.map((drillEquipment) => ({
      drill_id: drillId,
      drill_equipment: drillEquipment,
    }));
    const { error: insertError } = await supabase
      .from('drill_drill_equipment')
      .insert(equipmentRows);
    if (insertError) throw insertError;
  }
}

export async function createDrill(formData: DrillFormData): Promise<Drill> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data: drill, error } = await supabase
    .from('drills')
    .insert({
      title: formData.title,
      description: formData.description || null,
      instructions: formData.instructions || null,
      duration_minutes: formData.durationMinutes,
      author_id: userData.user.id,
      created_by: userData.user.id,
    })
    .select('id')
    .single();
  if (error) throw error;

  await replaceDrillTypes(drill.id, formData.types);
  await replaceDrillCategories(drill.id, formData.categories);
  await replaceDrillEquipment(drill.id, formData.equipment);

  return fetchDrillById(drill.id);
}

export async function updateDrill(id: string, formData: DrillFormData): Promise<Drill> {
  const { error } = await supabase
    .from('drills')
    .update({
      title: formData.title,
      description: formData.description || null,
      instructions: formData.instructions || null,
      duration_minutes: formData.durationMinutes,
    })
    .eq('id', id);
  if (error) throw error;

  await replaceDrillTypes(id, formData.types);
  await replaceDrillCategories(id, formData.categories);
  await replaceDrillEquipment(id, formData.equipment);

  return fetchDrillById(id);
}

export async function deleteDrill(id: string): Promise<void> {
  const { error } = await supabase.from('drills').delete().eq('id', id);
  if (error) throw error;
}

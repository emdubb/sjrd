import { supabase } from '@sjrd/api-client';

export interface LocationOption {
  id: string;
  name: string;
  address: string | null;
  isDefault: boolean;
}

export async function fetchLocations(): Promise<LocationOption[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('id, name, address, is_default')
    .order('name');
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    address: row.address,
    isDefault: row.is_default,
  }));
}

export function defaultLocationId(locations: LocationOption[]): string | null {
  return locations.find((l) => l.isDefault)?.id ?? locations[0]?.id ?? null;
}

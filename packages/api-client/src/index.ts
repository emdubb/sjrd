import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type User = {
  id: string;
  full_name: string;
  email: string;
};

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and ANON key must be defined in environment variables.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

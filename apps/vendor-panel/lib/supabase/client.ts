import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  // TODO: add browser client logic
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '');
}


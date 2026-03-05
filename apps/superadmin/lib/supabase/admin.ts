import { createClient } from "@supabase/supabase-js";
import {
  assertSupabaseEnv,
  supabaseServiceRoleKey,
  supabaseUrl
} from "@/lib/supabase/constants";

export function getSupabaseAdminClient() {
  assertSupabaseEnv();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

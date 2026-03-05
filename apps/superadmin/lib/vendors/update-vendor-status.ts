import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function updateVendorStatus(id: string, is_active: boolean) {
  const supabase = getSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update({ is_active })
    .eq("id", id)
    .eq("role", "vendor")
    .select("id,email,full_name,phone,role,is_active,created_at")
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const targetStoreStatus = is_active ? "active" : "suspended";
  const { error: storeError } = await supabase
    .from("stores")
    .update({ status: targetStoreStatus })
    .eq("vendor_id", id);

  if (storeError) {
    throw new Error(storeError.message);
  }

  return profile;
}

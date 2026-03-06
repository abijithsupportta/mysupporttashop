import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface RevenueAggregate {
  created_at: string;
  total: number | string;
  commission: number | string;
}

export async function getRevenueRows(days: number) {
  const supabase = getSupabaseAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - Math.max(1, days));

  const response = await supabase
    .from("orders")
    .select("created_at,total,commission")
    .gte("created_at", since.toISOString())
    .eq("payment_status", "paid")
    .order("created_at", { ascending: true });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return (response.data ?? []) as RevenueAggregate[];
}

export async function getTopVendorsRows(limit: number) {
  const supabase = getSupabaseAdminClient();

  const response = await supabase
    .from("orders")
    .select("vendor_id,total,commission,profiles(full_name,email)")
    .eq("payment_status", "paid");

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    rows: response.data ?? [],
    limit
  };
}

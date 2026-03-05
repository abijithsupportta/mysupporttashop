import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function getDashboardCounts(now = new Date()) {
  const supabase = getSupabaseAdminClient();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const responses = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "vendor"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total,commission").eq("payment_status", "paid"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "vendor")
      .gte("created_at", monthStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", dayStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "vendor")
      .eq("is_active", true),
    supabase
      .from("orders")
      .select(
        "id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,stores(name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select(
        "id,email,full_name,phone,role,is_active,created_at,stores(id,vendor_id,name,slug,status,is_published,total_products,total_orders,total_revenue,created_at)"
      )
      .eq("role", "vendor")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  for (const response of responses) {
    if (response.error) {
      throw new Error(response.error.message);
    }
  }

  return {
    totalVendorsCount: responses[0].count ?? 0,
    totalOrdersCount: responses[1].count ?? 0,
    paidRows: responses[2].data ?? [],
    newVendorsThisMonthCount: responses[3].count ?? 0,
    newOrdersTodayCount: responses[4].count ?? 0,
    pendingOrdersCount: responses[5].count ?? 0,
    activeVendorsCount: responses[6].count ?? 0,
    recentOrderRows: responses[7].data ?? [],
    recentVendorRows: responses[8].data ?? []
  };
}

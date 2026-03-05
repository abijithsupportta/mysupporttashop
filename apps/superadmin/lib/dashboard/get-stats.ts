import type { DashboardStats } from "@/types/dashboard";
import type { Order } from "@/types/order";
import type { Vendor } from "@/types/vendor";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseAdminClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

  const [
    totalVendorsRes,
    totalOrdersRes,
    paidOrdersRes,
    newVendorsRes,
    newOrdersRes,
    pendingOrdersRes,
    activeVendorsRes,
    recentOrdersRes,
    recentVendorsRes
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "vendor"),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total,commission").eq("payment_status", "paid"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "vendor")
      .gte("created_at", monthStart),
    supabase.from("orders").select("id", { count: "exact", head: true }).gte("created_at", dayStart),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("order_status", "pending"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "vendor")
      .eq("is_active", true),
    supabase
      .from("orders")
      .select("id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,stores(name)")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("id,email,full_name,phone,role,is_active,created_at,stores(id,vendor_id,name,slug,status,is_published,total_products,total_orders,total_revenue,created_at)")
      .eq("role", "vendor")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const paidOrders = paidOrdersRes.data ?? [];
  const totalRevenue = paidOrders.reduce((sum, order) => sum + toNumber(order.total), 0);
  const totalCommission = paidOrders.reduce(
    (sum, order) => sum + toNumber(order.commission),
    0
  );

  const recentOrders: Order[] = (recentOrdersRes.data ?? []).map((item) => ({
    id: item.id,
    store_id: item.store_id,
    vendor_id: item.vendor_id,
    customer_name: item.customer_name,
    customer_email: item.customer_email,
    customer_phone: item.customer_phone,
    total: toNumber(item.total),
    commission: toNumber(item.commission),
    payment_status: item.payment_status,
    order_status: item.order_status,
    created_at: item.created_at,
    store: Array.isArray(item.stores) && item.stores.length > 0
      ? {
          id: "",
          vendor_id: "",
          name: item.stores[0].name,
          slug: "",
          status: "",
          is_published: false,
          total_products: 0,
          total_orders: 0,
          total_revenue: 0,
          created_at: ""
        }
      : undefined
  }));

  const recentVendors: Vendor[] = (recentVendorsRes.data ?? []).map((item) => ({
    id: item.id,
    email: item.email,
    full_name: item.full_name,
    phone: item.phone,
    role: item.role,
    is_active: item.is_active,
    created_at: item.created_at,
    store: Array.isArray(item.stores) && item.stores.length > 0 ? item.stores[0] : undefined
  }));

  return {
    total_vendors: totalVendorsRes.count ?? 0,
    total_orders: totalOrdersRes.count ?? 0,
    total_revenue: totalRevenue,
    total_commission: totalCommission,
    new_vendors_this_month: newVendorsRes.count ?? 0,
    new_orders_today: newOrdersRes.count ?? 0,
    pending_orders: pendingOrdersRes.count ?? 0,
    active_vendors: activeVendorsRes.count ?? 0,
    recent_orders: recentOrders,
    recent_vendors: recentVendors
  };
}

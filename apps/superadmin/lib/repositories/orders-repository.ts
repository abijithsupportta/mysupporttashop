import type { OrderStatus, PaymentStatus } from "@/types/order";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface OrdersQuery {
  page: number;
  limit: number;
  search: string;
  order_status: OrderStatus | "all";
  payment_status: PaymentStatus | "all";
  vendor_id: string;
  from_date: string;
  to_date: string;
}

export async function listOrders(query: OrdersQuery) {
  const supabase = getSupabaseAdminClient();
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let statement = supabase
    .from("orders")
    .select(
      "id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,stores(name,slug),profiles(full_name,email),order_items(id)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  let summaryStatement = supabase.from("orders").select("total,commission");

  if (query.search) {
    statement = statement.or(`id.ilike.%${query.search}%,customer_name.ilike.%${query.search}%`);
    summaryStatement = summaryStatement.or(
      `id.ilike.%${query.search}%,customer_name.ilike.%${query.search}%`
    );
  }

  if (query.order_status !== "all") {
    statement = statement.eq("order_status", query.order_status);
    summaryStatement = summaryStatement.eq("order_status", query.order_status);
  }

  if (query.payment_status !== "all") {
    statement = statement.eq("payment_status", query.payment_status);
    summaryStatement = summaryStatement.eq("payment_status", query.payment_status);
  }

  if (query.vendor_id !== "all") {
    statement = statement.eq("vendor_id", query.vendor_id);
    summaryStatement = summaryStatement.eq("vendor_id", query.vendor_id);
  }

  if (query.from_date) {
    statement = statement.gte("created_at", query.from_date);
    summaryStatement = summaryStatement.gte("created_at", query.from_date);
  }

  if (query.to_date) {
    const toDateWithDayEnd = `${query.to_date}T23:59:59`;
    statement = statement.lte("created_at", toDateWithDayEnd);
    summaryStatement = summaryStatement.lte("created_at", toDateWithDayEnd);
  }

  const [ordersRes, summaryRes] = await Promise.all([statement, summaryStatement]);

  if (ordersRes.error) {
    throw new Error(ordersRes.error.message);
  }

  if (summaryRes.error) {
    throw new Error(summaryRes.error.message);
  }

  return {
    rows: ordersRes.data ?? [],
    totalCount: ordersRes.count ?? 0,
    summaryRows: summaryRes.data ?? []
  };
}

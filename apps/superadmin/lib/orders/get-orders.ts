import type { Order, OrderStatus, PaymentStatus } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  order_status?: OrderStatus | "all";
  payment_status?: PaymentStatus | "all";
  vendor_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface OrdersResult extends PaginatedResponse<Order> {
  summary: {
    total_revenue: number;
    total_commission: number;
  };
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

export async function getOrders(params: GetOrdersParams): Promise<OrdersResult> {
  const supabase = getSupabaseAdminClient();
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("orders")
    .select(
      "id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,stores(name,slug),profiles(full_name,email),order_items(id)",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  let summaryQuery = supabase.from("orders").select("total,commission");

  if (params.search?.trim()) {
    const term = params.search.trim();
    query = query.or(`id.ilike.%${term}%,customer_name.ilike.%${term}%`);
    summaryQuery = summaryQuery.or(`id.ilike.%${term}%,customer_name.ilike.%${term}%`);
  }

  if (params.order_status && params.order_status !== "all") {
    query = query.eq("order_status", params.order_status);
    summaryQuery = summaryQuery.eq("order_status", params.order_status);
  }

  if (params.payment_status && params.payment_status !== "all") {
    query = query.eq("payment_status", params.payment_status);
    summaryQuery = summaryQuery.eq("payment_status", params.payment_status);
  }

  if (params.vendor_id && params.vendor_id !== "all") {
    query = query.eq("vendor_id", params.vendor_id);
    summaryQuery = summaryQuery.eq("vendor_id", params.vendor_id);
  }

  if (params.from_date) {
    query = query.gte("created_at", params.from_date);
    summaryQuery = summaryQuery.gte("created_at", params.from_date);
  }

  if (params.to_date) {
    const toDateWithDayEnd = `${params.to_date}T23:59:59`;
    query = query.lte("created_at", toDateWithDayEnd);
    summaryQuery = summaryQuery.lte("created_at", toDateWithDayEnd);
  }

  const [{ data, count, error }, summaryRes] = await Promise.all([query, summaryQuery]);

  if (error) {
    throw new Error(error.message);
  }

  if (summaryRes.error) {
    throw new Error(summaryRes.error.message);
  }

  const summary = (summaryRes.data ?? []).reduce(
    (acc, item) => {
      acc.total_revenue += toNumber(item.total);
      acc.total_commission += toNumber(item.commission);
      return acc;
    },
    { total_revenue: 0, total_commission: 0 }
  );

  const orders: Order[] = (data ?? []).map((order) => ({
    ...(() => {
      const store = Array.isArray(order.stores) && order.stores.length > 0 ? order.stores[0] : null;
      const profile =
        Array.isArray(order.profiles) && order.profiles.length > 0 ? order.profiles[0] : null;

      return {
        id: order.id,
        store_id: order.store_id,
        vendor_id: order.vendor_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        total: toNumber(order.total),
        commission: toNumber(order.commission),
        payment_status: order.payment_status,
        order_status: order.order_status,
        created_at: order.created_at,
        store: {
          id: "",
          vendor_id: order.vendor_id,
          name: store?.name ?? "-",
          slug: store?.slug ?? "",
          status: "",
          is_published: false,
          total_products: 0,
          total_orders: 0,
          total_revenue: 0,
          created_at: ""
        },
        vendor: {
          id: order.vendor_id,
          email: profile?.email ?? "",
          full_name: profile?.full_name ?? "-",
          phone: "",
          role: "vendor",
          is_active: true,
          created_at: order.created_at
        },
        order_items: (order.order_items ?? []).map((item) => ({
          id: item.id,
          order_id: order.id,
          product_name: "",
          product_image: "",
          quantity: 0,
          price: 0,
          total: 0
        }))
      };
    })()
  }));

  return {
    success: true,
    data: orders,
    total: count ?? 0,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil((count ?? 0) / limit)),
    meta: {
      total: count ?? 0,
      page,
      limit,
      total_pages: Math.max(1, Math.ceil((count ?? 0) / limit)),
      has_next: page < Math.max(1, Math.ceil((count ?? 0) / limit)),
      has_prev: page > 1
    },
    summary
  };
}

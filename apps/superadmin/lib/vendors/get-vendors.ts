import type { PaginatedResponse } from "@/types/api";
import type { Vendor } from "@/types/vendor";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface GetVendorsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "suspended";
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

export async function getVendors(
  params: GetVendorsParams
): Promise<PaginatedResponse<Vendor>> {
  const supabase = getSupabaseAdminClient();
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = (params.search ?? "").trim();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("profiles")
    .select(
      "id,email,full_name,phone,role,is_active,created_at,stores(id,vendor_id,name,slug,status,is_published,total_products,total_orders,total_revenue,created_at)",
      { count: "exact" }
    )
    .eq("role", "vendor")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (params.status === "active") {
    query = query.eq("is_active", true);
  }

  if (params.status === "suspended") {
    query = query.eq("is_active", false);
  }

  const { data, count, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  const vendors = await Promise.all(
    (data ?? []).map(async (row) => {
      const vendorId = row.id;

      const [productsCountRes, ordersRes] = await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("vendor_id", vendorId),
        supabase.from("orders").select("total,commission").eq("vendor_id", vendorId)
      ]);

      const totalRevenue = (ordersRes.data ?? []).reduce(
        (sum, order) => sum + toNumber(order.total),
        0
      );
      const commissionEarned = (ordersRes.data ?? []).reduce(
        (sum, order) => sum + toNumber(order.commission),
        0
      );

      return {
        id: row.id,
        email: row.email,
        full_name: row.full_name,
        phone: row.phone,
        role: row.role,
        is_active: row.is_active,
        created_at: row.created_at,
        store: Array.isArray(row.stores) && row.stores.length > 0 ? row.stores[0] : undefined,
        total_products: productsCountRes.count ?? 0,
        total_orders: ordersRes.data?.length ?? 0,
        total_revenue: totalRevenue,
        commission_earned: commissionEarned
      } satisfies Vendor;
    })
  );

  return {
    success: true,
    data: vendors,
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
    }
  };
}

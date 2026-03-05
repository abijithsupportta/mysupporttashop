import type { Order } from "@/types/order";
import type { Vendor } from "@/types/vendor";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return 0;
}

export interface VendorDetailResult {
  vendor: Vendor;
  products: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    status: string;
    created_at: string;
  }>;
  orders: Order[];
  orders_total: number;
  orders_page: number;
  orders_limit: number;
  orders_total_pages: number;
}

export async function getVendorDetail(
  id: string,
  page = 1,
  limit = 10
): Promise<VendorDetailResult | null> {
  const supabase = getSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,phone,role,is_active,created_at,stores(id,vendor_id,name,slug,status,is_published,total_products,total_orders,total_revenue,created_at)"
    )
    .eq("id", id)
    .eq("role", "vendor")
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (!profile) {
    return null;
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const [productsRes, ordersRes, ordersCountRes, allOrdersRes] = await Promise.all([
    supabase
      .from("products")
      .select("id,name,price,stock,status,created_at")
      .eq("vendor_id", id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("orders")
      .select(
        "id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,order_items(id,order_id,product_name,product_image,quantity,price,total)"
      )
      .eq("vendor_id", id)
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("vendor_id", id),
    supabase.from("orders").select("total,commission").eq("vendor_id", id)
  ]);

  if (productsRes.error) {
    throw new Error(productsRes.error.message);
  }

  if (ordersRes.error) {
    throw new Error(ordersRes.error.message);
  }

  const totals = (allOrdersRes.data ?? []).reduce(
    (acc, item) => {
      acc.revenue += toNumber(item.total);
      acc.commission += toNumber(item.commission);
      return acc;
    },
    { revenue: 0, commission: 0 }
  );

  const vendor: Vendor = {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    phone: profile.phone,
    role: profile.role,
    is_active: profile.is_active,
    created_at: profile.created_at,
    store: Array.isArray(profile.stores) && profile.stores.length > 0 ? profile.stores[0] : undefined,
    total_products: productsRes.data?.length ?? 0,
    total_orders: ordersCountRes.count ?? 0,
    total_revenue: totals.revenue,
    commission_earned: totals.commission
  };

  const orders: Order[] = (ordersRes.data ?? []).map((order) => ({
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
    order_items: (order.order_items ?? []).map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_name: item.product_name,
      product_image: item.product_image,
      quantity: item.quantity,
      price: toNumber(item.price),
      total: toNumber(item.total)
    }))
  }));

  return {
    vendor,
    products: (productsRes.data ?? []).map((product) => ({
      id: product.id,
      name: product.name,
      price: toNumber(product.price),
      stock: product.stock,
      status: product.status,
      created_at: product.created_at
    })),
    orders,
    orders_total: ordersCountRes.count ?? 0,
    orders_page: page,
    orders_limit: limit,
    orders_total_pages: Math.ceil((ordersCountRes.count ?? 0) / limit)
  };
}

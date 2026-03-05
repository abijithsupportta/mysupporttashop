import type { Order } from "@/types/order";
import { toNumber } from "@/lib/utils/number";

interface StoreJoinRow {
  name: string;
  slug: string;
}

interface ProfileJoinRow {
  full_name: string;
  email: string;
}

interface OrderCountItemRow {
  id: string;
}

interface OrderRow {
  id: string;
  store_id: string;
  vendor_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number | string;
  commission: number | string;
  payment_status: Order["payment_status"];
  order_status: Order["order_status"];
  created_at: string;
  stores: StoreJoinRow[] | null;
  profiles: ProfileJoinRow[] | null;
  order_items: OrderCountItemRow[] | null;
}

export function toOrders(rows: OrderRow[]): Order[] {
  return rows.map((order) => {
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
  });
}

export function toOrdersSummary(rows: Array<{ total: number | string; commission: number | string }>) {
  return rows.reduce(
    (accumulator, item) => {
      accumulator.total_revenue += toNumber(item.total);
      accumulator.total_commission += toNumber(item.commission);
      return accumulator;
    },
    { total_revenue: 0, total_commission: 0 }
  );
}

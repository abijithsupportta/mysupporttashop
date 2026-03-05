import type { Order } from "@/types/order";
import type { Vendor } from "@/types/vendor";
import { toNumber } from "@/lib/utils/number";

interface DashboardOrderStoreRow {
  name: string;
}

interface DashboardOrderRow {
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
  stores: DashboardOrderStoreRow[] | null;
}

interface DashboardVendorStoreRow {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  status: string;
  is_published: boolean;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  created_at: string;
}

interface DashboardVendorRow {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  is_active: boolean;
  created_at: string;
  stores: DashboardVendorStoreRow[] | null;
}

export function toDashboardTotals(rows: Array<{ total: number | string; commission: number | string }>) {
  return rows.reduce(
    (accumulator, item) => {
      accumulator.totalRevenue += toNumber(item.total);
      accumulator.totalCommission += toNumber(item.commission);
      return accumulator;
    },
    { totalRevenue: 0, totalCommission: 0 }
  );
}

export function toDashboardRecentOrders(rows: DashboardOrderRow[]): Order[] {
  return rows.map((item) => ({
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
    store:
      Array.isArray(item.stores) && item.stores.length > 0
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
}

export function toDashboardRecentVendors(rows: DashboardVendorRow[]): Vendor[] {
  return rows.map((item) => ({
    id: item.id,
    email: item.email,
    full_name: item.full_name,
    phone: item.phone,
    role: item.role,
    is_active: item.is_active,
    created_at: item.created_at,
    store:
      Array.isArray(item.stores) && item.stores.length > 0
        ? {
            id: item.stores[0].id,
            vendor_id: item.stores[0].vendor_id,
            name: item.stores[0].name,
            slug: item.stores[0].slug,
            status: item.stores[0].status,
            is_published: item.stores[0].is_published,
            total_products: item.stores[0].total_products,
            total_orders: item.stores[0].total_orders,
            total_revenue: item.stores[0].total_revenue,
            created_at: item.stores[0].created_at
          }
        : undefined
  }));
}

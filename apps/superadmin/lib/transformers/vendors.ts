import type { Order } from "@/types/order";
import type { Vendor } from "@/types/vendor";
import { toNumber } from "@/lib/utils/number";

interface VendorStoreRow {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  district: string | null;
  pincode: string | null;
  status: string;
  is_published: boolean;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  created_at: string;
}

interface VendorProfileRow {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  owner_role?: "vendor_owner" | "shop_owner" | null;
  is_active: boolean;
  created_at: string;
  stores: VendorStoreRow[] | null;
}

interface ProductMiniRow {
  id: string;
  name: string;
  price: number | string;
  stock: number;
  status: string;
  created_at: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number | string;
  total: number | string;
}

interface VendorOrderRow {
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
  order_items: OrderItemRow[] | null;
}

export function toVendor(profile: VendorProfileRow): Vendor {
  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    phone: profile.phone,
    role: profile.role,
    owner_role: profile.owner_role ?? null,
    is_active: profile.is_active,
    created_at: profile.created_at,
    store:
      Array.isArray(profile.stores) && profile.stores.length > 0
        ? profile.stores[0]
        : undefined
  };
}

export function withVendorAggregates(
  profile: VendorProfileRow,
  productsCount: number,
  orderTotals: Array<{ total: number | string; commission: number | string }>
): Vendor {
  const revenue = orderTotals.reduce((sum, item) => sum + toNumber(item.total), 0);
  const commission = orderTotals.reduce(
    (sum, item) => sum + toNumber(item.commission),
    0
  );

  return {
    ...toVendor(profile),
    total_products: productsCount,
    total_orders: orderTotals.length,
    total_revenue: revenue,
    commission_earned: commission
  };
}

export function toVendorProducts(products: ProductMiniRow[]) {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    price: toNumber(product.price),
    stock: product.stock,
    status: product.status,
    created_at: product.created_at
  }));
}

export function toVendorOrders(orders: VendorOrderRow[]): Order[] {
  return orders.map((order) => ({
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
}

import type { Store } from "@/types/store";
import type { Vendor } from "@/types/vendor";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  store_id: string;
  vendor_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  commission: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
  store?: Store;
  vendor?: Vendor;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

import type { Order } from "@/types/order";
import type { Vendor } from "@/types/vendor";

export interface DashboardStats {
  total_vendors: number;
  total_orders: number;
  total_revenue: number;
  total_commission: number;
  new_vendors_this_month: number;
  new_orders_today: number;
  pending_orders: number;
  active_vendors: number;
  recent_orders: Order[];
  recent_vendors: Vendor[];
}

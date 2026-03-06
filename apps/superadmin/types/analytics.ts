export interface RevenuePoint {
  date: string;
  revenue: number;
  commission: number;
  orders: number;
}

export interface TopVendor {
  vendor_id: string;
  vendor_name: string;
  vendor_email: string;
  total_revenue: number;
  total_commission: number;
  total_orders: number;
}

import type { Store } from "@/types/store";

export type VendorOwnerRole = "vendor_owner" | "shop_owner";

export interface Vendor {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: string;
  owner_role?: VendorOwnerRole | null;
  is_active: boolean;
  created_at: string;
  store?: Store;
  total_products?: number;
  total_orders?: number;
  total_revenue?: number;
  commission_earned?: number;
}

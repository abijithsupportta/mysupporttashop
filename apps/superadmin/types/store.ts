export interface Store {
  id: string;
  vendor_id: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  district?: string | null;
  pincode?: string | null;
  status: string;
  is_published: boolean;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  created_at: string;
}

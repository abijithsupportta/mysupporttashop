import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Order } from "@/types/order";
import type { Vendor, VendorOwnerRole } from "@/types/vendor";
import {
  ensureApiSuccess,
  ensureSuccessPagination,
  ensureSuccessResponse,
  getJson,
  sendJson
} from "@/lib/services/client/api-client";

export interface VendorsParams {
  page: number;
  limit: number;
  search: string;
  status: "all" | "active" | "suspended";
}

export interface VendorDetailData {
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

export interface VendorCreatePayload {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  owner_role: VendorOwnerRole;
  is_active: boolean;
  store_name: string;
  logo_url: string;
  address: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
}

export interface VendorUpdatePayload {
  email?: string;
  full_name?: string;
  phone?: string;
  owner_role?: VendorOwnerRole;
  is_active?: boolean;
  store_name?: string;
  logo_url?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  pincode?: string;
}

export async function fetchVendors(params: VendorsParams): Promise<PaginatedResponse<Vendor>> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    search: params.search,
    status: params.status
  });

  const result = await getJson<PaginatedResponse<Vendor>>(`/api/vendors?${query.toString()}`);
  return ensureSuccessPagination(result);
}

export async function fetchVendorDetail(vendorId: string, page: number, limit: number) {
  const result = await getJson<ApiResponse<VendorDetailData>>(
    `/api/vendors/${vendorId}?page=${page}&limit=${limit}`
  );
  return ensureSuccessResponse(result);
}

export async function patchVendorStatus(vendorId: string, isActive: boolean) {
  const result = await sendJson<ApiResponse<Vendor>, { is_active: boolean }>(
    `/api/vendors/${vendorId}/status`,
    "PATCH",
    {
      is_active: isActive
    }
  );

  return ensureSuccessResponse(result);
}

export async function createVendor(payload: VendorCreatePayload) {
  const result = await sendJson<ApiResponse<Vendor>, VendorCreatePayload>(
    "/api/vendors",
    "POST",
    payload
  );
  return ensureSuccessResponse(result);
}

export async function updateVendor(vendorId: string, payload: VendorUpdatePayload) {
  const result = await sendJson<ApiResponse<Vendor>, VendorUpdatePayload>(
    `/api/vendors/${vendorId}`,
    "PATCH",
    payload
  );
  return ensureSuccessResponse(result);
}

export async function deleteVendor(vendorId: string) {
  const result = await sendJson<ApiResponse<null>, undefined>(
    `/api/vendors/${vendorId}`,
    "DELETE"
  );
  ensureApiSuccess(result);
}

import type { PaginatedResponse } from "@/types/api";
import type { Vendor } from "@/types/vendor";
import {
  createVendorAccount,
  createVendorProfile,
  createVendorStore,
  deleteVendorById,
  getVendorOrderTotals,
  getVendorOrders,
  getVendorProducts,
  listVendorProducts,
  getVendorProductsCount,
  getVendorProfile,
  listVendors,
  rollbackVendorAuthUser,
  rollbackVendorProfile,
  updateVendorProfileById,
  updateVendorStoreByVendorId,
  updateVendorStatusById
} from "@/lib/repositories/vendors-repository";
import { sendVendorCredentialsEmail } from "@/lib/services/server/vendor-email-service";
import {
  toVendor,
  toVendorOrders,
  toVendorProducts,
  withVendorAggregates
} from "@/lib/transformers/vendors";

export interface VendorsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "suspended";
}

export async function listVendorsService(
  params: VendorsListParams
): Promise<PaginatedResponse<Vendor>> {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;
  const search = (params.search ?? "").trim();
  const status = params.status ?? "all";

  const { rows, count } = await listVendors({ page, limit, search, status });
  const vendors = await Promise.all(
    rows.map(async (row: any) => {
      const [productsCountResult, totalsResult] = await Promise.allSettled([
        getVendorProductsCount(row.id),
        getVendorOrderTotals(row.id)
      ]);

      const productsCount =
        productsCountResult.status === "fulfilled" ? productsCountResult.value : 0;
      const totals = totalsResult.status === "fulfilled" ? totalsResult.value : [];

      return withVendorAggregates(row, productsCount, totals);
    })
  );

  return {
    success: true,
    data: vendors,
    total: count,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil(count / limit)),
    meta: {
      total: count,
      page,
      limit,
      total_pages: Math.max(1, Math.ceil(count / limit)),
      has_next: page < Math.max(1, Math.ceil(count / limit)),
      has_prev: page > 1
    }
  };
}

export async function getVendorDetailService(vendorId: string, page = 1, limit = 10) {
  const profile = await getVendorProfile(vendorId);
  if (!profile) {
    return null;
  }

  const [productsRows, orderTotalsRows, ordersResult, productsCount] = await Promise.all([
    getVendorProducts(vendorId),
    getVendorOrderTotals(vendorId),
    getVendorOrders(vendorId, page, limit),
    getVendorProductsCount(vendorId)
  ]);

  return {
    vendor: withVendorAggregates(profile, productsCount, orderTotalsRows),
    products: toVendorProducts(productsRows),
    orders: toVendorOrders(ordersResult.rows),
    orders_total: ordersResult.totalCount,
    orders_page: page,
    orders_limit: limit,
    orders_total_pages: Math.ceil(ordersResult.totalCount / limit)
  };
}

export async function updateVendorStatusService(vendorId: string, isActive: boolean) {
  return updateVendorStatusById(vendorId, isActive);
}

export async function updateVendorProfileService(
  vendorId: string,
  payload: {
    full_name?: string;
    phone?: string;
    is_active?: boolean;
    email?: string;
    owner_role?: "vendor_owner" | "shop_owner";
    store_name?: string;
    logo_url?: string;
    address?: string;
    city?: string;
    state?: string;
    district?: string;
    pincode?: string;
  }
) {
  const profile = await updateVendorProfileById(vendorId, {
    full_name: payload.full_name,
    phone: payload.phone,
    is_active: payload.is_active,
    email: payload.email,
    owner_role: payload.owner_role
  });

  await updateVendorStoreByVendorId(vendorId, {
    store_name: payload.store_name,
    logo_url: payload.logo_url,
    address: payload.address,
    city: payload.city,
    state: payload.state,
    district: payload.district,
    pincode: payload.pincode
  });

  return profile;
}

export async function deleteVendorService(vendorId: string) {
  await deleteVendorById(vendorId);
}

export async function createVendorService(payload: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  owner_role: "vendor_owner" | "shop_owner";
  is_active: boolean;
  store_name: string;
  slug?: string;
  description: string;
  logo_url: string;
  banner_url: string;
  address: string;
  city: string;
  state: string;
  district: string;
  pincode: string;
  theme_id: string;
  primary_color: string;
}) {
  const generatedSlug =
    payload.slug?.trim() ||
    `${payload.store_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")}-${Math.random().toString(36).slice(2, 7)}`;

  const authUser = await createVendorAccount({ email: payload.email, password: payload.password });

  try {
    await createVendorProfile({
      id: authUser.id,
      email: payload.email,
      full_name: payload.full_name,
      phone: payload.phone,
      is_active: payload.is_active,
      owner_role: payload.owner_role,
      logo_url: payload.logo_url
    });
  } catch (error) {
    await rollbackVendorAuthUser(authUser.id);
    throw error;
  }

  try {
    await createVendorStore({
      vendor_id: authUser.id,
      name: payload.store_name,
      slug: generatedSlug,
      description: payload.description,
      logo_url: payload.logo_url,
      banner_url: payload.banner_url,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      district: payload.district,
      pincode: payload.pincode,
      theme_id: payload.theme_id,
      primary_color: payload.primary_color,
      status: payload.is_active ? "active" : "suspended"
    });
  } catch (error) {
    await rollbackVendorProfile(authUser.id);
    await rollbackVendorAuthUser(authUser.id);
    throw error;
  }

  try {
    await sendVendorCredentialsEmail({
      to: payload.email,
      vendorOwnerName: payload.full_name,
      storeName: payload.store_name,
      email: payload.email,
      password: payload.password
    });
  } catch (error) {
    try {
      await deleteVendorById(authUser.id);
    } catch (rollbackError) {
      const emailMessage = error instanceof Error ? error.message : "Unknown email error";
      const rollbackMessage =
        rollbackError instanceof Error ? rollbackError.message : "Unknown rollback error";
      throw new Error(
        `Vendor onboarding email failed and rollback failed. Email: ${emailMessage}. Rollback: ${rollbackMessage}`
      );
    }

    const emailMessage =
      error instanceof Error ? error.message : "Failed to send vendor onboarding email";
    throw new Error(`Vendor onboarding email failed. Vendor creation rolled back. ${emailMessage}`);
  }

  return toVendor({
    id: authUser.id,
    email: payload.email,
    full_name: payload.full_name,
    phone: payload.phone,
    role: "vendor",
    owner_role: payload.owner_role,
    is_active: payload.is_active,
    created_at: new Date().toISOString(),
    stores: null
  });
}

export async function listVendorProductsService(
  vendorId: string,
  page: number,
  limit: number,
  search = ""
) {
  const result = await listVendorProducts(vendorId, page, limit, search);

  return {
    data: toVendorProducts(result.rows),
    total: result.totalCount,
    page,
    limit,
    total_pages: Math.max(1, Math.ceil(result.totalCount / limit))
  };
}

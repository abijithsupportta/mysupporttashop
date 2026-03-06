import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export interface VendorListQuery {
  page: number;
  limit: number;
  search: string;
  status: "all" | "active" | "suspended";
}

function isMissingOwnerRoleColumnError(message: string): boolean {
  const normalized = message.toLowerCase();
  if (!normalized.includes("owner_role")) {
    return false;
  }

  return (
    normalized.includes("does not exist") ||
    normalized.includes("schema cache") ||
    normalized.includes("could not find") ||
    normalized.includes("column")
  );
}

export async function listVendors(query: VendorListQuery) {
  const supabase = getSupabaseAdminClient();
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let statement = supabase
    .from("profiles")
    .select(
      "id,email,full_name,phone,role,owner_role,is_active,created_at,stores(*)",
      { count: "exact" }
    )
    .eq("role", "vendor")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query.search) {
    statement = statement.or(`full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`);
  }

  if (query.status === "active") {
    statement = statement.eq("is_active", true);
  }

  if (query.status === "suspended") {
    statement = statement.eq("is_active", false);
  }

  let response: any = await statement;
  if (response.error && isMissingOwnerRoleColumnError(response.error.message)) {
    let fallbackStatement = supabase
      .from("profiles")
      .select("id,email,full_name,phone,role,is_active,created_at,stores(*)", {
        count: "exact"
      })
      .eq("role", "vendor")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (query.search) {
      fallbackStatement = fallbackStatement.or(
        `full_name.ilike.%${query.search}%,email.ilike.%${query.search}%`
      );
    }

    if (query.status === "active") {
      fallbackStatement = fallbackStatement.eq("is_active", true);
    }

    if (query.status === "suspended") {
      fallbackStatement = fallbackStatement.eq("is_active", false);
    }

    response = await fallbackStatement;
  }

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    rows: response.data ?? [],
    count: response.count ?? 0
  };
}

export async function getVendorOrderTotals(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  const response = await supabase
    .from("orders")
    .select("total,commission")
    .eq("vendor_id", vendorId);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data ?? [];
}

export async function getVendorProductsCount(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  const response = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", vendorId);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.count ?? 0;
}

export async function getVendorProfile(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  let response: any = await supabase
    .from("profiles")
    .select(
      "id,email,full_name,phone,role,owner_role,is_active,created_at,stores(*)"
    )
    .eq("id", vendorId)
    .eq("role", "vendor")
    .maybeSingle();

  if (response.error && isMissingOwnerRoleColumnError(response.error.message)) {
    response = await supabase
      .from("profiles")
      .select("id,email,full_name,phone,role,is_active,created_at,stores(*)")
      .eq("id", vendorId)
      .eq("role", "vendor")
      .maybeSingle();
  }

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function getVendorProducts(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  const response = await supabase
    .from("products")
    .select("id,name,price,stock,status,created_at")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data ?? [];
}

export async function listVendorProducts(
  vendorId: string,
  page: number,
  limit: number,
  search = ""
) {
  const supabase = getSupabaseAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let statement = supabase
    .from("products")
    .select("id,name,price,stock,status,created_at", { count: "exact" })
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    statement = statement.ilike("name", `%${search.trim()}%`);
  }

  const response = await statement;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    rows: response.data ?? [],
    totalCount: response.count ?? 0
  };
}

export async function getVendorOrders(vendorId: string, page: number, limit: number) {
  const supabase = getSupabaseAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const [ordersRes, countRes] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id,store_id,vendor_id,customer_name,customer_email,customer_phone,total,commission,payment_status,order_status,created_at,order_items(id,order_id,product_name,product_image,quantity,price,total)"
      )
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("vendor_id", vendorId)
  ]);

  if (ordersRes.error) {
    throw new Error(ordersRes.error.message);
  }

  if (countRes.error) {
    throw new Error(countRes.error.message);
  }

  return {
    rows: ordersRes.data ?? [],
    totalCount: countRes.count ?? 0
  };
}

export async function updateVendorStatusById(vendorId: string, isActive: boolean) {
  const supabase = getSupabaseAdminClient();
  let profileRes: any = await supabase
    .from("profiles")
    .update({ is_active: isActive })
    .eq("id", vendorId)
    .eq("role", "vendor")
    .select("id,email,full_name,phone,role,owner_role,is_active,created_at")
    .single();

  if (profileRes.error && isMissingOwnerRoleColumnError(profileRes.error.message)) {
    profileRes = await supabase
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", vendorId)
      .eq("role", "vendor")
      .select("id,email,full_name,phone,role,is_active,created_at")
      .single();
  }

  if (profileRes.error) {
    throw new Error(profileRes.error.message);
  }

  const targetStoreStatus = isActive ? "active" : "suspended";
  const storeRes = await supabase
    .from("stores")
    .update({ status: targetStoreStatus })
    .eq("vendor_id", vendorId);

  if (storeRes.error) {
    throw new Error(storeRes.error.message);
  }

  return profileRes.data;
}

export async function updateVendorProfileById(
  vendorId: string,
  payload: {
    full_name?: string;
    phone?: string;
    is_active?: boolean;
    email?: string;
    owner_role?: "vendor_owner" | "shop_owner";
  }
) {
  const supabase = getSupabaseAdminClient();
  let response: any = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", vendorId)
    .eq("role", "vendor")
    .select("id,email,full_name,phone,role,owner_role,is_active,created_at")
    .single();

  if (response.error && isMissingOwnerRoleColumnError(response.error.message)) {
    const { owner_role: _ignoredOwnerRole, ...fallbackPayload } = payload;
    response = await supabase
      .from("profiles")
      .update(fallbackPayload)
      .eq("id", vendorId)
      .eq("role", "vendor")
      .select("id,email,full_name,phone,role,is_active,created_at")
      .single();
  }

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function deleteVendorById(vendorId: string) {
  const supabase = getSupabaseAdminClient();

  const authDeleteRes = await supabase.auth.admin.deleteUser(vendorId);
  if (authDeleteRes.error) {
    const message = authDeleteRes.error.message.toLowerCase();
    const isUserMissing =
      message.includes("user not found") ||
      message.includes("not found") ||
      message.includes("does not exist");

    if (!isUserMissing) {
      throw new Error(authDeleteRes.error.message);
    }
  }

  const storeDeleteRes = await supabase.from("stores").delete().eq("vendor_id", vendorId);
  if (storeDeleteRes.error) {
    throw new Error(storeDeleteRes.error.message);
  }

  const profileDeleteRes = await supabase.from("profiles").delete().eq("id", vendorId);
  if (profileDeleteRes.error) {
    throw new Error(profileDeleteRes.error.message);
  }
}

export async function createVendorAccount(payload: { email: string; password: string }) {
  const supabase = getSupabaseAdminClient();
  const response = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: true
  });

  if (response.error || !response.data.user) {
    throw new Error(response.error?.message ?? "Failed to create auth user");
  }

  return response.data.user;
}

export async function rollbackVendorAuthUser(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  await supabase.auth.admin.deleteUser(vendorId);
}

export async function createVendorProfile(payload: {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  is_active: boolean;
  owner_role: "vendor_owner" | "shop_owner";
  logo_url: string;
}) {
  const supabase = getSupabaseAdminClient();
  let response: any = await supabase.from("profiles").insert({
    id: payload.id,
    email: payload.email,
    full_name: payload.full_name,
    phone: payload.phone,
    role: "vendor",
    owner_role: payload.owner_role,
    avatar_url: payload.logo_url,
    is_active: payload.is_active
  });

  if (response.error && isMissingOwnerRoleColumnError(response.error.message)) {
    response = await supabase.from("profiles").insert({
      id: payload.id,
      email: payload.email,
      full_name: payload.full_name,
      phone: payload.phone,
      role: "vendor",
      avatar_url: payload.logo_url,
      is_active: payload.is_active
    });
  }

  if (response.error) {
    throw new Error(response.error.message);
  }
}

export async function rollbackVendorProfile(vendorId: string) {
  const supabase = getSupabaseAdminClient();
  await supabase.from("profiles").delete().eq("id", vendorId);
}

export async function createVendorStore(payload: {
  vendor_id: string;
  name: string;
  slug: string;
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
  status: string;
}) {
  const supabase = getSupabaseAdminClient();
  const fullInsertPayload = {
    vendor_id: payload.vendor_id,
    name: payload.name,
    slug: payload.slug,
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
    status: payload.status,
    is_published: false,
    total_products: 0,
    total_orders: 0,
    total_revenue: 0
  };

  const response = await supabase.from("stores").insert(fullInsertPayload);

  if (response.error) {
    const message = response.error.message.toLowerCase();
    const hasMissingColumnError =
      message.includes("column") && message.includes("does not exist");

    if (!hasMissingColumnError) {
      throw new Error(response.error.message);
    }

    const fallbackResponse = await supabase.from("stores").insert({
      vendor_id: payload.vendor_id,
      name: payload.name,
      slug: payload.slug,
      description: payload.description,
      logo_url: payload.logo_url,
      banner_url: payload.banner_url,
      theme_id: payload.theme_id,
      primary_color: payload.primary_color,
      status: payload.status,
      is_published: false,
      total_products: 0,
      total_orders: 0,
      total_revenue: 0
    });

    if (fallbackResponse.error) {
      throw new Error(fallbackResponse.error.message);
    }
  }
}

export async function updateVendorStoreByVendorId(
  vendorId: string,
  payload: {
    store_name?: string;
    logo_url?: string;
    address?: string;
    city?: string;
    state?: string;
    district?: string;
    pincode?: string;
  }
) {
  const supabase = getSupabaseAdminClient();
  const updatePayload: {
    name?: string;
    logo_url?: string;
    address?: string;
    city?: string;
    state?: string;
    district?: string;
    pincode?: string;
  } = {};

  if (payload.store_name !== undefined) {
    updatePayload.name = payload.store_name;
  }

  if (payload.logo_url !== undefined) {
    updatePayload.logo_url = payload.logo_url;
  }

  if (payload.address !== undefined) {
    updatePayload.address = payload.address;
  }

  if (payload.city !== undefined) {
    updatePayload.city = payload.city;
  }

  if (payload.state !== undefined) {
    updatePayload.state = payload.state;
  }

  if (payload.district !== undefined) {
    updatePayload.district = payload.district;
  }

  if (payload.pincode !== undefined) {
    updatePayload.pincode = payload.pincode;
  }

  if (Object.keys(updatePayload).length === 0) {
    return;
  }

  const response = await supabase
    .from("stores")
    .update(updatePayload)
    .eq("vendor_id", vendorId);

  if (response.error) {
    const message = response.error.message.toLowerCase();
    const hasMissingColumnError =
      message.includes("column") && message.includes("does not exist");

    if (!hasMissingColumnError) {
      throw new Error(response.error.message);
    }

    const fallbackPayload: {
      name?: string;
      logo_url?: string;
    } = {};

    if (payload.store_name !== undefined) {
      fallbackPayload.name = payload.store_name;
    }

    if (payload.logo_url !== undefined) {
      fallbackPayload.logo_url = payload.logo_url;
    }

    if (Object.keys(fallbackPayload).length === 0) {
      return;
    }

    const fallbackResponse = await supabase
      .from("stores")
      .update(fallbackPayload)
      .eq("vendor_id", vendorId);

    if (fallbackResponse.error) {
      throw new Error(fallbackResponse.error.message);
    }
  }
}

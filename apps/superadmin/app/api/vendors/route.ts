import { NextRequest } from "next/server";
import { z } from "zod";
import {
  createVendorService,
  listVendorsService
} from "@/lib/services/server/vendors-service";
import { apiHandler } from "@/lib/api/api-handler";
import { paginatedResponse, successResponse } from "@/lib/api/api-response";
import { parseJsonBody, parseQuery } from "@/lib/api/validation";
import { paginationSchema } from "@/lib/api/pagination";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { logAuditEvent } from "@/lib/api/audit-logger";

const createVendorSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(2),
  phone: z.string().min(6),
  owner_role: z.enum(["vendor_owner", "shop_owner"]).default("vendor_owner"),
  is_active: z.boolean().default(true),
  store_name: z.string().min(2),
  slug: z.string().min(2).optional(),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  district: z.string().min(2),
  pincode: z.string().min(4),
  description: z.string().optional().default(""),
  logo_url: z.string().url().or(z.literal("")).optional().default(""),
  banner_url: z.string().url().or(z.literal("")).optional().default(""),
  theme_id: z.string().optional().default("default"),
  primary_color: z.string().optional().default("#e85d2f")
});

const vendorsQuerySchema = paginationSchema.extend({
  status: z.enum(["all", "active", "suspended"]).optional().default("all")
});

export const GET = apiHandler(
  withSuperadminAuth(async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);
    const query = parseQuery(vendorsQuerySchema, searchParams);

    const result = await listVendorsService({
      page: query.page,
      limit: query.limit,
      search: query.search,
      status: query.status
    });

    return paginatedResponse(result.data, result.meta, 200, {
      sort_by: query.sort_by,
      sort_order: query.sort_order
    });
  })
);

export const POST = apiHandler(
  withSuperadminAuth(async (request: NextRequest, _context, auth) => {
    const payload = await parseJsonBody(request, createVendorSchema);
    const createdVendor = await createVendorService({
      ...payload,
      owner_role: payload.owner_role ?? "vendor_owner",
      is_active: payload.is_active ?? true,
      description: payload.description ?? "",
      logo_url: payload.logo_url ?? "",
      banner_url: payload.banner_url ?? "",
      address: payload.address,
      city: payload.city,
      state: payload.state,
      district: payload.district,
      pincode: payload.pincode,
      theme_id: payload.theme_id ?? "default",
      primary_color: payload.primary_color ?? "#e85d2f"
    });

    await logAuditEvent({
      actor_user_id: auth.userId,
      actor_email: auth.email,
      action: "vendor.created",
      resource_type: "vendor",
      resource_id: createdVendor.id,
      metadata: { email: createdVendor.email }
    });

    return successResponse(createdVendor, 200);
  })
);

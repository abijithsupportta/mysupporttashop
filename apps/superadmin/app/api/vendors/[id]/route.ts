import { NextRequest } from "next/server";
import { z } from "zod";
import {
  deleteVendorService,
  getVendorDetailService,
  updateVendorProfileService
} from "@/lib/services/server/vendors-service";
import { ApiError } from "@/lib/api/error";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { parseJsonBody, parseQuery } from "@/lib/api/validation";
import { paginationSchema } from "@/lib/api/pagination";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { logAuditEvent } from "@/lib/api/audit-logger";

const updateVendorSchema = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().min(6).optional(),
  is_active: z.boolean().optional(),
  owner_role: z.enum(["vendor_owner", "shop_owner"]).optional(),
  email: z.string().email().optional(),
  store_name: z.string().min(2).optional(),
  logo_url: z.string().url().or(z.literal("")).optional(),
  address: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  district: z.string().min(2).optional(),
  pincode: z.string().min(4).optional()
});

const detailQuerySchema = paginationSchema.pick({ page: true, limit: true });

export const GET = apiHandler(
  withSuperadminAuth(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
    const { searchParams } = new URL(request.url);
    const query = parseQuery(detailQuerySchema, searchParams);
    const { id } = await params;
    const detail = await getVendorDetailService(id, query.page, query.limit);

    if (!detail) {
      throw new ApiError("Vendor not found", 404);
    }

    return successResponse(detail, 200);
  })
);

export const PATCH = apiHandler(
  withSuperadminAuth(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> },
      auth
    ) => {
    const { id } = await params;
    const payload = await parseJsonBody(request, updateVendorSchema);
    const data = await updateVendorProfileService(id, payload);

      await logAuditEvent({
        actor_user_id: auth.userId,
        actor_email: auth.email,
        action: "vendor.updated",
        resource_type: "vendor",
        resource_id: id,
        metadata: { fields: Object.keys(payload) }
      });

    return successResponse(data, 200);
  })
);

export const DELETE = apiHandler(
  withSuperadminAuth(
    async (
      _request: NextRequest,
      { params }: { params: Promise<{ id: string }> },
      auth
    ) => {
    const { id } = await params;
    await deleteVendorService(id);

      await logAuditEvent({
        actor_user_id: auth.userId,
        actor_email: auth.email,
        action: "vendor.deleted",
        resource_type: "vendor",
        resource_id: id
      });

    return successResponse({ message: "Vendor deleted" }, 200);
  })
);

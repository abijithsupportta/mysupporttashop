import { NextResponse } from "next/server";
import { z } from "zod";
import {
  deleteVendorService,
  getVendorDetailService,
  updateVendorProfileService
} from "@/lib/services/server/vendors-service";
import type { ApiResponse } from "@/types/api";

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const { id } = await params;
    const detail = await getVendorDetailService(id, page, limit);

    if (!detail) {
      const response: ApiResponse<null> = {
        success: false,
        error: "Vendor not found"
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<typeof detail> = {
      success: true,
      data: detail
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/vendors/[id]", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const payload = updateVendorSchema.parse(body);
    const data = await updateVendorProfileService(id, payload);

    const response: ApiResponse<typeof data> = {
      success: true,
      data
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("PATCH /api/vendors/[id]", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteVendorService(id);

    const response: ApiResponse<null> = {
      success: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("DELETE /api/vendors/[id]", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 400 });
  }
}

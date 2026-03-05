import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createVendorService,
  listVendorsService
} from "@/lib/services/server/vendors-service";
import type { ApiResponse } from "@/types/api";
import type { Vendor } from "@/types/vendor";

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");
    const search = searchParams.get("search") ?? "";
    const status = (searchParams.get("status") as "all" | "active" | "suspended" | null) ?? "all";

    const result = await listVendorsService({ page, limit, search, status });
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/vendors", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = { success: false, error: message };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createVendorSchema.parse(body);
    const createdVendor: Vendor = await createVendorService({
      ...payload,
      owner_role: payload.owner_role,
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

    const response: ApiResponse<Vendor> = {
      success: true,
      data: createdVendor
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/vendors", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = { success: false, error: message };
    return NextResponse.json(response, { status: 400 });
  }
}

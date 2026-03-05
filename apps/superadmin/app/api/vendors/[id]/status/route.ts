import { NextResponse } from "next/server";
import { z } from "zod";
import { updateVendorStatusService } from "@/lib/services/server/vendors-service";
import type { ApiResponse } from "@/types/api";

const schema = z.object({
  is_active: z.boolean()
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_active } = schema.parse(body);

    const updated = await updateVendorStatusService(id, is_active);

    const response: ApiResponse<typeof updated> = {
      success: true,
      data: updated
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("PATCH /api/vendors/[id]/status", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 400 });
  }
}

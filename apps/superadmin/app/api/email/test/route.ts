import { NextResponse } from "next/server";
import { sendResendTestEmail } from "@/lib/services/server/vendor-email-service";
import type { ApiResponse } from "@/types/api";

export async function POST() {
  try {
    const result = await sendResendTestEmail("info@abijithcb.com");

    const response: ApiResponse<{ to: string; message: string }> = {
      success: true,
      data: {
        to: result.to,
        message: "Test email sent successfully"
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/email/test", error);
    const message = error instanceof Error ? error.message : "Failed to send test email";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };

    return NextResponse.json(response, { status: 500 });
  }
}

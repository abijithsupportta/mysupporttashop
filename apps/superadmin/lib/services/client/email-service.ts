import type { ApiResponse } from "@/types/api";
import { ensureSuccessResponse, sendJson } from "@/lib/services/client/api-client";

export async function sendTestEmail() {
  const result = await sendJson<
    ApiResponse<{ to: string; message: string }>,
    undefined
  >("/api/email/test", "POST");

  return ensureSuccessResponse(result);
}

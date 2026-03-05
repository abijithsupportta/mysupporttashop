import type { ApiResponse } from "@/types/api";
import { sendJson } from "@/lib/services/client/api-client";

export async function logoutUser() {
  await sendJson<ApiResponse<null>, undefined>("/api/auth/logout", "POST");
}

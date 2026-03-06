import type { ApiResponse } from "@/types/api";
import type { DashboardStats } from "@/types/dashboard";
import { ensureSuccessResponse, getJson } from "@/lib/services/client/api-client";

export async function fetchDashboardStats() {
  const result = await getJson<ApiResponse<DashboardStats>>("/api/v1/dashboard");
  return ensureSuccessResponse(result);
}

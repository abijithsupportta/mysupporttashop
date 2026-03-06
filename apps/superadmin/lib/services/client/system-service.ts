import { getJson } from "@/lib/services/client/api-client";
import type { ApiResponse } from "@/types/api";

export interface SystemHealth {
  status: string;
  version: string;
  environment: string;
}

export async function fetchSystemHealth() {
  const result = await getJson<ApiResponse<SystemHealth>>("/api/v1/health");

  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Failed to fetch health");
  }

  return result.data;
}

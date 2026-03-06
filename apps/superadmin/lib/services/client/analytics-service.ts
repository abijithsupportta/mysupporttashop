import { getJson } from "@/lib/services/client/api-client";
import type { ApiResponse } from "@/types/api";
import type { RevenuePoint, TopVendor } from "@/types/analytics";

interface RevenueResponse {
  days: number;
  points: RevenuePoint[];
}

interface TopVendorsResponse {
  limit: number;
  vendors: TopVendor[];
}

export async function fetchRevenueAnalytics(days = 30) {
  const result = await getJson<ApiResponse<RevenueResponse>>(
    `/api/v1/analytics/revenue?days=${days}`
  );

  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Failed to fetch revenue analytics");
  }

  return result.data;
}

export async function fetchTopVendors(limit = 10) {
  const result = await getJson<ApiResponse<TopVendorsResponse>>(
    `/api/v1/analytics/vendors/top?limit=${limit}`
  );

  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Failed to fetch top vendors");
  }

  return result.data;
}

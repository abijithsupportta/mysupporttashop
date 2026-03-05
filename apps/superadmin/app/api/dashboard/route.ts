import { NextResponse } from "next/server";
import { getDashboardStatsService } from "@/lib/services/server/dashboard-service";
import type { ApiResponse } from "@/types/api";
import type { DashboardStats } from "@/types/dashboard";

export async function GET() {
  try {
    const stats = await getDashboardStatsService();
    const response: ApiResponse<DashboardStats> = {
      success: true,
      data: stats
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("GET /api/dashboard", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 500 });
  }
}

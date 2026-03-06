import { NextRequest } from "next/server";
import { getDashboardStatsService } from "@/lib/services/server/dashboard-service";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { withSuperadminAuth } from "@/lib/api/with-auth";

export const GET = apiHandler(
  withSuperadminAuth(async (_request: NextRequest) => {
    const stats = await getDashboardStatsService();
    return successResponse(stats, 200);
  })
);

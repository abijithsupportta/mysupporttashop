import { NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { parseQuery } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { getRevenueAnalyticsService } from "@/lib/services/server/analytics-service";

const schema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30)
});

export const GET = apiHandler(
  withSuperadminAuth(async (request: NextRequest) => {
    const query = parseQuery(schema, new URL(request.url).searchParams);
    const days = query.days ?? 30;
    const data = await getRevenueAnalyticsService(days);
    return successResponse({ days, points: data }, 200);
  })
);

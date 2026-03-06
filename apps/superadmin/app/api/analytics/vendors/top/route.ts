import { NextRequest } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { parseQuery } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { getTopVendorsService } from "@/lib/services/server/analytics-service";

const schema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10)
});

export const GET = apiHandler(
  withSuperadminAuth(async (request: NextRequest) => {
    const query = parseQuery(schema, new URL(request.url).searchParams);
    const limit = query.limit ?? 10;
    const data = await getTopVendorsService(limit);
    return successResponse({ limit, vendors: data }, 200);
  })
);

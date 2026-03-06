import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { paginatedResponse } from "@/lib/api/api-response";
import { paginationSchema, toPaginationMeta } from "@/lib/api/pagination";
import { parseQuery } from "@/lib/api/validation";
import { withSuperadminAuth } from "@/lib/api/with-auth";
import { listVendorProductsService } from "@/lib/services/server/vendors-service";

export const GET = apiHandler(
  withSuperadminAuth(
    async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      const query = parseQuery(paginationSchema, new URL(request.url).searchParams);
      const result = await listVendorProductsService(
        id,
        query.page ?? 1,
        query.limit ?? 10,
        query.search ?? ""
      );
      const meta = toPaginationMeta(result.total, result.page, result.limit);

      return paginatedResponse(result.data, meta, 200, {
        sort_by: query.sort_by,
        sort_order: query.sort_order
      });
    }
  )
);

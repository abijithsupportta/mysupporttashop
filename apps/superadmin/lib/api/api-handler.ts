import { NextRequest, NextResponse } from "next/server";
import { ApiError, getErrorMessage } from "@/lib/api/error";
import { errorResponse } from "@/lib/api/api-response";

type Handler<TContext = unknown> = (
  request: NextRequest,
  context: TContext
) => Promise<NextResponse>;

export function apiHandler<TContext = unknown>(handler: Handler<TContext>) {
  return async (request: NextRequest, context: TContext): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error(`[API Error] ${request.method} ${request.url}`, error);

      if (error instanceof ApiError) {
        return errorResponse(error.message, error.status, error.details);
      }

      const code = (error as { code?: string } | null)?.code;

      if (code === "PGRST116") {
        return errorResponse("Resource not found", 404);
      }

      if (code === "23505") {
        return errorResponse("Already exists", 409);
      }

      return errorResponse(getErrorMessage(error), 500);
    }
  };
}

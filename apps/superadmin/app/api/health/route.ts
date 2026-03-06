import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";

export const GET = apiHandler(async (_request: NextRequest) => {
  return successResponse({
    status: "healthy",
    version: "1.0.0",
    environment: process.env.NODE_ENV ?? "unknown"
  });
});

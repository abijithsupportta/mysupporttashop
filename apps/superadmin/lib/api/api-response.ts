import { NextResponse } from "next/server";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

export function paginatedResponse<T>(
  data: T[],
  meta: PaginationMeta,
  status = 200,
  extra?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
      ...(extra ?? {}),
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

export function errorResponse(error: string, status = 500, details?: unknown) {
  return NextResponse.json(
    {
      success: false,
      error,
      details: details ?? null,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

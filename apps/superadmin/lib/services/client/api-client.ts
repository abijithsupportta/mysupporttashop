import type { ApiResponse, PaginatedResponse } from "@/types/api";

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const result = (await response.json()) as T;

  if (!response.ok) {
    if (typeof result === "object" && result && "error" in result) {
      throw new Error(String(result.error ?? "Request failed"));
    }

    throw new Error("Request failed");
  }

  return result;
}

export async function sendJson<TResponse, TBody>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: TBody
): Promise<TResponse> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  const result = (await response.json()) as TResponse;

  if (!response.ok) {
    if (typeof result === "object" && result && "error" in result) {
      throw new Error(String(result.error ?? "Request failed"));
    }

    throw new Error("Request failed");
  }

  return result;
}

export function ensureSuccessResponse<T>(result: ApiResponse<T>): T {
  if (!result.success || !result.data) {
    throw new Error(result.error ?? "Request failed");
  }

  return result.data;
}

export function ensureApiSuccess(result: ApiResponse<unknown>): void {
  if (!result.success) {
    throw new Error(result.error ?? "Request failed");
  }
}

export function ensureSuccessPagination<T>(result: PaginatedResponse<T>): PaginatedResponse<T> {
  if (!result.success) {
    throw new Error("Request failed");
  }

  if (!result.meta) {
    result.meta = {
      total: result.total ?? 0,
      page: result.page ?? 1,
      limit: result.limit ?? 10,
      total_pages: result.total_pages ?? 1,
      has_next: (result.page ?? 1) < (result.total_pages ?? 1),
      has_prev: (result.page ?? 1) > 1
    };
  }

  return result;
}

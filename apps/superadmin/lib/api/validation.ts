import { ZodSchema } from "zod";
import { ApiError } from "@/lib/api/error";

export async function parseJsonBody<T>(
  request: Request,
  schema: ZodSchema<T>,
  maxBytes = 1024 * 1024
): Promise<T> {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > maxBytes) {
    throw new ApiError("Payload too large", 413);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("Validation failed", 400, {
      field_errors: parsed.error.flatten().fieldErrors
    });
  }

  return parsed.data;
}

export function parseQuery<T>(schema: ZodSchema<T>, searchParams: URLSearchParams): T {
  const queryObject = Object.fromEntries(searchParams.entries());
  const parsed = schema.safeParse(queryObject);

  if (!parsed.success) {
    throw new ApiError("Validation failed", 400, {
      field_errors: parsed.error.flatten().fieldErrors
    });
  }

  return parsed.data;
}

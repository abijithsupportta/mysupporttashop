import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/api-response";

interface Bucket {
  count: number;
  windowStart: number;
  blockedUntil: number;
}

const buckets = new Map<string, Bucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitOptions {
  keyPrefix: string;
  limit: number;
  windowMs: number;
  blockMs?: number;
}

export function assertRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const now = Date.now();
  const ip = getClientIp(request);
  const key = `${options.keyPrefix}:${ip}`;
  const existing = buckets.get(key);

  if (!existing) {
    buckets.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
    return null;
  }

  if (existing.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((existing.blockedUntil - now) / 1000);
    return errorResponse("Too many requests", 429, { retry_after_seconds: retryAfterSeconds });
  }

  if (now - existing.windowStart >= options.windowMs) {
    existing.count = 1;
    existing.windowStart = now;
    existing.blockedUntil = 0;
    buckets.set(key, existing);
    return null;
  }

  existing.count += 1;

  if (existing.count > options.limit) {
    existing.blockedUntil = now + (options.blockMs ?? options.windowMs);
    buckets.set(key, existing);

    const retryAfterSeconds = Math.ceil((existing.blockedUntil - now) / 1000);
    return errorResponse("Too many requests", 429, { retry_after_seconds: retryAfterSeconds });
  }

  buckets.set(key, existing);
  return null;
}

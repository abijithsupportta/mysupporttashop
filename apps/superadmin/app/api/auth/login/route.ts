import { NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { apiHandler } from "@/lib/api/api-handler";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import { parseJsonBody } from "@/lib/api/validation";
import { assertRateLimit } from "@/lib/api/rate-limit";
import { logAuditEvent } from "@/lib/api/audit-logger";

const defaultSuperadminEmail =
  process.env.SUPERADMIN_EMAIL ?? "info@supporttasolutions.com";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const POST = apiHandler(async (request: NextRequest) => {
    const rateLimitResponse = assertRateLimit(request, {
      keyPrefix: "auth-login",
      limit: 10,
      windowMs: 60_000,
      blockMs: 5 * 60_000
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const { email, password } = await parseJsonBody(request, schema);
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      return errorResponse(error?.message ?? "Invalid email or password", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    const allowByEmail =
      data.user.email?.toLowerCase() === defaultSuperadminEmail.toLowerCase();

    if ((profileError || profile?.role !== "superadmin") && !allowByEmail) {
      await supabase.auth.signOut();
      return errorResponse("Forbidden", 403);
    }

    await logAuditEvent({
      actor_user_id: data.user.id,
      actor_email: data.user.email,
      action: "auth.login",
      resource_type: "session",
      resource_id: data.user.id
    });

    return successResponse(
      {
        user: {
          id: data.user.id,
          email: data.user.email
        }
      },
      200
    );
});

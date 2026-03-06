import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { errorResponse } from "@/lib/api/api-response";

const defaultSuperadminEmail =
  process.env.SUPERADMIN_EMAIL ?? "info@supporttasolutions.com";

type Handler<TContext = unknown> = (
  request: NextRequest,
  context: TContext,
  auth: { userId: string; email?: string | null; role?: string | null }
) => Promise<NextResponse>;

export function withSuperadminAuth<TContext = unknown>(handler: Handler<TContext>) {
  return async (request: NextRequest, context: TContext): Promise<NextResponse> => {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const allowByEmail =
      user.email?.toLowerCase() === defaultSuperadminEmail.toLowerCase();

    if ((profileError || profile?.role !== "superadmin") && !allowByEmail) {
      return errorResponse("Forbidden", 403);
    }

    return handler(request, context, {
      userId: user.id,
      email: user.email,
      role: profile?.role ?? null
    });
  };
}

import { NextRequest } from "next/server";
import { apiHandler } from "@/lib/api/api-handler";
import { errorResponse, successResponse } from "@/lib/api/api-response";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/api/audit-logger";

export const POST = apiHandler(async (_request: NextRequest) => {
  const supabase = await getSupabaseServerClient();

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError || !session?.refresh_token) {
    return errorResponse("Unauthorized", 401);
  }

  const refreshResult = await supabase.auth.refreshSession({
    refresh_token: session.refresh_token
  });

  if (refreshResult.error || !refreshResult.data.session || !refreshResult.data.user) {
    return errorResponse("Unauthorized", 401);
  }

  await logAuditEvent({
    actor_user_id: refreshResult.data.user.id,
    actor_email: refreshResult.data.user.email,
    action: "auth.session.refreshed",
    resource_type: "session",
    resource_id: refreshResult.data.session.access_token.slice(0, 16)
  });

  return successResponse(
    {
      user: {
        id: refreshResult.data.user.id,
        email: refreshResult.data.user.email
      },
      expires_at: refreshResult.data.session.expires_at
    },
    200
  );
});

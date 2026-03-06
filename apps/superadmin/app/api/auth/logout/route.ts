import { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { apiHandler } from "@/lib/api/api-handler";
import { successResponse } from "@/lib/api/api-response";
import { logAuditEvent } from "@/lib/api/audit-logger";

export const POST = apiHandler(async (_request: NextRequest) => {
    const supabase = await getSupabaseServerClient();
        const {
            data: { user }
        } = await supabase.auth.getUser();
    await supabase.auth.signOut();

        if (user) {
            await logAuditEvent({
                actor_user_id: user.id,
                actor_email: user.email,
                action: "auth.logout",
                resource_type: "session",
                resource_id: user.id
            });
        }

    return successResponse({ message: "Logged out" }, 200);
});

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

export async function POST() {
  try {
    const supabase = await getSupabaseServerClient();
    await supabase.auth.signOut();

    const response: ApiResponse<null> = {
      success: true
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/auth/logout", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 500 });
  }
}

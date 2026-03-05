import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api";

const defaultSuperadminEmail =
  process.env.SUPERADMIN_EMAIL ?? "info@supporttasolutions.com";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = schema.parse(body);
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      const response: ApiResponse<null> = {
        success: false,
        error: error?.message ?? "Invalid email or password"
      };
      return NextResponse.json(response, { status: 401 });
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
      const response: ApiResponse<null> = {
        success: false,
        error: "Forbidden"
      };
      return NextResponse.json(response, { status: 403 });
    }

    const response: ApiResponse<{ user: { id: string; email: string | undefined } }> = {
      success: true,
      data: {
        user: {
          id: data.user.id,
          email: data.user.email
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("POST /api/auth/login", error);
    const message = error instanceof Error ? error.message : "Server error";
    const response: ApiResponse<null> = {
      success: false,
      error: message
    };
    return NextResponse.json(response, { status: 400 });
  }
}

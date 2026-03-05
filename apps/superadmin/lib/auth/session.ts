import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const defaultSuperadminEmail =
  process.env.SUPERADMIN_EMAIL ?? "info@supporttasolutions.com";

export async function getSession(): Promise<Session | null> {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<
  { user: User; profile: { role: string; email: string | null } | null } | null
> {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role,email")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile && user.email?.toLowerCase() === defaultSuperadminEmail.toLowerCase()) {
    return {
      user,
      profile: {
        role: "superadmin",
        email: user.email ?? null
      }
    };
  }

  return { user, profile };
}

export async function isSuparAdmin(): Promise<boolean> {
  const current = await getUser();
  return current?.profile?.role === "superadmin";
}

export async function isSuperAdmin(): Promise<boolean> {
  return isSuparAdmin();
}

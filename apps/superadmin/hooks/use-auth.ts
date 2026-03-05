"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabase/client";
import { logoutUser } from "@/lib/services/client/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, loading, setUser, clearUser, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = getSupabaseClient();

    async function loadUser() {
      setLoading(true);
      const {
        data: { user: currentUser }
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    }

    void loadUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setLoading, setUser]);

  async function logout() {
    await logoutUser();
    clearUser();
    router.push("/login");
  }

  return { user, loading, logout };
}

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/lib/types";

export async function getAdminSession() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect("/admin/login?error=config");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .eq("active", true)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=permission");
  }

  return {
    supabase,
    user,
    profile: profile as AdminUser,
  };
}

import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { profile } = await getAdminSession();

  return <AdminShell profile={profile}>{children}</AdminShell>;
}

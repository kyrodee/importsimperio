import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, Boxes, FolderTree, Home, LogOut, Settings } from "lucide-react";
import { signOutAction } from "@/app/admin/actions";
import type { AdminUser } from "@/lib/types";

const links = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/produtos", label: "Produtos", icon: Boxes },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminShell({
  profile,
  children,
}: {
  profile: AdminUser;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-[#080808] p-5 lg:block">
        <Link href="/" className="flex items-center gap-3 rounded-lg">
          <span className="flex size-10 items-center justify-center rounded-lg border border-gold/35 bg-gold/10 text-sm font-semibold text-gold-strong">
            II
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Império Imports</p>
            <p className="text-xs text-muted">Painel administrativo</p>
          </div>
        </Link>

        <nav className="mt-8 grid gap-1">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition hover:bg-white/[0.06] hover:text-white"
              >
                <Icon size={17} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-sm font-medium text-white">{profile.full_name || profile.email}</p>
          <p className="mt-1 text-xs text-muted">{profile.role === "owner" ? "Proprietário" : "Gestor"}</p>
          <form action={signOutAction} className="mt-4">
            <button className="focus-ring flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-muted transition hover:border-red-300/40 hover:text-red-100">
              <LogOut size={15} />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/84 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/admin" className="font-semibold text-white">
              Admin
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/" className="rounded-lg border border-white/10 p-2 text-muted">
                <Home size={17} />
              </Link>
              <form action={signOutAction}>
                <button className="rounded-lg border border-white/10 p-2 text-muted">
                  <LogOut size={17} />
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-4 py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-lg px-3 py-2 text-xs text-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

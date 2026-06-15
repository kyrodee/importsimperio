import Link from "next/link";
import { Boxes, FolderTree, PackageCheck, Sparkles, Timer, TrendingUp } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { getAdminStats, getProducts } from "@/lib/db";
import { formatCurrency, productStatusLabel } from "@/lib/utils";

export const metadata = {
  title: "Dashboard | Império Imports",
};

const statIcons = [FolderTree, Boxes, Sparkles, PackageCheck, Timer];

export default async function AdminDashboardPage() {
  const [stats, recentProducts] = await Promise.all([
    getAdminStats(),
    getProducts({ includeInactive: true, limit: 5 }),
  ]);

  const cards = [
    ["Categorias", stats.categories],
    ["Produtos", stats.products],
    ["Destaques", stats.featured],
    ["Em estoque", stats.inStock],
    ["Sob encomenda", stats.preOrder],
  ];

  return (
    <div className="grid gap-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gold-strong">Painel administrativo</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-muted">
            Visão rápida do catálogo, produtos em destaque e disponibilidade.
          </p>
        </div>
        <ButtonLink href="/admin/produtos" variant="primary">
          Cadastrar produto
        </ButtonLink>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value], index) => {
          const Icon = statIcons[index] ?? TrendingUp;

          return (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <Icon size={18} className="text-gold-strong" />
              <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.035]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">Produtos recentes</h2>
          <Link href="/admin/produtos" className="text-sm font-medium text-gold-strong">
            Ver todos
          </Link>
        </div>
        <div className="divide-y divide-white/10">
          {recentProducts.map((product) => (
            <div key={product.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <div>
                <p className="font-medium text-white">{product.name}</p>
                <p className="mt-1 text-xs text-muted">{product.category?.name ?? "Sem categoria"}</p>
              </div>
              <span className="text-sm text-muted">{productStatusLabel(product.status)}</span>
              <span className="text-sm font-semibold text-white">{formatCurrency(product.price)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

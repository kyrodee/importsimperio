import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { Badge } from "@/components/ui/badge";
import { getCategories, getProducts, getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Busque produtos importados originais da Império Imports por categoria, disponibilidade e nome.",
  alternates: {
    canonical: "/catalogo",
  },
};

export const revalidate = 300;

export default async function CatalogPage() {
  const [settings, categories, products] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <main className="bg-background">
      <section className="border-b border-white/10 bg-[#0d0d0d] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="gold">Catálogo online</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Encontre produtos importados em estoque ou sob encomenda.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            Use a busca em tempo real e os filtros para navegar pelas categorias.
            Ao escolher um produto, solicite atendimento direto pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CatalogBrowser products={products} categories={categories} settings={settings} />
        </div>
      </section>
    </main>
  );
}

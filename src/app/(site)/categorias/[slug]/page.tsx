import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { Badge } from "@/components/ui/badge";
import { getCategories, getCategoryBySlug, getProducts, getSiteSettings } from "@/lib/db";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria nao encontrada",
    };
  }

  return {
    title: category.name,
    description: category.description ?? `Produtos importados da categoria ${category.name}.`,
    alternates: {
      canonical: `/categorias/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [settings, categories, products, category] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ categorySlug: slug }),
    getCategoryBySlug(slug),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main className="bg-background">
      <section className="border-b border-white/10 bg-[#0d0d0d] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="gold">Categoria</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{category.description}</p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CatalogBrowser
            products={products}
            categories={categories}
            settings={settings}
            initialCategory={category.slug}
          />
        </div>
      </section>
    </main>
  );
}

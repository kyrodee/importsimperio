import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/app/admin/actions";
import { getCategories, getProductById } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Editar produto | Império Imports",
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories({ includeInactive: true }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8">
      <header>
        <Link href="/admin/produtos" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white">
          <ArrowLeft size={15} />
          Voltar
        </Link>
        <p className="mt-6 text-sm font-medium text-gold-strong">Produto</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Editar {product.name}</h1>
      </header>

      <ProductForm action={updateProductAction} categories={categories} product={product} />
    </div>
  );
}

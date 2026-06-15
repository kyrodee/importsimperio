import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { createProductAction, deleteProductAction } from "@/app/admin/actions";
import { getCategories, getProducts } from "@/lib/db";
import { formatCurrency, productPrimaryImage, productStatusLabel } from "@/lib/utils";

export const metadata = {
  title: "Produtos | Império Imports",
};

export default async function AdminProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories({ includeInactive: true }),
    getProducts({ includeInactive: true }),
  ]);

  return (
    <div className="grid gap-8">
      <header>
        <p className="text-sm font-medium text-gold-strong">Catálogo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Produtos</h1>
        <p className="mt-2 text-sm text-muted">
          Cadastre produtos, altere preços, disponibilidade, imagens e destaque na home.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Novo produto</h2>
        <ProductForm action={createProductAction} categories={categories} />
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.035]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-lg font-semibold text-white">Produtos cadastrados</h2>
        </div>
        <div className="divide-y divide-white/10">
          {products.map((product) => (
            <div
              key={product.id}
              className="grid gap-4 p-5 md:grid-cols-[72px_1fr_auto] md:items-center"
            >
              <div className="relative size-[72px] overflow-hidden rounded-lg border border-white/10 bg-black">
                <Image
                  src={productPrimaryImage(product.images)}
                  alt={product.name}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>
              <div>
                <Link href={`/produtos/${product.slug}`} className="font-medium text-white hover:text-gold-strong">
                  {product.name}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {product.category?.name ?? "Sem categoria"} · {productStatusLabel(product.status)} ·{" "}
                  {formatCurrency(product.price)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <ButtonLink href={`/admin/produtos/${product.id}`} size="sm" icon={<Pencil size={14} />}>
                  Editar
                </ButtonLink>
                <form action={deleteProductAction}>
                  <input type="hidden" name="id" value={product.id} />
                  <Button type="submit" size="sm" variant="danger" icon={<Trash2 size={14} />}>
                    Excluir
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

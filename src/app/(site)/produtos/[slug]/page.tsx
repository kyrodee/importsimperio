import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowLeft, MessageCircle, PackageCheck, ShieldCheck, Tag } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { getRelatedProducts, getSiteSettings, requireProduct } from "@/lib/db";
import {
  buildWhatsappUrl,
  formatCurrency,
  productPrimaryImage,
  productStatusLabel,
} from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await requireProduct(slug);
  const image = productPrimaryImage(product.images);

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/produtos/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await requireProduct(slug);
  const [settings, relatedProducts] = await Promise.all([
    getSiteSettings(),
    getRelatedProducts(product),
  ]);
  const primaryImage = productPrimaryImage(product.images);
  const whatsappUrl = buildWhatsappUrl(
    settings.whatsapp,
    `Olá! Tenho interesse no produto ${product.name}. Pode me enviar valor, disponibilidade e formas de compra?`,
  );

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.code ?? product.slug,
    category: product.category?.name,
    image: product.images.map((image) => image.url),
    brand: {
      "@type": "Brand",
      name: settings.company_name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price ?? undefined,
      availability:
        product.status === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      url: `/produtos/${product.slug}`,
    },
  };

  return (
    <main className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="border-b border-white/10 bg-[#0d0d0d] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ButtonLink href="/catalogo" variant="ghost" size="sm" icon={<ArrowLeft size={15} />}>
            Voltar ao catálogo
          </ButtonLink>
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="relative space-y-4">
            <ProductGallery productName={product.name} images={product.images} />
            <div className="absolute left-4 top-4 flex flex-wrap gap-2 pointer-events-none">
              <Badge tone={product.status === "in_stock" ? "green" : "amber"}>
                {productStatusLabel(product.status)}
              </Badge>
              {product.featured ? <Badge tone="gold">Destaque</Badge> : null}
            </div>
          </div>

          <div className="lg:pt-4">
            <Badge tone="gold">{product.category?.name ?? "Produto importado"}</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">{product.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <InfoCard icon={<Tag size={18} />} label="Preço" value={formatCurrency(product.price)} />
              <InfoCard
                icon={<PackageCheck size={18} />}
                label="Disponibilidade"
                value={productStatusLabel(product.status)}
              />
              <InfoCard icon={<ShieldCheck size={18} />} label="Procedência" value="Original importado" />
              <InfoCard icon={<Tag size={18} />} label="Código" value={product.code ?? "Sob consulta"} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ExternalButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
                variant="primary"
                icon={<MessageCircle size={18} />}
              >
                Solicitar no WhatsApp
              </ExternalButtonLink>
              <ButtonLink
                href={product.category?.slug ? `/categorias/${product.category.slug}` : "/catalogo"}
                size="lg"
                variant="secondary"
              >
                Ver categoria
              </ButtonLink>
            </div>

            <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.035] p-6">
              <h2 className="text-lg font-semibold text-white">Descrição completa</h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                {product.full_description || product.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="border-t border-white/10 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-white">Produtos relacionados</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} settings={settings} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <div className="flex items-center gap-2 text-gold-strong">
        {icon}
        <span className="text-xs font-medium uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="mt-3 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

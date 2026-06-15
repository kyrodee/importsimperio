import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clock3,
  Globe2,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { differentials, heroMessages } from "@/lib/constants";
import { getCategories, getProducts, getSiteSettings } from "@/lib/db";
import { buildWhatsappUrl } from "@/lib/utils";

export const revalidate = 300;

const differentialIcons = [
  BadgeCheck,
  Globe2,
  PackageCheck,
  Clock3,
  MessageCircle,
  TrendingUp,
  Boxes,
  ShieldCheck,
];

export default async function HomePage() {
  const [settings, categories, featuredProducts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts({ featuredOnly: true, limit: 6 }),
  ]);

  const whatsappUrl = buildWhatsappUrl(
    settings.whatsapp,
    "Olá! Quero solicitar um orçamento com a Império Imports.",
  );

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.company_name,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://importsimperio.com.br",
    email: settings.email,
    sameAs: [`https://instagram.com/${settings.instagram.replace("@", "")}`],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.whatsapp,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <main className="overflow-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <section className="noise-overlay relative min-h-[calc(100svh-96px)] overflow-hidden border-b border-white/10">
        <Image
          src="/images/hero-imports.png"
          alt="Composição premium de produtos importados, eletrônicos e perfumaria."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-82"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0a0a_0%,rgba(10,10,10,0.93)_32%,rgba(10,10,10,0.55)_62%,rgba(10,10,10,0.22)_100%)]" />
        <div className="absolute inset-0 premium-grid opacity-25" />

        <div className="relative mx-auto flex min-h-[calc(100svh-96px)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <FadeIn>
              <Badge tone="gold" className="mb-6">
                Curadoria premium de importados
              </Badge>
              <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Produtos importados originais dos EUA e Paraguai.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 sm:text-xl">
                {settings.hero_subtitle}
              </p>
            </FadeIn>

            <FadeIn delay={0.08} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink
                href="/catalogo"
                size="lg"
                variant="primary"
                icon={<ArrowRight size={17} />}
              >
                Ver catálogo
              </ButtonLink>
              <ExternalButtonLink
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                size="lg"
                variant="secondary"
                icon={<MessageCircle size={17} />}
              >
                Falar no WhatsApp
              </ExternalButtonLink>
            </FadeIn>

            <FadeIn delay={0.16} className="mt-10 grid gap-3 sm:grid-cols-3">
              {heroMessages.map((message) => (
                <div key={message} className="rounded-lg border border-white/10 bg-black/38 p-4 backdrop-blur">
                  <p className="text-sm leading-6 text-white/78">{message}</p>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="empresa" className="border-b border-white/10 bg-[#0d0d0d] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <FadeIn>
            <Badge tone="neutral">Sobre a empresa</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Qualidade, procedência e confiança em cada importado.
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className="text-base leading-8 text-muted">{settings.institutional_text}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Originais", "Produtos selecionados com foco em procedência."],
                ["Estoque", "Itens disponíveis para pronta negociação."],
                ["Encomenda", "Busca sob demanda para necessidades específicas."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-lg font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl">
            <Badge tone="gold">Diferenciais</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Uma experiência de catálogo com acabamento de produto digital premium.
            </h2>
          </FadeIn>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {differentials.map((item, index) => {
              const Icon = differentialIcons[index] ?? Sparkles;

              return (
                <FadeIn key={item} delay={index * 0.025}>
                  <div className="h-full rounded-lg border border-white/10 bg-panel p-5 transition hover:border-gold/35 hover:bg-panel-strong">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold-strong">
                      <Icon size={18} />
                    </span>
                    <p className="mt-5 text-sm font-semibold text-white">{item}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <FadeIn>
              <Badge tone="gold">Destaques</Badge>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Produtos selecionados para começar.
              </h2>
            </FadeIn>
            <Link href="/catalogo" className="inline-flex items-center gap-2 text-sm font-medium text-gold-strong">
              Explorar todos
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <FadeIn key={product.id} delay={index * 0.035}>
                <ProductCard product={product} settings={settings} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

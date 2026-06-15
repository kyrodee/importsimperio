import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExternalButtonLink } from "@/components/ui/button";
import type { Product, SiteSettings } from "@/lib/types";
import {
  buildWhatsappUrl,
  formatCurrency,
  productPrimaryImage,
  productStatusLabel,
} from "@/lib/utils";

export function ProductCard({
  product,
  settings,
}: {
  product: Product;
  settings: SiteSettings;
}) {
  // Enhanced WhatsApp message with more details
  const whatsappUrl = buildWhatsappUrl(
    settings.whatsapp,
    `Olá! Tenho interesse no produto *${product.name}* (Ref: ${product.slug}).\nGostaria de mais informações sobre disponibilidade e entrega.`,
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gold/30 hover:shadow-gold/5">
      {/* Glow effect on hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-gold/0 via-gold/10 to-gold/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      <Link
        href={`/produtos/${product.slug}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-black"
      >
        <Image
          src={productPrimaryImage(product.images)}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Soft overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
        
        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
          {product.featured && (
            <Badge tone="gold" className="backdrop-blur-md bg-gold/20 border-gold/30">
              Destaque
            </Badge>
          )}
          <Badge tone={product.status === "in_stock" ? "green" : "amber"} className="backdrop-blur-md bg-black/40 border-white/10">
            {productStatusLabel(product.status)}
          </Badge>
        </div>
      </Link>

      <div className="relative flex flex-1 flex-col p-6 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80 mb-2">
              {product.category?.name ?? "Importado"}
            </p>
            <Link href={`/produtos/${product.slug}`} className="block group/title">
              <h3 className="line-clamp-2 text-lg font-medium tracking-tight text-white/90 transition-colors duration-300 group-hover/title:text-gold">
                {product.name}
              </h3>
            </Link>
          </div>
          <Link
            href={`/produtos/${product.slug}`}
            aria-label={`Ver detalhes de ${product.name}`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/50 transition-all duration-300 hover:bg-gold/10 hover:text-gold"
          >
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/50">
          {product.description}
        </p>

        <div className="mt-auto pt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-white/40 mb-1">Preço</p>
            <p className="text-xl font-semibold tracking-tight text-white">
              {formatCurrency(product.price)}
            </p>
          </div>
          
          <ExternalButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="secondary"
            className="rounded-full px-5 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors duration-300"
            icon={<MessageCircle size={16} />}
          >
            Comprar
          </ExternalButtonLink>
        </div>
      </div>
    </article>
  );
}

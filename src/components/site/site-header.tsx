import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  Heart,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { BrandLogo } from "@/components/site/logo";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import type { Category, SiteSettings } from "@/lib/types";
import { buildWhatsappUrl } from "@/lib/utils";

export function SiteHeader({
  settings,
  categories,
  customerState,
}: {
  settings: SiteSettings;
  categories: Category[];
  customerState: {
    user: User | null;
    cartCount: number;
    favoriteCount: number;
  };
}) {
  const whatsappUrl = buildWhatsappUrl(
    settings.whatsapp,
    "Olá! Quero conhecer o catálogo da Império Imports.",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <BrandLogo priority />

        <nav aria-label="Principal" className="hidden min-w-0 items-center gap-1 lg:flex">
          <Link className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-white" href="/catalogo">
            Catálogo
          </Link>
          <Link className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-white" href="/#empresa">
            Empresa
          </Link>
          {categories.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:text-white"
              href={`/categorias/${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-1 sm:gap-2">
          <ButtonLink
            href="/catalogo"
            size="sm"
            variant="secondary"
            icon={<Search size={15} />}
            className="hidden md:inline-flex"
          >
            Ver catálogo
          </ButtonLink>
          <Link
            href="/conta/favoritos"
            aria-label="Favoritos"
            className="focus-ring relative hidden size-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-gold/45 hover:text-white sm:flex"
          >
            <Heart size={16} />
            {customerState.favoriteCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
                {customerState.favoriteCount}
              </span>
            ) : null}
          </Link>
          <Link
            href="/carrinho"
            aria-label="Carrinho"
            className="focus-ring relative flex size-9 items-center justify-center rounded-lg border border-white/10 text-muted transition hover:border-gold/45 hover:text-white"
          >
            <ShoppingBag size={16} />
            {customerState.cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-semibold text-black">
                {customerState.cartCount}
              </span>
            ) : null}
          </Link>
          <ButtonLink
            href={customerState.user ? "/conta" : "/conta/login"}
            size="sm"
            variant="secondary"
            icon={<UserRound size={15} />}
            className="hidden sm:inline-flex"
          >
            {customerState.user ? "Conta" : "Entrar"}
          </ButtonLink>
          <ExternalButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="primary"
            icon={<MessageCircle size={15} />}
            className="hidden sm:inline-flex"
          >
            WhatsApp
          </ExternalButtonLink>
        </div>
      </div>
      <div className="border-t border-white/5 bg-white/[0.025]">
        <div className="mx-auto flex h-8 max-w-7xl items-center gap-2 px-3 text-xs text-muted sm:px-6 lg:px-8">
          <ShieldCheck size={14} className="shrink-0 text-gold" />
          <span className="truncate">Produtos originais, em estoque e sob encomenda.</span>
        </div>
      </div>
    </header>
  );
}

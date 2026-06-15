import { Heart } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getFavoriteItems, requireCustomer } from "@/lib/customer";
import { getSiteSettings } from "@/lib/db";

export const metadata = {
  title: "Favoritos",
  description: "Produtos favoritos salvos na sua conta.",
};

export default async function FavoritesPage() {
  await requireCustomer("/conta/login?redirect=/conta/favoritos");
  const [favorites, settings] = await Promise.all([getFavoriteItems(), getSiteSettings()]);

  return (
    <main className="bg-background">
      <section className="border-b border-white/10 bg-[#0d0d0d] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="gold">Favoritos</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Produtos que você salvou
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Guarde itens de interesse para comparar depois ou pedir atendimento pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {favorites.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((favorite) => (
              <ProductCard key={favorite.id} product={favorite.product} settings={settings} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-10 text-center">
            <Heart size={26} className="mx-auto text-gold-strong" />
            <p className="mt-5 text-lg font-semibold text-white">Nenhum favorito ainda.</p>
            <p className="mt-2 text-sm text-muted">
              Salve produtos do catálogo para encontrar tudo mais rápido.
            </p>
            <ButtonLink href="/catalogo" className="mt-6" variant="primary">
              Explorar catálogo
            </ButtonLink>
          </div>
        )}
      </section>
    </main>
  );
}

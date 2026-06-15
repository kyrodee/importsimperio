import Link from "next/link";
import { Heart, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { customerSignOutAction } from "@/app/conta/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { getCartItems, getFavoriteItems, requireCustomer } from "@/lib/customer";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Minha conta",
  description: "Área do cliente com carrinho e favoritos salvos.",
};

export default async function AccountPage() {
  const { user } = await requireCustomer("/conta/login?redirect=/conta");
  const [cartItems, favoriteItems] = await Promise.all([getCartItems(), getFavoriteItems()]);
  const total = cartItems.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0,
  );

  return (
    <main className="bg-background">
      <section className="border-b border-white/10 bg-[#0d0d0d] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="gold">Minha conta</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Olá, {user.user_metadata?.full_name || user.email}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Aqui ficam suas escolhas salvas para continuar depois ou falar com a Império Imports pelo WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <Link href="/carrinho" className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-gold/35">
          <ShoppingBag className="text-gold-strong" size={22} />
          <p className="mt-5 text-3xl font-semibold text-white">{cartItems.length}</p>
          <p className="mt-1 text-sm text-muted">Itens no carrinho</p>
          <p className="mt-4 text-sm font-medium text-white">{formatCurrency(total)}</p>
        </Link>

        <Link href="/conta/favoritos" className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-gold/35">
          <Heart className="text-gold-strong" size={22} />
          <p className="mt-5 text-3xl font-semibold text-white">{favoriteItems.length}</p>
          <p className="mt-1 text-sm text-muted">Produtos favoritos</p>
        </Link>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
          <UserRound className="text-gold-strong" size={22} />
          <p className="mt-5 text-sm font-medium text-white">{user.email}</p>
          <form action={customerSignOutAction} className="mt-5">
            <Button type="submit" variant="secondary" icon={<LogOut size={15} />}>
              Sair da conta
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-3 px-4 pb-14 sm:flex-row sm:px-6 lg:px-8">
        <ButtonLink href="/catalogo" variant="primary">
          Continuar comprando
        </ButtonLink>
        <ButtonLink href="/carrinho" variant="secondary">
          Ver carrinho
        </ButtonLink>
      </section>
    </main>
  );
}

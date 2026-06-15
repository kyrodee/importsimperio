import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Minus, Plus, Trash2 } from "lucide-react";
import {
  removeCartItemAction,
  updateCartQuantityAction,
} from "@/app/conta/actions";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { getCartItems, requireCustomer } from "@/lib/customer";
import { getSiteSettings } from "@/lib/db";
import {
  buildWhatsappUrl,
  formatCurrency,
  productPrimaryImage,
  productStatusLabel,
} from "@/lib/utils";

export const metadata = {
  title: "Carrinho",
  description: "Carrinho salvo da sua conta na Império Imports.",
};

export default async function CartPage() {
  await requireCustomer("/conta/login?redirect=/carrinho");
  const [items, settings] = await Promise.all([getCartItems(), getSiteSettings()]);
  const total = items.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0);
  const message = [
    "Olá! Quero solicitar orçamento dos produtos do meu carrinho:",
    ...items.map(
      (item) =>
        `- ${item.quantity}x ${item.product.name}${item.product.code ? ` (${item.product.code})` : ""}`,
    ),
    `Total estimado no site: ${formatCurrency(total)}`,
  ].join("\n");
  const whatsappUrl = buildWhatsappUrl(settings.whatsapp, message);

  return (
    <main className="bg-background">
      <section className="border-b border-white/10 bg-[#0d0d0d] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Badge tone="gold">Carrinho salvo</Badge>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Seus produtos selecionados
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Revise os itens e envie tudo no WhatsApp com uma mensagem formatada automaticamente.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="grid gap-4">
          {items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[120px_1fr] sm:p-5"
              >
                <Link
                  href={`/produtos/${item.product.slug}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-lg bg-black sm:aspect-square"
                >
                  <Image
                    src={productPrimaryImage(item.product.images)}
                    alt={item.product.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
                        {item.product.category?.name ?? "Importado"}
                      </p>
                      <Link href={`/produtos/${item.product.slug}`}>
                        <h2 className="mt-2 text-lg font-semibold text-white">{item.product.name}</h2>
                      </Link>
                      <p className="mt-2 text-sm text-muted">
                        {productStatusLabel(item.product.status)}
                      </p>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency((item.product.price ?? 0) * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <form action={updateCartQuantityAction} className="flex items-center gap-2">
                      <input type="hidden" name="item_id" value={item.id} />
                      <button
                        name="quantity"
                        value={Math.max(1, item.quantity - 1)}
                        className="focus-ring flex size-9 items-center justify-center rounded-lg border border-white/10 text-muted hover:text-white"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="flex h-9 min-w-10 items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-white">
                        {item.quantity}
                      </span>
                      <button
                        name="quantity"
                        value={item.quantity + 1}
                        className="focus-ring flex size-9 items-center justify-center rounded-lg border border-white/10 text-muted hover:text-white"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={14} />
                      </button>
                    </form>

                    <form action={removeCartItemAction}>
                      <input type="hidden" name="item_id" value={item.id} />
                      <Button type="submit" variant="danger" size="sm" icon={<Trash2 size={14} />}>
                        Remover
                      </Button>
                    </form>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-white/10 bg-white/[0.035] p-10 text-center">
              <p className="text-lg font-semibold text-white">Seu carrinho está vazio.</p>
              <p className="mt-2 text-sm text-muted">Explore o catálogo e adicione produtos para salvar aqui.</p>
              <ButtonLink href="/catalogo" className="mt-6" variant="primary">
                Ver catálogo
              </ButtonLink>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-white/10 bg-white/[0.045] p-5 lg:sticky lg:top-28">
          <h2 className="text-lg font-semibold text-white">Resumo</h2>
          <div className="mt-5 space-y-3 text-sm text-muted">
            <div className="flex justify-between">
              <span>Itens</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
              <span>Total estimado</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <ExternalButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            variant="primary"
            className="mt-6 w-full"
            icon={<MessageCircle size={17} />}
          >
            Enviar no WhatsApp
          </ExternalButtonLink>
          <p className="mt-4 text-xs leading-5 text-muted">
            O valor final pode variar conforme disponibilidade, encomenda e condições combinadas no atendimento.
          </p>
        </aside>
      </section>
    </main>
  );
}

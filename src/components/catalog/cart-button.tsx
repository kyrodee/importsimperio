"use client";

import { useState, useTransition } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { toggleCartAction } from "@/app/(site)/actions";

export function CartButton({
  productId,
  initialIsInCart,
}: {
  productId: string;
  initialIsInCart: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isInCart, setIsInCart] = useState(initialIsInCart);

  function handleClick() {
    setIsInCart(!isInCart);
    
    startTransition(async () => {
      try {
        await toggleCartAction(productId);
      } catch (error) {
        setIsInCart(isInCart);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-5 text-sm font-medium transition-all disabled:opacity-50 ${
        isInCart
          ? "border-gold bg-gold/10 text-gold hover:bg-gold/20"
          : "border-white/10 bg-white/[0.035] text-white hover:border-gold/50 hover:text-gold hover:bg-white/5"
      }`}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <ShoppingBag size={16} className={isInCart ? "fill-gold/20" : ""} />
      )}
      {isInCart ? "Remover do carrinho" : "Adicionar ao carrinho"}
    </button>
  );
}

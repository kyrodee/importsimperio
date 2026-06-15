"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleFavoriteAction } from "@/app/(site)/actions";

export function FavoriteButton({
  productId,
  initialIsFavorite,
}: {
  productId: string;
  initialIsFavorite: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  function handleClick() {
    // Optimistic update
    setIsFavorite(!isFavorite);
    
    startTransition(async () => {
      try {
        await toggleFavoriteAction(productId);
      } catch (error) {
        // Revert on error
        setIsFavorite(isFavorite);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.035] text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Heart
          size={18}
          className={isFavorite ? "fill-gold text-gold transition-all duration-300 scale-110" : "transition-all duration-300"}
        />
      )}
    </button>
  );
}

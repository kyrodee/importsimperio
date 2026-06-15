"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/catalog/product-card";
import type { Category, Product, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CatalogBrowser({
  products,
  categories,
  settings,
  initialCategory = "all",
}: {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  initialCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category?.slug === category;
      const text = `${product.name} ${product.description} ${product.code ?? ""} ${product.category?.name ?? ""}`;
      const matchesQuery = !normalizedQuery || text.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, products, query]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-lg border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search
            aria-hidden
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <span className="sr-only">Buscar produtos</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, categoria ou código"
            className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
          />
        </label>

        <div className="flex items-center gap-2 overflow-x-auto">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-muted">
            <SlidersHorizontal size={17} />
          </span>
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "focus-ring h-10 shrink-0 rounded-lg border px-4 text-sm font-medium transition",
              category === "all"
                ? "border-gold/60 bg-gold/15 text-gold-strong"
                : "border-white/10 bg-white/[0.04] text-muted hover:text-white",
            )}
          >
            Todos
          </button>
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => setCategory(item.slug)}
              className={cn(
                "focus-ring h-10 shrink-0 rounded-lg border px-4 text-sm font-medium transition",
                category === item.slug
                  ? "border-gold/60 bg-gold/15 text-gold-strong"
                  : "border-white/10 bg-white/[0.04] text-muted hover:text-white",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ProductCard product={product} settings={settings} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-10 text-center">
          <p className="text-lg font-semibold text-white">Nenhum produto encontrado.</p>
          <p className="mt-2 text-sm text-muted">
            Ajuste a busca ou fale conosco para consultar disponibilidade sob encomenda.
          </p>
        </div>
      )}
    </div>
  );
}

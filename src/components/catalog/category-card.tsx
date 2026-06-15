import Image from "next/image";
import Link from "next/link";
import {
  Cable,
  Globe2,
  Laptop,
  Layers3,
  Package,
  ShieldPlus,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { Category } from "@/lib/types";

const icons = {
  cable: Cable,
  "globe-2": Globe2,
  laptop: Laptop,
  "layers-3": Layers3,
  package: Package,
  "shield-plus": ShieldPlus,
  smartphone: Smartphone,
  sparkles: Sparkles,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = icons[(category.icon ?? "package") as keyof typeof icons] ?? Package;

  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group relative min-h-[260px] overflow-hidden rounded-lg border border-white/10 bg-panel transition duration-300 hover:-translate-y-1 hover:border-gold/45"
    >
      <Image
        src={category.image_url || "/images/hero-imports.png"}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-36 transition duration-500 group-hover:scale-105 group-hover:opacity-48"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.18),rgba(10,10,10,0.88))]" />
      <div className="relative flex h-full min-h-[260px] flex-col justify-between p-5">
        <span className="flex size-11 items-center justify-center rounded-lg border border-white/12 bg-black/40 text-gold-strong backdrop-blur">
          <Icon size={20} />
        </span>
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-white">{category.name}</h3>
          <p className="mt-3 text-sm leading-6 text-white/68">{category.description}</p>
        </div>
      </div>
    </Link>
  );
}

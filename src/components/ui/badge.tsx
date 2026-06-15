import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "green" | "amber";
  className?: string;
}) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.055] text-muted",
    gold: "border-gold/30 bg-gold/10 text-gold-strong",
    green: "border-emerald-300/25 bg-emerald-400/10 text-emerald-100",
    amber: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

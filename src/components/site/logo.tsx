import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  variant = "symbol",
  className,
  imageClassName,
  priority = false,
}: {
  variant?: "symbol" | "full";
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const isFull = variant === "full";

  return (
    <Link href="/" className={cn("focus-ring inline-flex items-center gap-3 rounded-lg", className)}>
      <span
        className={cn(
          "relative shrink-0 flex items-center justify-center",
          isFull ? "h-16 w-32 sm:h-20 sm:w-40" : "h-10 w-24 sm:h-12 sm:w-28",
          imageClassName,
        )}
      >
        <Image
          src="/LOGODEFINITIVA.png"
          alt="Império Imports"
          fill
          sizes={isFull ? "(min-width: 640px) 160px, 128px" : "112px"}
          priority={priority}
          className="object-contain"
        />
      </span>
    </Link>
  );
}

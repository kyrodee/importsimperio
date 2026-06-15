"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  productName,
  images,
}: {
  productName: string;
  images: ProductImage[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Derive primary image or fallback
  const primaryImage =
    images.find((img) => img.is_primary)?.url ??
    images[0]?.url ??
    "/images/hero-imports.png";

  const allImages = images.length > 0 ? images : [{ id: "default", url: primaryImage, alt_text: productName }];

  // Close lightbox on escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  function handlePrev() {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === 0 ? allImages.length - 1 : current - 1;
    });
  }

  function handleNext() {
    setSelectedIndex((current) => {
      if (current === null) return null;
      return current === allImages.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedIndex(0)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-panel transition hover:opacity-90"
        >
          <Image
            src={primaryImage}
            alt={productName}
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </button>

        {allImages.length > 1 ? (
          <div className="grid grid-cols-3 gap-4">
            {allImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/10 bg-panel transition hover:opacity-90"
              >
                <Image
                  src={image.url}
                  alt={image.alt_text ?? productName}
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {selectedIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {allImages.length > 1 ? (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </>
          ) : null}

          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={allImages[selectedIndex].url}
              alt={allImages[selectedIndex].alt_text ?? productName}
              fill
              className="object-contain"
            />
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {selectedIndex + 1} / {allImages.length}
          </div>
        </div>
      ) : null}
    </>
  );
}

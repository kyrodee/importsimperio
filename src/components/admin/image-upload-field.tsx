"use client";

import { useMemo, useState } from "react";
import { ImageUp, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function ImageUploadField({
  defaultUrls = [],
  name = "image_urls",
  maxUrls,
}: {
  defaultUrls?: string[];
  name?: string;
  maxUrls?: number;
}) {
  const [urls, setUrls] = useState(defaultUrls);
  const [manualUrl, setManualUrl] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const joined = useMemo(() => urls.join("\n"), [urls]);

  async function upload(file: File) {
    const supabase = createBrowserSupabaseClient();

    if (!supabase) {
      setMessage("Configure o Supabase para enviar arquivos.");
      return;
    }

    setUploading(true);
    setMessage("");

    const extension = file.name.split(".").pop() || "png";
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      setMessage(error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setUrls((current) => [...current, data.publicUrl]);
    setUploading(false);
  }

  function addManualUrl() {
    const value = manualUrl.trim();

    if (!value) {
      return;
    }

    setUrls((current) => [...current, value]);
    setManualUrl("");
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name={name} value={joined} />

      {(!maxUrls || urls.length < maxUrls) ? (
        <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-white/18 bg-black/25 px-4 py-5 text-sm text-muted transition hover:border-gold/45 hover:text-white">
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageUp size={18} />}
          {uploading ? "Enviando..." : "Enviar imagem para o Supabase"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void upload(file);
              }
            }}
          />
        </label>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <input
            value={manualUrl}
            onChange={(event) => setManualUrl(event.target.value)}
            placeholder="Ou cole uma URL de imagem"
            className="focus-ring h-10 rounded-lg border border-white/10 bg-black/35 px-3 text-sm text-white placeholder:text-muted"
          />
          <Button type="button" size="sm" onClick={addManualUrl}>
            Adicionar URL
          </Button>
        </div>

        {message ? <p className="text-xs text-amber-100">{message}</p> : null}
        </div>
      ) : null}

      {urls.length > 0 ? (
        <div className="grid gap-2">
          {urls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-muted"
            >
              <span className="truncate">{url}</span>
              <button
                type="button"
                onClick={() => setUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-md p-1 text-muted transition hover:bg-white/10 hover:text-white"
                aria-label="Remover imagem"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted">Se nenhuma imagem for enviada, o produto usará o visual padrão.</p>
      )}
    </div>
  );
}

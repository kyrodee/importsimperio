import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return "Consultar";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function buildWhatsappUrl(phone: string, message: string) {
  const digits = onlyDigits(phone);
  const normalized = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function productStatusLabel(status: "in_stock" | "pre_order") {
  return status === "in_stock" ? "Em estoque" : "Sob encomenda";
}

export function productPrimaryImage(images: Array<{ url: string; is_primary?: boolean }>) {
  return images.find((image) => image.is_primary)?.url ?? images[0]?.url ?? "/images/hero-imports.png";
}

export function parseLines(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export function asNumber(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/\./g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

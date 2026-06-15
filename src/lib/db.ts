import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { demoCategories, demoProducts, demoSettings } from "@/lib/demo-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AdminStats, Category, Product, ProductImage, SiteSettings } from "@/lib/types";
import { productPrimaryImage } from "@/lib/utils";

export type ProductRow = Omit<Product, "category" | "images"> & {
  category?: Category | Category[] | null;
  images?: ProductImage[] | null;
};

export function normalizeProduct(row: ProductRow): Product {
  const category = Array.isArray(row.category) ? row.category[0] : row.category;
  const images = [...(row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return {
    ...row,
    price: row.price === null ? null : Number(row.price),
    category: category ?? null,
    images,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return demoSettings;
  }

  const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  return (data as SiteSettings | null) ?? demoSettings;
}

export async function getCategories(options: { includeInactive?: boolean } = {}) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return options.includeInactive ? demoCategories : demoCategories.filter((category) => category.active);
  }

  let query = supabase.from("categories").select("*").order("sort_order").order("name");

  if (!options.includeInactive) {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    return options.includeInactive ? demoCategories : demoCategories.filter((category) => category.active);
  }

  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getProducts(options: {
  includeInactive?: boolean;
  featuredOnly?: boolean;
  categorySlug?: string;
  limit?: number;
} = {}) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    let products = demoProducts;

    if (!options.includeInactive) {
      products = products.filter((product) => product.active);
    }

    if (options.featuredOnly) {
      products = products.filter((product) => product.featured);
    }

    if (options.categorySlug) {
      products = products.filter((product) => product.category?.slug === options.categorySlug);
    }

    return products.slice(0, options.limit ?? products.length);
  }

  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .order("featured", { ascending: false })
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (!options.includeInactive) {
    query = query.eq("active", true);
  }

  if (options.featuredOnly) {
    query = query.eq("featured", true);
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  let products = ((data ?? []) as ProductRow[]).map(normalizeProduct);

  if (options.categorySlug) {
    products = products.filter((product) => product.category?.slug === options.categorySlug);
  }

  return products;
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(id: string) {
  noStore();
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return demoProducts.find((product) => product.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeProduct(data as ProductRow);
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const products = await getProducts({ categorySlug: product.category?.slug, limit: limit + 1 });

  return products.filter((candidate) => candidate.id !== product.id).slice(0, limit);
}

export async function requireProduct(slug: string) {
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return product;
}

export function getProductImage(product: Product) {
  return productPrimaryImage(product.images);
}

export async function getAdminStats(): Promise<AdminStats> {
  noStore();
  const products = await getProducts({ includeInactive: true });
  const categories = await getCategories({ includeInactive: true });

  return {
    categories: categories.length,
    products: products.length,
    featured: products.filter((product) => product.featured).length,
    inStock: products.filter((product) => product.status === "in_stock").length,
    preOrder: products.filter((product) => product.status === "pre_order").length,
  };
}

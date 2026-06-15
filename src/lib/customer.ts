import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { normalizeProduct, type ProductRow } from "@/lib/db";
import type { CartItem, FavoriteItem } from "@/lib/types";

type CartRow = Omit<CartItem, "product"> & {
  product: ProductRow | ProductRow[] | null;
};

type FavoriteRow = Omit<FavoriteItem, "product"> & {
  product: ProductRow | ProductRow[] | null;
};

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireCustomer(redirectTo = "/conta/login") {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    redirect(`${redirectTo}${redirectTo.includes("?") ? "&" : "?"}error=config`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return { supabase, user };
}

function normalizeCartItem(row: CartRow): CartItem | null {
  const product = Array.isArray(row.product) ? row.product[0] : row.product;

  if (!product) {
    return null;
  }

  return {
    ...row,
    product: normalizeProduct(product),
  };
}

function normalizeFavorite(row: FavoriteRow): FavoriteItem | null {
  const product = Array.isArray(row.product) ? row.product[0] : row.product;

  if (!product) {
    return null;
  }

  return {
    ...row,
    product: normalizeProduct(product),
  };
}

export async function getCartItems(): Promise<CartItem[]> {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  if (!user || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select("*, product:products(*, category:categories(*), images:product_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as CartRow[])
    .map(normalizeCartItem)
    .filter((item): item is CartItem => Boolean(item));
}

export async function getFavoriteItems(): Promise<FavoriteItem[]> {
  const user = await getCurrentUser();
  const supabase = await createServerSupabaseClient();

  if (!user || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorite_products")
    .select("*, product:products(*, category:categories(*), images:product_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return ((data ?? []) as FavoriteRow[])
    .map(normalizeFavorite)
    .filter((item): item is FavoriteItem => Boolean(item));
}

export async function getCustomerHeaderState() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      cartCount: 0,
      favoriteCount: 0,
    };
  }

  const [cartItems, favoriteItems] = await Promise.all([getCartItems(), getFavoriteItems()]);

  return {
    user,
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    favoriteCount: favoriteItems.length,
  };
}

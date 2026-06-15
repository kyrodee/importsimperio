"use server";

import { revalidatePath } from "next/cache";
import { requireCustomer } from "@/lib/customer";

export async function toggleFavoriteAction(productId: string) {
  const { supabase, user } = await requireCustomer();

  const { data: existing } = await supabase
    .from("favorite_products")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorite_products").delete().eq("id", existing.id);
  } else {
    await supabase.from("favorite_products").insert({
      user_id: user.id,
      product_id: productId,
    });
  }

  // Revalidate layout to update header counters
  revalidatePath("/", "layout");
}

export async function toggleCartAction(productId: string) {
  const { supabase, user } = await requireCustomer();

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("cart_items").delete().eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    });
  }

  revalidatePath("/", "layout");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireCustomer } from "@/lib/customer";

export type CustomerAuthState = {
  message?: string;
};

function safeRedirect(value: FormDataEntryValue | null, fallback = "/conta") {
  const redirectTo = typeof value === "string" && value.startsWith("/") ? value : fallback;
  return redirectTo;
}

export async function customerLoginAction(
  _: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { message: "Configure o Supabase antes de entrar." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const redirectTo = safeRedirect(formData.get("redirect"));

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { message: "E-mail ou senha inválidos." };
  }

  redirect(redirectTo);
}

export async function customerSignUpAction(
  _: CustomerAuthState,
  formData: FormData,
): Promise<CustomerAuthState> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { message: "Configure o Supabase antes de criar conta." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const redirectTo = safeRedirect(formData.get("redirect"));

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
      },
    },
  });

  if (error) {
    return { message: error.message };
  }

  if (data.user && data.session) {
    await supabase.from("customer_profiles").upsert({
      id: data.user.id,
      email,
      full_name: fullName || null,
      phone: phone || null,
    });

    redirect(redirectTo);
  }

  return {
    message:
      "Conta criada. Se a confirmação de e-mail estiver ativa no Supabase, confirme o e-mail antes de entrar.",
  };
}

export async function customerSignOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/");
}

export async function addToCartAction(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "");
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));
  const returnTo = safeRedirect(formData.get("return_to"), "/catalogo");
  const { supabase, user } = await requireCustomer(
    `/conta/login?redirect=${encodeURIComponent(returnTo)}`,
  );

  if (!productId) {
    redirect(returnTo);
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: Math.min(Number(existing.quantity) + quantity, 99) })
      .eq("id", existing.id);
  } else {
    await supabase.from("cart_items").insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    });
  }

  revalidatePath(returnTo);
  revalidatePath("/carrinho");
  redirect(returnTo);
}

export async function updateCartQuantityAction(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "");
  const quantity = Math.max(1, Math.min(99, Number(formData.get("quantity") ?? 1)));
  const { supabase, user } = await requireCustomer("/conta/login?redirect=/carrinho");

  if (itemId) {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("user_id", user.id);
  }

  revalidatePath("/carrinho");
  redirect("/carrinho");
}

export async function removeCartItemAction(formData: FormData) {
  const itemId = String(formData.get("item_id") ?? "");
  const { supabase, user } = await requireCustomer("/conta/login?redirect=/carrinho");

  if (itemId) {
    await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id);
  }

  revalidatePath("/carrinho");
  redirect("/carrinho");
}

export async function toggleFavoriteAction(formData: FormData) {
  const productId = String(formData.get("product_id") ?? "");
  const returnTo = safeRedirect(formData.get("return_to"), "/catalogo");
  const { supabase, user } = await requireCustomer(
    `/conta/login?redirect=${encodeURIComponent(returnTo)}`,
  );

  if (!productId) {
    redirect(returnTo);
  }

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

  revalidatePath(returnTo);
  revalidatePath("/conta/favoritos");
  redirect(returnTo);
}

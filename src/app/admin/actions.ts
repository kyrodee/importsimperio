"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { asNumber, formBoolean, parseLines, slugify } from "@/lib/utils";

export type LoginState = {
  message?: string;
};

export async function loginAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { message: "Configure as variáveis do Supabase antes de acessar o painel." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const { error, data } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { message: "E-mail ou senha inválidos." };
  }

  const { data: profile } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .eq("active", true)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { message: "Este usuário não está autorizado como administrador." };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

async function uniqueSlug(
  table: "categories" | "products",
  value: string,
  currentId?: string,
) {
  const { supabase } = await getAdminSession();
  const base = slugify(value) || "item";
  let candidate = base;
  let suffix = 2;

  while (suffix < 80) {
    let query = supabase.from(table).select("id").eq("slug", candidate);

    if (currentId) {
      query = query.neq("id", currentId);
    }

    const { data } = await query.maybeSingle();

    if (!data) {
      return candidate;
    }

    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return `${base}-${Date.now()}`;
}

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath("/sitemap.xml");
}

export async function createCategoryAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Nome da categoria é obrigatório.");
  }

  const slug = await uniqueSlug("categories", String(formData.get("slug") || name));

  await supabase.from("categories").insert({
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || "/images/hero-imports.png",
    icon: String(formData.get("icon") ?? "").trim() || "package",
    sort_order: asNumber(formData.get("sort_order")) ?? 0,
    active: formBoolean(formData.get("active")),
  });

  revalidateCatalog();
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function updateCategoryAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!id || !name) {
    throw new Error("Categoria inválida.");
  }

  const slugInput = String(formData.get("slug") || name);
  const slug = await uniqueSlug("categories", slugInput, id);

  await supabase
    .from("categories")
    .update({
      name,
      slug,
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || "/images/hero-imports.png",
      icon: String(formData.get("icon") ?? "").trim() || "package",
      sort_order: asNumber(formData.get("sort_order")) ?? 0,
      active: formBoolean(formData.get("active")),
    })
    .eq("id", id);

  revalidateCatalog();
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function deleteCategoryAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Categoria inválida.");
  }

  await supabase.from("categories").delete().eq("id", id);

  revalidateCatalog();
  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

function productPayload(formData: FormData, slug: string) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    slug,
    description: String(formData.get("description") ?? "").trim(),
    full_description: String(formData.get("full_description") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    price: asNumber(formData.get("price")),
    currency: "BRL",
    status: String(formData.get("status") ?? "in_stock") as "in_stock" | "pre_order",
    code: String(formData.get("code") ?? "").trim() || null,
    featured: formBoolean(formData.get("featured")),
    active: formBoolean(formData.get("active")),
    sort_order: asNumber(formData.get("sort_order")) ?? 0,
  };
}

async function replaceProductImages(productId: string, imageUrls: string[], productName: string) {
  const { supabase } = await getAdminSession();

  await supabase.from("product_images").delete().eq("product_id", productId);

  if (imageUrls.length === 0) {
    return;
  }

  await supabase.from("product_images").insert(
    imageUrls.map((url, index) => ({
      product_id: productId,
      url,
      alt_text: productName,
      sort_order: index + 1,
      is_primary: index === 0,
    })),
  );
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Nome do produto é obrigatório.");
  }

  const slug = await uniqueSlug("products", String(formData.get("slug") || name));
  const payload = productPayload(formData, slug);
  const { data, error } = await supabase.from("products").insert(payload).select("id").single();

  if (error || !data) {
    throw new Error(error?.message ?? "Não foi possível criar o produto.");
  }

  await replaceProductImages(data.id, parseLines(formData.get("image_urls")), name);

  revalidateCatalog();
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateProductAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!id || !name) {
    throw new Error("Produto inválido.");
  }

  const slug = await uniqueSlug("products", String(formData.get("slug") || name), id);
  const payload = productPayload(formData, slug);
  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await replaceProductImages(id, parseLines(formData.get("image_urls")), name);

  revalidateCatalog();
  revalidatePath(`/produtos/${slug}`);
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProductAction(formData: FormData) {
  const { supabase } = await getAdminSession();
  const id = String(formData.get("id") ?? "");

  if (!id) {
    throw new Error("Produto inválido.");
  }

  await supabase.from("products").delete().eq("id", id);

  revalidateCatalog();
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function updateSettingsAction(formData: FormData) {
  const { supabase } = await getAdminSession();

  await supabase.from("site_settings").upsert({
      id: true,
      company_name: String(formData.get("company_name") ?? "").trim() || "Império Imports",
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      instagram: String(formData.get("instagram") ?? "").trim(),
      institutional_text: String(formData.get("institutional_text") ?? "").trim(),
      hero_title: String(formData.get("hero_title") ?? "").trim(),
      hero_subtitle: String(formData.get("hero_subtitle") ?? "").trim(),
      featured_headline: String(formData.get("featured_headline") ?? "").trim(),
      banners: parseLines(formData.get("banners")).map((url) => ({ url })),
      highlights: parseLines(formData.get("highlights")).map((label) => ({ label })),
    });

  revalidateCatalog();
  revalidatePath("/admin/configuracoes");
  redirect("/admin/configuracoes");
}

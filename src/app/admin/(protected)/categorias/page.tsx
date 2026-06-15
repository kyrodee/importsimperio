import { Trash2 } from "lucide-react";
import { CategoryForm } from "@/components/admin/category-form";
import { Button } from "@/components/ui/button";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { getCategories } from "@/lib/db";

export const metadata = {
  title: "Categorias | Império Imports",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ includeInactive: true });

  return (
    <div className="grid gap-8">
      <header>
        <p className="text-sm font-medium text-gold-strong">Catálogo</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Categorias</h1>
        <p className="mt-2 text-sm text-muted">
          Crie categorias ilimitadas e organize a navegação do catálogo sem alterar código.
        </p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-white">Nova categoria</h2>
        <CategoryForm action={createCategoryAction} />
      </section>

      <section className="grid gap-4">
        <h2 className="text-lg font-semibold text-white">Categorias cadastradas</h2>
        {categories.map((category) => (
          <details key={category.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{category.name}</p>
                <p className="mt-1 text-xs text-muted">/{category.slug}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
                {category.active ? "Ativa" : "Inativa"}
              </span>
            </summary>
            <div className="mt-5 border-t border-white/10 pt-5">
              <CategoryForm action={updateCategoryAction} category={category} />
              <form action={deleteCategoryAction} className="mt-4 flex justify-end">
                <input type="hidden" name="id" value={category.id} />
                <Button type="submit" variant="danger" icon={<Trash2 size={15} />}>
                  Excluir categoria
                </Button>
              </form>
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}

import { Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/form-controls";
import { Button } from "@/components/ui/button";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  product?: Product | null;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Nome">
          <TextInput name="name" required defaultValue={product?.name} placeholder="Ex: Fone Bluetooth Premium" />
        </Field>
        <Field label="Slug" hint="Opcional. Se vazio, o sistema cria automaticamente.">
          <TextInput name="slug" defaultValue={product?.slug} placeholder="fone-bluetooth-premium" />
        </Field>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Categoria">
          <SelectInput name="category_id" defaultValue={product?.category_id ?? ""}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Preço">
          <TextInput name="price" inputMode="decimal" defaultValue={product?.price ?? ""} placeholder="389,90" />
        </Field>

        <Field label="Status">
          <SelectInput name="status" defaultValue={product?.status ?? "in_stock"}>
            <option value="in_stock">Em estoque</option>
            <option value="pre_order">Sob encomenda</option>
          </SelectInput>
        </Field>
      </div>

      <Field label="Descrição curta">
        <TextArea
          name="description"
          required
          defaultValue={product?.description}
          placeholder="Resumo elegante para cards e SEO."
        />
      </Field>

      <Field label="Descrição completa">
        <TextArea
          name="full_description"
          defaultValue={product?.full_description ?? ""}
          placeholder="Detalhes, origem, disponibilidade, observações comerciais."
        />
      </Field>

      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Código do produto">
          <TextInput name="code" defaultValue={product?.code ?? ""} placeholder="IMP-001" />
        </Field>
        <Field label="Ordem">
          <TextInput name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} />
        </Field>
        <div className="grid gap-3">
          <Toggle label="Produto ativo" name="active" defaultChecked={product?.active ?? true} />
          <Toggle label="Marcar como destaque" name="featured" defaultChecked={product?.featured ?? false} />
        </div>
      </div>

      <Field label="Imagens">
        <ImageUploadField defaultUrls={product?.images.map((image) => image.url) ?? ["/images/hero-imports.png"]} />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" icon={<Save size={16} />}>
          Salvar produto
        </Button>
      </div>
    </form>
  );
}

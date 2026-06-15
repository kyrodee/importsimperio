import { Save } from "lucide-react";
import {
  Field,
  SelectInput,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/form-controls";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/types";

const iconOptions = [
  ["smartphone", "Eletrônicos"],
  ["sparkles", "Perfumaria"],
  ["cable", "Acessórios"],
  ["shield-plus", "Farmácia"],
  ["laptop", "Informática"],
  ["package", "Utilidades"],
  ["globe-2", "Importados"],
  ["layers-3", "Diversos"],
];

export function CategoryForm({
  action,
  category,
}: {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Nome">
          <TextInput name="name" required defaultValue={category?.name} placeholder="Eletrônicos" />
        </Field>
        <Field label="Slug" hint="Opcional. Se vazio, será gerado pelo sistema.">
          <TextInput name="slug" defaultValue={category?.slug} placeholder="eletronicos" />
        </Field>
      </div>

      <Field label="Descrição">
        <TextArea name="description" defaultValue={category?.description ?? ""} />
      </Field>

      <div className="grid gap-5 lg:grid-cols-3">
        <Field label="Imagem">
          <ImageUploadField
            name="image_url"
            maxUrls={1}
            defaultUrls={category?.image_url ? [category.image_url] : []}
          />
        </Field>
        <Field label="Ícone">
          <SelectInput name="icon" defaultValue={category?.icon ?? "package"}>
            {iconOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Ordem">
          <TextInput name="sort_order" type="number" defaultValue={category?.sort_order ?? 0} />
        </Field>
      </div>

      <Toggle label="Categoria ativa" name="active" defaultChecked={category?.active ?? true} />

      <div className="flex justify-end">
        <Button type="submit" variant="primary" icon={<Save size={16} />}>
          Salvar categoria
        </Button>
      </div>
    </form>
  );
}

import { Save } from "lucide-react";
import { Field, TextArea, TextInput } from "@/components/admin/form-controls";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function SettingsForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="Empresa">
          <TextInput name="company_name" defaultValue={settings.company_name} />
        </Field>
        <Field label="WhatsApp">
          <TextInput name="whatsapp" defaultValue={settings.whatsapp} />
        </Field>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Field label="E-mail">
          <TextInput name="email" type="email" defaultValue={settings.email} />
        </Field>
        <Field label="Instagram">
          <TextInput name="instagram" defaultValue={settings.instagram} />
        </Field>
      </div>

      <Field label="Título do hero">
        <TextInput name="hero_title" defaultValue={settings.hero_title} />
      </Field>

      <Field label="Subtítulo do hero">
        <TextArea name="hero_subtitle" defaultValue={settings.hero_subtitle} />
      </Field>

      <Field label="Texto institucional">
        <TextArea name="institutional_text" defaultValue={settings.institutional_text} />
      </Field>

      <Field label="Headline de destaques">
        <TextInput name="featured_headline" defaultValue={settings.featured_headline} />
      </Field>

      <Field label="Banners" hint="Você pode enviar imagens direto para o Supabase ou colar a URL.">
        <ImageUploadField
          name="banners"
          defaultUrls={settings.banners.map((banner) => String(banner.url ?? ""))}
        />
      </Field>

      <Field label="Destaques da página inicial" hint="Um destaque por linha.">
        <TextArea
          name="highlights"
          defaultValue={settings.highlights.map((highlight) => String(highlight.label ?? "")).join("\n")}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" icon={<Save size={16} />}>
          Salvar configurações
        </Button>
      </div>
    </form>
  );
}

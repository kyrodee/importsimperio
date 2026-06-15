import { SettingsForm } from "@/components/admin/settings-form";
import { updateSettingsAction } from "@/app/admin/actions";
import { getSiteSettings } from "@/lib/db";

export const metadata = {
  title: "Configurações | Império Imports",
};

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="grid gap-8">
      <header>
        <p className="text-sm font-medium text-gold-strong">Site</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Configurações</h1>
        <p className="mt-2 text-sm text-muted">
          Atualize contatos, texto institucional, banners e destaques da página inicial.
        </p>
      </header>

      <SettingsForm settings={settings} action={updateSettingsAction} />
    </div>
  );
}

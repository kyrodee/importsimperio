import Link from "next/link";
import type { Category, SiteSettings } from "@/lib/types";

export function SiteFooter({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-white">{settings.company_name}</h3>
            <p className="mt-4 text-sm text-muted">A sua loja de confiança para importados.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Categorias</h3>
            <ul className="mt-4 space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categorias/${cat.slug}`} className="text-sm text-muted hover:text-white">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Contato</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted">WhatsApp: {settings.whatsapp}</li>
              <li className="text-sm text-muted">Instagram: {settings.instagram}</li>
              <li className="text-sm text-muted">E-mail: {settings.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 flex justify-between items-center text-xs text-muted">
          <p>© {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

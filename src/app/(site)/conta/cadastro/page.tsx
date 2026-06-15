import Link from "next/link";
import { CustomerAuthForm } from "@/components/account/customer-auth-form";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export const metadata = {
  title: "Criar conta",
  description: "Crie sua conta para salvar carrinho e favoritos na Império Imports.",
};

export default async function CustomerSignupPage({ searchParams }: PageProps) {
  const { redirect = "/conta" } = await searchParams;

  return (
    <main className="bg-background">
      <section className="mx-auto grid min-h-[calc(100svh-96px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_460px] lg:px-8">
        <div>
          <Badge tone="gold">Cadastro</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Crie sua conta e mantenha suas escolhas sempre salvas.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            Favoritos e carrinho ficam vinculados ao seu login, prontos para continuar a compra ou solicitar atendimento.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Criar conta</h2>
          <CustomerAuthForm mode="signup" redirectTo={redirect} />
          <p className="mt-5 text-sm text-muted">
            Já tem conta?{" "}
            <Link href={`/conta/login?redirect=${encodeURIComponent(redirect)}`} className="text-gold-strong">
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

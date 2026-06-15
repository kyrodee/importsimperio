import Link from "next/link";
import { CustomerAuthForm } from "@/components/account/customer-auth-form";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  searchParams: Promise<{ redirect?: string; error?: string }>;
};

export const metadata = {
  title: "Entrar na conta",
  description: "Entre na sua conta para manter carrinho e favoritos salvos.",
};

export default async function CustomerLoginPage({ searchParams }: PageProps) {
  const { redirect = "/conta", error } = await searchParams;

  return (
    <main className="bg-background">
      <section className="mx-auto grid min-h-[calc(100svh-96px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_440px] lg:px-8">
        <div>
          <Badge tone="gold">Área do cliente</Badge>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Entre para salvar carrinho, favoritos e acompanhar sua curadoria.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted">
            Seu carrinho fica salvo na conta e você pode voltar depois para pedir orçamento dos produtos escolhidos.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Login</h2>
          {error === "config" ? (
            <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">
              Configure as variáveis do Supabase para liberar contas de cliente.
            </p>
          ) : null}
          <CustomerAuthForm mode="login" redirectTo={redirect} />
          <p className="mt-5 text-sm text-muted">
            Ainda não tem conta?{" "}
            <Link href={`/conta/cadastro?redirect=${encodeURIComponent(redirect)}`} className="text-gold-strong">
              Criar cadastro
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

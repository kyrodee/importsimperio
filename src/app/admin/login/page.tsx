import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { BrandLogo } from "@/components/site/logo";

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const metadata = {
  title: "Login administrativo | Império Imports",
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/40">
        <BrandLogo variant="full" />

        <div className="mt-10">
          <div className="flex size-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold-strong">
            <ShieldCheck size={20} />
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white">
            Acesso administrativo
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Entre com uma conta autorizada no Supabase Auth e cadastrada na tabela de administradores.
          </p>
        </div>

        {error === "config" ? (
          <p className="mt-5 rounded-lg border border-amber-300/20 bg-amber-400/10 p-3 text-sm text-amber-100">
            Configure o `.env.local` com as chaves do Supabase para liberar o painel.
          </p>
        ) : null}

        {error === "permission" ? (
          <p className="mt-5 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
            Usuário sem permissão administrativa.
          </p>
        ) : null}

        <LoginForm />
      </section>
    </main>
  );
}

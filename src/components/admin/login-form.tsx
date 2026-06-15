"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

const initialState: LoginState = {};

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-medium text-white">E-mail</span>
        <span className="relative">
          <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
            placeholder="admin@empresa.com"
          />
        </span>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-medium text-white">Senha</span>
        <span className="relative">
          <LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            required
            type="password"
            name="password"
            autoComplete="current-password"
            className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
            placeholder="••••••••"
          />
        </span>
      </label>

      {state.message ? (
        <p className="rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending ? "Entrando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}

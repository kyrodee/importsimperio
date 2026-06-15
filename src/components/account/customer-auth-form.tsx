"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import {
  customerLoginAction,
  customerSignUpAction,
  type CustomerAuthState,
} from "@/app/conta/actions";
import { Button } from "@/components/ui/button";

const initialState: CustomerAuthState = {};

export function CustomerAuthForm({
  mode,
  redirectTo,
}: {
  mode: "login" | "signup";
  redirectTo: string;
}) {
  const action = mode === "login" ? customerLoginAction : customerSignUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="mt-8 grid gap-4">
      <input type="hidden" name="redirect" value={redirectTo} />

      {isSignup ? (
        <>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">Nome</span>
            <span className="relative">
              <UserRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                name="full_name"
                required
                className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
                placeholder="Seu nome"
              />
            </span>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-white">WhatsApp</span>
            <span className="relative">
              <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                name="phone"
                className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
                placeholder="(44) 99999-9999"
              />
            </span>
          </label>
        </>
      ) : null}

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
            placeholder="voce@email.com"
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
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={6}
            className="focus-ring h-12 w-full rounded-lg border border-white/10 bg-black/35 pl-11 pr-4 text-sm text-white placeholder:text-muted"
            placeholder="Mínimo 6 caracteres"
          />
        </span>
      </label>

      {state.message ? (
        <p className="rounded-lg border border-amber-300/20 bg-amber-400/10 p-3 text-sm leading-6 text-amber-100">
          {state.message}
        </p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" disabled={pending}>
        {pending
          ? "Aguarde..."
          : isSignup
            ? "Criar conta"
            : "Entrar"}
      </Button>
    </form>
  );
}

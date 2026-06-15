import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "focus-ring h-11 w-full rounded-lg border border-white/10 bg-black/35 px-3 text-sm text-white placeholder:text-muted";

export const textareaClass =
  "focus-ring min-h-28 w-full rounded-lg border border-white/10 bg-black/35 px-3 py-3 text-sm leading-6 text-white placeholder:text-muted";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-white">{label}</span>
      {children}
      {hint ? <span className="text-xs leading-5 text-muted">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: ComponentPropsWithoutRef<"input">) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(props: ComponentPropsWithoutRef<"textarea">) {
  return <textarea {...props} className={cn(textareaClass, props.className)} />;
}

export function SelectInput(props: ComponentPropsWithoutRef<"select">) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

export function Toggle({
  label,
  name,
  defaultChecked = true,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-[var(--gold)]"
      />
    </label>
  );
}

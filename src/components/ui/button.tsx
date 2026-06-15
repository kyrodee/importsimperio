import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-gold/70 bg-gold text-black hover:bg-gold-strong hover:border-gold-strong",
  secondary:
    "border-white/12 bg-white/[0.055] text-foreground hover:border-white/22 hover:bg-white/[0.09]",
  ghost:
    "border-transparent bg-transparent text-muted hover:bg-white/[0.06] hover:text-foreground",
  danger:
    "border-red-400/30 bg-red-500/10 text-red-100 hover:border-red-300/60 hover:bg-red-500/20",
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: ReactNode;
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: ReactNode;
};

export function ButtonLink({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition duration-200",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

type ExternalButtonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
  size?: keyof typeof sizes;
  icon?: ReactNode;
};

export function ExternalButtonLink({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  ...props
}: ExternalButtonLinkProps) {
  return (
    <a
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition duration-200",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </a>
  );
}

import type { HTMLAttributes } from "react";

// Minimal hand-written shadcn-style Badge.
type Variant = "default" | "secondary" | "outline" | "success";

const variants: Record<Variant, string> = {
  default:
    "bg-blue-600/10 text-blue-700 border-blue-600/25 dark:bg-blue-600/15 dark:text-blue-300 dark:border-blue-500/30",
  secondary:
    "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  outline:
    "bg-transparent text-zinc-700 border-zinc-300 dark:text-zinc-300 dark:border-zinc-700",
  success:
    "bg-emerald-600/10 text-emerald-700 border-emerald-600/25 dark:bg-emerald-600/15 dark:text-emerald-300 dark:border-emerald-500/30",
};

export function Badge({
  className = "",
  variant = "secondary",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

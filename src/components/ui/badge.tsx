import type { HTMLAttributes } from "react";

// Minimal hand-written shadcn-style Badge.
type Variant = "default" | "secondary" | "outline" | "success";

const variants: Record<Variant, string> = {
  default: "bg-blue-600/15 text-blue-300 border-blue-500/30",
  secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
  outline: "bg-transparent text-zinc-300 border-zinc-700",
  success: "bg-emerald-600/15 text-emerald-300 border-emerald-500/30",
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

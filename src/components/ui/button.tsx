import { forwardRef, type ButtonHTMLAttributes } from "react";

// Minimal hand-written shadcn-style Button (see README: shadcn CLI not used).
type Variant = "default" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  default:
    "bg-blue-600 text-white hover:bg-blue-500 disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400",
  secondary:
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 disabled:text-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:disabled:text-zinc-500",
  outline:
    "border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-100 disabled:text-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:disabled:text-zinc-500",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 disabled:text-zinc-400 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white dark:disabled:text-zinc-600",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-sm",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  ),
);
Button.displayName = "Button";

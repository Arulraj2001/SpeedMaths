import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "easy" | "medium" | "hard";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground shadow",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground",
    outline: "text-foreground border border-border",
    easy:
      "border-transparent bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    medium:
      "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    hard:
      "border-transparent bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

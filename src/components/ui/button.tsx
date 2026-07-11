"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "premium";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      default:
        "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg active:scale-98",
      premium:
        "bg-gradient-to-r from-primary via-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-indigo-500/25 dark:hover:shadow-indigo-500/10 hover:brightness-110 border border-indigo-400/20 active:scale-98",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm active:scale-98",
      outline:
        "border border-border bg-transparent hover:bg-secondary hover:text-secondary-foreground active:scale-98",
      ghost:
        "hover:bg-secondary hover:text-secondary-foreground active:scale-98",
      link:
        "text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto",
    };

    const sizes = {
      sm: "h-9 px-3 text-sm gap-1.5",
      md: "h-11 px-5 text-sm md:text-base gap-2",
      lg: "h-13 px-7 text-base md:text-lg gap-2.5",
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        whileHover={isDisabled ? {} : { scale: 1.015 }}
        whileTap={isDisabled ? {} : { scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

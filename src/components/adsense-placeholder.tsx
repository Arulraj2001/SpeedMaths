"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Zap, Brain, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdSensePlaceholderProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSensePlaceholder({ slot, format = "auto", className }: AdSensePlaceholderProps) {
  
  if (format === "horizontal") {
    return (
      <div className={cn(
        "my-6 p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-violet-500/5 to-indigo-500/5 backdrop-blur-sm flex flex-row items-center justify-between gap-4 print:hidden select-none overflow-hidden relative group transition-all duration-300 hover:shadow-md hover:border-primary/30 min-h-[90px]",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-violet-600 shadow-md">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              SpeedMaths Practice Cockpit
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold uppercase tracking-wider scale-90">Free</span>
            </h4>
            <p className="text-[11px] text-muted-foreground hidden sm:block mt-0.5">
              Supercharge your calculation speed and master mental math with interactive dynamic drills.
            </p>
          </div>
        </div>

        <Link href="/practice" className="flex-shrink-0">
          <button className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-gradient-to-r from-primary to-indigo-600 text-white shadow hover:brightness-110 active:scale-98 text-xs h-9 px-3.5 gap-1.5">
            <span>Start Practice</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    );
  }

  if (format === "vertical") {
    return (
      <div className={cn(
        "my-6 p-6 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-violet-500/5 to-indigo-500/5 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-6 print:hidden select-none overflow-hidden relative group min-h-[500px]",
        className
      )}>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 shadow-lg">
          <Brain className="h-7 w-7 text-white" />
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-extrabold text-foreground tracking-tight leading-tight">
            Sharpen Your Mind
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Learn arithmetic rules and train daily to estimate, multiply, and solve questions faster in your head.
          </p>
        </div>

        <div className="w-full space-y-2 text-left font-mono text-[10px] text-muted-foreground/80 max-w-xs border-y border-border/20 py-4 my-2">
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary flex-shrink-0" />
            <span>Multiplication tables & chart drills</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary flex-shrink-0" />
            <span>Vedic math squaring shortcuts</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-primary flex-shrink-0" />
            <span>High-performance timing cockpit</span>
          </div>
        </div>

        <Link href="/practice" className="w-full">
          <button className="w-full inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg hover:brightness-110 active:scale-98 text-xs h-10 px-4 gap-1.5">
            <span>Launch Game Cockpit</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cn(
      "my-6 p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-violet-500/5 to-indigo-500/5 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-4 print:hidden select-none overflow-hidden relative group min-h-[250px]",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md">
        <Sparkles className="h-5.5 w-5.5 text-white" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h4 className="text-sm font-extrabold text-foreground tracking-tight flex justify-center items-center gap-2">
          Train Your Mental Math Skills
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-bold uppercase tracking-wider">100% Free</span>
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Master times tables, squares, powers, fractions, and division tricks with high-precision drills. Zero ads, zero tracking.
        </p>
      </div>

      <Link href="/practice">
        <button className="inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg hover:brightness-110 active:scale-98 text-xs h-9.5 px-4 gap-1.5">
          <span>Launch Practice Cockpit</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </Link>
    </div>
  );
}

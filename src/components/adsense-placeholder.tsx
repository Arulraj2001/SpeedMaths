"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle?: object[];
  }
}

interface AdSensePlaceholderProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdSensePlaceholder({ slot, format = "auto", className }: AdSensePlaceholderProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Suppress logs for local/Adblock testing
    }
  }, []);

  return (
    <div className={cn(
      "my-6 p-4 border border-dashed border-border/80 rounded-xl bg-secondary/10 flex flex-col items-center justify-center min-h-[90px] text-center print:hidden select-none",
      className
    )}>
      <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/80">Advertisement Area</span>
      <span className="text-[8px] font-mono text-muted-foreground/60 mt-1 uppercase">Google AdSense • Slot {slot} • Format {format}</span>
      
      {/* Ins placeholder adsense */}
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-1234567890123456"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

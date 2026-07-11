"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

export function MobileStickyAd() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 bg-background/95 border-t border-border/60 md:hidden flex flex-col items-center justify-center print:hidden shadow-2xl">
      <div className="w-full max-w-md relative flex flex-col items-center">
        
        {/* Close trigger button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-7 right-2 h-5 w-5 bg-card border border-border rounded-full flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground shadow-md"
          title="Dismiss Ad"
        >
          <X className="h-3 w-3" />
        </button>

        <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-0.5">Sponsored Ad</span>
        
        {/* Standard mobile banner anchor box */}
        <div className="w-full h-[50px] bg-secondary/25 border border-dashed border-border/80 rounded flex items-center justify-center select-none">
          <span className="text-[9px] font-mono text-muted-foreground/60">MOBILE STICKY ANCHOR • SLOT 5555555555</span>
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { Brain } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] space-y-6">
      <div className="relative">
        {/* Glowing outer blur */}
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border/80 shadow-2xl">
          <Brain className="h-8 w-8 text-primary animate-bounce" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-sm font-extrabold tracking-tight text-foreground">Syncing Arithmetic Workspace...</h3>
        <p className="text-xs text-muted-foreground font-medium animate-pulse">Assembling tables and practice drills...</p>
      </div>
    </div>
  );
}

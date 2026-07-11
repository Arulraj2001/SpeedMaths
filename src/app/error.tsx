"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Runtime exception caught by SpeedMaths boundary:", error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-lg">
        <AlertCircle className="h-8 w-8 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">500 - Execution Failure</h1>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          An unexpected runtime crash occurred inside the arithmetic workspace. Click reset to recover state.
        </p>
      </div>
      <Button
        variant="premium"
        size="sm"
        onClick={() => reset()}
        className="cursor-pointer font-semibold"
        leftIcon={<RotateCcw className="h-4 w-4" />}
      >
        Reset Workspace
      </Button>
    </div>
  );
}

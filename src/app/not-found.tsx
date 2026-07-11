import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-lg">
        <HelpCircle className="h-8 w-8 animate-pulse" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">404 - Equation Not Found</h1>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
          The arithmetic pathway or math tutorial slug you are looking for does not exist.
        </p>
      </div>
      <Link href="/">
        <Button variant="outline" size="sm" className="cursor-pointer font-semibold" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

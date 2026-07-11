"use client";

import React from "react";
import { Printer, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TimesTableActionsProps {
  number: number;
  rows: Array<{ text: string; result: number }>;
}

export function TimesTableActions({ rows }: TimesTableActionsProps) {
  return (
    <div className="pt-2 flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (typeof window !== "undefined") window.print();
        }}
        className="cursor-pointer text-xs"
        leftIcon={<Printer className="h-4 w-4" />}
      >
        Print Grid
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
          window.speechSynthesis.cancel();
          const text = rows.map(r => `${r.text} is ${r.result}`).join(". ");
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.1;
          window.speechSynthesis.speak(utterance);
        }}
        className="cursor-pointer text-xs"
        leftIcon={<Volume2 className="h-4 w-4 text-primary" />}
      >
        Speak Table
      </Button>
    </div>
  );
}

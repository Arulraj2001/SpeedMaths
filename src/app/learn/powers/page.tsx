"use client";

import React, { useState } from "react";
import { Printer, TrendingUp, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

interface PowerConfig {
  base: number;
  limit: number;
  description: string;
}

export default function PowersPage() {
  const [copiedBase, setCopiedBase] = useState<number | null>(null);
  const { toast } = useToast();

  const configs: PowerConfig[] = [
    { base: 2, limit: 16, description: "Powers of 2: Essential for bits, computers, and binary calculations." },
    { base: 3, limit: 10, description: "Powers of 3: Common in exponential growth equations." },
    { base: 5, limit: 8, description: "Powers of 5: Highly structured decimals and fraction values." },
    { base: 10, limit: 10, description: "Powers of 10: Decimal place value benchmarks." },
    { base: 11, limit: 6, description: "Powers of 11: Combinatorics Pascal triangle binomial matches." },
    { base: 12, limit: 6, description: "Powers of 12: Duodecimal base measurements." },
  ];

  const handleCopy = (base: number, limit: number) => {
    const lines = Array.from({ length: limit + 1 }, (_, i) => `${base}^${i} = ${Math.pow(base, i)}`);
    const text = `Power Table of Base ${base}\n-------------------\n${lines.join("\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedBase(base);
      toast(`Power Series of Base ${base} copied.`, "success");
      setTimeout(() => setCopiedBase(null), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Power Tables</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review exponential series for key base digits 2, 3, 5, 10, 11, and 12.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print Tables
          </Button>
        </div>
      </div>

      {/* Grid of Power Series */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-8">
        {configs.map((config) => {
          const isCopied = copiedBase === config.base;
          
          return (
            <Card
              key={config.base}
              className="hover:border-primary/20 transition-all duration-300 flex flex-col justify-between bg-card/60 backdrop-blur-sm print:bg-white print:border print:border-black/10 print:shadow-none"
            >
              <CardHeader className="pb-3 border-b border-border/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-lg md:text-xl font-bold">
                      Base {config.base}
                    </CardTitle>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(config.base, config.limit)}
                    className="p-1.5 rounded-lg border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors print:hidden"
                    title={`Copy Base ${config.base} series`}
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <CardDescription className="text-xs pt-1.5 leading-relaxed">
                  {config.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 pt-4 flex-grow">
                <div className="space-y-1 font-mono text-xs md:text-sm">
                  {Array.from({ length: config.limit + 1 }, (_, exponent) => {
                    const value = Math.pow(config.base, exponent);
                    return (
                      <div
                        key={exponent}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded hover:bg-secondary/40 transition-colors"
                      >
                        <div className="flex items-baseline gap-1">
                          <span className="font-extrabold text-foreground">{config.base}</span>
                          <sup className="text-[10px] text-primary font-bold">{exponent}</sup>
                        </div>
                        <div className="text-muted-foreground font-sans text-xs">=</div>
                        <div className="font-extrabold text-foreground text-right">
                          {value.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

    </div>
  );
}

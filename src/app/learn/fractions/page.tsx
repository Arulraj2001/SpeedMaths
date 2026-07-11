"use client";

import React, { useState, useMemo } from "react";
import { Search, Printer, Copy, Check, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface FractionItem {
  id: string;
  n: number;
  d: number;
  decimal: number;
  percentage: number;
}

// Greatest Common Divisor helper to simplify fractions (defined at file scope)
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export default function FractionsPage() {
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = (item: FractionItem) => {
    const text = `${item.n}/${item.d} = ${item.decimal.toFixed(4)} = ${item.percentage.toFixed(2)}%`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(item.id);
      toast(`Fraction ${item.n}/${item.d} details copied to clipboard.`, "success");
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Generate unique proper fractions
  const fractions: FractionItem[] = useMemo(() => {
    const list: FractionItem[] = [];
    const denominators = [2, 3, 4, 5, 6, 8, 10, 12, 16];

    denominators.forEach((d) => {
      for (let n = 1; n < d; n++) {
        // If simplified, add to list
        if (gcd(n, d) === 1) {
          list.push({
            id: `frac-${n}-${d}`,
            n,
            d,
            decimal: n / d,
            percentage: (n / d) * 100,
          });
        }
      }
    });

    // Sort ascending by value
    return list.sort((a, b) => a.decimal - b.decimal);
  }, []);

  // Filter based on search query
  const filteredFractions = useMemo(() => {
    return fractions.filter((item) => {
      const fractionStr = `${item.n}/${item.d}`;
      const searchLower = search.toLowerCase();
      return (
        fractionStr.includes(searchLower) ||
        item.decimal.toFixed(4).includes(searchLower) ||
        item.percentage.toFixed(2).includes(searchLower)
      );
    });
  }, [fractions, search]);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Fractions & Decimals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Instantly recall conversions between fractions, decimals, and percentage values.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print Sheet
          </Button>
        </div>
      </div>

      {/* Search Filter Header */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm print:hidden">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search fractions (e.g. 3/8)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Grid displaying cards */}
      {filteredFractions.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40 print:hidden">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No conversions match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-8">
          {filteredFractions.map((item) => {
            const isCopied = copiedId === item.id;
            
            return (
              <Card
                key={item.id}
                className="hover:border-primary/20 transition-all duration-300 flex flex-col justify-between bg-card/60 backdrop-blur-sm print:bg-white print:border print:border-black/10 print:shadow-none"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Top Bar info */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                      {item.n} / {item.d}
                    </div>
                    <button
                      onClick={() => handleCopy(item)}
                      className="p-1.5 rounded-lg border border-border/80 hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors print:hidden"
                      title="Copy fraction detail"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Calculations breakdown */}
                  <div className="grid grid-cols-2 gap-4 border-y border-border/30 py-3 font-mono text-sm">
                    <div>
                      <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Decimal</span>
                      <span className="text-base font-extrabold text-foreground">{item.decimal.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">Percentage</span>
                      <span className="text-base font-extrabold text-foreground">{item.percentage.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Grid visual example */}
                  <div className="space-y-1.5 pt-1">
                    <span className="block text-[10px] text-muted-foreground uppercase font-sans font-bold">
                      Visual Representation ({item.n} of {item.d} sectors)
                    </span>
                    
                    {/* Visual box segmented bar */}
                    <div 
                      className="flex h-5 w-full border border-border/80 rounded overflow-hidden bg-secondary/50"
                      style={{ contentVisibility: "auto" }}
                    >
                      {Array.from({ length: item.d }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex-1 border-r border-border/30 last:border-r-0 transition-colors duration-500",
                            i < item.n 
                              ? "bg-gradient-to-r from-primary to-indigo-600" 
                              : "bg-transparent"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      )}

    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, ArrowLeft, ArrowRight, 
  Layers, Lightbulb, Lock, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { numberTypes } from "@/data/number-types";
import { mathCheckers } from "@/lib/math-utils";

export default function NumberTypeClient({ type }: { type: string }) {
  const { toast } = useToast();

  const data = numberTypes.find((t) => t.id === type);

  // Trigger Toast when practice drills are clicked
  const handlePracticeClick = () => {
    if (!data) return;
    toast(`Interactive Speed Drills for ${data.name} will launch in Phase 3!`, "info");
  };

  const getDifficultyBadge = (diff: "Easy" | "Medium" | "Hard") => {
    const badgeMap = {
      Easy: <Badge variant="easy">Easy</Badge>,
      Medium: <Badge variant="medium">Medium</Badge>,
      Hard: <Badge variant="hard">Hard</Badge>,
    };
    return badgeMap[diff];
  };

  // Generate dynamic examples based on checkers
  const examples = React.useMemo(() => {
    if (!data) return [];
    
    // If it has predefined static examples (like Irrational/Real), use them
    if (data.staticExamples) {
      return data.staticExamples;
    }

    const checker = mathCheckers[data.id];
    if (!checker) return [];

    const list: number[] = [];
    let current = 0;
    
    // Start search indexes appropriately
    if (data.id === "natural" || data.id === "strong" || data.id === "harshad" || data.id === "perfect" || data.id === "sunny") {
      current = 1;
    }

    // Search threshold up to 10,000 to prevent locking browser threads
    while (list.length < 20 && current < 10000) {
      if (checker(current)) {
        list.push(current);
      }
      current++;
    }

    return list.map(String);
  }, [data]);

  if (!data) {
    return (
      <div className="text-center py-20">
        <HelpCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Number Type Not Found</h1>
        <p className="text-muted-foreground mt-2">The requested classification does not exist.</p>
        <Link href="/learn/number-types" className="mt-6 inline-block text-primary hover:underline">
          Return to Glossary
        </Link>
      </div>
    );
  }

  // Find related topics data
  const relatedData = numberTypes.filter((t) => data.relatedTopics.includes(t.id));

  return (
    <div className="space-y-8 pb-10">
      
      {/* Return button */}
      <div className="print:hidden">
        <Link
          href="/learn/number-types"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Glossary</span>
        </Link>
      </div>

      {/* Main Title Metadata Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border/40 backdrop-blur-sm relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex flex-wrap items-center gap-3">
            {getDifficultyBadge(data.difficulty)}
            <Badge variant="outline">Classification Module</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {data.name}
          </h1>
          <div className="font-mono text-sm md:text-base text-primary font-bold">
            Algebraic Model: {data.formula}
          </div>
        </div>

        {/* Action Drill Trigger */}
        <Button
          variant="premium"
          size="md"
          className="print:hidden flex-shrink-0 cursor-pointer shadow-lg"
          onClick={handlePracticeClick}
          leftIcon={<Lock className="h-4.5 w-4.5" />}
        >
          Practice Drills (Phase 3)
        </Button>
      </div>

      {/* Grid containing definition and examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Definition panel */}
        <Card className="md:col-span-2 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="h-4.5 w-4.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider">Concept Definition</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base md:text-lg text-foreground leading-relaxed">
              {data.definition}
            </p>
            
            {/* Properties Accordion Bullet points */}
            <div className="pt-4 border-t border-border/30 space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mathematical Properties
              </span>
              <ul className="space-y-2.5">
                {data.properties.map((prop, index) => (
                  <li key={index} className="flex gap-2.5 items-start text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{prop}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Examples panel */}
        <Card className="md:col-span-1 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Positive Examples</span>
            </div>
          </CardHeader>
          <CardContent>
            {examples.length === 0 ? (
              <p className="text-xs text-muted-foreground">No positive numbers found under 10,000.</p>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
                {examples.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center h-9 px-3 rounded-lg border border-border bg-secondary/50 font-mono text-sm font-bold text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Cross-linking related topics */}
      {relatedData.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border/30 print:hidden">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Layers className="h-4.5 w-4.5" />
            <span className="text-xs font-bold uppercase tracking-wider">Related Classifications</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedData.map((rel) => (
              <Link
                key={rel.id}
                href={`/learn/number-types/${rel.id}`}
                className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-secondary/40 hover:border-primary/20 transition-all flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-sm group-hover:text-primary transition-colors">
                    {rel.name}
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {rel.formula}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

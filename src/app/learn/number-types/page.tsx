"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, HelpCircle, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { numberTypes } from "@/data/number-types";

export default function NumberTypesIndexPage() {
  const [search, setSearch] = useState("");

  const getDifficultyBadge = (diff: typeof numberTypes[number]["difficulty"]) => {
    const badgeMap = {
      Easy: <Badge variant="easy">Easy</Badge>,
      Medium: <Badge variant="medium">Medium</Badge>,
      Hard: <Badge variant="hard">Hard</Badge>,
    };
    return badgeMap[diff];
  };

  const filteredTypes = useMemo(() => {
    return numberTypes.filter((type) => {
      const searchLower = search.toLowerCase();
      return (
        type.name.toLowerCase().includes(searchLower) ||
        type.definition.toLowerCase().includes(searchLower) ||
        type.formula.toLowerCase().includes(searchLower)
      );
    });
  }, [search]);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Number Types Glossary</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Explore definitions, algebraic formulae, examples, and properties of 19 different number types.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border/40 backdrop-blur-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search number types (e.g. perfect)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      {/* Grid of Number Types */}
      {filteredTypes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No number types match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTypes.map((type) => (
            <Link
              key={type.id}
              href={`/learn/number-types/${type.id}`}
              className="group block h-full cursor-pointer"
            >
              <Card className="h-full flex flex-col justify-between glassmorphism group-hover:border-primary/30 group-hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                      <Hash className="h-4.5 w-4.5" />
                    </div>
                    {getDifficultyBadge(type.difficulty)}
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors">
                    {type.name}
                  </CardTitle>
                  <CardDescription className="pt-2 text-xs leading-relaxed font-mono truncate">
                    {type.formula}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 flex-grow">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {type.definition}
                  </p>
                </CardContent>

                <CardFooter className="pt-4 border-t border-border/30 flex items-center justify-between text-xs text-primary font-bold">
                  <span>Explore Rules</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimesTableActions } from "@/components/times-table-actions";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

interface Props {
  params: Promise<{ num: string }>;
}

// Generate static compilation params for numbers 1 to 50
export async function generateStaticParams() {
  return Array.from({ length: 50 }).map((_, i) => ({
    num: String(i + 1),
  }));
}

// Dynamic SEO headers for each number times table
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num } = await params;
  const val = parseInt(num);
  if (isNaN(val) || val < 1 || val > 100) return {};

  return {
    title: `${val} Times Table (Up to ${val} × 20) - Multiplication Guide`,
    description: `Learn the multiplication table of ${val} from ${val} × 1 to ${val} × 20. Access print layouts, audio triggers, and quick calculations guides.`,
    alternates: {
      canonical: `${SITE_URL}/tables/${num}`,
    }
  };
}

export default async function TimesTableDetailPage({ params }: Props) {
  const { num } = await params;
  const n = parseInt(num);

  if (isNaN(n) || n < 1 || n > 100) {
    return notFound();
  }

  // Create columns list
  const rows = Array.from({ length: 20 }).map((_, idx) => {
    const multiplier = idx + 1;
    return {
      text: `${n} × ${multiplier}`,
      result: n * multiplier,
    };
  });

  // Next and Prev variables
  const prevNum = n > 1 ? n - 1 : null;
  const nextNum = n < 100 ? n + 1 : null;

  // JSON-LD Breadcrumbs & Table list schema
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}` },
      { "@type": "ListItem", "position": 2, "name": "Tables", "item": `${SITE_URL}/tables` },
      { "@type": "ListItem", "position": 3, "name": `${n} Times Table`, "item": `${SITE_URL}/tables/${num}` }
    ]
  };

  const tableJson = {
    "@context": "https://schema.org",
    "@type": "Table",
    "name": `${n} Times Table Chart`,
    "description": `Multiplication values for number ${n} up to multiplier 20.`,
    "about": {
      "@type": "MathSolver",
      "name": `Multiplication of ${n}`
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(tableJson) }} />

      {/* Back link */}
      <div className="flex justify-between items-center text-xs">
        <Link href="/tables" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Times Tables</span>
        </Link>
        <span className="font-mono text-primary font-bold uppercase">Table of {n}</span>
      </div>

      {/* Main card */}
      <Card className="glassmorphism border-border/40 overflow-hidden">
        <CardHeader className="border-b border-border/20 space-y-3 pb-6">
          <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
            The {n} Times Table
          </CardTitle>
          <CardDescription className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Practice calculations for the multiplication grid of {n}. Review indices from ×1 up to ×20.
          </CardDescription>

          <TimesTableActions number={n} rows={rows} />
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          
          {/* Layout Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="border border-border/40 rounded-xl overflow-hidden divide-y divide-border/20">
              {rows.slice(0, 10).map((row, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 font-mono text-sm md:text-base hover:bg-secondary/20 transition-all">
                  <span className="text-muted-foreground font-semibold">{row.text}</span>
                  <span className="text-foreground font-extrabold">{row.result}</span>
                </div>
              ))}
            </div>

            <div className="border border-border/40 rounded-xl overflow-hidden divide-y divide-border/20">
              {rows.slice(10, 20).map((row, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 font-mono text-sm md:text-base hover:bg-secondary/20 transition-all">
                  <span className="text-muted-foreground font-semibold">{row.text}</span>
                  <span className="text-foreground font-extrabold">{row.result}</span>
                </div>
              ))}
            </div>

          </div>

        </CardContent>

        <CardFooter className="border-t border-border/20 bg-secondary/10 p-6 flex justify-between gap-4">
          {prevNum ? (
            <Link href={`/tables/${prevNum}`}>
              <Button variant="outline" size="sm" className="cursor-pointer text-xs" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                Table of {prevNum}
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextNum && (
            <Link href={`/tables/${nextNum}`}>
              <Button variant="outline" size="sm" className="cursor-pointer text-xs" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Table of {nextNum}
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>

      {/* Tables Detail Banner Ad */}
      <AdSensePlaceholder slot="4444444444" format="horizontal" />

      {/* Quick learn reference CTA */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-4 text-xs md:text-sm">
        <div className="space-y-1">
          <span className="block font-bold text-foreground">Practice math tables in the Cockpit</span>
          <span className="block text-xs text-muted-foreground">Test your response speed under active game modes.</span>
        </div>
        <Link href="/practice">
          <Button variant="premium" size="sm" className="cursor-pointer">
            Start Practice
          </Button>
        </Link>
      </div>

    </div>
  );
}

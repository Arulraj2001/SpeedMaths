import React from "react";
import Link from "next/link";
import { Network, FileText, ArrowRight, Table, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { articles } from "@/data/blog";
import { numberTypes } from "@/data/number-types";
import { Metadata } from "next";
import { SITE_URL, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SpeedMaths Sitemap",
  description: "Browse the SpeedMaths directory of practice tools, learning pages, number charts, and mental math tutorials.",
  alternates: {
    canonical: `${SITE_URL}/sitemap`
  }
};

export default function HtmlSitemapPage() {
  const breadcrumbJson = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Sitemap", url: "/sitemap" },
  ]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-6 border-b border-border/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <Network className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Platform Directory</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Access all learning workspaces, practices cockpit dials, and article guides.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Column 1: Core Pages & Learning Guides */}
        <div className="space-y-8">
          
          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
              <span>Core Application Routes</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Home Page</span>
              </Link>
              <Link href="/practice" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Practice Engine</span>
              </Link>
              <Link href="/analytics" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Analytics Stats</span>
              </Link>
              <Link href="/blog" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Speed Math Blog</span>
              </Link>
              <Link href="/faq" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>FAQ Portal</span>
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Contact Page</span>
              </Link>
            </div>
          </Card>

          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <GraduationCap className="h-4.5 w-4.5 text-primary" />
              <span>Learning Workspaces</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
              <Link href="/tables" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Times Tables (1-50)</span>
              </Link>
              <Link href="/squares" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Squares (1-100)</span>
              </Link>
              <Link href="/cubes" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Cubes (1-50)</span>
              </Link>
              <Link href="/fractions" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Fractions Decimals</span>
              </Link>
              <Link href="/powers" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Powers & Exponents</span>
              </Link>
              <Link href="/types-of-numbers" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Types of Numbers</span>
              </Link>
            </div>
          </Card>

          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              <span>Blog Articles & Hacks</span>
            </h2>
            <div className="flex flex-col gap-2 text-xs md:text-sm">
              {articles.map((art) => (
                <Link key={art.slug} href={`/blog/${art.slug}`} className="hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                  <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{art.title}</span>
                </Link>
              ))}
            </div>
          </Card>

        </div>

        {/* Column 2: Multiplication Tables & Number Types */}
        <div className="space-y-8">
          
          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <Table className="h-4.5 w-4.5 text-primary" />
              <span>Multiplication Charts</span>
            </h2>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-5 gap-2 pr-1.5 font-mono text-xs text-center select-none">
              {Array.from({ length: 50 }).map((_, i) => (
                <Link key={i} href={`/tables/${i + 1}`} className="p-1 border border-border/60 bg-secondary/10 rounded hover:bg-secondary/40 hover:text-primary transition-all">
                  Table {i + 1}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <Table className="h-4.5 w-4.5 text-primary" />
              <span>Number Characteristics</span>
            </h2>
            <div className="max-h-[220px] overflow-y-auto grid grid-cols-2 gap-2 pr-1.5 text-xs">
              {numberTypes.map((type) => (
                <Link key={type.id} href={`/learn/number-types/${type.id}`} className="p-1.5 border border-border/60 bg-secondary/10 rounded hover:bg-secondary/40 hover:text-primary transition-all truncate block capitalize">
                  {type.name}
                </Link>
              ))}
            </div>
          </Card>

          <Card className="glassmorphism border-border/40 p-6 space-y-4">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
              <FileText className="h-4.5 w-4.5 text-primary" />
              <span>Legal Disclosures</span>
            </h2>
            <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
              <Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Privacy Policy</span>
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Terms of Service</span>
              </Link>
              <Link href="/disclaimer" className="hover:text-primary transition-colors flex items-center gap-1">
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <span>Disclaimer</span>
              </Link>
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}

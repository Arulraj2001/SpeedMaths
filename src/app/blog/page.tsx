import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { articles } from "@/data/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mental Math Tips and Tricks — Free Guides for Students and Exam Preparation",
  description: "Step-by-step guides on mental multiplication, division shortcuts, percentage tricks, Vedic Maths techniques, and exam calculation strategies. Written for students preparing for SAT, GRE, GMAT, CAT, and banking exams.",
  alternates: {
    canonical: "https://speedmaths.com/blog",
  },
  openGraph: {
    title: "Mental Math Tips and Tricks — Free Guides for Students",
    description: "Step-by-step guides on mental multiplication, division shortcuts, percentage tricks, Vedic Maths techniques, and exam calculation strategies.",
    url: "https://speedmaths.com/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mental Math Tips and Tricks — Free Guides for Students",
    description: "Step-by-step guides on mental multiplication, division shortcuts, percentage tricks, Vedic Maths, and exam strategies.",
  }
};

export default function BlogIndexPage() {
  // JSON-LD BreadcrumbList Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://speedmaths.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://speedmaths.com/blog"
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-6 border-b border-border/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Speed Maths Blog</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Master calculation secrets, Vedic arithmetic formulas, and competitive examination shortcuts.
        </p>
      </div>

      {/* Index Between Content Ad */}
      <AdSensePlaceholder slot="3333333333" format="horizontal" />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.slug} className="glassmorphism border-border/40 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex justify-between items-center text-xs">
                <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold text-[9px] tracking-wider">
                  {article.category}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="font-mono">{article.readTime}</span>
                </div>
              </div>
              <CardTitle className="text-lg font-bold hover:text-primary transition-colors leading-tight line-clamp-2">
                <Link href={`/blog/${article.slug}`}>
                  {article.title}
                </Link>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {article.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="pt-2 border-t border-border/10 flex justify-between items-center bg-secondary/10">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-mono">{article.publishedDate}</span>
              </div>
              <Link href={`/blog/${article.slug}`}>
                <Button variant="outline" size="sm" className="h-8 px-3 cursor-pointer text-xs font-semibold" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  Read Article
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

    </div>
  );
}

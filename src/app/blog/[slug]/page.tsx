import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { articles } from "@/data/blog";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate static routes for all 6 articles
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Dynamic SEO meta tags per article slug
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} - SpeedMaths`,
    description: article.description,
    alternates: {
      canonical: `https://speedmaths.com/blog/${slug}`,
    },
    openGraph: {
      title: `${article.title} - SpeedMaths`,
      description: article.description,
      url: `https://speedmaths.com/blog/${slug}`,
      type: "article",
      publishedTime: article.publishedDate,
      authors: ["SpeedMaths Team"],
      images: [
        {
          url: "https://img.icons8.com/color/512/brain.png",
          width: 512,
          height: 512,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} - SpeedMaths`,
      description: article.description,
      images: ["https://img.icons8.com/color/512/brain.png"],
    }
  };
}

// Lightweight custom parser converting Markdown subsets to semantic HTML tags
function renderMarkdown(content: string) {
  const sections = content.split("\n\n");
  
  return sections.map((section, index) => {
    const trimmed = section.trim();
    if (!trimmed) return null;

    // Headings (##)
    if (trimmed.startsWith("## ")) {
      return (
        <h2 key={index} className="text-2xl font-extrabold text-foreground tracking-tight pt-6 pb-2 border-b border-border/10 mt-6">
          {trimmed.replace("## ", "")}
        </h2>
      );
    }

    // Sub-headings (###)
    if (trimmed.startsWith("### ")) {
      return (
        <h3 key={index} className="text-lg font-bold text-foreground tracking-tight pt-4 pb-1 mt-4">
          {trimmed.replace("### ", "")}
        </h3>
      );
    }

    // Bullet points lists (- )
    if (trimmed.startsWith("- ")) {
      const items = trimmed.split("\n").map(li => li.replace(/^-\s+/, ""));
      return (
        <ul key={index} className="list-disc list-inside space-y-2 py-2 pl-4 text-muted-foreground text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMath(item) }} />
          ))}
        </ul>
      );
    }

    // Tables (| )
    if (trimmed.startsWith("|")) {
      const rows = trimmed.split("\n").map(row => 
        row.split("|").map(col => col.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1)
      );
      
      // Filter separator borders like :--- or ---
      const headerRow = rows[0];
      const dataRows = rows.slice(2);

      return (
        <div key={index} className="border border-border/40 rounded-xl overflow-hidden my-6">
          <table className="w-full border-collapse text-xs md:text-sm font-mono">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/40">
                {headerRow.map((col, idx) => (
                  <th key={idx} className="p-3 text-left font-bold text-foreground">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-secondary/20 transition-colors">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="p-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: formatInlineMath(col) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Normal paragraph text
    return (
      <p 
        key={index} 
        className="text-sm md:text-base text-muted-foreground leading-relaxed my-4" 
        dangerouslySetInnerHTML={{ __html: formatInlineMath(trimmed) }}
      />
    );
  });
}

// Helper replacing mathematical block symbols to styled code tags
function formatInlineMath(text: string): string {
  let formatted = text;
  
  // Replaces inline LaTeX formula blocks like $$x^2$$
  formatted = formatted.replace(/\$\$(.*?)\$\$/g, '<code class="px-1.5 py-0.5 rounded bg-secondary/80 text-primary font-mono text-xs font-bold">$1</code>');
  formatted = formatted.replace(/\$(.*?)\$/g, '<code class="px-1.5 py-0.5 rounded bg-secondary/80 text-primary font-mono text-xs font-bold">$1</code>');
  
  // Replaces bold markers **bold**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-foreground">$1</strong>');
  
  // Replaces code blocks
  formatted = formatted.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs font-semibold">$1</code>');

  return formatted;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return notFound();

  // JSON-LD Schemas (Breadcrumbs, Article, FAQs)
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://speedmaths.com" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://speedmaths.com/blog" },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `https://speedmaths.com/blog/${slug}` }
    ]
  };

  const articleJson = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "description": article.description,
    "datePublished": "2026-07-11T12:00:00Z",
    "author": { "@type": "Organization", "name": "SpeedMaths" },
    "image": "https://img.icons8.com/color/512/brain.png"
  };

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const relatedArticles = articles.filter(a => article.related.includes(a.slug));

  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Schema Injections */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />

      {/* Back button */}
      <div className="flex justify-between items-center text-xs">
        <Link href="/blog" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-semibold">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Blog</span>
        </Link>
        <span className="font-mono text-muted-foreground uppercase">{article.category}</span>
      </div>

      {/* Header Ad */}
      <AdSensePlaceholder slot="1111111111" format="horizontal" className="my-2" />

      {/* Main Header */}
      <div className="space-y-4 border-b border-border/20 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="font-mono">{article.publishedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="prose prose-invert max-w-none">
        {renderMarkdown(article.content)}
      </div>

      {/* Between Content Ad */}
      <AdSensePlaceholder slot="2222222222" format="auto" />

      {/* FAQs list accordion layout */}
      <Card className="glassmorphism border-border/40 p-6 space-y-4 mt-12">
        <div className="flex items-center gap-1.5 border-b border-border/20 pb-3">
          <HelpCircle className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-base font-extrabold">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-border/20 space-y-4">
          {article.faq.map((item, idx) => (
            <div key={idx} className="pt-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground leading-snug">Q: {item.q}</h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">A: {item.a}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Related articles cross references */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-8 border-t border-border/20">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Related Math Guides
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => (
              <Link key={rel.slug} href={`/blog/${rel.slug}`}>
                <div className="p-4 rounded-xl border border-border bg-secondary/10 hover:bg-secondary/35 cursor-pointer transition-all flex items-center justify-between text-xs md:text-sm">
                  <div className="space-y-1">
                    <span className="block font-bold text-foreground leading-tight line-clamp-1">{rel.title}</span>
                    <span className="block text-[10px] text-muted-foreground font-semibold uppercase">{rel.category} • {rel.readTime}</span>
                  </div>
                  <ArrowRight className="h-4.5 w-4.5 text-muted-foreground flex-shrink-0 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}

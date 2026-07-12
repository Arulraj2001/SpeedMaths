import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, HelpCircle, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdSensePlaceholder } from "@/components/adsense-placeholder";
import { articles } from "@/data/blog";
import { Metadata } from "next";
import { absoluteUrl, SITE_URL, buildArticleSchema, buildBreadcrumbSchema, toIsoDate } from "@/lib/seo";

const ARTICLE_AUTHOR = "SpeedMaths Editorial Team";

function getArticleImage(slug: string) {
  return absoluteUrl(`/og/articles/${slug}.svg`);
}

function getInternalLinks(slug: string) {
  const linkMap: Record<string, Array<{ href: string; label: string; description: string }>> = {
    "mental-math-tricks": [
      { href: "/practice", label: "Practice mental math", description: "Start timed drills for speed and accuracy." },
      { href: "/tables", label: "Times tables reference", description: "Reinforce the number facts used in mental arithmetic." },
      { href: "/fractions", label: "Fractions to decimals chart", description: "Use benchmark fractions to calculate percentages faster." },
    ],
    "multiplication-tricks": [
      { href: "/practice", label: "Practice multiplication", description: "Apply shortcut methods in a timed practice session." },
      { href: "/tables", label: "Times tables reference", description: "Build the multiplication facts behind the shortcuts." },
      { href: "/squares", label: "Squares reference", description: "Support cross-multiplication and difference-of-squares tricks." },
    ],
    "vedic-maths": [
      { href: "/practice", label: "Practice Vedic-style drills", description: "Use the drill engine to repeat the same arithmetic patterns." },
      { href: "/tables", label: "Times tables reference", description: "Strengthen the foundations behind Vedic methods." },
      { href: "/squares", label: "Squares reference", description: "Speed up squaring and difference-based techniques." },
    ],
    "percentage-tricks": [
      { href: "/practice", label: "Practice percentages", description: "Turn percentage shortcuts into quick recall." },
      { href: "/fractions", label: "Fractions and decimals", description: "Use benchmarks like 1/8 and 1/4 for fast mental conversions." },
      { href: "/powers", label: "Powers and exponents", description: "Review multiplication patterns that show up in percentage growth." },
    ],
    "division-tricks": [
      { href: "/practice", label: "Practice division", description: "Reinforce long-division shortcuts with timed drills." },
      { href: "/tables", label: "Times tables reference", description: "Division gets faster when multiplication facts are automatic." },
      { href: "/fractions", label: "Fractions to decimals chart", description: "Use fraction knowledge to estimate quotients." },
    ],
    "number-types": [
      { href: "/practice", label: "Practice number recognition", description: "Apply number-type checks during drills and review." },
      { href: "/learn/number-types", label: "Number types guide", description: "Review primes, composites, and special number classes." },
      { href: "/tables", label: "Times tables reference", description: "Use multiplication facts to test divisibility quickly." },
    ],
  };

  return linkMap[slug] || [
    { href: "/practice", label: "Practice now", description: "Put the ideas from this article into use immediately." },
    { href: "/blog", label: "Browse more guides", description: "Read the other mental math tutorials and shortcuts." },
    { href: "/faq", label: "Read the FAQ", description: "Find answers to common questions about the platform." },
  ];
}

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
    title: article.title,
    description: article.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: toIsoDate(article.publishedDate),
      authors: [ARTICLE_AUTHOR],
      images: [
        {
          url: getArticleImage(slug),
          width: 512,
          height: 512,
          alt: article.title,
        }
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [getArticleImage(slug)],
    }
  };
}

// Lightweight custom parser converting Markdown subsets to semantic HTML tags
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentList: string[] = [];
  let currentTable: string[][] = [];
  let isInsideTable = false;
  let isInsideList = false;

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc list-outside space-y-2.5 py-3 pl-6 text-slate-900 dark:text-neutral-200 text-sm md:text-base leading-relaxed my-4">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMath(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
    isInsideList = false;
  };

  const flushTable = (key: string | number) => {
    if (currentTable.length > 0) {
      const headerRow = currentTable[0];
      const dataRows = currentTable.slice(2); // Skip separator row
      
      elements.push(
        <div key={`table-${key}`} className="border border-border/40 rounded-xl overflow-hidden my-8 shadow-sm overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-xs md:text-sm font-mono">
            <thead>
              <tr className="bg-secondary/40 border-b border-border/40">
                {headerRow.map((col, idx) => (
                  <th key={idx} className="p-3 text-left font-bold text-foreground whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-secondary/20 transition-colors">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="p-3 text-slate-900 dark:text-neutral-200 whitespace-nowrap" dangerouslySetInnerHTML={{ __html: formatInlineMath(col) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    }
    isInsideTable = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // 1. Handle Table block
    if (trimmed.startsWith("|")) {
      if (isInsideList) flushList(index);
      isInsideTable = true;
      const cols = line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      currentTable.push(cols);
      return;
    } else {
      if (isInsideTable) {
        flushTable(index);
      }
    }

    // 2. Handle Bullet Lists
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (isInsideTable) flushTable(index);
      isInsideList = true;
      currentList.push(trimmed.substring(2));
      return;
    } else {
      if (isInsideList) {
        // If it's a sub-item (e.g. indented or starts with a sub-bullet)
        if (line.startsWith("  ") || line.startsWith("\t")) {
          currentList.push(trimmed);
          return;
        } else {
          flushList(index);
        }
      }
    }

    // 3. Handle Headings (##, ###)
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight pt-8 pb-3 border-b border-border/30 mt-8 mb-4">
          {trimmed.substring(3)}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-xl font-bold text-foreground tracking-tight pt-6 pb-2 mt-6 mb-3">
          {trimmed.substring(4)}
        </h3>
      );
      return;
    }

    // 4. Handle Horizontal Rule (---)
    if (trimmed === "---") {
      elements.push(
        <hr key={index} className="my-8 border-t border-border/30" />
      );
      return;
    }

    // 5. Handle Paragraphs
    if (trimmed) {
      elements.push(
          <p 
          key={index} 
          className="text-base text-slate-900 dark:text-neutral-200 leading-relaxed my-5 font-sans" 
          dangerouslySetInnerHTML={{ __html: formatInlineMath(trimmed) }}
        />
      );
    }
  });

  // Flush remaining elements
  flushList("end");
  flushTable("end");

  return elements;
}

// Helper replacing mathematical block symbols to styled code tags
function formatInlineMath(text: string): string {
  let formatted = text;
  
  // Replaces bold markers **bold**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-foreground">$1</strong>');
  
  // Replaces code blocks
  formatted = formatted.replace(/`(.*?)`/g, '<code class="px-2 py-0.5 rounded-md bg-secondary/80 text-primary border border-border/30 font-mono text-[13px] font-semibold">$1</code>');

  const parseMath = (math: string) => {
    let result = math;
    
    // Replace standard spacing
    result = result.replace(/\\quad/g, " &nbsp;&nbsp;&nbsp;&nbsp; ");
    
    // Replace right arrows
    result = result.replace(/\\rightarrow/g, " → ");
    
    // Replace times/div/approx
    result = result.replace(/\\times/g, " × ");
    result = result.replace(/\\div/g, " ÷ ");
    result = result.replace(/\\approx/g, " ≈ ");
    
    // Replace percentages
    result = result.replace(/\\%/g, "%");

    // Replace fractions \frac{numerator}{denominator}
    // We can replace it with a styled HTML fraction flex block
    result = result.replace(/\\frac\{(.*?)\}\{(.*?)\}/g, 
      '<span class="inline-flex flex-col align-middle text-center mx-1"><span class="border-b border-foreground/80 px-1 text-[13px] leading-none">$1</span><span class="text-[13px] leading-none pt-0.5">$2</span></span>'
    );

    // Replace \text{...}
    result = result.replace(/\\text\{(.*?)\}/g, '<span class="font-sans font-normal text-slate-700 dark:text-neutral-300">$1</span>');

    return result;
  };

  // Replace $$...$$ math block with center-aligned, larger font blocks
  formatted = formatted.replace(/\$\$(.*?)\$\$/g, (_, math) => {
    return `<span class="my-6 block text-center font-mono text-base md:text-lg text-primary bg-secondary/25 border border-border/20 p-4 rounded-xl py-3 px-4 shadow-inner leading-relaxed overflow-x-auto">${parseMath(math)}</span>`;
  });

  // Replace $...$ inline math block with styled code inline snippets
  formatted = formatted.replace(/\$(.*?)\$/g, (_, math) => {
    return `<code class="px-1.5 py-0.5 rounded-md bg-secondary/60 text-primary border border-border/25 font-mono text-[13.5px] font-bold inline-flex items-center flex-wrap">${parseMath(math)}</code>`;
  });

  return formatted;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return notFound();

  // JSON-LD Schemas (Breadcrumbs, Article, FAQs)
  const breadcrumbJson = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${slug}` },
  ]);

  const articleJson = buildArticleSchema({
    title: article.title,
    description: article.description,
    url: `/blog/${slug}`,
    publishedDate: article.publishedDate,
    authorName: ARTICLE_AUTHOR,
  });

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": article.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  const internalLinks = getInternalLinks(slug);
  const relatedArticles = articles.filter(a => article.related.includes(a.slug));

  return (
    <article className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      
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
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 font-semibold text-foreground/90">
            <BadgeCheck className="h-3.5 w-3.5 text-primary" />
            By {ARTICLE_AUTHOR}
          </span>
          <span className="text-muted-foreground">Reviewed for clarity and accuracy.</span>
        </div>
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
      <div className="max-w-none text-slate-900 dark:text-neutral-200">
        {renderMarkdown(article.content)}
      </div>

      {/* Between Content Ad */}
      <AdSensePlaceholder slot="2222222222" format="auto" />

      {/* Internal links */}
      <section className="space-y-4 pt-8 border-t border-border/20">
        <div className="space-y-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Continue Learning
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
            Useful next steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {internalLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="h-full rounded-xl border border-border bg-secondary/10 hover:bg-secondary/30 transition-all p-4 flex flex-col gap-2 cursor-pointer">
                <span className="font-bold text-foreground leading-tight">{item.label}</span>
                <span className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.description}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary pt-2">
                  Open page
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

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

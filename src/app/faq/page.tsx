"use client";

import React, { useState } from "react";
import { HelpCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FaqItem {
  q: string;
  a: string;
  category: "general" | "engine" | "privacy";
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "general" | "engine" | "privacy">("all");

  const faqs: FaqItem[] = [
    {
      q: "What is SpeedMaths?",
      a: "SpeedMaths is an interactive mental arithmetic training platform designed to sharpen calculation speed, response accuracy, and mathematical memory. It provides visual learning grids, a practice cockpit, and detailed score dashboards.",
      category: "general"
    },
    {
      q: "How can I improve my mental calculation speed?",
      a: "Consistency is key. By practicing left-to-right decomposition methods (e.g., breaking down additions or multiplications into tens and units) for 10 minutes daily, you build automatic numerical reflexes.",
      category: "general"
    },
    {
      q: "How do I memorize multiplication tables?",
      a: "Use our interactive Times Tables guide. Read the tables using the vocal Speech trigger, print worksheets for offline paper grids review, and use Flash Cards mode to test recall.",
      category: "general"
    },
    {
      q: "How does the Daily Challenge work?",
      a: "The Daily Challenge is a seeded workout set. Using today's calendar date as a random seed, the platform generates a unique set of 20 adaptive questions. Every user globally receives the exact same set of questions for that day, allowing you to compare speeds.",
      category: "engine"
    },
    {
      q: "How are my training analytics stored?",
      a: "All stats (correct logs, levels, badges, accuracy, average speed) are stored completely on your local device using HTML5 LocalStorage. We do not use remote databases.",
      category: "privacy"
    },
    {
      q: "Is my training data private?",
      a: "Absolutely. Since all data remains in your browser's LocalStorage, we never collect, transmit, or share your mathematical scores, names, or emails with remote servers.",
      category: "privacy"
    },
    {
      q: "Does this website work offline?",
      a: "Yes. SpeedMaths is configured as a Progressive Web App (PWA). The background Service Worker caches all scripts, stylesheets, and pages. If you lose connection, you will automatically be served an offline-enabled layout.",
      category: "general"
    },
    {
      q: "Can I use it on mobile devices?",
      a: "Yes. The layout is 100% responsive and includes mobile-optimized sticky footers, swipe navigation columns, and touch-friendly buttons.",
      category: "general"
    },
    {
      q: "Can I print learning sheets?",
      a: "Yes. All multiplication tables, squares, cubes, and fraction charts contain print-friendly CSS formatting. Pressing print hides menus and ads, generating A4 sheets.",
      category: "general"
    },
    {
      q: "Do I need an account to use the site?",
      a: "No. SpeedMaths requires no logins, registration pages, passwords, or emails. Simply navigate to the site and start practicing instantly.",
      category: "general"
    },
    {
      q: "What is the difference between standard practice and exam mode?",
      a: "Practice Mode allows unlimited errors and is relaxed. Exam Mode imposes a strict limit of 3 hearts (lives). Time Attack counts down a global 60-second limit.",
      category: "engine"
    },
    {
      q: "How does the adaptive difficulty algorithm progress?",
      a: "Under Adaptive mode, the engine evaluates your workout index. The first 30% of questions are set to Easy, the next 40% are Medium, and the final 30% are Hard.",
      category: "engine"
    },
    {
      q: "What are Vedic Math techniques?",
      a: "Vedic Mathematics is an ancient Indian system based on word formulas (Sutras). It simplifies complex calculations (like squaring or base subtraction) into fast visual adjustments.",
      category: "engine"
    },
    {
      q: "What keyboard shortcuts are available?",
      a: "Keyboard shortcuts include keys 1-4 for MCQs, Spacebar to flip flashcards, key 1 (Wrong) and 2 (Correct) for self-grading, H to toggle hints, V to read questions aloud, and Esc to abort.",
      category: "engine"
    },
    {
      q: "How can I practice failed calculations?",
      a: "On completing a session, failed questions are logged. Click 'Re-drill Mistakes Only' to repeat failed equations. You can also practice globally cached mistakes from the configurator.",
      category: "engine"
    },
    {
      q: "How does the XP level progression work?",
      a: "Each correct calculation awards XP points (multiplied by streaks). Level boundaries increase every 200 XP points.",
      category: "engine"
    },
    {
      q: "Can I backup or restore my training achievements?",
      a: "Yes. In the Analytics dashboard, click 'Export JSON' to download a backup file of your profile. Upload this file via the 'Import JSON' button to restore your stats.",
      category: "privacy"
    },
    {
      q: "What is the fraction percentage conversion guide?",
      a: "Our fractions converter shows decimal equivalents and ratios side-by-side with interactive visual HTML bars, speeding up estimation during math tests.",
      category: "general"
    },
    {
      q: "Does this site support screen readers?",
      a: "Yes. The layout includes clean semantic HTML5 structural elements, descriptive ARIA labels, focus visual rings, and full keyboard navigation indicators.",
      category: "general"
    },
    {
      q: "How do I clear all my platform history?",
      a: "Navigate to the Analytics page, click 'Reset All Stats' and confirm. This permanently clears all LocalStorage metrics in your current browser session.",
      category: "privacy"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const faqPageJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">FAQ Portal</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Find answers to questions about streaking, offline PWA caches, and local storage variables.
        </p>
      </div>

      {/* Controls: Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by keywords..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(["all", "general", "engine", "privacy"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-8 px-4 rounded-lg border font-bold capitalize transition-all cursor-pointer ${
                activeCategory === cat 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border/80 hover:bg-secondary text-muted-foreground"
              }`}
            >
              {cat === "all" ? "Show All" : cat === "engine" ? "Engine & Math" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-6">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <Card key={idx} className="glassmorphism border-border/40 p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-foreground leading-snug flex items-start gap-1.5">
                <span className="text-primary font-bold">Q:</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground space-y-2 border border-dashed border-border/60 rounded-xl bg-secondary/10">
            <span className="block text-xl">🔍</span>
            <span className="block text-xs font-bold uppercase tracking-wider">No matching FAQs found</span>
            <span className="block text-[11px] text-muted-foreground/80">Try modifying your search keywords.</span>
          </div>
        )}
      </div>

    </div>
  );
}

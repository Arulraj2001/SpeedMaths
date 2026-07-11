"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCircle, Search, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FaqItem {
  q: string;
  a: string;
  category: "learning" | "practice" | "platform" | "privacy";
}

const faqs: FaqItem[] = [
  // --- Learning & Study Techniques ---
  {
    q: "What is mental math, and why should I learn it?",
    a: "Mental math is the ability to perform calculations in your head without writing anything down. It builds stronger number sense, improves working memory, and helps you estimate answers quickly during exams, job interviews, and everyday decisions like splitting bills or calculating discounts.",
    category: "learning",
  },
  {
    q: "How can I improve my calculation speed?",
    a: "Start with small daily sessions of 5 to 10 minutes. Focus on one skill at a time — for example, spend a week mastering the 7 and 8 times tables before moving to two-digit multiplication. Use the left-to-right decomposition method (breaking 47 × 6 into 40 × 6 + 7 × 6) instead of the column method taught in schools. Consistent short practice builds faster reflexes than occasional long sessions.",
    category: "learning",
  },
  {
    q: "What is the best way to memorize multiplication tables?",
    a: "Combine three approaches: visual review (read through the table on our Times Tables page), active recall (use Flash Cards mode to test yourself without seeing the answer first), and spaced repetition (revisit tables you found difficult the next day). Most people find that tables 6 through 9 need the most practice. Our voice reading feature can also help auditory learners absorb the patterns.",
    category: "learning",
  },
  {
    q: "How do I quickly calculate percentages in my head?",
    a: "Learn the benchmark fractions: 50% is half, 25% is a quarter, 10% is moving the decimal point one place left, and 1% is moving it two places left. To find 15% of 80, calculate 10% (8) plus 5% (4) to get 12. Our Fractions and Percentage guide has a full conversion table with visual bars you can print and keep at your desk.",
    category: "learning",
  },
  {
    q: "What are Vedic Math techniques?",
    a: "Vedic Mathematics is a collection of mental calculation methods compiled from ancient Indian texts. It includes techniques like the Vertically and Crosswise method for multiplying two-digit numbers, the Nikhilam Sutra for numbers close to a base (like 97 × 96), and squaring numbers ending in 5 (just multiply the tens digit by the next number and append 25). Our Vedic Maths article explains each technique with step-by-step worked examples.",
    category: "learning",
  },
  {
    q: "How do squares and cubes help in competitive exams?",
    a: "Many quantitative aptitude questions in exams like SSC, Banking, CAT, and GRE can be solved faster if you know squares up to 30 and cubes up to 15 from memory. For example, recognizing that 2025 is 45 squared instantly answers what is the square root of 2025. Our Squares and Cubes reference pages let you browse, search, and print these values.",
    category: "learning",
  },

  // --- Practice Engine ---
  {
    q: "What practice modes are available?",
    a: "SpeedMaths offers several modes to suit different goals. Standard Practice gives unlimited attempts at your chosen pace. Exam Mode limits you to 3 lives, simulating test pressure. Time Attack gives you 60 seconds to answer as many questions as possible. Infinite Mode never ends, letting you enter a flow state. Daily Challenge generates the same 20 questions for every user worldwide each day, so you can compare results.",
    category: "practice",
  },
  {
    q: "How does the Daily Challenge work?",
    a: "Each day at midnight, the platform uses the calendar date as a random seed to generate a unique set of 20 questions covering different topics and difficulty levels. Every user around the world receives the same questions on the same day. This makes it fair to compare your speed and accuracy with friends or classmates. A new challenge appears automatically the next day.",
    category: "practice",
  },
  {
    q: "What question formats does the practice engine support?",
    a: "You can practice with four different formats. Manual Input requires you to type the answer, which is the most challenging. Multiple Choice (MCQ) gives four options. True or False asks you to verify a given equation. Flash Cards show the question first, then reveal the answer for you to self-grade as correct or incorrect.",
    category: "practice",
  },
  {
    q: "How does the adaptive difficulty work?",
    a: "When you select Adaptive difficulty, the engine starts with easier questions and gradually increases the challenge as you progress through the session. The first 30 percent of questions are easy, the middle 40 percent are medium, and the final 30 percent are hard. This ensures you build confidence early and push your limits toward the end.",
    category: "practice",
  },
  {
    q: "Can I practice only the questions I got wrong?",
    a: "Yes. After finishing any session, questions you answered incorrectly are saved. You can click the Mistakes Only option in the practice configurator to drill those specific problems again. This targeted repetition is one of the most effective ways to strengthen weak areas.",
    category: "practice",
  },
  {
    q: "What keyboard shortcuts are available during practice?",
    a: "For MCQ questions, press keys 1 through 4 to select an answer. Press Space to flip a flashcard. After flipping, press 1 for wrong or 2 for correct. Press H to show a hint, V to hear the question read aloud, and Escape to end the session early. These shortcuts let you practice without touching the mouse.",
    category: "practice",
  },

  // --- Platform Features ---
  {
    q: "Do I need to create an account?",
    a: "No. SpeedMaths works without any registration, login, or email. You can start practicing immediately by visiting the site. Your progress is saved automatically in your browser.",
    category: "platform",
  },
  {
    q: "Does SpeedMaths work offline?",
    a: "Yes. SpeedMaths is a Progressive Web App. After your first visit, the service worker caches the application files. If you lose internet connectivity, the app continues to function normally. You can also install it on your phone or desktop for quick access from your home screen.",
    category: "platform",
  },
  {
    q: "Can I use SpeedMaths on my phone or tablet?",
    a: "Yes. The entire interface is responsive and adapts to screen sizes from small phones to large desktop monitors. On mobile, you get a simplified navigation menu and touch-friendly buttons. You can also install SpeedMaths as a PWA app on Android or iOS for a native-like experience.",
    category: "platform",
  },
  {
    q: "Can I print the multiplication tables and reference charts?",
    a: "Yes. Every learning page — including times tables, squares, cubes, and fraction charts — is designed with print-friendly formatting. When you print, the navigation bar, footer, and advertisements are automatically hidden, producing clean A4 sheets suitable for classroom use or personal study.",
    category: "platform",
  },
  {
    q: "How does the analytics dashboard track my progress?",
    a: "The dashboard shows your total questions answered, accuracy percentage, average response time, current streak, and longest streak. It includes a line chart of daily performance, a bar chart of topic frequency, a radar chart of topic strength, and a GitHub-style calendar heatmap showing your practice consistency over time. You can also unlock achievement badges based on milestones.",
    category: "platform",
  },

  // --- Privacy & Data ---
  {
    q: "Where is my practice data stored?",
    a: "All your data — including scores, streaks, XP, unlocked badges, and practice history — is stored in your browser using LocalStorage. Nothing is sent to any server. This means your data stays on your device and is completely private.",
    category: "privacy",
  },
  {
    q: "Can I back up or transfer my progress to another device?",
    a: "Yes. On the Analytics page, use the Export button to download your progress as a JSON file. On the other device, use the Import button to upload that file and restore your stats. This is also useful as a backup before clearing your browser data.",
    category: "privacy",
  },
  {
    q: "How do I reset all my data and start fresh?",
    a: "Go to the Analytics page and click the Reset All Stats button. This permanently deletes all practice history, scores, badges, and streaks from your browser. The action cannot be undone, so consider exporting a backup first.",
    category: "privacy",
  },
];

export { faqs };

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    "all" | "learning" | "practice" | "platform" | "privacy"
  >("all");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const faqPageJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJson) }}
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <HelpCircle className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Answers to common questions about mental math practice, learning
          techniques, progress tracking, and data privacy.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            aria-label="Search frequently asked questions"
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {(
            ["all", "learning", "practice", "platform", "privacy"] as const
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-8 px-4 rounded-lg border font-bold capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border/80 hover:bg-secondary text-muted-foreground"
              }`}
            >
              {cat === "all"
                ? "All Topics"
                : cat === "learning"
                  ? "Learning Tips"
                  : cat === "practice"
                    ? "Practice Engine"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <Card
              key={idx}
              className="glassmorphism border-border/40 p-5 space-y-2"
            >
              <h3 className="text-sm font-extrabold text-foreground leading-snug flex items-start gap-1.5">
                <span className="text-primary font-bold mt-0.5">Q.</span>
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
            <span className="block text-xs font-bold uppercase tracking-wider">
              No matching questions found
            </span>
            <span className="block text-[11px] text-muted-foreground/80">
              Try different keywords or browse all categories.
            </span>
          </div>
        )}
      </div>

      {/* Related Links */}
      <div className="border-t border-border/20 pt-8 space-y-3">
        <h2 className="text-lg font-bold text-foreground">
          Explore More Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            href="/blog/mental-math-tricks"
            className="flex items-center gap-1.5 p-3 rounded-lg border border-border/60 hover:bg-secondary/30 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Mental Math Tricks Guide</span>
          </Link>
          <Link
            href="/practice"
            className="flex items-center gap-1.5 p-3 rounded-lg border border-border/60 hover:bg-secondary/30 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Start Practicing Now</span>
          </Link>
          <Link
            href="/learn/tables"
            className="flex items-center gap-1.5 p-3 rounded-lg border border-border/60 hover:bg-secondary/30 transition-colors"
          >
            <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            <span>Browse Times Tables</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

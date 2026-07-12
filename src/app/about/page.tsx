import React from "react";
import { Sparkles, Target, Compass, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - SpeedMaths Platform",
  description: "Learn about the mission, vision, learning philosophy, and core team behind the SpeedMaths mental arithmetic training platform.",
  alternates: {
    canonical: "https://speedmaths.com/about"
  }
};

export default function AboutPage() {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://speedmaths.com" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://speedmaths.com/about" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">About SpeedMaths</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          A free mental math practice platform built to help students get genuinely faster at arithmetic.
        </p>
      </div>

      {/* Intro section */}
      <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-foreground">Why We Built This</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Most students learn arithmetic using paper-and-pencil methods — writing columns, carrying digits, working right to left. These methods are fine on paper, but they don&apos;t work well in your head. SpeedMaths teaches a different approach: breaking numbers apart and calculating left to right, the way your brain naturally processes information. The result is faster, more confident mental math.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Target className="h-4.5 w-4.5" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              To create the most accessible and effective mental math training tool available online — free for every student, with no registration or paywalls.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Compass className="h-4.5 w-4.5" />
              <span>Our Vision</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              Every student should feel confident with numbers. Whether you&apos;re preparing for the SAT, GMAT, CAT, or just want to calculate tips without pulling out your phone, we want to help you get there.
            </p>
          </div>
        </div>
      </Card>

      {/* Learning philosophy */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-foreground text-center">How We Teach Mental Math</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
            <span className="block font-bold text-sm text-foreground">Break Numbers Down</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instead of solving 47 × 8 as a column problem, break it into 40 × 8 + 7 × 8 = 320 + 56 = 376. This works entirely in your head with no paper needed.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</div>
            <span className="block font-bold text-sm text-foreground">Spot the Shortcut</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Many calculations have hidden shortcuts. Squaring a number ending in 5? Multiply the tens digit by the next number and append 25. Multiplying 98 × 97? Use 100 as a base. We teach you to see these patterns.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</div>
            <span className="block font-bold text-sm text-foreground">Practice Daily, Even Briefly</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Five minutes of daily practice is more effective than an hour once a week. Our streak counter and daily heatmap help you build a habit that sticks.
            </p>
          </div>

        </div>
      </div>

      {/* How students benefit */}
      <Card className="border-border bg-card p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Who Is This For?</h3>
        <ul className="list-disc list-inside space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <li><strong>Exam students (SAT, GMAT, GRE, CAT, Banking)</strong>: Save time on quantitative sections by calculating mentally instead of on paper. Eliminate wrong multiple-choice answers using units digit checks.</li>
          <li><strong>School and college students</strong>: Build a strong number sense that makes math class less stressful and helps you check your work faster.</li>
          <li><strong>Anyone who wants to be better with numbers</strong>: Calculate tips, discounts, measurements, and budgets confidently without needing a calculator app.</li>
        </ul>
      </Card>

      {/* Contact & Support info footer */}
      <div className="pt-6 border-t border-border/20 flex flex-col sm:flex-row gap-6 justify-between items-center text-xs text-muted-foreground">
        <div className="space-y-1">
          <span className="block font-bold text-foreground">Contact Our Team</span>
          <div className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>support@speedmaths.com</span>
          </div>
        </div>
        <div className="text-right sm:text-right text-[10px]">
          <span>© 2026 SpeedMaths Platform. All rights reserved.</span>
        </div>
      </div>

    </div>
  );
}

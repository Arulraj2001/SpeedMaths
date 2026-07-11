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
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Mission & Philosophy</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Unlocking human computational potential through design-driven training tools.
        </p>
      </div>

      {/* Intro section */}
      <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-6">
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold text-foreground">Why SpeedMaths Exists</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In an era of calculators and artificial intelligence, mental math remains a fundamental cognitive anchor. Traditional schooling often emphasizes paper-and-pencil columns, which restrict computation to writing. SpeedMaths exists to liberate calculations from paper, teaching students and professionals how to decompose numbers and process math mentally from left to right.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Target className="h-4.5 w-4.5" />
              <span>Our Mission</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              To build the world&apos;s most accessible, latency-free training playground for mental calculations, allowing students globally to sharpen their minds, reduce exam anxiety, and master numbers.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Compass className="h-4.5 w-4.5" />
              <span>Our Vision</span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              A future where quantitative confidence is universal. We aim to equip school students, standardized test candidates (SAT/GMAT/CAT), and STEM professionals with lightning-fast numerical intuition.
            </p>
          </div>
        </div>
      </Card>

      {/* Learning philosophy */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-foreground text-center">The Learning Philosophy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
            <span className="block font-bold text-sm text-foreground">Active Decomposition</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We teach users to break numbers down into smaller algebraic chunks (e.g. $47 × 8$ as $40 × 8 + 7 × 8$) rather than using rote memorization.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</div>
            <span className="block font-bold text-sm text-foreground">Pattern Recognition</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Using Vedic Maths Sutras, students learn to spot shortcuts like numbers ending in 5 or differences of squares to skip calculations.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-secondary/15 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</div>
            <span className="block font-bold text-sm text-foreground">Consistency Heatmaps</span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Neuroplasticity requires daily stimulation. Our dashboard uses streak tracking and grids to build long-term math habits.
            </p>
          </div>

        </div>
      </div>

      {/* How students benefit */}
      <Card className="border-border bg-card p-6 md:p-8 space-y-4">
        <h3 className="text-lg font-bold text-foreground">How Candidates & Students Benefit</h3>
        <ul className="list-disc list-inside space-y-2.5 text-xs md:text-sm text-muted-foreground leading-relaxed">
          <li><strong>Competitive Exams (SAT/GMAT/GRE/CAT)</strong>: Eliminate multiple-choice options in seconds using units digit analysis and digit sum checks.</li>
          <li><strong>Academic Performance</strong>: Higher grades in science and math by converting arithmetic into a fast background reflex.</li>
          <li><strong>Cognitive Agility</strong>: Daily mathematical stimulation builds stronger short-term memory capacity and enhances logic processing speed.</li>
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

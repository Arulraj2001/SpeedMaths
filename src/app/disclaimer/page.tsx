import React from "react";
import { Info, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer - SpeedMaths Platform",
  description: "Read the Disclaimer for SpeedMaths. Learn about our calculation accuracy warranties, advertisement disclosures, and educational intent.",
  alternates: {
    canonical: "https://speedmaths.com/disclaimer"
  }
};

export default function DisclaimerPage() {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://speedmaths.com" },
      { "@type": "ListItem", "position": 2, "name": "Disclaimer", "item": "https://speedmaths.com/disclaimer" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <Info className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Disclaimer</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Product warranties, advertisements, and content disclosures.
        </p>
      </div>

      <div className="space-y-6 text-xs md:text-sm text-muted-foreground leading-relaxed">
        
        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-primary" />
            <span>1. Educational Disclaimer</span>
          </h2>
          <p>
            The content, math tutorials, formula lists, times tables charts, and calculations practice drills provided on SpeedMaths are intended solely for educational, mental training, and entertainment purposes. We make no representations or warranties about the completeness or suitability of the calculations checklists for GMAT, SAT, CAT, or any school syllabus.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-primary" />
            <span>2. No Professional Advice</span>
          </h2>
          <p>
            The tools and strategies (such as Vedic Maths calculations or shortcut divisions) are not professional advisory services. If you require expert math education or individual professional tutoring, please consult a certified math teacher.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-primary" />
            <span>3. External Link & Ads Disclaimer</span>
          </h2>
          <p>
            SpeedMaths contains links to external websites and Google AdSense advertisement banners. We do not inspect, control, verify, or warrant the truthfulness of products sold or information provided on third-party links or sponsored banners. Pushing buttons to purchase items from sponsored links is executed entirely at your own risk.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-4.5 w-4.5 text-primary" />
            <span>4. Affiliate Disclosure (Future Ready)</span>
          </h2>
          <p>
            From time to time, we may recommend educational math workbooks, paper print flashcards, or pencil models. We may receive commissions for purchases made through outbound affiliate links, which does not affect the cost to you.
          </p>
          <p>
            If you have questions regarding this Disclaimer page, contact us via email at:
            <span className="block font-bold text-foreground mt-1">support@speedmaths.com</span>
          </p>
        </Card>

      </div>

    </div>
  );
}

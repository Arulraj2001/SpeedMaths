import React from "react";
import { Gavel, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - SpeedMaths Platform",
  description: "Read the Terms & Conditions for the SpeedMaths speed math platform. Access user conduct policies, warranties, and educational disclaimers.",
  alternates: {
    canonical: "https://speedmaths.com/terms"
  }
};

export default function TermsPage() {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://speedmaths.com" },
      { "@type": "ListItem", "position": 2, "name": "Terms & Conditions", "item": "https://speedmaths.com/terms" }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <Gavel className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Platform terms, conduct rules, and legal agreements.
        </p>
      </div>

      <div className="space-y-6 text-xs md:text-sm text-muted-foreground leading-relaxed">
        
        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <Scale className="h-4.5 w-4.5 text-primary" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or using the SpeedMaths speed math training platform, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <Scale className="h-4.5 w-4.5 text-primary" />
            <span>2. Educational Purpose & Use</span>
          </h2>
          <p>
            SpeedMaths is an open-source educational game console designed to support mental calculations learning. The mathematical content, shortcuts, formulas, and tests are provided as-is without any warranties of correctness. Use this platform to sharpen your speed calculations at your own risk.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <Scale className="h-4.5 w-4.5 text-primary" />
            <span>3. Intellectual Property Rights</span>
          </h2>
          <p>
            All layout assets, CSS styling, components, custom question generators, math data sheets, and text content (including blog articles) are the property of the SpeedMaths development team and are protected under copyright laws. You may copy charts for school uses, but commercial redistribution of our source code or articles without license is strictly prohibited.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <Scale className="h-4.5 w-4.5 text-primary" />
            <span>4. Limitation of Liability</span>
          </h2>
          <p>
            In no event shall SpeedMaths, its developers, or its stakeholders be liable for any direct, indirect, or consequential damages resulting from calculation mistakes, browser local storage resets, exam failures, or website service interruptions.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <Scale className="h-4.5 w-4.5 text-primary" />
            <span>5. Changes to Agreements</span>
          </h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted directly to this URL, and your continued usage of SpeedMaths constitutes acceptance of the modified Terms.
          </p>
          <p>
            If you have questions regarding these Terms, contact us via email at:
            <span className="block font-bold text-foreground mt-1">legal@speedmaths.com</span>
          </p>
        </Card>

      </div>

    </div>
  );
}

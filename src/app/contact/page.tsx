import React from "react";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - SpeedMaths Platform",
  description: "Get in touch with the SpeedMaths team. Submit platform suggestions, report bugs, ask school integration details, or find social channels links.",
  alternates: {
    canonical: "https://speedmaths.com/contact"
  }
};

export default function ContactPage() {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://speedmaths.com" },
      { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://speedmaths.com/contact" }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Contact SpeedMaths</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Have feedback, found bugs, or want to integrate SpeedMaths in your school? Get in touch.
        </p>
      </div>

      {/* Render Client Form and Information Columns */}
      <ContactForm />

    </div>
  );
}

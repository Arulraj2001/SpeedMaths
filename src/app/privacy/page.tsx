import React from "react";
import { ShieldCheck, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy - SpeedMaths Platform",
  description: "Read the Privacy Policy for SpeedMaths. Learn how we handle LocalStorage variables, cookies, tracking logs, and third-party advertising scripts.",
  alternates: {
    canonical: `${SITE_URL}/privacy`
  }
};

export default function PrivacyPage() {
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}` },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": `${SITE_URL}/privacy` }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Schema Injection */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }} />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-600 shadow-md mx-auto mb-2">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Your privacy is absolute. Learn about our local storage policies and tracking configurations.
        </p>
      </div>

      <div className="space-y-6 text-xs md:text-sm text-muted-foreground leading-relaxed">
        
        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            <span>1. Data Collection and LocalStorage</span>
          </h2>
          <p>
            Unlike typical cloud-based platforms, SpeedMaths does **NOT** collect, transmit, or store your mathematical training records on remote servers. We do not use databases, account registration pages, or email profiles.
          </p>
          <p>
            All workout records, streaks, levels, and unlocked achievement badges are stored directly in your web browser using HTML5 **LocalStorage** variables. This data is private to you and never leaves your computer. You can export or clear this data at any time via the Analytics dashboard.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            <span>2. Cookies & Analytics Scripts</span>
          </h2>
          <p>
            To monitor site load speeds, calculate server payloads, and understand search optimization parameters, we use standard analytic scripts:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Google Analytics (GA4)</strong>: Processes anonymous page views to count traffic levels. It does not collect names or emails.</li>
            <li><strong>Microsoft Clarity</strong>: Records anonymous viewport behaviors to optimize button positioning and layout sizing.</li>
          </ul>
          <p>
            These trackers set cookies inside your browser to distinguish returning visitors. You can decline cookie collection via standard browser headers or adblock scripts.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            <span>3. Google AdSense Advertising</span>
          </h2>
          <p>
            We display sponsored banner advertisements through Google AdSense. AdSense uses third-party cookies (such as DoubleClick) to deliver targeted ads based on your visits to this and other websites on the internet.
          </p>
          <p>
            You can review Google&apos;s advertising policies or opt out of personalized interest-based advertising by visiting Google Ad Settings.
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            <span>4. Children&apos;s Privacy</span>
          </h2>
          <p>
            SpeedMaths is designed as an educational portal for users of all ages, including children under 13. Since we do not request personal identifiers (such as names, addresses, or phone coordinates) and save all records locally in the browser, our platform complies with the Children&apos;s Online Privacy Protection Act (COPPA).
          </p>
        </Card>

        <Card className="glassmorphism border-border/40 p-6 md:p-8 space-y-4">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            <span>5. Contact & Data Correction</span>
          </h2>
          <p>
            Since all user stats are saved in your local web browser, we do not access or delete them. If you wish to delete your history, open the Analytics dashboard and click **Reset Platform Stats**, or clear your browser&apos;s site cookies.
          </p>
          <p>
            If you have questions regarding this Privacy Policy, contact us via email at:
            <span className="block font-bold text-foreground mt-1">privacy@speedmaths.com</span>
          </p>
        </Card>

      </div>

    </div>
  );
}

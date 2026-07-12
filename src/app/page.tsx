import type { Metadata } from "next";
import HomePageClient from "@/components/home/home-page-client";
import { absoluteUrl, buildWebSiteSchema, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Free Mental Math Training Platform",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Free Mental Math Training Platform",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/og/home.svg")],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mental Math Training Platform",
    description: SITE_DESCRIPTION,
    images: [absoluteUrl("/og/home.svg")],
  },
};

export default function HomePage() {
  const websiteSchema = buildWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomePageClient />
    </>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PwaRegister } from "@/components/pwa-register";
import { GoogleAnalytics } from "@/components/google-analytics";
import { MicrosoftClarity } from "@/components/microsoft-clarity";
import { MobileStickyAd } from "@/components/mobile-sticky-ad";
import { buildOrganizationSchema, buildWebSiteSchema, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SpeedMaths — Free Mental Math Training Platform",
  },
  description: SITE_DESCRIPTION,
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: "SpeedMaths — Free Mental Math Training Platform",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedMaths — Free Mental Math Training Platform",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_DESCRIPTION,
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/globe.svg`,
    sameAs: ["https://github.com/Arulraj2001/SpeedMaths"],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@speedmaths.com",
      contactType: "customer support",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([buildWebSiteSchema(), buildOrganizationSchema()]),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <PwaRegister />
        <GoogleAnalytics />
        <MicrosoftClarity />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <MobileStickyAd />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

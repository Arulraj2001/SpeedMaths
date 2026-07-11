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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://speedmaths.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SpeedMaths — Free Mental Math Training Platform",
    template: "%s | SpeedMaths",
  },
  description:
    "Master mental arithmetic with free interactive drills. Practice multiplication tables, squares, cubes, fractions, powers, and number types. Track progress with analytics dashboards.",
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
    siteName: "SpeedMaths",
    title: "SpeedMaths — Free Mental Math Training Platform",
    description:
      "Master mental arithmetic with free interactive drills. Practice multiplication tables, squares, cubes, fractions, powers, and number types.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedMaths — Free Mental Math Training Platform",
    description:
      "Master mental arithmetic with free interactive drills. Practice multiplication tables, squares, cubes, fractions, and powers.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "m8GlcWW56jbrY438cEneNp0L7mvnjYJO28V5pSDF5AM",
    other: {
      "msvalidate.01": "BING_WEBMASTER_VERIFICATION_ID",
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SpeedMaths",
    url: BASE_URL,
    description:
      "Free mental arithmetic training platform with interactive drills, analytics dashboards, and printable reference sheets.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/faq?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SpeedMaths",
    url: BASE_URL,
    logo: `${BASE_URL}/icon-512.png`,
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
            __html: JSON.stringify([websiteSchema, organizationSchema]),
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

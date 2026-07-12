import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Math Practice Analytics",
  description:
    "View your practice statistics, streak history, achievement badges, and consistency charts. All data stays in your browser.",
  alternates: {
    canonical: `${SITE_URL}/analytics`,
  },
  openGraph: {
    title: "Math Practice Analytics",
    description:
      "Interactive charts showing mental math accuracy, speed trends, topic mastery, and daily consistency.",
    url: `${SITE_URL}/analytics`,
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SpeedMaths FAQ",
  description:
    "Answers to common questions about mental math practice, learning methods, progress tracking, privacy, and offline use.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "SpeedMaths FAQ",
    description:
      "Answers to common questions about mental math practice, data privacy, keyboard shortcuts, and offline support.",
    url: `${SITE_URL}/faq`,
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

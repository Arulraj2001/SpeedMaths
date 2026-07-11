import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description:
    "Find answers to common questions about SpeedMaths. Learn how practice modes work, how data is stored locally, keyboard shortcuts, PWA offline support, and more.",
  alternates: {
    canonical: "https://speedmaths.com/faq",
  },
  openGraph: {
    title: "FAQ — Frequently Asked Questions",
    description:
      "Answers to 20+ common questions about mental math practice, data privacy, offline support, and keyboard shortcuts on SpeedMaths.",
    url: "https://speedmaths.com/faq",
  },
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

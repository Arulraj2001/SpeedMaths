import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Practice Mental Math",
  description:
    "Practice multiplication, division, squares, cubes, fractions, and mixed operations with timed challenges, adaptive difficulty, and streak tracking.",
  alternates: {
    canonical: `${SITE_URL}/practice`,
  },
  openGraph: {
    title: "Practice Mental Math",
    description:
      "Sharpen your mental math with customizable drills, topic selection, timers, and question formats.",
    url: `${SITE_URL}/practice`,
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

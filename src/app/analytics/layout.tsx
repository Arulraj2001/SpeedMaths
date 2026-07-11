import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics Dashboard — Track Your Math Progress",
  description:
    "View your practice statistics, accuracy charts, streak history, XP levels, achievement badges, and a GitHub-style consistency heatmap. All data stored locally.",
  alternates: {
    canonical: "https://speedmaths.com/analytics",
  },
  openGraph: {
    title: "Analytics Dashboard — Track Your Math Progress",
    description:
      "Interactive charts showing your mental math accuracy, speed trends, topic mastery, and daily consistency heatmap.",
    url: "https://speedmaths.com/analytics",
  },
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Mental Math — Interactive Drill Engine",
  description:
    "Practice multiplication, division, squares, cubes, fractions, and mixed operations with adaptive difficulty, timed challenges, MCQ, flashcards, and streak tracking.",
  alternates: {
    canonical: "https://speedmaths.com/practice",
  },
  openGraph: {
    title: "Practice Mental Math — Interactive Drill Engine",
    description:
      "Sharpen your mental math with customizable drills. Choose topics, difficulty, timer, and question types including MCQ, True/False, and flashcards.",
    url: "https://speedmaths.com/practice",
  },
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import SquaresPage from "../learn/squares/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Square Numbers 1 to 100 — Complete List of Perfect Squares",
  description: "Full list of square numbers from 1 to 100 with values, search, voice reading, and printable chart. Learn perfect squares for competitive exam preparation and mental math practice.",
  alternates: {
    canonical: `${SITE_URL}/squares`
  },
  openGraph: {
    title: "Square Numbers 1 to 100 — Complete List of Perfect Squares",
    description: "Full list of square numbers from 1² to 100² with printable chart, search, and voice reading.",
    url: `${SITE_URL}/squares`,
  },
};

export default SquaresPage;

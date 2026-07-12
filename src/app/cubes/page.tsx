import CubesPage from "../learn/cubes/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cube Numbers 1 to 50 — Complete List of Perfect Cubes",
  description: "Full list of cube numbers from 1 to 50 with values, search, voice reading, and printable chart. Learn perfect cubes for maths exams, competitive tests, and mental arithmetic.",
  alternates: {
    canonical: `${SITE_URL}/cubes`
  },
  openGraph: {
    title: "Cube Numbers 1 to 50 — Complete List of Perfect Cubes",
    description: "Full list of cube numbers from 1³ to 50³ with printable chart, search, and voice reading.",
    url: `${SITE_URL}/cubes`,
  },
};

export default CubesPage;

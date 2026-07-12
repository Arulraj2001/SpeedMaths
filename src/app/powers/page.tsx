import PowersPage from "../learn/powers/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Powers and Exponents Table — Values of 2ⁿ, 3ⁿ, 5ⁿ, 10ⁿ, and More",
  description: "Reference table of powers and exponents for bases 2, 3, 5, 10, 11, and 12. Printable exponent chart for students studying indices, exponential growth, and competitive maths.",
  alternates: {
    canonical: `${SITE_URL}/powers`
  },
  openGraph: {
    title: "Powers and Exponents Table — Values of 2ⁿ, 3ⁿ, 5ⁿ, 10ⁿ",
    description: "Complete reference table of powers for bases 2, 3, 5, 10, 11, and 12 with printable layout.",
    url: `${SITE_URL}/powers`,
  },
};

export default PowersPage;

import TablesPage from "../learn/tables/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Multiplication Tables 1 to 50 — Free Printable Times Tables Chart",
  description: "Complete multiplication tables from 1 to 50 with interactive grid view, text-to-speech, bookmarks, and printable PDF-friendly layout. Ideal for students learning times tables.",
  alternates: {
    canonical: `${SITE_URL}/tables`
  },
  openGraph: {
    title: "Multiplication Tables 1 to 50 — Free Printable Chart",
    description: "Browse and print multiplication tables from 1 to 50. Interactive grid with voice reading and bookmarks.",
    url: `${SITE_URL}/tables`,
  },
};

export default TablesPage;

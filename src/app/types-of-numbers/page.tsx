import NumberTypesPage from "../learn/number-types/page";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Types of Numbers in Maths — Prime, Composite, Perfect, Armstrong, and More",
  description: "Learn about different types of numbers in mathematics including prime numbers, composite numbers, perfect numbers, palindrome numbers, Armstrong numbers, Fibonacci numbers, and more. Each type includes definition, examples, and properties.",
  alternates: {
    canonical: `${SITE_URL}/types-of-numbers`
  },
  openGraph: {
    title: "Types of Numbers in Maths — Definitions, Examples, and Properties",
    description: "Complete guide to number types: prime, composite, perfect, palindrome, Armstrong, Fibonacci, and more with examples.",
    url: `${SITE_URL}/types-of-numbers`,
  },
};

export default NumberTypesPage;

export interface NumberTypeInfo {
  id: string;
  name: string;
  definition: string;
  formula: string;
  properties: string[];
  relatedTopics: string[];
  staticExamples?: string[]; // Backup examples (especially for Irrational numbers)
  difficulty: "Easy" | "Medium" | "Hard";
}

export const numberTypes: NumberTypeInfo[] = [
  {
    id: "even",
    name: "Even Numbers",
    definition: "Any integer that can be divided exactly by 2 with zero remainder. They always end in 0, 2, 4, 6, or 8.",
    formula: "n = 2k (where k is an integer)",
    properties: [
      "The sum of two even numbers is always even.",
      "The product of any number and an even number is even.",
      "Division of an even number by 2 results in an integer."
    ],
    relatedTopics: ["odd", "integer", "whole"],
    difficulty: "Easy"
  },
  {
    id: "odd",
    name: "Odd Numbers",
    definition: "Any integer that cannot be divided exactly by 2. When divided by 2, they always leave a remainder of 1. They always end in 1, 3, 5, 7, or 9.",
    formula: "n = 2k + 1 (where k is an integer)",
    properties: [
      "The sum of two odd numbers is always even.",
      "The product of two odd numbers is always odd.",
      "Odd numbers cannot end in 0, 2, 4, 6, or 8."
    ],
    relatedTopics: ["even", "integer", "natural"],
    difficulty: "Easy"
  },
  {
    id: "prime",
    name: "Prime Numbers",
    definition: "A natural number greater than 1 that has no positive divisors other than 1 and itself.",
    formula: "p > 1, divisors(p) = {1, p}",
    properties: [
      "2 is the only even prime number.",
      "Every integer greater than 1 can be uniquely factored into prime numbers (Fundamental Theorem of Arithmetic).",
      "Primes play a critical role in modern public-key cryptography."
    ],
    relatedTopics: ["composite", "natural", "perfect"],
    difficulty: "Medium"
  },
  {
    id: "composite",
    name: "Composite Numbers",
    definition: "A positive integer greater than 1 that has at least one positive divisor other than 1 and itself (i.e. it is not prime).",
    formula: "n = a × b (where a, b > 1 are integers)",
    properties: [
      "All composite numbers can be expressed as a product of prime numbers.",
      "Every even number greater than 2 is a composite number.",
      "The smallest composite number is 4."
    ],
    relatedTopics: ["prime", "natural", "integer"],
    difficulty: "Easy"
  },
  {
    id: "natural",
    name: "Natural Numbers",
    definition: "The positive integers used for counting and ordering (excluding zero or negative numbers).",
    formula: "N = {1, 2, 3, 4, ...}",
    properties: [
      "They are closed under addition and multiplication.",
      "They do not contain decimals, fractions, or negative signs.",
      "The set of natural numbers is infinite."
    ],
    relatedTopics: ["whole", "integer", "real"],
    difficulty: "Easy"
  },
  {
    id: "whole",
    name: "Whole Numbers",
    definition: "All natural numbers including zero. They do not contain decimals, fractional parts, or negative signs.",
    formula: "W = {0, 1, 2, 3, ...}",
    properties: [
      "0 is the smallest whole number.",
      "The set of whole numbers is closed under addition and multiplication.",
      "Subtraction and division can result in numbers outside the set."
    ],
    relatedTopics: ["natural", "integer", "real"],
    difficulty: "Easy"
  },
  {
    id: "integer",
    name: "Integers",
    definition: "A complete number that can be written without a fractional component. It includes positive whole numbers, negative numbers, and zero.",
    formula: "Z = {..., -3, -2, -1, 0, 1, 2, 3, ...}",
    properties: [
      "They are closed under addition, subtraction, and multiplication.",
      "They are not closed under division (e.g., 5 ÷ 2 = 2.5, which is not an integer).",
      "They represent directed values (like elevation above/below sea level)."
    ],
    relatedTopics: ["whole", "rational", "real"],
    difficulty: "Easy"
  },
  {
    id: "rational",
    name: "Rational Numbers",
    definition: "A number that can be expressed as the quotient or fraction p/q of two integers, with a non-zero denominator.",
    formula: "Q = {p/q | p, q ∈ Z, q ≠ 0}",
    properties: [
      "Decimal representations of rational numbers either terminate or repeat periodically.",
      "Every integer is a rational number (expressed as n/1).",
      "The set of rational numbers is dense (between any two rational numbers lies another rational)."
    ],
    relatedTopics: ["integer", "irrational", "real"],
    staticExamples: ["3/4", "-1/2", "0.75", "2", "22/7", "0.333..."],
    difficulty: "Medium"
  },
  {
    id: "irrational",
    name: "Irrational Numbers",
    definition: "A real number that cannot be expressed as a simple fraction p/q. Its decimal representation is non-terminating and non-repeating.",
    formula: "R - Q (Real numbers minus Rational numbers)",
    properties: [
      "They cannot be written as a ratio of two integers.",
      "Their decimal forms go on forever without a repeating pattern.",
      "The square roots of all non-perfect square integers are irrational."
    ],
    relatedTopics: ["rational", "real"],
    staticExamples: ["√2 (1.414...)", "π (3.14159...)", "e (2.71828...)", "√3", "Golden Ratio (φ)"],
    difficulty: "Hard"
  },
  {
    id: "real",
    name: "Real Numbers",
    definition: "The set of all rational and irrational numbers. They can represent any value along a continuous number line.",
    formula: "R = Q ∪ (R - Q)",
    properties: [
      "They cover every point on a continuous mathematical geometric line.",
      "They are closed under addition, subtraction, multiplication, and division (except by zero).",
      "They exclude imaginary or complex numbers (e.g. √-1)."
    ],
    relatedTopics: ["rational", "irrational", "integer"],
    staticExamples: ["0", "15", "-3.5", "√2", "π", "4/5"],
    difficulty: "Medium"
  },
  {
    id: "armstrong",
    name: "Armstrong Numbers",
    definition: "An n-digit number that is equal to the sum of its own digits raised to the nth power. Also known as Narcissistic numbers.",
    formula: "d₁ᵏ + d₂ᵏ + ... + dₙᵏ = N (where k is number of digits)",
    properties: [
      "For single-digit numbers (1-9), all are Armstrong numbers since n=1.",
      "There are no 2-digit Armstrong numbers.",
      "153 is an Armstrong number: 1³ + 5³ + 3³ = 1 + 125 + 27 = 153."
    ],
    relatedTopics: ["palindrome", "strong", "perfect"],
    difficulty: "Hard"
  },
  {
    id: "palindrome",
    name: "Palindrome Numbers",
    definition: "A number that remains symmetric and reads the exact same backwards as it does forwards.",
    formula: "N = reverse(N)",
    properties: [
      "All single digit numbers are palindromes.",
      "For two-digit numbers, palindromes are multiples of 11 (11, 22, 33...).",
      "They possess reflectional symmetry."
    ],
    relatedTopics: ["armstrong", "automorphic"],
    difficulty: "Easy"
  },
  {
    id: "neon",
    name: "Neon Numbers",
    definition: "A number where the sum of digits of its squared value is exactly equal to the number itself.",
    formula: "sumOfDigits(N²) = N",
    properties: [
      "9 is a Neon number: 9² = 81, and 8 + 1 = 9.",
      "0 and 1 are trivial Neon numbers.",
      "Neon numbers are extremely rare in the decimal system."
    ],
    relatedTopics: ["automorphic", "strong", "harshad"],
    difficulty: "Medium"
  },
  {
    id: "strong",
    name: "Strong Numbers",
    definition: "A special number whose sum of factorials of digits is equal to the original number itself.",
    formula: "d₁! + d₂! + ... + dₙ! = N",
    properties: [
      "145 is a Strong number: 1! + 4! + 5! = 1 + 24 + 120 = 145.",
      "There are very few Strong numbers (1, 2, 145, 40585 are the only ones).",
      "Calculating them builds excellent familiarity with factorials."
    ],
    relatedTopics: ["armstrong", "perfect", "neon"],
    difficulty: "Hard"
  },
  {
    id: "harshad",
    name: "Harshad Numbers",
    definition: "An integer that is divisible by the sum of its own digits when written in a given base. Also called Niven numbers.",
    formula: "N % sumOfDigits(N) == 0",
    properties: [
      "All single-digit numbers are Harshad numbers.",
      "18 is a Harshad number: 1 + 8 = 9, and 18 is divisible by 9.",
      "In Sanskrit, 'Harshad' means 'giver of joy'."
    ],
    relatedTopics: ["composite", "neon", "perfect"],
    difficulty: "Medium"
  },
  {
    id: "perfect",
    name: "Perfect Numbers",
    definition: "A positive integer that is equal to the sum of its proper positive divisors, excluding the number itself.",
    formula: "sumOfDivisors(N) - N = N",
    properties: [
      "The smallest perfect number is 6 (divisors: 1, 2, 3. Sum: 1+2+3 = 6).",
      "The next perfect number is 28 (1 + 2 + 4 + 7 + 14 = 28).",
      "All known perfect numbers are even; whether odd perfect numbers exist is one of mathematics' oldest unsolved problems."
    ],
    relatedTopics: ["prime", "strong", "harshad"],
    difficulty: "Hard"
  },
  {
    id: "happy",
    name: "Happy Numbers",
    definition: "A number which, when replaced by the sum of the squares of its digits repeatedly, eventually reaches 1. If it loops infinitely in a cycle excluding 1, it is an unhappy (or sad) number.",
    formula: "N_next = d₁² + d₂² + ... + dₙ² (until N = 1)",
    properties: [
      "19 is happy: 1²+9² = 82 → 8²+2² = 68 → 6²+8² = 100 → 1²+0²+0² = 1.",
      "Numbers that are not happy enter a cycle containing 4 (4, 16, 37, 58, 89, 145, 42, 20, 4).",
      "The density of happy numbers is about 15%."
    ],
    relatedTopics: ["sunny", "perfect", "armstrong"],
    difficulty: "Medium"
  },
  {
    id: "sunny",
    name: "Sunny Numbers",
    definition: "A number where the number immediately following it (N + 1) is a perfect square.",
    formula: "sqrt(N + 1) ∈ Z (integer)",
    properties: [
      "8 is sunny because 8 + 1 = 9, which is 3².",
      "24 is sunny because 24 + 1 = 25, which is 5².",
      "They are always one less than a perfect square."
    ],
    relatedTopics: ["happy", "automorphic"],
    difficulty: "Easy"
  },
  {
    id: "automorphic",
    name: "Automorphic Numbers",
    definition: "A number whose square ends in the same digits as the number itself. Also known as circular numbers.",
    formula: "N² ends in N",
    properties: [
      "5 is automorphic: 5² = 25.",
      "25 is automorphic: 25² = 625.",
      "76 is automorphic: 76² = 5776."
    ],
    relatedTopics: ["sunny", "neon", "palindrome"],
    difficulty: "Hard"
  }
];

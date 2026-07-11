export interface Topic {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estQuestions: string;
  iconName: string;
  previewQuestions: string[];
  preparationTips: string[];
}

export const topics: Topic[] = [
  {
    id: "tables",
    title: "Times Tables",
    description: "Master multiplication tables from 2 to 30. Perfect for building raw speed and recall.",
    difficulty: "Easy",
    estQuestions: "150+",
    iconName: "Table2",
    previewQuestions: [
      "14 × 7 = ?",
      "23 × 6 = ?",
      "29 × 4 = ?",
      "18 × 8 = ?"
    ],
    preparationTips: [
      "Break down higher numbers: e.g., for 14 × 7, think (10 × 7) + (4 × 7).",
      "Practice daily for 5 minutes to develop muscle memory.",
      "Focus first on tables of 12, 14, 18, and 24."
    ]
  },
  {
    id: "squares",
    title: "Squares",
    description: "Memorize and compute square values up to 50, including decimal squares.",
    difficulty: "Easy",
    estQuestions: "100+",
    iconName: "Square",
    previewQuestions: [
      "17² = ?",
      "32² = ?",
      "45² = ?",
      "1.5² = ?"
    ],
    preparationTips: [
      "To square numbers ending in 5: e.g. 35² = (3 × 4) and append 25 = 1225.",
      "Use algebraic expansion: e.g. 41² = (40 + 1)² = 1600 + 80 + 1 = 1681.",
      "Remember that squares of numbers ending in 1, 4, 5, 6, 9, or 0 always end in specific digits."
    ]
  },
  {
    id: "cubes",
    title: "Cubes",
    description: "Learn cube numbers up to 20. Essential for geometric calculation speed.",
    difficulty: "Medium",
    estQuestions: "60+",
    iconName: "Box",
    previewQuestions: [
      "8³ = ?",
      "12³ = ?",
      "15³ = ?",
      "7³ = ?"
    ],
    preparationTips: [
      "Memorize the single digit cubes: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125, etc.",
      "Notice patterns: Cubes ending in 2 end in 8, cubes ending in 3 end in 7, and vice versa.",
      "Use factoring: e.g., 12³ = 12² × 12 = 144 × 12 = (144 × 10) + (144 × 2) = 1440 + 288 = 1728."
    ]
  },
  {
    id: "fractions",
    title: "Fraction Percentage",
    description: "Instantly convert between fractions, decimals, and percentages (e.g. 1/8 to 12.5%).",
    difficulty: "Medium",
    estQuestions: "90+",
    iconName: "Percent",
    previewQuestions: [
      "What is 3/8 as a percentage?",
      "Convert 83.33% to a fraction.",
      "Calculate 37.5% of 640.",
      "What is 1/6 as a decimal?"
    ],
    preparationTips: [
      "Memorize the standard eighths: 1/8 = 12.5%, 3/8 = 37.5%, 5/8 = 62.5%, 7/8 = 87.5%.",
      "Recognize repeating decimals: 1/6 = 0.1666... = 16.67%, 1/3 = 33.33%.",
      "Multiply by fractions rather than percentages: e.g., 37.5% of 640 = 3/8 × 640 = 3 × 80 = 240."
    ]
  },
  {
    id: "powers",
    title: "Power Tables",
    description: "Develop speed in finding powers of 2, 3, 5, and 10. Crucial for computer science and logarithms.",
    difficulty: "Hard",
    estQuestions: "80+",
    iconName: "TrendingUp",
    previewQuestions: [
      "2⁸ = ?",
      "3⁵ = ?",
      "5⁴ = ?",
      "2¹⁰ = ?"
    ],
    preparationTips: [
      "Learn the double rule for base 2: every step doubles the previous answer.",
      "Memorize major benchmarks: 2¹⁰ = 1024, 3⁵ = 243, 5⁴ = 625.",
      "Apply base splitting: e.g., 2⁸ = 2⁴ × 2⁴ = 16 × 16 = 256."
    ]
  },
  {
    id: "addition",
    title: "Addition",
    description: "Rapid mental addition of 2-digit, 3-digit, and decimal numbers without scratchpads.",
    difficulty: "Easy",
    estQuestions: "200+",
    iconName: "PlusCircle",
    previewQuestions: [
      "68 + 79 = ?",
      "345 + 567 = ?",
      "12.4 + 9.8 = ?",
      "189 + 76 = ?"
    ],
    preparationTips: [
      "Add from left to right (hundreds, then tens, then units): 68 + 79 = (60+70) + (8+9) = 130 + 17 = 147.",
      "Round up and adjust: e.g., for 189 + 76, think (190 + 76) - 1 = 266 - 1 = 265.",
      "Cluster numbers close to 100 or 1000 for rapid summing."
    ]
  },
  {
    id: "subtraction",
    title: "Subtraction",
    description: "Quick mental subtraction using base bridging and rounding techniques.",
    difficulty: "Easy",
    estQuestions: "200+",
    iconName: "MinusCircle",
    previewQuestions: [
      "142 - 89 = ?",
      "783 - 495 = ?",
      "8.3 - 4.7 = ?",
      "204 - 118 = ?"
    ],
    preparationTips: [
      "Add up instead of subtracting: to find 142 - 89, think '89 + 11 = 100, then + 42 = 142. So 11 + 42 = 53.'",
      "Adjust subtrahend: for 783 - 495, calculate (783 - 500) + 5 = 283 + 5 = 288.",
      "Process left-to-right to keep values in memory."
    ]
  },
  {
    id: "multiplication",
    title: "Multiplication",
    description: "Advanced multiplication strategies like grid methods, cross-multiplication, and doubling/halving.",
    difficulty: "Medium",
    estQuestions: "150+",
    iconName: "Multiply",
    previewQuestions: [
      "42 × 25 = ?",
      "31 × 32 = ?",
      "84 × 15 = ?",
      "125 × 32 = ?"
    ],
    preparationTips: [
      "Use doubling and halving: 84 × 15 = 42 × 30 = 1260.",
      "Multiply by 25: divide by 4 and multiply by 100: 42 × 25 = (42 / 4) × 100 = 10.5 × 100 = 1050.",
      "Use (a - b)(a + b) for close numbers: 31 × 29 = (30 + 1)(30 - 1) = 30² - 1 = 900 - 1 = 899."
    ]
  },
  {
    id: "division",
    title: "Division",
    description: "Quick division techniques, divisibility rules, and mental remainder estimates.",
    difficulty: "Hard",
    estQuestions: "100+",
    iconName: "Divide",
    previewQuestions: [
      "342 ÷ 9 = ?",
      "875 ÷ 25 = ?",
      "456 ÷ 6 = ?",
      "1024 ÷ 16 = ?"
    ],
    preparationTips: [
      "Learn key divisibility rules: a number is divisible by 9 if the sum of its digits is divisible by 9.",
      "Partition the dividend: e.g., 456 ÷ 6 = (420 ÷ 6) + (36 ÷ 6) = 70 + 6 = 76.",
      "Divide by 25: multiply the number by 4 and divide by 100: e.g., 875 ÷ 25 = (875 × 4) ÷ 100 = 3500 ÷ 100 = 35."
    ]
  },
  {
    id: "mixed",
    title: "Mixed Practice",
    description: "Test your mental reflexes with a random combination of operators, signs, and decimals.",
    difficulty: "Hard",
    estQuestions: "250+",
    iconName: "Shuffle",
    previewQuestions: [
      "(15 × 6) + 45 = ?",
      "1.2 ÷ 0.3 + 12² = ?",
      "(48 + 52) ÷ 5 = ?",
      "35% of 80 - 18 = ?"
    ],
    preparationTips: [
      "Follow order of operations (BODMAS/PEMDAS) strictly: Parentheses, Powers, Multiply/Divide, Add/Subtract.",
      "Store intermediate results in your mental scratchpad: e.g. for (15×6)+45, hold 90, then add 45 = 135.",
      "Stay calm when switching operations; take a microsecond to identify the sign before solving."
    ]
  },
  {
    id: "types",
    title: "Types of Numbers",
    description: "Identify prime numbers, composite numbers, factors, multiples, and mathematical properties.",
    difficulty: "Medium",
    estQuestions: "80+",
    iconName: "Hash",
    previewQuestions: [
      "Which of these is a prime: 51, 87, 91, 97?",
      "Is 119 composite or prime?",
      "What is the largest prime factor of 84?",
      "Find the Least Common Multiple (LCM) of 12 and 15."
    ],
    preparationTips: [
      "Memorize all primes under 100. (Hint: 51 = 3×17, 87 = 3×29, 91 = 7×13, 97 is prime).",
      "Primes ending in 1, 3, 7, 9 can be tricky; test divisibility by 3 (digit sum) and 7.",
      "For LCM: (Number A × Number B) / GCD. For 12 and 15, GCD is 3, so (12 × 15) / 3 = 180 / 3 = 60."
    ]
  }
];

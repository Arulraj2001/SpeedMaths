import { mathCheckers } from "./math-utils";
import { numberTypes } from "@/data/number-types";

export interface Question {
  id: string;
  text: string;
  answer: string;
  hint: string;
  options: string[];
}

const randomRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Generates logical MCQ incorrect options based on the correct answer
const generateNumericalOptions = (correctVal: number): string[] => {
  const options = new Set<string>([String(correctVal)]);
  const offsets = [-1, 1, -10, 10, -2, 2, -5, 5, -20, 20];
  
  // Try to generate offsets
  for (const offset of offsets) {
    const candidate = correctVal + offset;
    if (candidate > 0 && candidate !== correctVal) {
      options.add(String(candidate));
    }
    if (options.size >= 4) break;
  }

  // If correctVal is larger, try swapping digits
  if (correctVal > 10 && options.size < 4) {
    const strVal = String(correctVal);
    if (strVal.length === 2) {
      const swapped = strVal[1] + strVal[0];
      if (swapped !== strVal && swapped.startsWith("1")) {
        options.add(swapped);
      }
    } else if (strVal.length === 3) {
      const swapped = strVal[0] + strVal[2] + strVal[1];
      options.add(swapped);
    }
  }

  // Fallback random numbers
  while (options.size < 4) {
    const variance = Math.max(5, Math.floor(correctVal * 0.25));
    const candidate = correctVal + randomRange(-variance, variance);
    if (candidate > 0 && candidate !== correctVal) {
      options.add(String(candidate));
    }
  }

  return shuffleArray(Array.from(options));
};

export const generateQuestion = (
  topicId: string,
  difficulty: "Easy" | "Medium" | "Hard"
): Question => {
  const qId = Math.random().toString(36).substring(2, 9);
  let text = "";
  let answer = "";
  let hint = "";
  let options: string[] = [];

  switch (topicId) {
    case "tables": {
      let base = 2;
      let multiplier = 1;
      if (difficulty === "Easy") {
        base = randomRange(2, 10);
        multiplier = randomRange(1, 10);
      } else if (difficulty === "Medium") {
        base = randomRange(11, 20);
        multiplier = randomRange(1, 12);
      } else {
        base = randomRange(21, 30);
        multiplier = randomRange(1, 20);
      }
      text = `${base} × ${multiplier} = ?`;
      const prod = base * multiplier;
      answer = String(prod);
      hint = `Break down: e.g. ${base} × ${multiplier} = (${base - (base % 10)} × ${multiplier}) + (${base % 10} × ${multiplier})`;
      options = generateNumericalOptions(prod);
      break;
    }

    case "squares": {
      let val = 1;
      if (difficulty === "Easy") val = randomRange(2, 15);
      else if (difficulty === "Medium") val = randomRange(16, 40);
      else val = randomRange(41, 100);

      text = `${val}² = ?`;
      const sq = val * val;
      answer = String(sq);
      
      if (val % 10 === 5) {
        const temp = Math.floor(val / 10);
        hint = `Ending in 5 trick: multiply ${temp} by ${temp + 1} (${temp * (temp + 1)}) and append 25 = ${sq}`;
      } else {
        const rounded = val - (val % 10);
        hint = `Algebraic expansion: e.g., (${rounded} + ${val % 10})² = ${rounded}² + 2 × ${rounded} × ${val % 10} + ${val % 10}²`;
      }
      options = generateNumericalOptions(sq);
      break;
    }

    case "cubes": {
      let val = 1;
      if (difficulty === "Easy") val = randomRange(2, 10);
      else if (difficulty === "Medium") val = randomRange(11, 25);
      else val = randomRange(26, 50);

      text = `${val}³ = ?`;
      const cb = val * val * val;
      answer = String(cb);
      hint = `Factorize: e.g. ${val}³ = ${val}² × ${val} = ${val * val} × ${val}`;
      options = generateNumericalOptions(cb);
      break;
    }

    case "fractions": {
      const easyDenoms = [2, 4, 10];
      const medDenoms = [3, 5, 8];
      const hardDenoms = [6, 12, 16];
      let d = 4;
      if (difficulty === "Easy") d = easyDenoms[randomRange(0, easyDenoms.length - 1)];
      else if (difficulty === "Medium") d = medDenoms[randomRange(0, medDenoms.length - 1)];
      else d = hardDenoms[randomRange(0, hardDenoms.length - 1)];

      const n = randomRange(1, d - 1);
      const isPercentageQuestion = Math.random() > 0.5;

      const decimal = n / d;
      const pct = decimal * 100;

      if (isPercentageQuestion) {
        text = `Convert ${n}/${d} to a percentage:`;
        answer = `${pct.toFixed(1)}%`;
        hint = `Recall benchmark: e.g. 1/${d} = ${(100 / d).toFixed(1)}%, so multiply by ${n}.`;
        
        // Generate percentage options
        const pctOptions = new Set<string>([answer]);
        const offsets = [-5, 5, -10, 10, -2.5, 2.5];
        for (const offset of offsets) {
          const val = pct + offset;
          if (val > 0 && val < 100) {
            pctOptions.add(`${val.toFixed(1)}%`);
          }
          if (pctOptions.size >= 4) break;
        }
        options = shuffleArray(Array.from(pctOptions));
      } else {
        text = `What fraction matches ${pct.toFixed(1)}%?`;
        answer = `${n}/${d}`;
        hint = `Divide by common factors: ${pct.toFixed(1)}/100 simplifying down to ${n}/${d}`;
        
        const fracOptions = new Set<string>([answer]);
        const optionsList = ["1/2", "1/4", "3/4", "1/3", "2/3", "1/5", "2/5", "3/5", "4/5", "1/8", "3/8", "5/8", "7/8", "1/10", "3/10", "7/10", "9/10"];
        for (const opt of optionsList) {
          if (opt !== answer) {
            fracOptions.add(opt);
          }
          if (fracOptions.size >= 4) break;
        }
        options = shuffleArray(Array.from(fracOptions));
      }
      break;
    }

    case "powers": {
      let base = 2;
      let exponent = 2;
      if (difficulty === "Easy") {
        base = Math.random() > 0.5 ? 2 : 10;
        exponent = base === 2 ? randomRange(2, 8) : randomRange(1, 4);
      } else if (difficulty === "Medium") {
        base = Math.random() > 0.5 ? 3 : 5;
        exponent = base === 3 ? randomRange(2, 6) : randomRange(2, 5);
      } else {
        base = Math.random() > 0.5 ? 11 : 12;
        exponent = randomRange(2, 4);
      }

      text = `${base}^${exponent} = ?`;
      const val = Math.pow(base, exponent);
      answer = String(val);
      hint = `Recall benchmarks: e.g. ${base}^${exponent} = ${base}^(${exponent - 1}) × ${base}`;
      options = generateNumericalOptions(val);
      break;
    }

    case "addition": {
      let a = 0;
      let b = 0;
      if (difficulty === "Easy") {
        a = randomRange(10, 50);
        b = randomRange(5, 40);
      } else if (difficulty === "Medium") {
        a = randomRange(51, 200);
        b = randomRange(20, 150);
      } else {
        a = randomRange(201, 999);
        b = randomRange(101, 899);
      }
      text = `${a} + ${b} = ?`;
      const sum = a + b;
      answer = String(sum);
      hint = `Left-to-right summing: add hundreds, then tens, then units. e.g. ${a} + ${b}`;
      options = generateNumericalOptions(sum);
      break;
    }

    case "subtraction": {
      let a = 0;
      let b = 0;
      if (difficulty === "Easy") {
        a = randomRange(20, 99);
        b = randomRange(5, a - 5);
      } else if (difficulty === "Medium") {
        a = randomRange(100, 300);
        b = randomRange(20, a - 10);
      } else {
        a = randomRange(301, 999);
        b = randomRange(100, a - 50);
      }
      text = `${a} - ${b} = ?`;
      const diff = a - b;
      answer = String(diff);
      hint = `Round up and adjust: e.g. to subtract ${b}, subtract the next 10 and add back the difference.`;
      options = generateNumericalOptions(diff);
      break;
    }

    case "multiplication": {
      let a = 0;
      let b = 0;
      if (difficulty === "Easy") {
        a = randomRange(11, 30);
        b = randomRange(2, 9);
      } else if (difficulty === "Medium") {
        a = randomRange(11, 40);
        b = randomRange(11, 20);
      } else {
        a = randomRange(41, 99);
        b = randomRange(21, 50);
      }
      text = `${a} × ${b} = ?`;
      const prod = a * b;
      answer = String(prod);
      
      if (b === 25) {
        hint = `Multiplication by 25 trick: divide ${a} by 4 and multiply by 100.`;
      } else {
        hint = `Left-to-right grid breakdown: (${a - (a % 10)} × ${b}) + (${a % 10} × ${b})`;
      }
      options = generateNumericalOptions(prod);
      break;
    }

    case "division": {
      let d = 2;
      let quotient = 1;
      if (difficulty === "Easy") {
        d = randomRange(2, 10);
        quotient = randomRange(5, 15);
      } else if (difficulty === "Medium") {
        d = randomRange(11, 20);
        quotient = randomRange(6, 25);
      } else {
        d = randomRange(21, 50);
        quotient = randomRange(11, 40);
      }
      const dividend = d * quotient;
      text = `${dividend} ÷ ${d} = ?`;
      answer = String(quotient);
      hint = `Divisibility checking: e.g., how many times does ${d} fit in ${dividend}?`;
      options = generateNumericalOptions(quotient);
      break;
    }

    case "mixed": {
      // (a × b) + c or (a + b) × c
      let a = 2;
      let b = 2;
      let c = 2;
      const config = Math.random() > 0.5;

      if (difficulty === "Easy") {
        a = randomRange(2, 10);
        b = randomRange(2, 10);
        c = randomRange(5, 20);
      } else if (difficulty === "Medium") {
        a = randomRange(11, 20);
        b = randomRange(3, 8);
        c = randomRange(15, 50);
      } else {
        a = randomRange(21, 50);
        b = randomRange(4, 12);
        c = randomRange(51, 200);
      }

      if (config) {
        text = `(${a} × ${b}) + ${c} = ?`;
        const res = a * b + c;
        answer = String(res);
        hint = `BODMAS: calculate multiplication first (${a}×${b}=${a*b}), then add ${c}.`;
        options = generateNumericalOptions(res);
      } else {
        text = `(${a} + ${b}) × ${c} = ?`;
        const res = (a + b) * c;
        answer = String(res);
        hint = `BODMAS: calculate addition in parentheses first (${a}+${b}=${a+b}), then multiply by ${c}.`;
        options = generateNumericalOptions(res);
      }
      break;
    }

    case "types": {
      // Questions about classifications (Is X a prime?, Is X Automorphic?)
      const categoryList = numberTypes.filter((t) => {
        if (difficulty === "Easy") return t.difficulty === "Easy";
        if (difficulty === "Medium") return t.difficulty === "Medium" || t.difficulty === "Easy";
        return true;
      });

      const chosenType = categoryList[randomRange(0, categoryList.length - 1)];
      const checker = mathCheckers[chosenType.id];

      // Toggles between asking for a positive matches vs checks
      let checkVal = 1;
      const isPositive = Math.random() > 0.5;

      if (isPositive) {
        // Find a positive match number
        let current = randomRange(1, 200);
        while (!checker(current)) {
          current++;
        }
        checkVal = current;
      } else {
        // Find a negative mismatch number
        let current = randomRange(1, 200);
        while (checker(current)) {
          current = randomRange(1, 200);
        }
        checkVal = current;
      }

      text = `Is ${checkVal} a ${chosenType.name.slice(0, -1)}? (True / False)`;
      answer = checker(checkVal) ? "True" : "False";
      hint = `Concept Hint: ${chosenType.definition}`;
      options = ["True", "False"];
      break;
    }

    default: {
      text = "2 + 2 = ?";
      answer = "4";
      hint = "Addition math basic.";
      options = ["2", "4", "6", "8"];
    }
  }

  return {
    id: qId,
    text,
    answer,
    hint,
    options,
  };
};

export class SeededRandom {
  private seed: number;
  constructor(seedStr: string) {
    let h = 1779033703 ^ seedStr.length;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    this.seed = (h >>> 0);
  }
  next(): number {
    this.seed = (Math.imul(this.seed, 1664525) + 1013904223) >>> 0;
    return (this.seed & 0x7FFFFFFF) / 0x7FFFFFFF;
  }
  range(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

export const generateQuestionsSet = (
  topicId: string,
  difficulty: "Easy" | "Medium" | "Hard" | "Adaptive" | "Random",
  count: number,
  seed?: string
): Question[] => {
  const originalRandom = Math.random;
  if (seed) {
    const rng = new SeededRandom(seed);
    Math.random = () => rng.next();
  }

  try {
    const set: Question[] = [];
    const activeCount = count <= 0 ? 100 : count; // 100 for unlimited sets initially

    // Standard topics mapping
    const activeTopic = topicId === "shuffle" 
      ? ["tables", "squares", "cubes", "fractions", "powers", "addition", "subtraction", "multiplication", "division", "mixed", "types"]
      : [topicId];

    for (let i = 0; i < activeCount; i++) {
      // Determine active topic for shuffle
      const topic = activeTopic[randomRange(0, activeTopic.length - 1)];
      
      // Determine active difficulty
      let diff = difficulty;
      if (difficulty === "Random") {
        const choices: Array<"Easy" | "Medium" | "Hard"> = ["Easy", "Medium", "Hard"];
        diff = choices[randomRange(0, 2)];
      } else if (difficulty === "Adaptive") {
        // Adaptive difficulty increases slowly along the set index
        if (i < activeCount * 0.3) diff = "Easy";
        else if (i < activeCount * 0.7) diff = "Medium";
        else diff = "Hard";
      }

      set.push(generateQuestion(topic, diff as "Easy" | "Medium" | "Hard"));
    }

    return set;
  } finally {
    if (seed) {
      Math.random = originalRandom;
    }
  }
};

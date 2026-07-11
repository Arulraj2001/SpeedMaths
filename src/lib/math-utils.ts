export function factorial(num: number): number {
  if (num <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= num; i++) {
    res *= i;
  }
  return res;
}

export function isEven(n: number): boolean {
  return n % 2 === 0;
}

export function isOdd(n: number): boolean {
  return n % 2 !== 0;
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function isComposite(n: number): boolean {
  return n > 3 && !isPrime(n);
}

export function isNatural(n: number): boolean {
  return Number.isInteger(n) && n > 0;
}

export function isWhole(n: number): boolean {
  return Number.isInteger(n) && n >= 0;
}

export function isInteger(n: number): boolean {
  return Number.isInteger(n);
}

export function isRational(n: number): boolean {
  // Any integer checked is rational. In details we show rational fractions.
  return Number.isInteger(n);
}

export function isIrrational(_n: number): boolean {
  // Integers aren't irrational.
  return typeof _n !== "number";
}

export function isReal(_n: number): boolean {
  return typeof _n === "number";
}

export function isArmstrong(n: number): boolean {
  if (n < 0) return false;
  const digits = String(n).split("").map(Number);
  const power = digits.length;
  const sum = digits.reduce((acc, curr) => acc + Math.pow(curr, power), 0);
  return sum === n;
}

export function isPalindrome(n: number): boolean {
  if (n < 0) return false;
  const str = String(n);
  return str === str.split("").reverse().join("");
}

export function isNeon(n: number): boolean {
  const square = n * n;
  const digitsSum = String(square)
    .split("")
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0);
  return digitsSum === n;
}

export function isStrong(n: number): boolean {
  if (n <= 0) return false;
  const digits = String(n).split("").map(Number);
  const sum = digits.reduce((acc, curr) => acc + factorial(curr), 0);
  return sum === n;
}

export function isHarshad(n: number): boolean {
  if (n <= 0) return false;
  const digitsSum = String(n)
    .split("")
    .map(Number)
    .reduce((acc, curr) => acc + curr, 0);
  return n % digitsSum === 0;
}

export function isPerfect(n: number): boolean {
  if (n <= 1) return false;
  let sum = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      sum += i;
      if (i * i !== n) {
        sum += n / i;
      }
    }
  }
  return sum === n;
}

export function isHappy(n: number): boolean {
  const seen = new Set<number>();
  let current = n;
  while (current !== 1 && !seen.has(current)) {
    seen.add(current);
    current = String(current)
      .split("")
      .map(Number)
      .reduce((acc, curr) => acc + curr * curr, 0);
  }
  return current === 1;
}

export function isSunny(n: number): boolean {
  const temp = n + 1;
  const root = Math.round(Math.sqrt(temp));
  return root * root === temp;
}

export function isAutomorphic(n: number): boolean {
  const square = n * n;
  return String(square).endsWith(String(n));
}

// Global dictionary mapping types to validation functions
export const mathCheckers: Record<string, (n: number) => boolean> = {
  even: isEven,
  odd: isOdd,
  prime: isPrime,
  composite: isComposite,
  natural: isNatural,
  whole: isWhole,
  integer: isInteger,
  rational: isRational,
  irrational: isIrrational,
  real: isReal,
  armstrong: isArmstrong,
  palindrome: isPalindrome,
  neon: isNeon,
  strong: isStrong,
  harshad: isHarshad,
  perfect: isPerfect,
  happy: isHappy,
  sunny: isSunny,
  automorphic: isAutomorphic,
};

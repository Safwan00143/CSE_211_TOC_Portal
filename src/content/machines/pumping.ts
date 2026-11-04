/* Pumping-lemma arguments in notes and solutions, brute-forced for small pumping lengths by scripts/verify.ts. */
import type { PumpClaim } from "@/lib/pumping"
import { b22Pumping } from "./b22"
import { bookPumping } from "./book"
import { b18Pumping } from "./b18"
import { b16Pumping } from "./b16"
import { b14Pumping } from "./b14"
import { b13Pumping } from "./b13"
import { b12Pumping } from "./b12"
import { b11Pumping } from "./b11"
import { b10Pumping } from "./b10"
import { b09Pumping } from "./b09"
import { b07Pumping } from "./b07"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const isPrime = (n: number) => n >= 2 && [...Array(Math.floor(Math.sqrt(n)) + 1).keys()].slice(2).every((d) => n % d !== 0)
const nextPrimeAbove = (p: number) => {
  let q = p + 1
  while (!isPrime(q)) q++
  return q
}
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n))
const fib = (n: number): number[] => {
  const f = [0, 1]
  while (f.length <= n) f.push(f.at(-1)! + f.at(-2)!)
  return f
}

export const pumpingClaims: PumpClaim[] = [
  ...b22Pumping,
  ...b18Pumping,
  ...b16Pumping,
  ...b14Pumping,
  ...b13Pumping,
  ...b12Pumping,
  ...b11Pumping,
  ...b10Pumping,
  ...b09Pumping,
  ...b07Pumping,
  ...bookPumping,
  /* ───── Regular (notes) ───── */
  { id: "note-pl-0n1n", kind: "regular", inL: (w) => /^0*1*$/.test(w) && count(w, "0") === count(w, "1"), witness: (p) => "0".repeat(p) + "1".repeat(p), i: () => 0 },
  { id: "note-pl-pal", kind: "regular", inL: (w) => w === [...w].reverse().join(""), witness: (p) => "a".repeat(p) + "b" + "a".repeat(p), i: () => 0 },
  { id: "note-pl-anbncn", kind: "regular", inL: (w) => { const b = blocks(w, "abc"); return !!b && b[0] === b[1] && b[1] === b[2] }, witness: (p) => "a".repeat(p) + "b".repeat(p) + "c".repeat(p), i: () => 2 },
  { id: "note-pl-w#w", kind: "regular", inL: (w) => { const s = w.split("#"); return s.length === 2 && s[0] === s[1] }, witness: (p) => "0".repeat(p) + "1#" + "0".repeat(p) + "1", i: () => 0 },
  { id: "note-pl-squares", kind: "regular", inL: (w) => /^a*$/.test(w) && isSquare(w.length), witness: (p) => "a".repeat(p * p), i: () => 2 },
  { id: "note-pl-primes", kind: "regular", inL: (w) => /^a*$/.test(w) && isPrime(w.length), witness: (p) => "a".repeat(nextPrimeAbove(p)), i: (p) => nextPrimeAbove(p) + 1 },
  {
    id: "note-pl-fib",
    kind: "regular",
    inL: (w) => /^a*$/.test(w) && fib(40).includes(w.length),
    witness: (p) => { const f = fib(40); const m = f.findIndex((x, k) => k >= 3 && f[k - 1] > p); return "a".repeat(f[m]) },
    i: () => 2,
  },
  {
    id: "note-pl-abcbac",
    kind: "regular",
    inL: (w) => { const m = w.match(/^((?:abc)*)((?:bac)*)$/); return !!m && m[1].length === m[2].length },
    witness: (p) => "abc".repeat(p) + "bac".repeat(p),
    i: () => 0,
  },
  /* ───── Context-free (notes) ───── */
  { id: "note-cpl-anbncn", kind: "cfl", inL: (w) => { const b = blocks(w, "abc"); return !!b && b[0] === b[1] && b[1] === b[2] }, witness: (p) => "a".repeat(p) + "b".repeat(p) + "c".repeat(p), i: () => 2, ps: [1, 2, 3, 4] },
  {
    id: "note-cpl-crossing",
    kind: "cfl",
    inL: (w) => { const b = blocks(w, "abcd"); return !!b && b[0] === b[2] && b[1] === b[3] },
    witness: (p) => "a".repeat(p) + "b".repeat(p) + "c".repeat(p) + "d".repeat(p),
    i: () => 2,
    ps: [1, 2, 3],
  },
  { id: "note-cpl-primes", kind: "cfl", inL: (w) => /^a*$/.test(w) && isPrime(w.length), witness: (p) => "a".repeat(nextPrimeAbove(p)), i: (p) => nextPrimeAbove(p) + 1, ps: [1, 2, 3, 4, 5] },
  { id: "note-cpl-square", kind: "cfl", inL: (w) => { const b = blocks(w, "ab"); return !!b && b[1] === b[0] * b[0] }, witness: (p) => "a".repeat(p) + "b".repeat(p * p), i: () => 2, ps: [1, 2, 3] },
  { id: "note-cpl-ww", kind: "cfl", inL: (w) => w.length % 2 === 0 && w.slice(0, w.length / 2) === w.slice(w.length / 2), witness: (p) => ("0".repeat(p) + "1".repeat(p)).repeat(2), i: () => 0, ps: [1, 2, 3, 4] },
]

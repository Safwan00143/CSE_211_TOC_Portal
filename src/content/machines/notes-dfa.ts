/* Machines drawn in the DFA note (Hakim Sir, Lecture 3), each with a direct test of its language. */
import type { FA } from "@/lib/automata"
import type { Check } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length

/** Build a DFA from a table { state: { symbol: next } }. */
export function dfa(start: string, accept: string[], table: Record<string, Record<string, string>>): FA {
  const states = Object.keys(table)
  const alphabet = [...new Set(states.flatMap((q) => Object.keys(table[q])))]
  return {
    kind: "fa",
    states,
    alphabet,
    start,
    accept,
    delta: states.flatMap((q) => Object.entries(table[q]).map(([a, p]) => [q, a, p] as [string, string, string])),
  }
}

export const dfaEven1 = dfa("qE", ["qE"], {
  qE: { 0: "qE", 1: "qO" },
  qO: { 0: "qO", 1: "qE" },
})

/** States remember the longest suffix that is a prefix of 001. */
export const dfa001 = dfa("q", ["q001"], {
  q: { 0: "q0", 1: "q" },
  q0: { 0: "q00", 1: "q" },
  q00: { 0: "q00", 1: "q001" },
  q001: { 0: "q001", 1: "q001" },
})

/** Remainder mod 3 of the binary number read so far; qs = nothing read yet. */
export const dfaDiv3 = dfa("qs", ["q0"], {
  qs: { 0: "q0", 1: "q1" },
  q0: { 0: "q0", 1: "q1" },
  q1: { 0: "q2", 1: "q0" },
  q2: { 0: "q1", 1: "q2" },
})

/** Football scores x-y over {0, d, -}; d stands for any nonzero digit. "H" is the state after the hyphen. */
export const dfaScores = dfa("S", ["Z2", "N2"], {
  S: { 0: "Z1", d: "N1", "-": "D" },
  Z1: { 0: "D", d: "D", "-": "H" },
  N1: { 0: "N1", d: "N1", "-": "H" },
  H: { 0: "Z2", d: "N2", "-": "D" },
  Z2: { 0: "D", d: "D", "-": "D" },
  N2: { 0: "N2", d: "N2", "-": "D" },
  D: { 0: "D", d: "D", "-": "D" },
})

/** Product of (parity of 0s) × (length mod 3). State "E0" = even 0s, length ≡ 0. */
const productTable: Record<string, Record<string, string>> = {}
for (const p of ["E", "O"])
  for (const l of [0, 1, 2]) {
    const flip = p === "E" ? "O" : "E"
    productTable[`${p}${l}`] = { 0: `${flip}${(l + 1) % 3}`, 1: `${p}${(l + 1) % 3}` }
  }
export const dfaProduct = dfa("E0", ["E0"], productTable)

/** Sliding window of the last two symbols; q00 pretends two leading zeros. */
export const dfaSecondLast = dfa("q00", ["q10", "q11"], {
  q00: { 0: "q00", 1: "q01" },
  q01: { 0: "q10", 1: "q11" },
  q10: { 0: "q00", 1: "q01" },
  q11: { 0: "q10", 1: "q11" },
})

/** Contains ab but not ba: exactly a⁺b⁺. */
export const dfaAbNotBa = dfa("S", ["AB"], {
  S: { a: "A", b: "B" },
  A: { a: "A", b: "AB" },
  AB: { a: "Dead", b: "AB" },
  B: { a: "Dead", b: "B" },
  Dead: { a: "Dead", b: "Dead" },
})

/** No symbol repeated over {a,b,c}: the state is the set of symbols seen. */
const subsets = ["∅", "a", "b", "c", "ab", "ac", "bc", "abc"]
const norepTable: Record<string, Record<string, string>> = { D: { a: "D", b: "D", c: "D" } }
for (const s of subsets) {
  const seen = s === "∅" ? "" : s
  norepTable[s] = Object.fromEntries(
    ["a", "b", "c"].map((x) => [x, seen.includes(x) ? "D" : [...(seen + x)].sort().join("")]),
  )
}
export const dfaNoRepeat = dfa("∅", subsets, norepTable)

/** One C-style block comment over {/, *, x}: q2 = inside, q3 = inside after a star, q4 = closed. */
export const dfaComment = dfa("q0", ["q4"], {
  q0: { "/": "q1", "*": "d", x: "d" },
  q1: { "/": "d", "*": "q2", x: "d" },
  q2: { "/": "q2", "*": "q3", x: "q2" },
  q3: { "/": "q4", "*": "q3", x: "q2" },
  q4: { "/": "d", "*": "d", x: "d" },
  d: { "/": "d", "*": "d", x: "d" },
})

const commentOk = (w: string) => w.startsWith("/*") && w.length >= 4 && w.slice(2).indexOf("*/") === w.length - 4

const scoreOk = (w: string) => {
  const m = w.match(/^([0d]+)-([0d]+)$/)
  const num = (x: string) => x === "0" || /^d[0d]*$/.test(x)
  return !!m && num(m[1]) && num(m[2])
}

export const dfaNoteChecks: Check[] = [
  { id: "note-dfa-even1", machine: dfaEven1, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => count(w, "1") % 2 === 0 },
  { id: "note-dfa-001", machine: dfa001, dfa: true, alphabet: ["0", "1"], maxLen: 11, inL: (w) => w.includes("001") },
  {
    id: "note-dfa-div3",
    machine: dfaDiv3,
    dfa: true,
    alphabet: ["0", "1"],
    maxLen: 12,
    inL: (w) => w.length > 0 && parseInt(w, 2) % 3 === 0,
  },
  { id: "note-dfa-scores", machine: dfaScores, dfa: true, alphabet: ["0", "d", "-"], maxLen: 8, inL: scoreOk },
  {
    id: "note-dfa-product",
    machine: dfaProduct,
    dfa: true,
    alphabet: ["0", "1"],
    maxLen: 11,
    inL: (w) => count(w, "0") % 2 === 0 && w.length % 3 === 0,
  },
  {
    id: "note-dfa-second-last",
    machine: dfaSecondLast,
    dfa: true,
    alphabet: ["0", "1"],
    maxLen: 10,
    inL: (w) => w.length >= 2 && w[w.length - 2] === "1",
  },
  { id: "note-dfa-ab-not-ba", machine: dfaAbNotBa, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => w.includes("ab") && !w.includes("ba") },
  {
    id: "note-dfa-norepeat",
    machine: dfaNoRepeat,
    dfa: true,
    alphabet: ["a", "b", "c"],
    maxLen: 6,
    inL: (w) => new Set(w).size === w.length,
  },
  { id: "note-dfa-comment", machine: dfaComment, dfa: true, alphabet: ["/", "*", "x"], maxLen: 9, inL: commentOk },
]

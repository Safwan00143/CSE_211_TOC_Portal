/* Sample machines that exercise every drawing feature of the figure kit (see /figures). */
import type { CFG, FA, PdaHmu, PdaSipser, TM } from "@/lib/automata"
import type { Check } from "./types"

/** Hakim Sir's running example: an even number of 1's. */
export const even1: FA = {
  kind: "fa",
  states: ["qE", "qO"],
  alphabet: ["0", "1"],
  start: "qE",
  accept: ["qE"],
  delta: [
    ["qE", "0", "qE"],
    ["qE", "1", "qO"],
    ["qO", "0", "qO"],
    ["qO", "1", "qE"],
  ],
}

/** NFA for strings containing 101 (Hakim Sir, Lecture 4), with an ε-move added for the demo. */
export const contains101: FA = {
  kind: "fa",
  states: ["q0", "q1", "q2", "q3"],
  alphabet: ["0", "1"],
  start: "q0",
  accept: ["q3"],
  delta: [
    ["q0", "0", "q0"],
    ["q0", "1", "q0"],
    ["q0", "1", "q1"],
    ["q1", "0", "q2"],
    ["q2", "1", "q3"],
    ["q3", "0", "q3"],
    ["q3", "1", "q3"],
  ],
}

/** Sipser-style PDA for {0^n 1^n | n ≥ 0} (Hakim Sir, Lecture 8). */
export const zeroNoneN: PdaSipser = {
  kind: "pda-sipser",
  states: ["q1", "q2", "q3", "q4"],
  alphabet: ["0", "1"],
  stack: ["0", "$"],
  start: "q1",
  accept: ["q1", "q4"],
  delta: [
    ["q1", "ε", "ε", "q2", "$"],
    ["q2", "0", "ε", "q2", "0"],
    ["q2", "1", "0", "q3", "ε"],
    ["q3", "1", "0", "q3", "ε"],
    ["q3", "ε", "$", "q4", "ε"],
  ],
}

/** HMU-style PDA for ww^R by final state (Atif Sir, Lecture 3). */
export const wwr: PdaHmu = {
  kind: "pda-hmu",
  states: ["q0", "q1", "q2"],
  alphabet: ["0", "1"],
  stack: ["0", "1", "Z0"],
  start: "q0",
  startStack: "Z0",
  accept: ["q2"],
  acceptBy: "final",
  delta: [
    ...(["0", "1"] as const).flatMap((a) =>
      (["0", "1", "Z0"] as const).map((X) => ["q0", a, X, "q0", [a, X]] as [string, string, string, string, string[]]),
    ),
    ["q0", "ε", "Z0", "q1", ["Z0"]],
    ["q0", "ε", "0", "q1", ["0"]],
    ["q0", "ε", "1", "q1", ["1"]],
    ["q1", "0", "0", "q1", []],
    ["q1", "1", "1", "q1", []],
    ["q1", "ε", "Z0", "q2", ["Z0"]],
  ],
}

/** HMU's TM for {0^n 1^n | n ≥ 1} (Atif Sir, Lecture 4). */
export const tm0n1n: TM = {
  kind: "tm",
  states: ["q0", "q1", "q2", "q3", "q4"],
  alphabet: ["0", "1"],
  tape: ["0", "1", "X", "Y", "B"],
  blank: "B",
  start: "q0",
  accept: ["q4"],
  delta: [
    ["q0", "0", "q1", "X", "R"],
    ["q0", "Y", "q3", "Y", "R"],
    ["q1", "0", "q1", "0", "R"],
    ["q1", "Y", "q1", "Y", "R"],
    ["q1", "1", "q2", "Y", "L"],
    ["q2", "0", "q2", "0", "L"],
    ["q2", "Y", "q2", "Y", "L"],
    ["q2", "X", "q0", "X", "R"],
    ["q3", "Y", "q3", "Y", "R"],
    ["q3", "B", "q4", "B", "R"],
  ],
}

/** Atif Sir's CYK example (from HMU): S → AB | BC, A → BA | a, B → CC | b, C → AB | a. */
export const hmuCyk: CFG = {
  kind: "cfg",
  start: "S",
  rules: {
    S: [["A", "B"], ["B", "C"]],
    A: [["B", "A"], ["a"]],
    B: [["C", "C"], ["b"]],
    C: [["A", "B"], ["a"]],
  },
}

/** Balanced parentheses (Hakim Sir, Lecture 7). */
export const balanced: CFG = { kind: "cfg", start: "S", rules: { S: [["(", "S", ")", "S"], []] } }

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const balancedOk = (w: string) => {
  let d = 0
  for (const c of w) if ((d += c === "(" ? 1 : -1) < 0) return false
  return d === 0
}

export const kitChecks: Check[] = [
  { id: "kit-even1", machine: even1, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => count(w, "1") % 2 === 0 },
  { id: "kit-contains101", machine: contains101, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.includes("101") },
  { id: "kit-0n1n-sipser", machine: zeroNoneN, alphabet: ["0", "1"], maxLen: 10, inL: (w) => /^0*1*$/.test(w) && count(w, "0") === count(w, "1") },
  { id: "kit-wwr-hmu", machine: wwr, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length % 2 === 0 && w === [...w].reverse().join("") },
  { id: "kit-tm-0n1n", machine: tm0n1n, alphabet: ["0", "1"], maxLen: 10, inL: (w) => /^0+1+$/.test(w) && count(w, "0") === count(w, "1") },
  { id: "kit-balanced", grammar: balanced, alphabet: ["(", ")"], maxLen: 12, inL: balancedOk },
  { id: "kit-regex", regex: "(0+1)*101(0+1)*", alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.includes("101") },
  // Harness self-tests: nullable chains and left recursion in the grammar recogniser.
  {
    id: "kit-earley-nullable",
    grammar: { kind: "cfg", start: "S", rules: { S: [["A", "B", "A"]], A: [[], ["a"]], B: [["C"], []], C: [["B", "b"]] } },
    alphabet: ["a", "b"],
    maxLen: 8,
    inL: (w) => /^a?b*a?$/.test(w),
  },
  {
    id: "kit-earley-leftrec",
    grammar: { kind: "cfg", start: "E", rules: { E: [["E", "+", "T"], ["T"]], T: [["T", "*", "F"], ["F"]], F: [["(", "E", ")"], ["a"]] } },
    alphabet: ["a", "+", "*", "(", ")"],
    maxLen: 7,
    inL: (w) => {
      // Direct recursive-descent check of the same expression syntax.
      let i = 0
      const F = (): boolean => (w[i] === "a" ? (i++, true) : w[i] === "(" ? (i++, E() && w[i] === ")" ? (i++, true) : false) : false)
      const T = (): boolean => { if (!F()) return false; while (w[i] === "*") { i++; if (!F()) return false } return true }
      const E = (): boolean => { if (!T()) return false; while (w[i] === "+") { i++; if (!T()) return false } return true }
      return E() && i === w.length
    },
  },
]

/** Deliberately wrong pairings: the verify script must report every one of these as a failure. */
export const mustFail: Check[] = [
  { id: "selftest-dfa", machine: even1, alphabet: ["0", "1"], maxLen: 6, inL: (w) => count(w, "1") % 2 === 1 },
  { id: "selftest-pda", machine: zeroNoneN, alphabet: ["0", "1"], maxLen: 6, inL: (w) => /^0*1*$/.test(w) },
  { id: "selftest-cfg", grammar: balanced, alphabet: ["(", ")"], maxLen: 6, inL: (w) => w.length % 2 === 0 },
  { id: "selftest-tm", machine: tm0n1n, alphabet: ["0", "1"], maxLen: 6, inL: (w) => /^0*1*$/.test(w) && count(w, "0") === count(w, "1") },
  { id: "selftest-notdfa", machine: contains101, dfa: true, alphabet: ["0", "1"], maxLen: 6, inL: (w) => w.includes("101") },
  {
    id: "selftest-ambiguity",
    grammar: { kind: "cfg", start: "E", rules: { E: [["E", "+", "E"], ["a"]] } },
    alphabet: ["a", "+"],
    maxLen: 5,
    inL: (w) => /^a(\+a)*$/.test(w),
    unambiguous: true,
  },
  { id: "selftest-deterministic", machine: wwr, deterministic: true, alphabet: ["0", "1"], maxLen: 4, inL: (w) => w.length % 2 === 0 && w === [...w].reverse().join("") },
  { id: "selftest-not-ambiguous", grammar: balanced, alphabet: ["(", ")"], maxLen: 4, inL: balancedOk, ambiguousOn: ["(())"] },
]

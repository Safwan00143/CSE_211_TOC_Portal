/* Machines in the 17-batch (January 2020 term) solutions, each tested against its language. */
import { allStrings, faAccepts, grammar, regexMatcher, subsetConstruction } from "@/lib/automata"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { bitwiseTm, twoNumbers } from "./tm-bitwise"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]

/* ───── Q1(c): the given NFA ───── */

export const b17q1c = nfa(
  ["p", "q", "r"],
  "p",
  ["r"],
  [
    ["p", "a", "p"],
    ["p", "b", "q"],
    ["p", "c", "r"],
    ["q", "a", "q"],
    ["q", "b", "r"],
    ["q", "ε", "p"],
    ["r", "a", "r"],
    ["r", "c", "p"],
    ["r", "ε", "q"],
  ],
  ["a", "b", "c"],
)
/** Worked out by hand in the solution: a c anywhere, or at least two b's. */
export const q1cLanguage = (w: string) => w.includes("c") || count(w, "b") >= 2
export const b17q1cAccepted = allStrings(["a", "b", "c"], 3).filter((w) => faAccepts(b17q1c, w))

/* ───── Q2: the given DFA (last two symbols equal) ───── */

export const b17q2 = dfa("q0", ["q3", "q4"], {
  q0: { 0: "q1", 1: "q2" },
  q1: { 0: "q3", 1: "q2" },
  q2: { 0: "q1", 1: "q4" },
  q3: { 0: "q3", 1: "q2" },
  q4: { 0: "q1", 1: "q4" },
})
export const b17q2Nfa = nfa(
  ["s", "z1", "o1", "f"],
  "s",
  ["f"],
  [
    ["s", "0,1", "s"],
    ["s", "0", "z1"],
    ["z1", "0", "f"],
    ["s", "1", "o1"],
    ["o1", "1", "f"],
  ],
  B,
)
const endsDouble = (w: string) => w.endsWith("00") || w.endsWith("11")

/* ───── Q3(a): expressions over ∅ ───── */

export const b17q3a: [string, string, string[]][] = [
  ["i", "∅*∅*∅*∅*", [""]],
  ["ii", "∅*∪ε", [""]],
  ["iii", "(∅*∪1)(0∪1)", ["0", "1", "10", "11"]],
  ["iv", "(11)*∅(00)*", []],
  ["v", "(∅*∪0)(0∪1∪11)", ["0", "1", "00", "01", "11", "011"]],
]

/* ───── Q4(a): (1+ε)(00*1)*0* ───── */

export const b17q4aRegex = "(1+ε)(00*1)*0*"

/* ───── Q4(b): Thompson-style NFA for (0+1)*011 ───── */

export const b17q4b = nfa(
  ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
  "q0",
  ["q10"],
  [
    ["q0", "ε", "q1"],
    ["q0", "ε", "q6"],
    ["q1", "ε", "q2"],
    ["q1", "ε", "q4"],
    ["q2", "0", "q3"],
    ["q4", "1", "q5"],
    ["q3", "ε", "q6"],
    ["q5", "ε", "q6"],
    ["q6", "ε", "q1"],
    ["q6", "ε", "q7"],
    ["q7", "0", "q8"],
    ["q8", "1", "q9"],
    ["q9", "1", "q10"],
  ],
  B,
)
export const b17q4bSubset = subsetConstruction(b17q4b)

/* ───── Q5 ───── */

export const b17g5a = grammar("S -> A0A1A | A1A0A\nA -> 0A | 1A | ε")

/* ───── Q9: TM for XOR of w1 c w2 c ───── */

export const b17tmXor = bitwiseTm((a, b) => (a === b ? "0" : "1"))

export const b17Checks: Check[] = [
  { id: "b17-1c", machine: b17q1c, alphabet: ["a", "b", "c"], maxLen: 7, inL: q1cLanguage },
  { id: "b17-2a", machine: b17q2, dfa: true, alphabet: B, maxLen: 10, inL: endsDouble },
  { id: "b17-2b", machine: b17q2Nfa, alphabet: B, maxLen: 10, inL: endsDouble },
  { id: "b17-2c", regex: "ε+0+1+(0+1)*(01+10)", alphabet: B, maxLen: 10, inL: (w) => !endsDouble(w) },
  { id: "b17-4a", regex: b17q4aRegex, alphabet: B, maxLen: 11, inL: (w) => !w.includes("11") },
  { id: "b17-4b-nfa", machine: b17q4b, alphabet: B, maxLen: 10, inL: (w) => w.endsWith("011") },
  { id: "b17-4b-dfa", machine: b17q4bSubset.dfa, dfa: true, alphabet: B, maxLen: 10, inL: (w) => w.endsWith("011") },
  { id: "b17-5a", grammar: b17g5a, alphabet: B, maxLen: 9, inL: (w) => w.includes("0") && w.includes("1") },
  {
    id: "b17-9",
    machine: b17tmXor,
    alphabet: ["0", "1", "c"],
    maxLen: 10,
    inL: (w) => twoNumbers(w) !== null,
    output: (w) => { const [x, y] = twoNumbers(w)!; return `${x}c${y}c${[...x].map((b, i) => (b === y[i] ? "0" : "1")).join("")}` },
  },
]

export const b17Facts: Fact[] = [
  ...b17q3a.map(([k, re, want]): Fact => ({
    id: `b17-3a-${k}`,
    claim: `${re} = {${want.map((w) => w || "ε").join(", ")}}`,
    problem: () => {
      const got = allStrings(B, 5).filter(regexMatcher(re))
      return got.join() === want.join() ? null : `got {${got.map((w) => w || "ε").join(", ")}}`
    },
  })),
  { id: "b17-4b-dfa-size", claim: "the subset construction gives 5 DFA states", problem: () => (b17q4bSubset.dfa.states.length === 5 ? null : `${b17q4bSubset.dfa.states.length} states`) },
]

export const b17q1cSubset = subsetConstruction(b17q1c)

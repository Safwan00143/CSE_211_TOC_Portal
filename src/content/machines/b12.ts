/* Machines in the 12-batch (2013-2014) solutions, each tested against its language. */
import { cfgGenerates, faAccepts, grammar, regexMatcher, removeEpsilon, type TM } from "@/lib/automata"
import { cfgToPda } from "@/lib/pda-hmu"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const AB = ["a", "b"]

/* ───── Q1(a): CFG → PDA (HMU one-state construction) ───── */

export const b12expr = grammar("E -> E+T | T\nT -> T*F | T/F | F\nF -> (E) | a")
export const b12exprPda = cfgToPda(b12expr)

/* ───── Q2(a): TM for 0^N 1^N 0^N ───── */

type Move = TM["delta"][number]
const m010: Move[] = [
  ["q0", "B", "qa", "B", "R"], // N = 0
  ["q0", "0", "q1", "X", "R"], // cross off a 0 of the first block
  ["q1", "0", "q1", "0", "R"],
  ["q1", "Y", "q1", "Y", "R"],
  ["q1", "1", "q2", "Y", "R"], // cross off a 1
  ["q2", "1", "q2", "1", "R"],
  ["q2", "Z", "q2", "Z", "R"],
  ["q2", "0", "q3", "Z", "L"], // cross off a 0 of the last block
  ["q3", "0", "q3", "0", "L"],
  ["q3", "1", "q3", "1", "L"],
  ["q3", "Y", "q3", "Y", "L"],
  ["q3", "Z", "q3", "Z", "L"],
  ["q3", "X", "q0", "X", "R"],
  ["q0", "Y", "q4", "Y", "R"], // first block used up: only Y, Z may remain
  ["q4", "Y", "q4", "Y", "R"],
  ["q4", "Z", "q4", "Z", "R"],
  ["q4", "B", "qa", "B", "R"],
]
export const b12tm010 = tm(["q0", "q1", "q2", "q3", "q4", "qa"], "q0", ["qa"], m010, ["0", "1"], ["0", "1", "X", "Y", "Z", "B"])

/* ───── Q5(c): a^p b^q with p + q even ───── */

export const b12evenAB = dfa("ae", ["ae", "be"], {
  ae: { a: "ao", b: "bo" },
  ao: { a: "ae", b: "be" },
  be: { a: "d", b: "bo" },
  bo: { a: "d", b: "be" },
  d: { a: "d", b: "d" },
})

/* ───── Q6(c), Q7(a): the given NFAs ───── */

export const b12q6c = nfa(["q0", "q1", "q2"], "q0", ["q0"], [["q0", "a", "q1"], ["q1", "b", "q0"], ["q1", "a", "q2"], ["q2", "a", "q2"], ["q2", "b", "q0"]], AB)
export const b12q7a = nfa(
  ["q0", "q1", "q2", "q3", "q4"],
  "q0",
  ["q2"],
  [
    ["q0", "a", "q1"],
    ["q0", "ε", "q4"],
    ["q4", "b", "q1"],
    ["q4", "a", "q3"],
    ["q3", "b", "q1"],
    ["q3", "ε", "q2"],
    ["q1", "ε", "q2"],
    ["q2", "a", "q1"],
  ],
  AB,
)
export const b12q7aNoEps = removeEpsilon(b12q7a)

/* ───── Q7(b) ───── */

export const b12abc = grammar("S -> aS | B\nB -> bB | C\nC -> cC | ε")

export const b12Checks: Check[] = [
  { id: "b12-1a", machine: b12exprPda, alphabet: ["a", "+", "*", "/", "(", ")"], maxLen: 5, inL: (w) => cfgGenerates(b12expr, w), stackBound: (left) => left + 1 },
  { id: "b12-2a", machine: b12tm010, alphabet: ["0", "1"], maxLen: 10, inL: (w) => { const m = w.match(/^(0*)(1*)(0*)$/); return !!m && m[1].length === m[2].length && m[2].length === m[3].length } },
  { id: "b12-5c", machine: b12evenAB, dfa: true, alphabet: AB, maxLen: 10, inL: (w) => /^a*b*$/.test(w) && w.length % 2 === 0 },
  { id: "b12-6c", machine: b12q6c, alphabet: AB, maxLen: 10, inL: (w) => /^(a+b)*$/.test(w) },
  { id: "b12-6c-regex", regex: "(aa*b)*", alphabet: AB, maxLen: 10, inL: (w) => /^(a+b)*$/.test(w) },
  { id: "b12-7a", machine: b12q7aNoEps, alphabet: AB, maxLen: 9, inL: (w) => faAccepts(b12q7a, w) },
  { id: "b12-7b", grammar: b12abc, alphabet: ["a", "b", "c"], maxLen: 7, inL: (w) => /^a*b*c*$/.test(w) },
]

export const b12Facts: Fact[] = [
  {
    id: "b12-5b",
    claim: "(a ∪ b)* contains ab, which a* ∪ b* does not",
    problem: () => (regexMatcher("(a∪b)*")("ab") && !regexMatcher("a*∪b*")("ab") ? null : "ab does not separate them"),
  },
]

const blocks = (w: string, re: RegExp) => w.match(re)
export const b12Pumping: PumpClaim[] = [
  {
    id: "b12-2c-i",
    kind: "cfl",
    inL: (w) => { const m = blocks(w, /^(0*)(1*)(0*)(1*)$/); return !!m && new Set([m[1].length, m[2].length, m[3].length, m[4].length]).size === 1 },
    witness: (p) => "0".repeat(p) + "1".repeat(p) + "0".repeat(p) + "1".repeat(p),
    i: () => 0,
    ps: [1, 2, 3],
  },
  {
    id: "b12-2c-ii",
    kind: "cfl",
    inL: (w) => { const m = blocks(w, /^(0*)#(0*)#(0*)$/); return !!m && m[2].length === 2 * m[1].length && m[3].length === 3 * m[1].length },
    witness: (p) => "0".repeat(p) + "#" + "0".repeat(2 * p) + "#" + "0".repeat(3 * p),
    i: () => 0,
    ps: [1, 2, 3],
  },
  {
    id: "b12-6b",
    kind: "regular",
    inL: (w) => { let d = 0; for (const c of w) if ((d += c === "(" ? 1 : -1) < 0) return false; return d === 0 },
    witness: (p) => "(".repeat(p) + ")".repeat(p),
    i: () => 0,
  },
  {
    id: "b12-7c",
    kind: "cfl",
    inL: (w) => { const m = blocks(w, /^(a*)(b*)(c*)$/); return !!m && m[2].length === 2 * m[1].length && m[3].length === 3 * m[1].length },
    witness: (p) => "a".repeat(p) + "b".repeat(2 * p) + "c".repeat(3 * p),
    i: () => 0,
    ps: [1, 2, 3],
  },
]

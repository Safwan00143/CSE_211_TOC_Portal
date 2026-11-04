/* Machines in the 20-batch (2021-2022) solutions, each tested against its language. */
import { allStrings, cfgGenerates, faAccepts, grammar, regexMatcher, regexToNfa, subsetConstruction, type TM } from "@/lib/automata"
import { removeEpsilon, removeUnit, removeUseless, cnfFinish } from "@/lib/cnf"
import { survivingSplits, type PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}
const B = ["0", "1"]
const AB = ["a", "b"]

/* ───── Q1(b): begins with a, no aab ───── */

export const b20q1b = dfa("q0", ["qa", "qaa", "qb"], {
  q0: { a: "qa", b: "d" },
  qa: { a: "qaa", b: "qb" },
  qaa: { a: "qaa", b: "d" },
  qb: { a: "qa", b: "qb" },
  d: { a: "d", b: "d" },
})

/* ───── Q1(d): BLP's arguments ───── */

const isPal = (w: string) => w === [...w].reverse().join("")
const equal01 = (w: string) => count(w, "0") === count(w, "1")
/** (ii) BLP's string 0^(p/4) 1^(p/4) 0^(p/4) 1^(p/4): some legal split survives, so the argument fails. */
const blpEqual: PumpClaim = {
  id: "b20-1d-ii-blp",
  kind: "regular",
  inL: equal01,
  witness: (p) => ["0", "1", "0", "1"].map((c) => c.repeat(p / 4)).join(""),
  i: () => [0, 2],
}
/** (iii) 0^(2n) is regular. */
export const b20even0 = dfa("e", ["e"], { e: { 0: "o" }, o: { 0: "e" } } as Record<string, Record<string, string>>)

/* ───── Q2(b): (((00)*(11)) ∪ 01)* by basic principles ───── */

export const b20re = regexToNfa("(((00)*(11))∪01)*", B)

/* ───── Q2(c): L1 ∘ (L1 ∪ L2) ───── */

const L1 = ["a", "aa", "aaa"]
const L2 = ["a", "ab", "aab", "aabb"]
export const b20concat = [...new Set(L1.flatMap((x) => [...new Set([...L1, ...L2])].map((y) => x + y)))].sort((a, b) => a.length - b.length || a.localeCompare(b))

/* ───── Q2(d): a^i b^j c^k, i ≠ j + k ───── */

export const b20g2d = grammar("S -> X | Y\nX -> aXc | P\nP -> aPb | E\nE -> aE | a\nY -> aYc | Q | R\nQ -> bQ | C\nC -> cC | c\nR -> aRb | D\nD -> bD | b")

/* ───── Q3(b): at least two 0s, or exactly two 1s ───── */

export const b20q3b = nfa(
  ["s", "a0", "a1", "a2", "b0", "b1", "b2"],
  "s",
  ["a2", "b2"],
  [
    ["s", "ε", "a0"],
    ["s", "ε", "b0"],
    ["a0", "1", "a0"],
    ["a0", "0", "a1"],
    ["a1", "1", "a1"],
    ["a1", "0", "a2"],
    ["a2", "0,1", "a2"],
    ["b0", "0", "b0"],
    ["b0", "1", "b1"],
    ["b1", "0", "b1"],
    ["b1", "1", "b2"],
    ["b2", "0", "b2"],
  ],
  B,
)

/* ───── Q3(c): the given NFA (start q1, accept q2 assumed) and its DFA ───── */

export const b20q3cNfa = nfa(
  ["q1", "q2", "q3"],
  "q1",
  ["q2"],
  [
    ["q1", "a", "q3"],
    ["q1", "ε", "q2"],
    ["q2", "a", "q1"],
    ["q3", "a", "q2"],
    ["q3", "b", "q2"],
    ["q3", "b", "q3"],
  ],
  AB,
)
export const b20q3cSubset = subsetConstruction(b20q3cNfa)

/* ───── Q3(d): has 00 and 11 ───── */

export const b20q3dOptions = {
  A: "(0+1)*0011(0+1)*+(0+1)*1100(0+1)*",
  B: "(0+1)*(00(0+1)*11+11(0+1)*00)(0+1)*",
  C: "(0+1)*00(0+1)*+(0+1)*11(0+1)*",
  D: "00(0+1)*11+11(0+1)*00",
}
const has00and11 = (w: string) => w.includes("00") && w.includes("11")

/* ───── Q4(a): a non-regular language that still pumps (Sipser 1.54) ───── */

const sipserF = (w: string) => {
  const b = blocks(w, "abc")
  return !!b && (b[0] !== 1 || b[1] === b[2])
}
/** Every member of F with p ≤ |s| ≤ maxLen pumps for p = 2 (i = 0..4). */
function fPumps(p = 2, maxLen = 9) {
  const bad: string[] = []
  for (const s of allStrings(["a", "b", "c"], maxLen).filter((w) => w.length >= p && sipserF(w))) {
    let ok = false
    for (let x = 0; x < p && !ok; x++)
      for (let y = 1; x + y <= p && !ok; y++) {
        const [X, Y, Z] = [s.slice(0, x), s.slice(x, x + y), s.slice(x + y)]
        ok = [0, 1, 2, 3, 4].every((i) => sipserF(X + Y.repeat(i) + Z))
      }
    if (!ok) bad.push(s)
  }
  return bad
}

/* ───── Q4(c): A B Sloppy's grammars for a^i b^j c^k, i = j or j = k ───── */

export const b20sloppy1 = grammar("S -> aSb | bSc | aS | Sc | ε")
export const b20sloppy2 = grammar("S_0 -> S_1 | S_3\nS_1 -> aS_1bS_2c | ε\nS_2 -> S_2c | ε\nS_3 -> aS_4bS_3c | ε\nS_4 -> aS_4 | ε")
const ijOrJk = (w: string) => {
  const b = blocks(w, "abc")
  return !!b && (b[0] === b[1] || b[1] === b[2])
}
/** Strings up to maxLen that the grammar gets wrong: [generated but not in L, in L but not generated]. */
export function sloppyErrors(g: ReturnType<typeof grammar>, maxLen = 6) {
  const words = allStrings(["a", "b", "c"], maxLen)
  return [words.filter((w) => cfgGenerates(g, w) && !ijOrJk(w)), words.filter((w) => !cfgGenerates(g, w) && ijOrJk(w))]
}

/* ───── Q5: CNF conversion ───── */

export const b20g5 = grammar("S -> A1A | B\nA -> 0A | 1A | ε\nB -> 1")
export const b20g5Eps = removeEpsilon(b20g5)
export const b20g5Unit = removeUnit(b20g5Eps.grammar)
export const b20g5Useless = removeUseless(b20g5Unit.grammar)
export const b20g5Cnf = cnfFinish(b20g5Useless.grammar, (t) => (t === "0" ? "Z" : "O"))

/* ───── Q6 ───── */

export const b20g6 = grammar("S -> AB | C\nA -> aAb | ab\nB -> cB | c\nC -> aCc | aDc\nD -> bD | b")

/* ───── Q7: PDA for ARITH (Sipser form) ───── */

export const b20expr = grammar("E -> E+T | T\nT -> T*F | F\nF -> (E) | a")
export const b20pda = pda(
  ["qs", "qe", "qo", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qe", "$"],
    ["qe", "a", "ε", "qo", "ε"],
    ["qe", "(", "ε", "qe", "("],
    ["qo", "+", "ε", "qe", "ε"],
    ["qo", "*", "ε", "qe", "ε"],
    ["qo", ")", "(", "qo", "ε"],
    ["qo", "ε", "$", "qacc", "ε"],
  ],
  ["a", "+", "*", "(", ")"],
  ["(", "$"],
)

/* ───── Q9: two's complement of a signed-magnitude number ───── */

type Move = TM["delta"][number]
const flip = (b: string) => (b === "0" ? "1" : "0")
const tcMoves: Move[] = [
  ["q0", "0", "qf", "0", "R"], // positive: nothing to do
  ["q0", "1", "q1", "*1", "R"], // negative: mark the sign bit
  ["q1", "B", "q2", "B", "L"],
  ["q2", "0", "q2", "0", "L"], // copy 0s from the LSB
  ["q2", "1", "q3", "1", "L"], // copy the first 1
  ["q2", "*1", "qf", "1", "R"], // magnitude was all 0s
  ["q3", "*1", "qf", "1", "R"], // reached the sign bit: keep it 1
]
for (const b of ["0", "1"]) {
  tcMoves.push(["q1", b, "q1", b, "R"])
  tcMoves.push(["q3", b, "q3", flip(b), "L"]) // flip the remaining magnitude bits
}
export const b20tm = tm(["q0", "q1", "q2", "q3", "qf"], "q0", ["qf"], tcMoves, B, ["0", "1", "B", "*1"])
export function twosComplementSM(w: string) {
  if (w[0] === "0") return w
  const mag = w.slice(1)
  const k = mag.lastIndexOf("1")
  return k < 0 ? w : "1" + [...mag.slice(0, k)].map(flip).join("") + mag.slice(k)
}

export const b20Checks: Check[] = [
  { id: "b20-1b", machine: b20q1b, dfa: true, alphabet: AB, maxLen: 11, inL: (w) => w.startsWith("a") && !w.includes("aab") },
  { id: "b20-1d-iii", machine: b20even0, alphabet: ["0"], maxLen: 12, inL: (w) => w.length % 2 === 0 },
  { id: "b20-2b", machine: b20re, alphabet: B, maxLen: 10, inL: (w) => /^(((00)*11)|01)*$/.test(w) },
  { id: "b20-2d", grammar: b20g2d, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const b = blocks(w, "abc"); return !!b && b[0] !== b[1] + b[2] } },
  { id: "b20-3b", machine: b20q3b, alphabet: B, maxLen: 10, inL: (w) => count(w, "0") >= 2 || count(w, "1") === 2 },
  { id: "b20-3c", machine: b20q3cSubset.dfa, dfa: true, alphabet: AB, maxLen: 10, inL: (w) => faAccepts(b20q3cNfa, w) },
  { id: "b20-3d-B", regex: b20q3dOptions.B, alphabet: B, maxLen: 11, inL: has00and11 },
  { id: "b20-5-eps", grammar: b20g5Eps.grammar, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b20-5-unit", grammar: b20g5Unit.grammar, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b20-5-cnf", grammar: b20g5Cnf.grammar, cnf: true, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b20-5-original", grammar: b20g5, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  {
    id: "b20-6",
    grammar: b20g6,
    alphabet: ["a", "b", "c"],
    maxLen: 9,
    inL: (w) => { const b = blocks(w, "abc"); return !!b && b.every((x) => x >= 1) && (b[0] === b[1] || b[0] === b[2]) },
    ambiguousOn: ["abc"],
  },
  { id: "b20-7", machine: b20pda, alphabet: ["a", "+", "*", "(", ")"], maxLen: 7, inL: (w) => cfgGenerates(b20expr, w) },
  { id: "b20-9", machine: b20tm, alphabet: B, maxLen: 10, inL: (w) => w.length >= 1, output: twosComplementSM },
]

const same = (got: string[], want: string[]) => (got.join() === want.join() ? null : `got ${got.join(", ") || "none"}`)

export const b20Facts: Fact[] = [
  {
    id: "b20-1d-ii-blp-fails",
    claim: "BLP's string 0^(p/4)1^(p/4)0^(p/4)1^(p/4) has a split that pumps (p = 4, 8)",
    problem: () => ([4, 8].every((p) => survivingSplits(blpEqual, p).length > 0) ? null : "every split fails, so BLP's argument would be valid"),
  },
  {
    id: "b20-1d-i-fixed",
    claim: "00011000 is a palindrome, and for p = 8 the split 00 | 0110 | 00 pumps",
    problem: () => {
      const fixed: PumpClaim = { id: "b20-1d-i", kind: "regular", inL: isPal, witness: () => "00011000", i: () => [0, 2, 3] }
      return isPal("00011000") && survivingSplits(fixed, 8).includes("00 | 0110 | 00") ? null : `surviving splits: ${survivingSplits(fixed, 8).join("; ")}`
    },
  },
  { id: "b20-2c-ii", claim: "L1 ∘ (L1 ∪ L2) has exactly 12 strings", problem: () => (b20concat.length === 12 ? null : `it has ${b20concat.length}`) },
  {
    id: "b20-3d-others",
    claim: "A misses 001011; C accepts 00; D misses 10011",
    problem: () => {
      const m = (k: keyof typeof b20q3dOptions) => regexMatcher(b20q3dOptions[k])
      return !m("A")("001011") && m("C")("00") && !m("D")("10011") ? null : "a counterexample does not separate the option from L"
    },
  },
  { id: "b20-4a-sipser", claim: "Sipser's F pumps with p = 2 on all members up to length 9", problem: () => { const bad = fPumps(); return bad.length ? `no split for ${bad.slice(0, 3).join(", ")}` : null } },
  { id: "b20-4c-i-extra", claim: "grammar (i) generates abcb and aac, which are not in L", problem: () => (cfgGenerates(b20sloppy1, "abcb") && cfgGenerates(b20sloppy1, "aac") ? null : "it does not") },
  {
    id: "b20-4c-ii",
    claim: "grammar (ii) generates aabcbc (not in L) and misses c, bc, ab",
    problem: () => same([cfgGenerates(b20sloppy2, "aabcbc"), ...["c", "bc", "ab"].map((w) => cfgGenerates(b20sloppy2, w))].map(String), ["true", "false", "false", "false"]),
  },
]

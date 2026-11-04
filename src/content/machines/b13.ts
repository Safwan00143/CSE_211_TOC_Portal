/* Machines in the 13-batch (2014-2015) solutions, each tested against its language. */
import { allStrings, grammar, parseCount, subsetConstruction, type TM } from "@/lib/automata"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]
const AB = ["a", "b"]

/* ───── Q1(a): sum mod 3 over {0,1,2,3,R} ───── */

const S4 = ["0", "1", "2", "3", "R"]
export const b13sum = dfa("r0", ["r0"], Object.fromEntries([0, 1, 2].map((r) => [`r${r}`, { 0: `r${r}`, 1: `r${(r + 1) % 3}`, 2: `r${(r + 2) % 3}`, 3: `r${r}`, R: "r0" }])))
const sum3 = (w: string) => {
  let s = 0
  for (const c of w) s = c === "R" ? 0 : s + Number(c)
  return s
}
/** Q1(b): the "actual sums" machine, cut off at sum 4 to draw its start. */
export const b13actual = nfa(
  ["s0", "s1", "s2", "s3", "s4"],
  "s0",
  ["s0", "s3"],
  [
    ["s0", "0", "s0"],
    ["s0", "1", "s1"],
    ["s0", "2", "s2"],
    ["s1", "0", "s1"],
    ["s1", "1", "s2"],
    ["s1", "2", "s3"],
    ["s2", "0", "s2"],
    ["s2", "1", "s3"],
    ["s2", "2", "s4"],
    ["s1", "R", "s0"],
    ["s2", "R", "s0"],
    ["s3", "R", "s0"],
    ["s4", "R", "s0"],
    ["s0", "R", "s0"],
  ],
  ["0", "1", "2", "R"],
)

/* ───── Q2(b): binary numbers divisible by 4 ───── */

export const b13div4 = dfa("s", ["r0"], {
  s: { 0: "r0", 1: "r1" },
  r0: { 0: "r0", 1: "r1" },
  r1: { 0: "r2", 1: "r3" },
  r2: { 0: "r0", 1: "r1" },
  r3: { 0: "r2", 1: "r3" },
})

/* ───── Q3(a): a nonzero even number of a's at the end ───── */

export const b13evenA = nfa(
  ["s0", "s", "m", "o", "f"],
  "s0",
  ["f"],
  [
    ["s0", "ε", "s"],
    ["s0", "ε", "m"],
    ["s", "a,b", "s"],
    ["s", "b", "m"],
    ["m", "a", "o"],
    ["o", "a", "f"],
    ["f", "a", "o"],
  ],
  AB,
)
const tailA = (w: string) => w.length - w.replace(/a+$/, "").length

/* ───── Q3(b) ───── */

const DIG = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
export const b13re3b = {
  i: "0+5+(1+2+3+4+5+6+7+8+9)(0+1+2+3+4+5+6+7+8+9)*(0+5)",
  ii: "1*01*(01*01*)*+0*10*(10*10*)*",
  iii: "0*(11*000*)*(ε+11*0*)",
}

/* ───── Q4(a): an even number of occurrences of 01 ───── */

/** From 1*(0+1+0+1+)*0*: s (leading 1s), a1/b1/a2/b2 (blocks of 0s and 1s), z (trailing 0s). */
export const b13even01 = nfa(
  ["s", "a1", "b1", "a2", "b2", "z"],
  "s",
  ["s", "b2", "z"],
  [
    ["s", "1", "s"],
    ["s", "0", "a1"],
    ["s", "0", "z"],
    ["a1", "0", "a1"],
    ["a1", "1", "b1"],
    ["b1", "1", "b1"],
    ["b1", "0", "a2"],
    ["a2", "0", "a2"],
    ["a2", "1", "b2"],
    ["b2", "1", "b2"],
    ["b2", "0", "a1"],
    ["b2", "0", "z"],
    ["z", "0", "z"],
  ],
  B,
)
export const b13even01Subset = subsetConstruction(b13even01)
const count01 = (w: string) => [...w].filter((_, i) => w.startsWith("01", i)).length

/* ───── Section B grammars and machines ───── */

export const b13g5a = grammar("S -> abScB | ε\nB -> bB | b")
const in5a = (w: string) => {
  const m = w.match(/^((?:ab)*)((?:cb+)*)$/)
  return !!m && m[1].length / 2 === count(m[2], "c")
}
export const b13same = grammar("S -> 0A0 | 1A1 | 0 | 1\nA -> 0A | 1A | ε")
export const b13g6a = grammar("S -> 0A | 1B\nA -> 0AA | 1S | 1\nB -> 1BB | 0S | 0")
/** The shortest strings with two or more parse trees in Q6(a)'s grammar. */
export const b13ambiguous = allStrings(B, 6).filter((w) => parseCount(b13g6a, w) > 1)

export const b13wcwr = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "$"],
    ["qp", "a", "ε", "qp", "a"],
    ["qp", "b", "ε", "qp", "b"],
    ["qp", "c", "ε", "qm", "ε"],
    ["qm", "a", "a", "qm", "ε"],
    ["qm", "b", "b", "qm", "ε"],
    ["qm", "ε", "$", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["a", "b", "$"],
)

/* ───── Q8(b): TM deciding w−w (Sipser's w#w machine) ───── */

type Move = TM["delta"][number]
const wMoves: Move[] = [
  ["q1", "x", "q1", "x", "R"],
  ["q1", "-", "q8", "-", "R"], // first half all crossed off: check the second half is too
  ["q8", "x", "q8", "x", "R"],
  ["q8", "B", "qa", "B", "R"],
]
for (const [c, carry, match] of [["a", "q2", "q4"], ["b", "q3", "q5"]] as const) {
  wMoves.push(["q1", c, carry, "x", "R"]) // cross off c and remember it
  for (const y of AB) wMoves.push([carry, y, carry, y, "R"])
  wMoves.push([carry, "-", match, "-", "R"])
  wMoves.push([match, "x", match, "x", "R"])
  wMoves.push([match, c, "q6", "x", "L"]) // matching symbol in the second half
}
for (const y of ["a", "b", "x"]) wMoves.push(["q6", y, "q6", y, "L"])
wMoves.push(["q6", "-", "q7", "-", "L"])
for (const y of AB) wMoves.push(["q7", y, "q7", y, "L"])
wMoves.push(["q7", "x", "q1", "x", "R"])
export const b13tmWw = tm(["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "qa"], "q1", ["qa"], wMoves, ["a", "b", "-"], ["a", "b", "-", "x", "B"])

export const b13Checks: Check[] = [
  { id: "b13-1a", machine: b13sum, dfa: true, alphabet: S4, maxLen: 5, inL: (w) => sum3(w) % 3 === 0 },
  { id: "b13-2b", machine: b13div4, dfa: true, alphabet: B, maxLen: 11, inL: (w) => w.length > 0 && parseInt(w, 2) % 4 === 0 },
  { id: "b13-3a", machine: b13evenA, alphabet: AB, maxLen: 10, inL: (w) => tailA(w) >= 2 && tailA(w) % 2 === 0, extra: ["abaababaaaa", "abbaaa", "abaabbbb"] },
  { id: "b13-3b-i", regex: b13re3b.i, alphabet: DIG, maxLen: 3, inL: (w) => /^(0|[1-9][0-9]*)$/.test(w) && Number(w) % 5 === 0 },
  { id: "b13-3b-ii", regex: b13re3b.ii, alphabet: B, maxLen: 10, inL: (w) => count(w, "0") % 2 === 1 || count(w, "1") % 2 === 1 },
  { id: "b13-3b-iii", regex: b13re3b.iii, alphabet: B, maxLen: 11, inL: (w) => !w.includes("101") },
  { id: "b13-4a-nfa", machine: b13even01, alphabet: B, maxLen: 11, inL: (w) => count01(w) % 2 === 0 },
  { id: "b13-4a-dfa", machine: b13even01Subset.dfa, dfa: true, alphabet: B, maxLen: 11, inL: (w) => count01(w) % 2 === 0 },
  { id: "b13-5a", grammar: b13g5a, alphabet: ["a", "b", "c"], maxLen: 10, inL: in5a },
  { id: "b13-5b-i", grammar: b13same, alphabet: B, maxLen: 9, inL: (w) => w.length > 0 && w[0] === w.at(-1) },
  { id: "b13-6a", grammar: b13g6a, alphabet: B, maxLen: 8, inL: (w) => w.length > 0 && count(w, "0") === count(w, "1"), ambiguousOn: ["001011", "110100"] },
  { id: "b13-6c", machine: b13wcwr, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => { const m = w.match(/^([ab]*)c([ab]*)$/); return !!m && m[2] === [...m[1]].reverse().join("") } },
  { id: "b13-8b", machine: b13tmWw, alphabet: ["a", "b", "-"], maxLen: 9, inL: (w) => { const m = w.match(/^([ab]*)-([ab]*)$/); return !!m && m[1] === m[2] } },
]

export const b13Facts: Fact[] = [
  { id: "b13-6a-shortest", claim: "the shortest ambiguous strings are 001011, 001101, 110010, 110100", problem: () => (b13ambiguous.join() === "001011,001101,110010,110100" ? null : `ambiguous: ${b13ambiguous.slice(0, 5).join(", ")}`) },
  { id: "b13-4a-dfa-size", claim: "the reachable DFA has 5 states", problem: () => (b13even01Subset.dfa.states.length === 5 ? null : `${b13even01Subset.dfa.states.length} states`) },
]

export const b13Pumping: PumpClaim[] = [
  {
    id: "b13-2a",
    kind: "regular",
    inL: (w) => /^1*$/.test(w) && Number.isInteger(Math.sqrt(w.length)),
    witness: (p) => "1".repeat(p * p),
    i: () => 2,
  },
  {
    id: "b13-6b",
    kind: "cfl",
    inL: (w) => { const m = w.match(/^(a*)(b*)(c*)$/); return !!m && m[3].length === m[1].length * m[2].length },
    witness: (p) => "a".repeat(p) + "b".repeat(p) + "c".repeat(p * p),
    i: () => 2,
    ps: [1, 2, 3],
  },
]

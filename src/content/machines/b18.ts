/* Machines in the 18-batch (2019-2020) solutions, each tested against its language. */
import { allStrings, faAccepts, regexToNfa, subsetConstruction, type FA } from "@/lib/automata"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const AB = ["a", "b"]

/* ───── Q1(c): sum mod 5 is 1 or 2, R resets ───── */

const S = ["0", "1", "2", "R"]
const table: Record<string, Record<string, string>> = {}
for (let r = 0; r < 5; r++) table[`r${r}`] = { 0: `r${r}`, 1: `r${(r + 1) % 5}`, 2: `r${(r + 2) % 5}`, R: "r0" }
export const b18sum5 = dfa("r0", ["r1", "r2"], table)
const sumMod5 = (w: string) => {
  let s = 0
  for (const c of w) s = c === "R" ? 0 : (s + Number(c)) % 5
  return s
}

/* ───── Q2(c): base-3 numbers not divisible by 4 ───── */

const t3: Record<string, Record<string, string>> = { s: { 0: "r0", 1: "r1", 2: "r2" } }
for (let r = 0; r < 4; r++) t3[`r${r}`] = Object.fromEntries([0, 1, 2].map((d) => [String(d), `r${(3 * r + d) % 4}`]))
export const b18base3 = dfa("s", ["r1", "r2", "r3"], t3)
const base3 = (w: string) => [...w].reduce((v, c) => v * 3 + Number(c), 0)

/* ───── Q3(a): ((a*)a)* by basic principles ───── */

export const b18re3a = regexToNfa("((a*)a)*", ["a"])

/* ───── Q3(b): {a^n b^n | n ≤ 3} ───── */

export const b18anbn3 = nfa(
  ["p0", "p1", "p2", "p3", "r2", "r1", "f"],
  "p0",
  ["p0", "f"],
  [
    ["p0", "a", "p1"],
    ["p1", "a", "p2"],
    ["p2", "a", "p3"],
    ["p1", "b", "f"],
    ["p2", "b", "r1"],
    ["p3", "b", "r2"],
    ["r2", "b", "r1"],
    ["r1", "b", "f"],
  ],
  AB,
)
const L3b = new Set(["", "ab", "aabb", "aaabbb"])

/** Largest fooling set for L3b: pairs (x, y) with xy ∈ L, and for any two pairs x_i y_j ∉ L or x_j y_i ∉ L. */
function largestFoolingSet() {
  const pairs: [string, string][] = []
  for (const w of L3b) for (let k = 0; k <= w.length; k++) pairs.push([w.slice(0, k), w.slice(k)])
  const ok = (i: number, j: number) => !L3b.has(pairs[i][0] + pairs[j][1]) || !L3b.has(pairs[j][0] + pairs[i][1])
  let best: number[] = []
  const grow = (chosen: number[], from: number) => {
    if (chosen.length > best.length) best = chosen
    for (let i = from; i < pairs.length; i++) if (chosen.every((j) => ok(i, j))) grow([...chosen, i], i + 1)
  }
  grow([], 0)
  return best.map((i) => pairs[i])
}
export const b18fooling = largestFoolingSet()

/* ───── Q4(a): a 5-state NFA whose subset construction reaches all 32 subsets ───── */

export const b18blowup: FA = {
  kind: "fa",
  states: ["0", "1", "2", "3", "4"],
  alphabet: ["a", "b", "c"],
  start: "0",
  accept: ["0"],
  delta: [
    // a: rotate every state one step round the cycle
    ...["0", "1", "2", "3", "4"].map((q) => [q, "a", String((Number(q) + 1) % 5)] as [string, string, string]),
    // b: keep every state, and 0 also adds 1
    ...["0", "1", "2", "3", "4"].map((q) => [q, "b", q] as [string, string, string]),
    ["0", "b", "1"],
    // c: keep every state except 0, which is dropped
    ...["1", "2", "3", "4"].map((q) => [q, "c", q] as [string, string, string]),
  ],
}

/* ───── Q4(b) ───── */

export const b18re4b = {
  i: "b*(ab*ab*ab*)*",
  ii: "b*(a+ε)b*(a+ε)b*(a+ε)b*",
  iii: "(b+ab+aab)*aaa(b+ba+baa)*",
}
const aaaCount = (w: string) => [...w].filter((_, i) => w.startsWith("aaa", i)).length

/* ───── Q2(b) ───── */

export const b18re2b = { i: "∅*∪a*∪b*∪(a∪b)*", ii: "((a*b*)*(b*a*)*)*", iii: "(a*b)*∪(b*a)*" }

export const b18Checks: Check[] = [
  { id: "b18-1c", machine: b18sum5, dfa: true, alphabet: S, maxLen: 6, inL: (w) => [1, 2].includes(sumMod5(w)) },
  { id: "b18-2b-i", regex: b18re2b.i, alphabet: AB, maxLen: 8, inL: () => true },
  { id: "b18-2b-ii", regex: b18re2b.ii, alphabet: AB, maxLen: 8, inL: () => true },
  { id: "b18-2b-iii", regex: b18re2b.iii, alphabet: AB, maxLen: 8, inL: () => true },
  { id: "b18-2c", machine: b18base3, dfa: true, alphabet: ["0", "1", "2"], maxLen: 8, inL: (w) => w.length > 0 && base3(w) % 4 !== 0 },
  { id: "b18-3a", machine: b18re3a, alphabet: ["a"], maxLen: 10, inL: () => true },
  { id: "b18-3b", machine: b18anbn3, alphabet: AB, maxLen: 9, inL: (w) => L3b.has(w) },
  { id: "b18-4b-i", regex: b18re4b.i, alphabet: AB, maxLen: 10, inL: (w) => count(w, "a") % 3 === 0 },
  { id: "b18-4b-ii", regex: b18re4b.ii, alphabet: AB, maxLen: 10, inL: (w) => count(w, "a") <= 3 },
  { id: "b18-4b-iii", regex: b18re4b.iii, alphabet: AB, maxLen: 11, inL: (w) => aaaCount(w) === 1 },
]

export const b18Facts: Fact[] = [
  {
    id: "b18-3b-minimal",
    claim: "a fooling set of size 7 exists, so every NFA for {a^n b^n | n ≤ 3} needs 7 states",
    problem: () => (b18fooling.length === 7 ? null : `largest fooling set has ${b18fooling.length} pairs`),
  },
  {
    id: "b18-4a-blowup",
    claim: "the 5-state NFA's subset construction reaches all 32 subsets",
    problem: () => { const n = subsetConstruction(b18blowup).dfa.states.length; return n === 32 ? null : `only ${n} subsets reachable` },
  },
  {
    id: "b18-3a-all",
    claim: "((a*)a)* is a* (accepts ε and every a^n)",
    problem: () => (allStrings(["a"], 8).every((w) => faAccepts(b18re3a, w)) ? null : "some a^n rejected"),
  },
]

const blk = (w: string) => w.match(/^(a*)(b*)(a*)$/)
export const b18Pumping: PumpClaim[] = [
  {
    id: "b18-4c",
    kind: "regular",
    inL: (w) => { const m = blk(w); if (!m) return false; const [x, y, z] = [m[1].length, m[2].length, m[3].length]; return x === 2 * z && y === 3 * z },
    witness: (p) => "a".repeat(2 * p) + "b".repeat(3 * p) + "a".repeat(p),
    i: () => 0,
    ps: [1, 2, 3, 4],
  },
]

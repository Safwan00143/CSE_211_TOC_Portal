/* Machines in the 8-batch (2009-2010) solutions, each tested against its language. */
import { cfgGenerates, faAccepts, grammar, pdaAccepts, regexMatcher, subsetConstruction, type TM } from "@/lib/automata"
import { cfgToPda, finalToEmpty, pdaToCfg } from "@/lib/pda-hmu"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { hmuPda } from "./notes-pda-hmu"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const AB = ["a", "b"]
const B01 = ["0", "1"]
const isPal = (w: string) => w === [...w].reverse().join("")

/* ───── Q2: no three consecutive copies of the first symbol ───── */

export const b08q2 = dfa("s", ["s", "a0", "a1", "a2", "b0", "b1", "b2"], {
  s: { a: "a1", b: "b1" },
  a0: { a: "a1", b: "a0" },
  a1: { a: "a2", b: "a0" },
  a2: { a: "d", b: "a0" },
  b0: { a: "b0", b: "b1" },
  b1: { a: "b0", b: "b2" },
  b2: { a: "b0", b: "d" },
  d: { a: "d", b: "d" },
})

/* ───── Q3: the given ε-NFA ───── */

export const b08q3 = nfa(
  ["q1", "q2", "q3", "q4", "q5"],
  "q1",
  ["q5"],
  [
    ["q1", "ε", "q2"],
    ["q2", "a", "q3"],
    ["q3", "a", "q2"],
    ["q3", "b", "q3"],
    ["q3", "ε", "q5"],
    ["q2", "b", "q4"],
    ["q4", "b", "q2"],
    ["q4", "a", "q3"],
    ["q4", "ε", "q5"],
  ],
  AB,
)
export const b08q3Subset = subsetConstruction(b08q3)

/* ───── Q4: membership in L1 ∘ L2 ───── */

export const b08L1 = "1(1∪0)*000"
export const b08L2 = "(1(01)*0)*"
export const b08q4 = ["1000", "1000101010", "10000111000100000"].map((w) => [w, regexMatcher(`(${b08L1})(${b08L2})`)(w)] as const)

/* ───── Q6, Q7, Q9 ───── */

export const b08g6 = grammar("P -> [B,P] | B\nB -> O | (P)\nO -> x | y | z")
export const b08pal = grammar("P -> 0P0 | 1P1 | 0 | 1 | ε")
export const b08palEven = grammar("P -> 0P0 | 1P1 | aPa | ε")
export const b08eq = grammar("S -> aSbS | bSaS | ε")

/* ───── Q10(b): the given PDA, and its empty-stack version ───── */

export const b08pda10 = hmuPda(
  ["q", "p"],
  "q",
  ["p"],
  [
    ["q", "0", "Z", "q", ["X", "Z"]],
    ["q", "0", "X", "q", ["X", "X"]],
    ["q", "1", "X", "q", ["X"]],
    ["q", "ε", "X", "p", []],
    ["p", "ε", "X", "p", []],
    ["p", "1", "X", "p", ["X", "X"]],
    ["p", "1", "Z", "p", []],
  ],
  B01,
  ["X", "Z"],
  "final",
  "Z",
)
export const b08pda10Empty = finalToEmpty(b08pda10, { p0: "p_0", p: "r", X0: "X_0" })

/* ───── Q11 ───── */

export const b08g11 = grammar("S -> AS | A\nA -> 0A | 1B | 1\nB -> 0B | 0")
export const b08pda11 = cfgToPda(b08g11)
export const b08pda11b = hmuPda(
  ["q", "p"],
  "q",
  [],
  [
    ["q", "1", "Z", "q", ["X", "Z"]],
    ["q", "0", "X", "p", ["X"]],
    ["p", "1", "X", "p", []],
  ],
  B01,
  ["X", "Z"],
  "empty",
  "Z",
)
export const b08cfg11b = pdaToCfg(b08pda11b)

/* ───── Q12(b): a^n c^n b^n d^n ───── */

type Move = TM["delta"][number]
const blocks4: Move[] = [["q0", "B", "qa", "B", "R"]]
const syms = ["a", "c", "b", "d"]
const marks = ["W", "X", "Y", "Z"]
// q0: cross off an a; q1..q3 find and cross off the first unmarked c, b, d in turn; q4 returns.
for (let k = 0; k < 4; k++) {
  const here = `q${k}`
  const next = k < 3 ? `q${k + 1}` : "q4"
  if (k > 0) {
    for (const s of [...syms.slice(k - 1, k), marks[k]]) blocks4.push([here, s, here, s, "R"]) // skip own block's leftovers and marks
    blocks4.push([here, syms[k], next, marks[k], k < 3 ? "R" : "L"])
  } else blocks4.push([here, "a", "q1", "W", "R"])
}
for (const s of [...syms, ...marks.slice(1)]) blocks4.push(["q4", s, "q4", s, "L"])
blocks4.push(["q4", "W", "q0", "W", "R"])
blocks4.push(["q0", "X", "q5", "X", "R"]) // no a's left: only marks may remain
for (const s of marks.slice(1)) blocks4.push(["q5", s, "q5", s, "R"])
blocks4.push(["q5", "B", "qa", "B", "R"])
export const b08tmAcbd = tm(["q0", "q1", "q2", "q3", "q4", "q5", "qa"], "q0", ["qa"], blocks4, ["a", "b", "c", "d"], ["a", "b", "c", "d", "W", "X", "Y", "Z", "B"])

export const b08Checks: Check[] = [
  {
    id: "b08-2",
    machine: b08q2,
    dfa: true,
    alphabet: AB,
    maxLen: 10,
    inL: (w) => !w || !w.includes(w[0].repeat(3)),
    extra: ["abaab", "baaabba", "abaaab", "bbbaa"],
  },
  { id: "b08-3", machine: b08q3Subset.dfa, dfa: true, alphabet: AB, maxLen: 9, inL: (w) => faAccepts(b08q3, w) },
  { id: "b08-6", grammar: b08g6, alphabet: ["[", "]", ",", "(", ")", "x", "y", "z"], maxLen: 7, inL: (w) => cfgGenerates(b08g6, w) },
  { id: "b08-7", grammar: b08pal, alphabet: B01, maxLen: 9, inL: isPal },
  { id: "b08-7-even", grammar: b08palEven, alphabet: ["0", "1", "a"], maxLen: 8, inL: (w) => w.length % 2 === 0 && isPal(w) },
  { id: "b08-9", grammar: b08eq, alphabet: AB, maxLen: 10, inL: (w) => count(w, "a") === count(w, "b") },
  { id: "b08-10b-empty", machine: b08pda10Empty, alphabet: B01, maxLen: 9, inL: (w) => pdaAccepts(b08pda10, w) },
  { id: "b08-11a", machine: b08pda11, alphabet: B01, maxLen: 7, inL: (w) => cfgGenerates(b08g11, w) },
  { id: "b08-11b", grammar: b08cfg11b.full, alphabet: B01, maxLen: 9, inL: (w) => pdaAccepts(b08pda11b, w) },
  { id: "b08-11b-empty", machine: b08pda11b, alphabet: B01, maxLen: 9, inL: () => false },
  {
    id: "b08-12b",
    machine: b08tmAcbd,
    alphabet: ["a", "b", "c", "d"],
    maxLen: 8,
    inL: (w) => { const m = w.match(/^(a*)(c*)(b*)(d*)$/); return !!m && new Set([m[1].length, m[2].length, m[3].length, m[4].length]).size === 1 },
  },
]

export const b08Facts: Fact[] = [
  {
    id: "b08-4",
    claim: "all three strings are in L1 L2",
    problem: () => (b08q4.map(([, v]) => v).join() === "true,true,true" ? null : b08q4.map(([w, v]) => `${w}: ${v}`).join("; ")),
  },
]

/* Machines in the 10-batch (2011-2012) solutions, each tested against its language. */
import { cfgGenerates, faAccepts, grammar, subsetConstruction, type TM } from "@/lib/automata"
import { cfgToPda } from "@/lib/pda-hmu"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { tm } from "./notes-tm"
import type { Check } from "./types"

const AB = ["a", "b"]
const B01 = ["0", "1"]

/* ───── Q1(a): x − y in modified unary, input 1^(x+1) 0 1^(y+1) ───── */

type Move = TM["delta"][number]
const sub: Move[] = [
  ["q0", "1", "q0", "1", "R"],
  ["q0", "0", "q0", "0", "R"],
  ["q0", "B", "q1", "B", "L"],
  ["q1", "1", "q2", "B", "L"], // erase the last 1 of y
  ["q2", "0", "qa", "B", "R"], // that was y's final 1: erase the separator, done
  ["q2", "1", "q3", "1", "L"], // y still has 1s left: also erase a 1 of x
  ["q3", "1", "q3", "1", "L"],
  ["q3", "0", "q3", "0", "L"],
  ["q3", "B", "q4", "B", "R"],
  ["q4", "1", "q0", "B", "R"], // erase the leftmost 1 of x
]
export const b10tmSub = tm(["q0", "q1", "q2", "q3", "q4", "qa"], "q0", ["qa"], sub, B01, ["0", "1", "B"])
const subIn = (w: string) => {
  const m = w.match(/^(1+)0(1+)$/)
  return m && m[1].length >= m[2].length ? [m[1].length - 1, m[2].length - 1] : null
}

/* ───── Q4(b): CFG → PDA ───── */

export const b10g4b = grammar("S -> aTXb\nT -> XTS | ε\nX -> a | b")
export const b10pda4b = cfgToPda(b10g4b)

/* ───── Q5(c): length at most 5 ───── */

export const b10len5 = dfa("l0", ["l0", "l1", "l2", "l3", "l4", "l5"], {
  ...Object.fromEntries([0, 1, 2, 3, 4].map((k) => [`l${k}`, { 0: `l${k + 1}`, 1: `l${k + 1}` }])),
  l5: { 0: "d", 1: "d" },
  d: { 0: "d", 1: "d" },
})

/* ───── Q7(a), (b): (01 ∪ 001 ∪ 010)* ───── */

export const b10q7 = nfa(
  ["q0", "x", "y", "z"],
  "q0",
  ["q0"],
  [
    ["q0", "0", "x"],
    ["x", "1", "q0"], // 01
    ["x", "0", "y"],
    ["y", "1", "q0"], // 001
    ["x", "1", "z"],
    ["z", "0", "q0"], // 010
  ],
  B01,
)
export const b10q7Subset = subsetConstruction(b10q7)

/* ───── Q7(c): the given FA ───── */

export const b10q7c = dfa("1", ["1", "3"], { 1: { a: "2", b: "2" }, 2: { a: "2", b: "3" }, 3: { a: "1", b: "2" } })
export const b10q7cRegex = "((a+b)a*b(ba*b)*a)*(ε+(a+b)a*b(ba*b)*)"

/* ───── Q8 ───── */

export const b10g8i = grammar("S -> A | B\nA -> 0A1 | ε\nB -> 1B0 | ε")
/** As printed: T → E*F (probably meant T → T*F). */
export const b10g8c = grammar("E -> E+T | T\nT -> E*F | F\nF -> (E) | a | b")

export const b10Checks: Check[] = [
  {
    id: "b10-1a",
    machine: b10tmSub,
    alphabet: B01,
    maxLen: 10,
    inL: (w) => subIn(w) !== null,
    output: (w) => { const [x, y] = subIn(w)!; return "1".repeat(x - y + 1) },
  },
  { id: "b10-4b", machine: b10pda4b, alphabet: AB, maxLen: 7, inL: (w) => cfgGenerates(b10g4b, w), stackBound: (left) => left + 1 },
  { id: "b10-5c", machine: b10len5, dfa: true, alphabet: B01, maxLen: 8, inL: (w) => w.length <= 5 },
  { id: "b10-7a", machine: b10q7, alphabet: B01, maxLen: 10, inL: (w) => /^(01|001|010)*$/.test(w) },
  { id: "b10-7b", machine: b10q7Subset.dfa, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => /^(01|001|010)*$/.test(w) },
  { id: "b10-7c", regex: b10q7cRegex, alphabet: AB, maxLen: 10, inL: (w) => faAccepts(b10q7c, w) },
  { id: "b10-8b-i", grammar: b10g8i, alphabet: B01, maxLen: 10, inL: (w) => /^(0*1*)$/.test(w) && countEq(w, "0", "1") || (/^1*0*$/.test(w) && countEq(w, "1", "0")) },
]
function countEq(w: string, a: string, b: string) {
  return [...w].filter((c) => c === a).length === [...w].filter((c) => c === b).length
}

export const b10Pumping: PumpClaim[] = [
  {
    id: "b10-6b-www",
    kind: "regular",
    inL: (w) => w.length % 3 === 0 && w.slice(0, w.length / 3).repeat(3) === w,
    witness: (p) => ("0".repeat(p) + "1").repeat(3),
    i: () => 0,
  },
]

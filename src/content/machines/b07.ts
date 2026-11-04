/* Machines in the 7-batch (2008-2009) solutions, each tested against its language. */
import { cfgGenerates, grammar, parseCount, regexToNfa, type TM } from "@/lib/automata"
import { removeEpsilon, removeUnit, removeUseless } from "@/lib/cnf"
import type { PumpClaim } from "@/lib/pumping"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const B01 = ["0", "1"]
const ABC = ["a", "b", "c"]

/* ───── Q2: simplifying S -> ASB | ε, A -> aAS | a, B -> SbS | A | bb ───── */

export const b07g2 = grammar("S -> ASB | ε\nA -> aAS | a\nB -> SbS | A | bb")
export const b07g2Eps = removeEpsilon(b07g2, false)
export const b07g2Unit = removeUnit(b07g2Eps.grammar)
export const b07g2Useless = removeUseless(b07g2Unit.grammar)

/* ───── Q3(b): bitwise XOR in place: w1 # w2 → w1 ⊕ w2 ───── */

type Move = TM["delta"][number]
const xor: Move[] = []
for (const a of ["0", "1"]) {
  xor.push(["q0", a, `c${a}`, "B", "R"]) // erase the next bit of w1 and carry it
  for (const x of ["0", "1"]) xor.push([`c${a}`, x, `c${a}`, x, "R"])
  xor.push([`c${a}`, "#", `d${a}`, "#", "R"])
  for (const x of ["0", "1"]) {
    xor.push([`d${a}`, `*${x}`, `d${a}`, `*${x}`, "R"]) // skip finished bits of w2
    xor.push([`d${a}`, x, "back", `*${a === x ? "0" : "1"}`, "L"]) // replace with the XOR, marked
    xor.push(["back", x, "back", x, "L"])
    xor.push(["back", `*${x}`, "back", `*${x}`, "L"])
    xor.push(["u", `*${x}`, "u", x, "R"]) // unmark the result
  }
}
xor.push(["back", "#", "back", "#", "L"], ["back", "B", "q0", "B", "R"])
xor.push(["q0", "#", "u", "B", "R"]) // w1 used up: erase # and unmark
xor.push(["u", "B", "qf", "B", "L"])
export const b07tmXor = tm(["q0", "c0", "c1", "d0", "d1", "back", "u", "qf"], "q0", ["qf"], xor, ["0", "1", "#"], ["0", "1", "#", "*0", "*1", "B"])
const xorIn = (w: string) => {
  const m = w.match(/^([01]+)#([01]+)$/)
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

/* ───── Q7 ───── */

export const b07re7b = {
  i: "(a+b+c)*a(a+b+c)*c(a+b+c)*+(a+b+c)*c(a+b+c)*a(a+b+c)*",
  ii: "(1+01)*(ε+0)+(0+10)*(ε+1)",
}
export const b07nfa7c = regexToNfa("(0∪1)*1(0∪1)", B01)

/* ───── Q8(c): S -> aS | aSbS | ε ───── */

export const b07g8c = grammar("S -> aS | aSbS | ε")

export const b07Checks: Check[] = [
  { id: "b07-2-eps", grammar: b07g2Eps.grammar, alphabet: ["a", "b"], maxLen: 7, inL: (w) => w.length > 0 && cfgGenerates(b07g2, w) },
  { id: "b07-2-unit", grammar: b07g2Unit.grammar, alphabet: ["a", "b"], maxLen: 7, inL: (w) => w.length > 0 && cfgGenerates(b07g2, w) },
  { id: "b07-2-useless", grammar: b07g2Useless.grammar, alphabet: ["a", "b"], maxLen: 7, inL: (w) => w.length > 0 && cfgGenerates(b07g2, w) },
  {
    id: "b07-3b",
    machine: b07tmXor,
    alphabet: ["0", "1", "#"],
    maxLen: 9,
    inL: (w) => xorIn(w) !== null,
    output: (w) => { const [x, y] = xorIn(w)!; return [...x].map((b, i) => (b === y[i] ? "0" : "1")).join("") },
  },
  { id: "b07-7b-i", regex: b07re7b.i, alphabet: ABC, maxLen: 6, inL: (w) => w.includes("a") && w.includes("c") },
  { id: "b07-7b-ii", regex: b07re7b.ii, alphabet: B01, maxLen: 10, inL: (w) => !w.includes("00") || !w.includes("11") },
  { id: "b07-7c", machine: b07nfa7c, alphabet: B01, maxLen: 9, inL: (w) => w.length >= 2 && w.at(-2) === "1" },
  { id: "b07-8c", grammar: b07g8c, alphabet: ["a", "b"], maxLen: 9, inL: (w) => { let d = 0; for (const c of w) if ((d += c === "a" ? 1 : -1) < 0) return false; return true }, ambiguousOn: ["aab"] },
]

export const b07Facts: Fact[] = [
  { id: "b07-8c-two", claim: "aab has exactly two parse trees", problem: () => (parseCount(b07g8c, "aab") === 2 ? null : `${parseCount(b07g8c, "aab")} trees`) },
]

export const b07Pumping: PumpClaim[] = [
  {
    id: "b07-1ii",
    kind: "cfl",
    inL: (w) => { const m = w.match(/^(a*)(b*)(c*)$/); return !!m && m[2].length === 2 * m[1].length && m[1].length === m[3].length },
    witness: (p) => "a".repeat(p) + "b".repeat(2 * p) + "c".repeat(p),
    i: () => 0,
    ps: [1, 2, 3],
  },
  {
    id: "b07-5b",
    kind: "regular",
    inL: (w) => { const m = w.match(/^(0*)1(0*)$/); return !!m && m[1].length === m[2].length && m[1].length >= 1 },
    witness: (p) => "0".repeat(p) + "1" + "0".repeat(p),
    i: () => 0,
  },
]

/* Machines in the 11-batch (2012-2013) solutions, each tested against its language. */
import { cfgGenerates, faAccepts, grammar, type TM } from "@/lib/automata"
import { cfgToPda } from "@/lib/pda-hmu"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const AB = ["a", "b"]
const B01 = ["0", "1"]

/* ───── Q1(a): CFG → PDA ───── */

export const b11g1 = grammar("S -> BS | A\nA -> 0A | ε\nB -> BB1 | 2")
export const b11pda1 = cfgToPda(b11g1)

/* ───── Q3(b): TM deciding w−w−w ───── */

type Move = TM["delta"][number]
const www: Move[] = [
  ["q1", "x", "q1", "x", "R"],
  ["q1", "-", "q9", "-", "R"], // first copy used up: only x and − may remain
  ["q9", "x", "q9", "x", "R"],
  ["q9", "-", "q10", "-", "R"], // exactly two separators
  ["q10", "x", "q10", "x", "R"],
  ["q10", "B", "qa", "B", "R"],
]
for (const c of AB) {
  www.push(["q1", c, `c${c}`, "x", "R"]) // cross off c in the first copy
  for (const y of AB) www.push([`c${c}`, y, `c${c}`, y, "R"])
  www.push([`c${c}`, "-", `m${c}`, "-", "R"])
  www.push([`m${c}`, "x", `m${c}`, "x", "R"])
  www.push([`m${c}`, c, `d${c}`, "x", "R"]) // matching c in the second copy
  for (const y of AB) www.push([`d${c}`, y, `d${c}`, y, "R"])
  www.push([`d${c}`, "-", `n${c}`, "-", "R"])
  www.push([`n${c}`, "x", `n${c}`, "x", "R"])
  www.push([`n${c}`, c, "back", "x", "L"]) // matching c in the third copy
}
for (const y of ["a", "b", "x", "-"]) www.push(["back", y, "back", y, "L"])
www.push(["back", "B", "q1", "B", "R"]) // left end: start the next round
export const b11tmWww = tm(["q1", "ca", "cb", "ma", "mb", "da", "db", "na", "nb", "back", "q9", "q10", "qa"], "q1", ["qa"], www, ["a", "b", "-"], ["a", "b", "-", "x", "B"])

/* ───── Q3(c): #w → #0^n (n even) or #1^n (n odd) ───── */

const par: Move[] = [["q0", "#", "e", "#", "R"]]
for (const b of B01) {
  par.push(["e", b, "o", b, "R"])
  par.push(["o", b, "e", b, "R"])
  par.push(["w0", b, "w0", "0", "L"])
  par.push(["w1", b, "w1", "1", "L"])
}
par.push(["e", "B", "w0", "B", "L"], ["o", "B", "w1", "B", "L"], ["w0", "#", "qa", "#", "S"], ["w1", "#", "qa", "#", "S"])
export const b11tmPar = tm(["q0", "e", "o", "w0", "w1", "qa"], "q0", ["qa"], par, ["#", "0", "1"], ["#", "0", "1", "B"])

/* ───── Q4(c): odd length with middle a ───── */

export const b11midA = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "$"],
    ["qp", "a", "ε", "qp", "X"],
    ["qp", "b", "ε", "qp", "X"],
    ["qp", "a", "ε", "qm", "ε"], // guess: this a is the middle
    ["qm", "a", "X", "qm", "ε"],
    ["qm", "b", "X", "qm", "ε"],
    ["qm", "ε", "$", "qacc", "ε"],
  ],
  AB,
  ["X", "$"],
)

/* ───── Section B ───── */

export const b11g7a = grammar("S -> A1B\nA -> 0A | ε\nB -> 0B | 1B | ε")
export const b11q7b = dfa("1", ["2", "3"], { 1: { a: "2", b: "3" }, 2: { a: "1", b: "2" }, 3: { a: "2", b: "1" } })
export const b11q7bRegex = "(ab*a+bab*a+bb)*(ab*+b+bab*)"
export const b11mult5 = dfa("s", ["r0"], Object.fromEntries([["s", { 0: "r0", 1: "r1" }], ...[0, 1, 2, 3, 4].map((r) => [`r${r}`, { 0: `r${(2 * r) % 5}`, 1: `r${(2 * r + 1) % 5}` }])]))

export const b11Checks: Check[] = [
  { id: "b11-1a", machine: b11pda1, alphabet: ["0", "1", "2"], maxLen: 6, inL: (w) => cfgGenerates(b11g1, w), stackBound: (left) => left + 1 },
  { id: "b11-3b", machine: b11tmWww, alphabet: ["a", "b", "-"], maxLen: 8, inL: (w) => { const m = w.match(/^([ab]*)-([ab]*)-([ab]*)$/); return !!m && m[1] === m[2] && m[2] === m[3] } },
  { id: "b11-3c", machine: b11tmPar, alphabet: ["#", "0", "1"], maxLen: 9, inL: (w) => /^#[01]*$/.test(w), output: (w) => "#" + (w.length % 2 === 1 ? "0" : "1").repeat(w.length - 1) },
  { id: "b11-4c", machine: b11midA, alphabet: AB, maxLen: 9, inL: (w) => w.length % 2 === 1 && w[(w.length - 1) / 2] === "a" },
  { id: "b11-6c", regex: "0*(10*10*)*", alphabet: B01, maxLen: 10, inL: (w) => count(w, "1") % 2 === 0 },
  { id: "b11-7a", grammar: b11g7a, alphabet: B01, maxLen: 9, inL: (w) => w.includes("1") },
  { id: "b11-7b", regex: b11q7bRegex, alphabet: AB, maxLen: 10, inL: (w) => faAccepts(b11q7b, w) },
  { id: "b11-7c", machine: b11mult5, dfa: true, alphabet: B01, maxLen: 11, inL: (w) => w.length > 0 && parseInt(w, 2) % 5 === 0 },
]

export const b11Pumping: PumpClaim[] = [
  { id: "b11-5b", kind: "regular", inL: (w) => /^0*$/.test(w) && Number.isInteger(Math.sqrt(w.length)), witness: (p) => "0".repeat(p * p), i: () => 2 },
  {
    id: "b11-8c",
    kind: "regular",
    inL: (w) => { const m = w.match(/^(0*)1(0*)$/); return !!m && m[1].length === m[2].length && m[1].length > 1 },
    witness: (p) => "0".repeat(p + 2) + "1" + "0".repeat(p + 2),
    i: () => 0,
  },
]

/* Machines in the 5-batch (2006-2007) solutions, each tested against its language. */
import { cfgGenerates, grammar, type TM } from "@/lib/automata"
import { dfa } from "./notes-dfa"
import { tm } from "./notes-tm"
import type { Check } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B01 = ["0", "1"]

/* ───── Q1(a): starts with 0 and odd length, or starts with 1 and even length ───── */

export const b05q1a = dfa("s", ["zo", "oe"], {
  s: { 0: "zo", 1: "oo" },
  zo: { 0: "ze", 1: "ze" }, // began with 0, odd length so far
  ze: { 0: "zo", 1: "zo" },
  oo: { 0: "oe", 1: "oe" }, // began with 1, odd length so far
  oe: { 0: "oo", 1: "oo" },
})

/* ───── Q2(b): even 0s and odd 1s ───── */

export const b05q2b = dfa("ee", ["eo"], {
  ee: { 0: "oe", 1: "eo" },
  eo: { 0: "oo", 1: "ee" },
  oe: { 0: "ee", 1: "oo" },
  oo: { 0: "eo", 1: "oe" },
})

/* ───── Section B grammars ───── */

export const b05g5 = grammar("S -> aSb | aAb\nA -> aA | a")
export const b05g6 = grammar("D -> TL;\nT -> bin_\nL -> L,V | V\nV -> I | I=N\nI -> a | b | Ia | Ib | I0 | I1\nN -> 1 | N1 | N0")
export const b05exprAmb = grammar("E -> E+E | E*E | (E) | I\nI -> a | b | Ia | Ib | I0 | I1")
export const b05exprFixed = grammar("E -> E+T | T\nT -> T*F | F\nF -> (E) | I\nI -> a | b | Ia | Ib | I0 | I1")

/* ───── Q11: XOR, replacing the second number: x,y → x,(x ⊕ y) ───── */

type Move = TM["delta"][number]
const xr: Move[] = []
for (const a of B01) {
  xr.push(["q0", a, `c${a}`, `*${a}`, "R"]) // mark the next bit of x and carry it
  for (const x of B01) xr.push([`c${a}`, x, `c${a}`, x, "R"])
  xr.push([`c${a}`, ",", `d${a}`, ",", "R"])
  for (const x of B01) {
    xr.push([`d${a}`, `*${x}`, `d${a}`, `*${x}`, "R"])
    xr.push([`d${a}`, x, "b2", `*${a === x ? "0" : "1"}`, "L"]) // replace the bit of y by the XOR
    xr.push(["b2", `*${x}`, "b2", `*${x}`, "L"])
    xr.push(["b1", x, "b1", x, "L"])
    xr.push(["b1", `*${x}`, "q0", `*${x}`, "R"])
    xr.push(["u", `*${x}`, "u", x, "R"]) // unmark y
    xr.push(["v", `*${x}`, "v", x, "L"]) // unmark x
    xr.push(["v", x, "v", x, "L"])
  }
}
xr.push(["b2", ",", "b1", ",", "L"])
xr.push(["q0", ",", "u", ",", "R"])
xr.push(["u", "B", "v", "B", "L"], ["v", ",", "v", ",", "L"], ["v", "B", "qf", "B", "R"])
export const b05tmXor = tm(["q0", "c0", "c1", "d0", "d1", "b2", "b1", "u", "v", "qf"], "q0", ["qf"], xr, ["0", "1", ","], ["0", "1", ",", "*0", "*1", "B"])
const xyIn = (w: string) => {
  const m = w.match(/^([01]+),([01]+)$/)
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

/* ───── Q12: the given TM ───── */

export const b05tm12 = tm(
  ["q0", "q1", "qf"],
  "q0",
  ["qf"],
  [
    ["q0", "0", "q1", "1", "R"],
    ["q0", "B", "qf", "B", "R"],
    ["q1", "1", "q0", "0", "R"],
    ["q1", "B", "qf", "B", "R"],
  ],
  B01,
  ["0", "1", "B"],
)

/** Q3(c): the i-th binary string (i ≥ 1), with ε first: 1w is i in binary. */
export const ithBinary = (i: number) => i.toString(2).slice(1)

export const b05Checks: Check[] = [
  { id: "b05-1a", machine: b05q1a, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => (w.startsWith("0") && w.length % 2 === 1) || (w.startsWith("1") && w.length % 2 === 0) },
  { id: "b05-2b", machine: b05q2b, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => count(w, "0") % 2 === 0 && count(w, "1") % 2 === 1 },
  { id: "b05-4b-i", regex: "0*10*", alphabet: B01, maxLen: 8, inL: (w) => count(w, "1") === 1 },
  { id: "b05-4b-ii", regex: "(0∪1)*1(0∪1)*", alphabet: B01, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b05-4b-iii", regex: "1*(01⁺)*", alphabet: B01, maxLen: 9, inL: (w) => !/0(0|$)/.test(w) },
  { id: "b05-4b-iv", regex: "((0∪1)(0∪1)(0∪1))*", alphabet: B01, maxLen: 9, inL: (w) => w.length % 3 === 0 },
  { id: "b05-4b-v", regex: "0(0∪1)*0∪1(0∪1)*1∪0∪1", alphabet: B01, maxLen: 9, inL: (w) => w.length > 0 && w[0] === w.at(-1) },
  { id: "b05-4b-vii", regex: "(0∪ε)1*", alphabet: B01, maxLen: 8, inL: (w) => /^0?1*$/.test(w) },
  { id: "b05-5", grammar: b05g5, alphabet: ["a", "b"], maxLen: 10, inL: (w) => { const m = w.match(/^(a*)(b*)$/); return !!m && m[2].length >= 1 && m[1].length > m[2].length } },
  { id: "b05-7", grammar: b05exprFixed, alphabet: ["a", "b", "0", "+", "*", "(", ")"], maxLen: 5, inL: (w) => cfgGenerates(b05exprAmb, w), unambiguous: true },
  {
    id: "b05-11",
    machine: b05tmXor,
    alphabet: ["0", "1", ","],
    maxLen: 9,
    inL: (w) => xyIn(w) !== null,
    output: (w) => { const [x, y] = xyIn(w)!; return `${x},${[...x].map((b, i) => (b === y[i] ? "0" : "1")).join("")}` },
  },
  { id: "b05-12", machine: b05tm12, alphabet: B01, maxLen: 10, inL: (w) => /^(01)*0?$/.test(w) },
]

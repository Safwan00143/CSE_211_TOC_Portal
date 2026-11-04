/* Machines in the 6-batch (2007-2008) solutions, each tested against its language. */
import { cfgGenerates, grammar, type TM } from "@/lib/automata"
import { dfa } from "./notes-dfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check } from "./types"

const AB = ["a", "b"]
const B01 = ["0", "1"]

/* ───── Q1(b): every a is immediately followed by a b ───── */

export const b06q1b = dfa("s", ["s"], { s: { a: "w", b: "s" }, w: { a: "d", b: "s" }, d: { a: "d", b: "d" } })

/* ───── Q5: a^i c^k (bc)^i ───── */

export const b06pda5 = pda(
  ["qs", "qa", "qc", "qb", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "$"],
    ["qa", "a", "ε", "qa", "X"],
    ["qa", "ε", "ε", "qc", "ε"],
    ["qc", "c", "ε", "qc", "ε"],
    ["qc", "ε", "ε", "qb", "ε"],
    ["qb", "b", "X", "qm", "ε"], // b of a bc pair: pop one X
    ["qm", "c", "ε", "qb", "ε"], // the c of the pair
    ["qb", "ε", "$", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["X", "$"],
)

/* ───── Q7: TM for 0^n 1^n, n ≥ 1 (HMU's machine) ───── */

type Move = TM["delta"][number]
export const b06tm01 = tm(
  ["q0", "q1", "q2", "q3", "q4"],
  "q0",
  ["q4"],
  [
    ["q0", "0", "q1", "X", "R"],
    ["q0", "Y", "q3", "Y", "R"],
    ["q1", "0", "q1", "0", "R"],
    ["q1", "Y", "q1", "Y", "R"],
    ["q1", "1", "q2", "Y", "L"],
    ["q2", "0", "q2", "0", "L"],
    ["q2", "Y", "q2", "Y", "L"],
    ["q2", "X", "q0", "X", "R"],
    ["q3", "Y", "q3", "Y", "R"],
    ["q3", "B", "q4", "B", "R"],
  ] as Move[],
  B01,
  ["0", "1", "X", "Y", "B"],
)

/* ───── Q8: add two binary numbers x,y of equal length: repeat (y−−, x++) until y = 0 ───── */

const add: Move[] = []
for (const b of B01) add.push(["go", b, "go", b, "R"]) // to the comma
add.push(["go", ",", "z", ",", "R"])
add.push(["z", "0", "z", "0", "R"]) // is y zero?
add.push(["z", "1", "e", "1", "R"]) // no: go to its end and decrement
add.push(["z", "B", "erase", "B", "L"]) // yes: erase y and the comma
for (const b of B01) add.push(["e", b, "e", b, "R"])
add.push(["e", "B", "dec", "B", "L"])
add.push(["dec", "0", "dec", "1", "L"]) // borrow
add.push(["dec", "1", "left", "0", "L"])
for (const b of B01) add.push(["left", b, "left", b, "L"])
add.push(["left", ",", "inc", ",", "L"])
add.push(["inc", "1", "inc", "0", "L"]) // carry
add.push(["inc", "0", "home", "1", "L"])
add.push(["inc", "B", "go", "1", "R"]) // carry out of the top bit
for (const b of B01) add.push(["home", b, "home", b, "L"])
add.push(["home", "B", "go", "B", "R"])
for (const b of B01) add.push(["erase", b, "erase", "B", "L"])
add.push(["erase", ",", "qf", "B", "L"])
export const b06tmAdd = tm(["go", "z", "e", "dec", "left", "inc", "home", "erase", "qf"], "go", ["qf"], add, ["0", "1", ","], ["0", "1", ",", "B"])
const addIn = (w: string) => {
  const m = w.match(/^([01]+),([01]+)$/)
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

/* ───── Q11: the given TM ───── */

export const b06tm11 = tm(
  ["q0", "q1", "qf"],
  "q0",
  ["qf"],
  [
    ["q0", "0", "q0", "B", "R"],
    ["q0", "1", "q1", "B", "R"],
    ["q1", "1", "q1", "B", "R"],
    ["q1", "B", "qf", "B", "R"],
  ],
  B01,
  ["0", "1", "B"],
)

/* ───── Q13: CNF grammar (HMU's CYK example) ───── */

export const b06g13 = grammar("S -> AB | BC\nA -> BA | a\nB -> CC | b\nC -> AB | a")

export const b06Checks: Check[] = [
  { id: "b06-1b", machine: b06q1b, dfa: true, alphabet: AB, maxLen: 10, inL: (w) => /^(b|ab)*$/.test(w) },
  { id: "b06-2b-ii", regex: "(0(0∪1)*)∪((0∪1)*1)", alphabet: B01, maxLen: 9, inL: (w) => w.startsWith("0") || w.endsWith("1") },
  { id: "b06-5", machine: b06pda5, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => { const m = w.match(/^(a*)(c*)((?:bc)*)$/); return !!m && m[1].length === m[3].length / 2 } },
  { id: "b06-7", machine: b06tm01, alphabet: B01, maxLen: 10, inL: (w) => /^0+1+$/.test(w) && w.indexOf("1") * 2 === w.length },
  {
    id: "b06-8",
    machine: b06tmAdd,
    alphabet: ["0", "1", ","],
    maxLen: 7,
    inL: (w) => addIn(w) !== null,
    output: (w) => { const [x, y] = addIn(w)!; return (parseInt(x, 2) + parseInt(y, 2)).toString(2).padStart(x.length, "0") },
  },
  { id: "b06-11", machine: b06tm11, alphabet: B01, maxLen: 9, inL: (w) => /^0*1+$/.test(w) },
  { id: "b06-13", grammar: b06g13, cnf: true, alphabet: AB, maxLen: 8, inL: (w) => cfgGenerates(b06g13, w) },
]

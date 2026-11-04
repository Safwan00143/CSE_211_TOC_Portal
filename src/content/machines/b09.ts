/* Machines in the 9-batch (2010-2011) solutions, each tested against its language. */
import { cfgGenerates, grammar, subsetConstruction, type PdaHmu, type TM } from "@/lib/automata"
import { cfgToPda, pdaToCfg } from "@/lib/pda-hmu"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { hmuPda } from "./notes-pda-hmu"
import { tm } from "./notes-tm"
import type { Check } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const AB = ["a", "b"]
const B01 = ["0", "1"]
const isPal = (w: string) => w === [...w].reverse().join("")
const blocks = (w: string, re: RegExp) => w.match(re)

/* ───── Section A ───── */

export const b09mod3is1 = dfa("q0", ["q1"], { q0: { a: "q1", b: "q0" }, q1: { a: "q2", b: "q1" }, q2: { a: "q0", b: "q2" } })
export const b09q3 = nfa(
  ["p", "q", "r", "s", "t"],
  "p",
  ["s", "t"],
  [
    ["p", "0", "p"],
    ["p", "0", "q"],
    ["p", "1", "p"],
    ["q", "0", "r"],
    ["q", "0", "s"],
    ["q", "1", "t"],
    ["r", "0", "p"],
    ["r", "0", "r"],
    ["r", "1", "t"],
  ],
  B01,
)
export const b09q3Subset = subsetConstruction(b09q3)
export const b09no110 = dfa("s", ["s", "o", "oo"], { s: { 0: "s", 1: "o" }, o: { 0: "s", 1: "oo" }, oo: { 0: "d", 1: "oo" }, d: { 0: "d", 1: "d" } })
export const b09no110Regex = "(0+10)*1*"
export const b09g7 = grammar("S -> AA\nA -> AAA | a | bA | Ab")
export const b09g9a = grammar("S -> 0S1 | A\nA -> 1A0 | ε")
export const b09g9b = grammar("S -> aSc | A\nA -> aAb | ε")
export const b09g9c = grammar("S -> aaaSc | A\nA -> aaAb | ε")
export const b09g9d = grammar("S -> aSb | aSbb | ε")

/* ───── Q11(b): a^(2^n) b (Sipser's halving machine) ───── */

type Move = TM["delta"][number]
const halve: Move[] = [
  ["q1", "a", "q2", "B", "R"], // blank out the first a (it marks the left end)
  ["q2", "x", "q2", "x", "R"],
  ["q2", "b", "q6", "b", "R"], // exactly one a left
  ["q6", "B", "qa", "B", "R"], // and nothing after the b: accept
  ["q2", "a", "q3", "x", "R"], // cross off every other a
  ["q3", "x", "q3", "x", "R"],
  ["q3", "a", "q4", "a", "R"],
  ["q3", "b", "q5", "b", "L"], // an even number of a's this sweep: go back
  ["q4", "x", "q4", "x", "R"],
  ["q4", "a", "q3", "x", "R"],
  ["q5", "a", "q5", "a", "L"],
  ["q5", "x", "q5", "x", "L"],
  ["q5", "B", "q2", "B", "R"],
]
export const b09tmPow = tm(["q1", "q2", "q3", "q4", "q5", "q6", "qa"], "q1", ["qa"], halve, AB, ["a", "b", "x", "B"])

/* ───── Q12(d), Q13 ───── */

export const b09g12d = grammar("S -> TX\nT -> 0T0 | 1T1 | #X\nX -> 0X | 1X | ε")
export const b09pda12d = cfgToPda(b09g12d)

/** All palindromes over {0,1}, Sipser form: push, guess the middle (optionally skipping one symbol), pop and match. */
export const b09pal = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "$"],
    ["qp", "0", "ε", "qp", "0"],
    ["qp", "1", "ε", "qp", "1"],
    ["qp", "ε", "ε", "qm", "ε"], // even length: the middle is here
    ["qp", "0", "ε", "qm", "ε"], // odd length: skip the middle symbol
    ["qp", "1", "ε", "qm", "ε"],
    ["qm", "0", "0", "qm", "ε"],
    ["qm", "1", "1", "qm", "ε"],
    ["qm", "ε", "$", "qacc", "ε"],
  ],
  B01,
  ["0", "1", "$"],
)
/** The same PDA in HMU form, accepting by empty stack, for the PDA → CFG conversion. */
export const b09palHmu: PdaHmu = hmuPda(
  ["q", "p"],
  "q",
  [],
  [
    ...["Z0", "0", "1"].flatMap((X): PdaHmu["delta"] => [
      ["q", "0", X, "q", ["0", X]],
      ["q", "1", X, "q", ["1", X]],
      ["q", "ε", X, "p", [X]],
      ["q", "0", X, "p", [X]],
      ["q", "1", X, "p", [X]],
    ]),
    ["p", "0", "0", "p", []],
    ["p", "1", "1", "p", []],
    ["p", "ε", "Z0", "p", []],
  ],
  B01,
  ["0", "1", "Z0"],
  "empty",
)
export const b09palCfg = pdaToCfg(b09palHmu)
/** The PDA of Question 13(c) (Sipser's ww^R machine). */
export const b09given = pda(
  ["q1", "q2", "q3", "q4"],
  "q1",
  ["q1", "q4"],
  [
    ["q1", "ε", "ε", "q2", "$"],
    ["q2", "0", "ε", "q2", "0"],
    ["q2", "1", "ε", "q2", "1"],
    ["q2", "ε", "ε", "q3", "ε"],
    ["q3", "0", "0", "q3", "ε"],
    ["q3", "1", "1", "q3", "ε"],
    ["q3", "ε", "$", "q4", "ε"],
  ],
  B01,
  ["0", "1", "$"],
)

const isPow2 = (n: number) => n >= 1 && (n & (n - 1)) === 0

export const b09Checks: Check[] = [
  { id: "b09-2", machine: b09mod3is1, dfa: true, alphabet: AB, maxLen: 10, inL: (w) => count(w, "a") % 3 === 1 },
  { id: "b09-3", machine: b09q3Subset.dfa, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => /0(0|1)$/.test(w) || /^.*0[01]$/.test(w) },
  { id: "b09-4", machine: b09no110, dfa: true, alphabet: B01, maxLen: 11, inL: (w) => !w.includes("110") },
  { id: "b09-4-regex", regex: b09no110Regex, alphabet: B01, maxLen: 11, inL: (w) => !w.includes("110") },
  { id: "b09-7", grammar: b09g7, alphabet: AB, maxLen: 7, inL: (w) => count(w, "a") >= 2 && count(w, "a") % 2 === 0 },
  { id: "b09-9a", grammar: b09g9a, alphabet: B01, maxLen: 10, inL: (w) => [...Array(w.length + 1).keys()].some((n) => [...Array(w.length + 1).keys()].some((m) => w === "0".repeat(n) + "1".repeat(m) + "0".repeat(m) + "1".repeat(n))) },
  { id: "b09-9b", grammar: b09g9b, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const m = blocks(w, /^(a*)(b*)(c*)$/); return !!m && m[1].length === m[2].length + m[3].length } },
  { id: "b09-9c", grammar: b09g9c, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => { const m = blocks(w, /^(a*)(b*)(c*)$/); return !!m && m[1].length === 2 * m[2].length + 3 * m[3].length } },
  { id: "b09-9d", grammar: b09g9d, alphabet: AB, maxLen: 10, inL: (w) => { const m = blocks(w, /^(a*)(b*)$/); return !!m && m[1].length <= m[2].length && m[2].length <= 2 * m[1].length } },
  { id: "b09-11b", machine: b09tmPow, alphabet: AB, maxLen: 18, inL: (w) => /^a+b$/.test(w) && isPow2(w.length - 1) },
  { id: "b09-12d", machine: b09pda12d, alphabet: ["0", "1", "#"], maxLen: 6, inL: (w) => cfgGenerates(b09g12d, w) },
  { id: "b09-13a", machine: b09pal, alphabet: B01, maxLen: 10, inL: isPal },
  { id: "b09-13a-hmu", machine: b09palHmu, alphabet: B01, maxLen: 9, inL: isPal },
  { id: "b09-13b", grammar: b09palCfg.trimmed, alphabet: B01, maxLen: 8, inL: isPal },
  { id: "b09-13c", machine: b09given, alphabet: B01, maxLen: 10, inL: (w) => w.length % 2 === 0 && isPal(w) },
]

export const b09Pumping: PumpClaim[] = [
  {
    id: "b09-6",
    kind: "regular",
    inL: (w) => { const m = blocks(w, /^(0*)(1*)(0*)$/); return !!m && m[1].length === m[3].length },
    witness: (p) => "0".repeat(p) + "1" + "0".repeat(p),
    i: () => 0,
  },
]

/* HMU-style PDAs and conversions in the pda-hmu note (Atif Sir, Lecture 3). */
import { grammar, type PdaHmu } from "@/lib/automata"
import { cfgToPda, emptyToFinal, finalToEmpty, pdaToCfg } from "@/lib/pda-hmu"
import { wwr } from "./kit-demo"
import type { Check } from "./types"

type Move = PdaHmu["delta"][number]
export function hmuPda(
  states: string[],
  start: string,
  accept: string[],
  moves: Move[],
  alphabet: string[],
  stack: string[],
  acceptBy: "final" | "empty" = "final",
  startStack = "Z0",
): PdaHmu {
  return { kind: "pda-hmu", states, alphabet, stack, start, startStack, accept, acceptBy, delta: moves }
}

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const balancedOk = (w: string) => {
  let d = 0
  for (const c of w) if ((d += c === "(" ? 1 : -1) < 0) return false
  return d === 0
}

export { wwr as pdaWwr }

/** Atif Sir's balanced-parentheses PDA, accepting by final state q1. */
export const pdaParen = hmuPda(
  ["q0", "q1"],
  "q0",
  ["q1"],
  [
    ["q0", "(", "Z0", "q0", ["(", "Z0"]],
    ["q0", "(", "(", "q0", ["(", "("]],
    ["q0", ")", "(", "q0", []],
    ["q0", "ε", "Z0", "q1", ["Z0"]],
  ],
  ["(", ")"],
  ["(", "Z0"],
)

/** The same PDA with its last move changed to empty the stack: δ(q0, ε, Z0) = {(q1, ε)}. */
export const pdaParenEmpty = hmuPda(
  ["q0", "q1"],
  "q0",
  [],
  [
    ["q0", "(", "Z0", "q0", ["(", "Z0"]],
    ["q0", "(", "(", "q0", ["(", "("]],
    ["q0", ")", "(", "q0", []],
    ["q0", "ε", "Z0", "q1", []],
  ],
  ["(", ")"],
  ["(", "Z0"],
  "empty",
)

/** Equal numbers of a's and b's: a stack of a's or of b's holds the excess. */
export const pdaEqualAb = hmuPda(
  ["q", "f"],
  "q",
  ["f"],
  [
    ["q", "a", "Z0", "q", ["a", "Z0"]],
    ["q", "a", "a", "q", ["a", "a"]],
    ["q", "a", "b", "q", []],
    ["q", "b", "Z0", "q", ["b", "Z0"]],
    ["q", "b", "b", "q", ["b", "b"]],
    ["q", "b", "a", "q", []],
    ["q", "ε", "Z0", "f", ["Z0"]],
  ],
  ["a", "b"],
  ["a", "b", "Z0"],
)

/** DPDA for wcw^R: push until c, then pop and match. */
export const dpdaWcwr = hmuPda(
  ["q0", "q1", "q2"],
  "q0",
  ["q2"],
  [
    ...(["0", "1"] as const).flatMap((a) => (["0", "1", "Z0"] as const).map((X) => ["q0", a, X, "q0", [a, X]] as Move)),
    ...(["0", "1", "Z0"] as const).map((X) => ["q0", "c", X, "q1", [X]] as Move),
    ["q1", "0", "0", "q1", []],
    ["q1", "1", "1", "q1", []],
    ["q1", "ε", "Z0", "q2", ["Z0"]],
  ],
  ["0", "1", "c"],
  ["0", "1", "Z0"],
)

/** HMU's two conditions for a deterministic PDA. */
export function isDeterministic(m: PdaHmu) {
  for (const q of m.states)
    for (const X of m.stack) {
      const on = (a: string) => m.delta.filter(([f, s, Y]) => f === q && s === a && Y === X).length
      if (on("ε") > 1 || m.alphabet.some((a) => on(a) > 1)) return false
      if (on("ε") > 0 && m.alphabet.some((a) => on(a) > 0)) return false
    }
  return true
}

export const gExprAmbI = grammar("E -> I | E+E | E*E | (E)\nI -> a | b | Ia | Ib | I0 | I1")
export const pdaExpr = cfgToPda(gExprAmbI)

export const pdaWwrEmpty = finalToEmpty(wwr)
export const pdaParenFinal = emptyToFinal(pdaParenEmpty)
export const parenCfg = pdaToCfg(pdaParenEmpty)

const exprOk = (w: string) => {
  // E → I | E+E | E*E | (E), I → a|b followed by any of a, b, 0, 1
  let i = 0
  const I = () => {
    if (w[i] !== "a" && w[i] !== "b") return false
    i++
    while (w[i] && "ab01".includes(w[i])) i++
    return true
  }
  const atom = (): boolean => (w[i] === "(" ? (i++, E() && w[i] === ")" ? (i++, true) : false) : I())
  const E = (): boolean => {
    if (!atom()) return false
    while (w[i] === "+" || w[i] === "*") {
      i++
      if (!atom()) return false
    }
    return true
  }
  return E() && i === w.length
}

export const pdaHmuNoteChecks: Check[] = [
  { id: "note-hmu-wwr", machine: wwr, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length % 2 === 0 && w === [...w].reverse().join("") },
  { id: "note-hmu-paren", machine: pdaParen, alphabet: ["(", ")"], maxLen: 10, inL: balancedOk },
  { id: "note-hmu-paren-empty", machine: pdaParenEmpty, alphabet: ["(", ")"], maxLen: 10, inL: balancedOk },
  { id: "note-hmu-equal-ab", machine: pdaEqualAb, alphabet: ["a", "b"], maxLen: 10, inL: (w) => count(w, "a") === count(w, "b") },
  { id: "note-hmu-expr-pda", machine: pdaExpr, alphabet: ["a", "b", "0", "+", "*", "(", ")"], maxLen: 5, inL: exprOk, stackBound: (left) => left + 1 },
  { id: "note-hmu-final-to-empty", machine: pdaWwrEmpty, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length % 2 === 0 && w === [...w].reverse().join("") },
  { id: "note-hmu-empty-to-final", machine: pdaParenFinal, alphabet: ["(", ")"], maxLen: 10, inL: balancedOk },
  { id: "note-hmu-pda-to-cfg", grammar: parenCfg.trimmed, alphabet: ["(", ")"], maxLen: 10, inL: balancedOk },
  { id: "note-hmu-pda-to-cfg-full", grammar: parenCfg.full, alphabet: ["(", ")"], maxLen: 8, inL: balancedOk },
  {
    id: "note-hmu-dpda-wcwr",
    machine: dpdaWcwr,
    alphabet: ["0", "1", "c"],
    maxLen: 7,
    inL: (w) => { const p = w.split("c"); return p.length === 2 && p[0] === [...p[1]].reverse().join("") },
    deterministic: true,
  },
]

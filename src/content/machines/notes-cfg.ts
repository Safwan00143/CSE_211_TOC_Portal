/* Grammars in the CFG note (Hakim Sir, Lecture 7), each tested against its language and its ambiguity claims. */
import { grammar } from "@/lib/automata"
import type { Check } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]

const balancedOk = (w: string, pairs = ["()"]) => {
  const stack: string[] = []
  for (const c of w) {
    const open = pairs.find((p) => p[0] === c)
    const close = pairs.find((p) => p[1] === c)
    if (open) stack.push(open[1])
    else if (close) {
      if (stack.pop() !== c) return false
    } else return false
  }
  return stack.length === 0
}

export const gBalanced = grammar("S -> SS | (S) | ε")
export const gMixed = grammar("S -> SS | (S) | [S] | ε")
export const g0S1 = grammar("S -> 0S1 | #")
export const gEqual = grammar("S -> 0S1S | 1S0S | ε")
export const gMirror = grammar("S -> 0S0 | 1S1 | #")
export const gPal = grammar("P -> 0P0 | 1P1 | 0 | 1 | ε")
export const gAbcd = grammar("S -> aSd | T\nT -> bTc | ε")
export const gIJorJK = grammar("S -> S_1 | S_2\nS_1 -> AC\nA -> aAb | ε\nC -> cC | ε\nS_2 -> DE\nD -> aD | ε\nE -> bEc | ε")
export const gUnequal = grammar("U -> A | B\nA -> E0E | E0A\nB -> E1E | E1B\nE -> 0E1E | 1E0E | ε")
export const gDfa101 = grammar("R_0 -> 0R_0 | 1R_1\nR_1 -> 1R_1 | 0R_2\nR_2 -> 0R_0 | 1R_3\nR_3 -> 0R_3 | 1R_3 | ε")
export const gWwr = grammar("S -> 0S0 | 1S1 | ε")
export const gExprAmb = grammar("E -> E+E | E*E | (E) | a")
export const gExpr = grammar("E -> E+T | T\nT -> T*F | F\nF -> (E) | a")
/** Dangling else with i = "if E then", e = "else", o = "other". */
export const gIfAmb = grammar("S -> iS | iSeS | o")
export const gIfFixed = grammar("S -> M | U\nM -> o | iMeM\nU -> iS | iMeU")
export const gInherent = grammar("S -> AB | C\nA -> aAb | ab\nB -> cBd | cd\nC -> aCd | aDd\nD -> bDc | bc")

const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}
const exprOk = (w: string) => {
  let i = 0
  const F = (): boolean => (w[i] === "a" ? (i++, true) : w[i] === "(" ? (i++, E() && w[i] === ")" ? (i++, true) : false) : false)
  const T = (): boolean => {
    if (!F()) return false
    while (w[i] === "*") {
      i++
      if (!F()) return false
    }
    return true
  }
  const E = (): boolean => {
    if (!T()) return false
    while (w[i] === "+") {
      i++
      if (!T()) return false
    }
    return true
  }
  return E() && i === w.length
}
/** if-then-else strings: S → iS | iSeS | o, recognised by a direct recursive check. */
const ifOk = (w: string): boolean => {
  const memo = new Map<string, boolean>()
  const S = (s: string): boolean => {
    if (memo.has(s)) return memo.get(s)!
    let ok = s === "o"
    if (!ok && s[0] === "i") {
      ok = S(s.slice(1))
      for (let k = 2; !ok && k < s.length; k++) if (s[k] === "e") ok = S(s.slice(1, k)) && S(s.slice(k + 1))
    }
    memo.set(s, ok)
    return ok
  }
  return S(w)
}

export const cfgNoteChecks: Check[] = [
  { id: "note-cfg-balanced", grammar: gBalanced, alphabet: ["(", ")"], maxLen: 10, inL: (w) => balancedOk(w), ambiguousOn: ["()()()", "()"] },
  { id: "note-cfg-balanced-unamb", grammar: grammar("S -> (S)S | ε"), alphabet: ["(", ")"], maxLen: 12, inL: (w) => balancedOk(w), unambiguous: true },
  { id: "note-cfg-mixed", grammar: gMixed, alphabet: ["(", ")", "[", "]"], maxLen: 8, inL: (w) => balancedOk(w, ["()", "[]"]) },
  { id: "note-cfg-0s1", grammar: g0S1, alphabet: ["0", "1", "#"], maxLen: 7, inL: (w) => /^0*#1*$/.test(w) && count(w, "0") === count(w, "1") },
  { id: "note-cfg-equal", grammar: gEqual, alphabet: B, maxLen: 10, inL: (w) => count(w, "0") === count(w, "1") },
  { id: "note-cfg-mirror", grammar: gMirror, alphabet: ["0", "1", "#"], maxLen: 7, inL: (w) => { const p = w.split("#"); return p.length === 2 && p[0] === [...p[1]].reverse().join("") } },
  { id: "note-cfg-pal", grammar: gPal, alphabet: B, maxLen: 10, inL: (w) => w === [...w].reverse().join(""), unambiguous: true },
  { id: "note-cfg-abcd", grammar: gAbcd, alphabet: ["a", "b", "c", "d"], maxLen: 8, inL: (w) => { const b = blocks(w, "abcd"); return !!b && b[0] === b[3] && b[1] === b[2] } },
  { id: "note-cfg-ij-or-jk", grammar: gIJorJK, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const b = blocks(w, "abc"); return !!b && (b[0] === b[1] || b[1] === b[2]) }, ambiguousOn: ["abc", ""] },
  { id: "note-cfg-unequal", grammar: gUnequal, alphabet: B, maxLen: 9, inL: (w) => count(w, "0") !== count(w, "1") },
  { id: "note-cfg-dfa101", grammar: gDfa101, alphabet: B, maxLen: 10, inL: (w) => w.includes("101") },
  { id: "note-cfg-wwr", grammar: gWwr, alphabet: B, maxLen: 10, inL: (w) => w.length % 2 === 0 && w === [...w].reverse().join("") },
  { id: "note-cfg-expr-amb", grammar: gExprAmb, alphabet: ["a", "+", "*", "(", ")"], maxLen: 7, inL: exprOk, ambiguousOn: ["a+a*a", "a+a+a"] },
  { id: "note-cfg-expr", grammar: gExpr, alphabet: ["a", "+", "*", "(", ")"], maxLen: 7, inL: exprOk, unambiguous: true },
  { id: "note-cfg-if-amb", grammar: gIfAmb, alphabet: ["i", "e", "o"], maxLen: 7, inL: ifOk, ambiguousOn: ["iioeo"] },
  { id: "note-cfg-if-fixed", grammar: gIfFixed, alphabet: ["i", "e", "o"], maxLen: 8, inL: ifOk, unambiguous: true },
  {
    id: "note-cfg-inherent",
    grammar: gInherent,
    alphabet: ["a", "b", "c", "d"],
    maxLen: 8,
    inL: (w) => { const b = blocks(w, "abcd"); return !!b && b.every((x) => x >= 1) && ((b[0] === b[1] && b[2] === b[3]) || (b[0] === b[3] && b[1] === b[2])) },
    ambiguousOn: ["abcd", "aabbccdd"],
  },
]

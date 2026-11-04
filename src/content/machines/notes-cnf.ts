/* Grammars in the CNF/CYK note (Atif Sir, Lecture 2): every simplification step must keep the language. */
import { cfgGenerates, grammar, type CFG } from "@/lib/automata"
import { cnfFinish, removeEpsilon, removeUnit, removeUseless } from "@/lib/cnf"
import { hmuCyk } from "./kit-demo"
import type { Check } from "./types"

export const gEps = grammar("S -> AB\nA -> aAA | ε\nB -> bBB | ε")
export const gEpsRemoved = removeEpsilon(gEps).grammar

export const gUseless = grammar("S -> AB | a\nA -> b")
export const gUselessRemoved = removeUseless(gUseless).grammar
/** The wrong order: unreachable first, then non-generating, leaves A behind. */
export const gUselessWrongOrder: CFG = { kind: "cfg", start: "S", rules: { S: [["a"]], A: [["b"]] } }

export const gExprUnit = grammar("E -> T | E+T\nT -> F | T*F\nF -> I | (E)\nI -> a | b | Ia | Ib | I0 | I1")
export const gExprNoUnit = removeUnit(gExprUnit).grammar
const names: Record<string, string> = { a: "A", b: "B", "0": "Z", "1": "O", "+": "P", "*": "M", "(": "L", ")": "R" }
export const gExprCnfSteps = cnfFinish(gExprNoUnit, (t) => names[t])

export { hmuCyk }

const same = (ref: CFG) => (w: string) => cfgGenerates(ref, w)
const EXPR = ["a", "b", "0", "1", "+", "*", "(", ")"]

export const cnfNoteChecks: Check[] = [
  { id: "note-cnf-eps", grammar: gEpsRemoved, alphabet: ["a", "b"], maxLen: 8, inL: same(gEps) },
  { id: "note-cnf-useless", grammar: gUselessRemoved, alphabet: ["a", "b"], maxLen: 5, inL: same(gUseless) },
  { id: "note-cnf-unit", grammar: gExprNoUnit, alphabet: EXPR, maxLen: 4, inL: same(gExprUnit) },
  { id: "note-cnf-terminals", grammar: gExprCnfSteps.afterTerminals, alphabet: EXPR, maxLen: 4, inL: same(gExprUnit) },
  { id: "note-cnf-final", grammar: gExprCnfSteps.grammar, cnf: true, alphabet: EXPR, maxLen: 5, inL: same(gExprUnit) },
  { id: "note-cnf-cyk-grammar", grammar: hmuCyk, cnf: true, alphabet: ["a", "b"], maxLen: 7, inL: same(hmuCyk) },
]

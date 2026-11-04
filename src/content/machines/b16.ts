/* Machines in the 16-batch (2017-2018) solutions, each tested against its language. */
import { cfgGenerates, grammar, regexToNfa } from "@/lib/automata"
import { cnfFinish, removeEpsilon, removeUnit, removeUseless } from "@/lib/cnf"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { bitwiseTm, twoNumbers } from "./tm-bitwise"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]
const AB = ["a", "b"]
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}

/* ───── Q1: 3-SAT → 3-COLOR ───── */

export type Graph = { nodes: string[]; edges: [string, string][] }
/** Literals are "x1" or "~x1". Palette T, F, N; variable pairs; an OR-of-OR gadget per clause. */
export function satToGraph(clauses: string[][]): Graph {
  const vars = [...new Set(clauses.flat().map((l) => l.replace("~", "")))].sort()
  const nodes = ["T", "F", "N"]
  const edges: [string, string][] = [["T", "F"], ["F", "N"], ["N", "T"]]
  for (const v of vars) {
    nodes.push(v, `~${v}`)
    edges.push([v, `~${v}`], [v, "N"], [`~${v}`, "N"])
  }
  const or = (u: string, v: string, tag: string) => {
    const [p, q, o] = [`p${tag}`, `q${tag}`, `o${tag}`]
    nodes.push(p, q, o)
    edges.push([u, p], [v, q], [p, q], [p, o], [q, o])
    return o
  }
  clauses.forEach(([l1, l2, l3], j) => {
    const o = or(or(l1, l2, `${j + 1}a`), l3, `${j + 1}b`)
    edges.push([o, "F"], [o, "N"])
  })
  return { nodes, edges }
}
/** Backtracking 3-colouring; colours 0 = T's colour, 1 = F's, 2 = N's. `fixed` pins some vertices. */
export function threeColour(g: Graph, fixed: Record<string, number> = {}): Record<string, number> | null {
  const adj = Object.fromEntries(g.nodes.map((n) => [n, [] as string[]]))
  for (const [a, b] of g.edges) {
    adj[a].push(b)
    adj[b].push(a)
  }
  const col: Record<string, number> = { T: 0, F: 1, N: 2, ...fixed }
  const order = g.nodes.filter((n) => !(n in col))
  for (const [a, b] of g.edges) if (a in col && b in col && col[a] === col[b]) return null
  const go = (i: number): boolean => {
    if (i === order.length) return true
    for (let c = 0; c < 3; c++) {
      if (adj[order[i]].some((m) => col[m] === c)) continue
      col[order[i]] = c
      if (go(i + 1)) return true
      delete col[order[i]]
    }
    return false
  }
  return go(0) ? col : null
}
export const b16formula = [["x1", "~x2", "~x3"], ["x1", "x3", "x4"]]
export const b16graph = satToGraph(b16formula)
/** x1 true, the rest false: satisfies both clauses. */
export const b16assignment = { x1: 0, "~x1": 1, x2: 1, "~x2": 0, x3: 1, "~x3": 0, x4: 1, "~x4": 0 }
export const b16colouring = threeColour(b16graph, b16assignment)

/* ───── Q2(b) ───── */

const t5: Record<string, Record<string, string>> = { s: { 0: "d", 1: "r1" }, d: { 0: "d", 1: "d" } }
for (let r = 0; r < 5; r++) t5[`r${r}`] = { 0: `r${(2 * r) % 5}`, 1: `r${(2 * r + 1) % 5}` }
export const b16mult5 = dfa("s", ["r0"], t5)
export const b16pow2 = dfa("s", ["o", "z"], { s: { 0: "d", 1: "o" }, o: { 0: "z", 1: "d" }, z: { 0: "z", 1: "d" }, d: { 0: "d", 1: "d" } })
const startsWith1 = (w: string) => w.startsWith("1")

/* ───── Q2(c), Q3(a) ───── */

export const b16aba = regexToNfa("(a∪b)*aba", AB)
export const b16gap = nfa(
  ["s", "g0", "g1", "g2", "g3", "g4", "f"],
  "s",
  ["f"],
  [
    ["s", "0,1", "s"],
    ["s", "0", "g0"],
    ["g0", "0,1", "g1"],
    ["g1", "0,1", "g2"],
    ["g2", "0,1", "g3"],
    ["g3", "0,1", "g4"],
    ["g4", "0,1", "g1"],
    ["g4", "0", "f"],
    ["f", "0,1", "f"],
  ],
  B,
)
const gapOk = (w: string) => {
  for (let i = 0; i < w.length; i++) for (let j = i + 5; j < w.length; j += 4) if (w[i] === "0" && w[j] === "0") return true
  return false
}

/* ───── Q4(b) ───── */

const perms = ["abc", "acb", "bac", "bca", "cab", "cba"]
export const b16re4b = {
  i: perms.map((p) => `(a+b+c)*${p[0]}(a+b+c)*${p[1]}(a+b+c)*${p[2]}(a+b+c)*`).join("+"),
  ii: "aaaa*b(bb)*",
  iii: "a(aa)*(bb)*+(aa)*b(bb)*",
  iv: "aa(a+b)*aa+ab(a+b)*ab+ba(a+b)*ba+bb(a+b)*bb",
  v: "b*(ab*ab*ab*)*",
}

/* ───── Q5, Q6, Q7 ───── */

export const b16three1 = grammar("S -> A1A1A1A\nA -> 0A | 1A | ε")
export const b16exprAmb = grammar("E -> E+E | E*E | (E) | a")
export const b16exprFixed = grammar("E -> E+T | T\nT -> T*F | F\nF -> (E) | a")
export const b16g7 = grammar("S -> A1A | B\nA -> 0A | 1A | ε\nD -> 00")
export const b16g7Eps = removeEpsilon(b16g7)
export const b16g7Unit = removeUnit(b16g7Eps.grammar)
export const b16g7Useless = removeUseless(b16g7Unit.grammar)
export const b16g7Cnf = cnfFinish(b16g7Useless.grammar, (t) => (t === "0" ? "Z" : "O"))

/* ───── Q8: a^n b^n c^m d^m (Sipser form) ───── */

export const b16pda = pda(
  ["qs", "qa", "qb", "qm", "qc", "qd", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "A"],
    ["qa", "b", "A", "qb", "ε"],
    ["qb", "b", "A", "qb", "ε"],
    ["qb", "ε", "Z", "qm", "Z"], // every A matched: Z is on top
    ["qm", "c", "ε", "qc", "C"],
    ["qc", "c", "ε", "qc", "C"],
    ["qc", "d", "C", "qd", "ε"],
    ["qd", "d", "C", "qd", "ε"],
    ["qd", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c", "d"],
  ["A", "C", "Z"],
)

/* ───── Q9: OR of N1 # N2 # ───── */

export const b16tmOr = bitwiseTm((a, b) => (a === "1" || b === "1" ? "1" : "0"), "#")

export const b16Checks: Check[] = [
  { id: "b16-2b-i", machine: b16mult5, dfa: true, alphabet: B, maxLen: 11, inL: (w) => startsWith1(w) && parseInt(w, 2) % 5 === 0 },
  { id: "b16-2b-ii", machine: b16pow2, dfa: true, alphabet: B, maxLen: 11, inL: (w) => /^10*$/.test(w) },
  { id: "b16-2c", machine: b16aba, alphabet: AB, maxLen: 9, inL: (w) => w.endsWith("aba") },
  { id: "b16-3a", machine: b16gap, alphabet: B, maxLen: 11, inL: gapOk, extra: ["101111010", "01000010111011", "00", "10101010", "00000"] },
  { id: "b16-4b-i", regex: b16re4b.i, alphabet: ["a", "b", "c"], maxLen: 6, inL: (w) => ["a", "b", "c"].every((c) => w.includes(c)) },
  { id: "b16-4b-ii", regex: b16re4b.ii, alphabet: AB, maxLen: 10, inL: (w) => { const b = blocks(w, "ab"); return !!b && b[0] >= 3 && b[1] % 2 === 1 } },
  { id: "b16-4b-iii", regex: b16re4b.iii, alphabet: AB, maxLen: 10, inL: (w) => { const b = blocks(w, "ab"); return !!b && (b[0] + b[1]) % 2 === 1 } },
  { id: "b16-4b-iv", regex: b16re4b.iv, alphabet: AB, maxLen: 9, inL: (w) => w.length >= 4 && w.slice(0, 2) === w.slice(-2) },
  { id: "b16-4b-v", regex: b16re4b.v, alphabet: AB, maxLen: 10, inL: (w) => count(w, "a") % 3 === 0 },
  { id: "b16-5b", grammar: b16three1, alphabet: B, maxLen: 9, inL: (w) => count(w, "1") >= 3 },
  { id: "b16-6b", grammar: b16exprFixed, alphabet: ["a", "+", "*", "(", ")"], maxLen: 7, inL: (w) => cfgGenerates(b16exprAmb, w), unambiguous: true },
  { id: "b16-7-cnf", grammar: b16g7Cnf.grammar, cnf: true, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b16-7-original", grammar: b16g7, alphabet: B, maxLen: 8, inL: (w) => w.includes("1") },
  { id: "b16-8", machine: b16pda, alphabet: ["a", "b", "c", "d"], maxLen: 10, inL: (w) => { const b = blocks(w, "abcd"); return !!b && b[0] >= 1 && b[2] >= 1 && b[0] === b[1] && b[2] === b[3] } },
  {
    id: "b16-9",
    machine: b16tmOr,
    alphabet: ["0", "1", "#"],
    maxLen: 10,
    inL: (w) => twoNumbers(w, "#") !== null,
    output: (w) => { const [x, y] = twoNumbers(w, "#")!; return `${x}#${y}#${[...x].map((b, i) => (b === "1" || y[i] === "1" ? "1" : "0")).join("")}` },
  },
]

/** The OR-of-OR clause gadget, with literal vertices coloured T/F: colourable iff some literal is T. */
function gadgetProperty() {
  const g = satToGraph([["l1", "l2", "l3"]])
  for (let m = 0; m < 8; m++) {
    const fixed: Record<string, number> = {}
    ;["l1", "l2", "l3"].forEach((l, i) => ((fixed[l] = (m >> i) & 1 ? 0 : 1), (fixed[`~${l}`] = (m >> i) & 1 ? 1 : 0)))
    if (!!threeColour(g, fixed) !== m > 0) return `inputs ${m.toString(2).padStart(3, "0")}: colourable = ${!!threeColour(g, fixed)}`
  }
  return null
}

export const b16Facts: Fact[] = [
  { id: "b16-1-gadget", claim: "the clause gadget is 3-colourable iff some literal is coloured true", problem: gadgetProperty },
  { id: "b16-1c-colouring", claim: "the graph for the given formula is 3-coloured by x1 = true", problem: () => (b16colouring ? null : "no colouring found") },
  {
    id: "b16-1-unsat",
    claim: "an unsatisfiable formula (all 8 clauses on x1..x3) gives a non-3-colourable graph",
    problem: () => {
      const all = [0, 1, 2, 3, 4, 5, 6, 7].map((m) => ["x1", "x2", "x3"].map((v, i) => ((m >> i) & 1 ? `~${v}` : v)))
      return threeColour(satToGraph(all)) ? "it is 3-colourable" : null
    },
  },
  { id: "b16-3a-00000", claim: "00000 is rejected under the 'characters strictly between' reading", problem: () => (gapOk("00000") ? "00000 accepted" : null) },
]

const blk3 = (w: string) => w.match(/^(0*)(1*)(0*)$/)
export const b16Pumping: PumpClaim[] = [
  {
    id: "b16-3b-iii-fixed",
    kind: "regular",
    inL: (w) => { const m = blk3(w); return !!m && m[1].length === m[2].length && m[2].length === m[3].length },
    witness: (p) => "0".repeat(p) + "1".repeat(p) + "0".repeat(p),
    i: () => 0,
    ps: [1, 2, 3, 4],
  },
]

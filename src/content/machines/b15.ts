/* Machines in the 15-batch (2016-2017) solutions, each tested against its language. */
import { faAccepts, grammar, subsetConstruction, type FA, type TM } from "@/lib/automata"
import { cnfFinish, removeEpsilon, removeUnit, removeUseless } from "@/lib/cnf"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]

/* ───── Q1: the Xustaeter stones ───── */

export type Stones = [number, number, number]
const key = (s: Stones) => s.join(",")
/** All (r, g, b) with r + g + b = n, and the R/G/B events between them. */
export function stoneGraph(n: number, reduced = false): FA {
  const norm = (s: Stones): Stones => (reduced ? ([...s].sort((a, b) => b - a) as Stones) : s)
  const states: string[] = []
  const delta: [string, string, string][] = []
  for (let r = n; r >= 0; r--) for (let g = n - r; g >= 0; g--) {
    const s = norm([r, g, n - r - g])
    if (!states.includes(key(s))) states.push(key(s))
  }
  for (const k of states) {
    const [r, g, b] = k.split(",").map(Number) as Stones
    const moves: [string, Stones | null][] = [
      ["R", g && b ? [r + 2, g - 1, b - 1] : null],
      ["G", r && b ? [r - 1, g + 2, b - 1] : null],
      ["B", r && g ? [r - 1, g - 1, b + 2] : null],
    ]
    for (const [e, t] of moves) if (t && !delta.some((d) => d[0] === k && d[2] === key(norm(t)) && d[1] === e)) delta.push([k, e, key(norm(t))])
  }
  // A reduced state stands for all its colour permutations, so label its events by the multiset only.
  const failed = states.filter((k) => k.split(",").filter((x) => x !== "0").length === 1)
  return { kind: "fa", states, alphabet: ["R", "G", "B"], start: states[0], accept: failed, delta: reduced ? delta.filter(([a, , c], i) => delta.findIndex((d) => d[0] === a && d[2] === c) === i).map(([a, , c]) => [a, "", c] as [string, string, string]) : delta }
}
/** must: every run eventually fails; cant: no run fails; might: both are possible. */
export function stoneClasses(g: FA) {
  const succ = (q: string) => g.delta.filter((d) => d[0] === q).map((d) => d[2])
  const live = new Set(g.states.filter((q) => !g.accept.includes(q)))
  const reach = (q: string, within?: Set<string>) => {
    const seen = new Set<string>()
    const stack = [q]
    while (stack.length)
      for (const t of succ(stack.pop()!))
        if (!seen.has(t) && (!within || within.has(t))) {
          seen.add(t)
          stack.push(t)
        }
    return seen
  }
  // A live state can avoid failure forever iff, moving only through live states, it reaches a live cycle.
  const onLiveCycle = new Set([...live].filter((q) => reach(q, live).has(q)))
  const out: Record<string, "must" | "cant" | "might"> = {}
  for (const q of g.states) {
    const canFail = !live.has(q) || [...reach(q)].some((t) => !live.has(t))
    const canSurvive = live.has(q) && (onLiveCycle.has(q) || [...reach(q, live)].some((t) => onLiveCycle.has(t)))
    out[q] = canFail && canSurvive ? "might" : canFail ? "must" : "cant"
  }
  return out
}
export const b15stones3 = stoneGraph(3)
export const b15stones4 = stoneGraph(4)
export const b15stones6 = stoneGraph(6, true)

/* ───── Q2(a): #a ≡ 0 mod 3 and even digit sum ───── */

const t2a: Record<string, Record<string, string>> = {}
for (let k = 0; k < 3; k++) for (const p of ["e", "o"]) {
  const other = p === "e" ? "o" : "e"
  t2a[`${k}${p}`] = { a: `${(k + 1) % 3}${p}`, b: `${k}${p}`, 1: `${k}${other}`, 2: `${k}${p}` }
}
export const b15q2a = dfa("0e", ["0e"], t2a)
const q2aOk = (w: string) => count(w, "a") % 3 === 0 && [...w].reduce((s, c) => s + (c === "1" ? 1 : c === "2" ? 2 : 0), 0) % 2 === 0

/* ───── Q2(b): the given ε-NFA ───── */

export const b15q2b = nfa(
  ["p", "q", "r", "s"],
  "p",
  ["q"],
  [
    ["p", "0", "q"],
    ["p", "ε", "r"],
    ["q", "0", "q"],
    ["q", "ε", "r"],
    ["r", "1", "q"],
    ["r", "ε", "s"],
    ["s", "0", "p"],
    ["s", "0", "r"],
  ],
  B,
)
export const b15q2bSubset = subsetConstruction(b15q2b)

/* ───── Q3(a): digit NFAs (checked on the digits 0–2) ───── */

const D = ["0", "1", "2"]
export function seenBefore(digits: string[]): FA {
  const moves: [string, string, string][] = [["s", digits.join(","), "s"], ["f", digits.join(","), "f"]]
  for (const d of digits) moves.push(["s", d, `p${d}`], [`p${d}`, digits.join(","), `p${d}`], [`p${d}`, d, "f"])
  const fa = nfa(["s", ...digits.map((d) => `p${d}`), "f"], "s", ["f"], moves, digits)
  // f must accept only at the end: drop its loop
  return { ...fa, delta: fa.delta.filter((x) => x[0] !== "f") }
}
export function notSeenBefore(digits: string[]): FA {
  const moves: [string, string, string][] = []
  for (const d of digits) {
    const others = digits.filter((x) => x !== d)
    moves.push(["s", "ε", `n${d}`], [`n${d}`, d, `f${d}`])
    if (others.length) moves.push([`n${d}`, others.join(","), `n${d}`])
  }
  return nfa(["s", ...digits.flatMap((d) => [`n${d}`, `f${d}`])], "s", digits.map((d) => `f${d}`), moves, digits)
}
export const b15seen = seenBefore(D)
export const b15notSeen = notSeenBefore(D)
export const b15gap0 = nfa(
  ["s", "g0", "g1", "g2", "g3", "f"],
  "s",
  ["f"],
  [
    ["s", "0,1", "s"],
    ["s", "0", "g0"],
    ["g0", "0", "f"],
    ["g0", "0,1", "g1"],
    ["g1", "0,1", "g2"],
    ["g2", "0,1", "g3"],
    ["g3", "0,1", "g0"],
    ["f", "0,1", "f"],
  ],
  B,
)
const gapMultiple = (w: string, offset: number) => {
  for (let i = 0; i < w.length; i++) for (let j = i + 1 + offset; j < w.length; j += 4) if (w[i] === "0" && w[j] === "0") return true
  return false
}

/* ───── Q3(b) ───── */

export const b15re3b = { i: "(ε+1)(01)*(ε+0)", ii: "(a+b+c)*a(a+b+c)*b(a+b+c)*+(a+b+c)*b(a+b+c)*a(a+b+c)*", iii: "(10+0)*(ε+1)(01+1)*(ε+0)" }

/* ───── Q5 ───── */

export const b15odd = grammar("S -> AAS | A\nA -> 0 | 1")
export const b15mid0 = grammar("S -> ASA | 0\nA -> 0 | 1")

/* ───── Q5(b): increment #N ───── */

export const b15inc = tm(
  ["q0", "q1", "q2", "qf"],
  "q0",
  ["qf"],
  [
    ["q0", "#", "q1", "#", "R"],
    ["q1", "0", "q1", "0", "R"],
    ["q1", "1", "q1", "1", "R"],
    ["q1", "B", "q2", "B", "L"],
    ["q2", "1", "q2", "0", "L"], // 1 + carry = 0, carry on
    ["q2", "0", "qf", "1", "L"], // 0 + carry = 1, done
    ["q2", "#", "qf", "1", "L"], // carry out of the top bit: # becomes the new leading 1
  ],
  ["#", "0", "1"],
  ["#", "0", "1", "B"],
)
const incOut = (w: string) => {
  const n = w.slice(1)
  const k = n.lastIndexOf("0")
  return k < 0 ? "1" + "0".repeat(n.length) : "#" + n.slice(0, k) + "1" + "0".repeat(n.length - k - 1)
}

/* ───── Q6(a): 0^n 1^m, n ≤ m ≤ 2n ───── */

export const b15pda6a = pda(
  ["qs", "q0", "qx", "q1", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "q0", "Z"],
    ["q0", "0", "ε", "q0", "X"], // this 0 will match one 1
    ["q0", "0", "ε", "qx", "X"], // ... or two 1s
    ["qx", "ε", "ε", "q0", "X"],
    ["q0", "ε", "ε", "q1", "ε"],
    ["q1", "1", "X", "q1", "ε"],
    ["q1", "ε", "Z", "qacc", "ε"],
  ],
  B,
  ["X", "Z"],
)

/* ───── Q6(b): CNF ───── */

export const b15g6b = grammar("A -> BAB | B | ε\nB -> 00 | ε")
/** HMU style: a CNF grammar for L − {ε}; ε ∈ L is stated separately. */
export const b15g6bEps = removeEpsilon(b15g6b, false)
export const b15g6bUnit = removeUnit(b15g6bEps.grammar)
export const b15g6bUseless = removeUseless(b15g6bUnit.grammar)
export const b15g6bCnf = cnfFinish(b15g6bUseless.grammar, () => "Z")

/* ───── Q6(c): TM deciding equal 0s and 1s ───── */

type Move = TM["delta"][number]
const eqMoves: Move[] = [
  ["q0", "X", "q0", "X", "R"],
  ["q0", "B", "qa", "B", "R"], // everything crossed off: accept
  ["q0", "0", "q1", "X", "R"], // cross off a 0, look for a 1
  ["q0", "1", "q2", "X", "R"], // cross off a 1, look for a 0
  ["q1", "0", "q1", "0", "R"],
  ["q1", "X", "q1", "X", "R"],
  ["q1", "1", "q3", "X", "L"],
  ["q2", "1", "q2", "1", "R"],
  ["q2", "X", "q2", "X", "R"],
  ["q2", "0", "q3", "X", "L"],
  ["q3", "0", "q3", "0", "L"],
  ["q3", "1", "q3", "1", "L"],
  ["q3", "X", "q3", "X", "L"],
  ["q3", "B", "q0", "B", "R"], // back at the left end
]
export const b15tmEq = tm(["q0", "q1", "q2", "q3", "qa"], "q0", ["qa"], eqMoves, B, ["0", "1", "X", "B"])

/* ───── Q7(b): w w^R (Sipser form) ───── */

export const b15wwr = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "$"],
    ["qp", "0", "ε", "qp", "0"],
    ["qp", "1", "ε", "qp", "1"],
    ["qp", "ε", "ε", "qm", "ε"], // guess the middle
    ["qm", "0", "0", "qm", "ε"],
    ["qm", "1", "1", "qm", "ε"],
    ["qm", "ε", "$", "qacc", "ε"],
  ],
  B,
  ["0", "1", "$"],
)

/* ───── Q8(b), Q8(c) ───── */

export const b15pal4 = grammar("S -> 0A0 | 1A1 | ε\nA -> 0S0 | 1S1")
export const b15tree = grammar("E -> E+T | T\nT -> T*F | F\nF -> a")

const isPal = (w: string) => w === [...w].reverse().join("")
const blocks01 = (w: string) => w.match(/^(0*)(1*)$/)

export const b15Checks: Check[] = [
  { id: "b15-2a", machine: b15q2a, dfa: true, alphabet: ["a", "b", "1", "2"], maxLen: 6, inL: q2aOk, extra: ["aab12a1", "aab1bbaaba2a1", "aaba", "121", "aaab12a1", "aab11bbaaba2a1", "aaaba", "1121"] },
  { id: "b15-2b", machine: b15q2bSubset.dfa, dfa: true, alphabet: B, maxLen: 9, inL: (w) => faAccepts(b15q2b, w) },
  { id: "b15-3a-i", machine: b15seen, alphabet: D, maxLen: 6, inL: (w) => w.length >= 2 && w.slice(0, -1).includes(w.at(-1)!) },
  { id: "b15-3a-ii", machine: b15notSeen, alphabet: D, maxLen: 6, inL: (w) => w.length >= 1 && !w.slice(0, -1).includes(w.at(-1)!) },
  { id: "b15-3a-iii", machine: b15gap0, alphabet: B, maxLen: 11, inL: (w) => gapMultiple(w, 0), extra: ["00"] },
  { id: "b15-3b-i", regex: b15re3b.i, alphabet: B, maxLen: 10, inL: (w) => !w.includes("00") && !w.includes("11") },
  { id: "b15-3b-ii", regex: b15re3b.ii, alphabet: ["a", "b", "c"], maxLen: 6, inL: (w) => w.includes("a") && w.includes("b") },
  { id: "b15-3b-iii", regex: b15re3b.iii, alphabet: B, maxLen: 11, inL: (w) => !w.includes("11") || !w.slice(w.indexOf("11")).includes("00") },
  { id: "b15-5a-i", grammar: b15odd, alphabet: B, maxLen: 9, inL: (w) => w.length % 2 === 1 },
  { id: "b15-5a-iii", grammar: b15mid0, alphabet: B, maxLen: 9, inL: (w) => w.length % 2 === 1 && w[(w.length - 1) / 2] === "0" },
  { id: "b15-5b", machine: b15inc, alphabet: ["#", "0", "1"], maxLen: 9, inL: (w) => /^#[01]+$/.test(w), output: incOut },
  { id: "b15-6a", machine: b15pda6a, alphabet: B, maxLen: 12, inL: (w) => { const m = blocks01(w); return !!m && m[1].length <= m[2].length && m[2].length <= 2 * m[1].length } },
  { id: "b15-6b-cnf", grammar: b15g6bCnf.grammar, cnf: true, alphabet: ["0"], maxLen: 12, inL: (w) => w.length > 0 && w.length % 2 === 0 },
  { id: "b15-6b-original", grammar: b15g6b, alphabet: ["0"], maxLen: 12, inL: (w) => w.length % 2 === 0 },
  { id: "b15-6c", machine: b15tmEq, alphabet: B, maxLen: 9, inL: (w) => count(w, "0") === count(w, "1") },
  { id: "b15-7b", machine: b15wwr, alphabet: B, maxLen: 10, inL: (w) => w.length % 2 === 0 && isPal(w) },
  { id: "b15-8b", grammar: b15pal4, alphabet: B, maxLen: 12, inL: (w) => w.length % 4 === 0 && isPal(w) },
]
export const b15Facts: Fact[] = [
  {
    id: "b15-3a-iii-examples",
    claim: "10111010 and 01010111011 fit only the 'index distance' reading",
    problem: () => (!gapMultiple("10111010", 0) && gapMultiple("10111010", 3) && !gapMultiple("01010111011", 0) && gapMultiple("01010111011", 3) ? null : "examples behave differently"),
  },
]

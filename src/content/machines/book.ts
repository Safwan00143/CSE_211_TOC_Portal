/* Machines for the textbook problems (Sipser, HMU), each tested against its language. */
import { allStrings, cfgGenerates, grammar, pdaAccepts, productDfa, regexMatcher, reverseNfa, starNfa, swapAccept, unionNfa, type FA, type PdaHmu, type TM } from "@/lib/automata"
import { cnfFinish, removeUseless } from "@/lib/cnf"
import { ithString, pcpSolves } from "@/lib/encoding"
import { cfgToPda, pdaToCfg } from "@/lib/pda-hmu"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { hmuPda } from "./notes-pda-hmu"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const AB = ["a", "b"]
const B01 = ["0", "1"]
const isPal = (w: string) => w === [...w].reverse().join("")
const blocks = (w: string, re: RegExp) => w.match(re)

/* ───── DFAs ───── */

/** Sipser 1.4(c): even number of a's AND one or two b's, by the product construction. */
export const s14cEven = dfa("e", ["e"], { e: { a: "o", b: "e" }, o: { a: "e", b: "o" } })
export const s14cBs = dfa("b0", ["b1", "b2"], { b0: { a: "b0", b: "b1" }, b1: { a: "b1", b: "b2" }, b2: { a: "b2", b: "b3" }, b3: { a: "b3", b: "b3" } })
export const s14c = productDfa(s14cEven, s14cBs, "and")

/** Sipser 1.5(b): no substring baba = complement of "contains baba". */
export const s15bContains = dfa("q0", ["q4"], {
  q0: { a: "q0", b: "q1" },
  q1: { a: "q2", b: "q1" },
  q2: { a: "q0", b: "q3" },
  q3: { a: "q4", b: "q1" },
  q4: { a: "q4", b: "q4" },
})
export const s15b = swapAccept(s15bContains)

/** Sipser 1.6(c): contains 0101. State = longest suffix that is a prefix of 0101. */
export const s16c = dfa("e", ["f"], {
  e: { 0: "p0", 1: "e" },
  p0: { 0: "p0", 1: "p01" },
  p01: { 0: "p010", 1: "e" },
  p010: { 0: "p0", 1: "f" },
  f: { 0: "f", 1: "f" },
})

/** Sipser 1.6(i): every odd position is a 1. */
export const s16i = dfa("odd", ["odd", "even"], { odd: { 0: "d", 1: "even" }, even: { 0: "odd", 1: "odd" }, d: { 0: "d", 1: "d" } })

/**
 * Sipser 1.13: no two 1s separated by an odd number of symbols. Two 1s at positions i < j are
 * separated by j − i − 1 symbols, which is odd iff i and j have the same parity. State XY:
 * X = a 1 has been seen at a position of the same parity as the next position, Y = of the other parity.
 */
export const s113 = dfa("00", ["00", "01", "10", "11"], {
  "00": { 0: "00", 1: "01" },
  "01": { 0: "10", 1: "11" },
  "10": { 0: "01", 1: "d" },
  "11": { 0: "11", 1: "d" },
  d: { 0: "d", 1: "d" },
})
const s113In = (w: string) => {
  for (let i = 0; i < w.length; i++) for (let j = i + 2; j < w.length; j += 2) if (w[i] === "1" && w[j] === "1") return false
  return true
}

/* ───── NFAs and closure ───── */

export const s17a = nfa(["q0", "q1", "q2"], "q0", ["q2"], [["q0", "0,1", "q0"], ["q0", "0", "q1"], ["q1", "0", "q2"]], B01)
export const s17e = nfa(["q1", "q2", "q3"], "q1", ["q3"], [["q1", "0", "q1"], ["q1", "ε", "q2"], ["q2", "1", "q2"], ["q2", "0", "q3"], ["q3", "0", "q3"]], B01)
export const s17f = nfa(["q1", "q2", "q3"], "q1", ["q1"], [["q1", "1", "q1"], ["q1", "0", "q2"], ["q2", "0", "q3"], ["q3", "1", "q1"]], B01)

/** Sipser 1.6(a) and 1.6(b) as DFAs, for the union (1.8a) and star (1.10a) constructions. */
export const s16a = dfa("s", ["z"], { s: { 0: "d", 1: "o" }, o: { 0: "z", 1: "o" }, z: { 0: "z", 1: "o" }, d: { 0: "d", 1: "d" } })
export const s16b = dfa("c0", ["c3"], { c0: { 0: "c0", 1: "c1" }, c1: { 0: "c1", 1: "c2" }, c2: { 0: "c2", 1: "c3" }, c3: { 0: "c3", 1: "c3" } })
const renamed = (m: FA, tag: string): FA => ({
  ...m,
  states: m.states.map((q) => q + tag),
  start: m.start + tag,
  accept: m.accept.map((q) => q + tag),
  delta: m.delta.map(([p, a, q]) => [p + tag, a, q + tag]),
})
export const s18a = unionNfa(renamed(s16a, "'"), renamed(s16b, "''"), "q0")
export const s110a = starNfa(s16b, "q0")
export const s131 = reverseNfa(s16c, "r")

/* ───── Regular expressions ───── */

export const s118 = { c: "(0∪1)*0101(0∪1)*", i: "(1(0∪1))*(ε∪1)" }
export const s120 = { a: "a*b*", b: "a(ba)*b", f: "aba∪bab", h: "(a∪ba∪bb)(a∪b)*" }
export const s120Samples: Record<keyof typeof s120, [string[], string[]]> = {
  a: [["ab", "aab"], ["ba", "aba"]],
  b: [["ab", "abab"], ["a", "ba"]],
  f: [["aba", "bab"], ["a", "ab"]],
  h: [["a", "bab"], ["b", "ε"]],
}
/** Sipser 1.22: /# comment #/ over {a, b, /, #}. */
export const s122 = dfa("s0", ["s4"], {
  s0: { "/": "s1", "#": "d", a: "d", b: "d" },
  s1: { "#": "s2", "/": "d", a: "d", b: "d" },
  s2: { a: "s2", b: "s2", "/": "s2", "#": "s3" },
  s3: { "#": "s3", "/": "s4", a: "s2", b: "s2" },
  s4: { a: "d", b: "d", "/": "d", "#": "d" },
  d: { a: "d", b: "d", "/": "d", "#": "d" },
})
export const s122Regex = "/#(a∪b∪/∪#⁺(a∪b))*#⁺/"
const commentOk = (w: string) => w.length >= 4 && w.startsWith("/#") && w.endsWith("#/") && !w.slice(2, -2).includes("#/") && !w.slice(2, -1).includes("#/")

/* ───── CFGs ───── */

export const s26b = grammar("S -> X | Z | D\nX -> aXb | aY\nY -> aY | ε\nZ -> aZb | Wb\nW -> Wb | ε\nD -> RbaR\nR -> aR | bR | ε")
export const s26d = grammar("S -> LMR\nL -> ε | X#\nR -> ε | #X\nX -> aX | bX | #X | ε\nM -> aMa | bMb | N\nN -> ε | a | b | # | #T#\nT -> aT | bT | #T | ε")
const s26dIn = (w: string) => {
  const xs = w.split("#")
  return xs.some((x) => xs.some((y) => x === [...y].reverse().join(""))) // i = j is allowed
}
export const s213 = grammar("S -> TT | U\nT -> 0T | T0 | #\nU -> 0U00 | #")
const s213In = (w: string) => /^0*#0*#0*$/.test(w) || (() => { const m = w.match(/^(0*)#(0*)$/); return !!m && m[2].length === 2 * m[1].length })()

/* ───── PDAs (Sipser form) ───── */

/** Sipser 2.7 for 2.6(b): not of the form a^n b^n. Guess: out of order, or more a's, or more b's. */
export const s27b = pda(
  ["qs", "qa", "qb", "qx", "qy", "qz", "acc"],
  "qs",
  ["qx", "qy", "acc"],
  [
    ["qs", "ε", "ε", "qa", "$"],
    ["qa", "a", "ε", "qa", "A"],
    ["qa", "ε", "ε", "qb", "ε"],
    ["qb", "b", "A", "qb", "ε"],
    ["qb", "ε", "A", "qx", "A"], // b's ran out with a's left: more a's
    ["qx", "ε", "A", "qx", "ε"],
    ["qb", "b", "$", "qy", "$"], // an extra b: more b's
    ["qy", "b", "ε", "qy", "ε"],
    ["qa", "b", "ε", "qz", "ε"], // out-of-order branch: read up to a b ...
    ["qb", "b", "ε", "qz", "ε"],
    ["qy", "b", "ε", "qz", "ε"],
    ["qz", "b", "ε", "qz", "ε"],
    ["qz", "a", "ε", "acc", "ε"], // ... then an a: "ba" appears
    ["acc", "a", "ε", "acc", "ε"],
    ["acc", "b", "ε", "acc", "ε"],
  ],
  AB,
  ["A", "$"],
)
/** Sipser 2.12: the grammar of Exercise 2.3 as a PDA (HMU's one-state form is what is run). */
export const s23 = grammar("R -> XRX | S\nS -> aTb | bTa\nT -> XTX | X | ε\nX -> a | b")
export const s212 = cfgToPda(s23)

/* ───── CNF / CYK (HMU) ───── */

export const h711 = grammar("S -> AB | CA\nA -> a\nB -> BC | AB\nC -> aB | b")
export const h711Clean = removeUseless(h711)
export const h734 = grammar("S -> AB | BC\nA -> BA | a\nB -> CC | b\nC -> AB | a")
export const h716 = grammar("S -> SS | (S) | ()")
export const h716Cnf = cnfFinish(h716, (t) => (t === "(" ? "L" : "R"))
const balancedNonEmpty = (w: string) => {
  let d = 0
  for (const c of w) if ((d += c === "(" ? 1 : -1) < 0) return false
  return d === 0 && w.length > 0
}

/* ───── PDAs (HMU) ───── */

export const h621b = hmuPda(
  ["q"],
  "q",
  ["q"],
  [
    ["q", "0", "Z0", "q", ["X", "Z0"]],
    ["q", "0", "X", "q", ["X", "X"]],
    ["q", "1", "X", "q", []],
  ],
  B01,
  ["X", "Z0"],
)
export const h631g = grammar("S -> 0S1 | A\nA -> 1A0 | S | ε")
export const h631 = cfgToPda(h631g)
export const h633 = hmuPda(
  ["q", "p"],
  "q",
  [],
  [
    ["q", "1", "Z0", "q", ["X", "Z0"]],
    ["q", "1", "X", "q", ["X", "X"]],
    ["q", "0", "X", "p", ["X"]],
    ["q", "ε", "X", "q", []],
    ["p", "1", "X", "p", []],
    ["p", "0", "Z0", "q", ["Z0"]],
  ],
  B01,
  ["X", "Z0"],
  "empty",
)
export const h633Cfg = pdaToCfg(h633)
/** HMU 6.4.2(a): 0^n 1^m with n ≤ m. The first 0 pushes Y, the rest push X, so popping Y says "all 0s matched". */
export const h642a = hmuPda(
  ["s", "q", "p", "f"],
  "s",
  ["s", "f"],
  [
    ["s", "0", "Z0", "q", ["Y", "Z0"]],
    ["s", "1", "Z0", "f", ["Z0"]],
    ["q", "0", "Y", "q", ["X", "Y"]],
    ["q", "0", "X", "q", ["X", "X"]],
    ["q", "1", "X", "p", []],
    ["q", "1", "Y", "f", []],
    ["p", "1", "X", "p", []],
    ["p", "1", "Y", "f", []],
    ["f", "1", "Z0", "f", ["Z0"]],
  ],
  B01,
  ["X", "Y", "Z0"],
)
/** HMU 6.4.2, the other part: 0^n 1^m with n ≥ m. Accept as long as no 1 finds the stack empty. */
export const h642b = hmuPda(
  ["s", "q", "p"],
  "s",
  ["s", "q", "p"],
  [
    ["s", "0", "Z0", "q", ["X", "Z0"]],
    ["q", "0", "X", "q", ["X", "X"]],
    ["q", "1", "X", "p", []],
    ["p", "1", "X", "p", []],
  ],
  B01,
  ["X", "Z0"],
)
/** HMU 6.3.5(a): a^n b^m c^{2(n+m)} by empty stack. Each a or b pushes XX; each c pops one X. */
export const h635a = hmuPda(
  ["q", "r", "p"],
  "q",
  [],
  [
    ...["Z0", "X"].flatMap((Y): PdaHmu["delta"] => [
      ["q", "a", Y, "q", ["X", "X", Y]],
      ["q", "b", Y, "r", ["X", "X", Y]],
      ["r", "b", Y, "r", ["X", "X", Y]],
    ]),
    ["q", "c", "X", "p", []],
    ["r", "c", "X", "p", []],
    ["p", "c", "X", "p", []],
    ["q", "ε", "Z0", "p", []],
    ["r", "ε", "Z0", "p", []],
    ["p", "ε", "Z0", "p", []],
  ],
  ["a", "b", "c"],
  ["X", "Z0"],
  "empty",
)

/* ───── Turing machines ───── */

/** HMU Fig. 8.9 (the 0^n 1^n machine). */
export const h89 = tm(
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
  ],
  B01,
  ["0", "1", "X", "Y", "B"],
)

type Move = TM["delta"][number]
/** HMU 8.2.2(c): ww^R. Erase the leftmost symbol, carry it to the rightmost symbol, compare, erase. */
const wwr: Move[] = [["q0", "B", "qa", "B", "R"]]
for (const c of B01) {
  wwr.push(["q0", c, `r${c}`, "B", "R"])
  for (const x of B01) wwr.push([`r${c}`, x, `r${c}`, x, "R"])
  wwr.push([`r${c}`, "B", `t${c}`, "B", "L"])
  wwr.push([`t${c}`, c, "back", "B", "L"]) // the last symbol matches: erase it
  for (const x of B01) wwr.push(["back", x, "back", x, "L"])
}
wwr.push(["back", "B", "q0", "B", "R"])
export const h822c = tm(["q0", "r0", "r1", "t0", "t1", "back", "qa"], "q0", ["qa"], wwr, B01, ["0", "1", "B"])

/** HMU 8.3.2: shift the input one cell right and write the marker X in the freed cell. */
const shift: Move[] = [["q0", "B", "qf", "X", "S"]]
for (const c of B01) {
  shift.push(["q0", c, `h${c}`, "X", "R"]) // write the marker, carry the old symbol
  for (const d of B01) shift.push([`h${c}`, d, `h${d}`, c, "R"]) // drop the carried symbol, pick up the next
  shift.push([`h${c}`, "B", "home", c, "L"])
  shift.push(["home", c, "home", c, "L"])
}
shift.push(["home", "X", "qf", "X", "S"])
export const h832 = tm(["q0", "h0", "h1", "home", "qf"], "q0", ["qf"], shift, B01, ["0", "1", "X", "B"])

/** HMU 8.4.2: the nondeterministic TM; all IDs reachable from q0 w, level by level. */
export const h842Moves: [string, string, string, string, "L" | "R"][] = [
  ["q0", "0", "q0", "1", "R"],
  ["q0", "1", "q1", "0", "R"],
  ["q1", "0", "q1", "0", "R"],
  ["q1", "0", "q0", "0", "L"],
  ["q1", "1", "q1", "1", "R"],
  ["q1", "1", "q0", "1", "L"],
  ["q1", "B", "q2", "B", "R"],
]
export type TmId = { left: string; q: string; right: string }
export function ntmIds(w: string, maxLevels = 8): TmId[][] {
  const levels: TmId[][] = [[{ left: "", q: "q0", right: w }]]
  const seen = new Set([`|q0|${w}`])
  for (let k = 0; k < maxLevels; k++) {
    const next: TmId[] = []
    for (const id of levels.at(-1)!) {
      const X = id.right[0] ?? "B"
      for (const [q, x, p, y, d] of h842Moves) {
        if (q !== id.q || x !== X) continue
        const rest = id.right.slice(1)
        let n: TmId
        if (d === "R") n = { left: id.left + y, q: p, right: rest }
        else n = { left: id.left.slice(0, -1), q: p, right: (id.left.at(-1) ?? "B") + y + rest }
        n = { ...n, left: n.left.replace(/^B+/, ""), right: n.right.replace(/B+$/, "") }
        const key = `${n.left}|${n.q}|${n.right}`
        if (!seen.has(key)) {
          seen.add(key)
          next.push(n)
        }
      }
    }
    if (!next.length) break
    levels.push(next)
  }
  return levels
}

/* ───── Undecidability: PCP search ───── */

/** Breadth-first search for a PCP solution of length at most maxLen, keeping only consistent prefixes. */
export function pcpSearch(A: string[], B: string[], maxLen = 12): { solution: number[] | null; exhausted: boolean } {
  let frontier: { seq: number[]; a: string; b: string }[] = [{ seq: [], a: "", b: "" }]
  for (let k = 0; k < maxLen; k++) {
    const next: typeof frontier = []
    for (const f of frontier)
      for (let i = 0; i < A.length; i++) {
        const a = f.a + A[i]
        const b = f.b + B[i]
        if (!a.startsWith(b) && !b.startsWith(a)) continue
        const seq = [...f.seq, i + 1]
        if (a === b) return { solution: seq, exhausted: false }
        next.push({ seq, a, b })
      }
    if (!next.length) return { solution: null, exhausted: true }
    frontier = next
  }
  return { solution: null, exhausted: false }
}
export const h941 = {
  a: [["01", "001", "10"], ["011", "10", "00"]],
  b: [["01", "001", "10"], ["011", "01", "00"]],
} as const

/* ───── Complexity: counting satisfying assignments ───── */

export const h1021a = (x: boolean, y: boolean, z: boolean) => x && (y || !x) && (z || !y)
export const h1021b = (x: boolean, y: boolean, z: boolean) => (x || y) && (!(x || z) || (!z && !y))
const satCount = (f: (x: boolean, y: boolean, z: boolean) => boolean) => [0, 1, 2, 3, 4, 5, 6, 7].filter((m) => f(!!(m & 4), !!(m & 2), !!(m & 1))).length

/* ───── Checks ───── */

export const bookChecks: Check[] = [
  { id: "bk-s14c", machine: s14c, dfa: true, alphabet: AB, maxLen: 9, inL: (w) => count(w, "a") % 2 === 0 && [1, 2].includes(count(w, "b")) },
  { id: "bk-s15b", machine: s15b, dfa: true, alphabet: AB, maxLen: 10, inL: (w) => !w.includes("baba") },
  { id: "bk-s16c", machine: s16c, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => w.includes("0101") },
  { id: "bk-s16i", machine: s16i, dfa: true, alphabet: B01, maxLen: 10, inL: (w) => [...w].every((c, i) => i % 2 === 1 || c === "1") },
  { id: "bk-s113", machine: s113, dfa: true, alphabet: B01, maxLen: 11, inL: s113In },
  { id: "bk-s17a", machine: s17a, alphabet: B01, maxLen: 9, inL: (w) => w.endsWith("00") },
  { id: "bk-s17e", machine: s17e, alphabet: B01, maxLen: 9, inL: (w) => /^0*1*0+$/.test(w) },
  { id: "bk-s17f", machine: s17f, alphabet: B01, maxLen: 10, inL: (w) => /^1*(001+)*$/.test(w) },
  { id: "bk-s18a", machine: s18a, alphabet: B01, maxLen: 9, inL: (w) => (w.startsWith("1") && w.endsWith("0")) || count(w, "1") >= 3 },
  { id: "bk-s110a", machine: s110a, alphabet: B01, maxLen: 9, inL: (w) => w === "" || count(w, "1") >= 3 },
  { id: "bk-s131", machine: s131, alphabet: B01, maxLen: 9, inL: (w) => w.includes("1010") },
  { id: "bk-s118c", regex: s118.c, alphabet: B01, maxLen: 10, inL: (w) => w.includes("0101") },
  { id: "bk-s118i", regex: s118.i, alphabet: B01, maxLen: 10, inL: (w) => [...w].every((c, i) => i % 2 === 1 || c === "1") },
  { id: "bk-s122", machine: s122, dfa: true, alphabet: ["a", "b", "/", "#"], maxLen: 7, inL: commentOk },
  { id: "bk-s122-regex", regex: s122Regex, alphabet: ["a", "b", "/", "#"], maxLen: 7, inL: commentOk },
  { id: "bk-s26b", grammar: s26b, alphabet: AB, maxLen: 9, inL: (w) => { const m = blocks(w, /^(a*)(b*)$/); return !m || m[1].length !== m[2].length } },
  { id: "bk-s26d", grammar: s26d, alphabet: ["a", "b", "#"], maxLen: 6, inL: s26dIn },
  { id: "bk-s213", grammar: s213, alphabet: ["0", "#"], maxLen: 9, inL: s213In },
  { id: "bk-s27b", machine: s27b, alphabet: AB, maxLen: 9, inL: (w) => { const m = blocks(w, /^(a*)(b*)$/); return !m || m[1].length !== m[2].length } },
  { id: "bk-s212", machine: s212, alphabet: AB, maxLen: 7, inL: (w) => cfgGenerates(s23, w) },
  { id: "bk-h711", grammar: h711Clean.grammar, alphabet: AB, maxLen: 8, inL: (w) => cfgGenerates(h711, w) },
  { id: "bk-h716", grammar: h716Cnf.grammar, cnf: true, alphabet: ["(", ")"], maxLen: 10, inL: balancedNonEmpty },
  { id: "bk-h621b", machine: h621b, alphabet: B01, maxLen: 10, inL: (w) => { let d = 0; for (const c of w) if ((d += c === "0" ? 1 : -1) < 0) return false; return true } },
  { id: "bk-h631", machine: h631, alphabet: B01, maxLen: 8, inL: (w) => cfgGenerates(h631g, w) },
  { id: "bk-h633", grammar: h633Cfg.trimmed, alphabet: B01, maxLen: 8, inL: (w) => pdaAccepts(h633, w) },
  { id: "bk-h642a", machine: h642a, deterministic: true, alphabet: B01, maxLen: 10, inL: (w) => { const m = blocks(w, /^(0*)(1*)$/); return !!m && m[1].length <= m[2].length } },
  { id: "bk-h642b", machine: h642b, deterministic: true, alphabet: B01, maxLen: 10, inL: (w) => { const m = blocks(w, /^(0*)(1*)$/); return !!m && m[1].length >= m[2].length } },
  { id: "bk-h635a", machine: h635a, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => { const m = blocks(w, /^(a*)(b*)(c*)$/); return !!m && m[3].length === 2 * (m[1].length + m[2].length) } },
  { id: "bk-h89", machine: h89, alphabet: B01, maxLen: 10, inL: (w) => /^0+1+$/.test(w) && count(w, "0") === count(w, "1") },
  { id: "bk-h822c", machine: h822c, alphabet: B01, maxLen: 10, inL: (w) => w.length % 2 === 0 && isPal(w) },
  { id: "bk-h832", machine: h832, alphabet: B01, maxLen: 8, inL: () => true, output: (w) => "X" + w },
]

export const bookFacts: Fact[] = [
  {
    id: "bk-s120",
    claim: "the sample members and non-members of Sipser 1.20 are correct",
    problem: () => {
      const bad = (Object.keys(s120) as (keyof typeof s120)[]).flatMap((k) => {
        const m = regexMatcher(s120[k])
        const [yes, no] = s120Samples[k]
        return [...yes.filter((w) => !m(w === "ε" ? "" : w)), ...no.filter((w) => m(w === "ε" ? "" : w))].map((w) => `${k}: ${w}`)
      })
      return bad.length ? bad.join("; ") : null
    },
  },
  { id: "bk-h911", claim: "w37 = 00101 and w100 = 100100", problem: () => (ithString(37) === "00101" && ithString(100) === "100100" ? null : `${ithString(37)}, ${ithString(100)}`) },
  {
    id: "bk-h941",
    claim: "PCP (a): every consistent sequence dies after 1,3, so no solution; (b): 1,3,2 solves it",
    problem: () => {
      const a = pcpSearch([...h941.a[0]], [...h941.a[1]])
      const b = pcpSearch([...h941.b[0]], [...h941.b[1]])
      const ok = a.exhausted && b.solution?.join() === "1,3,2" && pcpSolves([...h941.b[0]], [...h941.b[1]], [1, 3, 2])
      return ok ? null : `a: ${JSON.stringify(a)}; b: ${b.solution}`
    },
  },
  { id: "bk-h1021", claim: "(a) has 1 satisfying assignment, (b) has 2", problem: () => (satCount(h1021a) === 1 && satCount(h1021b) === 2 ? null : `${satCount(h1021a)}, ${satCount(h1021b)}`) },
  { id: "bk-s14c-size", claim: "the product DFA for Sipser 1.4(c) has 8 states", problem: () => (s14c.states.length === 8 ? null : `${s14c.states.length} states`) },
  {
    id: "bk-s213-nonregular-witness",
    claim: "L(G) ∩ 0*#0* = {0^n # 0^2n}",
    problem: () => (allStrings(["0", "#"], 8).filter((w) => /^0*#0*$/.test(w)).every((w) => cfgGenerates(s213, w) === (() => { const [x, y] = w.split("#"); return y.length === 2 * x.length })()) ? null : "mismatch"),
  },
]

export const bookPumping: PumpClaim[] = [
  { id: "bk-s129c", kind: "regular", inL: (w) => /^a*$/.test(w) && w.length > 0 && (w.length & (w.length - 1)) === 0, witness: (p) => "a".repeat(2 ** p), i: () => 2, ps: [1, 2, 3, 4, 5] },
  { id: "bk-s213", kind: "regular", inL: (w) => { const m = w.match(/^(0*)#(0*)$/); return !!m && m[2].length === 2 * m[1].length }, witness: (p) => "0".repeat(p) + "#" + "0".repeat(2 * p), i: () => 0 },
  {
    id: "bk-s230c",
    kind: "cfl",
    inL: (w) => { const m = w.match(/^([ab]*)#([ab]*)$/); return !!m && m[2].includes(m[1]) },
    witness: (p) => "a".repeat(p) + "b".repeat(p) + "#" + "a".repeat(p) + "b".repeat(p),
    i: () => [0, 2],
    ps: [1, 2],
  },
  {
    id: "bk-s231",
    kind: "cfl",
    inL: (w) => isPal(w) && count(w, "0") === count(w, "1"),
    witness: (p) => "0".repeat(p) + "1".repeat(2 * p) + "0".repeat(p),
    i: () => [0, 2],
    ps: [1, 2],
  },
  {
    id: "bk-s232",
    kind: "cfl",
    inL: (w) => count(w, "1") === count(w, "2") && count(w, "3") === count(w, "4"),
    witness: (p) => "1".repeat(p) + "3".repeat(p) + "2".repeat(p) + "4".repeat(p),
    i: () => [0, 2],
    ps: [1, 2],
  },
]

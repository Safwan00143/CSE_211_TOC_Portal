/* Machines in the 14-batch (2015-2016) solutions, each tested against its language. */
import { cfgGenerates, grammar, type PdaHmu, type TM } from "@/lib/automata"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { hmuPda } from "./notes-pda-hmu"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const B = ["0", "1"]
const AB = ["a", "b"]
const isPal = (w: string) => w === [...w].reverse().join("")

/* ───── Q1: the FSM F1 (partial DFA) and its variant F2 ───── */

const f1Moves: [string, string, string][] = [["a", "0", "b"], ["b", "0", "b"], ["b", "1", "c"], ["a", "1", "d"], ["d", "0", "e"]]
export const b14f1 = nfa(["a", "b", "c", "d", "e"], "a", ["c", "e"], f1Moves, B)
export const b14f2 = nfa(["a", "b", "c", "d", "e"], "a", ["c", "e"], [...f1Moves, ["d", "1", "d"]], B)

/* ───── Q2(a): binary numbers not divisible by 3 ───── */

export const b14not3 = dfa("r0", ["r1", "r2"], { r0: { 0: "r0", 1: "r1" }, r1: { 0: "r2", 1: "r0" }, r2: { 0: "r1", 1: "r2" } })

/* ───── Q3(a): five DFAs and regular expressions ───── */

export const b14q3i = dfa("s", ["z"], { s: { 0: "d", 1: "o" }, o: { 0: "z", 1: "o" }, z: { 0: "z", 1: "o" }, d: { 0: "d", 1: "d" } })
export const b14q3ii = dfa("s", ["f"], { s: { 0: "t1", 1: "t1" }, t1: { 0: "t2", 1: "t2" }, t2: { 0: "f", 1: "d" }, f: { 0: "f", 1: "f" }, d: { 0: "d", 1: "d" } })
const t3: Record<string, Record<string, string>> = {}
for (const p of ["E", "O"]) for (let k = 0; k <= 3; k++) t3[`${p}${k}`] = { 0: `${p === "E" ? "O" : "E"}${k}`, 1: `${p}${Math.min(k + 1, 3)}` }
export const b14q3iii = dfa("E0", ["E0", "E1", "E2", "E3", "O2"], t3)
export const b14q3iv = dfa("s", ["s", "o1", "all"], {
  s: { 0: "all", 1: "o1" },
  o1: { 0: "all", 1: "o2" },
  o2: { 0: "all", 1: "o3" },
  o3: { 0: "all", 1: "all" },
  all: { 0: "all", 1: "all" },
})
const t5: Record<string, Record<string, string>> = { d: { 0: "d", 1: "d" } }
for (let z = 0; z <= 2; z++) for (let o = 0; o <= 1; o++) t5[`z${z}o${o}`] = { 0: `z${Math.min(z + 1, 2)}o${o}`, 1: o ? "d" : `z${z}o1` }
export const b14q3v = dfa("z0o0", ["z2o0", "z2o1"], t5)
export const b14re3a = {
  i: "1(0+1)*0",
  ii: "(0+1)(0+1)0(0+1)*",
  iii: "(1*01*0)*1*+0*10*10*",
  iv: "ε+1+0(0+1)*+10(0+1)*+110(0+1)*+111(0+1)(0+1)*",
  v: "000*+000*10*+0100*+1000*",
}
const q3 = {
  i: (w: string) => w.startsWith("1") && w.endsWith("0"),
  ii: (w: string) => w.length >= 3 && w[2] === "0",
  iii: (w: string) => count(w, "0") % 2 === 0 || count(w, "1") === 2,
  iv: (w: string) => w !== "11" && w !== "111",
  v: (w: string) => count(w, "0") >= 2 && count(w, "1") <= 1,
}

/* ───── Q4 ───── */

export const b14g4 = grammar("R -> XRX | S\nS -> aTb | bTa\nT -> XTX | X | ε\nX -> a | b")
export const b14more0 = grammar("S -> T0T\nT -> TT | 0T1 | 1T0 | 0 | ε")
export const b14wx = grammar("S -> RA\nR -> 0R0 | 1R1 | #A\nA -> 0A | 1A | ε")

/* ───── Q5: the given PDA (HMU form, final state p) ───── */

export const b14pda5 = hmuPda(
  ["q", "p"],
  "q",
  ["p"],
  [
    ["q", "0", "Z0", "q", ["X", "Z0"]],
    ["q", "0", "X", "q", ["X", "X"]],
    ["q", "1", "X", "q", ["X"]],
    ["q", "ε", "X", "p", []],
    ["p", "ε", "X", "p", []],
    ["p", "1", "X", "p", ["X", "X"]],
    ["p", "1", "Z0", "p", []],
  ],
  B,
  ["X", "Z0"],
)
export type Id = { q: string; rest: string; stack: string[] }
/** Every ID reachable from (start, w, Z0), level by level (stack top first). */
export function reachableIds(m: PdaHmu, w: string): Id[][] {
  const levels: Id[][] = [[{ q: m.start, rest: w, stack: [m.startStack] }]]
  const seen = new Set([JSON.stringify(levels[0][0])])
  for (;;) {
    const next: Id[] = []
    for (const id of levels.at(-1)!) {
      const top = id.stack[0]
      for (const [q, a, X, p, push] of m.delta) {
        if (q !== id.q || X !== top) continue
        if (a !== "ε" && id.rest[0] !== a) continue
        const n: Id = { q: p, rest: a === "ε" ? id.rest : id.rest.slice(1), stack: [...push, ...id.stack.slice(1)] }
        const k = JSON.stringify(n)
        if (!seen.has(k)) {
          seen.add(k)
          next.push(n)
        }
      }
    }
    if (!next.length) return levels
    levels.push(next)
  }
}

/* ───── Q7(a): TM for a^n b^n c^n, n ≥ 1 ───── */

type Move = TM["delta"][number]
const abcMoves: Move[] = [
  ["q0", "a", "q1", "X", "R"], // cross off an a
  ["q1", "a", "q1", "a", "R"],
  ["q1", "Y", "q1", "Y", "R"],
  ["q1", "b", "q2", "Y", "R"], // cross off a b
  ["q2", "b", "q2", "b", "R"],
  ["q2", "Z", "q2", "Z", "R"],
  ["q2", "c", "q3", "Z", "L"], // cross off a c
  ["q3", "a", "q3", "a", "L"],
  ["q3", "b", "q3", "b", "L"],
  ["q3", "Y", "q3", "Y", "L"],
  ["q3", "Z", "q3", "Z", "L"],
  ["q3", "X", "q0", "X", "R"], // back to the first uncrossed a
  ["q0", "Y", "q4", "Y", "R"], // no a's left: check nothing else is left
  ["q4", "Y", "q4", "Y", "R"],
  ["q4", "Z", "q4", "Z", "R"],
  ["q4", "B", "qa", "B", "R"],
]
export const b14tmAbc = tm(["q0", "q1", "q2", "q3", "q4", "qa"], "q0", ["qa"], abcMoves, ["a", "b", "c"], ["a", "b", "c", "X", "Y", "Z", "B"])

/* ───── Q8(a): a ∸ b = max(b − a, 0), input 1^a 0 1^b ───── */

const monus: Move[] = [
  ["q0", "1", "q1", "B", "R"], // remove one 1 of a
  ["q0", "0", "qf", "B", "R"], // a used up: what is left of b is the answer
  ["q1", "1", "q1", "1", "R"],
  ["q1", "0", "q1", "0", "R"],
  ["q1", "B", "q2", "B", "L"],
  ["q2", "1", "q3", "B", "L"], // remove one 1 of b
  ["q2", "0", "q4", "B", "L"], // b used up first: erase the rest
  ["q3", "1", "q3", "1", "L"],
  ["q3", "0", "q3", "0", "L"],
  ["q3", "B", "q0", "B", "R"],
  ["q4", "1", "q4", "B", "L"],
  ["q4", "B", "qf", "B", "R"],
]
export const b14tmMonus = tm(["q0", "q1", "q2", "q3", "q4", "qf"], "q0", ["qf"], monus, B, ["0", "1", "B"])

export const b14Checks: Check[] = [
  { id: "b14-1b", machine: b14f1, alphabet: B, maxLen: 9, inL: (w) => /^0+1$/.test(w) || w === "10" },
  { id: "b14-1c", machine: b14f2, alphabet: B, maxLen: 9, inL: (w) => /^0+1$/.test(w) || /^1+0$/.test(w) },
  { id: "b14-2a", machine: b14not3, dfa: true, alphabet: B, maxLen: 11, inL: (w) => w.length > 0 && parseInt(w, 2) % 3 !== 0 },
  { id: "b14-3a-i", machine: b14q3i, dfa: true, alphabet: B, maxLen: 10, inL: q3.i },
  { id: "b14-3a-ii", machine: b14q3ii, dfa: true, alphabet: B, maxLen: 10, inL: q3.ii },
  { id: "b14-3a-iii", machine: b14q3iii, dfa: true, alphabet: B, maxLen: 10, inL: q3.iii },
  { id: "b14-3a-iv", machine: b14q3iv, dfa: true, alphabet: B, maxLen: 10, inL: q3.iv },
  { id: "b14-3a-v", machine: b14q3v, dfa: true, alphabet: B, maxLen: 10, inL: q3.v },
  ...(Object.keys(q3) as (keyof typeof q3)[]).map((k): Check => ({ id: `b14-3a-${k}-re`, regex: b14re3a[k], alphabet: B, maxLen: 10, inL: q3[k] })),
  { id: "b14-4a", grammar: b14g4, alphabet: AB, maxLen: 9, inL: (w) => !isPal(w) },
  { id: "b14-4b-iii", grammar: b14more0, alphabet: B, maxLen: 9, inL: (w) => count(w, "0") > count(w, "1") },
  {
    id: "b14-4b-iv",
    grammar: b14wx,
    alphabet: ["0", "1", "#"],
    maxLen: 8,
    inL: (w) => { const m = w.match(/^([01]*)#([01]*)$/); return !!m && m[2].includes([...m[1]].reverse().join("")) },
  },
  { id: "b14-7a", machine: b14tmAbc, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => /^a+b+c+$/.test(w) && count(w, "a") === count(w, "b") && count(w, "b") === count(w, "c") },
  {
    id: "b14-8a",
    machine: b14tmMonus,
    alphabet: B,
    maxLen: 9,
    inL: (w) => /^1*01*$/.test(w),
    output: (w) => { const [a, b] = w.split("0").map((s) => s.length); return "1".repeat(Math.max(b - a, 0)) },
  },
]

/** S1–S9 in Q4(a)(vii), recomputed: "one step" uses a single rule, "*" uses any number. */
const oneStep = (from: string, to: string) => b14g4.rules[from]?.some((body) => body.join("") === to) ?? false
export const b14statements: [string, boolean][] = [
  ["S1: T ⇒ aba", oneStep("T", "aba")],
  ["S2: T ⇒* aba", cfgGenerates({ ...b14g4, start: "T" }, "aba")],
  ["S3: T ⇒ T", oneStep("T", "T")],
  ["S6: X ⇒* aba", cfgGenerates({ ...b14g4, start: "X" }, "aba")],
  ["S9: S ⇒* ε", cfgGenerates({ ...b14g4, start: "S" }, "")],
]

export const b14Facts: Fact[] = [
  {
    id: "b14-4a-vii",
    claim: "S1 false, S2 true, S3 false, S6 false, S9 false",
    problem: () => (b14statements.map(([, v]) => v).join() === "false,true,false,false,false" ? null : b14statements.map(([s, v]) => `${s}: ${v}`).join("; ")),
  },
  {
    id: "b14-5b",
    claim: "of 0011, 0101, 1010 the PDA accepts 0011 and 0101 only",
    problem: () => {
      const acc = (w: string) => reachableIds(b14pda5, w).flat().some((id) => id.rest === "" && id.q === "p")
      return [acc("0011"), acc("0101"), acc("1010")].join() === "true,true,false" ? null : `got ${[acc("0011"), acc("0101"), acc("1010")]}`
    },
  },
]

const blk = (w: string, re: RegExp) => w.match(re)
export const b14Pumping: PumpClaim[] = [
  {
    id: "b14-4c-A",
    kind: "regular",
    inL: (w) => { const m = blk(w, /^(0*)(1*)(2*)$/); return !!m && m[1].length === m[2].length && m[2].length === m[3].length },
    witness: (p) => "0".repeat(p) + "1".repeat(p) + "2".repeat(p),
    i: () => 0,
    ps: [1, 2, 3, 4],
  },
  {
    id: "b14-4c-B",
    kind: "regular",
    inL: (w) => { const m = blk(w, /^(0*)(1*)$/); return !!m && m[1].length > m[2].length },
    witness: (p) => "0".repeat(p + 1) + "1".repeat(p),
    i: () => 0,
  },
]

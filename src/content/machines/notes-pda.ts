/* Sipser-style PDAs in the PDA-design note (Hakim Sir, Lecture 8), each tested against its language. */
import type { PdaSipser } from "@/lib/automata"
import type { Check } from "./types"

type Move = [string, string, string, string, string]

/** PDA from moves "from, read, pop → to, push"; "a,b" in the read slot means one move per symbol. */
export function pda(states: string[], start: string, accept: string[], moves: Move[], alphabet: string[], stack: string[]): PdaSipser {
  return {
    kind: "pda-sipser",
    states,
    alphabet,
    stack,
    start,
    accept,
    delta: moves.flatMap(([f, a, pop, t, push]) => a.split(",").map((x) => [f, x.trim(), pop, t, push] as Move)),
  }
}

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}
const rev = (w: string) => [...w].reverse().join("")

/** Exactly as drawn on the slide: no bottom marker. It accepts too much (see the check below). */
export const pdaSlide0n1n = pda(
  ["qpush", "qpop", "qacc"],
  "qpush",
  ["qacc"],
  [
    ["qpush", "0", "ε", "qpush", "0"],
    ["qpush", "1", "0", "qpop", "ε"],
    ["qpop", "1", "0", "qpop", "ε"],
    ["qpop", "ε", "ε", "qacc", "ε"],
    ["qpush", "ε", "ε", "qacc", "ε"],
  ],
  ["0", "1"],
  ["0"],
)

/** Corrected with a bottom marker $ (Sipser, Example 2.14). */
export const pda0n1n = pda(
  ["q1", "q2", "q3", "q4"],
  "q1",
  ["q1", "q4"],
  [
    ["q1", "ε", "ε", "q2", "$"],
    ["q2", "0", "ε", "q2", "0"],
    ["q2", "1", "0", "q3", "ε"],
    ["q3", "1", "0", "q3", "ε"],
    ["q3", "ε", "$", "q4", "ε"],
  ],
  ["0", "1"],
  ["0", "$"],
)

/** Example 1: a^n b^{2n}. Every second b pops one X. */
export const pdaAnB2n = pda(
  ["qs", "qa", "qb1", "qb0", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "X"],
    ["qa", "b", "ε", "qb1", "ε"],
    ["qb1", "b", "X", "qb0", "ε"],
    ["qb0", "b", "ε", "qb1", "ε"],
    ["qb0", "ε", "Z", "qacc", "ε"],
    ["qa", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b"],
  ["X", "Z"],
)

/** Example 2: a^i b^j with i ≤ j. Each b first cancels an a; once Z shows, extra b's are free. */
export const pdaILeJ = pda(
  ["qs", "qa", "qb", "qx", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "X"],
    ["qa", "ε", "ε", "qb", "ε"],
    ["qb", "b", "X", "qb", "ε"],
    ["qb", "ε", "Z", "qx", "Z"],
    ["qx", "b", "ε", "qx", "ε"],
    ["qx", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b"],
  ["X", "Z"],
)

/** Example 3: a^i b^j c^k with i = k. b's never touch the stack. */
export const pdaIEqK = pda(
  ["qs", "qa", "qb", "qc", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "X"],
    ["qa", "ε", "ε", "qb", "ε"],
    ["qb", "b", "ε", "qb", "ε"],
    ["qb", "ε", "ε", "qc", "ε"],
    ["qc", "c", "X", "qc", "ε"],
    ["qc", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["X", "Z"],
)

/** Example 4: w#w^R. */
export const pdaWHashWr = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "Z"],
    ["qp", "0", "ε", "qp", "0"],
    ["qp", "1", "ε", "qp", "1"],
    ["qp", "#", "ε", "qm", "ε"],
    ["qm", "0", "0", "qm", "ε"],
    ["qm", "1", "1", "qm", "ε"],
    ["qm", "ε", "Z", "qacc", "ε"],
  ],
  ["0", "1", "#"],
  ["0", "1", "Z"],
)

/** Example 5: all palindromes. The middle is guessed: ε for even length, one skipped symbol for odd. */
export const pdaPal = pda(
  ["qs", "qp", "qm", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qp", "Z"],
    ["qp", "0", "ε", "qp", "0"],
    ["qp", "1", "ε", "qp", "1"],
    ["qp", "ε,0,1", "ε", "qm", "ε"],
    ["qm", "0", "0", "qm", "ε"],
    ["qm", "1", "1", "qm", "ε"],
    ["qm", "ε", "Z", "qacc", "ε"],
  ],
  ["0", "1"],
  ["0", "1", "Z"],
)

/** Example 6: balanced parentheses. */
export const pdaBalanced = pda(
  ["qs", "q", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "q", "Z"],
    ["q", "(", "ε", "q", "X"],
    ["q", ")", "X", "q", "ε"],
    ["q", "ε", "Z", "qacc", "ε"],
  ],
  ["(", ")"],
  ["X", "Z"],
)

/** Example 7: equal numbers of 0's and 1's. In q0 the X's are extra 0's, in q1 extra 1's. */
export const pdaEqual = pda(
  ["qs", "qe", "q0", "c0", "q1", "c1", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qe", "Z"],
    ["qe", "0", "ε", "q0", "X"],
    ["qe", "1", "ε", "q1", "X"],
    ["qe", "ε", "Z", "qacc", "ε"],
    ["q0", "0", "ε", "q0", "X"],
    ["q0", "1", "X", "c0", "ε"],
    ["c0", "ε", "X", "q0", "X"],
    ["c0", "ε", "Z", "qe", "Z"],
    ["q1", "1", "ε", "q1", "X"],
    ["q1", "0", "X", "c1", "ε"],
    ["c1", "ε", "X", "q1", "X"],
    ["c1", "ε", "Z", "qe", "Z"],
  ],
  ["0", "1"],
  ["X", "Z"],
)

/** Example 8: a^i b^j c^k with i = j or j = k; nondeterminism picks the branch. */
export const pdaIJorJK = pda(
  ["qs", "q", "pa", "pb", "pc", "ra", "rb", "rc", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "q", "Z"],
    ["q", "ε", "ε", "pa", "ε"],
    ["pa", "a", "ε", "pa", "X"],
    ["pa", "ε", "ε", "pb", "ε"],
    ["pb", "b", "X", "pb", "ε"],
    ["pb", "ε", "Z", "pc", "Z"],
    ["pc", "c", "ε", "pc", "ε"],
    ["pc", "ε", "Z", "qacc", "ε"],
    ["q", "ε", "ε", "ra", "ε"],
    ["ra", "a", "ε", "ra", "ε"],
    ["ra", "ε", "ε", "rb", "ε"],
    ["rb", "b", "ε", "rb", "Y"],
    ["rb", "ε", "ε", "rc", "ε"],
    ["rc", "c", "Y", "rc", "ε"],
    ["rc", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["X", "Y", "Z"],
)

/** Example 9: a^n b^m c^m d^n, nested matches. */
export const pdaNested = pda(
  ["qs", "qa", "qb", "qc", "qd", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "A"],
    ["qa", "ε", "ε", "qb", "ε"],
    ["qb", "b", "ε", "qb", "B"],
    ["qb", "ε", "ε", "qc", "ε"],
    ["qc", "c", "B", "qc", "ε"],
    ["qc", "ε", "ε", "qd", "ε"],
    ["qd", "d", "A", "qd", "ε"],
    ["qd", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c", "d"],
  ["A", "B", "Z"],
)

/** Example 10: a^i b^j c^{i+j}. */
export const pdaSum = pda(
  ["qs", "qa", "qb", "qc", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "qa", "Z"],
    ["qa", "a", "ε", "qa", "X"],
    ["qa", "ε", "ε", "qb", "ε"],
    ["qb", "b", "ε", "qb", "X"],
    ["qb", "ε", "ε", "qc", "ε"],
    ["qc", "c", "X", "qc", "ε"],
    ["qc", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["X", "Z"],
)

const is0n1n = (w: string) => /^0*1*$/.test(w) && count(w, "0") === count(w, "1")

export const pdaNoteChecks: Check[] = [
  // What the slide's drawing actually accepts: 0^n 1^m with m ≤ n (no way to see the bottom of the stack).
  { id: "note-pda-slide-0n1n-actual", machine: pdaSlide0n1n, alphabet: ["0", "1"], maxLen: 9, inL: (w) => { const b = blocks(w, "01"); return !!b && b[1] <= b[0] } },
  { id: "note-pda-0n1n", machine: pda0n1n, alphabet: ["0", "1"], maxLen: 10, inL: is0n1n },
  { id: "note-pda-anb2n", machine: pdaAnB2n, alphabet: ["a", "b"], maxLen: 10, inL: (w) => { const b = blocks(w, "ab"); return !!b && b[1] === 2 * b[0] } },
  { id: "note-pda-i-le-j", machine: pdaILeJ, alphabet: ["a", "b"], maxLen: 10, inL: (w) => { const b = blocks(w, "ab"); return !!b && b[0] <= b[1] } },
  { id: "note-pda-i-eq-k", machine: pdaIEqK, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const b = blocks(w, "abc"); return !!b && b[0] === b[2] } },
  { id: "note-pda-w#wr", machine: pdaWHashWr, alphabet: ["0", "1", "#"], maxLen: 7, inL: (w) => { const p = w.split("#"); return p.length === 2 && p[0] === rev(p[1]) } },
  { id: "note-pda-pal", machine: pdaPal, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w === rev(w) },
  { id: "note-pda-balanced", machine: pdaBalanced, alphabet: ["(", ")"], maxLen: 10, inL: (w) => { let d = 0; for (const c of w) if ((d += c === "(" ? 1 : -1) < 0) return false; return d === 0 } },
  { id: "note-pda-equal", machine: pdaEqual, alphabet: ["0", "1"], maxLen: 10, inL: (w) => count(w, "0") === count(w, "1") },
  { id: "note-pda-ij-or-jk", machine: pdaIJorJK, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const b = blocks(w, "abc"); return !!b && (b[0] === b[1] || b[1] === b[2]) } },
  { id: "note-pda-nested", machine: pdaNested, alphabet: ["a", "b", "c", "d"], maxLen: 8, inL: (w) => { const b = blocks(w, "abcd"); return !!b && b[0] === b[3] && b[1] === b[2] } },
  { id: "note-pda-sum", machine: pdaSum, alphabet: ["a", "b", "c"], maxLen: 8, inL: (w) => { const b = blocks(w, "abc"); return !!b && b[2] === b[0] + b[1] } },
]

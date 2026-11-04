/* Machines in the 21-batch (2022-2023) solutions, each tested against its language. */
import { allStrings, faAccepts, grammar, productDfa, regexMatcher, type TM } from "@/lib/automata"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check, Fact } from "./types"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}

/* ───── Q1(b): running sum mod 3 over {R,0,1,2}, R resets ───── */

const S3 = ["R", "0", "1", "2"]
const sumMod3 = (w: string) => {
  let s = 0
  for (const c of w) s = c === "R" ? 0 : (s + Number(c)) % 3
  return s
}
export const b21sum = dfa("r0", ["r0"], {
  r0: { R: "r0", 0: "r0", 1: "r1", 2: "r2" },
  r1: { R: "r0", 0: "r1", 1: "r2", 2: "r0" },
  r2: { R: "r0", 0: "r2", 1: "r0", 2: "r1" },
})

/** Every 2-state DFA over {R,0,1,2} that agrees with L on all strings up to length n. */
function twoStateDfasFor(n: number): number {
  const words = allStrings(S3, n)
  let found = 0
  for (let t = 0; t < 1 << 8; t++)
    for (let acc = 0; acc < 4; acc++) {
      const next = (q: number, i: number) => (t >> (q * 4 + i)) & 1
      const ok = words.every((w) => {
        let q = 0
        for (const c of w) q = next(q, S3.indexOf(c))
        return (((acc >> q) & 1) === 1) === (sumMod3(w) === 0)
      })
      if (ok) found++
    }
  return found
}

/* ───── Q1(c): neither aa nor bb ───── */

export const b21alt = dfa("q0", ["q0", "qa", "qb"], {
  q0: { a: "qa", b: "qb" },
  qa: { a: "d", b: "qb" },
  qb: { a: "qa", b: "d" },
  d: { a: "d", b: "d" },
})

/* ───── Q2(a): the five given automata, transcribed from the paper ───── */

export const b21f1 = dfa("s", ["t"], { s: { a: "t", b: "d" }, t: { a: "r", b: "s" }, r: { a: "d", b: "d" }, d: { a: "d", b: "d" } })
export const b21f2 = dfa("s", ["f", "g"], { s: { a: "p", b: "g" }, p: { a: "p", b: "f" }, f: { a: "d", b: "d" }, g: { a: "d", b: "d" }, d: { a: "d", b: "d" } })
export const b21f3 = dfa("s", ["s"], { s: { a: "m", b: "d" }, m: { a: "r", b: "s" }, r: { a: "d", b: "m" }, d: { a: "d", b: "d" } })
export const b21f4 = dfa("s", ["s"], { s: { a: "r", b: "l" }, l: { a: "s", b: "d" }, r: { a: "d", b: "s" }, d: { a: "d", b: "d" } })
/** q1/q2: last symbol a/b with no repeat yet; q3: just read aa; q4: just read bb; q5: aab or bba seen. */
export const b21f5 = dfa("q0", ["q5"], {
  q0: { a: "q1", b: "q2" },
  q2: { a: "q1", b: "q4" },
  q1: { a: "q3", b: "q2" },
  q4: { a: "q5", b: "q4" },
  q3: { a: "q3", b: "q5" },
  q5: { a: "q5", b: "q5" },
})
/** Height of a walk where a = up, b = down; null once it leaves 0..2. */
const levels = (w: string) => {
  let h = 0
  for (const c of w) {
    h += c === "a" ? 1 : -1
    if (h < 0 || h > 2) return null
  }
  return h
}

/* ───── Q2(b): a^(2+3k) ∪ b^(10+12k) ───── */

const inQ2b = (w: string) => (/^a+$/.test(w) && w.length >= 2 && (w.length - 2) % 3 === 0) || (/^b+$/.test(w) && w.length >= 10 && (w.length - 10) % 12 === 0)

/**
 * Is p a pumping length for the Q2(b) language? Tries every member of length
 * p..maxLen and every split with |xy| ≤ p, |y| ≥ 1, pumping i = 0..6.
 */
function isPumpingLength(p: number, maxLen = 90): boolean {
  const members: string[] = []
  for (let n = p; n <= maxLen; n++) for (const c of ["a", "b"]) if (inQ2b(c.repeat(n))) members.push(c.repeat(n))
  return members.every((s) => {
    for (let x = 0; x < p; x++)
      for (let y = 1; x + y <= p; y++) {
        const [X, Y, Z] = [s.slice(0, x), s.slice(x, x + y), s.slice(x + y)]
        if ([0, 1, 2, 3, 4, 5, 6].every((i) => inQ2b(X + Y.repeat(i) + Z))) return true
      }
    return false
  })
}

/* ───── Q3(a): no run of 0s of even length ≥ 2 ───── */

export const b21runs = dfa("s", ["s", "o"], {
  s: { 0: "o", 1: "s" },
  o: { 0: "e", 1: "s" },
  e: { 0: "o", 1: "d" },
  d: { 0: "d", 1: "d" },
})

/* ───── Q4(a): union of D1 and D2 ───── */

export const b21d1 = dfa("s0", ["s0"], { s0: { 0: "s1", 1: "s1" }, s1: { 0: "s1", 1: "s1" } })
export const b21d2 = dfa("q1", ["q2", "q3"], { q1: { 0: "q1", 1: "q2" }, q2: { 0: "q3", 1: "q2" }, q3: { 0: "q2", 1: "q2" } })
export const b21union = productDfa(b21d1, b21d2, "or")

/* ───── Q4(b): begin and end with different symbols, odd length ───── */

export const b21odd = nfa(
  ["s", "a1", "a2", "fa", "b1", "b2", "fb"],
  "s",
  ["fa", "fb"],
  [
    ["s", "0", "a1"],
    ["a1", "0,1", "a2"],
    ["a2", "0,1", "a1"],
    ["a2", "1", "fa"],
    ["s", "1", "b1"],
    ["b1", "0,1", "b2"],
    ["b2", "0,1", "b1"],
    ["b2", "0", "fb"],
  ],
  ["0", "1"],
)

/* ───── Q4(c): the given DFA, strings ending in 1 ───── */

export const b21ends1 = dfa("q0", ["q1"], { q0: { 0: "q0", 1: "q1" }, q1: { 0: "q0", 1: "q1" } })
export const b21q4cOptions = { A: "0*1(1+00*1)*", B: "0*1*1+11*0*1", C: "(0+1)*1" }

/* ───── Q5 ───── */

export const b21paren = grammar("S -> SS | (S) | ε")
export const b21two1 = grammar("S -> A1A1A\nA -> 0A | 1A | ε")
const balanced = (w: string) => {
  let h = 0
  for (const c of w) if ((h += c === "(" ? 1 : -1) < 0) return false
  return h === 0
}

/* ───── Q6: a^n b^n c^m d^m ∪ a^n b^m c^m d^n ───── */

export const b21g6 = grammar("S -> AB | C\nA -> aAb | ab\nB -> cBd | cd\nC -> aCd | aDd\nD -> bDc | bc")

/* ───── Q7: the CNF grammar ───── */

export const b21g7 = grammar("S -> AB | AY | YA | 1\nA -> ZA | YA | 0 | 1\nB -> YA\nZ -> 0\nY -> 1")

/* ───── Q8: a^i b^j c^k with i = j or i = k (Sipser form) ───── */

export const b21pda = pda(
  ["qs", "q", "pa", "pb", "pc", "ra", "rb", "rc", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "q", "Z"],
    // i = j: match a's with b's, then read any c's
    ["q", "ε", "ε", "pa", "ε"],
    ["pa", "a", "ε", "pa", "X"],
    ["pa", "ε", "ε", "pb", "ε"],
    ["pb", "b", "X", "pb", "ε"],
    ["pb", "ε", "Z", "pc", "Z"],
    ["pc", "c", "ε", "pc", "ε"],
    ["pc", "ε", "Z", "qacc", "ε"],
    // i = k: skip the b's, match a's with c's
    ["q", "ε", "ε", "ra", "ε"],
    ["ra", "a", "ε", "ra", "X"],
    ["ra", "ε", "ε", "rb", "ε"],
    ["rb", "b", "ε", "rb", "ε"],
    ["rb", "ε", "ε", "rc", "ε"],
    ["rc", "c", "X", "rc", "ε"],
    ["rc", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c"],
  ["X", "Z"],
)

/* ───── Q10: TM writing NOT w after the c ───── */

type Move = TM["delta"][number]
const bits = ["0", "1"] as const
const not = (b: string) => (b === "0" ? "1" : "0")
const notMoves: Move[] = []
for (const a of bits) {
  notMoves.push(["q0", a, `q1,${not(a)}`, `*${a}`, "R"]) // check the next bit of w, carry its complement
  for (const r of bits) {
    notMoves.push([`q1,${r}`, a, `q1,${r}`, a, "R"]) // over w and the bits already written
    notMoves.push(["q2", a, "q2", a, "L"]) // back to the last checked bit
    notMoves.push(["u", `*${a}`, "u", a, "L"]) // remove check marks
    notMoves.push(["u", a, "u", a, "L"])
  }
  notMoves.push([`q1,${a}`, "c", `q1,${a}`, "c", "R"])
  notMoves.push([`q1,${a}`, "B", "q2", a, "L"]) // write the complement at the end
  notMoves.push(["q2", `*${a}`, "q0", `*${a}`, "R"])
}
notMoves.push(["q2", "c", "q2", "c", "L"])
notMoves.push(["q0", "c", "u", "c", "L"]) // all of w done
notMoves.push(["u", "B", "qf", "B", "R"])
export const b21tmNot = tm(["q0", "q1,0", "q1,1", "q2", "u", "qf"], "q0", ["qf"], notMoves, ["0", "1", "c"], ["0", "1", "c", "B", "*0", "*1"])

export const b21Checks: Check[] = [
  { id: "b21-1b-sum", machine: b21sum, dfa: true, alphabet: S3, maxLen: 6, inL: (w) => sumMod3(w) === 0 },
  { id: "b21-1c", machine: b21alt, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => !w.includes("aa") && !w.includes("bb") },
  { id: "b21-2a-i", machine: b21f1, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => /^(ab)*a$/.test(w) },
  { id: "b21-2a-ii", machine: b21f2, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => /^a*b$/.test(w) },
  { id: "b21-2a-iii", machine: b21f3, dfa: true, alphabet: ["a", "b"], maxLen: 12, inL: (w) => levels(w) === 0 },
  { id: "b21-2a-iii-regex", regex: "(a(ab)*b)*", alphabet: ["a", "b"], maxLen: 12, inL: (w) => levels(w) === 0 },
  { id: "b21-2a-iv", machine: b21f4, dfa: true, alphabet: ["a", "b"], maxLen: 12, inL: (w) => /^(ab|ba)*$/.test(w) },
  { id: "b21-2a-v", machine: b21f5, dfa: true, alphabet: ["a", "b"], maxLen: 12, inL: (w) => w.includes("aab") || w.includes("bba") },
  { id: "b21-3a", machine: b21runs, dfa: true, alphabet: ["0", "1"], maxLen: 12, inL: (w) => (w.match(/0+/g) ?? []).every((r) => r.length % 2 === 1), extra: ["0001100", "01110001", "11111", "000010"] },
  { id: "b21-4a-d1", machine: b21d1, dfa: true, alphabet: ["0", "1"], maxLen: 8, inL: (w) => w === "" },
  { id: "b21-4a-d2", machine: b21d2, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.includes("1") },
  { id: "b21-4a-union", machine: b21union, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w === "" || w.includes("1") },
  { id: "b21-4b", machine: b21odd, alphabet: ["0", "1"], maxLen: 11, inL: (w) => w.length % 2 === 1 && w.length >= 3 && w[0] !== w.at(-1) },
  { id: "b21-4c-dfa", machine: b21ends1, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.endsWith("1") },
  { id: "b21-4c-A", regex: b21q4cOptions.A, alphabet: ["0", "1"], maxLen: 11, inL: (w) => w.endsWith("1") },
  { id: "b21-4c-C", regex: b21q4cOptions.C, alphabet: ["0", "1"], maxLen: 11, inL: (w) => w.endsWith("1") },
  { id: "b21-4c-B-as-written", regex: b21q4cOptions.B, alphabet: ["0", "1"], maxLen: 11, inL: (w) => /^(0*1+|1+0*1)$/.test(w) },
  { id: "b21-5i", grammar: b21paren, alphabet: ["(", ")"], maxLen: 10, inL: balanced },
  { id: "b21-5ii", grammar: b21two1, alphabet: ["0", "1"], maxLen: 9, inL: (w) => count(w, "1") >= 2 },
  {
    id: "b21-6",
    grammar: b21g6,
    alphabet: ["a", "b", "c", "d"],
    maxLen: 8,
    inL: (w) => { const b = blocks(w, "abcd"); return !!b && b.every((x) => x >= 1) && ((b[0] === b[1] && b[2] === b[3]) || (b[0] === b[3] && b[1] === b[2])) },
    ambiguousOn: ["abcd", "aabbccdd"],
  },
  { id: "b21-7", grammar: b21g7, cnf: true, alphabet: ["0", "1"], maxLen: 9, inL: (w) => w.includes("1") },
  { id: "b21-8", machine: b21pda, alphabet: ["a", "b", "c"], maxLen: 9, inL: (w) => { const b = blocks(w, "abc"); return !!b && (b[0] === b[1] || b[0] === b[2]) } },
  { id: "b21-10", machine: b21tmNot, alphabet: ["0", "1", "c"], maxLen: 9, inL: (w) => /^[01]*c$/.test(w), output: (w) => `${w}${[...w.slice(0, -1)].map(not).join("")}` },
]

export const b21Facts: Fact[] = [
  {
    id: "b21-1b-no-two-states",
    claim: "no 2-state DFA recognises the sum-mod-3 language",
    problem: () => { const n = twoStateDfasFor(5); return n ? `${n} two-state DFAs agree with L on all strings up to length 5` : null },
  },
  {
    id: "b21-2b-pumping-lengths",
    claim: "3, 5, 9 are not pumping lengths, 24 is, and the minimum is 12",
    problem: () => {
      const good = Array.from({ length: 30 }, (_, i) => i + 1).filter((p) => isPumpingLength(p))
      const want = Array.from({ length: 19 }, (_, i) => i + 12)
      return good.join() === want.join() ? null : `pumping lengths in 1..30 are ${good.join(", ")}`
    },
  },
  {
    id: "b21-4c-B-wrong",
    claim: "option B differs from the DFA, e.g. on 1011",
    problem: () => (regexMatcher(b21q4cOptions.B)("1011") === false && faAccepts(b21ends1, "1011") ? null : "1011 does not separate B from the DFA"),
  },
]

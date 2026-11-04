/* Machines in the 22-batch (2023-2024) solutions, each tested against its language. */
import { concatNfa, grammar, type FA } from "@/lib/automata"
import type { PumpClaim } from "@/lib/pumping"
import { dfa } from "./notes-dfa"
import { nfa } from "./notes-nfa"
import { pda } from "./notes-pda"
import { tm } from "./notes-tm"
import type { Check } from "./types"
import type { TM } from "@/lib/automata"

const count = (w: string, c: string) => [...w].filter((x) => x === c).length
const blocks = (w: string, letters: string) => {
  const m = w.match(new RegExp(`^${[...letters].map((c) => `(${c}*)`).join("")}$`))
  return m ? m.slice(1).map((s) => s.length) : null
}

/* ───── Q1(b): at most two runs of a's of length exactly three ───── */

/** State "c,r": c = completed runs of exactly three a's (0–2), r = length of the current a-block (0–3, or 4 for "4 or more"). */
const q1bTable: Record<string, Record<string, string>> = { D: { a: "D", b: "D" } }
for (let c = 0; c <= 2; c++)
  for (let r = 0; r <= 4; r++) {
    const ended = r === 3 ? c + 1 : c // a b closes the current block
    q1bTable[`${c},${r}`] = { a: `${c},${Math.min(r + 1, 4)}`, b: ended > 2 ? "D" : `${ended},0` }
  }
export const b22q1b = dfa(
  "0,0",
  Object.keys(q1bTable).filter((s) => s !== "D" && s !== "2,3"),
  q1bTable,
)
const runsOf3 = (w: string) => (w.match(/a+/g) ?? []).filter((x) => x.length === 3).length

/* ───── Q1(c): {≥ 3 ones} concatenated with ∅ ───── */

export const b22n1 = nfa(["q0", "q1", "q2", "q3"], "q0", ["q3"], [["q0", "0", "q0"], ["q0", "1", "q1"], ["q1", "0", "q1"], ["q1", "1", "q2"], ["q2", "0", "q2"], ["q2", "1", "q3"], ["q3", "0,1", "q3"]], ["0", "1"])
export const b22nEmpty: FA = { kind: "fa", states: ["r0"], alphabet: ["0", "1"], start: "r0", accept: [], delta: [] }
export const b22concat = concatNfa(b22n1, b22nEmpty)

/* ───── Q2(a): a DFA to illustrate the pumping decomposition ───── */

/** Number of a's divisible by 3: three states, so p = 3. */
export const b22aMod3 = dfa("q0", ["q0"], { q0: { a: "q1", b: "q0" }, q1: { a: "q2", b: "q1" }, q2: { a: "q0", b: "q2" } })

/* ───── Q2(b): {awa} ───── */

export const b22awa = dfa("q0", ["q2"], {
  q0: { a: "q1", b: "d" },
  q1: { a: "q2", b: "q1" },
  q2: { a: "q2", b: "q1" },
  d: { a: "d", b: "d" },
})

/* ───── Q3(a): a^n (n ≥ 1) ∪ b^m a^k, which is b*a* ───── */

export const b22three = nfa(["s", "q", "t"], "s", ["s", "q", "t"], [["s", "b", "s"], ["s", "a", "q"], ["q", "a", "q"], ["s", "a", "t"], ["t", "a", "t"]], ["a", "b"])
export const b22two = nfa(["p", "q"], "p", ["p", "q"], [["p", "b", "p"], ["p", "a", "q"], ["q", "a", "q"]], ["a", "b"])

/* ───── Q4(a): accepts a*, and {a} once the ε-edge s → q is removed ───── */

export const b22aStar = nfa(["s", "q", "f"], "s", ["q", "f"], [["s", "ε", "q"], ["q", "a", "q"], ["s", "a", "f"]], ["a"])
export const b22aOnly = nfa(["s", "q", "f"], "s", ["q", "f"], [["q", "a", "q"], ["s", "a", "f"]], ["a"])

/* ───── Q5: a^i b^j c^k with i = j or i = k, all ≥ 1 ───── */

export const b22g5 = grammar("S -> AC | B\nA -> aAb | ab\nC -> cC | c\nB -> aBc | aDc\nD -> bD | b")

/* ───── Q6: the CNF grammar ───── */

export const b22g6 = grammar("S -> BZ | CY | ZZ | YY\nB -> ZA\nC -> YA\nA -> ZA | YA | 0 | 1\nZ -> 0\nY -> 1")

/* ───── Q8: PDA for a^n b^m c^m d^n, n, m ≥ 1 (Sipser form) ───── */

export const b22pda = pda(
  ["qs", "q1", "qa", "qb", "qc", "qd", "qacc"],
  "qs",
  ["qacc"],
  [
    ["qs", "ε", "ε", "q1", "Z"],
    ["q1", "a", "ε", "qa", "A"],
    ["qa", "a", "ε", "qa", "A"],
    ["qa", "b", "ε", "qb", "B"],
    ["qb", "b", "ε", "qb", "B"],
    ["qb", "c", "B", "qc", "ε"],
    ["qc", "c", "B", "qc", "ε"],
    ["qc", "d", "A", "qd", "ε"],
    ["qd", "d", "A", "qd", "ε"],
    ["qd", "ε", "Z", "qacc", "ε"],
  ],
  ["a", "b", "c", "d"],
  ["A", "B", "Z"],
)

/* ───── Q9: TM comparing w1 c w2 c; writes 0 if equal, 1 if not ───── */

type Move = TM["delta"][number]
const bits = ["0", "1"] as const
const eqMoves: Move[] = []
for (const a of bits) {
  eqMoves.push(["q0", a, `q1,${a}`, `*${a}`, "R"]) // check w1's next bit, remember it
  for (const x of bits) eqMoves.push([`q1,${a}`, x, `q1,${a}`, x, "R"]) // rest of w1
  eqMoves.push([`q1,${a}`, "c", `q2,${a}`, "c", "R"]) // into w2
  for (const x of bits) eqMoves.push([`q2,${a}`, `*${x}`, `q2,${a}`, `*${x}`, "R"]) // skip checked bits of w2
  eqMoves.push([`q2,${a}`, a, "q3", `*${a}`, "L"]) // same bit: go back for the next round
  eqMoves.push([`q2,${a}`, a === "0" ? "1" : "0", "q4,1", `*${a === "0" ? "1" : "0"}`, "R"]) // different: answer 1
}
for (const x of bits) {
  eqMoves.push(["q3", x, "q3", x, "L"])
  eqMoves.push(["q3", `*${x}`, "q3", `*${x}`, "L"])
  eqMoves.push(["q5", x, "q5", x, "L"])
  eqMoves.push(["q5", `*${x}`, "q0", `*${x}`, "R"])
  for (const r of bits) {
    eqMoves.push([`q4,${r}`, x, `q4,${r}`, x, "R"])
    eqMoves.push([`q4,${r}`, `*${x}`, `q4,${r}`, `*${x}`, "R"])
  }
  eqMoves.push(["u", `*${x}`, "u", x, "L"]) // remove check marks
  eqMoves.push(["u", x, "u", x, "L"])
}
eqMoves.push(["q3", "c", "q5", "c", "L"]) // back across the first c into w1
eqMoves.push(["q0", "c", "q4,0", "c", "R"]) // w1 used up with no difference: answer 0
eqMoves.push(["q4,0", "c", "q6,0", "c", "R"])
eqMoves.push(["q4,1", "c", "q6,1", "c", "R"])
for (const r of bits) eqMoves.push([`q6,${r}`, "B", "u", r, "L"]) // write the answer after the second c
eqMoves.push(["u", "c", "u", "c", "L"])
eqMoves.push(["u", "B", "qf", "B", "R"])
export const b22tmEq = tm(
  ["q0", "q1,0", "q1,1", "q2,0", "q2,1", "q3", "q4,0", "q4,1", "q5", "q6,0", "q6,1", "u", "qf"],
  "q0",
  ["qf"],
  eqMoves,
  ["0", "1", "c"],
  ["0", "1", "c", "B", "*0", "*1"],
)
const twoNumbers = (w: string) => {
  const m = w.match(/^([01]+)c([01]+)c$/)
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

export const b22Checks: Check[] = [
  { id: "b22-1b", machine: b22q1b, dfa: true, alphabet: ["a", "b"], maxLen: 14, inL: (w) => runsOf3(w) <= 2, extra: ["aaabaaabaaab", "aaabaaabaaaa", "aaaabaaabaaab"] },
  { id: "b22-1c-n1", machine: b22n1, alphabet: ["0", "1"], maxLen: 9, inL: (w) => count(w, "1") >= 3 },
  { id: "b22-1c-empty", machine: b22nEmpty, alphabet: ["0", "1"], maxLen: 5, inL: () => false },
  { id: "b22-1c-concat", machine: b22concat, alphabet: ["0", "1"], maxLen: 9, inL: () => false },
  { id: "b22-2a-mod3", machine: b22aMod3, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => count(w, "a") % 3 === 0 },
  { id: "b22-2b-awa", machine: b22awa, dfa: true, alphabet: ["a", "b"], maxLen: 10, inL: (w) => w.length >= 2 && w[0] === "a" && w.at(-1) === "a" },
  { id: "b22-3a-three", machine: b22three, alphabet: ["a", "b"], maxLen: 10, inL: (w) => /^b*a*$/.test(w) },
  { id: "b22-3a-two", machine: b22two, alphabet: ["a", "b"], maxLen: 10, inL: (w) => /^(a+|b*a*)$/.test(w) },
  { id: "b22-4a-astar", machine: b22aStar, alphabet: ["a"], maxLen: 8, inL: () => true },
  { id: "b22-4a-removed", machine: b22aOnly, alphabet: ["a"], maxLen: 8, inL: (w) => w === "a" },
  { id: "b22-4b-option-B", regex: "(b+ab)*(ε+a+aa)(b+ba)*", alphabet: ["a", "b"], maxLen: 11, inL: (w) => [...w].filter((_, i) => w.startsWith("aa", i)).length <= 1 },
  {
    id: "b22-5",
    grammar: b22g5,
    alphabet: ["a", "b", "c"],
    maxLen: 9,
    inL: (w) => { const b = blocks(w, "abc"); return !!b && b.every((x) => x >= 1) && (b[0] === b[1] || b[0] === b[2]) },
    ambiguousOn: ["abc", "aabbcc"],
  },
  { id: "b22-6", grammar: b22g6, cnf: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length >= 2 && w[0] === w.at(-1) },
  { id: "b22-8", machine: b22pda, alphabet: ["a", "b", "c", "d"], maxLen: 9, inL: (w) => { const b = blocks(w, "abcd"); return !!b && b[0] >= 1 && b[1] >= 1 && b[0] === b[3] && b[1] === b[2] } },
  {
    id: "b22-9",
    machine: b22tmEq,
    alphabet: ["0", "1", "c"],
    maxLen: 10,
    inL: (w) => twoNumbers(w) !== null,
    output: (w) => { const [x, y] = twoNumbers(w)!; return `${x}c${y}c${x === y ? "0" : "1"}` },
  },
]

const isFactorial = (n: number) => {
  let f = 1
  for (let k = 1; f <= n; k++) {
    if (f === n) return true
    f *= k + 1
  }
  return false
}
const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1))

export const b22Pumping: PumpClaim[] = [
  // Q4(c): s = a^((p+1)!), pump up once.
  { id: "b22-4c", kind: "regular", inL: (w) => /^a+$/.test(w) && isFactorial(w.length), witness: (p) => "a".repeat(fact(p + 1)), i: () => 2, ps: [1, 2, 3, 4] },
  // Q2(a): with |xy| ≤ p every split of a^p b^p c^p fails for a^n b^n c^m …
  {
    id: "b22-2a-with",
    kind: "regular",
    inL: (w) => { const b = blocks(w, "abc"); return !!b && b[0] === b[1] },
    witness: (p) => "a".repeat(p) + "b".repeat(p) + "c".repeat(p),
    i: () => 0,
  },
]

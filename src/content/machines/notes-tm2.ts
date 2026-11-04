/*
  TMs for the programming-techniques note (Atif Sir, Lecture 5). States written
  "q1,a" are HMU's [q1, a] (storage in the state); tape symbols "*0", "*1",
  "*c" are the two-track symbols [✓, 0] etc.; plain 0, 1, c, B are [B, X].
*/
import type { TM } from "@/lib/automata"
import { tm } from "./notes-tm"
import type { Check } from "./types"

type Move = TM["delta"][number]
const bits = ["0", "1"] as const
const flip = (a: string) => (a === "0" ? "1" : "0")

/** HMU Example 8.6: remember the first symbol; accept 01* + 10*. */
export const tmFirstSymbol = tm(
  ["q0,B", "q1,0", "q1,1", "q1,B"],
  "q0,B",
  ["q1,B"],
  [
    ...bits.map((a) => ["q0,B", a, `q1,${a}`, a, "R"] as Move),
    ...bits.map((a) => [`q1,${a}`, flip(a), `q1,${a}`, flip(a), "R"] as Move),
    ...bits.map((a) => [`q1,${a}`, "B", "q1,B", "B", "R"] as Move),
  ],
  ["0", "1"],
  ["0", "1", "B"],
)

/** HMU Example 8.7: two tracks (check marks) plus storage, for {wcw | w in (0+1)+}. Rules 1–14 of the slides. */
const wcwMoves: Move[] = []
for (const a of bits) {
  wcwMoves.push(["q1,B", a, `q2,${a}`, `*${a}`, "R"]) // 1
  for (const b of bits) wcwMoves.push([`q2,${a}`, b, `q2,${a}`, b, "R"]) // 2
  wcwMoves.push([`q2,${a}`, "c", `q3,${a}`, "c", "R"]) // 3
  for (const b of bits) wcwMoves.push([`q3,${a}`, `*${b}`, `q3,${a}`, `*${b}`, "R"]) // 4
  wcwMoves.push([`q3,${a}`, a, "q4,B", `*${a}`, "L"]) // 5
  wcwMoves.push(["q4,B", `*${a}`, "q4,B", `*${a}`, "L"]) // 6
  wcwMoves.push(["q5,B", a, "q6,B", a, "L"]) // 8
  wcwMoves.push(["q6,B", a, "q6,B", a, "L"]) // 9
  wcwMoves.push(["q6,B", `*${a}`, "q1,B", `*${a}`, "R"]) // 10
  wcwMoves.push(["q5,B", `*${a}`, "q7,B", `*${a}`, "R"]) // 11
  wcwMoves.push(["q8,B", `*${a}`, "q8,B", `*${a}`, "R"]) // 13
}
wcwMoves.push(["q4,B", "c", "q5,B", "c", "L"]) // 7
wcwMoves.push(["q7,B", "c", "q8,B", "c", "R"]) // 12
wcwMoves.push(["q8,B", "B", "q9,B", "B", "R"]) // 14
export const tmWcw = tm(
  ["q1,B", "q2,0", "q2,1", "q3,0", "q3,1", "q4,B", "q5,B", "q6,B", "q7,B", "q8,B", "q9,B"],
  "q1,B",
  ["q9,B"],
  wcwMoves,
  ["0", "1", "c"],
  ["0", "1", "c", "B", "*0", "*1"],
)

/**
 * Bitwise AND of w1 c w2 c (equal lengths), result written after the second c.
 * Each round checks off one bit of w1 (stored in the state), the matching bit
 * of w2, stores a AND b, appends it, and walks back. Finally all check marks
 * are removed, leaving w1 c w2 c (w1 AND w2).
 */
const andMoves: Move[] = []
for (const a of bits) {
  andMoves.push(["q0", a, `q1,${a}`, `*${a}`, "R"]) // check w1's next bit, remember it
  for (const x of bits) andMoves.push([`q1,${a}`, x, `q1,${a}`, x, "R"]) // rest of w1
  andMoves.push([`q1,${a}`, "c", `q2,${a}`, "c", "R"]) // into w2
  for (const x of bits) andMoves.push([`q2,${a}`, `*${x}`, `q2,${a}`, `*${x}`, "R"]) // skip done bits of w2
  for (const b of bits) andMoves.push([`q2,${a}`, b, `q3,${a === "1" && b === "1" ? "1" : "0"}`, `*${b}`, "R"]) // check b, store a AND b
}
for (const r of bits) {
  for (const x of bits) andMoves.push([`q3,${r}`, x, `q3,${r}`, x, "R"]) // rest of w2
  andMoves.push([`q3,${r}`, "c", `q4,${r}`, "c", "R"]) // past the second c
  for (const x of bits) andMoves.push([`q4,${r}`, x, `q4,${r}`, x, "R"]) // past results so far
  andMoves.push([`q4,${r}`, "B", "q5", r, "L"]) // append the result bit
}
for (const x of bits) {
  andMoves.push(["q5", x, "q5", x, "L"]) // back over results
  andMoves.push(["q6", x, "q6", x, "L"]) // back over w2
  andMoves.push(["q6", `*${x}`, "q6", `*${x}`, "L"])
  andMoves.push(["q7", x, "q7", x, "L"]) // back over unchecked w1
  andMoves.push(["q7", `*${x}`, "q0", `*${x}`, "R"]) // last checked bit of w1: next round
  andMoves.push(["u1", `*${x}`, "u1", x, "R"]) // unmark w2
  andMoves.push(["u1", x, "u1", x, "R"])
  andMoves.push(["u2", `*${x}`, "u2", x, "L"]) // unmark w1
  andMoves.push(["u2", x, "u2", x, "L"])
}
andMoves.push(["q5", "c", "q6", "c", "L"])
andMoves.push(["q6", "c", "q7", "c", "L"])
andMoves.push(["q0", "c", "u1", "c", "R"]) // w1 used up: clean up
andMoves.push(["u1", "c", "u1", "c", "R"])
andMoves.push(["u1", "B", "u2", "B", "L"])
andMoves.push(["u2", "c", "u2", "c", "L"])
andMoves.push(["u2", "B", "qf", "B", "R"])
export const tmAnd = tm(
  ["q0", "q1,0", "q1,1", "q2,0", "q2,1", "q3,0", "q3,1", "q4,0", "q4,1", "q5", "q6", "q7", "u1", "u2", "qf"],
  "q0",
  ["qf"],
  andMoves,
  ["0", "1", "c"],
  ["0", "1", "c", "B", "*0", "*1"],
)

const twoNumbers = (w: string) => {
  const m = w.match(/^([01]+)c([01]+)c$/)
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

export const tm2NoteChecks: Check[] = [
  { id: "note-tm2-first-symbol", machine: tmFirstSymbol, alphabet: ["0", "1"], maxLen: 10, inL: (w) => /^(01*|10*)$/.test(w) },
  { id: "note-tm2-wcw", machine: tmWcw, alphabet: ["0", "1", "c"], maxLen: 9, inL: (w) => { const p = w.split("c"); return p.length === 2 && p[0].length > 0 && p[0] === p[1] } },
  {
    id: "note-tm2-and",
    machine: tmAnd,
    alphabet: ["0", "1", "c"],
    maxLen: 10,
    inL: (w) => twoNumbers(w) !== null,
    output: (w) => {
      const [x, y] = twoNumbers(w)!
      return `${x}c${y}c${[...x].map((b, i) => (b === "1" && y[i] === "1" ? "1" : "0")).join("")}`
    },
  },
]

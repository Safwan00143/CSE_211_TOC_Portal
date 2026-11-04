/* A TM that writes w1 op w2 after the second separator, for w1 sep w2 sep with |w1| = |w2| (AND/OR/XOR questions). */
import type { TM } from "@/lib/automata"
import { tm } from "./notes-tm"

type Move = TM["delta"][number]
const bits = ["0", "1"] as const

export function bitwiseTm(op: (a: string, b: string) => string, sep = "c"): TM {
  const moves: Move[] = []
  for (const a of bits) {
    moves.push(["q0", a, `q1,${a}`, `*${a}`, "R"]) // check w1's next bit, remember it
    for (const x of bits) moves.push([`q1,${a}`, x, `q1,${a}`, x, "R"]) // rest of w1
    moves.push([`q1,${a}`, sep, `q2,${a}`, sep, "R"]) // into w2
    for (const x of bits) moves.push([`q2,${a}`, `*${x}`, `q2,${a}`, `*${x}`, "R"]) // skip done bits of w2
    for (const b of bits) moves.push([`q2,${a}`, b, `q3,${op(a, b)}`, `*${b}`, "R"]) // check b, store a op b
  }
  for (const r of bits) {
    for (const x of bits) moves.push([`q3,${r}`, x, `q3,${r}`, x, "R"]) // rest of w2
    moves.push([`q3,${r}`, sep, `q4,${r}`, sep, "R"]) // past the second separator
    for (const x of bits) moves.push([`q4,${r}`, x, `q4,${r}`, x, "R"]) // past results so far
    moves.push([`q4,${r}`, "B", "q5", r, "L"]) // append the result bit
  }
  for (const x of bits) {
    moves.push(["q5", x, "q5", x, "L"]) // back over results
    moves.push(["q6", x, "q6", x, "L"]) // back over w2
    moves.push(["q6", `*${x}`, "q6", `*${x}`, "L"])
    moves.push(["q7", x, "q7", x, "L"]) // back over unchecked w1
    moves.push(["q7", `*${x}`, "q0", `*${x}`, "R"]) // last checked bit of w1: next round
    moves.push(["u1", `*${x}`, "u1", x, "R"]) // unmark w2
    moves.push(["u1", x, "u1", x, "R"])
    moves.push(["u2", `*${x}`, "u2", x, "L"]) // unmark w1
    moves.push(["u2", x, "u2", x, "L"])
  }
  moves.push(["q5", sep, "q6", sep, "L"])
  moves.push(["q6", sep, "q7", sep, "L"])
  moves.push(["q0", sep, "u1", sep, "R"]) // w1 used up: clean up
  moves.push(["u1", sep, "u1", sep, "R"])
  moves.push(["u1", "B", "u2", "B", "L"])
  moves.push(["u2", sep, "u2", sep, "L"])
  moves.push(["u2", "B", "qf", "B", "R"])
  return tm(
    ["q0", "q1,0", "q1,1", "q2,0", "q2,1", "q3,0", "q3,1", "q4,0", "q4,1", "q5", "q6", "q7", "u1", "u2", "qf"],
    "q0",
    ["qf"],
    moves,
    ["0", "1", sep],
    ["0", "1", sep, "B", "*0", "*1"],
  )
}

/** Inputs w1 sep w2 sep with equal nonempty lengths, as [w1, w2]; null otherwise. */
export function twoNumbers(w: string, sep = "c") {
  const s = sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const m = w.match(new RegExp(`^([01]+)${s}([01]+)${s}$`))
  return m && m[1].length === m[2].length ? [m[1], m[2]] : null
}

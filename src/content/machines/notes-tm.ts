/* Turing machines in the TM notes (Atif Sir, Lectures 4–5), each tested against its language or function. */
import type { TM } from "@/lib/automata"
import { tm0n1n } from "./kit-demo"
import type { Check } from "./types"

type Move = TM["delta"][number]
export function tm(states: string[], start: string, accept: string[], moves: Move[], alphabet: string[], tape: string[], blank = "B"): TM {
  return { kind: "tm", states, alphabet, tape, blank, start, accept, delta: moves }
}

export { tm0n1n }

/** HMU's monus machine: 0^m 1 0^n ↦ 0^(m ∸ n). q6 is the halting state. */
export const tmMonus = tm(
  ["q0", "q1", "q2", "q3", "q4", "q5", "q6"],
  "q0",
  ["q6"],
  [
    ["q0", "0", "q1", "B", "R"],
    ["q0", "1", "q5", "B", "R"],
    ["q1", "0", "q1", "0", "R"],
    ["q1", "1", "q2", "1", "R"],
    ["q2", "1", "q2", "1", "R"],
    ["q2", "0", "q3", "1", "L"],
    ["q2", "B", "q4", "B", "L"],
    ["q3", "0", "q3", "0", "L"],
    ["q3", "1", "q3", "1", "L"],
    ["q3", "B", "q0", "B", "R"],
    ["q4", "0", "q4", "0", "L"],
    ["q4", "1", "q4", "B", "L"],
    ["q4", "B", "q6", "0", "R"],
    ["q5", "0", "q5", "B", "R"],
    ["q5", "1", "q5", "B", "R"],
    ["q5", "B", "q6", "B", "R"],
  ],
  ["0", "1"],
  ["0", "1", "B"],
)

const monusInput = (w: string) => /^0*10*$/.test(w)
const monus = (w: string) => {
  const [m, n] = w.split("1").map((s) => s.length)
  return "0".repeat(Math.max(m - n, 0))
}

export const tmNoteChecks: Check[] = [
  { id: "note-tm-0n1n", machine: tm0n1n, alphabet: ["0", "1"], maxLen: 10, inL: (w) => /^0+1+$/.test(w) && w.indexOf("1") * 2 === w.length },
  // Monus is a function: on every input of the form 0^m 1 0^n the tape must end as 0^(m ∸ n).
  { id: "note-tm-monus", machine: tmMonus, alphabet: ["0", "1"], maxLen: 9, inL: monusInput, output: monus },
]

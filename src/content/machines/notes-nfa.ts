/* Machines in the NFA note (Hakim Sir, Lecture 4), each tested against its language. */
import { faAccepts, removeEpsilon, subsetConstruction, type FA } from "@/lib/automata"
import type { Check } from "./types"

/** Build an FA from a list of moves "from symbol to"; symbols "a,b" mean one move per symbol. */
export function nfa(states: string[], start: string, accept: string[], moves: [string, string, string][], alphabet: string[]): FA {
  return {
    kind: "fa",
    states,
    alphabet,
    start,
    accept,
    delta: moves.flatMap(([f, syms, t]) => syms.split(",").map((s) => [f, s.trim(), t] as [string, string, string])),
  }
}

const count = (w: string, c: string) => [...w].filter((x) => x === c).length

export const nfa101 = nfa(["q0", "q1", "q2", "q3"], "q0", ["q3"], [["q0", "0,1", "q0"], ["q0", "1", "q1"], ["q1", "0", "q2"], ["q2", "1", "q3"], ["q3", "0,1", "q3"]], ["0", "1"])

export const nfaFedDff = nfa(
  ["q0", "qf", "qfe", "qd", "qdf", "qA"],
  "q0",
  ["qA"],
  [
    ["q0", "d,e,f", "q0"],
    ["q0", "f", "qf"],
    ["qf", "e", "qfe"],
    ["qfe", "d", "qA"],
    ["q0", "d", "qd"],
    ["qd", "f", "qdf"],
    ["qdf", "f", "qA"],
    ["qA", "d,e,f", "qA"],
  ],
  ["d", "e", "f"],
)

export const nfaSplit = nfa(
  ["r0", "r1", "r2", "E", "O"],
  "r0",
  ["r0", "E"],
  [
    ["r0", "a,b", "r1"],
    ["r1", "a,b", "r2"],
    ["r2", "a,b", "r0"],
    ["r0", "a", "E"],
    ["r0", "b", "O"],
    ["E", "a", "E"],
    ["E", "b", "O"],
    ["O", "b", "E"],
    ["O", "a", "O"],
  ],
  ["a", "b"],
)

export const nfaMissing = nfa(
  ["s", "na", "nb", "nc"],
  "s",
  ["s", "na", "nb", "nc"],
  [
    ["s", "a", "nb"],
    ["s", "a", "nc"],
    ["s", "b", "na"],
    ["s", "b", "nc"],
    ["s", "c", "na"],
    ["s", "c", "nb"],
    ["na", "b,c", "na"],
    ["nb", "a,c", "nb"],
    ["nc", "a,b", "nc"],
  ],
  ["a", "b", "c"],
)

export const enfaAbAcd = nfa(
  ["q0", "qa", "p0", "p1", "r0", "r1", "r2"],
  "q0",
  ["p1", "r2"],
  [
    ["q0", "a", "qa"],
    ["qa", "ε", "p0"],
    ["qa", "ε", "r0"],
    ["p0", "b", "p1"],
    ["r0", "c", "r1"],
    ["r1", "d", "r2"],
  ],
  ["a", "b", "c", "d"],
)

/** The slides' ε-removal example over {0,1}. */
export const enfaExample = nfa(
  ["q0", "q1", "q2", "q3", "q4"],
  "q0",
  ["q4"],
  [
    ["q0", "ε", "q1"],
    ["q1", "0", "q2"],
    ["q1", "1", "q3"],
    ["q3", "ε", "q1"],
    ["q2", "ε", "q4"],
    ["q3", "1", "q4"],
  ],
  ["0", "1"],
)
export const enfaExampleRemoved = removeEpsilon(enfaExample)

/** Strings containing aba; converted by subset construction on the slides. */
export const nfaAba = nfa(["q0", "q1", "q2", "q3"], "q0", ["q3"], [["q0", "a,b", "q0"], ["q0", "a", "q1"], ["q1", "b", "q2"], ["q2", "a", "q3"], ["q3", "a,b", "q3"]], ["a", "b"])
export const dfaAba = subsetConstruction(nfaAba).dfa

/** n-th symbol from the end is 1, for n = 3: n + 1 = 4 states. */
export const nfaThirdLast = nfa(["q0", "q1", "q2", "q3"], "q0", ["q3"], [["q0", "0,1", "q0"], ["q0", "1", "q1"], ["q1", "0,1", "q2"], ["q2", "0,1", "q3"]], ["0", "1"])
export const dfaThirdLast = subsetConstruction(nfaThirdLast).dfa

/** True when the machine accepts exactly the same strings as `ref` (up to maxLen). */
const sameAs = (ref: FA) => (w: string) => faAccepts(ref, w)

export const nfaNoteChecks: Check[] = [
  { id: "note-nfa-101", machine: nfa101, alphabet: ["0", "1"], maxLen: 11, inL: (w) => w.includes("101") },
  { id: "note-nfa-fed-dff", machine: nfaFedDff, alphabet: ["d", "e", "f"], maxLen: 7, inL: (w) => w.includes("fed") || w.includes("dff") },
  {
    id: "note-nfa-split",
    machine: nfaSplit,
    alphabet: ["a", "b"],
    maxLen: 11,
    inL: (w) => [...Array(w.length + 1).keys()].some((i) => i % 3 === 0 && count(w.slice(i), "b") % 2 === 0),
  },
  { id: "note-nfa-missing", machine: nfaMissing, alphabet: ["a", "b", "c"], maxLen: 7, inL: (w) => !(w.includes("a") && w.includes("b") && w.includes("c")) },
  { id: "note-enfa-ab-acd", machine: enfaAbAcd, alphabet: ["a", "b", "c", "d"], maxLen: 5, inL: (w) => w === "ab" || w === "acd" },
  // The slides' example has no stated language; the converted machines must match the original exactly.
  { id: "note-enfa-removed-same", machine: enfaExampleRemoved, alphabet: ["0", "1"], maxLen: 11, inL: sameAs(enfaExample) },
  { id: "note-enfa-example-lang", machine: enfaExample, alphabet: ["0", "1"], maxLen: 11, inL: (w) => /^1*0$|^11+$/.test(w) },
  { id: "note-nfa-aba", machine: nfaAba, alphabet: ["a", "b"], maxLen: 11, inL: (w) => w.includes("aba") },
  { id: "note-dfa-aba", machine: dfaAba, dfa: true, alphabet: ["a", "b"], maxLen: 11, inL: (w) => w.includes("aba") },
  { id: "note-nfa-third-last", machine: nfaThirdLast, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length >= 3 && w[w.length - 3] === "1" },
  { id: "note-dfa-third-last", machine: dfaThirdLast, dfa: true, alphabet: ["0", "1"], maxLen: 10, inL: (w) => w.length >= 3 && w[w.length - 3] === "1" },
]

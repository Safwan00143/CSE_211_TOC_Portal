import { dfaAba, enfaAbAcd, enfaExample, nfa101, nfaAba, nfaFedDff, nfaMissing, nfaSplit, nfaThirdLast } from "@/content/machines/notes-nfa"
import { StateDiagram } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/** "{q0,q1}" → "{q_0,q_1}" for drawing subset states. */
const setNames = (states: string[]) =>
  Object.fromEntries(states.map((s) => [s, s.replace(/q(\d+)/g, "q_$1")]))

export const nfaNoteFigures: FigureMap = {
  "nfa-101": {
    caption: r`On a 1, $q_0$ may stay (ignore it) or move to $q_1$ (guess that 101 starts here). Missing arrows, such as $q_1$ on 1, mean that branch dies.`,
    node: <StateDiagram machine={nfa101} layout={{ pos: { q0: [0, 0], q1: [130, 0], q2: [260, 0], q3: [390, 0] } }} />,
  },
  "nfa-fed-dff": {
    caption: r`$q_0$ scans and, on f or d, may guess that fed or dff begins. Either completed pattern reaches $q_A$, which keeps everything.`,
    node: (
      <StateDiagram
        machine={nfaFedDff}
        layout={{
          pos: { q0: [0, 90], qf: [130, 0], qfe: [260, 0], qA: [390, 90], qd: [130, 180], qdf: [260, 180] },
          names: { qf: "q_f", qfe: "q_{fe}", qd: "q_d", qdf: "q_{df}", qA: "q_A" },
          edges: { "q0>q0": { loop: 180 }, "qA>qA": { loop: 0 } },
          startFrom: 225,
        }}
      />
    ),
  },
  "nfa-split": {
    caption: r`$r_0, r_1, r_2$ count $|w_1| \bmod 3$. Only from $r_0$ may the machine guess that $w_2$ starts, moving to $E$ or $O$ (even or odd number of b's in $w_2$).`,
    node: (
      <StateDiagram
        machine={nfaSplit}
        layout={{
          pos: { r0: [0, 0], r1: [150, 0], r2: [300, 0], E: [0, 150], O: [150, 150] },
          edges: { "r2>r0": { bend: -55 }, "E>E": { loop: 90 }, "O>O": { loop: 90 } },
        }}
      />
    ),
  },
  "nfa-missing": {
    caption: r`On the first symbol, $s$ guesses which symbol will never appear. A branch dies the moment it reads its forbidden symbol. Every state accepts.`,
    node: (
      <StateDiagram
        machine={nfaMissing}
        layout={{
          pos: { s: [0, 110], na: [170, 0], nb: [170, 110], nc: [170, 220] },
          names: { na: "q_{¬a}", nb: "q_{¬b}", nc: "q_{¬c}" },
          radius: { na: 24, nb: 24, nc: 24 },
          edges: { "na>na": { loop: 0 }, "nb>nb": { loop: 0 }, "nc>nc": { loop: 0 } },
        }}
      />
    ),
  },
  "enfa-ab-acd": {
    caption: r`After the common a, free ε-moves jump into the b module and the cd module at the same time. Whichever matches the rest of the input survives.`,
    node: (
      <StateDiagram
        machine={enfaAbAcd}
        layout={{
          pos: { q0: [0, 60], qa: [115, 60], p0: [230, 0], p1: [345, 0], r0: [230, 120], r1: [345, 120], r2: [460, 120] },
          names: { qa: "q_a" },
        }}
      />
    ),
  },
  "enfa-example": {
    caption: r`The slides' ε-NFA. Its language is $1^*0 \cup 11^+$: some 1's then a 0, or at least two 1's.`,
    node: (
      <StateDiagram
        machine={enfaExample}
        layout={{ pos: { q0: [0, 80], q1: [140, 80], q2: [280, 0], q3: [280, 160], q4: [420, 0] } }}
      />
    ),
  },
  "nfa-aba": {
    caption: r`NFA for strings containing aba: $q_0$ guesses where aba starts.`,
    node: <StateDiagram machine={nfaAba} layout={{ pos: { q0: [0, 0], q1: [130, 0], q2: [260, 0], q3: [390, 0] } }} />,
  },
  "dfa-aba": {
    wide: true,
    caption: r`The subset construction's DFA. Only 6 of the 16 subsets are reachable. Each state is the set of NFA states alive after the input so far.`,
    node: (
      <StateDiagram
        machine={dfaAba}
        layout={{
          pos: {
            "{q0}": [0, 0],
            "{q0,q1}": [150, 0],
            "{q0,q2}": [300, 0],
            "{q0,q1,q3}": [460, 0],
            "{q0,q2,q3}": [460, 160],
            "{q0,q3}": [270, 160],
          },
          names: setNames(dfaAba.states),
          radius: Object.fromEntries(dfaAba.states.map((s) => [s, s.length > 9 ? 40 : 32])),
          edges: {
            "{q0,q2}>{q0}": { bend: 55 },
            "{q0,q1,q3}>{q0,q1,q3}": { loop: 0 },
            "{q0,q3}>{q0,q3}": { loop: 90 },
          },
        }}
      />
    ),
  },
  "nfa-third-last": {
    caption: r`$n+1=4$ states recognise "the 3rd symbol from the end is 1". The DFA needs $2^3=8$.`,
    node: <StateDiagram machine={nfaThirdLast} layout={{ pos: { q0: [0, 0], q1: [130, 0], q2: [260, 0], q3: [390, 0] } }} />,
  },
}

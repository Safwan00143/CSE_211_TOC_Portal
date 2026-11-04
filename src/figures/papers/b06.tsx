import { b06g13, b06pda5, b06q1b, b06tm01 } from "@/content/machines/b06"
import { CykTriangle, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))

export const paperB06Figures: FigureMap = {
  "b06-1b": {
    caption: r`$s$: every a so far has been followed by a b (accepting); $w$: the last symbol was an a, waiting for its b; $d$: an a was followed by another a (dead).`,
    node: <StateDiagram machine={b06q1b} layout={{ pos: { s: [0, 0], w: [160, 0], d: [320, 0] }, edges: { "s>s": { loop: -90 }, "s>w": { bend: 18 }, "w>s": { bend: 18 }, "d>d": { loop: -90 } } }} />,
  },
  "b06-5": {
    wide: true,
    caption: r`Push X per a; read any c's; then each pair bc pops one X ($q_b\to q_m\to q_b$); accept when the bottom marker is exposed.`,
    node: (
      <StateDiagram
        machine={b06pda5}
        layout={{ pos: { qs: [0, 0], qa: [140, 0], qc: [280, 0], qb: [420, 0], qm: [420, 160], qacc: [580, 0] }, names: { qs: "q_s", qa: "q_a", qc: "q_c", qb: "q_b", qm: "q_m", qacc: "q_{acc}" }, radius: { qacc: 24 }, edges: { "qa>qa": { loop: -90 }, "qc>qc": { loop: -90 }, "qb>qm": { bend: 18 }, "qm>qb": { bend: 18 } } }}
      />
    ),
  },
  "b06-7": {
    wide: true,
    caption: r`HMU's machine for $0^n1^n$: $q_0$ marks a 0 as X, $q_1$ finds the matching 1 and marks it Y, $q_2$ returns to the last X; when no 0 is left, $q_3$ checks only Y's remain.`,
    node: (
      <StateDiagram
        machine={b06tm01}
        layout={{ pos: { q0: [0, 0], q1: [180, 0], q2: [180, 170], q3: [0, 170], q4: [0, 320] }, names: sub(b06tm01.states), edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: 0 }, "q3>q3": { loop: 180 } } }}
      />
    ),
  },
  "b06-13": {
    caption: r`CYK for abaab. $S$ is in the top cell, so abaab $\in L(G)$.`,
    node: <CykTriangle grammar={b06g13} word="abaab" highlight={[[0, 4]]} />,
  },
}

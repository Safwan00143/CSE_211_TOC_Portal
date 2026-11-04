import { b17q1cSubset, b17q2, b17q2Nfa, b17q4b, b17q4bSubset } from "@/content/machines/b17"
import { b22g6 } from "@/content/machines/b22"
import { Containment, CykTriangle, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const letters = (states: string[]) => Object.fromEntries(states.map((q, i) => [q, "ABCDE"[i]]))

export const paperB17Figures: FigureMap = {
  "b17-1c": {
    caption: r`Subset construction for the NFA. $\{p\}$: no b or c yet; $\{p,q\}$: exactly one b and no c; $\{p,q,r\}$: a c, or a second b, has been read. Only the last accepts.`,
    node: (
      <StateDiagram
        machine={b17q1cSubset.dfa}
        layout={{
          pos: { "{p}": [0, 0], "{p,q}": [170, 0], "{p,q,r}": [340, 0] },
          radius: { "{p}": 26, "{p,q}": 30, "{p,q,r}": 36 },
          edges: { "{p}>{p}": { loop: -90 }, "{p,q}>{p,q}": { loop: -90 }, "{p,q,r}>{p,q,r}": { loop: -90 }, "{p}>{p,q,r}": { bend: -50 } },
        }}
      />
    ),
  },
  "b17-2a": {
    caption: r`The DFA in Question 2(a), as printed. $q_1$/$q_2$: last symbol 0/1 (not repeated); $q_3$/$q_4$: last two symbols 00/11.`,
    node: (
      <StateDiagram
        machine={b17q2}
        layout={{
          pos: { q0: [0, 110], q1: [150, 0], q2: [150, 220], q3: [330, 0], q4: [330, 220] },
          names: sub(b17q2.states),
          edges: { "q1>q2": { bend: 20 }, "q2>q1": { bend: 20 }, "q3>q3": { loop: 0 }, "q4>q4": { loop: 0 }, "q3>q2": { t: 0.25 }, "q4>q1": { t: 0.25 } },
        }}
      />
    ),
  },
  "b17-2b": {
    caption: r`An NFA for the same language: loop in $s$ on anything, then guess that the last two symbols start now (00 through $z_1$, or 11 through $o_1$).`,
    node: (
      <StateDiagram
        machine={b17q2Nfa}
        layout={{ pos: { s: [0, 80], z1: [150, 0], o1: [150, 160], f: [300, 80] }, names: { z1: "z_1", o1: "o_1" }, edges: { "s>s": { loop: -90 } } }}
      />
    ),
  },
  "b17-4b": {
    wide: true,
    caption: r`The NFA in Question 4(b), as printed: $q_1$–$q_6$ form $(0\cup1)^*$ (with the ε-edges $q_0\to q_6$ and $q_6\to q_1$), followed by 011.`,
    node: (
      <StateDiagram
        machine={b17q4b}
        layout={{
          pos: { q0: [0, 90], q1: [100, 90], q2: [200, 20], q3: [300, 20], q4: [200, 160], q5: [300, 160], q6: [400, 90], q7: [500, 90], q8: [600, 90], q9: [700, 90], q10: [800, 90] },
          names: sub(b17q4b.states),
          radius: { q10: 24 },
          edges: { "q6>q1": { bend: -130 }, "q0>q6": { bend: -190 } },
        }}
      />
    ),
  },
  "b17-4b-dfa": {
    wide: true,
    caption: r`The DFA, with $A$–$E$ naming the subsets in the order they were found. $B$: just read a 0; $C$: no progress towards 011; $D$: read 01; $E$: read 011 (accepting).`,
    node: (
      <StateDiagram
        machine={b17q4bSubset.dfa}
        layout={{
          pos: Object.fromEntries(b17q4bSubset.dfa.states.map((q, i) => [q, [[0, 110], [170, 0], [170, 220], [340, 0], [510, 0]][i] as [number, number]])),
          edges: (([A, B, C, , E]) => ({ [`${E}>${B}`]: { bend: -60 }, [`${C}>${C}`]: { loop: 90 }, [`${B}>${B}`]: { loop: -90 }, [`${A}>${A}`]: { loop: 180 } }))(b17q4bSubset.dfa.states),
          names: letters(b17q4bSubset.dfa.states),
        }}
      />
    ),
  },
  "b17-7": {
    caption: r`CYK for 10011. $S$ is in the top cell, so $10011\in L(G)$.`,
    node: <CykTriangle grammar={b22g6} word="10011" highlight={[[0, 4]]} />,
  },
  "b17-12b": {
    wide: true,
    caption: r`P ⊆ NP ⊆ PSPACE = NPSPACE ⊆ EXPTIME. P ≠ EXPTIME is proved (time hierarchy theorem); every other inclusion is believed proper but not proved.`,
    node: (
      <Containment
        width={560}
        root={{ label: "EXPTIME", children: [{ label: "PSPACE = NPSPACE", children: [{ label: "NP", children: [{ label: "P", tone: "accent" }] }] }] }}
      />
    ),
  },
}

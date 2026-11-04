import { b09given, b09mod3is1, b09no110, b09pal, b09pda12d, b09q3Subset, b09tmPow } from "@/content/machines/b09"
import { StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const letters = Object.fromEntries(b09q3Subset.dfa.states.map((q, i) => [q, "ABCDEFGH"[i]]))

export const paperB09Figures: FigureMap = {
  "b09-2": {
    caption: r`$q_i$: the number of a's so far is $\equiv i \pmod 3$. b loops; a moves on. Accept in $q_1$.`,
    node: <StateDiagram machine={b09mod3is1} layout={{ pos: { q0: [0, 0], q1: [150, 0], q2: [300, 0] }, names: sub(b09mod3is1.states), edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 }, "q2>q2": { loop: -90 }, "q2>q0": { bend: 45 } } }} />,
  },
  "b09-3": {
    wide: true,
    caption: r`The DFA by lazy evaluation (only subsets reachable from $\{p\}$), named $A, B, \dots$ in the order found. A set is accepting when it contains $s$ or $t$.`,
    node: (
      <StateDiagram
        machine={b09q3Subset.dfa}
        layout={{
          pos: Object.fromEntries(b09q3Subset.dfa.states.map((q, i) => [q, ([[0, 100], [170, 100], [340, 0], [340, 200], [510, 0], [510, 200], [680, 100], [680, 260]] as [number, number][])[i]])),
          names: letters,
        }}
      />
    ),
  },
  "b09-4": {
    caption: r`$s$: no 1 at the end; $o$: one 1 at the end; $oo$: two or more 1s at the end, so a 0 now would complete 110 ($d$, dead).`,
    node: <StateDiagram machine={b09no110} layout={{ pos: { s: [0, 0], o: [150, 0], oo: [300, 0], d: [450, 0] }, names: { oo: "oo" }, edges: { "s>s": { loop: -90 }, "oo>oo": { loop: -90 }, "d>d": { loop: -90 }, "s>o": { bend: 18 }, "o>s": { bend: 18 } } }} />,
  },
  "b09-11b": {
    wide: true,
    caption: r`Sipser's halving machine with the b as an end marker: blank out the first a, then sweep right crossing off every other a. One a left: accept (after checking nothing follows the b). An odd number greater than 1: reject (no move from $q_4$ on b). Otherwise return ($q_5$) and sweep again.`,
    node: (
      <StateDiagram
        machine={b09tmPow}
        layout={{ pos: { q1: [0, 0], q2: [160, 0], q3: [330, 0], q4: [500, 0], q5: [330, 170], q6: [160, 170], qa: [0, 170] }, names: { ...sub(b09tmPow.states), qa: "q_{acc}" }, radius: { qa: 24 }, edges: { "q2>q2": { loop: -90 }, "q3>q3": { loop: -90 }, "q4>q4": { loop: -90 }, "q5>q5": { loop: 90 }, "q3>q4": { bend: 18 }, "q4>q3": { bend: 18 } } }}
      />
    ),
  },
  "b09-12d": {
    caption: r`The one-state PDA for $S\to TX$, $T\to0T0\mid1T1\mid\#X$, $X\to0X\mid1X\mid\varepsilon$ (acceptance by empty stack).`,
    node: <StateDiagram machine={b09pda12d} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
  "b09-13a": {
    caption: r`Push the first half; guess the middle, either between two symbols (ε) or on a single middle symbol that is read and not pushed; pop and match the rest; accept when the bottom marker is exposed.`,
    node: <StateDiagram machine={b09pal} layout={{ pos: { qs: [0, 0], qp: [150, 0], qm: [320, 0], qacc: [470, 0] }, names: { qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" }, radius: { qacc: 24 }, edges: { "qp>qp": { loop: -90 }, "qm>qm": { loop: -90 } } }} />,
  },
  "b09-13c": {
    caption: r`The PDA of Question 13(c), as printed.`,
    node: <StateDiagram machine={b09given} layout={{ pos: { q1: [0, 0], q2: [200, 0], q3: [200, 150], q4: [0, 150] }, names: sub(b09given.states), edges: { "q2>q2": { loop: 0 }, "q3>q3": { loop: 0 } } }} />,
  },
}

import { b11midA, b11mult5, b11pda1, b11q7b, b11tmPar, b11tmWww } from "@/content/machines/b11"
import { StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))

export const paperB11Figures: FigureMap = {
  "b11-1a": {
    caption: r`The one-state PDA for $S\to BS\mid A$, $A\to0A\mid\varepsilon$, $B\to BB1\mid2$ (HMU construction, acceptance by empty stack): expand the variable on top, or match a terminal on top.`,
    node: <StateDiagram machine={b11pda1} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
  "b11-3b": {
    wide: true,
    caption: r`Cross off the first unmarked symbol $c$ of the first copy ($c_a$/$c_b$ remember it), the first unmarked symbol of the second copy ($m$, must be $c$) and of the third ($n$, must be $c$); return to the left end. When the first copy is used up, $q_9$, $q_{10}$ check that only x's remain. Missing moves reject.`,
    node: (
      <StateDiagram
        machine={b11tmWww}
        layout={{
          pos: { q1: [0, 160], ca: [140, 0], ma: [280, 0], da: [420, 0], na: [560, 0], cb: [140, 320], mb: [280, 320], db: [420, 320], nb: [560, 320], back: [560, 160], q9: [0, 470], q10: [150, 470], qa: [300, 470] },
          names: { q1: "q_1", ca: "c_a", cb: "c_b", ma: "m_a", mb: "m_b", da: "d_a", db: "d_b", na: "n_a", nb: "n_b", back: "back", q9: "q_9", q10: "q_{10}", qa: "q_{acc}" },
          radius: { back: 26, qa: 24 },
          edges: { "q1>q1": { loop: -90 }, "ca>ca": { loop: -90 }, "ma>ma": { loop: -90 }, "da>da": { loop: -90 }, "na>na": { loop: -90 }, "cb>cb": { loop: 90 }, "mb>mb": { loop: 90 }, "db>db": { loop: 90 }, "nb>nb": { loop: 90 }, "back>back": { loop: 0 }, "q9>q9": { loop: 180 }, "q10>q10": { loop: 90 } },
        }}
      />
    ),
  },
  "b11-3c": {
    wide: true,
    caption: r`$e$/$o$: the number of symbols read so far is even/odd. At the end, $w_0$ (even) or $w_1$ (odd) walks back to #, overwriting every symbol with 0 or 1, then accepts.`,
    node: (
      <StateDiagram
        machine={b11tmPar}
        layout={{ pos: { q0: [0, 80], e: [150, 0], o: [150, 160], w0: [320, 0], w1: [320, 160], qa: [470, 80] }, names: { q0: "q_0", w0: "w_0", w1: "w_1", qa: "q_{acc}" }, radius: { qa: 24 }, edges: { "e>o": { bend: 16 }, "o>e": { bend: 16 }, "w0>w0": { loop: -90 }, "w1>w1": { loop: 90 } } }}
      />
    ),
  },
  "b11-4c": {
    caption: r`Push an X for each symbol of the first half; guess the middle a (move to $q_m$ without pushing); pop one X per symbol of the second half; accept when the bottom marker is exposed, so both halves have equal length.`,
    node: (
      <StateDiagram
        machine={b11midA}
        layout={{ pos: { qs: [0, 0], qp: [150, 0], qm: [320, 0], qacc: [470, 0] }, names: { qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" }, radius: { qacc: 24 }, edges: { "qp>qp": { loop: -90 }, "qm>qm": { loop: -90 } } }}
      />
    ),
  },
  "b11-7b": {
    caption: r`The DFA of Question 7(b), as printed.`,
    node: (
      <StateDiagram
        machine={b11q7b}
        layout={{ pos: { "1": [0, 0], "2": [200, 0], "3": [100, 160] }, edges: { "1>2": { bend: -16 }, "2>1": { bend: -16 }, "1>3": { bend: 16 }, "3>1": { bend: 16 }, "2>2": { loop: -90 } } }}
      />
    ),
  },
  "b11-7c": {
    wide: true,
    caption: r`$r_i$: the value so far is $\equiv i \pmod 5$; bit $b$ sends $r_i$ to $r_{(2i+b) \bmod 5}$. $s$: nothing read yet. Accept in $r_0$.`,
    node: (
      <StateDiagram
        machine={b11mult5}
        layout={{
          pos: { s: [0, 100], r1: [140, 100], r0: [300, -20], r2: [300, 220], r3: [460, 100], r4: [620, 220] },
          names: sub(b11mult5.states),
          edges: { "r0>r0": { loop: -90 }, "r4>r4": { loop: 0 }, "r1>r3": { bend: 16, t: 0.72 }, "r3>r1": { bend: 16, t: 0.72 } },
        }}
      />
    ),
  },
}

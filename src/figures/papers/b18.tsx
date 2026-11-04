import { b18anbn3, b18base3, b18re3a, b18sum5 } from "@/content/machines/b18"
import { b22g6 } from "@/content/machines/b22"
import { CykTriangle, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))

export const paperB18Figures: FigureMap = {
  "b18-1c": {
    wide: true,
    caption: r`$r_i$: the sum so far is $\equiv i \pmod 5$. Digit $d$ moves $r_i$ to $r_{(i+d) \bmod 5}$; 0 loops; R always returns to $r_0$. Accepting: $r_1$, $r_2$.`,
    node: (
      <StateDiagram
        machine={b18sum5}
        layout={{
          pos: { r0: [0, -170], r1: [162, -53], r2: [100, 138], r3: [-100, 138], r4: [-162, -53] },
          names: sub(b18sum5.states),
          startFrom: -150,
          edges: {
            "r0>r0": { loop: -60 },
            "r1>r1": { loop: -18 },
            "r2>r2": { loop: 54 },
            "r3>r3": { loop: 126 },
            "r4>r4": { loop: 198 },
            "r0>r1": { bend: 16 },
            "r1>r0": { bend: 16 },
            "r0>r2": { bend: 16 },
            "r2>r0": { bend: 16 },
          },
        }}
      />
    ),
  },
  "b18-2c": {
    wide: true,
    caption: r`$s$: nothing read. $r_i$: the number read so far is $\equiv i \pmod 4$. Appending base-3 digit $d$ turns value $v$ into $3v+d$, so $r_i \to r_{(3i+d) \bmod 4}$. Accepting: $r_1,r_2,r_3$.`,
    node: (
      <StateDiagram
        machine={b18base3}
        layout={{
          pos: { s: [20, -150], r0: [170, 0], r1: [400, 0], r2: [170, 260], r3: [400, 260] },
          names: sub(b18base3.states),
          edges: {
            "s>r1": { bend: 30, t: 0.6 }, "r0>r0": { loop: 180 }, "r1>r1": { loop: 0 }, "r2>r2": { loop: 180 }, "r3>r3": { loop: 0 },
            "r0>r1": { bend: 16 }, "r1>r0": { bend: 16 }, "r1>r3": { bend: 16 }, "r3>r1": { bend: 16 },
            "r3>r2": { bend: 16 }, "r2>r3": { bend: 16 }, "r2>r0": { bend: 16 }, "r0>r2": { bend: 16 },
          },
        }}
      />
    ),
  },
  "b18-3a": {
    wide: true,
    caption: r`$((a^*)a)^*$ by basic principles. $q_1,q_2$: the NFA for a, starred with new accepting start $q_3$; $q_4,q_5$: the NFA for a, concatenated after it; $q_6$: the outer star's new accepting start, with $q_5$ looping back to $q_3$.`,
    node: (
      <StateDiagram
        machine={b18re3a}
        layout={{
          pos: { q6: [0, 60], q3: [120, 60], q1: [240, 0], q2: [360, 0], q4: [360, 130], q5: [480, 130] },
          names: sub(b18re3a.states),
          edges: { "q2>q1": { bend: -40 }, "q5>q3": { bend: 70, t: 0.7 } },
        }}
      />
    ),
  },
  "b18-3b": {
    wide: true,
    caption: r`$p_k$: read $k$ a's. $r_k$: still need exactly $k$ b's. After $n$ a's, the first b moves to "need $n-1$ more", so the b-paths for $n=1,2,3$ share states. $p_0$ accepts $\varepsilon$; $f$ accepts a completed $a^nb^n$. 7 states.`,
    node: (
      <StateDiagram
        machine={b18anbn3}
        layout={{
          pos: { p0: [0, 0], p1: [130, 0], p2: [260, 0], p3: [390, 0], r2: [390, 150], r1: [260, 150], f: [130, 150] },
          names: sub(b18anbn3.states),
        }}
      />
    ),
  },
  "b18-7": {
    caption: r`CYK for 01100. $S$ is in the top cell, so $01100\in L(G)$.`,
    node: <CykTriangle grammar={b22g6} word="01100" highlight={[[0, 4]]} />,
  },
}

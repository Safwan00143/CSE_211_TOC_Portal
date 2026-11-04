import { b16aba, b16colouring, b16g7Cnf, b16gap, b16graph, b16mult5, b16pda, b16pow2 } from "@/content/machines/b16"
import { ColourGraph, CykTriangle, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))

const graphPos: Record<string, [number, number]> = {
  T: [250, -60], F: [430, -60], N: [340, 0],
  x1: [30, 110], "~x1": [100, 110], x2: [180, 110], "~x2": [250, 110], x3: [430, 110], "~x3": [500, 110], x4: [580, 110], "~x4": [650, 110],
  p1a: [60, 220], q1a: [200, 220], o1a: [130, 290], p1b: [160, 370], q1b: [300, 370], o1b: [230, 440],
  p2a: [390, 220], q2a: [500, 220], o2a: [445, 290], p2b: [480, 370], q2b: [610, 370], o2b: [545, 440],
}
const label = (id: string) => (id.startsWith("~") ? `¬${id.slice(1).replace(/(\d)/, "_$1")}` : id.replace(/^([a-z])(\d)([ab])?$/, (_, l, d, s) => `${l}_{${d}${s ?? ""}}`))

export const paperB16Figures: FigureMap = {
  "b16-1c": {
    wide: true,
    caption: r`The graph for $(x_1\lor\bar x_2\lor\bar x_3)\land(x_1\lor x_3\lor x_4)$, coloured for $x_1=$ true and $x_2,x_3,x_4=$ false. Green: the colour of T (true); amber: F (false); grey: N (neutral). Each clause is two chained OR gadgets ($p,q,o$); the final $o$ of each clause is joined to F and N, so it must be green.`,
    node: (
      <ColourGraph
        nodes={b16graph.nodes.map((id) => ({ id, label: label(id), at: graphPos[id] }))}
        edges={b16graph.edges}
        colouring={b16colouring ?? {}}
      />
    ),
  },
  "b16-2b-i": {
    wide: true,
    caption: r`$r_i$: the number read so far is $\equiv i \pmod 5$; reading bit $b$ sends $r_i$ to $r_{(2i+b) \bmod 5}$. $s$ insists on a leading 1; $d$ is dead. Accept in $r_0$.`,
    node: (
      <StateDiagram
        machine={b16mult5}
        layout={{
          pos: { s: [0, 100], d: [0, 260], r1: [140, 100], r0: [300, -20], r2: [300, 220], r3: [460, 100], r4: [620, 220] },
          names: sub(b16mult5.states),
          edges: { "d>d": { loop: 0 }, "r0>r0": { loop: -90 }, "r4>r4": { loop: 0 }, "r1>r3": { bend: 16, t: 0.72 }, "r3>r1": { bend: 16, t: 0.72 } },
        }}
      />
    ),
  },
  "b16-2b-ii": {
    caption: r`Powers of 2 in binary are exactly $10^*$: a 1 ($o$, which is $2^0=1$) followed by any number of 0s ($z$). Anything else goes to the dead state $d$.`,
    node: <StateDiagram machine={b16pow2} layout={{ pos: { s: [0, 0], o: [140, 0], z: [280, 0], d: [140, 140] }, edges: { "z>z": { loop: -90 }, "d>d": { loop: 0 } } }} />,
  },
  "b16-2c": {
    wide: true,
    caption: r`$(a\cup b)^*aba$ by the closure constructions: the union of the NFAs for a and b, starred (new accepting start), then concatenated with the NFAs for a, b and a.`,
    node: (
      <StateDiagram
        machine={b16aba}
        layout={{
          pos: { q6: [0, 100], q5: [120, 100], q1: [240, 0], q2: [360, 0], q3: [240, 200], q4: [360, 200], q7: [480, 100], q8: [590, 100], q9: [700, 100], q10: [810, 100], q11: [920, 100], q12: [1030, 100] },
          edges: { "q6>q7": { bend: -170 }, "q2>q5": { bend: 30, t: 0.3 }, "q4>q5": { bend: -30, t: 0.3 } },
          names: sub(b16aba.states),
        }}
      />
    ),
  },
  "b16-3a": {
    wide: true,
    caption: r`$s$ skips any prefix and guesses the first 0 ($g_0$). $g_1\ldots g_4$ count the characters after it mod 4 (at least 4); a 0 read in $g_4$ ends a gap whose length is a nonzero multiple of 4, and $f$ accepts the rest.`,
    node: (
      <StateDiagram
        machine={b16gap}
        layout={{
          pos: { s: [0, 0], g0: [120, 0], g1: [240, 0], g2: [360, 0], g3: [480, 0], g4: [600, 0], f: [720, 0] },
          names: sub(b16gap.states),
          edges: { "s>s": { loop: -90 }, "f>f": { loop: -90 }, "g4>g1": { bend: 60 } },
        }}
      />
    ),
  },
  "b16-7": {
    caption: r`CYK for 01101 with the CNF grammar. $S$ is in the top cell, so $01101\in L(G)$.`,
    node: <CykTriangle grammar={b16g7Cnf.grammar} word="01101" highlight={[[0, 4]]} />,
  },
  "b16-8": {
    wide: true,
    caption: r`Push A per a and pop one per b; when Z is exposed ($q_m$), push C per c and pop one per d. Taking the first a, b, c, d on separate moves forces $n,m\ge1$.`,
    node: (
      <StateDiagram
        machine={b16pda}
        layout={{
          pos: { qs: [0, 0], qa: [130, 0], qb: [270, 0], qm: [410, 0], qc: [410, 150], qd: [270, 150], qacc: [130, 150] },
          names: { qs: "q_s", qa: "q_a", qb: "q_b", qm: "q_m", qc: "q_c", qd: "q_d", qacc: "q_{acc}" },
          radius: { qacc: 24 },
          edges: { "qa>qa": { loop: -90 }, "qb>qb": { loop: -90 }, "qc>qc": { loop: 0 }, "qd>qd": { loop: 90 } },
        }}
      />
    ),
  },
}

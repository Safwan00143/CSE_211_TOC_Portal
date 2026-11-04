import {
  b22aMod3,
  b22aOnly,
  b22aStar,
  b22awa,
  b22concat,
  b22g5,
  b22g6,
  b22n1,
  b22nEmpty,
  b22pda,
  b22q1b,
  b22three,
  b22two,
} from "@/content/machines/b22"
import { rootBody, treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Containment, CykTriangle, Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw

/* Q1(b): rows are c = 0, 1, 2 completed three-runs; columns are the current a-block length r = 0..4 (4 = "four or more"). */
const q1bPos: Record<string, [number, number]> = { D: [390, 650] }
for (let c = 0; c <= 2; c++) for (let k = 0; k <= 4; k++) q1bPos[`${c},${k}`] = [k * 130, c * 230]
const q1bEdges: Record<string, { bend?: number; loop?: number; side?: 1 | -1; t?: number }> = {}
for (let c = 0; c <= 2; c++) {
  q1bEdges[`${c},0>${c},0`] = { loop: 180 }
  q1bEdges[`${c},4>${c},4`] = { loop: 0 }
  q1bEdges[`${c},0>${c},1`] = { bend: 14 }
  q1bEdges[`${c},1>${c},0`] = { bend: -46 }
  q1bEdges[`${c},2>${c},0`] = { bend: 48, t: 0.2 }
  q1bEdges[`${c},4>${c},0`] = { bend: 88, t: 0.12 }
  if (c < 2) q1bEdges[`${c},3>${c + 1},0`] = { bend: -25, t: 0.3 }
}
q1bEdges["2,3>D"] = { t: 0.75, side: -1 }
q1bEdges["D>D"] = { loop: 90 }
q1bEdges["0,0>0,0"] = { loop: 235 }
const q1bNames = Object.fromEntries(Object.keys(q1bPos).map((s) => [s, s === "D" ? "D" : s]))

const [abcViaAC] = treesOf(b22g5, "abc", { pick: (t) => rootBody(t) === "AC" })
const [abcViaB] = treesOf(b22g5, "abc", { pick: (t) => rootBody(t) === "B" })

export const paperB22Figures: FigureMap = {
  "b22-1b": {
    wide: true,
    caption: r`State $c,r$: $c$ runs of exactly three a's have been completed, and the current block of a's has length $r$ (4 means four or more). A b ends the block: if it had length exactly 3, $c$ goes up. $D$ (dead): a third such run. Every state accepts except $D$ and $2,3$ (ending there would complete a third run).`,
    node: <StateDiagram machine={b22q1b} layout={{ pos: q1bPos, names: q1bNames, edges: q1bEdges, startFrom: 180 }} />,
  },
  "b22-1c": {
    wide: true,
    caption: r`Left: $N_1$ for at least three 1's. Middle: $N_2$ for $\emptyset$, one non-accepting state. Right: the concatenation construction adds an ε-move from $N_1$'s accepting state $q_3$ to $N_2$'s start $r_0$; only $N_2$'s accepting states accept, and it has none.`,
    node: (
      <Row>
        <Panel title="N₁: at least three 1's">
          <StateDiagram machine={b22n1} layout={{ pos: { q0: [0, 0], q1: [110, 0], q2: [220, 0], q3: [330, 0] } }} />
        </Panel>
        <Panel title="N₂: ∅">
          <StateDiagram machine={b22nEmpty} layout={{ pos: { r0: [0, 0] } }} />
        </Panel>
        <Panel title="N: concatenation">
          <StateDiagram machine={b22concat} layout={{ pos: { q0: [0, 0], q1: [110, 0], q2: [220, 0], q3: [330, 0], r0: [440, 0] } }} />
        </Panel>
      </Row>
    ),
  },
  "b22-2a": {
    caption: r`$p=3$ states. On aaab the run is $q_0,q_1,q_2,q_0,q_0$: $q_0$ repeats after the first 3 symbols, so $x=\varepsilon$, $y=aaa$, $z=b$ and $|xy|=3\le p$.`,
    node: <StateDiagram machine={b22aMod3} layout={{ pos: { q0: [0, 0], q1: [140, 0], q2: [280, 0] }, edges: { "q2>q0": { bend: 45 } } }} />,
  },
  "b22-2b": {
    caption: r`$q_1$: started with a, last symbol b (or only the first a so far). $q_2$: started with a and the last symbol is a, with length at least 2. $d$: started with b.`,
    node: (
      <StateDiagram
        machine={b22awa}
        layout={{ pos: { q0: [0, 0], q1: [150, 0], q2: [300, 0], d: [0, 140] }, edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: -90 }, "d>d": { loop: 0 } } }}
      />
    ),
  },
  "b22-3a": {
    wide: true,
    caption: r`Left: a 3-state NFA, one branch per part of the union ($t$ for $a^n$, $s$ and $q$ for $b^ma^k$). Right: since $\{a^n\}\subseteq\{b^ma^k\}$, the language is just $b^*a^*$ and 2 states suffice.`,
    node: (
      <Row>
        <Panel title="3 states">
          <StateDiagram machine={b22three} layout={{ pos: { s: [0, 60], q: [150, 0], t: [150, 120] }, edges: { "s>s": { loop: -90 }, "q>q": { loop: 0 }, "t>t": { loop: 0 } } }} />
        </Panel>
        <Panel title="2 states">
          <StateDiagram machine={b22two} layout={{ pos: { p: [0, 0], q: [150, 0] }, edges: { "p>p": { loop: -90 }, "q>q": { loop: -90 } } }} />
        </Panel>
      </Row>
    ),
  },
  "b22-4a": {
    wide: true,
    caption: r`Left: accepts $a^*$ ($s\xrightarrow{\varepsilon}q$ gives $\varepsilon$, the loop gives $a^n$, and $s\xrightarrow{a}f$ gives a again). Right: with the ε-edge removed, only $s\xrightarrow{a}f$ remains usable, so the language is $\{a\}$.`,
    node: (
      <Row>
        <Panel title="N: a*">
          <StateDiagram machine={b22aStar} layout={{ pos: { s: [0, 60], q: [150, 0], f: [150, 120] }, edges: { "q>q": { loop: 0 } } }} />
        </Panel>
        <Panel title="N without s → q: {a}">
          <StateDiagram machine={b22aOnly} layout={{ pos: { s: [0, 60], q: [150, 0], f: [150, 120] }, edges: { "q>q": { loop: 0 } }, faded: ["q"] }} />
        </Panel>
      </Row>
    ),
  },
  "b22-5": {
    wide: true,
    caption: r`Two parse trees for abc. Left: through $S\to AC$ ($i=j$: a matched with b). Right: through $S\to B$ ($i=k$: a matched with c).`,
    node: (
      <Row>
        <Panel title="S → AC">
          <TreeFig tree={abcViaAC} />
        </Panel>
        <Panel title="S → B">
          <TreeFig tree={abcViaB} />
        </Panel>
      </Row>
    ),
  },
  "b22-6": {
    caption: r`CYK for 0010. The top cell $X_{14}$ contains $S$, so $0010\in L(G)$.`,
    node: <CykTriangle grammar={b22g6} word="0010" highlight={[[0, 3]]} />,
  },
  "b22-8": {
    wide: true,
    caption: r`Push A per a and B per b (B's on top); pop B per c, then A per d. Taking the first a from $q_1$ and the first b from $q_a$ forces $n,m\ge1$; acceptance needs Z exposed after the d's.`,
    node: (
      <StateDiagram
        machine={b22pda}
        layout={{
          pos: { qs: [0, 0], q1: [130, 0], qa: [260, 0], qb: [400, 0], qc: [540, 0], qd: [540, 150], qacc: [380, 150] },
          names: { qs: "q_s", q1: "q_1", qa: "q_a", qb: "q_b", qc: "q_c", qd: "q_d", qacc: "q_{acc}" },
          radius: { qacc: 24 },
          edges: { "qa>qa": { loop: -90 }, "qb>qb": { loop: -90 }, "qc>qc": { loop: -90 }, "qd>qd": { loop: 0 } },
        }}
      />
    ),
  },
  "b22-12": {
    wide: true,
    caption: r`Assuming P ≠ NP: P and the NP-complete problems are disjoint parts of NP; everything in NP is decidable; decidable languages are RE.`,
    node: (
      <Containment
        width={560}
        root={{
          label: "Recursively enumerable",
          children: [{ label: "Recursive", children: [{ label: "NP", children: [{ label: "P", tone: "accent" }, { label: "NP-complete", tone: "second" }] }] }],
        }}
      />
    ),
  },
}

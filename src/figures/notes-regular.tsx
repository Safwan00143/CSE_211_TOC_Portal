import {
  aStarB,
  abUnionAStar,
  complementEx,
  concatEx,
  contains1Nfa,
  contains1Swapped,
  div3Eps,
  endsIn0,
  endsIn0q,
  evenLen,
  hastyStar,
  productEx,
  properStar,
  reverseEx,
  starEx,
  startsWith01,
  unionEx,
} from "@/content/machines/notes-regular"
import type { FA } from "@/lib/automata"
import { Panel, Row, StateDiagram } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/** A GNFA drawn with regular-expression labels: edges as [from, to, label]. */
function gnfa(states: string[], start: string, accept: string, edges: [string, string, string][]): { machine: FA; labels: Record<string, string[]> } {
  return {
    machine: { kind: "fa", states, alphabet: [], start, accept: [accept], delta: edges.map(([f, t]) => [f, "x", t]) },
    labels: Object.fromEntries(edges.map(([f, t, l]) => [`${f}>${t}`, [l]])),
  }
}

const g1 = gnfa(["qs", "q0", "q1", "q2", "qa"], "qs", "qa", [
  ["qs", "q0", "ε"],
  ["q0", "q0", "0"],
  ["q0", "q1", "1"],
  ["q1", "q0", "1"],
  ["q1", "q2", "0"],
  ["q2", "q1", "0"],
  ["q2", "q2", "1"],
  ["q0", "qa", "ε"],
])
const g2 = gnfa(["qs", "q0", "q1", "qa"], "qs", "qa", [
  ["qs", "q0", "ε"],
  ["q0", "q0", "0"],
  ["q0", "q1", "1"],
  ["q1", "q0", "1"],
  ["q1", "q1", "01*0"],
  ["q0", "qa", "ε"],
])
const g3 = gnfa(["qs", "q0", "qa"], "qs", "qa", [
  ["qs", "q0", "ε"],
  ["q0", "q0", "0 ∪ 1(01*0)*1"],
  ["q0", "qa", "ε"],
])
const g4 = gnfa(["qs", "qa"], "qs", "qa", [["qs", "qa", "(0 ∪ 1(01*0)*1)*"]])
const gNames = { qs: "q_s", qa: "q_a" }

export const regularNoteFigures: FigureMap = {
  "cl-parts": {
    wide: true,
    caption: r`The two machines used in the examples: $N_1$ accepts strings ending in 0, $N_2$ strings of even length.`,
    node: (
      <Row>
        <Panel title="N₁: ends in 0">
          <StateDiagram machine={endsIn0} layout={{ pos: { p0: [0, 0], p1: [140, 0] } }} />
        </Panel>
        <Panel title="N₂: even length">
          <StateDiagram machine={evenLen} layout={{ pos: { r0: [0, 0], r1: [140, 0] } }} />
        </Panel>
      </Row>
    ),
  },
  "cl-union": {
    caption: r`Union: a new start state $q_0$ with ε-moves to both old start states. The machine guesses which of $N_1$, $N_2$ will accept.`,
    node: <StateDiagram machine={unionEx} layout={{ pos: { q0: [0, 100], p0: [140, 0], p1: [290, 0], r0: [140, 200], r1: [290, 200] } }} />,
  },
  "cl-concat": {
    caption: r`Concatenation: an ε-move from $N_1$'s accepting state to $N_2$'s start. $p_1$ no longer accepts; only $N_2$'s accepting state does.`,
    node: <StateDiagram machine={concatEx} layout={{ pos: { p0: [0, 0], p1: [140, 0], r0: [280, 0], r1: [420, 0] } }} />,
  },
  "cl-star": {
    caption: r`Star: a new accepting start state (for zero repetitions) and an ε-move from each old accepting state back to the old start (for one more repetition).`,
    node: <StateDiagram machine={starEx} layout={{ pos: { q0: [0, 0], p0: [140, 0], p1: [290, 0] }, edges: { "p1>p0": { bend: 30 } } }} />,
  },
  "cl-star-flaw": {
    wide: true,
    caption: r`Left: $N_1$ for $a^*b$. Middle: the shortcut (make $q_1$ accepting, no new state) wrongly accepts a, because $q_1$'s own loop now ends in an accepting state. Right: the correct construction.`,
    node: (
      <Row>
        <Panel title="N₁: a*b">
          <StateDiagram machine={aStarB} layout={{ pos: { q1: [0, 0], q2: [130, 0] } }} />
        </Panel>
        <Panel title="Shortcut (wrong)">
          <StateDiagram machine={hastyStar} layout={{ pos: { q1: [0, 0], q2: [130, 0] } }} />
        </Panel>
        <Panel title="Correct">
          <StateDiagram machine={properStar} layout={{ pos: { q0: [0, 0], q1: [120, 0], q2: [250, 0] } }} />
        </Panel>
      </Row>
    ),
  },
  "cl-complement": {
    wide: true,
    caption: r`Complementing a complete DFA: swap accepting and non-accepting states. Left: ends in 0. Right: ε or ends in 1.`,
    node: (
      <Row>
        <Panel title="M: ends in 0">
          <StateDiagram machine={endsIn0q} layout={{ pos: { q0: [0, 0], q1: [140, 0] } }} />
        </Panel>
        <Panel title="M̄: complement">
          <StateDiagram machine={complementEx} layout={{ pos: { q0: [0, 0], q1: [140, 0] } }} />
        </Panel>
      </Row>
    ),
  },
  "cl-swap-nfa": {
    wide: true,
    caption: r`Swapping fails for an NFA. Left: contains a 1. Right, after swapping: $q_0$ is accepting and loops on everything, so every string is accepted, including 1, which is not in the complement.`,
    node: (
      <Row>
        <Panel title="N: contains 1">
          <StateDiagram machine={contains1Nfa} layout={{ pos: { q0: [0, 0], q1: [140, 0] } }} />
        </Panel>
        <Panel title="Swapped (wrong)">
          <StateDiagram machine={contains1Swapped} layout={{ pos: { q0: [0, 0], q1: [140, 0] } }} />
        </Panel>
      </Row>
    ),
  },
  "cl-product": {
    caption: r`Product of "ends in 0" and "even length" for intersection: a state $(p,r)$ means $N_1$ is in $p$ and $N_2$ in $r$. Only $(p_1,r_0)$ accepts.`,
    node: (
      <StateDiagram
        machine={productEx}
        layout={{
          pos: { "p0,r0": [0, 0], "p1,r1": [170, 0], "p0,r1": [0, 160], "p1,r0": [170, 160] },
          names: { "p0,r0": "p_0,r_0", "p1,r1": "p_1,r_1", "p0,r1": "p_0,r_1", "p1,r0": "p_1,r_0" },
          radius: { "p0,r0": 28, "p1,r1": 28, "p0,r1": 28, "p1,r0": 28 },
          edges: { "p0,r1>p1,r0": { side: 1, t: 0.35 }, "p1,r0>p0,r1": { side: 1, t: 0.35 } },
        }}
      />
    ),
  },
  "cl-reverse": {
    wide: true,
    caption: r`Reversal. Left: a DFA for strings starting with 01. Right: every arrow flipped, the old start $s_0$ is the only accepting state, and a new start $s$ has ε-moves to the old accepting state. It accepts strings ending in 10.`,
    node: (
      <Row>
        <Panel title="M: starts with 01">
          <StateDiagram machine={startsWith01} layout={{ pos: { s0: [0, 0], s1: [120, 0], s2: [240, 0], d: [120, 120] }, edges: { "d>d": { loop: 0 } } }} />
        </Panel>
        <Panel title="Reversed NFA">
          <StateDiagram
            machine={reverseEx}
            layout={{ pos: { s: [360, 0], s2: [240, 0], s1: [120, 0], s0: [0, 0], d: [120, 120] }, startFrom: -90, edges: { "d>d": { loop: 0 } } }}
          />
        </Panel>
      </Row>
    ),
  },
  "re-ab-a-star": {
    wide: true,
    caption: r`$(ab \cup a)^*$ by basic principles: NFAs for a and b concatenated, unioned with an NFA for a, then starred. $q_8$ is the new accepting start state.`,
    node: (
      <StateDiagram
        machine={abUnionAStar}
        layout={{
          pos: { q8: [0, 110], q7: [110, 110], q1: [220, 0], q2: [330, 0], q3: [440, 0], q4: [550, 0], q5: [220, 230], q6: [330, 230] },
          edges: { "q4>q7": { side: -1, t: 0.3 }, "q6>q7": { side: 1, t: 0.3 } },
        }}
      />
    ),
  },
  "re-div3-dfa": {
    caption: r`The DFA to convert: $q_0, q_1, q_2$ hold the value mod 3. $\varepsilon$ counts as 0, so $q_0$ is both start and accepting.`,
    node: <StateDiagram machine={div3Eps} layout={{ pos: { q0: [0, 0], q1: [150, 0], q2: [300, 0] } }} />,
  },
  "re-gnfa-1": {
    wide: true,
    caption: r`Step 1: the GNFA. New start $q_s$ and accept $q_a$ joined by ε. Arrows labelled $\emptyset$ are not drawn.`,
    node: (
      <StateDiagram
        machine={g1.machine}
        labels={g1.labels}
        layout={{ pos: { qs: [0, 0], q0: [120, 0], q1: [270, 0], q2: [420, 0], qa: [120, 130] }, names: gNames, edges: { "q2>q2": { loop: 0 } } }}
      />
    ),
  },
  "re-gnfa-2": {
    caption: r`Step 2: rip $q_2$. The only path through it is $q_1\to q_2\to q_1$, so $q_1$ gets the loop $\emptyset \cup 01^*0 = 01^*0$.`,
    node: (
      <StateDiagram
        machine={g2.machine}
        labels={g2.labels}
        layout={{ pos: { qs: [0, 0], q0: [120, 0], q1: [270, 0], qa: [120, 130] }, names: gNames, edges: { "q1>q1": { loop: 0 } } }}
      />
    ),
  },
  "re-gnfa-3": {
    caption: r`Step 3: rip $q_1$. The path $q_0\to q_1\to q_0$ adds $1(01^*0)^*1$ to $q_0$'s loop.`,
    node: <StateDiagram machine={g3.machine} labels={g3.labels} layout={{ pos: { qs: [0, 0], q0: [130, 0], qa: [260, 0] }, names: gNames }} />,
  },
  "re-gnfa-4": {
    caption: r`Step 4: rip $q_0$. The label from $q_s$ to $q_a$ is $\varepsilon(0\cup1(01^*0)^*1)^*\varepsilon$, the final regular expression.`,
    node: <StateDiagram machine={g4.machine} labels={g4.labels} layout={{ pos: { qs: [0, 0], qa: [260, 0] }, names: gNames }} />,
  },
}

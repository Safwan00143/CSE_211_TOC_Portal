import { b07g8c, b07nfa7c, b07tmXor } from "@/content/machines/b07"
import { treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const [aab1, aab2] = treesOf(b07g8c, "aab")

export const paperB07Figures: FigureMap = {
  "b07-3b": {
    wide: true,
    caption: r`Erase the next bit $a$ of $w_1$ ($c_a$ carries it), find the first unmarked bit of $w_2$ ($d_a$) and replace it by the marked XOR; go back. When $w_1$ is used up, erase # and remove the marks ($u$). Labels: read → write, move.`,
    node: (
      <StateDiagram
        machine={b07tmXor}
        layout={{
          pos: { q0: [0, 140], c0: [170, 0], c1: [170, 280], d0: [360, 0], d1: [360, 280], back: [360, 140], u: [0, 330], qf: [170, 420] },
          names: { q0: "q_0", c0: "c_0", c1: "c_1", d0: "d_0", d1: "d_1", qf: "q_f" },
          radius: { back: 26 },
          edges: { "c0>c0": { loop: -90 }, "c1>c1": { loop: 90 }, "d0>d0": { loop: -90 }, "d1>d1": { loop: 90 }, "back>back": { loop: 0 }, "u>u": { loop: 180 } },
        }}
      />
    ),
  },
  "b07-7c": {
    wide: true,
    caption: r`$(0+1)^*1(0+1)$ by the basic constructions: the union $0+1$ ($q_5$), starred ($q_6$, accepting start), concatenated with 1 ($q_7\to q_8$) and with another $0+1$ ($q_{13}$). Accepting: $q_{10}$, $q_{12}$; after concatenation the star's accepting states no longer accept.`,
    node: (
      <StateDiagram
        machine={b07nfa7c}
        layout={{
          pos: { q6: [0, 100], q5: [120, 100], q1: [240, 0], q2: [360, 0], q3: [240, 200], q4: [360, 200], q7: [480, 100], q8: [590, 100], q13: [700, 100], q9: [810, 0], q10: [920, 0], q11: [810, 200], q12: [920, 200] },
          names: sub(b07nfa7c.states),
          edges: { "q6>q7": { bend: -170 }, "q2>q5": { bend: 30, t: 0.3 }, "q4>q5": { bend: -30, t: 0.3 } },
        }}
      />
    ),
  },
  "b07-8c": {
    wide: true,
    caption: r`Two parse trees for aab in $S\to aS\mid aSbS\mid\varepsilon$: the b can be matched with the first a or with the second.`,
    node: (
      <Row>
        <Panel title="Tree 1">
          <TreeFig tree={aab1} />
        </Panel>
        <Panel title="Tree 2">
          <TreeFig tree={aab2} />
        </Panel>
      </Row>
    ),
  },
}

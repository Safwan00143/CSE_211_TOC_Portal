import { b20g6, b20pda, b20q1b, b20q3b, b20q3cNfa, b20q3cSubset, b20re } from "@/content/machines/b20"
import { rootBody, treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const setName = (q: string) => q.replace(/q(\d)/g, "q_$1")

const [abcViaAB] = treesOf(b20g6, "abc", { pick: (t) => rootBody(t) === "AB" })
const [abcViaC] = treesOf(b20g6, "abc", { pick: (t) => rootBody(t) === "C" })

export const paperB20Figures: FigureMap = {
  "b20-1b": {
    caption: r`$q_a$: last symbol a (one a); $q_{aa}$: last two symbols aa, so a b now would complete aab; $q_b$: last symbol b; $d$: started with b, or aab appeared. Five states.`,
    node: (
      <StateDiagram
        machine={b20q1b}
        layout={{
          pos: { q0: [0, 80], qa: [140, 0], qaa: [300, 0], qb: [140, 170], d: [300, 170] },
          names: { qa: "q_a", qaa: "q_{aa}", qb: "q_b" },
          edges: { "qa>qb": { bend: 18 }, "qb>qa": { bend: 18 }, "qaa>qaa": { loop: -90 }, "qb>qb": { loop: 180 }, "d>d": { loop: 0 }, "q0>d": { bend: 60 } },
        }}
      />
    ),
  },
  "b20-2b": {
    wide: true,
    caption: r`$(((00)^*(11))\cup01)^*$ by basic principles. Top: $(00)^*$ ($q_5$ is its new accepting start), concatenated with 11 ($q_6\to q_9$). Bottom: 01. $q_{14}$ unions the two; $q_{15}$ is the star's new accepting start, and $q_9$, $q_{13}$ loop back to $q_{14}$.`,
    node: (
      <StateDiagram
        machine={b20re}
        layout={{
          pos: {
            q15: [0, 150], q14: [110, 150],
            q5: [220, 0], q1: [330, 0], q2: [440, 0], q3: [550, 0], q4: [660, 0],
            q6: [330, 140], q7: [440, 140], q8: [550, 140], q9: [660, 140],
            q10: [220, 290], q11: [330, 290], q12: [440, 290], q13: [550, 290],
          },
          names: sub(b20re.states),
          edges: {
            "q4>q1": { bend: -40 },
            "q4>q6": { side: 1 },
            "q9>q14": { bend: 70, t: 0.2 },
            "q13>q14": { t: 0.3 },
          },
        }}
      />
    ),
  },
  "b20-3b": {
    wide: true,
    caption: r`The start state guesses which condition to check. Top: count 0s up to two ($a_2$: at least two). Bottom: count 1s ($b_2$: exactly two; a third 1 has no move, so that branch dies).`,
    node: (
      <StateDiagram
        machine={b20q3b}
        layout={{
          pos: { s: [0, 110], a0: [130, 0], a1: [280, 0], a2: [430, 0], b0: [130, 220], b1: [280, 220], b2: [430, 220] },
          names: sub(b20q3b.states),
          edges: { "a0>a0": { loop: -90 }, "a1>a1": { loop: -90 }, "a2>a2": { loop: 0 }, "b0>b0": { loop: 90 }, "b1>b1": { loop: 90 }, "b2>b2": { loop: 0 } },
        }}
      />
    ),
  },
  "b20-3c": {
    wide: true,
    caption: r`Left: the given NFA (start $q_1$, accepting $q_2$ assumed). Right: its DFA. A DFA state is accepting when its set contains $q_2$; $\emptyset$ is the dead state.`,
    node: (
      <Row>
        <Panel title="NFA">
          <StateDiagram
            machine={b20q3cNfa}
            layout={{ pos: { q1: [0, 0], q2: [150, 120], q3: [300, 0] }, edges: { "q1>q2": { bend: -18 }, "q2>q1": { bend: -18 }, "q3>q3": { loop: -90 } } }}
          />
        </Panel>
        <Panel title="DFA">
          <StateDiagram
            machine={b20q3cSubset.dfa}
            layout={{
              pos: { "{q1,q2}": [0, 0], "{q1,q2,q3}": [200, 0], "{q2,q3}": [200, 160], "∅": [0, 160] },
              names: Object.fromEntries(b20q3cSubset.dfa.states.map((q) => [q, setName(q)])),
              radius: { "{q1,q2}": 34, "{q1,q2,q3}": 40, "{q2,q3}": 34 },
              edges: { "{q1,q2,q3}>{q1,q2,q3}": { loop: 0 }, "∅>∅": { loop: 180 }, "{q2,q3}>{q2,q3}": { loop: 0 }, "{q2,q3}>{q1,q2,q3}": { bend: 18 }, "{q1,q2,q3}>{q2,q3}": { bend: 18 } },
            }}
          />
        </Panel>
      </Row>
    ),
  },
  "b20-6": {
    wide: true,
    caption: r`Two parse trees for abc. Left: through $S\to AB$ (a matched with b). Right: through $S\to C$ (a matched with c).`,
    node: (
      <Row>
        <Panel title="S → AB">
          <TreeFig tree={abcViaAB} />
        </Panel>
        <Panel title="S → C">
          <TreeFig tree={abcViaC} />
        </Panel>
      </Row>
    ),
  },
  "b20-7": {
    caption: r`$q_e$: an operand is expected next; $q_o$: an operand has just ended. "(" is pushed and must be popped by a matching ")". Accept in $q_o$ once only the bottom marker is left.`,
    node: (
      <StateDiagram
        machine={b20pda}
        layout={{
          pos: { qs: [0, 0], qe: [150, 0], qo: [350, 0], qacc: [350, 160] },
          names: { qs: "q_s", qe: "q_e", qo: "q_o", qacc: "q_{acc}" },
          radius: { qacc: 24 },
          edges: { "qe>qo": { bend: 22 }, "qo>qe": { bend: 22 }, "qe>qe": { loop: -90 }, "qo>qo": { loop: 0 } },
        }}
      />
    ),
  },
}

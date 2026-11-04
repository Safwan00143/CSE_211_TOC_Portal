import { b08g6, b08pda10, b08pda10Empty, b08pda11, b08q2, b08q3, b08q3Subset } from "@/content/machines/b08"
import { treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const [listTree] = treesOf(b08g6, "[x,[y,z]]")
const setNames = Object.fromEntries(b08q3Subset.dfa.states.map((q) => [q, q.replace(/q(\d)/g, "q_$1")]))

export const paperB08Figures: FigureMap = {
  "b08-2": {
    wide: true,
    caption: r`The first symbol fixes the branch. $a_k$: the string began with a, and the last $k$ symbols are a's ($k\le2$; a third a is fatal); $b_k$ likewise for b. $d$: three copies of the first symbol in a row.`,
    node: (
      <StateDiagram
        machine={b08q2}
        layout={{
          pos: { s: [0, 150], a1: [150, 0], a2: [300, 0], a0: [150, 110], b1: [150, 300], b2: [300, 300], b0: [150, 190], d: [450, 150] },
          names: sub(b08q2.states),
          edges: { "a0>a0": { loop: 180 }, "b0>b0": { loop: 180 }, "d>d": { loop: 0 }, "a1>a0": { bend: 16 }, "a0>a1": { bend: 16 }, "b1>b0": { bend: 16 }, "b0>b1": { bend: 16 } },
        }}
      />
    ),
  },
  "b08-3": {
    wide: true,
    caption: r`Left: the ε-NFA of Question 3 (start $q_1$, accepting $q_5$). Right: the DFA by lazy evaluation; the start is $E(q_1)=\{q_1,q_2\}$, and the sets containing $q_5$ accept.`,
    node: (
      <Row>
        <Panel title="ε-NFA">
          <StateDiagram
            machine={b08q3}
            layout={{ pos: { q1: [0, 160], q2: [110, 40], q3: [280, 40], q4: [220, 200], q5: [400, 140] }, names: sub(b08q3.states), edges: { "q2>q3": { bend: -16 }, "q3>q2": { bend: -16 }, "q2>q4": { bend: 16 }, "q4>q2": { bend: 16 }, "q3>q3": { loop: -90 } } }}
          />
        </Panel>
        <Panel title="DFA">
          <StateDiagram
            machine={b08q3Subset.dfa}
            layout={{
              pos: Object.fromEntries(b08q3Subset.dfa.states.map((q, i) => [q, ([[0, 80], [180, 0], [180, 170], [360, 80]] as [number, number][])[i]])),
              names: setNames,
              radius: Object.fromEntries(b08q3Subset.dfa.states.map((q) => [q, 30])),
              edges: { "{q4,q5}>{q2}": { bend: 18, t: 0.3 }, "{q2}>{q4,q5}": { bend: 18 }, "{q3,q5}>{q2}": { bend: 18 }, "{q2}>{q3,q5}": { bend: 18, t: 0.7 }, "{q3,q5}>{q3,q5}": { loop: -90 } },
            }}
          />
        </Panel>
      </Row>
    ),
  },
  "b08-6": {
    caption: r`A parse tree for the sample sentence [x,[y,z]] ($P$ = ⟨pop⟩, $B$ = ⟨bop⟩, $O$ = ⟨boop⟩).`,
    node: <TreeFig tree={listTree} />,
  },
  "b08-10b": {
    wide: true,
    caption: r`Left: the PDA $P$ of Question 10(b), accepting by final state $p$. Right: $P_N$, accepting by empty stack: a new start $p_0$ puts $X_0$ under $Z$; from the accepting state $p$, $r$ pops everything.`,
    node: (
      <Row>
        <Panel title="P (final state)">
          <StateDiagram machine={b08pda10} layout={{ pos: { q: [0, 0], p: [240, 0] }, edges: { "q>q": { loop: -90 }, "p>p": { loop: -90 } } }} />
        </Panel>
        <Panel title="P_N (empty stack)">
          <StateDiagram machine={b08pda10Empty} layout={{ pos: { p_0: [0, 0], q: [150, 0], p: [380, 0], r: [380, 170] }, edges: { "q>q": { loop: -90 }, "p>p": { loop: -90 }, "r>r": { loop: 0 } } }} />
        </Panel>
      </Row>
    ),
  },
  "b08-11a": {
    caption: r`The one-state PDA for $S\to AS\mid A$, $A\to0A\mid1B\mid1$, $B\to0B\mid0$ (acceptance by empty stack).`,
    node: <StateDiagram machine={b08pda11} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
}

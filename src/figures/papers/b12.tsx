import { b12abc, b12evenAB, b12exprPda, b12q6c, b12q7a, b12q7aNoEps } from "@/content/machines/b12"
import { treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const q7Pos = { q0: [0, 0], q1: [170, 0], q2: [340, 0], q4: [90, 150], q3: [260, 150] } as Record<string, [number, number]>
const [abcTree] = treesOf(b12abc, "abbccc")
const trimmed = { ...b12q7aNoEps, states: b12q7aNoEps.states.filter((q) => q !== "q4"), delta: b12q7aNoEps.delta.filter((d) => d[0] !== "q4") }

export const paperB12Figures: FigureMap = {
  "b12-1a": {
    caption: r`The one-state PDA (HMU construction) for the expression grammar: on ε it replaces a variable on top of the stack by one of its bodies; on a terminal it pops a matching terminal. It accepts by empty stack. × and / are written * and /.`,
    node: <StateDiagram machine={b12exprPda} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
  "b12-5c": {
    caption: r`$a_e/a_o$: still reading a's, length so far even/odd; $b_e/b_o$: reading b's; an a after a b is fatal ($d$). Accept when the total length is even.`,
    node: (
      <StateDiagram
        machine={b12evenAB}
        layout={{
          pos: { ae: [0, 0], ao: [170, 0], be: [0, 170], bo: [170, 170], d: [85, 320] },
          names: { ae: "a_e", ao: "a_o", be: "b_e", bo: "b_o" },
          edges: { "ae>ao": { bend: 16 }, "ao>ae": { bend: 16 }, "be>bo": { bend: 16 }, "bo>be": { bend: 16 }, "d>d": { loop: 0 }, "ae>bo": { t: 0.3 }, "ao>be": { t: 0.3 } },
        }}
      />
    ),
  },
  "b12-6c": {
    caption: r`The NFA of Question 6(c), as printed.`,
    node: <StateDiagram machine={b12q6c} layout={{ pos: { q0: [0, 0], q1: [220, 0], q2: [110, 160] }, names: sub(b12q6c.states), edges: { "q0>q1": { bend: -18 }, "q1>q0": { bend: -18 }, "q2>q2": { loop: 90 } } }} />,
  },
  "b12-7a": {
    wide: true,
    caption: r`Left: the ε-NFA of Question 7(a). Right: after removing ε-moves. Each state gets every move available after following ε-moves first, and becomes accepting if an accepting state is reachable by ε-moves ($q_1$, $q_3$ reach $q_2$). $q_4$ becomes unreachable and is dropped.`,
    node: (
      <Row>
        <Panel title="With ε-moves">
          <StateDiagram machine={b12q7a} layout={{ pos: q7Pos, names: sub(b12q7a.states), edges: { "q1>q2": { bend: 18 }, "q2>q1": { bend: 18 } } }} />
        </Panel>
        <Panel title="ε-moves removed">
          <StateDiagram
            machine={trimmed}
            layout={{ pos: { q0: [0, 90], q1: [210, 0], q2: [210, 180], q3: [420, 90] }, names: sub(trimmed.states), edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: 90 }, "q1>q2": { bend: 18, t: 0.3 }, "q2>q1": { bend: 18, t: 0.3 } } }}
          />
        </Panel>
      </Row>
    ),
  },
  "b12-7b": {
    caption: r`Parse tree for $ab^2c^3$ = abbccc.`,
    node: <TreeFig tree={abcTree} />,
  },
}

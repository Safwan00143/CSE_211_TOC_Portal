import { b10g8c, b10len5, b10pda4b, b10q7, b10q7c, b10q7Subset, b10tmSub } from "@/content/machines/b10"
import { treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const [exprTree] = treesOf(b10g8c, "((a+b)*b)")
const setName = Object.fromEntries(b10q7Subset.dfa.states.map((q) => [q, q.replace(/q0/g, "q_0")]))
// order: {q0}, {x}, ∅, {y}, {q0,z}, {q0,x}, {x,y}
const setPos: [number, number][] = [[0, 140], [160, 140], [260, 310], [160, 0], [340, 140], [520, 140], [340, 0]]

export const paperB10Figures: FigureMap = {
  "b10-1a": {
    wide: true,
    caption: r`Repeatedly erase the last 1 of $y$ ($q_1$) and, if $y$ still has 1s, the first 1 of $x$ ($q_3$, $q_4$). When the erased 1 was $y$'s last one ($q_2$ sees the 0), erase the 0 and accept. Labels: read → write, move.`,
    node: (
      <StateDiagram
        machine={b10tmSub}
        layout={{ pos: { q0: [0, 0], q1: [180, 0], q2: [360, 0], qa: [540, 0], q3: [360, 170], q4: [0, 170] }, names: { ...sub(b10tmSub.states), qa: "q_{acc}" }, radius: { qa: 24 }, edges: { "q0>q0": { loop: -90 }, "q3>q3": { loop: 90 } } }}
      />
    ),
  },
  "b10-4b": {
    caption: r`The one-state PDA for $S\to aTXb$, $T\to XTS\mid\varepsilon$, $X\to a\mid b$ (acceptance by empty stack).`,
    node: <StateDiagram machine={b10pda4b} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
  "b10-5c": {
    wide: true,
    caption: r`$l_k$: $k$ symbols read so far ($k\le5$, all accepting); a sixth symbol goes to the dead state $d$.`,
    node: <StateDiagram machine={b10len5} layout={{ pos: { l0: [0, 0], l1: [110, 0], l2: [220, 0], l3: [330, 0], l4: [440, 0], l5: [550, 0], d: [660, 0] }, names: sub(b10len5.states), edges: { "d>d": { loop: -90 } } }} />,
  },
  "b10-7a": {
    caption: r`$q_0$ (start, accepting) begins a block with 0 ($x$). From $x$: 1 completes 01; 0 then 1 completes 001 (via $y$); 1 then 0 completes 010 (via $z$).`,
    node: <StateDiagram machine={b10q7} layout={{ pos: { q0: [0, 80], x: [170, 80], y: [320, 0], z: [320, 160] }, names: sub(b10q7.states), edges: { "q0>x": { bend: 18 }, "x>q0": { bend: 18 }, "y>q0": { bend: -40 }, "z>q0": { bend: 40 } } }} />,
  },
  "b10-7b": {
    wide: true,
    caption: r`The reachable DFA. Accepting: the sets containing $q_0$. $\emptyset$ is the dead state.`,
    node: (
      <StateDiagram
        machine={b10q7Subset.dfa}
        layout={{ pos: Object.fromEntries(b10q7Subset.dfa.states.map((q, i) => [q, setPos[i]])), names: setName, radius: Object.fromEntries(b10q7Subset.dfa.states.map((q) => [q, q.length > 4 ? 32 : 24])), edges: { "{q0,z}>{q0,x}": { bend: 18 }, "{q0,x}>{q0,z}": { bend: 18 }, "∅>∅": { loop: 90 } } }}
      />
    ),
  },
  "b10-7c": {
    caption: r`The finite automaton of Question 7(c), as printed.`,
    node: <StateDiagram machine={b10q7c} layout={{ pos: { "1": [0, 0], "2": [200, 0], "3": [100, 160] }, edges: { "2>2": { loop: 0 }, "2>3": { bend: 16 }, "3>2": { bend: 16 } } }} />,
  },
  "b10-8c": {
    caption: r`Parse tree of ((a+b)*b) in the grammar as printed ($T\to E*F$).`,
    node: <TreeFig tree={exprTree} />,
  },
}

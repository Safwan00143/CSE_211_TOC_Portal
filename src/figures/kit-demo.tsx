import { contains101, even1, hmuCyk, tm0n1n, wwr, zeroNoneN } from "@/content/machines/kit-demo"
import { Containment, CykTriangle, ParseTree, StateDiagram, Tape } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/* One figure per drawing feature, shown together on /figures for visual review. */
export const kitDemoFigures: FigureMap = {
  "kit-dfa": {
    caption: r`$q_E$ remembers "even number of 1's so far", $q_O$ "odd". Reading 0 never changes parity, so 0 loops.`,
    node: <StateDiagram machine={even1} layout={{ pos: { qE: [0, 0], qO: [150, 0] }, edges: { "qE>qE": { loop: -90 }, "qO>qO": { loop: -90 } } }} />,
  },
  "kit-nfa": {
    caption: r`$q_0$ guesses where 101 starts; the other branches die. Several symbols on one edge are comma-joined.`,
    node: <StateDiagram machine={contains101} layout={{ pos: { q0: [0, 0], q1: [120, 0], q2: [240, 0], q3: [360, 0] } }} />,
  },
  "kit-pda-sipser": {
    caption: r`Hakim Sir's labels: input, pop $\to$ push. The \$ marks the bottom of the stack.`,
    node: (
      <StateDiagram
        machine={zeroNoneN}
        layout={{
          pos: { q1: [0, 0], q2: [190, 0], q3: [190, 130], q4: [0, 130] },
          edges: { "q2>q2": { loop: 0 }, "q3>q3": { loop: 0 } },
        }}
      />
    ),
  },
  "kit-pda-hmu": {
    wide: true,
    caption: r`Atif Sir's labels: input, top $/$ replacement. Each state's moves are stacked one per line.`,
    node: (
      <StateDiagram
        machine={wwr}
        layout={{
          pos: { q0: [0, 0], q1: [210, 0], q2: [400, 0] },
          edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 } },
          names: { Z0: "Z_0" },
        }}
      />
    ),
  },
  "kit-tm": {
    wide: true,
    caption: r`HMU's machine for $\{0^n1^n \mid n \ge 1\}$: $X$ marks a used 0, $Y$ a used 1.`,
    node: (
      <StateDiagram
        machine={tm0n1n}
        layout={{
          pos: { q0: [0, 0], q1: [190, 0], q2: [380, 0], q3: [0, 150], q4: [190, 150] },
          startFrom: 180,
          edges: {
            "q1>q1": { loop: -90 },
            "q2>q2": { loop: -90 },
            "q3>q3": { loop: 90 },
            "q2>q0": { bend: 62 },
          },
        }}
      />
    ),
  },
  "kit-tree": {
    caption: r`A parse tree for $(())()$ with $S \to (S)S \mid \varepsilon$. The yield is read along the leaves.`,
    node: (
      <ParseTree
        tree={{
          label: "S",
          children: [
            { label: "(" },
            { label: "S", children: [{ label: "(" }, { label: "S", children: [{ label: "ε" }] }, { label: ")" }, { label: "S", children: [{ label: "ε" }] }] },
            { label: ")" },
            { label: "S", children: [{ label: "(" }, { label: "S", children: [{ label: "ε" }] }, { label: ")" }, { label: "S", children: [{ label: "ε" }] }] },
          ],
        }}
      />
    ),
  },
  "kit-tape": {
    caption: r`ID $Xq_10011$ drawn as a tape: the head is on the cell after $q_1$.`,
    node: <Tape cells={["B", "X", "0", "0", "1", "1", "B"]} head={2} state="q_1" />,
  },
  "kit-cyk": {
    wide: true,
    caption: r`CYK on baaba (HMU's example): $S \in X_{15}$ at the top, so the string is in the language.`,
    node: (
      <CykTriangle grammar={hmuCyk} word="baaba" highlight={[[0, 4]]} />
    ),
  },
  "kit-classes": {
    caption: r`Each class sits inside the next: regular $\subset$ context-free $\subset$ recursive $\subset$ RE.`,
    node: (
      <Containment
        root={{
          label: "All languages",
          children: [
            {
              label: "Recursively enumerable",
              children: [{ label: "Recursive (decidable)", children: [{ label: "Context-free", children: [{ label: "Regular", tone: "accent" }] }] }],
            },
          ],
        }}
      />
    ),
  },
}

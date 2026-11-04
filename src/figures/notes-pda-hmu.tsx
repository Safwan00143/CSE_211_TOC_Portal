import { pdaEqualAb, pdaExpr, pdaParen, pdaParenFinal, pdaWwr, pdaWwrEmpty } from "@/content/machines/notes-pda-hmu"
import { StateDiagram } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

export const pdaHmuNoteFigures: FigureMap = {
  "hmu-wwr": {
    wide: true,
    caption: r`HMU's PDA for $L_{wwr}$ by final state. $q_0$: middle not yet seen, push. $q_1$: past the middle, pop matching symbols. $q_2$: $Z_0$ exposed again, accept.`,
    node: (
      <StateDiagram
        machine={pdaWwr}
        layout={{ pos: { q0: [0, 0], q1: [230, 0], q2: [420, 0] }, edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 } } }}
      />
    ),
  },
  "hmu-paren": {
    caption: r`Atif Sir's balanced-parentheses PDA, accepting by final state $q_1$: push each (, pop on each ), and move to $q_1$ when only $Z_0$ is left.`,
    node: <StateDiagram machine={pdaParen} layout={{ pos: { q0: [0, 0], q1: [200, 0] }, edges: { "q0>q0": { loop: -90 } } }} />,
  },
  "hmu-equal-ab": {
    caption: r`Equal numbers of a's and b's. A stack of a's means extra a's, a stack of b's extra b's; reading the opposite symbol pops one.`,
    node: <StateDiagram machine={pdaEqualAb} layout={{ pos: { q: [0, 0], f: [200, 0] }, edges: { "q>q": { loop: -90 } } }} />,
  },
  "hmu-expr-pda": {
    caption: r`The one-state PDA built from the expression grammar: expand a variable on top by one of its bodies, or match a terminal on top with the input.`,
    node: <StateDiagram machine={pdaExpr} layout={{ pos: { q: [0, 0] }, edges: { "q>q": { loop: 0 } } }} />,
  },
  "hmu-final-to-empty": {
    wide: true,
    caption: r`$P_N$ from $P_F$ for $L_{wwr}$: $p_0$ puts $Z_0$ on top of the new bottom $X_0$; from the accepting state $q_2$, and in $p$, the stack is drained on ε.`,
    node: (
      <StateDiagram
        machine={pdaWwrEmpty}
        layout={{
          pos: { p_0: [-170, 0], q0: [0, 0], q1: [230, 0], q2: [420, 0], p: [600, 0] },
          names: { p_0: "p_0" },
          edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 }, "p>p": { loop: 90 } },
        }}
      />
    ),
  },
  "hmu-empty-to-final": {
    caption: r`$P_F$ from $P_N$ (the parenthesis PDA that empties its stack): whenever the new bottom $X_0$ is exposed, move to the accepting state $p_f$.`,
    node: (
      <StateDiagram
        machine={pdaParenFinal}
        layout={{
          pos: { p_0: [-170, 0], q0: [0, 0], q1: [200, 0], p_f: [100, 150] },
          names: { p_0: "p_0", p_f: "p_f" },
          edges: { "q0>q0": { loop: -90 } },
        }}
      />
    ),
  },
}

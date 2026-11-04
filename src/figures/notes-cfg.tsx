import { gBalanced, gExpr, gExprAmb, gIfAmb, gInherent, gMirror } from "@/content/machines/notes-cfg"
import { dfa } from "@/content/machines/notes-dfa"
import { rootBody, treesOf } from "@/lib/derivations"
import { TreeFig } from "./grammar"
import { Panel, Row, StateDiagram } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/** DFA for "contains 101", used for the DFA-to-CFG construction. */
export const dfa101 = dfa("q0", ["q3"], {
  q0: { 0: "q0", 1: "q1" },
  q1: { 0: "q2", 1: "q1" },
  q2: { 0: "q0", 1: "q3" },
  q3: { 0: "q3", 1: "q3" },
})

/** The simplest tree: (S) all the way down, no S → SS. */
const nestedOnly = (t: { label: string; children?: { label: string }[] }): boolean =>
  !t.children || (rootBody(t as never) !== "SS" && t.children.every((c) => nestedOnly(c as never)))

const [exprPlusTop] = treesOf(gExprAmb, "a+a*a", { pick: (t) => rootBody(t) === "E+E" })
const [exprTimesTop] = treesOf(gExprAmb, "a+a*a", { pick: (t) => rootBody(t) === "E*E" })
const [ifInner, ifOuter] = [
  treesOf(gIfAmb, "iioeo", { pick: (t) => rootBody(t) === "iS" })[0],
  treesOf(gIfAmb, "iioeo", { pick: (t) => rootBody(t) === "iSeS" })[0],
]
const [inhAB] = treesOf(gInherent, "abcd", { pick: (t) => rootBody(t) === "AB" })
const [inhC] = treesOf(gInherent, "abcd", { pick: (t) => rootBody(t) === "C" })
const [parLeft] = treesOf(gBalanced, "()()()", { pick: (t) => rootBody(t) === "SS" && rootBody(t.children![0]) === "SS" })
const [parRight] = treesOf(gBalanced, "()()()", { pick: (t) => rootBody(t) === "SS" && rootBody(t.children![1]) === "SS" })
const ifLeaves = { i: "if E then", e: "else", o: "other" }

export const cfgNoteFigures: FigureMap = {
  "cfg-tree-nested": {
    caption: r`A parse tree for (()) with $S\to SS\mid(S)\mid\varepsilon$. Reading the leaves left to right and dropping $\varepsilon$ gives the yield (()).`,
    node: <TreeFig tree={treesOf(gBalanced, "(())", { pick: nestedOnly })[0]} />,
  },
  "cfg-tree-mirror": {
    caption: r`101#101 with $S\to0S0\mid1S1\mid\#$: each level wraps one matching pair around the middle marker.`,
    node: <TreeFig tree={treesOf(gMirror, "101#101")[0]} />,
  },
  "cfg-tree-expr": {
    caption: r`a+a*a in the layered grammar. The product a*a sits inside one $T$, below the +, so * binds tighter.`,
    node: <TreeFig tree={treesOf(gExpr, "a+a*a")[0]} />,
  },
  "cfg-amb-expr": {
    wide: true,
    caption: r`Two parse trees for a+a*a in $E\to E+E\mid E*E\mid(E)\mid a$. Left: + at the root, meaning a+(a*a). Right: * at the root, meaning (a+a)*a.`,
    node: (
      <Row>
        <Panel title="a + (a * a)">
          <TreeFig tree={exprPlusTop} />
        </Panel>
        <Panel title="(a + a) * a">
          <TreeFig tree={exprTimesTop} />
        </Panel>
      </Row>
    ),
  },
  "cfg-amb-balanced": {
    wide: true,
    caption: r`$S\to SS\mid(S)\mid\varepsilon$ is ambiguous: ()()() splits as [()()] followed by (), or as () followed by [()()]: two different trees.`,
    node: (
      <Row>
        <Panel title="[()()] ()">
          <TreeFig tree={parLeft} gap={30} />
        </Panel>
        <Panel title="() [()()]">
          <TreeFig tree={parRight} gap={30} />
        </Panel>
      </Row>
    ),
  },
  "cfg-amb-if": {
    wide: true,
    caption: r`Dangling else. Left: the else belongs to the inner if. Right: it belongs to the outer if.`,
    node: (
      <Row>
        <Panel title="else with the inner if">
          <TreeFig tree={ifInner} leaves={ifLeaves} gap={64} />
        </Panel>
        <Panel title="else with the outer if">
          <TreeFig tree={ifOuter} leaves={ifLeaves} gap={64} />
        </Panel>
      </Row>
    ),
  },
  "cfg-inherent": {
    wide: true,
    caption: r`abcd is in both halves of the union, so it gets one tree through $A B$ (a with b, c with d) and one through $C$ (a with d, b with c).`,
    node: (
      <Row>
        <Panel title="through S → AB">
          <TreeFig tree={inhAB} />
        </Panel>
        <Panel title="through S → C">
          <TreeFig tree={inhC} />
        </Panel>
      </Row>
    ),
  },
  "cfg-dfa101": {
    caption: r`A DFA for strings containing 101. Each state $q_i$ becomes a variable $R_i$.`,
    node: <StateDiagram machine={dfa101} layout={{ pos: { q0: [0, 0], q1: [130, 0], q2: [260, 0], q3: [390, 0] }, edges: { "q2>q0": { bend: 45 } } }} />,
  },
}

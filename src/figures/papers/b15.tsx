import { b15gap0, b15notSeen, b15pda6a, b15q2a, b15q2b, b15q2bSubset, b15seen, b15stones3, b15stones4, b15stones6, b15tree, b15wwr, stoneClasses } from "@/content/machines/b15"
import { treesOf } from "@/lib/derivations"
import type { FA } from "@/lib/automata"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
/** Triangular lattice: one row per number of red stones. */
const lattice = (g: FA, n: number, dx: number, dy: number) =>
  Object.fromEntries(
    g.states.map((k) => {
      const [rr, gg, bb] = k.split(",").map(Number)
      return [k, [((bb - gg) * dx) / 2, (n - rr) * dy] as [number, number]]
    }),
  )
const big = (g: FA) => Object.fromEntries(g.states.map((s) => [s, 26]))
/** States from which failure cannot be avoided (other than the failed states themselves). */
const mustFail = (g: FA) =>
  Object.entries(stoneClasses(g))
    .filter(([k, c]) => c === "must" && !g.accept.includes(k))
    .map(([k]) => k)
const [treeA] = treesOf(b15tree, "a+a*a")

export const paperB15Figures: FigureMap = {
  "b15-1a": {
    wide: true,
    caption: r`3 stones; a state is (red, green, blue). Double rings: failed (all one colour). Faded: must fail. The six states round the outside form a cycle and can't fail.`,
    node: <StateDiagram machine={b15stones3} layout={{ pos: lattice(b15stones3, 3, 150, 120), radius: big(b15stones3), noStart: true, faded: mustFail(b15stones3) }} />,
  },
  "b15-1b": {
    wide: true,
    caption: r`4 stones. The three corners have failed (must fail); every other state might fail: it can reach a corner, and it can also cycle for ever.`,
    node: <StateDiagram machine={b15stones4} layout={{ pos: lattice(b15stones4, 4, 150, 120), radius: big(b15stones4), noStart: true }} />,
  },
  "b15-1d": {
    caption: r`6 stones, reduced: a state is the multiset of colour counts (largest first), since renaming the colours changes nothing. (5,1,0), (4,2,0), (3,2,1) can't fail; (4,1,1), (3,3,0), (2,2,2) might fail; (6,0,0) has failed. An arrow means one event (of whichever colour) leads from one pattern to the other.`,
    node: (
      <StateDiagram
        machine={b15stones6}
        layout={{
          pos: { "5,1,0": [0, 0], "4,2,0": [220, 0], "3,2,1": [110, 160], "4,1,1": [330, 160], "3,3,0": [550, 160], "2,2,2": [550, 340], "6,0,0": [330, 340] },
          radius: big(b15stones6),
          noStart: true,
          edges: { "3,2,1>3,2,1": { loop: 180 }, "3,2,1>4,2,0": { bend: 18 }, "4,2,0>3,2,1": { bend: 18 } },
        }}
      />
    ),
  },
  "b15-2a": {
    wide: true,
    caption: r`State $kp$: the number of a's is $\equiv k \pmod 3$, and the digit sum is even ($e$) or odd ($o$). b and 2 change nothing; a moves $k$ on; 1 flips the parity. Accept in $0e$.`,
    node: (
      <StateDiagram
        machine={b15q2a}
        layout={{
          pos: { "0e": [0, 0], "1e": [180, 0], "2e": [360, 0], "0o": [0, 200], "1o": [180, 200], "2o": [360, 200] },
          edges: {
            "0e>0e": { loop: -90 },
            "1e>1e": { loop: -90 },
            "2e>2e": { loop: -90 },
            "0o>0o": { loop: 90 },
            "1o>1o": { loop: 90 },
            "2o>2o": { loop: 90 },
            "2e>0e": { bend: -95 },
            "2o>0o": { bend: 95 },
            "0e>0o": { bend: 16 },
            "0o>0e": { bend: 16 },
            "1e>1o": { bend: 16 },
            "1o>1e": { bend: 16 },
            "2e>2o": { bend: 16 },
            "2o>2e": { bend: 16 },
          },
        }}
      />
    ),
  },
  "b15-2b": {
    wide: true,
    caption: r`Left: the NFA as printed. Right: its DFA. $E(p)=\{p,r,s\}$, so the DFA starts there; a set is accepting when it contains $q$.`,
    node: (
      <Row>
        <Panel title="NFA">
          <StateDiagram
            machine={b15q2b}
            layout={{ pos: { p: [0, 0], q: [200, 0], s: [0, 200], r: [200, 200] }, edges: { "q>q": { loop: -90 }, "q>r": { bend: 22 }, "r>q": { bend: 22 }, "s>r": { bend: 22 }, "r>s": { bend: 22 } } }}
          />
        </Panel>
        <Panel title="DFA">
          <StateDiagram
            machine={b15q2bSubset.dfa}
            layout={{
              pos: { "{p,r,s}": [0, 0], "{p,q,r,s}": [220, 0], "{q,r,s}": [110, 170] },
              radius: { "{p,r,s}": 34, "{p,q,r,s}": 40, "{q,r,s}": 34 },
              edges: { "{p,q,r,s}>{p,q,r,s}": { loop: -90 }, "{q,r,s}>{q,r,s}": { loop: 90 } },
            }}
          />
        </Panel>
      </Row>
    ),
  },
  "b15-3a-i": {
    wide: true,
    caption: r`Final digit seen before, drawn for the digits 0, 1, 2 (the real machine has a middle state $p_d$ for each digit $d=0,\dots,9$: 12 states). $s$ skips a prefix and guesses an earlier copy of the final digit $d$; $p_d$ skips the middle; reading $d$ as the last symbol reaches $f$.`,
    node: (
      <StateDiagram
        machine={b15seen}
        layout={{ pos: { s: [0, 130], p0: [180, 0], p1: [180, 130], p2: [180, 260], f: [360, 130] }, names: sub(b15seen.states), edges: { "s>s": { loop: -90 }, "p0>p0": { loop: -90 }, "p2>p2": { loop: 90 }, "p1>p1": { loop: -90 } } }}
      />
    ),
  },
  "b15-3a-ii": {
    wide: true,
    caption: r`Final digit not seen before, for the digits 0, 1, 2 (21 states for 0–9). $s$ guesses the final digit $d$; $n_d$ reads only digits other than $d$; the single $d$ at the end reaches $f_d$, which has no moves.`,
    node: (
      <StateDiagram
        machine={b15notSeen}
        layout={{ pos: { s: [0, 130], n0: [170, 0], n1: [170, 130], n2: [170, 260], f0: [340, 0], f1: [340, 130], f2: [340, 260] }, names: sub(b15notSeen.states), edges: { "n0>n0": { loop: -90 }, "n1>n1": { loop: -90 }, "n2>n2": { loop: 90 } } }}
      />
    ),
  },
  "b15-3a-iii": {
    wide: true,
    caption: r`$s$ skips a prefix and guesses the first 0 of the pair ($g_0$). $g_0,\dots,g_3$ count the characters after it mod 4; a 0 read in $g_0$ (after 0, 4, 8, … characters) completes the pair, and $f$ accepts the rest.`,
    node: (
      <StateDiagram
        machine={b15gap0}
        layout={{ pos: { s: [0, 0], g0: [140, 0], g1: [280, 0], g2: [280, 150], g3: [140, 150], f: [0, 150] }, names: sub(b15gap0.states), edges: { "s>s": { loop: -90 }, "f>f": { loop: 180 } } }}
      />
    ),
  },
  "b15-6a": {
    wide: true,
    caption: r`Each 0 pushes one X, or (through $q_x$) two X's; each 1 pops one X. So the number of 1s is between $n$ and $2n$. Accept when Z is exposed.`,
    node: (
      <StateDiagram
        machine={b15pda6a}
        layout={{
          pos: { qs: [0, 0], q0: [150, 0], qx: [150, 160], q1: [330, 0], qacc: [480, 0] },
          names: { qs: "q_s", q0: "q_0", qx: "q_x", q1: "q_1", qacc: "q_{acc}" },
          radius: { qacc: 24 },
          edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 }, "q0>qx": { bend: 20 }, "qx>q0": { bend: 20 } },
        }}
      />
    ),
  },
  "b15-7b": {
    caption: r`Push the first half; guess the middle (an ε-move to $q_m$); pop and match the second half; accept when the bottom marker is exposed.`,
    node: (
      <StateDiagram
        machine={b15wwr}
        layout={{ pos: { qs: [0, 0], qp: [150, 0], qm: [320, 0], qacc: [470, 0] }, names: { qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" }, radius: { qacc: 24 }, edges: { "qp>qp": { loop: -90 }, "qm>qm": { loop: -90 } } }}
      />
    ),
  },
  "b15-8c": {
    caption: r`The question's parse tree for a + a × a (× written as *), generated by the grammar in the answer ($E$, $T$, $F$ for EXPR, TERM, FACTOR).`,
    node: <TreeFig tree={treeA} />,
  },
}

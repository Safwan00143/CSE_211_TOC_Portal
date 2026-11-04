import {
  b21alt,
  b21d1,
  b21d2,
  b21ends1,
  b21f1,
  b21f2,
  b21f3,
  b21f4,
  b21f5,
  b21g7,
  b21odd,
  b21pda,
  b21runs,
  b21sum,
  b21union,
} from "@/content/machines/b21"
import { CykTriangle, Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw

export const paperB21Figures: FigureMap = {
  /* ───── Figures given in the questions, redrawn ───── */

  "b21-2a-i": {
    caption: r`(i) as printed (states named here for reference).`,
    node: (
      <StateDiagram
        machine={b21f1}
        layout={{ pos: { s: [0, 100], t: [130, 0], r: [260, 100], d: [130, 200] }, edges: { "s>t": { bend: 20 }, "t>s": { bend: 20 }, "d>d": { loop: 90 } } }}
      />
    ),
  },
  "b21-2a-ii": {
    caption: r`(ii) as printed.`,
    node: (
      <StateDiagram
        machine={b21f2}
        layout={{ pos: { s: [0, 100], p: [130, 0], f: [300, 0], g: [130, 200], d: [300, 200] }, edges: { "p>p": { loop: -90 }, "d>d": { loop: 0 } } }}
      />
    ),
  },
  "b21-2a-iii": {
    caption: r`(iii) as printed.`,
    node: (
      <StateDiagram
        machine={b21f3}
        layout={{ pos: { s: [0, 0], m: [140, 0], r: [280, 0], d: [140, 160] }, edges: { "s>m": { bend: 22 }, "m>s": { bend: 22 }, "m>r": { bend: 22 }, "r>m": { bend: 22 }, "d>d": { loop: 90 } } }}
      />
    ),
  },
  "b21-2a-iv": {
    caption: r`(iv) as printed; the start state is in the middle.`,
    node: (
      <StateDiagram
        machine={b21f4}
        layout={{
          pos: { l: [0, 0], s: [140, 0], r: [280, 0], d: [140, 160] },
          startFrom: -90,
          edges: { "s>l": { bend: -22 }, "l>s": { bend: -22 }, "s>r": { bend: 22 }, "r>s": { bend: 22 }, "d>d": { loop: 90 } },
        }}
      />
    ),
  },
  "b21-2a-v": {
    caption: r`(v) as printed.`,
    node: (
      <StateDiagram
        machine={b21f5}
        layout={{
          pos: { q0: [0, 0], q2: [150, 0], q4: [300, 0], q1: [0, 130], q3: [0, 260], q5: [300, 260] },
          startFrom: 180,
          edges: { "q2>q1": { bend: 22 }, "q1>q2": { bend: 22 }, "q4>q4": { loop: -90 }, "q3>q3": { loop: 180 }, "q5>q5": { loop: 0 } },
        }}
      />
    ),
  },
  "b21-4a-given": {
    wide: true,
    caption: r`$D_1$ and $D_2$ as printed. Accepting: $s_0$ in $D_1$; $q_2$ and $q_3$ in $D_2$.`,
    node: (
      <Row>
        <Panel title="D₁">
          <StateDiagram machine={b21d1} layout={{ pos: { s0: [0, 0], s1: [130, 0] }, edges: { "s1>s1": { loop: -90 } } }} />
        </Panel>
        <Panel title="D₂">
          <StateDiagram
            machine={b21d2}
            layout={{ pos: { q1: [0, 0], q2: [130, 0], q3: [260, 0] }, edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: -90 }, "q2>q3": { bend: 20 }, "q3>q2": { bend: 20 } } }}
          />
        </Panel>
      </Row>
    ),
  },
  "b21-4c-given": {
    caption: r`The DFA in Q4(c), as printed.`,
    node: <StateDiagram machine={b21ends1} layout={{ pos: { q0: [0, 0], q1: [140, 0] }, edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: -90 }, "q0>q1": { bend: 20 }, "q1>q0": { bend: 20 } } }} />,
  },

  /* ───── Solutions ───── */

  "b21-1b": {
    caption: r`$r_i$: the sum so far is $i$ modulo 3. A digit $d$ moves $r_i$ to $r_{(i+d) \bmod 3}$; R always goes to $r_0$.`,
    node: (
      <StateDiagram
        machine={b21sum}
        layout={{
          pos: { r0: [0, 120], r1: [160, 0], r2: [160, 240] },
          names: { r0: "r_0", r1: "r_1", r2: "r_2" },
          startFrom: 180,
          edges: { "r0>r0": { loop: 90 }, "r1>r1": { loop: 0 }, "r2>r2": { loop: 0 }, "r0>r1": { bend: 18 }, "r1>r0": { bend: 18 }, "r0>r2": { bend: -18 }, "r2>r0": { bend: -18 }, "r1>r2": { bend: 18 }, "r2>r1": { bend: 18 } },
        }}
      />
    ),
  },
  "b21-1c": {
    caption: r`$q_a$/$q_b$: the last symbol was a/b. Repeating it means aa or bb has appeared, so go to the dead state $d$.`,
    node: (
      <StateDiagram
        machine={b21alt}
        layout={{ pos: { q0: [0, 70], qa: [140, 0], qb: [140, 140], d: [290, 70] }, names: { qa: "q_a", qb: "q_b" }, edges: { "qa>qb": { bend: 18 }, "qb>qa": { bend: 18 }, "d>d": { loop: 0 } } }}
      />
    ),
  },
  "b21-3a": {
    caption: r`$s$: not inside a run of 0s. $o$/$e$: inside a run of odd/even length so far. A 1 after an even run is fatal ($d$); a 1 after an odd run is fine.`,
    node: (
      <StateDiagram
        machine={b21runs}
        layout={{ pos: { s: [0, 0], o: [150, 0], e: [300, 0], d: [450, 0] }, edges: { "s>s": { loop: -90 }, "o>e": { bend: 20 }, "e>o": { bend: 20 }, "o>s": { bend: 50 }, "d>d": { loop: -90 } } }}
      />
    ),
  },
  "b21-4a": {
    caption: r`The start pair $(s_0,q_1)$ and the two states it reaches: $(s_1,q_1)$ on 0 and $(s_1,q_2)$ on 1. The full construction also reaches $(s_1,q_3)$ (faded). Accepting: pairs where $D_1$ or $D_2$ accepts.`,
    node: (
      <StateDiagram
        machine={b21union}
        layout={{
          pos: { "s0,q1": [0, 80], "s1,q1": [170, 0], "s1,q2": [170, 160], "s1,q3": [370, 160] },
          names: { "s0,q1": "s_0,q_1", "s1,q1": "s_1,q_1", "s1,q2": "s_1,q_2", "s1,q3": "s_1,q_3" },
          radius: { "s0,q1": 28, "s1,q1": 28, "s1,q2": 28, "s1,q3": 28 },
          startFrom: 180,
          faded: ["s1,q3"],
          edges: { "s1,q1>s1,q1": { loop: -90 }, "s1,q2>s1,q2": { loop: 90 }, "s1,q2>s1,q3": { bend: 20 }, "s1,q3>s1,q2": { bend: 20 } },
        }}
      />
    ),
  },
  "b21-4b": {
    wide: true,
    caption: r`Top branch: starts with 0, ends with 1. Bottom: starts with 1, ends with 0. $a_1/a_2$ ($b_1/b_2$) count the middle symbols as even/odd; the last symbol may only be read after an odd number of middle symbols, so the total length is $1+\text{odd}+1$, which is odd.`,
    node: (
      <StateDiagram
        machine={b21odd}
        layout={{
          pos: { s: [0, 110], a1: [140, 0], a2: [290, 0], fa: [440, 0], b1: [140, 220], b2: [290, 220], fb: [440, 220] },
          names: { a1: "a_1", a2: "a_2", b1: "b_1", b2: "b_2", fa: "f_a", fb: "f_b" },
          startFrom: 180,
          edges: { "a1>a2": { bend: 20 }, "a2>a1": { bend: 20 }, "b1>b2": { bend: 20 }, "b2>b1": { bend: 20 } },
        }}
      />
    ),
  },
  "b21-7": {
    caption: r`CYK for 0100. $S$ is in the top cell $X_{14}$, so $0100\in L(G)$.`,
    node: <CykTriangle grammar={b21g7} word="0100" highlight={[[0, 3]]} />,
  },
  "b21-8": {
    wide: true,
    caption: r`From $q$ the PDA guesses which equality holds. Top: push X per a, pop one per b, then check the stack is back to Z and read any c's ($i=j$). Bottom: push X per a, read any b's, pop one per c ($i=k$).`,
    node: (
      <StateDiagram
        machine={b21pda}
        layout={{
          pos: { qs: [0, 120], q: [130, 120], pa: [270, 0], pb: [420, 0], pc: [570, 0], ra: [270, 240], rb: [420, 240], rc: [570, 240], qacc: [700, 120] },
          names: { qs: "q_s", pa: "p_a", pb: "p_b", pc: "p_c", ra: "r_a", rb: "r_b", rc: "r_c", qacc: "q_{acc}" },
          radius: { qacc: 24 },
          edges: { "pa>pa": { loop: -90 }, "pb>pb": { loop: -90 }, "pc>pc": { loop: -90 }, "ra>ra": { loop: 90 }, "rb>rb": { loop: 90 }, "rc>rc": { loop: 90 } },
        }}
      />
    ),
  },
}

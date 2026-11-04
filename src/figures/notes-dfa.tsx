import {
  dfa001,
  dfaAbNotBa,
  dfaComment,
  dfaDiv3,
  dfaEven1,
  dfaProduct,
  dfaScores,
  dfaSecondLast,
} from "@/content/machines/notes-dfa"
import { StateDiagram } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

export const dfaNoteFigures: FigureMap = {
  "dfa-even1": {
    caption: r`EVEN$_1$. $q_E$ means "an even number of 1's so far", $q_O$ "odd". A 0 never changes the parity, so it loops.`,
    node: <StateDiagram machine={dfaEven1} layout={{ pos: { qE: [0, 0], qO: [150, 0] } }} />,
  },
  "dfa-001": {
    caption: r`Each state is the longest suffix read so far that is also a prefix of 001. Once 001 has appeared, $q_{001}$ keeps it.`,
    node: <StateDiagram machine={dfa001} layout={{ pos: { q: [0, 0], q0: [130, 0], q00: [260, 0], q001: [390, 0] } }} />,
  },
  "dfa-div3": {
    caption: r`The remainder mod 3 of the number read so far. Reading bit $b$ sends remainder $r$ to $2r+b \bmod 3$. $q_s$ is not accepting, so $\varepsilon$ is rejected.`,
    node: (
      <StateDiagram
        machine={dfaDiv3}
        layout={{
          pos: { qs: [130, 140], q0: [130, 0], q1: [270, 0], q2: [410, 0] },
          names: { qs: "q_s" },
          startFrom: 180,
          edges: { "qs>q1": { side: -1 }, "qs>q0": { side: 1 } },
        }}
      />
    ),
  },
  "dfa-scores": {
    wide: true,
    caption: r`Scores $x$-$y$ with no leading zeros ($d$ is any nonzero digit). $0_1$/$d_1$: first score started with 0 / with $d$; the middle state: hyphen read; $D$: dead.`,
    node: (
      <StateDiagram
        machine={dfaScores}
        layout={{
          pos: { S: [0, 100], Z1: [130, 40], N1: [130, 170], H: [260, 100], Z2: [390, 40], N2: [390, 170], D: [260, -70] },
          names: { Z1: "0_1", N1: "d_1", H: "–", Z2: "0_2", N2: "d_2" },
          edges: {
            "S>D": { bend: 40 },
            "N1>N1": { loop: 90 },
            "N2>N2": { loop: 90 },
            "D>D": { loop: -90 },
            "N2>D": { bend: -125 },
          },
        }}
      />
    ),
  },
  "dfa-product": {
    caption: r`A state is a pair (parity of 0's, length mod 3). The inner triangle is the 1-moves between even states; the 0-moves run round the hexagon.`,
    node: (
      <StateDiagram
        machine={dfaProduct}
        layout={{
          pos: {
            E0: [-100, -58],
            O1: [0, -116],
            E2: [100, -58],
            O0: [100, 58],
            E1: [0, 116],
            O2: [-100, 58],
          },
          names: { E0: "E,0", E1: "E,1", E2: "E,2", O0: "O,0", O1: "O,1", O2: "O,2" },
          startFrom: 30,
          edges: {
            "O0>O1": { bend: -80 },
            "O1>O2": { bend: -80, t: 0.3 },
            "O2>O0": { bend: -80 },
          },
        }}
      />
    ),
  },
  "dfa-second-last": {
    caption: r`A sliding window: $q_{xy}$ means the last two symbols were $x$ then $y$. Reading $a$ moves to $q_{ya}$. Accept when the older symbol $x$ is 1.`,
    node: (
      <StateDiagram
        machine={dfaSecondLast}
        layout={{
          pos: { q00: [0, 0], q01: [170, 0], q10: [0, 150], q11: [170, 150] },
          edges: { "q00>q00": { loop: -90 }, "q11>q11": { loop: 90 }, "q01>q10": { side: 1 }, "q10>q01": { side: 1, t: 0.65 } },
        }}
      />
    ),
  },
  "dfa-ab-not-ba": {
    caption: r`Valid strings are exactly $a^+b^+$. Starting with $b$ ($B$) can never lead to acceptance, but $B$ stays separate from Dead to match the slide.`,
    node: (
      <StateDiagram
        machine={dfaAbNotBa}
        layout={{
          pos: { S: [0, 70], A: [130, 0], AB: [270, 0], B: [130, 140], Dead: [400, 70] },
          radius: { Dead: 26, AB: 23 },
          edges: { "Dead>Dead": { loop: 0 }, "AB>AB": { loop: -90 }, "A>A": { loop: -90 }, "B>B": { loop: 90 } },
        }}
      />
    ),
  },
  "dfa-comment": {
    wide: true,
    caption: r`One block comment over $\{/, *, x\}$. $q_2$: inside the comment; $q_3$: inside, just read a star; $q_4$: closed, so anything more is fatal; $d$: dead.`,
    node: (
      <StateDiagram
        machine={dfaComment}
        layout={{
          pos: { q0: [0, 0], q1: [120, 0], q2: [240, 0], q3: [360, 0], q4: [480, 0], d: [240, 140] },
          edges: {
            "q2>q2": { loop: -90 },
            "q3>q3": { loop: -90 },
            "d>d": { loop: 90 },
            "q2>q3": { bend: 18 },
            "q3>q2": { bend: 18 },
            "q1>d": { side: 1 },
          },
        }}
      />
    ),
  },
}

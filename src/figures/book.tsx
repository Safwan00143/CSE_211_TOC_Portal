import { s110a, s113, s122, s131, s14c, s15b, s16c, s16i, s17a, s17e, s17f, s18a, s27b } from "@/content/machines/book"
import { StateDiagram } from "./kit"
import type { FigureMap } from "./figure"
import type { EdgeStyle } from "./diagram-geometry"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)('*)$/, "$1_{$2}$3")]))

export const bookFigures: FigureMap = {
  "bk-s1-4c": {
    wide: true,
    caption: r`Product DFA. Top row: even number of a's so far, bottom row: odd; the subscript counts b's (3 means three or more). $a$ moves vertically, $b$ moves right. Accept $e_1$ and $e_2$.`,
    node: (
      <StateDiagram
        machine={s14c}
        layout={{
          pos: { "e,b0": [0, 0], "e,b1": [170, 0], "e,b2": [340, 0], "e,b3": [510, 0], "o,b0": [0, 170], "o,b1": [170, 170], "o,b2": [340, 170], "o,b3": [510, 170] },
          names: { "e,b0": "e_0", "e,b1": "e_1", "e,b2": "e_2", "e,b3": "e_3", "o,b0": "o_0", "o,b1": "o_1", "o,b2": "o_2", "o,b3": "o_3" },
          edges: Object.fromEntries(
            ["b0", "b1", "b2", "b3"].flatMap((b): [string, EdgeStyle][] => [
              [`e,${b}>o,${b}`, { bend: 20 }],
              [`o,${b}>e,${b}`, { bend: 20 }],
            ]).concat([
              ["e,b3>e,b3", { loop: 0 }],
              ["o,b3>o,b3", { loop: 0 }],
            ]),
          ),
          startFrom: 135,
        }}
      />
    ),
  },
  "bk-s1-5b": {
    wide: true,
    caption: r`The "contains baba" DFA with accepting and non-accepting states swapped: every state accepts except the trap $q_4$.`,
    node: (
      <StateDiagram
        machine={s15b}
        layout={{ pos: { q0: [0, 0], q1: [150, 0], q2: [300, 0], q3: [450, 0], q4: [600, 0] }, names: sub(s15b.states), edges: { "q0>q0": { loop: -90 }, "q1>q1": { loop: 90 }, "q4>q4": { loop: -90 }, "q2>q0": { bend: -45 }, "q3>q1": { bend: 45 } } }}
      />
    ),
  },
  "bk-s1-6c": {
    wide: true,
    caption: r`A state names the longest suffix read so far that is a prefix of $0101$; $f$ means $0101$ has been seen.`,
    node: (
      <StateDiagram
        machine={s16c}
        layout={{ pos: { e: [0, 0], p0: [150, 0], p01: [300, 0], p010: [450, 0], f: [600, 0] }, names: { e: "ε", p0: "0", p01: "01", p010: "010", f: "f" }, edges: { "e>e": { loop: -90 }, "p0>p0": { loop: -90 }, "f>f": { loop: -90 }, "p01>e": { bend: -95 }, "p010>p0": { bend: 50 } } }}
      />
    ),
  },
  "bk-s1-6i": {
    caption: r`$q_o$: the next position is odd (it must hold a 1); $q_e$: the next position is even (anything goes); $d$: dead.`,
    node: <StateDiagram machine={s16i} layout={{ pos: { odd: [0, 0], even: [180, 0], d: [0, 160] }, names: { odd: "q_o", even: "q_e", d: "d" }, edges: { "odd>even": { bend: 18 }, "even>odd": { bend: 18 }, "d>d": { loop: 0 } } }} />,
  },
  "bk-s1-13": {
    caption: r`State $XY$: $X$ = a 1 was seen at the parity of the next position, $Y$ = at the other parity. A 1 read while $X = 1$ goes to the dead state $d$.`,
    node: (
      <StateDiagram
        machine={s113}
        layout={{ pos: { "00": [0, 0], "01": [170, 0], "10": [170, 170], "11": [340, 0], d: [340, 170] }, names: { d: "d" }, edges: { "00>00": { loop: -90 }, "01>10": { bend: 18 }, "10>01": { bend: 18 }, "11>11": { loop: -90 }, "d>d": { loop: 0 } } }}
      />
    ),
  },
  "bk-s1-7a": {
    caption: r`Guess which 0 is the second-to-last symbol.`,
    node: <StateDiagram machine={s17a} layout={{ pos: { q0: [0, 0], q1: [150, 0], q2: [300, 0] }, names: sub(s17a.states), edges: { "q0>q0": { loop: -90 } } }} />,
  },
  "bk-s1-7e": {
    caption: r`One state per block of $0^*1^*0^+$; the $\varepsilon$-move lets the $1^*$ block be empty.`,
    node: <StateDiagram machine={s17e} layout={{ pos: { q1: [0, 0], q2: [150, 0], q3: [300, 0] }, names: sub(s17e.states), edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: -90 }, "q3>q3": { loop: -90 } } }} />,
  },
  "bk-s1-7f": {
    caption: r`$q_1$ loops on the 1s; each round $0\,0\,1$ returns to $q_1$.`,
    node: <StateDiagram machine={s17f} layout={{ pos: { q1: [0, 0], q2: [170, 0], q3: [85, 140] }, names: sub(s17f.states), edges: { "q1>q1": { loop: -90 } } }} />,
  },
  "bk-s1-8a": {
    wide: true,
    caption: r`Union: the new start $q_0$ has $\varepsilon$-moves into the DFA for 1.6(a) (top, primed) and the DFA for 1.6(b) (bottom, double-primed).`,
    node: (
      <StateDiagram
        machine={s18a}
        layout={{
          pos: { q0: [0, 110], "s'": [140, 20], "o'": [290, 20], "z'": [440, 20], "d'": [140, -110], "c0''": [140, 230], "c1''": [290, 230], "c2''": [440, 230], "c3''": [590, 230] },
          names: sub(s18a.states),
          edges: { "o'>z'": { bend: 18 }, "z'>o'": { bend: 18 }, "o'>o'": { loop: -90 }, "z'>z'": { loop: 0 }, "d'>d'": { loop: 0 }, "c0''>c0''": { loop: 90 }, "c1''>c1''": { loop: 90 }, "c2''>c2''": { loop: 90 }, "c3''>c3''": { loop: 0 } },
        }}
      />
    ),
  },
  "bk-s1-10a": {
    wide: true,
    caption: r`Star: a new accepting start $q_0$, and an $\varepsilon$-move from the accepting $c_3$ back to $c_0$.`,
    node: (
      <StateDiagram
        machine={s110a}
        layout={{ pos: { q0: [0, 0], c0: [140, 0], c1: [280, 0], c2: [420, 0], c3: [560, 0] }, names: sub(s110a.states), edges: { "c0>c0": { loop: -90 }, "c1>c1": { loop: 90 }, "c2>c2": { loop: 90 }, "c3>c3": { loop: 0 }, "c3>c0": { bend: -60 } } }}
      />
    ),
  },
  "bk-s1-31": {
    wide: true,
    caption: r`Every arrow of the "contains 0101" DFA reversed, a new start $r$ with an $\varepsilon$-move to the old accepting state, and the old start $\varepsilon$ now accepting. It recognises "contains 1010".`,
    node: (
      <StateDiagram
        machine={s131}
        layout={{
          pos: { e: [0, 0], p0: [150, 0], p01: [300, 0], p010: [450, 0], f: [600, 0], r: [600, 160] },
          names: { e: "ε", p0: "0", p01: "01", p010: "010", f: "f", r: "r" },
          startFrom: 180,
          edges: { "e>e": { loop: 180 }, "p0>p0": { loop: -90 }, "f>f": { loop: 0 }, "e>p01": { bend: -55 }, "p0>p010": { bend: 55 } },
        }}
      />
    ),
  },
  "bk-s1-22": {
    wide: true,
    caption: r`$s_2$: inside the comment; $s_3$: inside, just after a #; $s_4$: the comment is closed. Every missing move goes to the dead state $d$.`,
    node: (
      <StateDiagram
        machine={s122}
        layout={{ pos: { s0: [0, 0], s1: [140, 0], s2: [280, 0], s3: [420, 0], s4: [560, 0], d: [140, 180] }, names: sub(s122.states), edges: { "s2>s2": { loop: -90 }, "s3>s3": { loop: -90 }, "s2>s3": { bend: 18 }, "s3>s2": { bend: 18 }, "d>d": { loop: 90 } } }}
      />
    ),
  },
  "bk-s2-7b": {
    wide: true,
    caption: r`Three guesses: more a's ($q_x$), more b's ($q_y$), or a $b$ followed later by an $a$ ($q_z \to q_{acc}$).`,
    node: (
      <StateDiagram
        machine={s27b}
        layout={{
          pos: { qs: [0, 0], qa: [160, 0], qb: [340, 0], qx: [530, -110], qy: [530, 60], qz: [340, 220], acc: [560, 220] },
          names: { qs: "q_s", qa: "q_a", qb: "q_b", qx: "q_x", qy: "q_y", qz: "q_z", acc: "q_{acc}" },
          radius: { acc: 24 },
          edges: { "qa>qa": { loop: -90 }, "qb>qb": { loop: -90 }, "qx>qx": { loop: 0 }, "qy>qy": { loop: 0 }, "qz>qz": { loop: 180 }, "acc>acc": { loop: 0 } },
        }}
      />
    ),
  },
}

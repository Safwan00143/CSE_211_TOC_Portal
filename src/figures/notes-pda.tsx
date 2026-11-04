import {
  pda0n1n,
  pdaAnB2n,
  pdaBalanced,
  pdaEqual,
  pdaIEqK,
  pdaIJorJK,
  pdaILeJ,
  pdaNested,
  pdaPal,
  pdaSlide0n1n,
  pdaSum,
  pdaWHashWr,
} from "@/content/machines/notes-pda"
import { StateDiagram, type Layout } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/** "qpush" → q_{push}, "qacc" → q_{acc}, "qb1" → q_{b1}. */
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.length > 1 && q[0] === "q" && !/^q\d+$/.test(q) ? `q_{${q.slice(1)}}` : q]))
const row = (states: string[], gap = 150): Layout["pos"] => Object.fromEntries(states.map((q, i) => [q, [i * gap, 0]]))

export const pdaNoteFigures: FigureMap = {
  "pda-slide-0n1n": {
    caption: r`As drawn on the slide. With no bottom marker, the ε-move into $q_{acc}$ fires whatever is left on the stack, so this machine also accepts 0, 00 and 001.`,
    node: (
      <StateDiagram
        machine={pdaSlide0n1n}
        layout={{ pos: row(pdaSlide0n1n.states, 200), names: sub(pdaSlide0n1n.states), radius: { qpush: 26, qpop: 24, qacc: 24 }, edges: { "qpush>qacc": { bend: -55 } } }}
      />
    ),
  },
  "pda-0n1n": {
    caption: r`$\{0^n1^n \mid n\ge0\}$ with a bottom marker \$ (Sipser, Example 2.14). Acceptance is possible only after \$ is popped, that is, after every 0 has been matched.`,
    node: (
      <StateDiagram
        machine={pda0n1n}
        layout={{ pos: { q1: [0, 0], q2: [200, 0], q3: [200, 140], q4: [0, 140] }, edges: { "q2>q2": { loop: 0 }, "q3>q3": { loop: 0 } } }}
      />
    ),
  },
  "pda-anb2n": {
    caption: r`$a^nb^{2n}$: push X per a; b's come in pairs, the first ($q_{b1}$) pops nothing, the second ($q_{b0}$) pops one X.`,
    node: (
      <StateDiagram
        machine={pdaAnB2n}
        layout={{
          pos: { qs: [0, 0], qa: [160, 0], qb1: [340, 0], qb0: [340, 160], qacc: [160, 160] },
          names: sub(pdaAnB2n.states),
          edges: { "qa>qa": { loop: -90 } },
        }}
      />
    ),
  },
  "pda-i-le-j": {
    caption: r`$a^ib^j$, $i\le j$: each b first cancels an a. Once Z is on top again ($q_x$), any extra b's are read freely.`,
    node: (
      <StateDiagram
        machine={pdaILeJ}
        layout={{
          pos: { qs: [0, 0], qa: [160, 0], qb: [320, 0], qx: [320, 160], qacc: [160, 160] },
          names: sub(pdaILeJ.states),
          edges: { "qa>qa": { loop: -90 }, "qb>qb": { loop: -90 }, "qx>qx": { loop: 0 } },
        }}
      />
    ),
  },
  "pda-i-eq-k": {
    caption: r`$a^ib^jc^k$, $i=k$: the b's are read without touching the stack.`,
    node: (
      <StateDiagram
        machine={pdaIEqK}
        layout={{ pos: { ...row(["qs", "qa", "qb", "qc"]), qacc: [450, 150] }, names: sub(pdaIEqK.states) }}
      />
    ),
  },
  "pda-w-hash-wr": {
    caption: r`$w\#w^R$: push before #, pop and compare after it. The # marks the middle, so no guessing is needed.`,
    node: <StateDiagram machine={pdaWHashWr} layout={{ pos: row(pdaWHashWr.states, 160), names: sub(pdaWHashWr.states) }} />,
  },
  "pda-pal": {
    caption: r`All palindromes: guess the middle. The ε-move handles even length; reading one symbol without pushing handles odd length.`,
    node: <StateDiagram machine={pdaPal} layout={{ pos: row(pdaPal.states, 170), names: sub(pdaPal.states) }} />,
  },
  "pda-balanced": {
    caption: r`Balanced parentheses: the stack holds exactly the unmatched ( of the prefix read so far.`,
    node: <StateDiagram machine={pdaBalanced} layout={{ pos: row(pdaBalanced.states, 160), names: sub(pdaBalanced.states) }} />,
  },
  "pda-equal": {
    wide: true,
    caption: r`Equal numbers of 0's and 1's. In $q_0$ the X's count extra 0's, in $q_1$ extra 1's. $c_0$ and $c_1$ peek at the top after a cancellation: more X's means stay, Z means balanced again.`,
    node: (
      <StateDiagram
        machine={pdaEqual}
        layout={{
          pos: { qs: [0, 0], qe: [170, 0], q0: [380, -130], c0: [170, -230], q1: [380, 130], c1: [170, 230], qacc: [380, 0] },
          names: { ...sub(pdaEqual.states), qe: "q_=", q0: "q_0", q1: "q_1", c0: "c_0", c1: "c_1" },
          edges: { "q0>q0": { loop: 0 }, "q1>q1": { loop: 0 } },
        }}
      />
    ),
  },
  "pda-ij-or-jk": {
    wide: true,
    caption: r`$a^ib^jc^k$ with $i=j$ or $j=k$. From $q$ the machine guesses a branch: the top branch checks $i=j$ and ignores c's; the bottom one ignores a's and checks $j=k$.`,
    node: (
      <StateDiagram
        machine={pdaIJorJK}
        layout={{
          pos: { qs: [0, 120], q: [130, 120], pa: [270, 0], pb: [420, 0], pc: [570, 0], ra: [270, 240], rb: [420, 240], rc: [570, 240], qacc: [700, 120] },
          names: { ...sub(pdaIJorJK.states), pa: "p_a", pb: "p_b", pc: "p_c", ra: "r_a", rb: "r_b", rc: "r_c" },
          edges: { "pa>pa": { loop: -90 }, "pb>pb": { loop: -90 }, "pc>pc": { loop: -90 }, "ra>ra": { loop: 90 }, "rb>rb": { loop: 90 }, "rc>rc": { loop: 90 } },
        }}
      />
    ),
  },
  "pda-nested": {
    wide: true,
    caption: r`$a^nb^mc^md^n$: A's go under B's, so every c must match a b before any d can match an a.`,
    node: (
      <StateDiagram
        machine={pdaNested}
        layout={{ pos: { ...row(["qs", "qa", "qb", "qc", "qd"], 140), qacc: [560, 150] }, names: sub(pdaNested.states) }}
      />
    ),
  },
  "pda-sum": {
    caption: r`$a^ib^jc^{i+j}$: one X for every a and every b; each c pops one.`,
    node: <StateDiagram machine={pdaSum} layout={{ pos: { ...row(["qs", "qa", "qb", "qc"]), qacc: [450, 150] }, names: sub(pdaSum.states) }} />,
  },
}

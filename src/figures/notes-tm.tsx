import { tm0n1n, tmMonus } from "@/content/machines/notes-tm"
import { tmTrace } from "@/lib/automata"
import { StateDiagram, Tape } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

/** Tape figure for one step of a run (blanks shown as B). */
const snap = (step: number) => tmTrace(tm0n1n, "0011")[step]

export const tmNoteFigures: FigureMap = {
  "tm-0n1n": {
    wide: true,
    caption: r`HMU's TM for $\{0^n1^n \mid n\ge1\}$. $q_0$: mark the leftmost 0 as X. $q_1$: run right to the first 1 and mark it Y. $q_2$: run back left to the last X. $q_3$: no 0's left, check that only Y's remain.`,
    node: (
      <StateDiagram
        machine={tm0n1n}
        layout={{
          pos: { q0: [0, 0], q1: [190, 0], q2: [380, 0], q3: [0, 150], q4: [190, 150] },
          edges: { "q1>q1": { loop: -90 }, "q2>q2": { loop: -90 }, "q3>q3": { loop: 90 }, "q2>q0": { bend: 62 } },
        }}
      />
    ),
  },
  "tm-0n1n-tape": {
    caption: r`ID $X\,q_1\,011$ as a tape: the state is written just left of the scanned cell.`,
    node: <Tape cells={["B", ...snap(1).tape, "B"]} head={snap(1).head + 1} state="q_1" />,
  },
  "tm-monus": {
    wide: true,
    caption: r`HMU's monus machine: $0^m10^n\mapsto0^{m\dot-n}$. $q_0$–$q_3$ cancel one 0 of each block per round; $q_4$ cleans up when the second block runs out; $q_5$ blanks everything when the first block runs out; $q_6$ halts.`,
    node: (
      <StateDiagram
        machine={tmMonus}
        layout={{
          pos: { q0: [0, 0], q1: [170, 0], q2: [340, 0], q3: [340, 150], q4: [520, 0], q5: [0, 260], q6: [520, 260] },
          edges: {
            "q1>q1": { loop: -90 },
            "q2>q2": { loop: -90 },
            "q3>q3": { loop: 90 },
            "q4>q4": { loop: -90 },
            "q5>q5": { loop: 90 },
          },
        }}
      />
    ),
  },
}

import { b13actual, b13div4, b13evenA, b13even01, b13even01Subset, b13g6a, b13sum, b13tmWw, b13wcwr } from "@/content/machines/b13"
import { treesOf } from "@/lib/derivations"
import { TreeFig } from "../grammar"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const sub = (states: string[]) => Object.fromEntries(states.map((q) => [q, q.replace(/^([a-z])(\d+)$/, "$1_{$2}")]))
const [amb1, amb2] = treesOf(b13g6a, "001011")
const letters = Object.fromEntries(b13even01Subset.dfa.states.map((q, i) => [q, "ABCDE"[i]]))

export const paperB13Figures: FigureMap = {
  "b13-1a": {
    caption: r`$r_i$: sum $\equiv i \pmod 3$. Digits 0 and 3 change nothing; 1 and 2 add 1 and 2; R returns to $r_0$. Accept in $r_0$.`,
    node: (
      <StateDiagram
        machine={b13sum}
        layout={{
          pos: { r0: [0, 120], r1: [170, 0], r2: [170, 240] },
          names: sub(b13sum.states),
          startFrom: 180,
          edges: { "r0>r0": { loop: 90 }, "r1>r1": { loop: 0 }, "r2>r2": { loop: 0 }, "r0>r1": { bend: 18 }, "r1>r0": { bend: 18 }, "r0>r2": { bend: -18 }, "r2>r0": { bend: -18 }, "r1>r2": { bend: 18 }, "r2>r1": { bend: 18 } },
        }}
      />
    ),
  },
  "b13-1b": {
    wide: true,
    caption: r`Remembering the actual sum needs a state $s_n$ for every sum $n=0,1,2,\dots$; only $s_0,\dots,s_4$ are drawn (the moves out of $s_3$, $s_4$ on digits continue to $s_5$, $s_6$, …). Accepting: $s_0, s_3, s_6, \dots$`,
    node: (
      <StateDiagram
        machine={{ ...b13actual, delta: b13actual.delta.filter((d) => d[1] !== "R") }}
        layout={{
          pos: { s0: [0, 0], s1: [150, 0], s2: [300, 0], s3: [450, 0], s4: [600, 0] },
          names: sub(b13actual.states),
          edges: { "s0>s0": { loop: 90 }, "s1>s1": { loop: 90 }, "s2>s2": { loop: 90 }, "s0>s2": { bend: 40 }, "s1>s3": { bend: 40 }, "s2>s4": { bend: 40 } },
        }}
      />
    ),
  },
  "b13-2b": {
    caption: r`$r_i$: the number read so far is $\equiv i \pmod 4$, which is decided by its last two bits. $s$: nothing read (the empty string is not a number). Accept in $r_0$.`,
    node: (
      <StateDiagram
        machine={b13div4}
        layout={{
          pos: { s: [0, 100], r0: [160, 0], r1: [160, 200], r2: [340, 0], r3: [340, 200] },
          names: sub(b13div4.states),
          edges: { "r0>r0": { loop: -90 }, "r3>r3": { loop: 0 }, "r1>r2": { bend: 16 }, "r2>r1": { bend: 16 } },
        }}
      />
    ),
  },
  "b13-3a": {
    caption: r`$s_0$ guesses: either the whole string is the run of a's ($m$), or there is a prefix ending in b ($s$, which guesses the last b). $m\to o\to f$ reads the final run two a's at a time; $f$ accepts.`,
    node: (
      <StateDiagram
        machine={b13evenA}
        layout={{ pos: { s0: [0, 80], s: [150, 0], m: [150, 170], o: [300, 170], f: [450, 170] }, names: sub(b13evenA.states), edges: { "s>s": { loop: -90 }, "o>f": { bend: 18 }, "f>o": { bend: 18 } } }}
      />
    ),
  },
  "b13-4a": {
    wide: true,
    caption: r`Left: an NFA from $1^*(0^+1^+0^+1^+)^*0^*$: $s$ reads leading 1s, $a_1b_1a_2b_2$ read pairs of 0-run/1-run blocks (each 0-run followed by a 1-run is one occurrence of 01), and $z$ reads trailing 0s. Right: the reachable DFA ($A$–$E$).`,
    node: (
      <Row>
        <Panel title="NFA">
          <StateDiagram
            machine={b13even01}
            layout={{
              pos: { s: [0, 100], a1: [140, 0], b1: [280, 0], a2: [280, 200], b2: [140, 200], z: [0, 260] },
              names: sub(b13even01.states),
              edges: { "s>s": { loop: -90 }, "a1>a1": { loop: -90 }, "b1>b1": { loop: -90 }, "a2>a2": { loop: 90 }, "b2>b2": { loop: 90 }, "z>z": { loop: 180 } },
            }}
          />
        </Panel>
        <Panel title="DFA">
          <StateDiagram
            machine={b13even01Subset.dfa}
            layout={{
              pos: Object.fromEntries(b13even01Subset.dfa.states.map((q, i) => [q, [[0, 100], [140, 0], [280, 0], [280, 200], [140, 200]][i] as [number, number]])),
              names: letters,
              edges: Object.fromEntries(b13even01Subset.dfa.states.map((q) => [`${q}>${q}`, { loop: q === b13even01Subset.dfa.states[0] ? -90 : q === b13even01Subset.dfa.states[3] || q === b13even01Subset.dfa.states[4] ? 90 : -90 }])),
            }}
          />
        </Panel>
      </Row>
    ),
  },
  "b13-6a": {
    wide: true,
    caption: r`Two parse trees for 001011 in $S\to0A\mid1B$, $A\to0AA\mid1S\mid1$, $B\to1BB\mid0S\mid0$.`,
    node: (
      <Row>
        <Panel title="Tree 1">
          <TreeFig tree={amb1} />
        </Panel>
        <Panel title="Tree 2">
          <TreeFig tree={amb2} />
        </Panel>
      </Row>
    ),
  },
  "b13-6c": {
    caption: r`Push symbols until the c; then pop and match; accept when the bottom marker is exposed. Deterministic: the c marks the middle.`,
    node: (
      <StateDiagram
        machine={b13wcwr}
        layout={{ pos: { qs: [0, 0], qp: [150, 0], qm: [320, 0], qacc: [470, 0] }, names: { qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" }, radius: { qacc: 24 }, edges: { "qp>qp": { loop: -90 }, "qm>qm": { loop: -90 } } }}
      />
    ),
  },
  "b13-8b": {
    wide: true,
    caption: r`Zig-zag: cross off the first unmarked symbol ($q_2$ remembers a, $q_3$ b), find the first unmarked symbol after the −, check it matches and cross it off, return. When the first half is used up, check the second half is too. Labels are read → write, move; unlisted moves reject.`,
    node: (
      <StateDiagram
        machine={b13tmWw}
        layout={{
          pos: { q1: [0, 140], q2: [170, 0], q3: [170, 280], q4: [380, 0], q5: [380, 280], q6: [540, 140], q7: [380, 140], q8: [0, 330], qa: [180, 420] },
          names: { ...sub(b13tmWw.states), qa: "q_{acc}" },
          radius: { qa: 24 },
          edges: { "q2>q2": { loop: -90 }, "q3>q3": { loop: 90 }, "q4>q4": { loop: -90 }, "q5>q5": { loop: 90 }, "q6>q6": { loop: 0 }, "q7>q7": { loop: -90 }, "q1>q1": { loop: -90 }, "q8>q8": { loop: 180 } },
        }}
      />
    ),
  },
}

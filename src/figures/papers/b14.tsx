import { b14f1, b14f2, b14not3, b14pda5, b14q3i, b14q3ii, b14q3iii, b14q3iv, b14q3v } from "@/content/machines/b14"
import { Panel, Row, StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw
const f1Pos = { a: [0, 90], b: [150, 0], c: [300, 0], d: [150, 180], e: [300, 180] } as Record<string, [number, number]>

export const paperB14Figures: FigureMap = {
  "b14-1a": {
    caption: r`$F_1$ as printed. Missing transitions (for example from $c$ and $e$) mean the machine rejects.`,
    node: <StateDiagram machine={b14f1} layout={{ pos: f1Pos, edges: { "b>b": { loop: -90 } } }} />,
  },
  "b14-1c": {
    caption: r`$F_2$: $F_1$ with the extra transition $\delta(d,1)=d$.`,
    node: <StateDiagram machine={b14f2} layout={{ pos: f1Pos, edges: { "b>b": { loop: -90 }, "d>d": { loop: 90 } } }} />,
  },
  "b14-2a": {
    caption: r`$r_i$: the number read so far is $\equiv i \pmod 3$. Bit $b$ sends $r_i$ to $r_{(2i+b) \bmod 3}$. Accept in $r_1$, $r_2$ (not divisible by 3); $\varepsilon$ has value 0 and is rejected.`,
    node: <StateDiagram machine={b14not3} layout={{ pos: { r0: [0, 0], r1: [150, 0], r2: [300, 0] }, names: { r0: "r_0", r1: "r_1", r2: "r_2" }, edges: { "r0>r0": { loop: -90 }, "r2>r2": { loop: -90 } } }} />,
  },
  "b14-3a": {
    wide: true,
    caption: r`DFAs for (i)–(v). (iii) tracks the parity of the 0s ($E$/$O$) and the number of 1s (0, 1, 2, 3 = "3 or more"). (iv) remembers whether the input so far is ε, 1, 11 or 111, and otherwise is in "all". (v) counts 0s up to 2 and 1s up to 1; a second 1 is fatal.`,
    node: (
      <Row>
        <Panel title="(i) begins 1, ends 0">
          <StateDiagram machine={b14q3i} layout={{ pos: { s: [0, 60], o: [130, 0], z: [260, 0], d: [130, 130] }, edges: { "o>o": { loop: -90 }, "z>z": { loop: -90 }, "o>z": { bend: 18 }, "z>o": { bend: 18 }, "d>d": { loop: 0 } } }} />
        </Panel>
        <Panel title="(ii) third symbol 0">
          <StateDiagram machine={b14q3ii} layout={{ pos: { s: [0, 0], t1: [120, 0], t2: [240, 0], f: [360, 0], d: [240, 130] }, names: { t1: "t_1", t2: "t_2" }, edges: { "f>f": { loop: -90 }, "d>d": { loop: 0 } } }} />
        </Panel>
        <Panel title="(iii) even 0s or exactly two 1s">
          <StateDiagram
            machine={b14q3iii}
            layout={{
              pos: { E0: [0, 0], E1: [120, 0], E2: [240, 0], E3: [360, 0], O0: [0, 150], O1: [120, 150], O2: [240, 150], O3: [360, 150] },
              names: { E0: "E_0", E1: "E_1", E2: "E_2", E3: "E_3", O0: "O_0", O1: "O_1", O2: "O_2", O3: "O_3" },
              edges: { "E3>E3": { loop: -90 }, "O3>O3": { loop: 90 }, ...Object.fromEntries([0, 1, 2, 3].flatMap((k) => [[`E${k}>O${k}`, { bend: 16 }], [`O${k}>E${k}`, { bend: 16 }]])) },
            }}
          />
        </Panel>
        <Panel title="(iv) not 11 or 111">
          <StateDiagram machine={b14q3iv} layout={{ pos: { s: [0, 0], o1: [120, 0], o2: [240, 0], o3: [360, 0], all: [180, 150] }, names: { o1: "1", o2: "11", o3: "111" }, edges: { "all>all": { loop: 90 } } }} />
        </Panel>
        <Panel title="(v) ≥ two 0s, ≤ one 1">
          <StateDiagram
            machine={b14q3v}
            layout={{
              pos: { z0o0: [0, 0], z1o0: [130, 0], z2o0: [260, 0], z0o1: [0, 150], z1o1: [130, 150], z2o1: [260, 150], d: [130, 290] },
              names: { z0o0: "0,0", z1o0: "1,0", z2o0: "2,0", z0o1: "0,1", z1o1: "1,1", z2o1: "2,1" },
              edges: { "z2o0>z2o0": { loop: -90 }, "z2o1>z2o1": { loop: 0 }, "d>d": { loop: 0 } },
            }}
          />
        </Panel>
      </Row>
    ),
  },
  "b14-5a": {
    caption: r`The PDA of Question 5. Labels are *input, top $\to$ replacement* (HMU form, top of the stack first). $p$ is the accepting state.`,
    node: <StateDiagram machine={b14pda5} layout={{ pos: { q: [0, 0], p: [260, 0] }, names: { q: "q", p: "p" }, edges: { "q>q": { loop: -90 }, "p>p": { loop: -90 } } }} />,
  },
}

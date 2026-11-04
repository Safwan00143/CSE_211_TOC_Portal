import { b05q1a, b05q2b } from "@/content/machines/b05"
import { StateDiagram } from "../kit"
import type { FigureMap } from "../figure"

const r = String.raw

export const paperB05Figures: FigureMap = {
  "b05-1a": {
    caption: r`The first symbol picks a branch. $z_o/z_e$: began with 0, length so far odd/even (accept $z_o$); $o_o/o_e$: began with 1 (accept $o_e$).`,
    node: (
      <StateDiagram
        machine={b05q1a}
        layout={{ pos: { s: [0, 100], zo: [160, 0], ze: [330, 0], oo: [160, 200], oe: [330, 200] }, names: { zo: "z_o", ze: "z_e", oo: "o_o", oe: "o_e" }, edges: { "zo>ze": { bend: 18 }, "ze>zo": { bend: 18 }, "oo>oe": { bend: 18 }, "oe>oo": { bend: 18 } } }}
      />
    ),
  },
  "b05-2b": {
    caption: r`A state records the parities of the 0s and the 1s read so far (first letter: 0s, second: 1s; e even, o odd). 0 flips the first parity, 1 the second. Accept in $eo$.`,
    node: (
      <StateDiagram
        machine={b05q2b}
        layout={{ pos: { ee: [0, 0], eo: [200, 0], oe: [0, 180], oo: [200, 180] }, edges: { "ee>eo": { bend: 16 }, "eo>ee": { bend: 16 }, "oe>oo": { bend: 16 }, "oo>oe": { bend: 16 }, "ee>oe": { bend: 16 }, "oe>ee": { bend: 16 }, "eo>oo": { bend: 16 }, "oo>eo": { bend: 16 } } }}
      />
    ),
  },
}

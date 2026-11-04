import { Containment } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

export const undecNoteFigures: FigureMap = {
  "undec-classes": {
    wide: true,
    caption: r`Where the languages of this topic sit. $L_u$ and HALT are RE but not recursive; $L_d$ is not even RE. The complement of $L_u$ is also outside RE.`,
    node: (
      <Containment
        width={620}
        root={{
          label: "All languages",
          children: [
            {
              label: "Recursively enumerable (RE)",
              children: [
                { label: "Recursive (decidable)", children: [{ label: "Context-free", children: [{ label: "Regular", tone: "accent" }] }] },
                { label: "L_u, HALT", tone: "second" },
              ],
            },
            { label: "L_d, co-L_u", tone: "second" },
          ],
        }}
      />
    ),
  },
}

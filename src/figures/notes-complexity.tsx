import { Containment } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

export const complexityNoteFigures: FigureMap = {
  "cx-classes": {
    wide: true,
    caption: r`The widely believed picture. Every inclusion is known; whether P ≠ NP, NP ≠ PSPACE and PSPACE ≠ EXPTIME is open, but P ≠ EXPTIME is proved. PSPACE = NPSPACE by Savitch's theorem. If P = NP, the P and NP-complete boxes would merge with NP.`,
    node: (
      <Containment
        width={640}
        root={{
          label: "Recursively enumerable",
          children: [
            {
              label: "Recursive (decidable)",
              children: [
                {
                  label: "EXPTIME",
                  children: [
                    {
                      label: "PSPACE = NPSPACE",
                      children: [{ label: "NP", children: [{ label: "P", tone: "accent" }, { label: "NP-complete", tone: "second" }] }],
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />
    ),
  },
}

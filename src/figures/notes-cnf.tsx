import { hmuCyk } from "@/content/machines/notes-cnf"
import { CykTriangle } from "./kit"
import type { FigureMap } from "./figure"

const r = String.raw

export const cnfNoteFigures: FigureMap = {
  "cnf-cyk-baaba": {
    wide: true,
    caption: r`The CYK triangle for baaba (computed from the grammar). The bottom row is $X_{11},\dots,X_{55}$; the top cell is $X_{15}$. $S\in X_{15}$, so baaba $\in L(G)$.`,
    node: <CykTriangle grammar={hmuCyk} word="baaba" highlight={[[0, 4]]} />,
  },
}

import type { FigureMap } from "./figure"
import { kitDemoFigures } from "./kit-demo"
import { dfaNoteFigures } from "./notes-dfa"
import { nfaNoteFigures } from "./notes-nfa"
import { regularNoteFigures } from "./notes-regular"
import { cfgNoteFigures } from "./notes-cfg"
import { pdaNoteFigures } from "./notes-pda"
import { cnfNoteFigures } from "./notes-cnf"
import { pdaHmuNoteFigures } from "./notes-pda-hmu"
import { tmNoteFigures } from "./notes-tm"
import { undecNoteFigures } from "./notes-undec"
import { complexityNoteFigures } from "./notes-complexity"
import { paperB22Figures } from "./papers/b22"
import { paperB21Figures } from "./papers/b21"
import { paperB20Figures } from "./papers/b20"
import { paperB18Figures } from "./papers/b18"
import { paperB17Figures } from "./papers/b17"
import { paperB16Figures } from "./papers/b16"
import { paperB15Figures } from "./papers/b15"
import { paperB14Figures } from "./papers/b14"
import { paperB13Figures } from "./papers/b13"
import { paperB12Figures } from "./papers/b12"
import { paperB11Figures } from "./papers/b11"
import { paperB10Figures } from "./papers/b10"
import { paperB09Figures } from "./papers/b09"
import { paperB08Figures } from "./papers/b08"
import { paperB07Figures } from "./papers/b07"
import { paperB06Figures } from "./papers/b06"
import { paperB05Figures } from "./papers/b05"
import { bookFigures } from "./book"

/** Every figure on the site, by id. A ```fig block naming an id not listed here renders "Missing figure". */
export const figures: FigureMap = {
  ...kitDemoFigures,
  ...dfaNoteFigures,
  ...nfaNoteFigures,
  ...regularNoteFigures,
  ...cfgNoteFigures,
  ...pdaNoteFigures,
  ...cnfNoteFigures,
  ...pdaHmuNoteFigures,
  ...tmNoteFigures,
  ...undecNoteFigures,
  ...complexityNoteFigures,
  ...paperB22Figures,
  ...paperB21Figures,
  ...paperB20Figures,
  ...paperB18Figures,
  ...paperB17Figures,
  ...paperB16Figures,
  ...paperB15Figures,
  ...paperB14Figures,
  ...paperB13Figures,
  ...paperB12Figures,
  ...paperB11Figures,
  ...paperB10Figures,
  ...paperB09Figures,
  ...paperB08Figures,
  ...paperB07Figures,
  ...paperB06Figures,
  ...paperB05Figures,
  ...bookFigures,
}

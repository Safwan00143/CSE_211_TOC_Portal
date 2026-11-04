import type { TopicSlug } from "../types"
import { introNote } from "./intro"
import { dfaNote } from "./dfa"
import { nfaNote } from "./nfa"
import { closureNote } from "./closure"
import { regexNote } from "./regex"
import { pumpingRegularNote } from "./pumping-regular"
import { cfgNote } from "./cfg"
import { pumpingCflNote } from "./pumping-cfl"
import { pdaNote } from "./pda"
import { cnfCykNote } from "./cnf-cyk"
import { pdaHmuNote } from "./pda-hmu"
import { tmBasicsNote } from "./tm-basics"
import { tmTechniquesNote } from "./tm-techniques"
import { tmVariantsNote } from "./tm-variants"
import { undecidabilityNote } from "./undecidability"
import { complexityNote } from "./complexity"

/** Notes are added topic by topic; a topic without one shows a short placeholder. */
export const notes: Partial<Record<TopicSlug, string>> = {
  intro: introNote,
  dfa: dfaNote,
  nfa: nfaNote,
  closure: closureNote,
  regex: regexNote,
  "pumping-regular": pumpingRegularNote,
  cfg: cfgNote,
  "pumping-cfl": pumpingCflNote,
  pda: pdaNote,
  "cnf-cyk": cnfCykNote,
  "pda-hmu": pdaHmuNote,
  "tm-basics": tmBasicsNote,
  "tm-techniques": tmTechniquesNote,
  "tm-variants": tmVariantsNote,
  undecidability: undecidabilityNote,
  complexity: complexityNote,
}

/** Level-2 headings, used for the "on this page" outline. */
export function outline(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((m) => ({
    title: m[1],
    id: slugify(m[1]),
  }))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

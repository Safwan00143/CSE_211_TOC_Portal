import type { TopicSlug } from "./types"

/** Animated slide decks (self-contained HTML files in public/slides). */
export type Deck = {
  file: string
  title: string
  teacher: string
  source: string
  slides: number
  summary: string
  topics: TopicSlug[]
  highlights: string[]
}

export const decks: Deck[] = [
  {
    file: "pda-part-2.html",
    title: "Pushdown automata, the second half",
    teacher: "Atif Sir",
    source: "PDA lecture, pages 115–136",
    slides: 29,
    summary: "PDA to grammar, the pumping lemma for context-free languages, deterministic PDAs, LR(k), context-sensitive grammars and the Chomsky hierarchy.",
    topics: ["pda-hmu", "pumping-cfl"],
    highlights: ["Run a PDA beside its grammar on your own input", "Try every split of 0ⁿ1ⁿ2ⁿ", "Pump a parse tree with a slider"],
  },
  {
    file: "turing-machines.html",
    title: "Turing machines",
    teacher: "Atif Sir",
    source: "Lectures 4, 5 and 6",
    slides: 33,
    summary: "The machine and its 7-tuple, IDs, 0ⁿ1ⁿ and monus, storage in the state, tracks, binary addition, multitape and nondeterministic machines, restricted machines and real computers.",
    topics: ["tm-basics", "tm-techniques", "tm-variants"],
    highlights: ["Run 0ⁿ1ⁿ, monus, wcw and the adder on any input", "Watch two tapes fold into one", "Fold a two-way tape in half"],
  },
  {
    file: "undecidability.html",
    title: "Undecidability",
    teacher: "Atif Sir",
    source: "Lecture 7",
    slides: 20,
    summary: "Recursive and RE languages, coding machines as binary strings, diagonalization, complements, the universal machine, the halting problem, reductions and Post's Correspondence Problem.",
    topics: ["undecidability"],
    highlights: ["Edit the diagonal table and watch L_d escape every row", "A universal machine running a real TM", "Play Post's Correspondence Problem"],
  },
]

export const decksFor = (slug: string) => decks.filter((d) => d.topics.includes(slug as TopicSlug))

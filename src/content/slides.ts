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
  {
    file: "intractability.html",
    title: "Intractability and space",
    teacher: "Atif Sir",
    source: "Lectures 8 and 9",
    slides: 31,
    summary: "P and NP, polynomial-time reductions, NP-completeness, Cook's theorem, 3-SAT to Hamiltonian cycle, Clique, Partition, PSPACE and Savitch's theorem.",
    topics: ["complexity"],
    highlights: ["Toggle x₁, x₂, x₃ and watch the Hamiltonian cycle form or break", "Balance Subset Sum on a Partition scale", "Follow Savitch's recursion stack"],
  },
  {
    file: "tm-questions.html",
    title: "Turing machine questions, solved",
    teacher: "Term finals",
    source: "2006-07 to 2023-24",
    slides: 62,
    summary: "All 49 TM question parts from 17 papers. Each starts with the full question, highlights what it asks, builds the approach, then solves it: the bitwise machines of recent Q9s, arithmetic, deciders, definitions, and the simulations and true/false statements of Q10.",
    topics: ["tm-basics", "tm-techniques", "tm-variants"],
    highlights: ["Run AND, OR, XOR, NOT, equality and two's complement on your own input", "See the four table cells that separate AND, OR and XOR", "Watch one tape simulate two, and a DTM search an NTM's IDs"],
  },
]

export const decksFor = (slug: string) => decks.filter((d) => d.topics.includes(slug as TopicSlug))

import type { Topic, TopicSlug } from "./types"

const SIPSER = "Sipser's notation, as on Hakim Sir's slides."
const HMU = "Hopcroft–Motwani–Ullman notation, as on Atif Sir's slides."

export const topics: Topic[] = [
  {
    slug: "intro",
    title: "Computation, strings and languages",
    short: "What theory of computation asks, alphabets, strings, languages, and why every problem is a language.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lectures 1–2",
    notation: SIPSER,
  },
  {
    slug: "dfa",
    title: "Deterministic finite automata",
    short: "States as summaries of the past, the formal 5-tuple, acceptance, dead states, and designing DFAs.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 3",
    notation: SIPSER,
  },
  {
    slug: "nfa",
    title: "Nondeterminism, ε-NFAs and the subset construction",
    short: "Guessing machines, computation trees, ε-closures, removing ε-moves, and converting any NFA to a DFA.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 4",
    notation: SIPSER,
  },
  {
    slug: "closure",
    title: "Regular operations and closure properties",
    short: "Union, concatenation and star as machine constructions, then complement, intersection, difference and reverse.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 5 (first half)",
    notation: SIPSER,
  },
  {
    slug: "regex",
    title: "Regular expressions and Kleene's theorem",
    short: "Syntax and meaning of regular expressions, translating English, regex to NFA, and DFA to regex by ripping states.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 5 (second half)",
    notation: SIPSER,
  },
  {
    slug: "pumping-regular",
    title: "Non-regular languages and the pumping lemma",
    short: "Why finite memory must loop, the pumping lemma, the adversary game, and proofs by closure.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 6",
    notation: SIPSER,
  },
  {
    slug: "cfg",
    title: "Context-free grammars",
    short: "Derivations, parse trees, designing grammars, ambiguity and inherent ambiguity.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 7",
    notation: SIPSER,
  },
  {
    slug: "pumping-cfl",
    title: "The pumping lemma for context-free languages",
    short: "Pumping two pieces at once, where vxy can sit, and full case analyses for the standard non-CFLs.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 7 · proof also in Atif Sir's Lecture 3",
    notation: SIPSER,
  },
  {
    slug: "pda",
    title: "Pushdown automata: design",
    short: "A finite control with a stack, Sipser's 6-tuple, configurations, and ten design patterns.",
    part: "A",
    teacher: "Hakim Sir",
    lectures: "Hakim Sir · Lecture 8",
    notation: SIPSER,
  },
  {
    slug: "cnf-cyk",
    title: "Simplifying grammars, CNF and CYK",
    short: "Removing ε-productions, unit productions and useless symbols, Chomsky normal form, and the CYK table.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 2",
    notation: HMU,
  },
  {
    slug: "pda-hmu",
    title: "Pushdown automata: IDs, acceptance and grammars",
    short: "The 7-tuple with Z₀, instantaneous descriptions, final state vs empty stack, CFG ↔ PDA, and DPDAs.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 3",
    notation: HMU,
  },
  {
    slug: "tm-basics",
    title: "Turing machines",
    short: "The tape, the 7-tuple, IDs, transition diagrams, recognising languages and computing functions.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 4",
    notation: HMU,
  },
  {
    slug: "tm-techniques",
    title: "Programming techniques for Turing machines",
    short: "Storage in the state, multiple tracks and subroutines, applied to bitwise and arithmetic machines.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 5",
    notation: HMU,
  },
  {
    slug: "tm-variants",
    title: "Extensions, restrictions and real computers",
    short: "Multitape and nondeterministic TMs, semi-infinite tapes, multistack and counter machines, TMs vs computers.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 6",
    notation: HMU,
  },
  {
    slug: "undecidability",
    title: "Decidability and undecidability",
    short: "Recursive and RE languages, encoding TMs, the diagonalization language, the universal language and halting.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lecture 7",
    notation: HMU,
  },
  {
    slug: "complexity",
    title: "Intractability: P, NP and PSPACE",
    short: "Polynomial-time reductions, NP-completeness, Cook's theorem, classic reductions, and space classes.",
    part: "B",
    teacher: "Atif Sir",
    lectures: "Atif Sir · Lectures 8–9",
    notation: HMU,
  },
]

export function getTopic(slug: string) {
  return topics.find((t) => t.slug === slug)
}

export function topicIndex(slug: TopicSlug) {
  return topics.findIndex((t) => t.slug === slug)
}

import type { BookProblem, TopicSlug } from "../types"
import { hmuProblems } from "./hmu"
import { sipserProblems } from "./sipser"

/** Sipser for Part A topics, HMU for Part B, each in its teacher's notation. */
export const bookProblems: BookProblem[] = [...sipserProblems, ...hmuProblems]

export const bookTitles: Record<BookProblem["book"], string> = {
  Sipser: "Sipser, Introduction to the Theory of Computation (3rd ed.)",
  HMU: "Hopcroft, Motwani & Ullman, Introduction to Automata Theory, Languages, and Computation (3rd ed.)",
  Linz: "Linz, An Introduction to Formal Languages and Automata (6th ed.)",
}

/** Kept in the order written: each topic file runs from warm-up problems to harder ones. */
export function bookProblemsFor(topic: TopicSlug) {
  return bookProblems.filter((p) => p.topic === topic)
}

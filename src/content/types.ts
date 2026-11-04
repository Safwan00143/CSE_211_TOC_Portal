export type TopicSlug =
  | "intro"
  | "dfa"
  | "nfa"
  | "closure"
  | "regex"
  | "pumping-regular"
  | "cfg"
  | "pumping-cfl"
  | "pda"
  | "cnf-cyk"
  | "pda-hmu"
  | "tm-basics"
  | "tm-techniques"
  | "tm-variants"
  | "undecidability"
  | "complexity"

export type Question = {
  id: string
  topic: TopicSlug
  course: "CSE 211"
  /** Academic session printed on the paper, e.g. "2023-2024", or "January 2020 Term". */
  session: string
  /** Batch that sat the paper, e.g. "22 batch". */
  batch: string
  /** Sort key, newest first: the year the exam was held. */
  year: number
  label: string
  marks?: number
  prompt: string
  /** Undefined while the worked solution is still being written. */
  solution?: string
  /** Ids from the figure registry, drawn after the prompt / at the end of the solution. */
  promptFigs?: string[]
  solutionFigs?: string[]
  /** Other papers where essentially the same question appeared. */
  alsoAsked?: string[]
  note?: string
}

/** A worked practice problem taken from a textbook. Kept apart from term-final questions. */
export type BookProblem = {
  /** Prefixed "bk-" so solved-progress never collides with term-final ids. */
  id: string
  topic: TopicSlug
  book: "Sipser" | "HMU" | "Linz"
  /** Where it comes from, e.g. "Exercise 1.6(c)" or "Example 2.3". */
  ref: string
  prompt: string
  solution: string
  promptFigs?: string[]
  solutionFigs?: string[]
}

/** One lettered part of a question on a full past paper. */
export type PaperPart = {
  /** "a", "b", … as printed; "" for a question with no lettered parts. */
  part: string
  /** Marks as printed, e.g. 8⅓ is written 8.33. */
  marks: number
  topic: TopicSlug
  /** The part's own text, without the question's shared stem. Figures go inline as ```fig blocks. */
  prompt: string
  solution?: string
  alsoAsked?: string[]
  note?: string
}

export type PaperQuestion = {
  no: number
  /** Text shared by every part, printed once above them. */
  stem?: string
  parts: PaperPart[]
}

/** A whole term-final paper, kept in its printed order. */
export type Paper = {
  /** URL segment, e.g. "b22". */
  slug: string
  /** "22 batch". */
  batch: string
  course: "CSE 211"
  /** As printed: "2023-2024", or "January 2020 Term". */
  session: string
  /** Year the exam was held, for sorting. */
  year: number
  /** Header line as printed, e.g. "L-2/T-II B. Sc. Engineering Examinations 2023-2024". */
  exam: string
  date: string
  fullMarks: number
  time: string
  sections: { name: string; instructions: string; questions: PaperQuestion[] }[]
}

export type Topic = {
  slug: TopicSlug
  title: string
  short: string
  part: "A" | "B"
  teacher: "Hakim Sir" | "Atif Sir"
  lectures: string
  /** One line on whose notation the topic uses. */
  notation: string
}

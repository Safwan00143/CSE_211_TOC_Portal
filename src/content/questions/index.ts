import type { Question, TopicSlug } from "../types"
import { paperQuestions } from "../papers"

/** Every term-final question comes from a whole-paper file, so each part is written once. */
export const questions: Question[] = paperQuestions

/** Newest exam first, then by question label. */
function compare(a: Question, b: Question) {
  if (a.year !== b.year) return b.year - a.year
  return a.label.localeCompare(b.label, undefined, { numeric: true })
}

export function questionsFor(topic: TopicSlug) {
  return questions.filter((q) => q.topic === topic).sort(compare)
}

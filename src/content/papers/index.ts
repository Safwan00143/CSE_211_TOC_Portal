import type { Paper, PaperPart, PaperQuestion, Question } from "../types"
import { paperB22 } from "./b22"
import { b22Solutions } from "./b22-solutions"
import { paperB21 } from "./b21"
import { b21Solutions } from "./b21-solutions"
import { paperB20 } from "./b20"
import { b20Solutions } from "./b20-solutions"
import { paperB18 } from "./b18"
import { b18Solutions } from "./b18-solutions"
import { paperB17 } from "./b17"
import { b17Solutions } from "./b17-solutions"
import { paperB16 } from "./b16"
import { b16Solutions } from "./b16-solutions"
import { paperB15 } from "./b15"
import { b15Solutions } from "./b15-solutions"
import { paperB14 } from "./b14"
import { b14Solutions } from "./b14-solutions"
import { paperB13 } from "./b13"
import { b13Solutions } from "./b13-solutions"
import { paperB12 } from "./b12"
import { b12Solutions } from "./b12-solutions"
import { paperB11 } from "./b11"
import { b11Solutions } from "./b11-solutions"
import { paperB10 } from "./b10"
import { b10Solutions } from "./b10-solutions"
import { paperB09 } from "./b09"
import { b09Solutions } from "./b09-solutions"
import { paperB08 } from "./b08"
import { b08Solutions } from "./b08-solutions"
import { paperB07 } from "./b07"
import { b07Solutions } from "./b07-solutions"
import { paperB06 } from "./b06"
import { b06Solutions } from "./b06-solutions"
import { paperB05 } from "./b05"
import { b05Solutions } from "./b05-solutions"

/**
 * Attach worked solutions, kept in a companion file keyed by part ("1a", "5",
 * "12i"), to a paper. Throws on a key that matches no part, so a typo cannot
 * silently drop a solution.
 */
function withSolutions(p: Paper, solutions: Record<string, string>): Paper {
  const keys = new Set(p.sections.flatMap((s) => s.questions.flatMap((q) => q.parts.map((part) => `${q.no}${part.part}`))))
  for (const k of Object.keys(solutions)) if (!keys.has(k)) throw new Error(`${p.slug}: solution for unknown part ${k}`)
  return {
    ...p,
    sections: p.sections.map((s) => ({
      ...s,
      questions: s.questions.map((q) => ({
        ...q,
        parts: q.parts.map((part) => ({ ...part, solution: part.solution ?? solutions[`${q.no}${part.part}`] })),
      })),
    })),
  }
}

/** Newest first. Each file holds one whole paper in printed order. */
export const papers: Paper[] = [withSolutions(paperB22, b22Solutions), withSolutions(paperB21, b21Solutions), withSolutions(paperB20, b20Solutions), withSolutions(paperB18, b18Solutions), withSolutions(paperB17, b17Solutions), withSolutions(paperB16, b16Solutions), withSolutions(paperB15, b15Solutions), withSolutions(paperB14, b14Solutions), withSolutions(paperB13, b13Solutions), withSolutions(paperB12, b12Solutions), withSolutions(paperB11, b11Solutions), withSolutions(paperB10, b10Solutions), withSolutions(paperB09, b09Solutions), withSolutions(paperB08, b08Solutions), withSolutions(paperB07, b07Solutions), withSolutions(paperB06, b06Solutions), withSolutions(paperB05, b05Solutions)]

export function getPaper(slug: string) {
  return papers.find((p) => p.slug === slug)
}

/** Id of one part's own solution page, e.g. "1a", or "5" for an unlettered question. */
export const partKey = (q: PaperQuestion, part: PaperPart) => `${q.no}${part.part}`

/** Every part of a paper with its question, in printed order. */
export function paperParts(p: Paper) {
  return p.sections.flatMap((s) => s.questions.flatMap((q) => q.parts.map((part) => ({ q, part }))))
}

function label(no: number, letters: string[]) {
  if (letters.length === 1) return letters[0] ? `Q${no}(${letters[0]})` : `Q${no}`
  const run = letters.every((l, i) => i === 0 || l.charCodeAt(0) === letters[i - 1].charCodeAt(0) + 1)
  return run && letters.length > 2 ? `Q${no}(${letters[0]})–(${letters.at(-1)})` : `Q${no}` + letters.map((l) => `(${l})`).join(",")
}

/**
 * The same parts as topic-wise practice questions. Neighbouring parts of one
 * question on the same topic become one entry, e.g. "Q4(a)–(c)".
 */
function toQuestions(p: Paper): Question[] {
  const out: Question[] = []
  for (const section of p.sections) {
    for (const q of section.questions) {
      const groups: PaperPart[][] = []
      for (const part of q.parts) {
        const last = groups.at(-1)
        if (last && last[0].topic === part.topic) last.push(part)
        else groups.push([part])
      }
      for (const g of groups) {
        const letters = g.map((x) => x.part)
        const single = g.length === 1
        const parts = single
          ? g[0].prompt
          : g
              // Marks may not follow a closing $$ on the same line, or the display math breaks.
              .map((x) => `**(${x.part})** ${x.prompt}${x.prompt.trimEnd().endsWith("$$") ? "\n\n" : " "}*(${x.marks})*`)
              .join("\n\n")
        const pending = g.some((x) => !x.solution)
        const alsoAsked = [...new Set(g.flatMap((x) => x.alsoAsked ?? []))]
        const notes = g.map((x) => x.note).filter(Boolean)
        out.push({
          id: `211-${p.slug}-${q.no}${letters.join("")}`,
          topic: g[0].topic,
          course: p.course,
          session: p.session,
          batch: p.batch,
          year: p.year,
          label: label(q.no, letters),
          marks: Math.round(g.reduce((s, x) => s + x.marks, 0) * 100) / 100,
          prompt: q.stem ? `${q.stem}\n\n${parts}` : parts,
          solution: pending
            ? undefined
            : single
              ? g[0].solution
              : g.map((x) => `### (${x.part})\n\n${x.solution}`).join("\n\n"),
          alsoAsked: alsoAsked.length ? alsoAsked : undefined,
          note: notes.length ? notes.join(" ") : undefined,
        })
      }
    }
  }
  return out
}

export const paperQuestions: Question[] = papers.flatMap(toQuestions)

/** "8.33" → "8⅓" as printed on the papers. */
export function formatMarks(m: number) {
  const whole = Math.floor(m)
  const frac = Math.round((m - whole) * 100)
  if (frac === 33) return `${whole}⅓`
  if (frac === 67) return `${whole}⅔`
  if (frac === 50) return `${whole}½`
  return String(m)
}

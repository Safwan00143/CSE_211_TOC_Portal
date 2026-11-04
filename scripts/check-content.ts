/*
  Lints every note, prompt and solution for the markdown/LaTeX traps that break
  pages silently:
    - "##" headings with math (the "On this page" links would not match),
    - a bare "|" inside $…$ on a table row (it splits the cell; use \mid or \lvert…\rvert),
    - text after a closing $$ on the same line (the display breaks),
    - an odd number of $$ fences, and unbalanced inline $,
    - filler phrases the writing style rules out.
  Exits non-zero on any problem.
*/
import { notes } from "../src/content/notes"
import { papers } from "../src/content/papers"
import { bookProblems } from "../src/content/book"

const sources: [string, string][] = [
  ...Object.entries(notes).map(([k, v]) => [`note ${k}`, v ?? ""] as [string, string]),
  ...papers.flatMap((p) =>
    p.sections.flatMap((s) =>
      s.questions.flatMap((q) => [
        [`${p.slug} Q${q.no} stem`, q.stem ?? ""] as [string, string],
        ...q.parts.flatMap((part) => [
          [`${p.slug} ${q.no}${part.part} prompt`, part.prompt] as [string, string],
          [`${p.slug} ${q.no}${part.part} solution`, part.solution ?? ""] as [string, string],
        ]),
      ]),
    ),
  ),
  ...bookProblems.flatMap((b) => [[`${b.id} prompt`, b.prompt] as [string, string], [`${b.id} solution`, b.solution] as [string, string]]),
]

const FILLER = [/let'?s dive in/i, /it'?s important to note/i, /in conclusion/i, /it is worth noting/i, /delve/i]

let problems = 0
const report = (where: string, line: number, msg: string, text: string) => {
  problems++
  console.log(`${where}:${line}  ${msg}\n    ${text.trim().slice(0, 110)}`)
}

for (const [where, text] of sources) {
  const lines = text.split("\n")
  let inFence = false
  let inDisplay = false
  lines.forEach((line, i) => {
    const n = i + 1
    if (/^```/.test(line)) inFence = !inFence
    if (inFence) return
    const fences = (line.match(/\$\$/g) ?? []).length
    if (fences % 2 === 1) {
      if (inDisplay && line.replace(/^.*?\$\$/, "").trim()) report(where, n, "text after closing $$", line)
      inDisplay = !inDisplay
    }
    if (inDisplay) return
    if (/^## .*\$/.test(line)) report(where, n, "math in a ## heading (breaks the outline links)", line)
    if (/^\s*\|/.test(line)) {
      for (const m of line.matchAll(/\$([^$]*)\$/g)) if (m[1].includes("|")) report(where, n, "bare | inside math in a table row", line)
    }
    const inline = line.replace(/\$\$[^$]*\$\$/g, "").replace(/\\\$/g, "")
    if (((inline.match(/\$/g) ?? []).length) % 2 === 1) report(where, n, "odd number of $ on the line", line)
    for (const f of FILLER) if (f.test(line)) report(where, n, `filler phrase ${f}`, line)
  })
  if (inDisplay) report(where, lines.length, "unclosed $$ block", "")
}

console.log(problems ? `\n${problems} problem(s).` : `Content lint: ${sources.length} texts, no problems.`)
if (problems) process.exit(1)

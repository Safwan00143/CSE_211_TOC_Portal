/*
  Checks every figure on the site without a browser:
    1. every ```fig id used in notes, papers and book problems exists in the registry;
    2. every state diagram has no label on a line or state, no overlapping labels,
       and no edge cutting through a state (see diagramIssues).
  Exits non-zero on any problem.

    npm run check:figures
*/
import { isValidElement, type ReactElement, type ReactNode } from "react"
import { figures } from "../src/figures"
import { StateDiagram } from "../src/figures/kit"
import { diagramGeometry, diagramIssues } from "../src/figures/diagram-geometry"
import { notes } from "../src/content/notes"
import { papers } from "../src/content/papers"
import { bookProblems } from "../src/content/book"

let problems = 0

/* 1. Figure ids referenced from content */
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
const used = new Set<string>()
for (const [where, text] of sources) {
  for (const block of text.matchAll(/```fig\n([\s\S]*?)```/g)) {
    for (const id of block[1].split("\n").map((s) => s.trim()).filter(Boolean)) {
      used.add(id)
      if (!figures[id]) {
        problems++
        console.log(`MISSING figure "${id}" referenced in ${where}`)
      }
    }
  }
}
for (const b of bookProblems) for (const id of [...(b.promptFigs ?? []), ...(b.solutionFigs ?? [])]) used.add(id)

/* 2. Geometry of every state diagram */
function diagrams(node: ReactNode, out: ReactElement<Parameters<typeof StateDiagram>[0]>[] = []) {
  if (Array.isArray(node)) node.forEach((n) => diagrams(n, out))
  else if (isValidElement(node)) {
    if (node.type === StateDiagram) out.push(node as ReactElement<Parameters<typeof StateDiagram>[0]>)
    diagrams((node.props as { children?: ReactNode }).children, out)
  }
  return out
}

let count = 0
for (const [id, entry] of Object.entries(figures)) {
  for (const el of diagrams(entry.node)) {
    count++
    const issues = diagramIssues(diagramGeometry(el.props.machine, el.props.layout, el.props.labels))
    if (issues.length) {
      problems++
      console.log(`LAYOUT ${id}\n    ${issues.join("\n    ")}`)
    }
  }
}

const unused = Object.keys(figures).filter((id) => !used.has(id) && !id.startsWith("kit-"))
console.log(`\n${count} state diagrams checked; ${used.size} figure ids referenced; ${unused.length} registry figures not referenced yet.`)
if (unused.length) console.log(`  not referenced: ${unused.join(", ")}`)
if (problems) {
  console.log(`${problems} problem(s).`)
  process.exit(1)
}
console.log("No problems.")

/*
  Fetches every page of a running site and reports KaTeX errors, missing
  figures, and stray "$" left in rendered text (maths that failed to parse).

    npm run scan                          (dev server on :3211)
    npm run scan -- http://localhost:4000 (any other base URL)
*/
import { topics } from "../src/content/topics"
import { papers, paperParts, partKey } from "../src/content/papers"
import { questions } from "../src/content/questions"
import { bookProblems } from "../src/content/book"

const base = process.argv[2] ?? "http://localhost:3211"

const routes = [
  "/",
  "/practice",
  "/papers",
  "/figures",
  ...topics.flatMap((t) => [`/learn/${t.slug}`, `/practice/${t.slug}`]),
  ...papers.map((p) => `/papers/${p.slug}`),
  ...questions.filter((q) => q.solution).map((q) => `/practice/${q.topic}/solution/${q.id}`),
  ...bookProblems.map((b) => `/practice/${b.topic}/solution/${b.id}`),
  ...papers.flatMap((p) => paperParts(p).filter(({ part }) => part.solution).map(({ q, part }) => `/papers/${p.slug}/solution/${partKey(q, part)}`)),
]

/** Visible text with KaTeX output, scripts and styles removed. */
function plainText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<span class="katex[\s\S]*?<\/annotation><\/semantics><\/math><\/span>/g, "")
    .replace(/<svg[\s\S]*?<\/svg>/g, "")
    .replace(/<[^>]+>/g, " ")
}

let bad = 0
let n = 0
const limit = 8
async function scan(route: string) {
  const res = await fetch(base + route)
  n++
  if (!res.ok) {
    bad++
    console.log(`HTTP ${res.status}  ${route}`)
    return
  }
  const html = await res.text()
  const errors = (html.match(/class="katex-error"/g) ?? []).length
  const missing = (html.match(/Missing figure:/g) ?? []).length
  // A "$" that survives in plain text means a formula was not parsed (captions write a literal $ deliberately as \$, which renders without the backslash).
  const strays = plainText(html).match(/\$[^$\s][^$]{0,40}/g) ?? []
  if (errors || missing || strays.length) {
    bad++
    console.log(`${route}\n    katex errors: ${errors}, missing figures: ${missing}, stray $: ${strays.slice(0, 3).join(" … ")}`)
  }
}

async function main() {
  const queue = [...routes]
  await Promise.all(
    Array.from({ length: limit }, async () => {
      while (queue.length) await scan(queue.shift()!)
    }),
  )
  console.log(`\nScanned ${n} pages; ${bad} with problems.`)
  if (bad) process.exit(1)
}
main()

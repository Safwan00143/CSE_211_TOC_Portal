/*
  Puts every step of a chained display equation on its own line:

    x^2-4 = x^2-2^2 = (x+2)(x-2)

  becomes

    x^2-4
    = x^2-2^2
    = (x+2)(x-2)

  Only top-level relations are split, so anything inside braces, brackets or
  parentheses (\boxed{…}, \frac{…}{…}, sums with limits) stays whole. Blocks
  that are already laid out by hand (aligned, cases, matrices, explicit line
  breaks) are left alone.
*/

const EQUALS = ["=", "\\approx"]
// Arrows join whole statements ("a = b ⇒ c = d"), so when present they are the only split points.
const ARROWS = ["\\Rightarrow", "\\Longrightarrow", "\\iff"]
const OPEN = "{(["
const CLOSE = "})]"

type Cut = { at: number; len: number; arrow: boolean }

/** Top-level relation positions, or null when the brackets do not balance. */
function relations(body: string): Cut[] | null {
  const cuts: Cut[] = []
  let depth = 0
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === "\\") {
      const m = body.slice(i).match(/^\\[a-zA-Z]+/)
      if (m) {
        const arrow = ARROWS.includes(m[0])
        if (depth === 0 && (arrow || EQUALS.includes(m[0]))) cuts.push({ at: i, len: m[0].length, arrow })
        i += m[0].length - 1
      } else {
        i++ // escaped character such as \{ or \,
      }
      continue
    }
    if (OPEN.includes(c)) depth++
    else if (CLOSE.includes(c)) depth--
    else if (c === "=" && depth === 0) cuts.push({ at: i, len: 1, arrow: false })
    if (depth < 0) return null
  }
  return depth === 0 ? cuts : null
}

/** Trims whitespace without breaking a trailing "\ " spacing command. */
function trim(piece: string) {
  const t = piece.trim()
  const slashes = t.match(/\\+$/)?.[0].length ?? 0
  return slashes % 2 === 1 ? t + " " : t
}

function stepBody(body: string): string {
  if (/\\begin\{|\\\\|&|\\tag/.test(body)) return body
  // A trailing remark after \quad / \qquad ("…, \qquad |z|>1") stays on the last line.
  const tailAt = body.search(/\\q?quad(?![a-zA-Z])/)
  const head = tailAt >= 0 ? body.slice(0, tailAt) : body
  const tail = tailAt >= 0 ? body.slice(tailAt) : ""
  const all = relations(head)
  if (!all) return body
  const arrows = all.filter((c) => c.arrow)
  // Short "a ⇒ b" lines read fine as they are; plain "=" chains always get one step per line.
  const cuts = arrows.length ? (head.length > 60 ? arrows : []) : all.length >= 2 ? all : []
  if (!cuts.length) return body

  const lhs = trim(head.slice(0, cuts[0].at))
  const lines = lhs ? [`&${lhs}`] : []
  cuts.forEach((c, i) => {
    const end = i + 1 < cuts.length ? cuts[i + 1].at : head.length
    const rel = head.slice(c.at, c.at + c.len)
    lines.push(`&${rel} ${trim(head.slice(c.at + c.len, end))}`)
  })
  lines[lines.length - 1] += tail
  return `\\begin{aligned}${lines.join("\\\\[6pt]")}\\end{aligned}`
}

/** True for a long inline formula with two or more top-level "=": too much to read inside a sentence. */
function isLongChain(e: string) {
  const cuts = relations(e)
  return !!cuts && cuts.filter((c) => !c.arrow).length >= 2 && e.length > 35
}

/**
 * Lifts long inline chains onto their own display line. Tables, list items,
 * headings and indented lines are left alone so their structure survives.
 */
function liftInlineChains(text: string): string {
  return text
    .split("\n")
    .map((line) => {
      if (/^\s*(\||#|[-*+]\s|\d+\.\s)/.test(line) || /^\s{2,}\S/.test(line)) return line
      // The fences go on their own lines: "$$" followed by text on the same line is read as a label, not math.
      return line.replace(/\$([^$\n]+?)\$\s*([.,;:]?)/g, (whole, e: string, punct: string) =>
        isLongChain(e) ? `\n\n$$\n${e}${punct === "," || punct === ";" ? punct : ""}\n$$\n\n` : whole,
      )
    })
    .join("\n")
}

/** Rewrites a markdown string so chained equations read one step per line. */
export function stepEquations(markdown: string): string {
  const lifted = markdown
    .split(/(\$\$[\s\S]+?\$\$)/)
    .map((part, i) => (i % 2 === 1 ? part : liftInlineChains(part)))
    .join("")
  return lifted.replace(/\$\$([\s\S]+?)\$\$/g, (whole, body: string) => {
    const next = stepBody(body.trim())
    if (next === body.trim()) return whole
    // Keep the block's own layout: a fenced block stays fenced, a one-line block stays on one line.
    const lead = body.match(/^\s*/)?.[0] ?? ""
    const trail = body.match(/\s*$/)?.[0] ?? ""
    return `$$${lead}${next}${trail}$$`
  })
}

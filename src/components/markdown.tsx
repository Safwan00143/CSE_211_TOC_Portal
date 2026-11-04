import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { slugify } from "@/content/notes"
import { figures } from "@/figures"
import { FigureFrame } from "@/figures/figure"
import { stepEquations } from "@/lib/math-steps"
import { cn } from "@/lib/utils"

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  return ""
}

type HastNode = { type: string; tagName?: string; value?: string; properties?: { className?: unknown }; children?: HastNode[] }

/** A fenced block tagged `fig` holds one figure id per line. */
function figureIds(node: HastNode | undefined): string[] | null {
  const code = node?.children?.[0]
  if (!code || code.tagName !== "code") return null
  const cls = code.properties?.className
  if (!Array.isArray(cls) || !cls.includes("language-fig")) return null
  const text = (code.children ?? []).map((c) => c.value ?? "").join("")
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

const components: Components = {
  h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2>,
  table: ({ children }) => (
    <div className="table-wrap">
      <table>{children}</table>
    </div>
  ),
  pre: ({ node, children }) => {
    const ids = figureIds(node as unknown as HastNode)
    if (ids) {
      return (
        <>
          {ids.map((id) => (
            <FigureFrame key={id} id={id} entry={figures[id]} />
          ))}
        </>
      )
    }
    return <pre>{children}</pre>
  },
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-study", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false }]]}
        components={components}
      >
        {stepEquations(children)}
      </ReactMarkdown>
    </div>
  )
}

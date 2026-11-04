/*
  Figure toolkit. Every diagram on the site is drawn from these server-rendered
  SVG pieces so they share one look: ink for structure, the accent (sage) for
  what the reader should notice (start arrow, accepting rings, the tape head),
  labels on a card-coloured halo so they never sit on top of a line.

  State diagrams are drawn from the same machine objects the verification script
  runs (src/lib/automata.ts). Positions are given by hand for every figure; the
  geometry lives in diagram-geometry.ts so scripts/check-figures.ts can check it.
*/
import { useId, type ReactNode } from "react"
import { cykTable, type CFG, type Machine } from "@/lib/automata"
import { diagramGeometry, runs, textWidth, LABEL_SIZE, R, type Layout, type Pt } from "./diagram-geometry"

export { stateLabel, symLabel, edgeLabels, textWidth, type Layout, type EdgeStyle } from "./diagram-geometry"

const FONT = "KaTeX_Main, 'Times New Roman', serif"

/* ───────────── Text with subscripts: "q_0", "q_{01}", "Z_0", "a^n" ───────────── */

export function SvgText({
  at,
  text,
  size = 15,
  anchor = "middle",
  className = "fill-foreground",
  halo = false,
  italic = false,
}: {
  at: Pt
  text: string
  size?: number
  anchor?: "start" | "middle" | "end"
  className?: string
  halo?: boolean
  italic?: boolean
}) {
  const parts = runs(text)
  let level = 0
  return (
    <text
      x={at[0]}
      y={at[1]}
      textAnchor={anchor}
      dominantBaseline="central"
      fontFamily={FONT}
      fontSize={size}
      fontStyle={italic ? "italic" : undefined}
      className={halo ? `${className} stroke-card` : className}
      style={halo ? { paintOrder: "stroke", strokeWidth: 5, strokeLinejoin: "round" } : undefined}
    >
      {parts.map((r, k) => {
        const target = r.shift * size * 0.32
        const dy = target - level
        level = target
        return (
          <tspan key={k} dy={dy || undefined} fontSize={r.shift ? size * 0.72 : undefined}>
            {r.text}
          </tspan>
        )
      })}
    </text>
  )
}

/* ───────────── Arrowhead marker ───────────── */

function useArrow(tone: "ink" | "accent" = "ink") {
  const id = `arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-${tone}`
  const marker = (
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className={tone === "accent" ? "fill-primary" : "fill-foreground/80"} />
    </marker>
  )
  return { id, marker, url: `url(#${id})` }
}

/* ───────────── State diagrams ───────────── */


export function StateDiagram({ machine, layout, labels }: { machine: Machine; layout: Layout; labels?: Record<string, string[]> }) {
  const g = diagramGeometry(machine, layout, labels)
  const { x, y, w, h } = g.view
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width="100%" style={{ maxWidth: w * 1.1 }} className="mx-auto block h-auto" role="img">
      {!layout.noStart && <line x1={g.start.tail[0]} y1={g.start.tail[1]} x2={g.start.head[0]} y2={g.start.head[1]} className="stroke-primary" strokeWidth={1.6} />}
      {!layout.noStart && <polygon points={g.start.arrow.join(" ")} className="fill-primary" />}
      {g.edges.map((e) => (
        <g key={e.key}>
          <path d={e.d} fill="none" className="stroke-foreground/80" strokeWidth={1.4} />
          <polygon points={e.head.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")} className="fill-foreground/80" />
        </g>
      ))}
      {g.states.map((s) => (
        <g key={s.name} opacity={s.faded ? 0.45 : 1}>
          <circle cx={s.at[0]} cy={s.at[1]} r={s.r} className="fill-card stroke-foreground/80" strokeWidth={1.5} />
          {s.accept && <circle cx={s.at[0]} cy={s.at[1]} r={s.r - 4} fill="none" className="stroke-primary" strokeWidth={1.5} />}
          <SvgText at={s.at} text={s.label} size={s.r > R ? 13 : 15} />
        </g>
      ))}
      {g.labels.flatMap((l) =>
        l.lines.map((line, i) => (
          <SvgText key={`${l.key}-${i}`} at={[l.center[0], l.box.y + l.lineH * (i + 0.5)]} text={line} size={LABEL_SIZE} halo />
        )),
      )}
    </svg>
  )
}

/* ───────────── Parse trees ───────────── */

export type TreeNode = { label: string; children?: TreeNode[]; tone?: "accent" }

/** Each node sits at its own depth; leaves are spaced left to right in yield order and parents centre over their children. */
export function ParseTree({ tree, gap = 36, level = 50 }: { tree: TreeNode; gap?: number; level?: number }) {
  type Placed = { node: TreeNode; x: number; y: number; kids: Placed[] }
  let nextLeaf = 0
  const depthOf = (t: TreeNode): number => (t.children?.length ? 1 + Math.max(...t.children.map(depthOf)) : 0)
  const maxDepth = depthOf(tree)
  const place = (t: TreeNode, d: number): Placed => {
    if (!t.children?.length) {
      const x = nextLeaf++ * gap
      return { node: t, x, y: d * level, kids: [] }
    }
    const kids = t.children.map((c) => place(c, d + 1))
    return { node: t, x: (kids[0].x + kids.at(-1)!.x) / 2, y: d * level, kids }
  }
  const root = place(tree, 0)
  const lines: ReactNode[] = []
  const nodes: ReactNode[] = []
  const walk = (p: Placed) => {
    for (const k of p.kids) {
      lines.push(<line key={`${p.x},${p.y}-${k.x},${k.y}`} x1={p.x} y1={p.y + 11} x2={k.x} y2={k.y - 11} className="stroke-foreground/45" strokeWidth={1.2} />)
      walk(k)
    }
    const leaf = p.kids.length === 0
    nodes.push(
      <SvgText
        key={`${p.x},${p.y}`}
        at={[p.x, p.y]}
        text={p.node.label}
        size={15}
        className={p.node.tone === "accent" ? "fill-primary" : leaf ? "fill-foreground" : "fill-foreground/85"}
      />,
    )
  }
  walk(root)
  // Size the view box from the actual label extents so wide labels are never clipped.
  let minX = 0
  let maxX = 0
  const extent = (p: Placed) => {
    const half = textWidth(p.node.label, 15) / 2 + 6
    minX = Math.min(minX, p.x - half)
    maxX = Math.max(maxX, p.x + half)
    p.kids.forEach(extent)
  }
  extent(root)
  const w = maxX - minX
  return (
    <svg viewBox={`${minX} -16 ${w} ${maxDepth * level + 32}`} width="100%" style={{ maxWidth: w * 1.15 }} className="mx-auto block h-auto" role="img">
      {lines}
      {nodes}
    </svg>
  )
}

/* ───────────── Turing-machine tape ───────────── */

export function Tape({ cells, head, state, highlight = [], caption }: { cells: string[]; head: number; state?: string; highlight?: number[]; caption?: string }) {
  const W = 34
  const top = state ? 46 : 18
  const arrow = useArrow("accent")
  return (
    <svg viewBox={`-40 0 ${cells.length * W + 80} ${top + 44 + (caption ? 22 : 0)}`} width="100%" style={{ maxWidth: (cells.length * W + 80) * 1.1 }} className="mx-auto block h-auto" role="img">
      <defs>{arrow.marker}</defs>
      {state && (
        <>
          <SvgText at={[head * W + W / 2, 12]} text={state} size={14} className="fill-primary" />
          <line x1={head * W + W / 2} y1={22} x2={head * W + W / 2} y2={top - 3} className="stroke-primary" strokeWidth={1.5} markerEnd={arrow.url} />
        </>
      )}
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={i * W} y={top} width={W} height={W} className={highlight.includes(i) || i === head ? "fill-accent stroke-foreground/60" : "fill-card stroke-foreground/60"} strokeWidth={1.2} />
          <SvgText at={[i * W + W / 2, top + W / 2]} text={c} size={15} />
        </g>
      ))}
      <SvgText at={[-20, top + W / 2]} text="…" size={15} className="fill-muted-foreground" />
      <SvgText at={[cells.length * W + 20, top + W / 2]} text="…" size={15} className="fill-muted-foreground" />
      {caption && <SvgText at={[(cells.length * W) / 2, top + W + 20]} text={caption} size={13} className="fill-muted-foreground" />}
    </svg>
  )
}

/* ───────────── CYK triangle (HMU layout: X_ii on the bottom row) ───────────── */

/** Cell text for a CYK entry, variables in the grammar's own order: "{A, C}" or "∅". */
export function cykCell(g: CFG, s: Set<string>) {
  const vs = Object.keys(g.rules).filter((v) => s.has(v))
  return vs.length ? `{${vs.join(", ")}}` : "∅"
}

/** The table is computed from the grammar, so the figure can never disagree with the algorithm. */
export function CykTriangle({ grammar, word, highlight = [] }: { grammar: CFG; word: string; highlight?: [number, number][] }) {
  const sets = cykTable(grammar, word)
  const table = sets.map((row) => row.map((s) => cykCell(grammar, s)))
  const n = word.length
  const cw = Math.max(58, ...table.flat().map((t) => textWidth(t ?? "", 13) + 14))
  const ch = 34
  const cells: ReactNode[] = []
  for (let len = 1; len <= n; len++) {
    const row = n - len // top row is the full string
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      const x = i * cw + ((len - 1) * cw) / 2
      const y = row * ch
      const hl = highlight.some(([a, b]) => a === i && b === j)
      cells.push(
        <g key={`${i}-${j}`}>
          <rect x={x} y={y} width={cw} height={ch} className={hl ? "fill-accent stroke-foreground/50" : "fill-card stroke-foreground/50"} strokeWidth={1} />
          <SvgText at={[x + cw / 2, y + ch / 2]} text={table[i]?.[j] ?? ""} size={13} className={hl ? "fill-primary" : "fill-foreground"} />
        </g>,
      )
    }
  }
  const W = n * cw
  const H = n * ch + 30
  return (
    <svg viewBox={`-4 -4 ${W + 8} ${H + 8}`} width="100%" style={{ maxWidth: W * 1.15 }} className="mx-auto block h-auto" role="img">
      {cells}
      {[...word].map((c, i) => (
        <g key={i}>
          <SvgText at={[i * cw + cw / 2, n * ch + 16]} text={c} size={15} />
        </g>
      ))}
    </svg>
  )
}

/* ───────────── Containment diagrams ───────────── */

export type Region = { label: string; note?: string; children?: Region[]; tone?: "accent" | "second" }

/** Nested rounded boxes; children sit side by side inside their parent. */
export function Containment({ root, width = 520 }: { root: Region; width?: number }) {
  const PAD = 14
  const HEAD = 26
  type Box = { r: Region; w: number; h: number; kids: Box[] }
  const measure = (r: Region): Box => {
    const kids = (r.children ?? []).map(measure)
    const labelW = textWidth(r.label, 14) + 2 * PAD
    const kidsW = kids.reduce((s, k) => s + k.w, 0) + Math.max(0, kids.length - 1) * PAD
    const w = Math.max(labelW, kidsW + 2 * PAD, 90)
    const h = HEAD + (kids.length ? Math.max(...kids.map((k) => k.h)) + PAD : 18)
    return { r, w, h, kids }
  }
  const nodes: ReactNode[] = []
  const draw = (b: Box, x: number, y: number, depth: number) => {
    const cls =
      b.r.tone === "accent"
        ? "fill-primary/15 stroke-primary"
        : b.r.tone === "second"
          ? "fill-figure-2/15 stroke-figure-2"
          : depth % 2
            ? "fill-foreground/[0.04] stroke-foreground/50"
            : "fill-card stroke-foreground/50"
    nodes.push(<rect key={`${x},${y}`} x={x} y={y} width={b.w} height={b.h} rx={12} className={cls} strokeWidth={1.2} />)
    nodes.push(<SvgText key={`${x},${y}-t`} at={[x + PAD, y + 15]} text={b.r.label} size={14} anchor="start" />)
    let cx = x + (b.w - (b.kids.reduce((s, k) => s + k.w, 0) + Math.max(0, b.kids.length - 1) * PAD)) / 2
    for (const k of b.kids) {
      draw(k, cx, y + HEAD, depth + 1)
      cx += k.w + PAD
    }
  }
  const root_ = measure(root)
  draw(root_, 0, 0, 0)
  return (
    <svg viewBox={`-2 -2 ${root_.w + 4} ${root_.h + 4}`} width="100%" style={{ maxWidth: Math.min(width, root_.w * 1.1) }} className="mx-auto block h-auto" role="img">
      {nodes}
    </svg>
  )
}

/* ───────────── Undirected graphs with a vertex colouring (3-COLOR reductions) ───────────── */

const COLOUR_CLASS = ["fill-primary/35", "fill-figure-2/40", "fill-foreground/15"]

export function ColourGraph({
  nodes,
  edges,
  colouring = {},
  radius = 17,
}: {
  nodes: { id: string; label: string; at: Pt }[]
  edges: [string, string][]
  /** Colour index per node: 0, 1 or 2 (shown as the three palette colours). */
  colouring?: Record<string, number>
  radius?: number
}) {
  const at = Object.fromEntries(nodes.map((n) => [n.id, n.at]))
  const xs = nodes.map((n) => n.at[0])
  const ys = nodes.map((n) => n.at[1])
  const pad = radius + 4
  const [x0, y0] = [Math.min(...xs) - pad, Math.min(...ys) - pad]
  const [w, h] = [Math.max(...xs) - x0 + pad, Math.max(...ys) - y0 + pad]
  return (
    <svg viewBox={`${x0} ${y0} ${w} ${h}`} width="100%" style={{ maxWidth: w }} className="mx-auto block h-auto" role="img">
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={at[a][0]} y1={at[a][1]} x2={at[b][0]} y2={at[b][1]} className="stroke-foreground/45" strokeWidth={1.1} />
      ))}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.at[0]} cy={n.at[1]} r={radius} className="fill-card" />
          <circle cx={n.at[0]} cy={n.at[1]} r={radius} className={`${n.id in colouring ? COLOUR_CLASS[colouring[n.id]] : "fill-card"} stroke-foreground`} strokeWidth={1.2} />
          <SvgText at={n.at} text={n.label} size={13} />
        </g>
      ))}
    </svg>
  )
}

/* ───────────── Layout helpers ───────────── */

export function Row({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-start justify-center gap-6">{children}</div>
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0 flex-1 basis-56">
      <p className="mb-2 text-center text-[13px] text-muted-foreground">{title}</p>
      {children}
    </div>
  )
}

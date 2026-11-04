/*
  Pure geometry for state diagrams: where every circle, edge and label goes.
  The StateDiagram component draws it, and scripts/check-figures.ts runs
  diagramIssues() over every diagram on the site to catch labels sitting on
  lines or states, and edges cutting through states.
*/
import { EPS, type Machine } from "@/lib/automata"

export type Pt = [number, number]

export const R = 21
export const LABEL_SIZE = 14

export const sub = (p: Pt, q: Pt): Pt => [p[0] - q[0], p[1] - q[1]]
export const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]]
export const mul = (p: Pt, k: number): Pt => [p[0] * k, p[1] * k]
export const len = (p: Pt) => Math.hypot(p[0], p[1])
export const unit = (p: Pt): Pt => mul(p, 1 / (len(p) || 1))
export const deg = (a: number): Pt => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]

/* ───────────── Text measurement ───────────── */

type Run = { text: string; shift: 0 | 1 | -1 }

/** Splits "q_{01}" / "a^n" style text into normal, subscript and superscript runs. */
export function runs(src: string): Run[] {
  const out: Run[] = []
  let i = 0
  let buf = ""
  const flush = () => {
    if (buf) {
      out.push({ text: buf, shift: 0 })
      buf = ""
    }
  }
  while (i < src.length) {
    const c = src[i]
    if ((c === "_" || c === "^") && i + 1 < src.length) {
      flush()
      let j = i + 1
      let t: string
      if (src[j] === "{") {
        const close = src.indexOf("}", j)
        t = src.slice(j + 1, close)
        j = close + 1
      } else {
        t = src[j]
        j++
      }
      out.push({ text: t, shift: c === "_" ? 1 : -1 })
      i = j
    } else {
      buf += c
      i++
    }
  }
  flush()
  return out
}

/** Rendered width in px, slightly generous so checks err on the safe side. */
export function textWidth(src: string, size = 15) {
  return runs(src).reduce((w, r) => w + [...r.text].length * size * (r.shift ? 0.42 : 0.56), 0)
}

/* ───────────── Labels ───────────── */

/** "q0" → "q_0", "q10" → "q_{10}", "qE" → "q_E", "qrej" → "q_{rej}". */
export function stateLabel(name: string) {
  const m = name.match(/^([a-zA-Z]+)(\d+)$/) ?? name.match(/^([a-z])([A-Z]+\d*|acc|rej|accept|reject)$/)
  return m ? `${m[1]}_{${m[2]}}` : name
}

/** Stack and tape symbols: "Z0" → "Z_0", "X1" → "X_1"; single characters unchanged. */
export const symLabel = (s: string) => s.replace(/^([A-Za-z])(\d+)$/, "$1_{$2}")

/** Edge labels grouped by (from, to), in each teacher's notation. */
export function edgeLabels(m: Machine): Map<string, string[]> {
  const out = new Map<string, string[]>()
  const push = (f: string, t: string, s: string) => {
    const k = `${f}>${t}`
    const list = out.get(k) ?? []
    if (!list.includes(s)) list.push(s)
    out.set(k, list)
  }
  if (m.kind === "fa") {
    for (const [f, s, t] of m.delta) push(f, t, s)
    // One line, comma-joined: "a, b".
    for (const [k, v] of out) out.set(k, [v.join(", ")])
  } else if (m.kind === "pda-sipser") {
    for (const [f, a, pop, t, push_] of m.delta) push(f, t, `${a}, ${symLabel(pop)} → ${symLabel(push_)}`)
  } else if (m.kind === "pda-hmu") {
    for (const [f, a, X, t, g] of m.delta) push(f, t, `${a}, ${symLabel(X)}/${g.length ? g.map(symLabel).join("") : EPS}`)
  } else {
    const arrow = { L: "←", R: "→", S: "–" }
    for (const [f, X, t, Y, D] of m.delta) push(f, t, `${symLabel(X)}/${symLabel(Y)} ${arrow[D]}`)
  }
  return out
}

/* ───────────── Layout ───────────── */

export type EdgeStyle = {
  /** Sideways offset of the curve's middle in px; + bends to the left of the travel direction. */
  bend?: number
  /** Self-loop direction in degrees (0 = right, 90 = down, -90 = up). */
  loop?: number
  /** Which side of the edge the label sits on: 1 = left of travel, -1 = right. */
  side?: 1 | -1
  /** Extra label nudge in px. */
  dx?: number
  dy?: number
  /** Position along the edge, 0..1 (default 0.5). */
  t?: number
}

export type Layout = {
  pos: Record<string, Pt>
  /** Keyed "from>to". */
  edges?: Record<string, EdgeStyle>
  /** Direction the start arrow comes from, in degrees (default 180 = from the left). */
  startFrom?: number
  /** Draw no start arrow (for state graphs without a start state, e.g. a puzzle's state space). */
  noStart?: boolean
  /** Display names, e.g. { Z1: "0_1" }; default is stateLabel(name). */
  names?: Record<string, string>
  /** Wider circles for long names, keyed by state. */
  radius?: Record<string, number>
  /** States drawn faded, e.g. unreachable ones. */
  faded?: string[]
  /** Extra padding around the auto-sized view box. */
  pad?: number
}

export type Box = { x: number; y: number; w: number; h: number }

export type Geometry = {
  states: { name: string; label: string; at: Pt; r: number; accept: boolean; faded: boolean }[]
  /** Each edge's path stops short of its target; `head` is the arrowhead triangle drawn there. */
  edges: { key: string; d: string; samples: Pt[]; from: string; to: string; head: Pt[] }[]
  labels: { key: string; lines: string[]; center: Pt; box: Box; lineH: number }[]
  start: { tail: Pt; head: Pt; arrow: Pt[] }
  view: Box
}

const quad = (s: Pt, c: Pt, e: Pt, t: number): Pt => add(add(mul(s, (1 - t) ** 2), mul(c, 2 * (1 - t) * t)), mul(e, t * t))
const cubic = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt =>
  add(add(mul(p0, (1 - t) ** 3), mul(p1, 3 * (1 - t) ** 2 * t)), add(mul(p2, 3 * (1 - t) * t * t), mul(p3, t ** 3)))
export const ARROW_LEN = 9
/** Triangle with its tip at `tip`, pointing along `dir`. */
export function arrowHead(tip: Pt, dir: Pt, length = ARROW_LEN, half = 3.6): Pt[] {
  const u = unit(dir)
  const base = sub(tip, mul(u, length))
  const n: Pt = [-u[1], u[0]]
  return [tip, add(base, mul(n, half)), add(base, mul(n, -half))]
}
const fmt = (p: Pt) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`

export function diagramGeometry(machine: Machine, layout: Layout, override?: Record<string, string[]>): Geometry {
  const labelMap = edgeLabels(machine)
  if (override) for (const [k, v] of Object.entries(override)) labelMap.set(k, v)
  const r = (q: string) => layout.radius?.[q] ?? R
  const P = (q: string) => {
    const p = layout.pos[q]
    if (!p) throw new Error(`StateDiagram: no position for state ${q}`)
    return p
  }

  const pts = Object.values(layout.pos)
  const centre: Pt = [pts.reduce((x, p) => x + p[0], 0) / pts.length, pts.reduce((y, p) => y + p[1], 0) / pts.length]
  const edges: Geometry["edges"] = []
  const labels: Geometry["labels"] = []
  const extents: Pt[] = []

  const placeLabel = (lines: string[], anchor: Pt, normal: Pt, extra: Pt, key: string) => {
    const lineH = LABEL_SIZE * 1.25
    const w = Math.max(...lines.map((l) => textWidth(l, LABEL_SIZE)))
    const h = lines.length * lineH
    // Push the label's box fully off the line along the normal.
    const off = 6 + Math.abs(normal[0]) * (w / 2) + Math.abs(normal[1]) * (h / 2)
    const c = add(add(anchor, mul(normal, off)), extra)
    const box = { x: c[0] - w / 2, y: c[1] - h / 2, w, h }
    labels.push({ key, lines, center: c, box, lineH })
    extents.push([box.x, box.y], [box.x + w, box.y + h])
  }

  for (const [key, lines] of labelMap) {
    const [f, t] = key.split(">")
    const style = layout.edges?.[key] ?? {}
    const extra: Pt = [style.dx ?? 0, style.dy ?? 0]
    const a = P(f)
    if (f === t) {
      const dir = style.loop ?? -90
      const u = deg(dir)
      const p1 = add(a, mul(deg(dir - 28), r(f)))
      const p2 = add(a, mul(deg(dir + 28), r(f)))
      const c1 = add(a, mul(deg(dir - 32), r(f) + 46))
      const c2 = add(a, mul(deg(dir + 32), r(f) + 46))
      const samples = Array.from({ length: 25 }, (_, i) => cubic(p1, c1, c2, p2, i / 24))
      const loopEnd = sub(p2, mul(unit(sub(p2, c2)), ARROW_LEN - 1))
      edges.push({ key, from: f, to: t, d: `M${fmt(p1)} C${fmt(c1)} ${fmt(c2)} ${fmt(loopEnd)}`, samples, head: arrowHead(p2, sub(p2, c2)) })
      // The loop's outermost point is about r + 26 from the centre.
      placeLabel(lines, add(a, mul(u, r(f) + 27)), u, extra, key)
      extents.push(add(a, mul(u, r(f) + 40)))
      continue
    }
    const b = P(t)
    const reverse = labelMap.has(`${t}>${f}`)
    const bend = style.bend ?? (reverse ? 18 : 0)
    const d = sub(b, a)
    const n: Pt = unit([d[1], -d[0]]) // left of travel in screen coordinates (y down)
    const mid = mul(add(a, b), 0.5)
    const ctrl = add(mid, mul(n, bend * 2))
    const s = add(a, mul(unit(sub(ctrl, a)), r(f)))
    const e = add(b, mul(unit(sub(ctrl, b)), r(t) + 1))
    const samples = Array.from({ length: 41 }, (_, i) => quad(s, ctrl, e, i / 40))
    const lineEnd = sub(e, mul(unit(sub(e, ctrl)), ARROW_LEN - 1))
    edges.push({ key, from: f, to: t, d: `M${fmt(s)} Q${fmt(ctrl)} ${fmt(lineEnd)}`, samples, head: arrowHead(e, sub(e, ctrl)) })
    samples.forEach((p) => extents.push(p))
    const tt = style.t ?? 0.5
    // Label goes on the outside of a bend; for a straight edge, on the given side (default: above / left).
    // Default: outside a bend; for a straight edge, the side facing away from the diagram's centre.
    const outward = n[0] * (mid[0] - centre[0]) + n[1] * (mid[1] - centre[1])
    let side: number =
      style.side ??
      (bend !== 0 ? Math.sign(bend) : Math.abs(outward) > 4 ? Math.sign(outward) : n[1] < -0.01 || (Math.abs(n[1]) <= 0.01 && n[0] < 0) ? 1 : -1)
    if (side === 0) side = 1
    placeLabel(lines, quad(s, ctrl, e, tt), mul(n, side), extra, key)
  }

  const startDir = deg(layout.startFrom ?? 180)
  const s0 = P(machine.start)
  const startHead = add(s0, mul(startDir, r(machine.start) + 1))
  const start = layout.noStart
    ? { tail: s0, head: s0, arrow: [] as Pt[] }
    : { tail: add(s0, mul(startDir, r(machine.start) + 30)), head: add(startHead, mul(startDir, ARROW_LEN - 1)), arrow: arrowHead(startHead, mul(startDir, -1)) }
  if (!layout.noStart) extents.push(start.tail)

  const states = machine.states.map((q) => {
    const at = P(q)
    extents.push([at[0] - r(q), at[1] - r(q)], [at[0] + r(q), at[1] + r(q)])
    return {
      name: q,
      label: layout.names?.[q] ?? stateLabel(q),
      at,
      r: r(q),
      accept: machine.accept.includes(q),
      faded: !!layout.faded?.includes(q),
    }
  })

  const pad = layout.pad ?? 8
  const xs = extents.map((p) => p[0])
  const ys = extents.map((p) => p[1])
  const x = Math.min(...xs) - pad
  const y = Math.min(...ys) - pad
  return { states, edges, labels, start, view: { x, y, w: Math.max(...xs) - x + pad, h: Math.max(...ys) - y + pad } }
}

/* ───────────── Layout checks ───────────── */

const inBox = (p: Pt, b: Box, m = 0) => p[0] > b.x - m && p[0] < b.x + b.w + m && p[1] > b.y - m && p[1] < b.y + b.h + m
const boxesOverlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
const boxCircle = (b: Box, c: Pt, r: number) => {
  const nx = Math.max(b.x, Math.min(c[0], b.x + b.w))
  const ny = Math.max(b.y, Math.min(c[1], b.y + b.h))
  return Math.hypot(c[0] - nx, c[1] - ny) < r
}

/** Every layout problem a reader would notice. An empty list means the diagram is clean. */
export function diagramIssues(g: Geometry): string[] {
  const issues: string[] = []
  for (const l of g.labels) {
    const name = `label ${l.key} "${l.lines.join(" / ")}"`
    for (const s of g.states) if (boxCircle(l.box, s.at, s.r + 1)) issues.push(`${name} overlaps state ${s.name}`)
    for (const e of g.edges) {
      // A label may touch its own edge only near the attachment point; it must not sit on any line.
      const hits = e.samples.filter((p) => inBox(p, l.box, 1)).length
      if (hits > 0) issues.push(`${name} sits on edge ${e.key}`)
    }
    const startHits = [0, 0.25, 0.5, 0.75, 1].map((t) => add(g.start.tail, mul(sub(g.start.head, g.start.tail), t))).some((p) => inBox(p, l.box, 1))
    if (startHits) issues.push(`${name} sits on the start arrow`)
    for (const o of g.labels) if (o !== l && o.key < l.key && boxesOverlap(o.box, l.box)) issues.push(`${name} overlaps label ${o.key}`)
  }
  const arrowPts = Array.from({ length: 11 }, (_, k) => add(g.start.tail, mul(sub(g.start.head, g.start.tail), k / 10)))
  for (const e of g.edges) {
    if (e.samples.some((p) => arrowPts.some((a) => Math.hypot(p[0] - a[0], p[1] - a[1]) < 4))) issues.push(`edge ${e.key} crosses the start arrow`)
    for (const s of g.states) {
      if (s.name === e.from || s.name === e.to) continue
      if (e.samples.some((p) => Math.hypot(p[0] - s.at[0], p[1] - s.at[1]) < s.r + 2)) issues.push(`edge ${e.key} passes through state ${s.name}`)
    }
  }
  return issues
}

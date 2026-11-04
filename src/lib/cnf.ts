/*
  Grammar simplification and Chomsky normal form, step by step, in the order
  on Atif Sir's slides (HMU, Section 7.1):
    1. eliminate ε-productions, 2. eliminate unit productions,
    3. eliminate useless symbols, 4. convert to CNF.
  Each step returns the new grammar so solutions can show every intermediate
  grammar, and scripts/verify.ts can check each one generates the same language.
*/
import { cykTable, isVariable, type CFG } from "./automata"

type Body = string[]
const clone = (g: CFG): CFG => ({ kind: "cfg", start: g.start, rules: Object.fromEntries(Object.entries(g.rules).map(([A, bs]) => [A, bs.map((b) => [...b])])) })
const key = (b: Body) => b.join("\u0001")
function addRule(rules: Record<string, Body[]>, A: string, b: Body) {
  rules[A] ??= []
  if (!rules[A].some((x) => key(x) === key(b))) rules[A].push(b)
}

/* ───────────── Useless symbols ───────────── */

/** Symbols that derive some terminal string (every terminal is generating). */
export function generating(g: CFG): Set<string> {
  const gen = new Set<string>()
  let changed = true
  while (changed) {
    changed = false
    for (const [A, bodies] of Object.entries(g.rules))
      if (!gen.has(A) && bodies.some((b) => b.every((s) => !isVariable(g, s) || gen.has(s)))) {
        gen.add(A)
        changed = true
      }
  }
  return gen
}

/** Variables reachable from the start variable. */
export function reachable(g: CFG): Set<string> {
  const seen = new Set([g.start])
  const stack = [g.start]
  while (stack.length) {
    const A = stack.pop()!
    for (const b of g.rules[A] ?? [])
      for (const s of b)
        if (isVariable(g, s) && !seen.has(s)) {
          seen.add(s)
          stack.push(s)
        }
  }
  return seen
}

/** First drop non-generating symbols (and every rule using one), then unreachable ones, in that order. */
export function removeUseless(g: CFG): { grammar: CFG; nonGenerating: string[]; unreachable: string[] } {
  const gen = generating(g)
  const nonGenerating = Object.keys(g.rules).filter((A) => !gen.has(A))
  const step1: CFG = { kind: "cfg", start: g.start, rules: {} }
  for (const [A, bodies] of Object.entries(g.rules)) {
    if (!gen.has(A)) continue
    step1.rules[A] = bodies.filter((b) => b.every((s) => !isVariable(g, s) || gen.has(s)))
  }
  if (!step1.rules[g.start]) step1.rules[g.start] = []
  const reach = reachable(step1)
  const unreachable = Object.keys(step1.rules).filter((A) => !reach.has(A))
  const out: CFG = { kind: "cfg", start: g.start, rules: Object.fromEntries(Object.entries(step1.rules).filter(([A]) => reach.has(A))) }
  return { grammar: out, nonGenerating, unreachable }
}

/* ───────────── ε-productions ───────────── */

export function nullable(g: CFG): Set<string> {
  const n = new Set<string>()
  let changed = true
  while (changed) {
    changed = false
    for (const [A, bodies] of Object.entries(g.rules))
      if (!n.has(A) && bodies.some((b) => b.every((s) => n.has(s)))) {
        n.add(A)
        changed = true
      }
  }
  return n
}

/**
 * Remove ε-productions: each body with k nullable occurrences gives every
 * version with some of them dropped, except the empty body. If the start
 * variable is nullable, add S → ε at the end, as Atif Sir's slide does.
 */
export function removeEpsilon(g: CFG, keepStartEpsilon = true): { grammar: CFG; nullable: string[] } {
  const N = nullable(g)
  const rules: Record<string, Body[]> = {}
  for (const [A, bodies] of Object.entries(g.rules)) {
    rules[A] = []
    for (const b of bodies) {
      const idx = b.map((s, i) => (N.has(s) ? i : -1)).filter((i) => i >= 0)
      for (let mask = 0; mask < 1 << idx.length; mask++) {
        // Bit k drops the k-th nullable symbol from the right, so S → AB lists AB, A, B as on the slide.
        const drop = new Set(idx.filter((_, k) => mask & (1 << (idx.length - 1 - k))))
        const nb = b.filter((_, i) => !drop.has(i))
        if (nb.length) addRule(rules, A, nb)
      }
    }
  }
  if (keepStartEpsilon && N.has(g.start)) addRule(rules, g.start, [])
  return { grammar: { kind: "cfg", start: g.start, rules }, nullable: Object.keys(g.rules).filter((A) => N.has(A)) }
}

/* ───────────── Unit productions ───────────── */

/** Unit pairs (A, B): A derives B using unit productions only; includes (A, A). */
export function unitPairs(g: CFG): [string, string][] {
  const pairs: [string, string][] = []
  for (const A of Object.keys(g.rules)) {
    const seen = new Set([A])
    const stack = [A]
    while (stack.length) {
      const X = stack.pop()!
      for (const b of g.rules[X] ?? [])
        if (b.length === 1 && isVariable(g, b[0]) && !seen.has(b[0])) {
          seen.add(b[0])
          stack.push(b[0])
        }
    }
    for (const B of Object.keys(g.rules)) if (seen.has(B)) pairs.push([A, B])
  }
  return pairs
}

/** For every unit pair (A, B) and every non-unit rule B → α, add A → α; drop all unit rules. */
export function removeUnit(g: CFG): { grammar: CFG; pairs: [string, string][] } {
  const pairs = unitPairs(g)
  const rules: Record<string, Body[]> = Object.fromEntries(Object.keys(g.rules).map((A) => [A, [] as Body[]]))
  for (const [A, B] of pairs) for (const b of g.rules[B]) if (!(b.length === 1 && isVariable(g, b[0]))) addRule(rules, A, b)
  return { grammar: { kind: "cfg", start: g.start, rules }, pairs }
}

/* ───────────── CNF ───────────── */

/**
 * Final CNF step. (a) In bodies of length ≥ 2 replace each terminal a by a new
 * variable (named by `terminalVar`, with rule V → a). (b) Break bodies of
 * length ≥ 3 into a cascade A → B C_1, C_1 → C D, … with fresh C_i.
 */
export function cnfFinish(g: CFG, terminalVar: (a: string) => string, cascadeVar = (i: number) => `C_${i}`): { afterTerminals: CFG; grammar: CFG } {
  const rules: Record<string, Body[]> = {}
  const termRules: Record<string, Body[]> = {}
  for (const [A, bodies] of Object.entries(g.rules)) {
    rules[A] = []
    for (const b of bodies) {
      if (b.length < 2) {
        addRule(rules, A, b)
        continue
      }
      addRule(
        rules,
        A,
        b.map((s) => {
          if (isVariable(g, s)) return s
          const V = terminalVar(s)
          addRule(termRules, V, [s])
          return V
        }),
      )
    }
  }
  const afterTerminals: CFG = { kind: "cfg", start: g.start, rules: { ...rules, ...termRules } }
  const out: Record<string, Body[]> = {}
  let next = 1
  const cache = new Map<string, string>()
  for (const [A, bodies] of Object.entries(afterTerminals.rules)) {
    for (const b of bodies) {
      if (b.length <= 2) {
        addRule(out, A, b)
        continue
      }
      // A → X1 X2 … Xk  becomes  A → X1 C, C → X2 C', …, the last C → X(k-1) Xk. Identical tails share a variable.
      let head = A
      for (let i = 0; i < b.length - 2; i++) {
        const tail = b.slice(i + 1)
        const k = key(tail)
        let C = cache.get(k)
        const fresh = !C
        if (!C) {
          C = cascadeVar(next++)
          cache.set(k, C)
        }
        addRule(out, head, [b[i], C])
        if (!fresh) {
          head = ""
          break
        }
        head = C
      }
      if (head) addRule(out, head, b.slice(-2))
    }
  }
  return { afterTerminals, grammar: { kind: "cfg", start: g.start, rules: out } }
}

/** Rules as LaTeX lines for an aligned block: "S &\to AB \mid a". */
export function grammarTex(g: CFG) {
  const sym = (s: string) => s.replace(/^([A-Z])_(\d+)$/, "$1_{$2}").replace(/^([A-Z])('+)$/, "$1$2").replace(/[#{}$%&]/g, (c) => `\\${c}`)
  const lines = Object.entries(g.rules)
    .filter(([, bs]) => bs.length)
    .map(([A, bs]) => `${sym(A)} &\\to ${bs.map((b) => (b.length ? b.map(sym).join("") : "\\varepsilon")).join(" \\mid ")}`)
  return `$$\n\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}\n$$`
}

/* ───────────── CYK (HMU's X_ij, 1-based, i ≤ j) ───────────── */

const setTex = (g: CFG, s: Set<string>) => {
  const vs = Object.keys(g.rules).filter((v) => s.has(v)).map((v) => v.replace(/^([A-Z])_(\d+)$/, "$1_{$2}"))
  return vs.length ? `\\{${vs.join(",")}\\}` : "\\emptyset"
}

/** The CYK table as markdown: one row per substring length, longest first, as in HMU's triangle. */
export function cykTableMd(g: CFG, w: string) {
  const T = cykTable(g, w)
  const n = w.length
  const head = `| Length | ${Array.from({ length: n }, (_, i) => `start ${i + 1}`).join(" | ")} |`
  const rule = `|---|${Array.from({ length: n }, () => "---").join("|")}|`
  const rows: string[] = []
  for (let len = n; len >= 1; len--) {
    const cells = Array.from({ length: n }, (_, i) => (i + len - 1 < n ? `$X_{${i + 1}${i + len}}=${setTex(g, T[i][i + len - 1])}$` : ""))
    rows.push(`| ${len} | ${cells.join(" | ")} |`)
  }
  return [head, rule, ...rows, `| | ${[...w].map((c) => `**${c}**`).join(" | ")} |`].join("\n")
}

/**
 * Cell-by-cell working for every entry of length ≥ 2: each split X_ik · X_(k+1)j,
 * the variable pairs it offers, and which rules A → BC they match.
 */
export function cykWorkingMd(g: CFG, w: string) {
  const T = cykTable(g, w)
  const n = w.length
  const lines: string[] = []
  const pairName = (b: string, c: string) => `${b}${c}`.replace(/([A-Z])_(\d+)/g, "$1_{$2}")
  for (let i = 0; i < n; i++) {
    const heads = Object.entries(g.rules).filter(([, bs]) => bs.some((b) => b.length === 1 && b[0] === w[i])).map(([A]) => A)
    lines.push(`- $X_{${i + 1}${i + 1}}$: rules with body ${w[i]} give $${setTex(g, new Set(heads))}$.`)
  }
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      const parts: string[] = []
      for (let k = i; k < j; k++) {
        const L = T[i][k]
        const R = T[k + 1][j]
        const pairs = [...L].flatMap((b) => [...R].map((c) => [b, c]))
        const hits = Object.entries(g.rules)
          .filter(([, bs]) => bs.some((x) => x.length === 2 && pairs.some(([b, c]) => x[0] === b && x[1] === c)))
          .map(([A]) => A)
        const pairText = pairs.length ? pairs.map(([b, c]) => pairName(b, c)).join(", ") : "none"
        parts.push(`$X_{${i + 1}${k + 1}}X_{${k + 2}${j + 1}}$: pairs ${pairs.length ? `$${pairText}$` : "none"} → $${setTex(g, new Set(hits))}$`)
      }
      lines.push(`- $X_{${i + 1}${j + 1}}=${setTex(g, T[i][j])}$. ${parts.join("; ")}.`)
    }
  return lines.join("\n")
}

export { clone as cloneGrammar }

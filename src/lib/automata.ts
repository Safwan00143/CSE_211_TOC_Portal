/*
  Machines and grammars as plain data. The same objects draw the figures on the
  site and run in the verification script (scripts/verify.ts), so every automaton
  a student sees is exactly the one that was tested.

  Input strings are JavaScript strings of one-character symbols. Stack and tape
  symbols may be longer (Z0, X1), so pushes and writes are lists of symbols.
*/

export const EPS = "ε"

/** DFA, NFA or ε-NFA. Each transition is [from, symbol or "ε", to]. */
export type FA = {
  kind: "fa"
  states: string[]
  alphabet: string[]
  start: string
  accept: string[]
  delta: [string, string, string][]
}

/**
 * Sipser-style PDA (Hakim Sir): 6-tuple, one optional pop and one optional push
 * per move, acceptance by final state. Each move is [from, read, pop, to, push],
 * with "ε" for nothing read/popped/pushed.
 */
export type PdaSipser = {
  kind: "pda-sipser"
  states: string[]
  alphabet: string[]
  stack: string[]
  start: string
  accept: string[]
  delta: [string, string, string, string, string][]
}

/**
 * HMU-style PDA (Atif Sir): 7-tuple with Z0. Each move δ(q, a, X) ∋ (p, γ) is
 * [q, a or "ε", X, p, γ] where γ lists the new top symbols, leftmost on top.
 */
export type PdaHmu = {
  kind: "pda-hmu"
  states: string[]
  alphabet: string[]
  stack: string[]
  start: string
  startStack: string
  accept: string[]
  acceptBy: "final" | "empty"
  delta: [string, string, string, string, string[]][]
}

/** HMU-style deterministic TM. Each move δ(q, X) = (p, Y, D) is [q, X, p, Y, D]. */
export type TM = {
  kind: "tm"
  states: string[]
  alphabet: string[]
  tape: string[]
  blank: string
  start: string
  accept: string[]
  delta: [string, string, string, string, "L" | "R" | "S"][]
}

/** Context-free grammar. Each body is a list of symbols; [] is ε. */
export type CFG = {
  kind: "cfg"
  start: string
  rules: Record<string, string[][]>
}

export type Machine = FA | PdaSipser | PdaHmu | TM

/* ───────────────────────── Finite automata ───────────────────────── */

export function epsClosure(fa: FA, set: Iterable<string>): Set<string> {
  const out = new Set(set)
  const stack = [...out]
  while (stack.length) {
    const q = stack.pop()!
    for (const [f, s, t] of fa.delta) {
      if (f === q && s === EPS && !out.has(t)) {
        out.add(t)
        stack.push(t)
      }
    }
  }
  return out
}

export function faStep(fa: FA, set: Set<string>, a: string): Set<string> {
  const next = new Set<string>()
  for (const [f, s, t] of fa.delta) if (s === a && set.has(f)) next.add(t)
  return epsClosure(fa, next)
}

/** The set of states after each prefix, starting with the closure of the start state. */
export function faTrace(fa: FA, w: string): Set<string>[] {
  let cur = epsClosure(fa, [fa.start])
  const trace = [cur]
  for (const a of w) trace.push((cur = faStep(fa, cur, a)))
  return trace
}

export function faAccepts(fa: FA, w: string) {
  const last = faTrace(fa, w).at(-1)!
  return [...last].some((q) => fa.accept.includes(q))
}

/** Sets of states in the machine's own state order, so tables read predictably. */
export const ordered = (fa: FA, s: Iterable<string>) => {
  const set = new Set(s)
  return fa.states.filter((q) => set.has(q))
}

/**
 * Removes ε-moves the way Hakim Sir's slides do: δ'(q, a) = E(δ(E(q), a)) and
 * F' = { q : E(q) ∩ F ≠ ∅ }. Same states, same start state.
 */
export function removeEpsilon(fa: FA): FA {
  const delta: [string, string, string][] = []
  for (const q of fa.states)
    for (const a of fa.alphabet) for (const t of ordered(fa, faStep(fa, epsClosure(fa, [q]), a))) delta.push([q, a, t])
  const accept = fa.states.filter((q) => [...epsClosure(fa, [q])].some((p) => fa.accept.includes(p)))
  return { ...fa, accept, delta }
}

export type SubsetDfa = {
  /** Reachable subsets in discovery order (breadth first, symbols in alphabet order). */
  subsets: string[][]
  dfa: FA
  /** DFA state name for each subset, e.g. "{q0,q1}" or ∅. */
  name: (s: string[]) => string
}

/**
 * Subset construction, building only the subsets reachable from the start
 * ("lazy evaluation"). For an ε-NFA the start is E({q0}) and each move is
 * followed by an ε-closure, as in Sipser.
 */
export function subsetConstruction(fa: FA): SubsetDfa {
  const name = (s: string[]) => (s.length ? `{${s.join(",")}}` : "∅")
  const start = ordered(fa, epsClosure(fa, [fa.start]))
  const subsets = [start]
  const seen = new Set([name(start)])
  const delta: [string, string, string][] = []
  for (let i = 0; i < subsets.length; i++) {
    const R = subsets[i]
    for (const a of fa.alphabet) {
      const next = ordered(fa, faStep(fa, new Set(R), a))
      delta.push([name(R), a, name(next)])
      if (!seen.has(name(next))) {
        seen.add(name(next))
        subsets.push(next)
      }
    }
  }
  const dfa: FA = {
    kind: "fa",
    states: subsets.map(name),
    alphabet: fa.alphabet,
    start: name(start),
    accept: subsets.filter((s) => s.some((q) => fa.accept.includes(q))).map(name),
    delta,
  }
  return { subsets, dfa, name }
}

/* ───────────────── Closure constructions (Sipser, as on Hakim Sir's slides) ───────────────── */

function disjoint(a: FA, b: FA) {
  const clash = a.states.filter((q) => b.states.includes(q))
  if (clash.length) throw new Error(`state names must be disjoint: ${clash.join(", ")}`)
}
const sigma = (...ms: FA[]) => [...new Set(ms.flatMap((m) => m.alphabet))]

/** Union: new start q0 with ε-moves to both old start states; F = F1 ∪ F2. */
export function unionNfa(n1: FA, n2: FA, start = "q0"): FA {
  disjoint(n1, n2)
  return {
    kind: "fa",
    states: [start, ...n1.states, ...n2.states],
    alphabet: sigma(n1, n2),
    start,
    accept: [...n1.accept, ...n2.accept],
    delta: [[start, EPS, n1.start], [start, EPS, n2.start], ...n1.delta, ...n2.delta],
  }
}

/** Concatenation: ε from every accepting state of N1 to N2's start; only N2's accepting states accept. */
export function concatNfa(n1: FA, n2: FA): FA {
  disjoint(n1, n2)
  return {
    kind: "fa",
    states: [...n1.states, ...n2.states],
    alphabet: sigma(n1, n2),
    start: n1.start,
    accept: [...n2.accept],
    delta: [...n1.delta, ...n2.delta, ...n1.accept.map((f) => [f, EPS, n2.start] as [string, string, string])],
  }
}

/** Star: new accepting start q0 with ε to the old start, and ε from each old accepting state back to the old start. */
export function starNfa(n1: FA, start = "q0"): FA {
  if (n1.states.includes(start)) throw new Error(`state ${start} already exists`)
  return {
    kind: "fa",
    states: [start, ...n1.states],
    alphabet: n1.alphabet,
    start,
    accept: [start, ...n1.accept],
    delta: [[start, EPS, n1.start], ...n1.delta, ...n1.accept.map((f) => [f, EPS, n1.start] as [string, string, string])],
  }
}

/** The flawed "shortcut" star: no new state; the old start becomes accepting. Wrong when the start state has incoming moves. */
export function starWithoutNewStart(n1: FA): FA {
  return {
    ...n1,
    accept: [...new Set([n1.start, ...n1.accept])],
    delta: [...n1.delta, ...n1.accept.map((f) => [f, EPS, n1.start] as [string, string, string])],
  }
}

/** Complement of a complete DFA: F' = Q \ F. */
export function complementDfa(m: FA): FA {
  if (!isDfa(m)) throw new Error("complement by swapping needs a complete DFA")
  return { ...m, accept: m.states.filter((q) => !m.accept.includes(q)) }
}

/** Swapping accept states of any FA (only correct for a complete DFA). */
export const swapAccept = (m: FA): FA => ({ ...m, accept: m.states.filter((q) => !m.accept.includes(q)) })

/** Product of two DFAs; `mode` picks the accepting pairs. State names are "r,s" (reachable pairs only). */
export function productDfa(m1: FA, m2: FA, mode: "and" | "or" | "minus" = "and"): FA {
  const step = (m: FA, q: string, a: string) => m.delta.find(([f, s]) => f === q && s === a)![2]
  const name = (p: string, q: string) => `${p},${q}`
  const startPair: [string, string] = [m1.start, m2.start]
  const pairs: [string, string][] = [startPair]
  const seen = new Set([name(...startPair)])
  const delta: [string, string, string][] = []
  const alphabet = sigma(m1, m2)
  for (let i = 0; i < pairs.length; i++) {
    const [p, q] = pairs[i]
    for (const a of alphabet) {
      const next: [string, string] = [step(m1, p, a), step(m2, q, a)]
      delta.push([name(p, q), a, name(...next)])
      if (!seen.has(name(...next))) {
        seen.add(name(...next))
        pairs.push(next)
      }
    }
  }
  const acc = ([p, q]: [string, string]) => {
    const a = m1.accept.includes(p)
    const b = m2.accept.includes(q)
    return mode === "and" ? a && b : mode === "or" ? a || b : a && !b
  }
  return { kind: "fa", states: pairs.map((x) => name(...x)), alphabet, start: name(...startPair), accept: pairs.filter(acc).map((x) => name(...x)), delta }
}

/** Reverse: flip every arrow, old start becomes the only accepting state, new start with ε to the old accepting states. */
export function reverseNfa(m: FA, start = "s"): FA {
  return {
    kind: "fa",
    states: [start, ...m.states],
    alphabet: m.alphabet,
    start,
    accept: [m.start],
    delta: [...m.accept.map((f) => [start, EPS, f] as [string, string, string]), ...m.delta.map(([f, a, t]) => [t, a, f] as [string, string, string])],
  }
}

/**
 * Regular expression → NFA by the slides' basic principles: two states for a
 * symbol, one accepting state for ε, one non-accepting state for ∅, then the
 * union / concatenation / star constructions above. States are named q1, q2, …
 * in creation order (left to right through the expression).
 */
export function regexToNfa(src: string, alphabet?: string[]): FA {
  const s = src.replace(/\s+/g, "")
  let i = 0
  let n = 0
  const fresh = () => `q${++n}`
  const atom = (): FA => {
    const c = s[i]
    if (c === "(") {
      i++
      const inner = union()
      if (s[i] !== ")") throw new Error(`expected ) at ${i} in ${src}`)
      i++
      return inner
    }
    i++
    if (c === "ε") {
      const q = fresh()
      return { kind: "fa", states: [q], alphabet: [], start: q, accept: [q], delta: [] }
    }
    if (c === "∅") {
      const q = fresh()
      return { kind: "fa", states: [q], alphabet: [], start: q, accept: [], delta: [] }
    }
    const a = fresh()
    const b = fresh()
    return { kind: "fa", states: [a, b], alphabet: [c], start: a, accept: [b], delta: [[a, c, b]] }
  }
  const starred = (): FA => {
    let m = atom()
    while (s[i] === "*") {
      i++
      m = starNfa(m, fresh())
    }
    return m
  }
  const concat = (): FA => {
    let m = starred()
    while (i < s.length && s[i] !== ")" && s[i] !== "∪" && s[i] !== "+") m = concatNfa(m, starred())
    return m
  }
  const union = (): FA => {
    let m = concat()
    while (s[i] === "∪" || s[i] === "+") {
      i++
      const right = concat()
      m = unionNfa(m, right, fresh())
    }
    return m
  }
  const m = union()
  if (i !== s.length) throw new Error(`unexpected ${s[i]} at ${i} in ${src}`)
  return { ...m, alphabet: alphabet ?? [...new Set(m.alphabet)].sort() }
}

/* ───────────────────────── Tables as markdown ───────────────────────── */

/** LaTeX for a state name: "q10" → "q_{10}". */
export const texState = (q: string) => q.replace(/^([a-zA-Z]+)(\d+)$/, "$1_{$2}")
export const texSet = (s: string[]) => (s.length ? `\\{${s.map(texState).join(",")}\\}` : "\\emptyset")

/** Transition table of any FA as markdown; NFA entries are sets. Start marked →, accepting *. */
export function faTableMd(fa: FA, opts: { sets?: boolean; label?: (q: string) => string; symbols?: string[] } = {}) {
  const syms = opts.symbols ?? (fa.delta.some(([, s]) => s === EPS) ? [...fa.alphabet, EPS] : fa.alphabet)
  const sets = opts.sets ?? !isDfa(fa)
  const lab = opts.label ?? ((q: string) => `$${texState(q)}$`)
  const head = `| State | ${syms.map((a) => `$${a === EPS ? "\\varepsilon" : a}$`).join(" | ")} |`
  const rule = `|---|${syms.map(() => "---").join("|")}|`
  const rows = fa.states.map((q) => {
    const mark = `${q === fa.start ? "→ " : ""}${fa.accept.includes(q) ? "\* " : ""}`
    const cells = syms.map((a) => {
      const ts = ordered(fa, fa.delta.filter(([f, s]) => f === q && s === a).map(([, , t]) => t))
      return sets ? `$${texSet(ts)}$` : ts.length ? lab(ts[0]) : "—"
    })
    return `| ${mark}${lab(q)} | ${cells.join(" | ")} |`
  })
  return [head, rule, ...rows].join("\n")
}

/** ε-closure of every state as a markdown table. */
export function closureTableMd(fa: FA) {
  return [
    "| State | $E(q)$ |",
    "|---|---|",
    ...fa.states.map((q) => `| $${texState(q)}$ | $${texSet(ordered(fa, epsClosure(fa, [q])))}$ |`),
  ].join("\n")
}

/**
 * The subset-construction table: one row per reachable subset, with a letter
 * name, whether it accepts, and its move on each symbol.
 */
export function subsetTableMd(fa: FA, letters = true) {
  const { subsets, name, dfa } = subsetConstruction(fa)
  const letter = new Map(subsets.map((s, i) => [name(s), letters ? String.fromCharCode(65 + i) : ""]))
  const cell = (s: string) => {
    const set = s === "∅" ? [] : s.slice(1, -1).split(",")
    const l = letter.get(s)
    return `$${texSet(set)}$${l ? ` (${l})` : ""}`
  }
  const head = `| DFA state | ${fa.alphabet.map((a) => `$${a}$`).join(" | ")} |`
  const rule = `|---|${fa.alphabet.map(() => "---").join("|")}|`
  const rows = subsets.map((s) => {
    const n = name(s)
    const mark = `${n === dfa.start ? "→ " : ""}${dfa.accept.includes(n) ? "\* " : ""}`
    const cells = fa.alphabet.map((a) => cell(dfa.delta.find(([f, x]) => f === n && x === a)![2]))
    return `| ${mark}${cell(n)} | ${cells.join(" | ")} |`
  })
  return [head, rule, ...rows].join("\n")
}

/**
 * A run on w as display math: states (or, for an NFA, sets of states) joined by
 * labelled arrows, at most `perLine` steps per line, ending with the verdict.
 */
export function faRunTex(fa: FA, w: string, opts: { name?: (q: string) => string; perLine?: number } = {}) {
  const name = opts.name ?? texState
  const per = opts.perLine ?? 6
  const trace = faTrace(fa, w)
  const show = (s: Set<string>) => {
    const qs = ordered(fa, s)
    return isDfa(fa) ? name(qs[0]) : qs.length ? `\\{${qs.map(name).join(",")}\\}` : "\\emptyset"
  }
  const steps = [...w].map((a, i) => `\\xrightarrow{${a}} ${show(trace[i + 1])}`)
  const lines: string[] = []
  for (let i = 0; i < Math.max(steps.length, 1); i += per) lines.push(steps.slice(i, i + per).join(" "))
  const verdict = faAccepts(fa, w) ? "\\quad\\text{accept}" : "\\quad\\text{reject}"
  const body = steps.length ? lines.map((l, i) => (i === 0 ? `${show(trace[0])} &${l}` : `&${l}`)).join(" \\\\\n") : `${show(trace[0])} &`
  return `$$\n\\begin{aligned}\n${body}${verdict}\n\\end{aligned}\n$$`
}

/** True when δ is a total function on Q × Σ with no ε-moves. */
export function isDfa(fa: FA) {
  if (fa.delta.some(([, s]) => s === EPS)) return false
  return fa.states.every((q) => fa.alphabet.every((a) => fa.delta.filter(([f, s]) => f === q && s === a).length === 1))
}

/* ───────────────────────── Pushdown automata ───────────────────────── */

type Config = { q: string; i: number; stack: string[] }

/**
 * Bound on the stack height explored: a number, or a function of how much
 * input is left. For a PDA built from a grammar with no ε-rules every stack
 * symbol must still consume input, so `(left) => left + 1` is exact and
 * keeps left-recursive grammars from exploding.
 */
export type StackBound = number | ((left: number) => number)
const within = (b: StackBound, c: Config, w: string) => c.stack.length <= (typeof b === "number" ? b : b(w.length - c.i))

function pdaSearch(
  w: string,
  start: Config,
  moves: (c: Config) => Config[],
  done: (c: Config) => boolean,
  maxStack: StackBound,
) {
  const seen = new Set<string>()
  const queue = [start]
  while (queue.length) {
    const c = queue.shift()!
    if (c.i === w.length && done(c)) return true
    const key = `${c.q}|${c.i}|${c.stack.join(",")}`
    if (seen.has(key)) continue
    seen.add(key)
    for (const n of moves(c)) if (within(maxStack, n, w)) queue.push(n)
  }
  return false
}

export function pdaAccepts(m: PdaSipser | PdaHmu, w: string, maxStack: StackBound = 2 * w.length + 8): boolean {
  if (m.kind === "pda-sipser") {
    return pdaSearch(
      w,
      { q: m.start, i: 0, stack: [] },
      (c) =>
        m.delta.flatMap(([f, a, pop, t, push]) => {
          if (f !== c.q) return []
          if (a !== EPS && w[c.i] !== a) return []
          if (pop !== EPS && c.stack[0] !== pop) return []
          const rest = pop === EPS ? c.stack : c.stack.slice(1)
          return [{ q: t, i: a === EPS ? c.i : c.i + 1, stack: push === EPS ? rest : [push, ...rest] }]
        }),
      (c) => m.accept.includes(c.q),
      maxStack,
    )
  }
  return pdaSearch(
    w,
    { q: m.start, i: 0, stack: [m.startStack] },
    (c) =>
      c.stack.length === 0
        ? []
        : m.delta.flatMap(([f, a, top, t, push]) => {
            if (f !== c.q || c.stack[0] !== top) return []
            if (a !== EPS && w[c.i] !== a) return []
            return [{ q: t, i: a === EPS ? c.i : c.i + 1, stack: [...push, ...c.stack.slice(1)] }]
          }),
    (c) => (m.acceptBy === "final" ? m.accept.includes(c.q) : c.stack.length === 0),
    maxStack,
  )
}

export type PdaConfig = { q: string; rest: string; stack: string[] }

/**
 * One accepting computation of a PDA on w, as a list of configurations
 * (breadth-first, so it is a shortest accepting branch), or null if w is rejected.
 */
export function pdaAcceptingTrace(m: PdaSipser | PdaHmu, w: string, maxStack: StackBound = 2 * w.length + 8): PdaConfig[] | null {
  type Node = { c: Config; prev: Node | null }
  const start: Config = m.kind === "pda-sipser" ? { q: m.start, i: 0, stack: [] } : { q: m.start, i: 0, stack: [m.startStack] }
  const moves = (c: Config): Config[] =>
    m.kind === "pda-sipser"
      ? m.delta.flatMap(([f, a, pop, t, push]) => {
          if (f !== c.q || (a !== EPS && w[c.i] !== a) || (pop !== EPS && c.stack[0] !== pop)) return []
          const rest = pop === EPS ? c.stack : c.stack.slice(1)
          return [{ q: t, i: a === EPS ? c.i : c.i + 1, stack: push === EPS ? rest : [push, ...rest] }]
        })
      : c.stack.length === 0
        ? []
        : m.delta.flatMap(([f, a, X, t, g]) => {
            if (f !== c.q || c.stack[0] !== X || (a !== EPS && w[c.i] !== a)) return []
            return [{ q: t, i: a === EPS ? c.i : c.i + 1, stack: [...g, ...c.stack.slice(1)] }]
          })
  const done = (c: Config) =>
    c.i === w.length && (m.kind === "pda-hmu" && m.acceptBy === "empty" ? c.stack.length === 0 : m.accept.includes(c.q))
  const seen = new Set<string>()
  const queue: Node[] = [{ c: start, prev: null }]
  while (queue.length) {
    const n = queue.shift()!
    if (done(n.c)) {
      const out: PdaConfig[] = []
      for (let x: Node | null = n; x; x = x.prev) out.unshift({ q: x.c.q, rest: w.slice(x.c.i), stack: x.c.stack })
      return out
    }
    const key = `${n.c.q}|${n.c.i}|${n.c.stack.join(",")}`
    if (seen.has(key)) continue
    seen.add(key)
    for (const c of moves(n.c)) if (within(maxStack, c, w)) queue.push({ c, prev: n })
  }
  return null
}

/** LaTeX for a configuration sequence: (q, w, s) with ⊢ between steps, one step per line. */
export function pdaTraceTex(trace: PdaConfig[], names: (q: string) => string = texState) {
  // A literal $ would end the math in remark-math, so the bottom marker is written \text{\textdollar}.
  const sym = (s: string) => (s === "$" ? "\\text{\\textdollar}" : s.replace(/^([A-Za-z])(\d+)$/, "$1_{$2}").replace("#", "\\#"))
  const cfg = (c: PdaConfig) =>
    `(${names(c.q)},\\ ${c.rest ? c.rest.replace(/#/g, "\\#") : "\\varepsilon"},\\ ${c.stack.length ? c.stack.map(sym).join("") : "\\varepsilon"})`
  const lines = trace.slice(1).map((c, k) => `${k === 0 ? cfg(trace[0]) + " " : ""}&\\vdash ${cfg(c)}`)
  return `$$\n\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}\n$$`
}

/* ───────────────────────── Turing machines ───────────────────────── */

export type TmRun = { result: "accept" | "reject" | "timeout"; tape: string[]; head: number; steps: number; state: string }

/** Runs a deterministic TM. The tape starts as w; the head starts on the first cell. */
export function tmRun(m: TM, w: string | string[], maxSteps = 100000): TmRun {
  const tape = typeof w === "string" ? [...w] : [...w]
  if (tape.length === 0) tape.push(m.blank)
  let head = 0
  let q = m.start
  for (let steps = 0; ; steps++) {
    if (m.accept.includes(q)) return { result: "accept", tape, head, steps, state: q }
    if (steps >= maxSteps) return { result: "timeout", tape, head, steps, state: q }
    const X = tape[head]
    const move = m.delta.find(([f, r]) => f === q && r === X)
    if (!move) return { result: "reject", tape, head, steps, state: q }
    const [, , p, Y, D] = move
    tape[head] = Y
    q = p
    if (D === "R") {
      head++
      if (head === tape.length) tape.push(m.blank)
    } else if (D === "L") {
      if (head === 0) tape.unshift(m.blank)
      else head--
    }
  }
}

export type TmSnapshot = { state: string; tape: string[]; head: number }

/** Every configuration of a deterministic TM run, the initial one included. */
export function tmTrace(m: TM, w: string | string[], maxSteps = 400): TmSnapshot[] {
  const tape = typeof w === "string" ? [...w] : [...w]
  if (tape.length === 0) tape.push(m.blank)
  let head = 0
  let q = m.start
  const out: TmSnapshot[] = [{ state: q, tape: [...tape], head }]
  for (let steps = 0; steps < maxSteps && !m.accept.includes(q); steps++) {
    const move = m.delta.find(([f, r]) => f === q && r === tape[head])
    if (!move) break
    const [, , p, Y, D] = move
    tape[head] = Y
    q = p
    if (D === "R") {
      head++
      if (head === tape.length) tape.push(m.blank)
    } else if (D === "L") {
      if (head === 0) tape.unshift(m.blank)
      else head--
    }
    out.push({ state: q, tape: [...tape], head })
  }
  return out
}

/**
 * HMU's ID for a snapshot: the tape between the leftmost and rightmost
 * non-blanks, with the state written just left of the scanned cell. Blanks
 * are kept only when the head is on or beyond them.
 */
export function tmId(m: TM, s: TmSnapshot, stateTex: (q: string) => string = texState) {
  let a = 0
  let b = s.tape.length
  while (a < s.head && s.tape[a] === m.blank) a++
  while (b > s.head + 1 && s.tape[b - 1] === m.blank) b--
  const sym = (x: string) => (x.length > 1 ? x.replace(/^([A-Za-z])(\d+)$/, "$1_{$2}") : x === "#" ? "\\#" : x)
  const left = s.tape.slice(a, s.head).map(sym).join("")
  const right = s.tape.slice(s.head, b).map(sym).join("")
  return `${left}\\,${stateTex(s.state)}\\,${right}`
}

/** The TM's δ as HMU's table: rows are states, columns tape symbols, entries (p, Y, D) or "–". */
export function tmTableMd(m: TM, stateTex: (q: string) => string = texState) {
  const sym = (x: string) => (x.length > 1 ? x.replace(/^([A-Za-z])(\d+)$/, "$1_{$2}") : x === "#" ? "\\#" : x)
  const head = `| State | ${m.tape.map((x) => `$${sym(x)}$`).join(" | ")} |`
  const rule = `|---|${m.tape.map(() => "---").join("|")}|`
  const rows = m.states.map((q) => {
    const mark = `${q === m.start ? "→ " : ""}${m.accept.includes(q) ? "\\* " : ""}`
    const cells = m.tape.map((X) => {
      const mv = m.delta.find(([f, r]) => f === q && r === X)
      return mv ? `$(${stateTex(mv[2])},${sym(mv[3])},${mv[4]})$` : "–"
    })
    return `| ${mark}$${stateTex(q)}$ | ${cells.join(" | ")} |`
  })
  return [head, rule, ...rows].join("\n")
}

/** A TM run as display math, one ID per line joined by ⊢. */
export function tmTraceTex(m: TM, w: string | string[], opts: { stateTex?: (q: string) => string; maxSteps?: number } = {}) {
  const ids = tmTrace(m, w, opts.maxSteps).map((s) => tmId(m, s, opts.stateTex))
  if (ids.length === 1) return `$$\n${ids[0]}\n$$`
  const lines = ids.slice(1).map((id, k) => `${k === 0 ? ids[0] + " " : ""}&\\vdash ${id}`)
  return `$$\n\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}\n$$`
}

/** Non-blank contents of a tape, blanks trimmed from both ends. */
export function tapeContents(m: TM, tape: string[]) {
  let a = 0
  let b = tape.length
  while (a < b && tape[a] === m.blank) a++
  while (b > a && tape[b - 1] === m.blank) b--
  return tape.slice(a, b)
}

/* ───────────────────────── Grammars ───────────────────────── */

export const isVariable = (g: CFG, s: string) => s in g.rules

/**
 * Grammar from rule lines such as "S -> 0S1S | 1S0S | ε". Variables are an
 * uppercase letter, optionally with an underscore subscript or primes (S, S_1, A'),
 * because digits are usually terminals (S → A1A); everything
 * else that is not a space is a one-character terminal. The first rule's head
 * is the start variable unless `start` is given.
 */
export function grammar(src: string, start?: string): CFG {
  const rules: Record<string, string[][]> = {}
  let first: string | undefined
  for (const line of src.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const [head, rhs] = line.split(/->|→/).map((s) => s.trim())
    first ??= head
    rules[head] ??= []
    for (const alt of rhs.split("|").map((s) => s.trim())) {
      if (alt === "ε" || alt === "") {
        rules[head].push([])
        continue
      }
      rules[head].push(alt.replace(/\s+/g, "").match(/[A-Z](?:_\d+|'+)?|./gu) ?? [])
    }
  }
  // A variable used but never defined (e.g. a typo on a paper) is still a variable: it just has no rules.
  for (const bodies of Object.values(rules)) for (const b of bodies) for (const s of b) if (/^[A-Z](?:_\d+|'+)?$/.test(s)) rules[s] ??= []
  return { kind: "cfg", start: start ?? first!, rules }
}

/** Rules back as text, in the given order: "S → 0S1S | ε". */
export function grammarText(g: CFG) {
  return Object.entries(g.rules)
    .map(([A, bodies]) => `${A} → ${bodies.map((b) => (b.length ? b.join("") : "ε")).join(" | ")}`)
    .join("\n")
}

/** Earley recogniser: works for any CFG, including ε-rules and left recursion. */
export function cfgGenerates(g: CFG, w: string): boolean {
  type Item = { head: string; body: string[]; dot: number; origin: number }
  const n = w.length
  const chart: Item[][] = Array.from({ length: n + 1 }, () => [])
  const keys: Set<string>[] = Array.from({ length: n + 1 }, () => new Set())
  const add = (k: number, it: Item) => {
    const key = `${it.head}>${it.body.join(" ")}.${it.dot}@${it.origin}`
    if (!keys[k].has(key)) {
      keys[k].add(key)
      chart[k].push(it)
    }
  }
  const ROOT = "⟨start⟩"
  add(0, { head: ROOT, body: [g.start], dot: 0, origin: 0 })
  for (let k = 0; k <= n; k++) {
    for (let j = 0; j < chart[k].length; j++) {
      const it = chart[k][j]
      const next = it.body[it.dot]
      if (next === undefined) {
        for (const p of chart[it.origin]) if (p.body[p.dot] === it.head) add(k, { ...p, dot: p.dot + 1 })
        // An ε-completed item may finish after its parent was added at the same position.
        if (it.origin === k) for (const p of chart[k]) if (p.body[p.dot] === it.head) add(k, { ...p, dot: p.dot + 1 })
      } else if (isVariable(g, next)) {
        for (const body of g.rules[next]) add(k, { head: next, body, dot: 0, origin: k })
        const nullable = chart[k].some((c) => c.head === next && c.origin === k && c.dot === c.body.length)
        if (nullable) add(k, { ...it, dot: it.dot + 1 })
      } else if (k < n && w[k] === next) {
        add(k + 1, { ...it, dot: it.dot + 1 })
      }
    }
  }
  return chart[n].some((it) => it.head === ROOT && it.dot === 1)
}

/** A parse tree: a variable with children, a terminal leaf, or an ε leaf. */
export type Tree = { label: string; children?: Tree[] }

/**
 * Parse trees of w from `root`, at most `limit` of them (enough to show two
 * trees for an ambiguous string). Derivation cycles (A ⇒+ A on the same
 * span) are cut, so each returned tree is finite and valid.
 */
export function parseTrees(g: CFG, w: string, limit = 2, root = g.start): Tree[] {
  const memo = new Map<string, Tree[]>()
  const active = new Set<string>()
  const trees = (A: string, i: number, j: number): Tree[] => {
    if (!isVariable(g, A)) return j - i === 1 && w[i] === A ? [{ label: A }] : []
    const key = `${A}|${i}|${j}`
    if (memo.has(key)) return memo.get(key)!
    if (active.has(key)) return [] // cycle: a shorter tree exists without it
    active.add(key)
    const out: Tree[] = []
    for (const body of g.rules[A]) {
      if (out.length >= limit) break
      if (body.length === 0) {
        if (i === j) out.push({ label: A, children: [{ label: EPS }] })
        continue
      }
      for (const kids of sequences(body, i, j)) {
        out.push({ label: A, children: kids })
        if (out.length >= limit) break
      }
    }
    active.delete(key)
    memo.set(key, out)
    return out
  }
  const sequences = (body: string[], i: number, j: number): Tree[][] => {
    if (body.length === 1) return trees(body[0], i, j).map((t) => [t])
    const out: Tree[][] = []
    for (let m = i; m <= j && out.length < limit; m++) {
      const first = trees(body[0], i, m)
      if (!first.length) continue
      const rest = sequences(body.slice(1), m, j)
      for (const f of first) for (const r of rest) if (out.length < limit) out.push([f, ...r])
    }
    return out
  }
  return trees(root, 0, w.length)
}

/**
 * Number of distinct parse trees for w (capped at `cap`). Returns Infinity
 * when a derivation cycle lets the same span be derived again, which means
 * infinitely many trees (e.g. S → SS | ε on ε).
 */
export function parseCount(g: CFG, w: string, cap = 1000): number {
  const memo = new Map<string, number>()
  const active = new Set<string>()
  const count = (A: string, i: number, j: number): number => {
    if (!isVariable(g, A)) return j - i === 1 && w[i] === A ? 1 : 0
    const key = `${A}|${i}|${j}`
    if (memo.has(key)) return memo.get(key)!
    if (active.has(key)) return Infinity
    active.add(key)
    let total = 0
    for (const body of g.rules[A]) total += body.length === 0 ? (i === j ? 1 : 0) : seq(body, i, j)
    active.delete(key)
    const v = Math.min(total, cap)
    memo.set(key, v)
    return v
  }
  const seq = (body: string[], i: number, j: number): number => {
    if (body.length === 1) return count(body[0], i, j)
    let total = 0
    for (let m = i; m <= j; m++) {
      const a = count(body[0], i, m)
      if (a === 0) continue
      const b = seq(body.slice(1), m, j)
      if (b === 0) continue
      total += a * b
    }
    return total
  }
  return count(g.start, 0, w.length)
}

/** Leftmost derivation read off a parse tree: each line is a sentential form. */
export function leftmostDerivation(t: Tree): string[] {
  const forms: Tree[][] = [[t]]
  let cur: Tree[] = [t]
  for (;;) {
    const k = cur.findIndex((n) => n.children)
    if (k < 0) break
    cur = [...cur.slice(0, k), ...cur[k].children!.filter((c) => c.label !== EPS), ...cur.slice(k + 1)]
    forms.push(cur)
  }
  return forms.map((f) => f.map((n) => n.label).join("") || EPS)
}

/** Rightmost derivation read off a parse tree. */
export function rightmostDerivation(t: Tree): string[] {
  const forms: Tree[][] = [[t]]
  let cur: Tree[] = [t]
  for (;;) {
    let k = -1
    for (let x = cur.length - 1; x >= 0; x--) if (cur[x].children) { k = x; break }
    if (k < 0) break
    cur = [...cur.slice(0, k), ...cur[k].children!.filter((c) => c.label !== EPS), ...cur.slice(k + 1)]
    forms.push(cur)
  }
  return forms.map((f) => f.map((n) => n.label).join("") || EPS)
}

/** True when every rule is A → BC or A → a (plus S → ε if S never appears on a right side). */
export function isCnf(g: CFG) {
  return Object.entries(g.rules).every(([A, bodies]) =>
    bodies.every((b) =>
      b.length === 0
        ? A === g.start && !Object.values(g.rules).some((bs) => bs.some((x) => x.includes(g.start)))
        : b.length === 1
          ? !isVariable(g, b[0])
          : b.length === 2 && isVariable(g, b[0]) && isVariable(g, b[1]),
    ),
  )
}

/** CYK table: table[i][j] is the set of variables deriving w[i..j] (0-based, inclusive). */
export function cykTable(g: CFG, w: string): Set<string>[][] {
  const n = w.length
  const T: Set<string>[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => new Set<string>()))
  for (let i = 0; i < n; i++)
    for (const [A, bodies] of Object.entries(g.rules)) if (bodies.some((b) => b.length === 1 && b[0] === w[i])) T[i][i].add(A)
  for (let len = 2; len <= n; len++)
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1
      for (let k = i; k < j; k++)
        for (const [A, bodies] of Object.entries(g.rules))
          for (const b of bodies) if (b.length === 2 && T[i][k].has(b[0]) && T[k + 1][j].has(b[1])) T[i][j].add(A)
    }
  return T
}

/* ───────────────────────── Regular expressions ───────────────────────── */

/**
 * Regex in course syntax over single-character symbols: union "+" or "∪",
 * star "*", plus-closure "⁺", "ε" and "∅", juxtaposition for concatenation.
 * Pass `plusIsSymbol` when "+" is an alphabet symbol (e.g. arithmetic).
 */
export function regexMatcher(src: string, opts: { plusIsSymbol?: boolean } = {}) {
  let js = ""
  for (const c of src.replace(/\s+/g, "")) {
    if (c === "∪" || (c === "+" && !opts.plusIsSymbol)) js += "|"
    else if (c === "ε") js += "(?:)"
    else if (c === "∅") js += "(?:(?!))" // grouped so that ∅* is a legal JS regex
    else if (c === "⁺") js += "+"
    else if ("()*".includes(c)) js += c
    else js += c.replace(/[.?^${}[\]\\|+]/g, "\\$&")
  }
  const re = new RegExp(`^(?:${js})$`, "u")
  return (w: string) => re.test(w)
}

/* ───────────────────────── Strings ───────────────────────── */

/** All strings over the alphabet with length 0..maxLen, shortest first. */
export function allStrings(alphabet: string[], maxLen: number): string[] {
  const out = [""]
  let layer = [""]
  for (let len = 1; len <= maxLen; len++) {
    layer = layer.flatMap((s) => alphabet.map((a) => s + a))
    for (const s of layer) out.push(s)
  }
  return out
}

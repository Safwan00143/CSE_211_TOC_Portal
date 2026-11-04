/*
  HMU-style PDA constructions as on Atif Sir's slides (HMU, Chapter 6):
  CFG → PDA by empty stack, empty stack ↔ final state, and PDA → CFG with
  [pXq] variables. Each returns a machine or grammar that scripts/verify.ts
  can test against the original language.
*/
import { EPS, isVariable, type CFG, type PdaHmu } from "./automata"
import { removeUseless } from "./cnf"

type Move = PdaHmu["delta"][number]

/** One-state PDA simulating leftmost derivations: δ(q, ε, A) ∋ (q, α) for A → α, and δ(q, a, a) = {(q, ε)}. */
export function cfgToPda(g: CFG, state = "q"): PdaHmu {
  const terminals = [...new Set(Object.values(g.rules).flatMap((bs) => bs.flatMap((b) => b.filter((s) => !isVariable(g, s)))))]
  const delta: Move[] = [
    ...Object.entries(g.rules).flatMap(([A, bodies]) => bodies.map((b) => [state, EPS, A, state, [...b]] as Move)),
    ...terminals.map((a) => [state, a, a, state, []] as Move),
  ]
  return {
    kind: "pda-hmu",
    states: [state],
    alphabet: terminals,
    stack: [...Object.keys(g.rules), ...terminals],
    start: state,
    startStack: g.start,
    accept: [],
    acceptBy: "empty",
    delta,
  }
}

/** From final state to empty stack: new bottom X0, a new start p0 pushing Z0 over X0, and a draining state p. */
export function finalToEmpty(pf: PdaHmu, names = { p0: "p_0", p: "p", X0: "X_0" }): PdaHmu {
  const stack = [...pf.stack, names.X0]
  const delta: Move[] = [
    [names.p0, EPS, names.X0, pf.start, [pf.startStack, names.X0]],
    ...pf.delta,
    ...pf.accept.flatMap((f) => stack.map((Y) => [f, EPS, Y, names.p, []] as Move)),
    ...stack.map((Y) => [names.p, EPS, Y, names.p, []] as Move),
  ]
  return { kind: "pda-hmu", states: [names.p0, ...pf.states, names.p], alphabet: pf.alphabet, stack, start: names.p0, startStack: names.X0, accept: [], acceptBy: "empty", delta }
}

/** From empty stack to final state: new bottom X0; whenever X0 is exposed, move to the accepting state pf. */
export function emptyToFinal(pn: PdaHmu, names = { p0: "p_0", pf: "p_f", X0: "X_0" }): PdaHmu {
  const delta: Move[] = [
    [names.p0, EPS, names.X0, pn.start, [pn.startStack, names.X0]],
    ...pn.delta,
    ...pn.states.map((q) => [q, EPS, names.X0, names.pf, []] as Move),
  ]
  return {
    kind: "pda-hmu",
    states: [names.p0, ...pn.states, names.pf],
    alphabet: pn.alphabet,
    stack: [...pn.stack, names.X0],
    start: names.p0,
    startStack: names.X0,
    accept: [names.pf],
    acceptBy: "final",
    delta,
  }
}

/** Variable name for the triple [pXq]. */
export const triple = (p: string, X: string, q: string) => `[${p}${X}${q}]`

/**
 * PDA (empty stack) → CFG. Variables S and [pXq]: "P goes from p to q while
 * the net effect is popping X". S → [q0 Z0 p] for every p; for each move
 * (r, Y1…Yk) ∈ δ(q, a, X) and every list of states r1…rk:
 *   [q X rk] → a [r Y1 r1][r1 Y2 r2]…[r(k-1) Yk rk].
 * Returns the full grammar and the version with useless variables removed.
 */
export function pdaToCfg(pn: PdaHmu): { full: CFG; trimmed: CFG } {
  const rules: Record<string, string[][]> = { S: [] }
  for (const p of pn.states) rules.S.push([triple(pn.start, pn.startStack, p)])
  const lists = (k: number): string[][] => (k === 0 ? [[]] : lists(k - 1).flatMap((l) => pn.states.map((s) => [...l, s])))
  for (const [q, a, X, r, Ys] of pn.delta) {
    for (const rs of lists(Ys.length)) {
      const end = Ys.length ? rs[rs.length - 1] : r
      const head = triple(q, X, end)
      const body = [...(a === EPS ? [] : [a]), ...Ys.map((Y, i) => triple(i === 0 ? r : rs[i - 1], Y, rs[i]))]
      rules[head] ??= []
      rules[head].push(body)
    }
  }
  // Every [pXq] that can appear is a variable, even with no rules.
  for (const p of pn.states) for (const X of pn.stack) for (const q of pn.states) rules[triple(p, X, q)] ??= []
  const full: CFG = { kind: "cfg", start: "S", rules }
  return { full, trimmed: removeUseless(full).grammar }
}

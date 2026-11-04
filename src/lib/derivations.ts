/* Derivations as LaTeX, read off parse trees computed from the grammar. */
import { leftmostDerivation, parseTrees, rightmostDerivation, type CFG, type Tree } from "./automata"

/** The parse trees of w (up to `limit`), optionally filtered, e.g. by the root's first production. */
export function treesOf(g: CFG, w: string, opts: { limit?: number; pick?: (t: Tree) => boolean } = {}): Tree[] {
  const all = parseTrees(g, w, opts.limit ?? 12)
  const picked = opts.pick ? all.filter(opts.pick) : all
  if (!picked.length) throw new Error(`no parse tree of "${w}" matches`)
  return picked
}

/** Root production as a string, e.g. "E+E", for picking trees. */
export const rootBody = (t: Tree) => (t.children ?? []).map((c) => c.label).join("")

/** LaTeX for one sentential form: escapes symbols KaTeX treats specially. */
export function texForm(s: string) {
  return s.replace(/[#{}$%&]/g, (c) => `\\${c}`).replace(/ε/g, "\\varepsilon")
}

/** A derivation as display math, one step per line; `mode` marks leftmost/rightmost steps. */
export function derivationTex(forms: string[], mode?: "lm" | "rm") {
  const arrow = mode ? `\\underset{${mode}}{\\Rightarrow}` : "\\Rightarrow"
  if (forms.length === 1) return `$$\n${texForm(forms[0])}\n$$`
  const lines = forms.slice(1).map((f, k) => `${k === 0 ? texForm(forms[0]) + " " : ""}&${arrow} ${texForm(f)}`)
  return `$$\n\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}\n$$`
}

/** Leftmost or rightmost derivation of w following a chosen parse tree. */
export function derivation(g: CFG, w: string, mode: "lm" | "rm", pick?: (t: Tree) => boolean) {
  const t = treesOf(g, w, { pick })[0]
  return derivationTex(mode === "lm" ? leftmostDerivation(t) : rightmostDerivation(t), mode)
}

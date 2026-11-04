/*
  Brute-force checks of pumping-lemma arguments for small pumping lengths.
  A proof says: for this witness, every legal split fails for the chosen i.
  These functions try every legal split and report any that survives.
*/

export type PumpClaim = {
  id: string
  kind: "regular" | "cfl"
  /** Membership test straight from the language's definition. */
  inL: (w: string) => boolean
  /** The witness as a function of p. */
  witness: (p: number) => string
  /** The pumping exponent chosen in the proof; may depend on p and the split. */
  i: (p: number, pieces: string[]) => number | number[]
  /** Pumping lengths to try (default 1..6). */
  ps?: number[]
}

/** Splits that survive pumping (should be empty for a correct proof). */
export function survivingSplits(c: PumpClaim, p: number): string[] {
  const w = c.witness(p)
  const bad: string[] = []
  if (!c.inL(w)) return [`witness ${w} is not in L`]
  if (w.length < p) return [`witness ${w} is shorter than p = ${p}`]
  const tryPieces = (pieces: string[], pump: (k: number) => string) => {
    const iv = c.i(p, pieces)
    const is = Array.isArray(iv) ? iv : [iv]
    // The proof's i must work; for "any i" claims pass several.
    if (is.every((k) => c.inL(pump(k)))) bad.push(pieces.map((x) => x || "ε").join(" | "))
  }
  if (c.kind === "regular") {
    for (let a = 0; a <= p; a++)
      for (let b = a + 1; b <= Math.min(p, w.length); b++) {
        const [x, y, z] = [w.slice(0, a), w.slice(a, b), w.slice(b)]
        tryPieces([x, y, z], (k) => x + y.repeat(k) + z)
      }
  } else {
    for (let s = 0; s <= w.length; s++)
      for (let e = s; e <= Math.min(w.length, s + p); e++)
        // window w[s..e) = vxy, with v = w[s..a), x = w[a..b), y = w[b..e)
        for (let a = s; a <= e; a++)
          for (let b = a; b <= e; b++) {
            const [u, v, x, y, z] = [w.slice(0, s), w.slice(s, a), w.slice(a, b), w.slice(b, e), w.slice(e)]
            if (v.length + y.length === 0) continue
            tryPieces([u, v, x, y, z], (k) => u + v.repeat(k) + x + y.repeat(k) + z)
          }
  }
  return bad
}

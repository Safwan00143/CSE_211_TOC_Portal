import type { CFG, Machine, StackBound } from "@/lib/automata"

/**
 * One automaton, grammar or regex from a note or a solution, with a direct
 * test of the language it is meant to describe. scripts/verify.ts runs every
 * check on all strings up to `maxLen` and reports any disagreement.
 */
export type Check = {
  /** Where it is used, e.g. "b22-1b" or "note-dfa-even1". */
  id: string
  alphabet: string[]
  maxLen: number
  /** The intended language, written straight from its definition. */
  inL: (w: string) => boolean
  /** Extra strings to test beyond the exhaustive range, e.g. long ones. */
  extra?: string[]
  /** Must the machine be a complete DFA? */
  dfa?: boolean
  /** Must the (HMU) PDA be deterministic? */
  deterministic?: boolean
  /** PDA search bound (see StackBound); default 2|w| + 8. */
  stackBound?: StackBound
  /** For a TM that computes a function: the expected tape contents after it accepts. */
  output?: (w: string) => string
} & (
  | { machine: Machine }
  | {
      grammar: CFG
      cnf?: boolean
      /** Strings claimed to have two or more parse trees. */
      ambiguousOn?: string[]
      /** Claim: every string up to maxLen has at most one parse tree. */
      unambiguous?: boolean
    }
  | { regex: string; plusIsSymbol?: boolean }
)

/**
 * A claim in a solution that is not "this machine accepts this language", such
 * as "no 2-state DFA recognises L" or "the minimum pumping length is 12".
 * `problem` recomputes the claim and returns a description of any mismatch, or
 * null when the claim holds.
 */
export type Fact = { id: string; claim: string; problem: () => string | null }

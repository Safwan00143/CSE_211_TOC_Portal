/*
  HMU's binary codes for Turing machines and the enumeration of binary strings
  (Atif Sir, Lecture 7). States are q1, q2, … (q1 start, q2 the only accepting
  state); tape symbols X1 = 0, X2 = 1, X3 = B, then others; L = D1, R = D2.
*/

export type CodedMove = { q: number; x: number; p: number; y: number; d: 1 | 2 }

/** δ(q_i, X_j) = (q_k, X_l, D_m) is coded 0^i 1 0^j 1 0^k 1 0^l 1 0^m. */
export const moveCode = (m: CodedMove) => [m.q, m.x, m.p, m.y, m.d].map((n) => "0".repeat(n)).join("1")

/** The whole TM: the transition codes separated by 11. */
export const tmCode = (moves: CodedMove[]) => moves.map(moveCode).join("11")

/** The i-th binary string (i ≥ 1): write i in binary and drop the leading 1. */
export const ithString = (i: number) => i.toString(2).slice(1)

/** Index of a binary string w: read 1w as a binary number. */
export const indexOf = (w: string) => parseInt("1" + w, 2)

/** Does the index sequence solve the PCP instance (lists A, B; 1-based indexes)? */
export const pcpSolves = (A: string[], B: string[], seq: number[]) =>
  seq.length > 0 && seq.map((i) => A[i - 1]).join("") === seq.map((i) => B[i - 1]).join("")

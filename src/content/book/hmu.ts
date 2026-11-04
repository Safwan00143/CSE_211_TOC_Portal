/* HMU problems (Part B topics). Statements are paraphrased; every machine and grammar is checked in machines/book.ts. */
import { cfgGenerates, texState, tmTableMd, tmTraceTex, type PdaHmu } from "@/lib/automata"
import { cykTableMd, cykWorkingMd, grammarTex } from "@/lib/cnf"
import { h621b, h631, h633Cfg, h635a, h642a, h642b, h716Cnf, h734, h822c, h832, h89, ntmIds } from "../machines/book"
import type { BookProblem } from "../types"

const r = String.raw
const HMU = "HMU" as const

/** δ of an HMU PDA as one aligned list, grouping moves that share (state, input, top). */
function deltaTex(m: PdaHmu, name: (q: string) => string = texState) {
  const groups = new Map<string, string[]>()
  for (const [q, a, X, p, g] of m.delta) {
    const key = `\\delta(${name(q)}, ${a === "ε" ? r`\varepsilon` : a}, ${texState(X)})`
    const push = g.length ? g.map(texState).join("") : r`\varepsilon`
    groups.set(key, [...(groups.get(key) ?? []), `(${name(p)}, ${push})`])
  }
  const lines = [...groups].map(([k, v]) => `${k} &= \\{${v.join(", ")}\\}`)
  return "$$\n\\begin{aligned}\n" + lines.join("\\\\\n") + "\n\\end{aligned}\n$$"
}
const idTex = (left: string, q: string, right: string) => `${left}${texState(q)}${right}`
const ntmLevels = (w: string) =>
  ntmIds(w)
    .map((level, k) => `- after ${k} move${k === 1 ? "" : "s"}: ${level.map((i) => `$${idTex(i.left, i.q, i.right)}$`).join(", ")}`)
    .join("\n")
const cyk = (w: string) => `**${w}** is ${cfgGenerates(h734, w) ? "" : "not "}in $L(G)$: $S$ is ${cfgGenerates(h734, w) ? "" : "not "}in the top cell.

${cykTableMd(h734, w)}

${cykWorkingMd(h734, w)}`
const wwrName = (q: string) => ({ q0: "q_0", r0: "r_0", r1: "r_1", t0: "t_0", t1: "t_1", back: "q_b", qa: "q_{acc}" })[q] ?? q
const shiftName = (q: string) => ({ q0: "q_0", h0: "h_0", h1: "h_1", home: "q_h", qf: "q_f" })[q] ?? q

export const hmuProblems: BookProblem[] = [
  /* ───── cnf-cyk ───── */
  {
    id: "bk-h7-1-1",
    topic: "cnf-cyk",
    book: HMU,
    ref: "Exercise 7.1.1",
    prompt: r`Find a grammar with no useless symbols equivalent to $S \to AB \mid CA$, $A \to a$, $B \to BC \mid AB$, $C \to aB \mid b$.`,
    solution: r`**Step 1: remove non-generating symbols.**

- $A \to a$ and $C \to b$ generate terminal strings.
- So does $S$, through $S \to CA$.
- Every rule for $B$ has $B$ in its body, so $B$ never derives a terminal string. **$B$ is non-generating.**

Delete $B$ and every rule that mentions it: $S \to AB$, $B \to BC \mid AB$, and $C \to aB$.

**Step 2: remove unreachable symbols.** What is left is $S \to CA$, $A \to a$, $C \to b$. All of $S, A, C$ are reachable from $S$.

$$
S \to CA \qquad A \to a \qquad C \to b
$$

The order matters: generating first, then reachable. The language is just $\{ba\}$. The cleaned grammar was compared with the original on all strings up to length 8.`,
  },
  {
    id: "bk-h7-1-6",
    topic: "cnf-cyk",
    book: HMU,
    ref: "Exercise 7.1.6",
    prompt: r`Design a CNF grammar for the strings of balanced parentheses.`,
    solution: r`Start from $S \to SS \mid (S) \mid ()$, which generates the *nonempty* balanced strings. A CNF grammar cannot generate $\varepsilon$, so the empty string is left out, as usual for CNF.

1. Replace each terminal in a long body by a variable: $L \to ($, $R \to )$.
2. Break $LSR$ into pairs with a new variable $C_1 \to SR$.

${grammarTex(h716Cnf.grammar)}

Every body is now two variables or one terminal. The grammar was checked to be in CNF and to generate exactly the nonempty balanced strings up to length 10.`,
  },
  {
    id: "bk-h7-4-3",
    topic: "cnf-cyk",
    book: HMU,
    ref: "Exercise 7.4.3",
    prompt: r`Using the grammar of Example 7.34, $S \to AB \mid BC$, $A \to BA \mid a$, $B \to CC \mid b$, $C \to AB \mid a$, run CYK to decide whether each string is in $L(G)$: (a) ababa, (b) baaab, (c) aabab.`,
    solution: r`Row $j$ of each table holds the variables that derive the substrings of length $j$. The working shows which split produced each entry.

### (a)

${cyk("ababa")}

### (b)

${cyk("baaab")}

### (c)

${cyk("aabab")}`,
  },

  /* ───── pda-hmu ───── */
  {
    id: "bk-h6-2-1b",
    topic: "pda-hmu",
    book: HMU,
    ref: "Exercise 6.2.1(b)",
    prompt: r`Design a PDA for the strings of 0s and 1s in which no prefix has more 1s than 0s.`,
    solution: r`Keep one $X$ on the stack for every unmatched 0. A 1 must pop an $X$. If a 1 arrives with $Z_0$ on top, the prefix read so far has more 1s than 0s, and there is no move, so that string dies. Accept by final state, with the single state $q$ accepting: every input that survives is good.

${deltaTex(h621b)}

The PDA is deterministic. It was compared with the definition on all strings up to length 10.`,
  },
  {
    id: "bk-h6-3-1",
    topic: "pda-hmu",
    book: HMU,
    ref: "Exercise 6.3.1",
    prompt: r`Convert the grammar $S \to 0S1 \mid A$, $A \to 1A0 \mid S \mid \varepsilon$ to a PDA that accepts the same language by empty stack.`,
    solution: r`Use the one-state construction:

- The stack starts with $S$.
- For each variable $A$ and each rule $A \to \beta$: $\delta(q, \varepsilon, A) \ni (q, \beta)$.
- For each terminal $a$: $\delta(q, a, a) = \{(q, \varepsilon)\}$.

${deltaTex(h631)}

The PDA accepts by empty stack. Its language was compared with the grammar's on all strings up to length 8.`,
  },
  {
    id: "bk-h6-3-3",
    topic: "pda-hmu",
    book: HMU,
    ref: "Exercise 6.3.3",
    prompt: r`Convert to a CFG the PDA $P = (\{p, q\}, \{0, 1\}, \{X, Z_0\}, \delta, q, Z_0)$ with $\delta(q, 1, Z_0) = \{(q, XZ_0)\}$, $\delta(q, 1, X) = \{(q, XX)\}$, $\delta(q, 0, X) = \{(p, X)\}$, $\delta(q, \varepsilon, X) = \{(q, \varepsilon)\}$, $\delta(p, 1, X) = \{(p, \varepsilon)\}$, $\delta(p, 0, Z_0) = \{(q, Z_0)\}$ (acceptance by empty stack).`,
    solution: r`**Construction.** The variables are $S$ and $[rYs]$, meaning "from state $r$ the PDA can pop $Y$ and end in state $s$". The rules are:

- $S \to [qZ_0s]$ for each state $s$.
- A move $\delta(r, a, Y) \ni (r', Y_1 \cdots Y_k)$ gives
$$
[rYs_k] \to a\,[r'Y_1s_1][s_1Y_2s_2]\cdots[s_{k-1}Y_ks_k]
$$
for all choices of states $s_1, \dots, s_k$.
- A move that pops ($k = 0$) gives $[rYr'] \to a$.

The full grammar, written out by the construction:

${grammarTex(h633Cfg.full)}

**What it means.** No move ever pops $Z_0$: the only moves on $Z_0$ push on top of it or keep it. So the stack can never become empty, and $N(P) = \emptyset$. In the grammar, every $[\cdot\,Z_0\,\cdot]$ variable is non-generating, so $S$ is non-generating too, and removing useless symbols leaves nothing.

(The verifier checked that the trimmed grammar and the PDA agree on all strings up to length 8: both generate or accept nothing. This PDA also appears in Exercise 6.1.1, where it is read by final state. Under empty stack it accepts no string, and the answer above states that plainly rather than guessing another acceptance mode.)`,
  },
  {
    id: "bk-h6-3-5a",
    topic: "pda-hmu",
    book: HMU,
    ref: "Exercise 6.3.5(a)",
    prompt: r`Devise a PDA accepting $\{a^nb^mc^{2(n+m)} \mid n, m \ge 0\}$ by empty stack.`,
    solution: r`The states keep the order $a^*b^*c^*$: $q$ reads a's, $r$ reads b's, and $p$ reads c's. Each $a$ or $b$ pushes $XX$; each $c$ pops one $X$. When $Z_0$ is exposed, pop it, which empties the stack and accepts.

${deltaTex(h635a)}

The $\varepsilon$-moves on $Z_0$ from $q$ and $r$ accept the empty string and $c$-free inputs only when nothing was pushed. That is only $\varepsilon$ itself, which is in the language ($n = m = 0$).

An earlier draft let a, b and c all be read in one state, which wrongly accepted $bacccc$. The verifier caught it, and the separate states $q$ and $r$ fix it. The PDA was compared with the definition on all strings up to length 9.`,
  },
  {
    id: "bk-h6-4-2",
    topic: "pda-hmu",
    book: HMU,
    ref: "Exercise 6.4.2(a), (b)",
    prompt: r`Give DPDAs for $\{0^n1^m \mid n \le m\}$ and for $\{0^n1^m \mid n \ge m\}$.

*Note: In the copy of the book used here, the relation signs in parts (a) and (b) did not survive text extraction, so both directions are given.*`,
    solution: r`**$n \le m$.** Push $Y$ for the *first* 0 and $X$ for every later 0. Each 1 pops one symbol. Popping $Y$ means every 0 has been matched, so go to the accepting $f$, where extra 1s are free.

- Start $s$ is accepting, for $\varepsilon$.
- $s$ also reads 1s directly when $n = 0$.

${deltaTex(h642a)}

Accepting states: $s, f$. The marker $Y$ is what makes this deterministic. Without it, the machine would need an $\varepsilon$-move on $Z_0$ in $p$, which would clash with the move $p \xrightarrow{1, Z_0}$.

**$n \ge m$.** Push one $X$ per 0, pop one per 1, and accept in every state. A 1 that meets $Z_0$ has no move, so that string dies.

${deltaTex(h642b)}

Accepting states: $s, q, p$.

Both machines were checked to be deterministic and to match their definitions on all strings up to length 10. A first draft of the $n \le m$ machine accepted $0$ and $00$; the verifier caught that.`,
  },

  /* ───── tm-basics ───── */
  {
    id: "bk-h8-2-1",
    topic: "tm-basics",
    book: HMU,
    ref: "Exercise 8.2.1",
    prompt: r`Show the IDs of the Turing machine of Fig. 8.9 (the $0^n1^n$ machine) on inputs (a) 00, (b) 000111, (c) 00111.`,
    solution: r`Fig. 8.9's moves:

- $q_0$ marks a 0 as $X$.
- $q_1$ runs right to the first 1 and marks it $Y$.
- $q_2$ runs back to the $X$.
- $q_3$ checks that only $Y$s remain, and $q_4$ accepts.

${tmTableMd(h89)}

### (a) 00

${tmTraceTex(h89, "00")}

The machine halts without accepting: $q_1$ reaches a blank with no 1 to match.

### (b) 000111

${tmTraceTex(h89, "000111")}

### (c) 00111

${tmTraceTex(h89, "00111")}

The machine halts without accepting: $q_3$ finds an unmatched 1.`,
  },
  {
    id: "bk-h8-2-2c",
    topic: "tm-basics",
    book: HMU,
    ref: "Exercise 8.2.2(c)",
    prompt: r`Design a Turing machine for $\{ww^R \mid w \in \{0, 1\}^*\}$.`,
    solution: r`Repeatedly match the outermost pair of symbols:

1. In $q_0$, erase the leftmost symbol $c$ and carry it right in state $r_c$.
2. At the blank, step left ($t_c$). The last symbol must also be $c$: erase it and run back left ($q_b$).
3. At the blank on the left, return to $q_0$.
4. If $q_0$ sees a blank, everything matched: accept.

A mismatch, or a lone middle symbol (odd length), leaves the machine with no move, so it halts and rejects.

${tmTableMd(h822c, wwrName)}

${tmTraceTex(h822c, "0110", { stateTex: wwrName })}

The machine was run on every string up to length 10 and accepts exactly the even-length palindromes.`,
  },

  /* ───── tm-techniques ───── */
  {
    id: "bk-h8-3-2",
    topic: "tm-techniques",
    book: HMU,
    ref: "Exercise 8.3.2",
    prompt: r`"Shifting over": show how a TM can move the contents of every cell from the head position rightwards one cell to the right, then return to the original position, so that a new symbol can be stored there.`,
    solution: r`Store the symbol being moved in the finite control, as in "storage in the state".

1. At the head position, write the marker $X$ and remember the old symbol $c$ in state $h_c$. Move right.
2. In $h_c$ on a symbol $d$: write $c$, remember $d$ (go to $h_d$), and move right.
3. In $h_c$ on a blank: write $c$, which was the last symbol, and turn left in $q_h$.
4. $q_h$ moves left to the marker and stops there. The marked cell is the new free cell, ready to be overwritten.

For input alphabet $\{0, 1\}$ the machine below does this starting at the left end. The same states work from any head position.

${tmTableMd(h832, shiftName)}

${tmTraceTex(h832, "011", { stateTex: shiftName })}

The machine was checked on every string up to length 8: it always ends with tape $Xw$ and the head on $X$.`,
  },

  /* ───── tm-variants ───── */
  {
    id: "bk-h8-4-2",
    topic: "tm-variants",
    book: HMU,
    ref: "Exercise 8.4.2",
    prompt: r`A nondeterministic TM has states $q_0, q_1, q_2$ (accepting $q_2$) and moves $\delta(q_0, 0) = \{(q_0, 1, R)\}$, $\delta(q_0, 1) = \{(q_1, 0, R)\}$, $\delta(q_1, 0) = \{(q_1, 0, R), (q_0, 0, L)\}$, $\delta(q_1, 1) = \{(q_1, 1, R), (q_0, 1, L)\}$, $\delta(q_1, B) = \{(q_2, B, R)\}$. Show the IDs reachable from the initial ID on input (a) 01, (b) 011.`,
    solution: r`Explore the tree of IDs level by level (breadth-first) and list each new ID once. An ID that repeats an earlier one adds nothing new.

### (a) 01

${ntmLevels("01")}

$q_2$ is reached, so 01 is accepted. No further IDs are reachable: $q_2$ has no moves.

### (b) 011

${ntmLevels("011")}

The IDs were generated by a program that applies every move to every ID. Trailing blanks are dropped, except the one the head has just passed.`,
  },
  {
    id: "bk-h8-4-6",
    topic: "tm-variants",
    book: HMU,
    ref: "Exercise 8.4.6",
    prompt: r`Design a 2-tape TM for the strings of 0s and 1s with equally many of each. Tape 1 holds the input and is read left to right; tape 2 stores the excess of 0s over 1s (or of 1s over 0s) in the part read so far.`,
    solution: r`Tape 2 holds a run of identical marks, $a$ for excess 0s or $b$ for excess 1s, and its head sits on the rightmost mark (on the blank when the run is empty). The states record nothing more than "scanning". A move reads the pair (tape-1 symbol, tape-2 symbol):

| Tape 1 | Tape 2 | Action |
|---|---|---|
| 0 | $B$ or $a$ | head 2 moves right and writes $a$ (one more excess 0) |
| 0 | $b$ | erase the $b$, head 2 moves left (a 0 cancels an excess 1) |
| 1 | $B$ or $b$ | head 2 moves right and writes $b$ |
| 1 | $a$ | erase the $a$, head 2 moves left |
| $B$ | $B$ | accept: no excess |
| $B$ | $a$ or $b$ | reject |

Head 1 always moves right. To keep "head 2 on the rightmost mark" exact, a push is done as "move right, then write", using one helper state. Equally, tape 2 can use a left-end marker so that an empty run is easy to recognise.

*Not machine-checked:* the site's simulator runs single-tape machines only, so this design was traced by hand on 0110 and 0101 (accepted) and on 001 (rejected).`,
  },

  /* ───── undecidability ───── */
  {
    id: "bk-h9-1-1",
    topic: "undecidability",
    book: HMU,
    ref: "Exercise 9.1.1",
    prompt: r`In the enumeration of binary strings, which strings are $w_{37}$ and $w_{100}$?`,
    solution: r`$w_i$ is the string $w$ such that $1w$ is the binary form of $i$.

- $37 = 100101_2$, so $w_{37} = 00101$.
- $100 = 1100100_2$, so $w_{100} = 100100$.

(Checked with the site's enumeration code.)`,
  },
  {
    id: "bk-h9-3-6a",
    topic: "undecidability",
    book: HMU,
    ref: "Exercise 9.3.6(a)",
    prompt: r`Show that it is decidable whether a TM $M$, started on a blank tape, ever writes a nonblank symbol.`,
    solution: r`Let $M$ have $m$ states. Simulate $M$ on a blank tape for at most $m$ moves.

- If it writes a nonblank symbol within those moves, answer **yes**.
- If it halts first without writing one, answer **no**.
- Otherwise answer **no**.

**Why $m$ moves are enough.** As long as $M$ has written only blanks, the tape is entirely blank. So what $M$ does next depends only on its current state: the head position does not matter on a uniform tape. In $m$ moves $M$ passes through $m + 1$ states, so some state repeats. From the repeat on, $M$ goes through the same cycle of states forever, and it reads only blanks and writes only blanks. If no nonblank was written in the first $m$ moves, none ever will be.

The simulation always stops after at most $m$ moves, so this is a decider.`,
  },
  {
    id: "bk-h9-4-1",
    topic: "undecidability",
    book: HMU,
    ref: "Exercise 9.4.1",
    prompt: r`Does each PCP instance have a solution? (a) $A = (01, 001, 10)$, $B = (011, 10, 00)$. (b) $A = (01, 001, 10)$, $B = (011, 01, 00)$.`,
    solution: r`**(a) No solution.**

- **First index.** Pair 2 ($001$ vs $10$) and pair 3 ($10$ vs $00$) disagree in the first symbol, so a solution must start with pair 1: $A = 01$, $B = 011$. $B$ is ahead by $1$.
- **Next.** The next $A$-string must begin with 1, so only pair 3 fits: $A = 0110$, $B = 01100$. $B$ is ahead by $0$.
- **Next.**
  - Pair 2 gives $A = 0110001$ and $B = 0110010$, which disagree in the 6th symbol.
  - Pair 1 gives $A = 011001$ and $B = 01100011$. Now $B$ is ahead by $11$, and no $A$-string begins with $11$.
  - Pair 3 gives $A = 011010$ against $B = 0110000$, which disagree.

Every branch dies, so no solution exists. A program that extends every consistent sequence confirmed that the tree of possibilities dies out.

**(b) Solution $1, 3, 2$.**
$$
A: 01 \cdot 10 \cdot 001 = 0110001, \qquad B: 011 \cdot 00 \cdot 01 = 0110001.
$$`,
  },

  /* ───── complexity ───── */
  {
    id: "bk-h10-1-6",
    topic: "complexity",
    book: HMU,
    ref: "Exercise 10.1.6(b), (c)",
    prompt: r`Show that $\mathcal{P}$ is closed under (b) union and (c) concatenation.`,
    solution: r`Let $L_1$ and $L_2$ be decided by TMs $M_1$ and $M_2$ in time $p_1(n)$ and $p_2(n)$, both polynomials.

**(b) Union.** On input $w$, run $M_1$; if it accepts, accept. Otherwise run $M_2$ and give its answer. The time is $O(p_1(n) + p_2(n))$, a polynomial, so $L_1 \cup L_2 \in \mathcal{P}$. Both machines always halt, so running them one after the other is safe.

**(c) Concatenation.** On input $w = a_1 \cdots a_n$, for each split point $k = 0, 1, \dots, n$, run $M_1$ on $a_1 \cdots a_k$ and $M_2$ on $a_{k+1} \cdots a_n$. Accept if some split has both accepting. That is $n + 1$ splits, each costing at most $p_1(n) + p_2(n)$ plus $O(n)$ to copy the pieces. The total is $O\bigl(n\,(p_1(n) + p_2(n) + n)\bigr)$, still a polynomial, so $L_1L_2 \in \mathcal{P}$.`,
  },
  {
    id: "bk-h10-2-1",
    topic: "complexity",
    book: HMU,
    ref: "Exercise 10.2.1",
    prompt: r`How many satisfying truth assignments does each expression have? Which are in SAT? (a) $x \land (y \lor \lnot x) \land (z \lor \lnot y)$. (b) $(x \lor y) \land \bigl(\lnot(x \lor z) \lor (\lnot z \land \lnot y)\bigr)$.`,
    solution: r`**(a) One.** $x$ must be true. Then $y \lor \lnot x$ forces $y$ true, and $z \lor \lnot y$ forces $z$ true. The only satisfying assignment is $x = y = z = 1$, so the expression is in SAT.

**(b) Two.** The second conjunct needs one of two things.

- $\lnot(x \lor z)$, that is, $x = z = 0$. Then $x \lor y$ needs $y = 1$, giving $(x, y, z) = (0, 1, 0)$.
- $\lnot z \land \lnot y$, that is, $y = z = 0$. Then $x \lor y$ needs $x = 1$, giving $(1, 0, 0)$.

The two cases share no assignment, so there are exactly 2. The expression is in SAT.

(Both counts were checked over all 8 assignments.)`,
  },
  {
    id: "bk-h10-4-1",
    topic: "complexity",
    book: HMU,
    ref: "Exercise 10.4.1(b), (c)",
    prompt: r`A $k$-clique is a set of $k$ nodes with an edge between every two of them; CLIQUE asks whether a graph $G$ has a $k$-clique. (b) How many edges does a $k$-clique have? (c) Prove that CLIQUE is NP-complete by reducing node cover to it.

*Note: Part (a) asks about the graph in the book's Fig. 10.1, which is not reproduced here.*`,
    solution: r`**(b)** Every pair of the $k$ nodes is joined, so there are $\binom{k}{2} = \dfrac{k(k-1)}{2}$ edges.

**(c)**

*CLIQUE is in NP.* Guess $k$ nodes. Then check all $\binom{k}{2}$ pairs for an edge, which takes polynomial time.

*Reduction from node cover.* Given $(G, k)$ with $G = (V, E)$ and $|V| = n$, output $(\overline{G}, n - k)$. Here $\overline{G}$ is the complement graph: it has an edge between $u \ne v$ exactly when $G$ does not. Building $\overline{G}$ takes $O(n^2)$ time.

*Correctness.* For $C \subseteq V$, the following are equivalent:

- $C$ is a node cover of $G$.
- Every edge of $G$ has an end in $C$.
- No edge of $G$ joins two nodes of $V - C$.
- Every two nodes of $V - C$ are joined in $\overline{G}$.
- $V - C$ is a clique of $\overline{G}$.

So $G$ has a node cover of size $k$ iff $\overline{G}$ has a clique of size $n - k$. Node cover is NP-complete, so CLIQUE is NP-hard, and with the first part it is NP-complete.

*Not machine-checked:* this is a proof answer.`,
  },
]

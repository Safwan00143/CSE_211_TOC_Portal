/* Worked solutions for the 12-batch (2013-2014) paper, keyed by part ("1a", "5c", "8c"). */
import { closureTableMd, faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { derivation } from "@/lib/derivations"
import { b12abc, b12evenAB, b12expr, b12exprPda, b12q7a, b12q7aNoEps, b12tm010 } from "../machines/b12"
import { b13Solutions } from "./b13-solutions"
import { b15Solutions } from "./b15-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const tmName = (q: string) => (q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b12Solutions: Record<string, string> = {
  "1a": r`**Construction (HMU, Atif Sir's form).** For a CFG $G=(V,T,P,S)$ build a one-state PDA that accepts by empty stack:
$$
P=(\{q\},T,V\cup T,\delta,q,S),
$$
with start symbol $S$ (here $E$) on the stack, and

- for each variable $A$: $\delta(q,\varepsilon,A)=\{(q,\beta) \mid A\to\beta \text{ is a production}\}$ (replace $A$ on top by one of its bodies);
- for each terminal $a$: $\delta(q,a,a)=\{(q,\varepsilon)\}$ (match the input with the top and pop).

The PDA simulates **leftmost derivations**: the stack always holds the part of the current sentential form that is not yet matched.

**For this grammar** (× and / are terminals):

| Top | Moves |
|---|---|
| $E$ | $\delta(q,\varepsilon,E)=\{(q,E{+}T),\ (q,T)\}$ |
| $T$ | $\delta(q,\varepsilon,T)=\{(q,T{\times}F),\ (q,T/F),\ (q,F)\}$ |
| $F$ | $\delta(q,\varepsilon,F)=\{(q,(E)),\ (q,a)\}$ |
| terminal $x\in\{a,+,\times,/,(,)\}$ | $\delta(q,x,x)=\{(q,\varepsilon)\}$ |

${fig("b12-1a")}

**Trace on a+a** (accepting by empty stack):
${pdaTraceTex(pdaAcceptingTrace(b12exprPda, "a+a", (left) => left + 1)!)}

(The PDA was checked against the grammar on every string over $\{a,+,\times,/,(,)\}$ up to length 5.)

${derivation(b12expr, "a+a", "lm")}`,

  "1b": r`**Idea.** The language is a union ($i=j$ or $j=k$), so the PDA **guesses** at the start which equality to check.

- **Branch $i=j$:** push an X for each a, pop one per b, check the stack is back to Z, then read any c's.
- **Branch $j=k$:** read any a's without touching the stack, push a Y for each b, pop one per c, and check the stack is empty.

${fig("pda-ij-or-jk")}

Each branch accepts exactly its half of the union, and the PDA accepts if either branch does. (This PDA is checked against the language in the PDA note.)`,

  "1c": b13Solutions["7a"],

  "2a": r`**Working principle.** Repeatedly cross off one 0 of the first block (X), one 1 (Y) and one 0 of the last block (Z). When the first block is used up, check that only Y's and Z's remain.

1. $q_0$: at the leftmost unprocessed 0 of the first block: mark it X, go right ($q_1$). A blank here (empty input, $N=0$): accept.
2. $q_1$: skip 0s and Y's to the first 1: mark it Y ($q_2$).
3. $q_2$: skip 1s and Z's to the first 0 of the last block: mark it Z, turn left ($q_3$).
4. $q_3$: move left to the rightmost X, step right into $q_0$.
5. If $q_0$ sees Y, all first-block 0s are used: $q_4$ checks that only Y and Z follow, and accepts at the blank.

${tmTableMd(b12tm010, tmName)}

**Trace on 001100** ($N=2$):
${tmTraceTex(b12tm010, "001100", { stateTex: tmName })}

Any missing or extra symbol leaves the machine without a move (reject); each round crosses off three symbols, so it always halts. (Checked on every binary string up to length 10.)`,

  "2b": r`A standard TM has no built-in signal for the left end. In Sipser's model, a move left from the leftmost cell leaves the head where it is; in HMU's, the tape is infinite in both directions. Common techniques:

1. **Mark the first cell.** At the very start, shift the input one cell right and write a special symbol (say ⊢) in the first cell; or overwrite the first input symbol $a$ with a marked copy $\hat a$ (a second track). The machine knows it is at the left end whenever it reads the marker, and never moves left from it.
2. **Detect a failed left move** (Sipser's model). Write a special mark on the current cell, move left, and look: if the mark is still under the head, the head did not move, so it was at the left end; restore the symbol afterwards.
3. **For a two-way infinite tape**, the blank to the left of the input marks the left end of the *input*, which is usually what matters.

Technique 1 is the one used in practice, e.g. by the "return to the left end" loops of the machines above (they stop at the X or blank).`,

  "2c": r`Both proofs use the CFL pumping lemma with $s=uvxyz$, $|vxy|\le p$, $|vy|>0$, and pump down ($i=0$).

**(i) $L=\{0^n1^n0^n1^n\}$.** Take $s=0^p1^p0^p1^p$. The window $vxy$ has length at most $p$, so it lies within **at most two adjacent blocks**. Pumping down removes symbols from one or two adjacent blocks only, so at least two blocks keep length $p$ while at least one shrinks. (If $v$ or $y$ straddles a block boundary the string may not even keep the shape $0^*1^*0^*1^*$, which is also outside $L$.) In every case the four block lengths are no longer equal: $uxz\notin L$.

**(ii) $L=\{0^n\#0^{2n}\#0^{3n}\}$.** Take $s=0^p\#0^{2p}\#0^{3p}$.

- If $v$ or $y$ contains a #, pumping down deletes it: the result has fewer than two #'s, not in $L$.
- Otherwise $v$ and $y$ lie inside the 0-blocks, and since $|vxy|\le p$ they touch at most two **adjacent** blocks. Pumping down shrinks those blocks and leaves the third unchanged. The ratios $1:2:3$ can only survive if all three blocks shrink (by $k$, $2k$, $3k$), which is impossible. So $uxz\notin L$.

Hence neither language is context-free. (Both arguments are brute-force checked over every legal split for $p=1,2,3$.)`,

  "3a": r`**(i) Yes.** The blank is in the tape alphabet $\Gamma$, and $\delta$ may write any symbol of $\Gamma$, including the blank (for example to erase the input, as the monus machine does).

**(ii) No.** $\Gamma$ must contain the blank symbol, which is **not** in $\Sigma$ (otherwise the machine could not tell where the input ends). So $\Sigma\subsetneq\Gamma$: the tape alphabet always has at least one symbol more.

**(iii) Yes.** In Sipser's model, moving left from the leftmost cell leaves the head in place, so the head can be in the same cell in two successive steps. (In models with a "stay" move S it is also possible directly.) For a move L or R away from the left end, the head must move.

**(iv) No, not in Sipser's definition.** A TM needs an accept state and a **distinct** reject state ($q_{accept}\ne q_{reject}$), so it has at least two states; and the start state cannot be both of them, since the machine must be able to compute before halting. (With HMU's definition, which only needs a start state and a set of accepting states, a single-state TM is allowed; it accepts either everything or nothing.)`,

  "3b": r`**$A$ is decidable.** $A$ is either $\{0\}$ or $\{1\}$; we just do not know which.

- $M_0$ = "accept if the input is 0, otherwise reject" decides $\{0\}$.
- $M_1$ = "accept if the input is 1, otherwise reject" decides $\{1\}$.

Both always halt. Exactly one of them decides $A$ (whichever matches the true answer about Mars). A language is decidable if **some** TM decides it; we do not have to know which TM it is. So $A$ is decidable.

The point: decidability is about the **existence** of an algorithm, not about our knowledge. Every finite language is decidable.`,

  "3c": b13Solutions["7c"],

  "4a": r`**Claim.** $A_{DFA}=\{\langle B,w\rangle \mid B$ is a DFA that accepts $w\}$ is decidable.

**Decider** $M$ = "On input $\langle B,w\rangle$:

1. Check that the input is a valid encoding of a DFA $B=(Q,\Sigma,\delta,q_0,F)$ and a string $w$ over $\Sigma$; if not, reject.
2. Simulate $B$ on $w$: keep the current state on the tape (initially $q_0$); for each symbol $w_i$, look up $\delta(\text{current},w_i)$ in the encoded table and update the current state.
3. When all of $w$ has been read, **accept** if the current state is in $F$, otherwise **reject**."

**Correctness.** The simulation follows $B$'s unique run on $w$ exactly, so $M$ accepts iff $B$ accepts $w$.

**$M$ always halts.** Step 2 performs exactly $|w|$ table lookups, each taking a finite (polynomial) number of steps; steps 1 and 3 are finite. So $M$ is a decider, and $A_{DFA}$ is decidable. (The same idea works for NFAs, after converting them to DFAs.)`,

  "4b": r`**Claim.** $\mathbb Q$ is countable: its elements can be listed $r_1,r_2,r_3,\dots$ so that every rational number appears.

**Proof.** First the positive rationals. Arrange all fractions $\frac pq$ ($p,q\ge1$) in an infinite table, row $p$, column $q$:

| | $q=1$ | $q=2$ | $q=3$ | $q=4$ | … |
|---|---|---|---|---|---|
| $p=1$ | 1/1 | 1/2 | 1/3 | 1/4 | |
| $p=2$ | 2/1 | 2/2 | 2/3 | 2/4 | |
| $p=3$ | 3/1 | 3/2 | 3/3 | 3/4 | |
| $p=4$ | 4/1 | 4/2 | 4/3 | 4/4 | |

List the table along the anti-diagonals $p+q=2,3,4,\dots$: 1/1; 2/1, 1/2; 3/1, 2/2, 1/3; 4/1, 3/2, 2/3, 1/4; … Each diagonal is finite, so every fraction is reached after finitely many steps. **Skip** fractions not in lowest terms (2/2, 2/4, …) so each number appears once: $1, 2, \tfrac12, 3, \tfrac13, 4, \tfrac32, \tfrac23, \tfrac14, \dots$

This gives a one-to-one correspondence $f:\mathbb N\to\mathbb Q^+$. For all of $\mathbb Q$, interleave: $0, r_1, -r_1, r_2, -r_2, \dots$, which lists every rational exactly once. Hence $\mathbb Q$ is countable. $\blacksquare$

(Contrast: the reals, or infinite binary sequences, are **not** countable, by the diagonal argument.)`,

  "4c": b15Solutions["8a"],

  "5a": r`**Claim.** If $L_1$, $L_2$ are regular, so is $L_1-L_2=\{w \mid w\in L_1,\ w\notin L_2\}$.

**Proof (product construction).** Let $M_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$ and $M_2=(Q_2,\Sigma,\delta_2,q_2,F_2)$ be **complete** DFAs for $L_1$, $L_2$. Build $M=(Q_1\times Q_2,\Sigma,\delta,(q_1,q_2),F)$ with
$$
\delta\big((r_1,r_2),a\big)=\big(\delta_1(r_1,a),\delta_2(r_2,a)\big),\qquad F=\{(r_1,r_2) \mid r_1\in F_1 \text{ and } r_2\notin F_2\}.
$$
$M$ runs both DFAs in parallel; after reading $w$ it is in $(\hat\delta_1(q_1,w),\hat\delta_2(q_2,w))$. It accepts iff $M_1$ accepts and $M_2$ rejects, i.e. iff $w\in L_1-L_2$. So $L_1-L_2$ is regular. $\blacksquare$

**Alternative.** $L_1-L_2=L_1\cap\overline{L_2}$. Regular languages are closed under complement (swap the accepting states of a complete DFA) and under intersection (product construction with "and"), so the difference is regular too.`,

  "5b": r`Take $R_1=a$ and $R_2=b$.

- $(R_1\cup R_2)^*=(a\cup b)^*$: **all** strings over $\{a,b\}$, including ab.
- $R_1^*\cup R_2^*=a^*\cup b^*$: strings of only a's or only b's. ab is **not** in it.

So $ab\in(R_1\cup R_2)^*$ but $ab\notin R_1^*\cup R_2^*$, and the two expressions are not equal. (In general $R_1^*\cup R_2^*\subseteq(R_1\cup R_2)^*$, but the left side cannot mix pieces from $R_1$ and $R_2$.) (Checked by machine.)`,

  "5c": r`**Idea.** Two things to track: whether we are still in the a's or already in the b's (an a after a b is fatal), and the parity of the length so far.

| State | Meaning |
|---|---|
| $a_e$ / $a_o$ | only a's so far; length even / odd |
| $b_e$ / $b_o$ | some b's read; length even / odd |
| $d$ | an a after a b (dead) |

Accepting: $a_e$ and $b_e$ (total length $p+q$ even). $\varepsilon$ ($p=q=0$) is accepted.

${fig("b12-5c")}

${faTableMd(b12evenAB)}

${faRunTex(b12evenAB, "aabb")}
${faRunTex(b12evenAB, "aab")}
${faRunTex(b12evenAB, "aba")}

(Checked against the definition on every string up to length 10.)`,

  "6a": b13Solutions["4b"],

  "6b": r`1. Assume $L$ (balanced parentheses) is regular, with pumping length $p$.
2. Choose $s={(}^p{)}^p\in L$, $|s|=2p\ge p$.
3. Any split $s=xyz$ with $|xy|\le p$, $|y|>0$ has $y={(}^k$ with $1\le k\le p$ (the first $p$ symbols are all "(").
4. Pump down: $xz={(}^{p-k}{)}^p$ has more ")" than "(": not balanced, so $xz\notin L$.
5. Contradiction; $L$ is not regular. $\blacksquare$

(Brute-force checked over every legal split for small $p$.)`,

  "6c": r`From the figure: $q_0$ is the start and the only accepting state; $q_0\xrightarrow{a}q_1$; $q_1\xrightarrow{b}q_0$, $q_1\xrightarrow{a}q_2$; $q_2$ loops on a; $q_2\xrightarrow{b}q_0$.

**Every return to $q_0$** reads a, then either b directly ($q_1\to q_0$) or one or more further a's and then b ($q_1\to q_2\to\cdots\to q_0$). So one round trip reads $ab$ or $aa^+b$, i.e. $a^+b=aa^*b$. Accepting runs are any number of round trips:
$$
(aa^*b)^* \quad(=(a^+b)^*).
$$
The same result comes from state elimination: removing $q_2$ gives $q_1\xrightarrow{aa^*b}q_0$, combined with $q_1\xrightarrow{b}q_0$ as $q_1\xrightarrow{b+aa^*b}q_0$; removing $q_1$ leaves the loop $a(b+aa^*b)=aa^*b$ on $q_0$.

(Checked: the NFA and the expression agree on every string up to length 10.)`,

  "7a": r`**Method.** For each state $q$, compute the ε-closure $E(q)$. The new NFA has the same states and start, and
$$
\delta'(q,a)=E\Big(\bigcup_{r\in E(q)}\delta(r,a)\Big),\qquad F'=\{q \mid E(q)\cap F\ne\emptyset\}.
$$

**ε-closures:**

${closureTableMd(b12q7a)}

**New transitions** (no ε-moves):

${faTableMd(b12q7aNoEps, { sets: true, label: sub })}

Accepting states: $q_1,q_2,q_3$ (their closures contain $q_2$). $q_0$ is not accepting ($E(q_0)=\{q_0,q_4\}$). Nothing enters $q_4$ any more, so it can be removed.

${fig("b12-7a")}

(The new NFA was checked against the original on every string up to length 9.)`,

  "7b": r`$L=a^*b^*c^*$: any a's, then any b's, then any c's.
$$
\begin{aligned}
S&\to aS\mid B\\
B&\to bB\mid C\\
C&\to cC\mid\varepsilon
\end{aligned}
$$
$S$ produces the a's, then hands over to $B$ for the b's, then to $C$ for the c's; the order is forced. (Checked on all strings up to length 7.)

Derivation of $ab^2c^3=abbccc$:
${derivation(b12abc, "abbccc", "lm")}

${fig("b12-7b")}`,

  "7c": r`$L=\{a^nb^{2n}c^{3n}\}$. Assume $L$ is context-free with pumping length $p$, and take $s=a^pb^{2p}c^{3p}$.

Let $s=uvxyz$ with $|vxy|\le p$, $|vy|>0$, and pump down ($i=0$).

- If $v$ or $y$ contains two kinds of symbols, pumping up would break the order $a^*b^*c^*$; pumping down still removes symbols from at most two adjacent blocks, as below.
- $vxy$ has length at most $p$, while the b-block has length $2p$, so $vxy$ touches **at most two adjacent blocks** (a and b, or b and c). Removing $v$ and $y$ shrinks one or two blocks and leaves the other one at its original length ($p$ a's, or $3p$ c's).
- The block lengths must stay in ratio $1:2:3$; with one block unchanged and another shrunk, they cannot. So $uxz\notin L$.

Hence $L$ is not context-free. (Brute-force checked for $p=1,2,3$.)`,

  "8a": r`**Product construction.** Build $M=\langle\Sigma,Q,q_0,\delta,F\rangle$ that runs $M_1$ and $M_2$ in parallel:

1. **States:** $Q=Q_1\times Q_2$, pairs $(r_1,r_2)$.
2. **Start:** $q_0=(q_0^1,q_0^2)$.
3. **Transitions:** $\delta\big((r_1,r_2),a\big)=\big(\delta_1(r_1,a),\delta_2(r_2,a)\big)$: each component moves as its own DFA would.
4. **Accepting:** $F=\{(r_1,r_2) \mid r_1\in F_1 \text{ or } r_2\in F_2\}=(F_1\times Q_2)\cup(Q_1\times F_2)$.

After reading $w$, $M$ is in $(\hat\delta_1(q_0^1,w),\hat\delta_2(q_0^2,w))$, so it accepts iff $M_1$ or $M_2$ accepts: $L(M)=L_1\cup L_2$. Both DFAs must be complete (add dead states first). In practice only the pairs reachable from $q_0$ need to be built. (Using "and" in step 4 gives $L_1\cap L_2$.) A worked example is in the 2022–23 paper, Q4(a).`,

  "8b": r`**Theorem.** Every NFA $N=(Q,\Sigma,\delta,q_0,F)$ has an equivalent DFA $D$.

**Construction (subset construction).** A DFA state records the **set** of NFA states $N$ could be in. Let $E(R)$ be the ε-closure of $R\subseteq Q$ (all states reachable from $R$ by ε-moves). Then $D=(Q',\Sigma,\delta',q_0',F')$ with

- $Q'=\mathcal P(Q)$, all subsets of $Q$;
- $q_0'=E(\{q_0\})$;
- $\delta'(R,a)=E\big(\bigcup_{r\in R}\delta(r,a)\big)$;
- $F'=\{R\subseteq Q \mid R\cap F\ne\emptyset\}$.

**Proof of correctness.** Claim: for every string $w$, $\hat\delta'(q_0',w)$ is exactly the set of states $N$ can be in after reading $w$. By induction on $|w|$:

- $w=\varepsilon$: $D$ is in $E(\{q_0\})$, exactly the states $N$ can reach without reading input.
- $w=xa$: by induction, after $x$ $D$ is in the set $R$ of states $N$ can be in. $N$'s possible states after $xa$ are those reachable from $R$ by reading $a$ and then following ε-moves, which is $\delta'(R,a)$.

$N$ accepts $w$ iff some state it can be in is accepting, iff $\hat\delta'(q_0',w)\cap F\ne\emptyset$, iff $D$ accepts $w$. So $L(D)=L(N)$. $\blacksquare$

$D$ has at most $2^{|Q|}$ states; usually only the subsets reachable from $q_0'$ are built.`,

  "8c": r`**Statement:** "Every subset of a regular language is regular." **False.**

**Counterexample.** $\Sigma^*=\{0,1\}^*$ is regular (DFA: one accepting state looping on 0 and 1). Its subset
$$
\{0^n1^n \mid n\ge0\}\subseteq\{0,1\}^*
$$
is **not** regular, by the pumping lemma: for $s=0^p1^p$, $|xy|\le p$ forces $y=0^k$, and $xy^2z=0^{p+k}1^p\notin L$.

So a subset of a regular language need not be regular. (Regularity is about the **structure** of a language, not its size: subsets can be more complicated than the whole.)`,
}

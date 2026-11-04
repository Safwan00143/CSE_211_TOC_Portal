/* Worked solutions for the 10-batch (2011-2012) paper, keyed by part ("1a", "5c", "8c"). */
import { pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { derivation } from "@/lib/derivations"
import { b10g4b, b10g8c, b10g8i, b10pda4b, b10q7, b10tmSub } from "../machines/b10"
import { b16three1 } from "../machines/b16"
import { after } from "./compose"
import { b11Solutions } from "./b11-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const tmName = (q: string) => (q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b10Solutions: Record<string, string> = {
  "1a": r`**Tape format.** $x$ and $y$ are written as $1^{x+1}$ and $1^{y+1}$ separated by a 0 (the question does not fix the separator): input $1^{x+1}01^{y+1}$, and the result must be $1^{x-y+1}$.

**Idea.** Pair off 1s: repeatedly erase the **last** 1 of $y$ and the **first** 1 of $x$. $y$ has $y+1$ ones; after $y$ such rounds, $y$ has one 1 left (it represents 0), and that last 1 is erased together with the separator **without** erasing anything from $x$. Then $x$ has $(x+1)-y$ ones left, which represents $x-y$. Since $x\ge y$, $x$ never runs out.

1. $q_0$: move right to the end; turn left ($q_1$).
2. $q_1$: erase the last 1 (of $y$) and move left ($q_2$).
3. $q_2$: if the symbol is the 0, $y$ is used up: erase the 0 and **accept**. If it is 1, $y$ still has 1s: go to $q_3$.
4. $q_3$: move left to the left end; $q_4$ erases the first 1 of $x$; back to $q_0$.

${fig("b10-1a")}

${tmTableMd(b10tmSub, tmName)}

**Trace on 111011** ($x=2$, $y=1$; result 11, i.e. 1):
${tmTraceTex(b10tmSub, "111011", { stateTex: tmName })}

(Checked on every valid input up to length 10: the tape always ends with exactly $x-y+1$ ones.)`,

  "1b": r`**Statement.** A TM whose tape has $k$ tracks (each cell holds one symbol per track, all read by the single head) is equivalent to an ordinary single-track TM.

**Proof idea.** A $k$-track tape is just a tape whose **symbols are $k$-tuples**. Let the track alphabets be $\Gamma_1,\dots,\Gamma_k$; the single-track machine $N$ uses the tape alphabet
$$
\Gamma=\Gamma_1\times\Gamma_2\times\cdots\times\Gamma_k
$$
(finite, since each $\Gamma_i$ is finite), with input symbols $a$ identified with $(a,B,\dots,B)$ and the blank with $(B,\dots,B)$.

A move of the $k$-track machine $M$, "in state $q$ reading $(X_1,\dots,X_k)$, write $(Y_1,\dots,Y_k)$, move $D$, go to $p$", is directly a move of $N$: $\delta_N(q,[X_1,\dots,X_k])=(p,[Y_1,\dots,Y_k],D)$. So $N$ makes exactly the same moves as $M$, step for step, and accepts the same language.

(Conversely a one-track TM is a $k$-track TM that ignores the other tracks.) So multiple tracks are a notational convenience, not extra power.`,

  "1c": r`**Encoding (HMU).** Fix a TM $M$ with states $q_1,\dots,q_r$ ($q_1$ the start state, $q_2$ the only accepting state), tape symbols $X_1,\dots,X_s$ ($X_1=0$, $X_2=1$, $X_3=B$) and directions $D_1=L$, $D_2=R$. Encode a move $\delta(q_i,X_j)=(q_k,X_l,D_m)$ as
$$
0^i\,1\,0^j\,1\,0^k\,1\,0^l\,1\,0^m
$$
(each part is at least one 0, so no "11" appears inside a move). The code of $M$ is the list of its move codes $C_1,\dots,C_n$ separated by 11:
$$
C_1\,11\,C_2\,11\cdots11\,C_n.
$$
For example, $\delta(q_1,0)=(q_2,1,R)$ is $0\,1\,0\,1\,00\,1\,00\,1\,00$.

**The number of TMs is countable.** Every TM has a code, which is a finite binary string, and different TMs (up to renaming states and symbols) have different codes. The set of finite binary strings is countable: list them in order of length, and within a length in numerical order ($\varepsilon,0,1,00,01,\dots$), so the $i$-th string is $w_i$. Mapping each TM to the position of its code in this list is one-to-one, so the TMs can be listed $M_1,M_2,\dots$: they form a countable set. (In contrast, the set of all languages is uncountable, so most languages have no TM.)`,

  "2a": r`**Idea.** Copy $w$ onto tape 2; when the c is reached, read the rest of tape 1 **forwards** while reading tape 2 **backwards**, comparing symbol by symbol.

States (each move is: symbols read on tapes 1, 2 → symbols written, head moves):

| State | Read (tape 1, tape 2) | Write | Moves | Next |
|---|---|---|---|---|
| $q_1$ (copy) | $(a,B)$ | $(a,a)$ | R, R | $q_1$ |
| $q_1$ | $(b,B)$ | $(b,b)$ | R, R | $q_1$ |
| $q_1$ | $(c,B)$ | $(c,B)$ | R, L | $q_2$ |
| $q_2$ (compare) | $(a,a)$ | $(a,a)$ | R, L | $q_2$ |
| $q_2$ | $(b,b)$ | $(b,b)$ | R, L | $q_2$ |
| $q_2$ | $(B,B)$ | $(B,B)$ | S, S | $q_{acc}$ |

In $q_2$ tape 1 moves right through $w^R$ while tape 2 moves left through the copy of $w$, so the two heads see $w^R$ and $w$ reversed, i.e. the same sequence. Any mismatch (including tape 1 ending before tape 2 or vice versa, or a second c) has no move, so the machine rejects. Both loops are linear, so the machine decides $L$ in $O(n)$ steps (a one-tape TM needs $O(n^2)$).

The state diagram has three states: $q_1$ with two loops ($a,B\to a,a,R,R$ and $b,B\to b,b,R,R$), an edge $q_1\xrightarrow{c,B\to c,B,R,L}q_2$, two loops on $q_2$ ($a,a\to a,a,R,L$ and $b,b\to b,b,R,L$), and $q_2\xrightarrow{B,B\to B,B,S,S}q_{acc}$.

(The site's simulator only runs one-tape machines, so this 2-tape machine is checked by the argument above, not by execution.)`,

  "2b": r`**(⇐)** A one-way infinite tape is a special case: a two-way machine can simulate it by first marking the cell to the left of the input and never moving left past the mark.

**(⇒) A two-way infinite tape can be folded into a one-way tape with two tracks.**

- Number the two-way tape's cells $\ldots,-2,-1,0,1,2,\ldots$ with the input starting at cell 0.
- The one-way machine $N$ uses a tape whose cell $i$ ($i\ge0$) has **two tracks**: the upper track holds cell $i$ of the two-way tape, and the lower track holds cell $-i-1$. Cell 0 of $N$ also carries an end marker on the lower track.
- $N$'s finite control stores $M$'s state and **which track** $M$'s head is on (upper = right half, lower = left half).
- On the upper track, $N$ moves as $M$ does. On the lower track, the directions are **reversed** ($M$ moving left goes further from cell 0, so $N$ moves right).
- When $M$ crosses between cell 0 and cell $-1$, $N$ sees the end marker and switches tracks without moving.

Each move of $M$ is one move of $N$ (plus a constant), and $N$ accepts iff $M$ does. Multiple tracks are themselves a single-track TM with a larger alphabet, so the two models recognise the same languages.`,

  "2c": after(b11Solutions["2a"], "**HALT is RE.**"),

  "3a": b11Solutions["3c"],

  "3b": r`**Claim.** If $L_1=L(M_1)$ and $L_2=L(M_2)$ are RE, then $L_1\cup L_2$ is RE.

**The catch.** Running $M_1$ on $w$ and then $M_2$ does **not** work: if $w\in L_2$ but $M_1$ loops on $w$, we never get to run $M_2$.

**Construction: run them in parallel.** $M$ = "On input $w$: for $k=1,2,3,\dots$: run $M_1$ on $w$ for $k$ steps, then $M_2$ on $w$ for $k$ steps. If either has accepted, **accept**."

(Equivalently: a 2-tape TM that alternates one step of $M_1$ on tape 1 with one step of $M_2$ on tape 2.)

- If $w\in L_1\cup L_2$, one of the machines accepts after some finite number $t$ of steps; at stage $k=t$ that is detected, so $M$ accepts.
- If $w\notin L_1\cup L_2$, neither machine ever accepts, so $M$ never accepts (it may run forever, which is allowed for a recogniser).

So $L(M)=L_1\cup L_2$, and the union is RE. $\blacksquare$ (For recursive languages the sequential method is fine, because both deciders always halt.)`,

  "3c": b11Solutions["4c"],

  "4a": b11Solutions["4a"],

  "4b": r`**One-state PDA (HMU construction, acceptance by empty stack).** $P=(\{q\},\{a,b\},\{S,T,X,a,b\},\delta,q,S)$:

| Top | Moves |
|---|---|
| $S$ | $\delta(q,\varepsilon,S)=\{(q,aTXb)\}$ |
| $T$ | $\delta(q,\varepsilon,T)=\{(q,XTS),\ (q,\varepsilon)\}$ |
| $X$ | $\delta(q,\varepsilon,X)=\{(q,a),\ (q,b)\}$ |
| $a$ | $\delta(q,a,a)=\{(q,\varepsilon)\}$ |
| $b$ | $\delta(q,b,b)=\{(q,\varepsilon)\}$ |

A variable on top is replaced by one of its bodies (leftmost first, since the body's first symbol goes on top); a terminal on top must match the input. The PDA accepts $w$ iff the stack can be emptied while reading $w$, i.e. iff $S\Rightarrow^*w$.

${fig("b10-4b")}

**Trace on aab** ($S\Rightarrow aTXb\Rightarrow aXb\Rightarrow aab$):
${pdaTraceTex(pdaAcceptingTrace(b10pda4b, "aab", (left) => left + 1)!)}

(Checked against the grammar on every string over $\{a,b\}$ up to length 7.)

${derivation(b10g4b, "aab", "lm")}`,

  "4c": r`**Decider** $M$ = "On input $\langle A,B,C\rangle$:

1. Check that $A$, $B$, $C$ are DFAs over the same alphabet; if not, reject.
2. Build a DFA $D$ for $L(A)\cup L(B)$ by the product construction (states are pairs; a pair accepts if either component does).
3. Build a DFA $E$ for the **symmetric difference** $L(C)\,\triangle\,L(D)=\big(L(C)\cap\overline{L(D)}\big)\cup\big(\overline{L(C)}\cap L(D)\big)$, again by product constructions and complementing (swapping accepting states).
4. Test whether $L(E)=\emptyset$: mark the start state; repeatedly mark every state with an incoming transition from a marked state; if no accepting state is marked, $L(E)$ is empty.
5. **Accept** if $L(E)=\emptyset$, otherwise **reject**."

**Correctness.** $L(C)=L(A)\cup L(B)$ iff the symmetric difference of $L(C)$ and $L(A)\cup L(B)$ is empty, iff $L(E)=\emptyset$.

**Always halts.** Each construction is finite (products of finite state sets), and the marking in step 4 stops after at most $|Q_E|$ rounds. So $L$ is decidable. (This is the "$EQ_{DFA}$ is decidable" argument applied to $C$ and $D$.)`,

  "5a": b11Solutions["8a"],

  "5b": b11Solutions["5c"],

  "5c": r`Count the symbols read, up to 5; a sixth symbol goes to a dead state.

${fig("b10-5c")}

States $l_0,\dots,l_5$ are accepting; $d$ is not. (Checked on every binary string up to length 8.)`,

  "6a": b11Solutions["6b"],

  "6b": r`**(i) $L_1=\{www\}$.** Assume $L_1$ is regular with pumping length $p$, and take $s=(0^p1)^3=0^p1\,0^p1\,0^p1\in L_1$. Since $|xy|\le p$, $y=0^k$ with $k\ge1$, inside the first block. Then $xz=0^{p-k}1\,0^p1\,0^p1$. A string of $L_1$ consists of three equal thirds; this string has its three 1s at positions $p-k+1$, $2p-k+2$, $3p-k+3$ of a string of length $3p-k+3$, so the gaps before the 1s are $p-k$, $p$, $p$: not equal, and $xz$ is not of the form $www$. Contradiction.

**(ii) $L_2=\{1^{n^2}\}$.** Take $s=1^{p^2}$; $y=1^k$ with $1\le k\le p$; then $p^2<|xy^2z|=p^2+k\le p^2+p<(p+1)^2$, not a square. Contradiction.

So neither language is regular. (Both brute-force checked for small $p$.)`,

  "7a": r`**Hand-built NFA.** Every block starts with 0 and the language is a star, so use one accepting start state $q_0$ and return to it after each block:

- $q_0\xrightarrow{0}x$: start a block.
- $x\xrightarrow{1}q_0$: the block was 01.
- $x\xrightarrow{0}y\xrightarrow{1}q_0$: the block was 001.
- $x\xrightarrow{1}z\xrightarrow{0}q_0$: the block was 010.

The nondeterminism: from $x$ on 1, the block may end (01) or continue (010).

${fig("b10-7a")}

(Checked against the regular expression on every binary string up to length 10. The full basic-principles construction gives an equivalent but much larger NFA.)`,

  "7b": r`**Subset construction** from $\{q_0\}$:

${subsetTableMd(b10q7)}

${fig("b10-7b")}

Accepting: the sets containing $q_0$: $\{q_0\}$, $\{q_0,z\}$, $\{q_0,x\}$. (The DFA was checked on every binary string up to length 10.)`,

  "7c": r`The automaton: start 1 (accepting), 3 accepting, 2 not; $1\xrightarrow{a,b}2$, $2\xrightarrow{a}2$, $2\xrightarrow{b}3$, $3\xrightarrow{a}1$, $3\xrightarrow{b}2$.

**Equations** ($L_q$ = strings leading from $q$ to acceptance; Arden's rule $X=AX+B\Rightarrow X=A^*B$):
$$
\begin{aligned}
L_2&=aL_2+bL_3 &&\Rightarrow\ L_2=a^*bL_3\\
L_3&=\varepsilon+aL_1+bL_2=\varepsilon+aL_1+ba^*bL_3 &&\Rightarrow\ L_3=(ba^*b)^*(\varepsilon+aL_1)\\
L_1&=\varepsilon+(a+b)L_2=\varepsilon+(a+b)a^*b(ba^*b)^*(\varepsilon+aL_1).
\end{aligned}
$$
Collecting the $L_1$ terms: $L_1=\big((a+b)a^*b(ba^*b)^*a\big)L_1+\big(\varepsilon+(a+b)a^*b(ba^*b)^*\big)$, so
$$
L_1=\big((a+b)a^*b(ba^*b)^*a\big)^*\big(\varepsilon+(a+b)a^*b(ba^*b)^*\big).
$$
The starred part is a round trip $1\to2\to3\to\cdots\to3\to1$; the final part ends in 1 (ε) or in 3.

(Checked against the automaton on every string up to length 10.)`,

  "8a": r`**Formal definition.** A context-free grammar is a 4-tuple $G=(V,\Sigma,R,S)$:

1. $V$: a finite set of **variables**;
2. $\Sigma$: a finite set of **terminals**, disjoint from $V$;
3. $R$: a finite set of **rules** $A\to w$ with $A\in V$ and $w\in(V\cup\Sigma)^*$;
4. $S\in V$: the **start variable**.

$L(G)=\{w\in\Sigma^* \mid S\Rightarrow^*w\}$.

**Ambiguous grammar.** $G$ is ambiguous if some string in $L(G)$ has two different parse trees (equivalently, two different leftmost derivations).

**Example.** $E\to E+E\mid E\times E\mid a$ is ambiguous: $a+a\times a$ has one tree with $+$ at the root, meaning $a+(a\times a)$, and one with $\times$ at the root, meaning $(a+a)\times a$:
$$
E\Rightarrow E+E\Rightarrow a+E\Rightarrow a+E\times E\Rightarrow a+a\times E\Rightarrow a+a\times a
$$
$$
E\Rightarrow E\times E\Rightarrow E+E\times E\Rightarrow a+E\times E\Rightarrow a+a\times E\Rightarrow a+a\times a
$$`,

  "8b": r`**(i) $\{0^n1^n\}\cup\{1^n0^n\}$:**
$$
S\to A\mid B,\qquad A\to0A1\mid\varepsilon,\qquad B\to1B0\mid\varepsilon.
$$
$A$ generates $0^n1^n$ and $B$ generates $1^n0^n$ (both include $\varepsilon$). (Checked up to length 10.)

${derivation(b10g8i, "1100", "lm")}

**(ii) At least three 1s:** $S\to A1A1A1A$, $A\to0A\mid1A\mid\varepsilon$.

${derivation(b16three1, "10101", "lm")}`,

  "8c": r`Using the rules exactly as printed (including $T\to E*F$), a leftmost derivation of $((a+b)*b)$:

${derivation(b10g8c, "((a+b)*b)", "lm")}

${fig("b10-8c")}

With the usual rule $T\to T*F$ instead, the derivation is the same except that the step $T\Rightarrow E*F$ becomes $T\Rightarrow T*F\Rightarrow F*F\Rightarrow(E)*F$, i.e. the parenthesised sum is reached through $T\Rightarrow F\Rightarrow(E)$ rather than $E\Rightarrow T\Rightarrow F\Rightarrow(E)$.`,
}

/* Worked solutions for the 9-batch (2010-2011) paper, keyed by part ("1", "10a", "13c"). */
import { faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTraceTex } from "@/lib/automata"
import { grammarTex } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import { b09g7, b09g9a, b09g9b, b09g9c, b09g9d, b09given, b09mod3is1, b09no110, b09pal, b09palCfg, b09pda12d, b09q3, b09tmPow } from "../machines/b09"
import { after } from "./compose"
import { b12Solutions } from "./b12-solutions"
import { b13Solutions } from "./b13-solutions"
import { b22Solutions } from "./b22-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const pdaName = (q: string) => ({ qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" })[q] ?? sub(q)
const tmName = (q: string) => (q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b09Solutions: Record<string, string> = {
  "1": r`**Yes: the DFA from the subset construction accepts exactly the strings the NFA accepts, and rejects exactly the others.**

${after(b12Solutions["8b"], "**Construction (subset construction).**")}

**Consequence.** The DFA and the NFA accept **and reject** the same strings, so they recognise the same language. The price is size: the DFA may have up to $2^{|Q|}$ states. (Lazy evaluation builds only the subsets reachable from the start, which is usually far fewer.)`,

  "2": r`**Idea.** Count a's modulo 3; b's change nothing. $q_i$: "number of a's so far $\equiv i\pmod3$". Accept in $q_1$.

${fig("b09-2")}

**Mathematical representation.** $M=(Q,\Sigma,\delta,q_0,F)$ with $Q=\{q_0,q_1,q_2\}$, $\Sigma=\{a,b\}$, start $q_0$, $F=\{q_1\}$, and

${faTableMd(b09mod3is1, { label: sub })}

i.e. $\delta(q_i,a)=q_{(i+1)\bmod3}$ and $\delta(q_i,b)=q_i$.

${faRunTex(b09mod3is1, "abaaab", { name: sub })}

(Checked on every string up to length 10.)`,

  "3": r`**Lazy evaluation:** start from $\{p\}$ and compute only the subsets that are actually reached.

${subsetTableMd(b09q3)}

${fig("b09-3")}

Only 4 of the 32 subsets are reachable. Accepting: the sets containing $s$ or $t$. The DFA accepts exactly the strings whose **second-to-last symbol is 0** (the NFA guesses that a 0 is second-to-last by moving to $q$, then reads one more symbol into $s$ or $t$). (Checked by machine on every binary string up to length 10.)`,

  "4": r`**DFA.** Track how many 1s end the input so far (0, 1, or "2 or more"). After two or more 1s, a 0 would complete 110, so it goes to a dead state.

${fig("b09-4")}

${faTableMd(b09no110)}

**Regular expression.** Once 11 has appeared, no 0 may ever follow. So the string is a part with no 11 that does not end in 1, i.e. every 1 is followed by a 0, which is $(0+10)^*$, followed by any run of 1s:
$$
(0+10)^*1^*.
$$
(Both the DFA and the expression were checked against "no 110" on every binary string up to length 11.)`,

  "5": b13Solutions["4b"],

  "6": r`**$L=\{0^n1^m0^n\}$ is not regular.**

1. Assume $L$ is regular with pumping length $p$, and take $s=0^p10^p\in L$ ($m=1$).
2. Any split with $|xy|\le p$ has $y=0^k$, $1\le k\le p$, in the first block.
3. Pump down: $xz=0^{p-k}10^p$ has unequal outer blocks, so $xz\notin L$.
4. Contradiction; $L$ is not regular. (Brute-force checked for small $p$.)`,

  "7": r`**What the rules do.** $S\to AA$ starts with two $A$'s. $A\to bA$ and $A\to Ab$ add b's to the left or right of an $A$; $A\to a$ turns an $A$ into an a; $A\to AAA$ creates two more $A$'s (so the number of a's stays even). $L(G)$ is the strings with an even, nonzero number of a's (checked by machine up to length 7).

**A derivation of $b^mab^nab^p$** ($m,n,p>0$). Use the first $A$ for $b^ma$ and the second for $b^nab^p$:
$$
\begin{aligned}
S&\Rightarrow AA\\
&\Rightarrow bA\,A\Rightarrow\cdots\Rightarrow b^mA\,A &&(m \text{ times } A\to bA)\\
&\Rightarrow b^ma\,A &&(A\to a)\\
&\Rightarrow b^ma\,bA\Rightarrow\cdots\Rightarrow b^mab^nA &&(n \text{ times } A\to bA)\\
&\Rightarrow b^mab^nAb\Rightarrow\cdots\Rightarrow b^mab^nAb^p &&(p \text{ times } A\to Ab)\\
&\Rightarrow b^mab^nab^p &&(A\to a)
\end{aligned}
$$
That is $1+m+1+n+p+1$ steps. For example $m=n=p=1$:
${derivation(b09g7, "babab", "lm")}`,

  "8": r`**Rules for regular expressions over $\{a,b\}$** (Sipser):

- basic: $a$, $b$, $\emptyset$ are regular expressions (ε can be written $\emptyset^*$);
- inductive: if $R_1$, $R_2$ are regular expressions, so are $(R_1\cup R_2)$, $(R_1R_2)$ and $(R_1^*)$.

**Grammar** (one rule for each case; $R$ is the start variable, and $\cup$, $*$, (, ) are terminals):
$$
R\to a\mid b\mid\emptyset\mid(R\cup R)\mid(RR)\mid(R^*)
$$
Each derivation step applies one formation rule, so the grammar generates exactly the fully parenthesised regular expressions. For example
$$
R\Rightarrow(R\cup R)\Rightarrow(a\cup R)\Rightarrow(a\cup(R^*))\Rightarrow(a\cup(b^*)).
$$

**If parentheses may be omitted** (with the usual precedence $*$ > concatenation > $\cup$), use one variable per level, as for arithmetic expressions:
$$
\begin{aligned}
E&\to E\cup T\mid T\\
T&\to TF\mid F\\
F&\to F^*\mid(E)\mid a\mid b\mid\emptyset
\end{aligned}
$$`,

  "9": r`**(a) $0^n1^m0^m1^n$:** match the outer 0s with 1s, then the inner 1s with 0s.
${grammarTex(b09g9a)}

**(b) $a^nb^mc^k$, $n=m+k$:** each a is matched either with a c (outer) or with a b (inner).
${grammarTex(b09g9b)}

**(c) $a^nb^mc^k$, $n=2m+3k$:** each c brings three a's, each b two.
${grammarTex(b09g9c)}

**(d)** As printed, $0\ge n\ge m\ge2n$ forces $n=m=0$, so $L_4=\{\varepsilon\}$, generated by $S\to\varepsilon$. The intended language is surely $\{a^nb^m \mid 0\le n\le m\le2n\}$: each a is matched by one or two b's:
${grammarTex(b09g9d)}

(All four grammars were checked against their definitions on every string up to length 8–10.)

${derivation(b09g9c, "aaaaabc", "lm")}`,

  "10a": after(b13Solutions["7b"], "**Proof (Cantor"),

  "10b": r`**Claim.** Some languages over $\{0,1\}$ are not Turing-recognisable.

**Proof.**

1. **The TMs are countable.** Each TM has an encoding $\langle M\rangle$, a finite string over a fixed alphabet. The finite strings can be listed (by length, then alphabetically), so the TMs can be listed $M_1,M_2,\dots$ (skip strings that do not encode a TM).
2. **The languages are uncountable.** List $\Sigma^*=\{s_1,s_2,s_3,\dots\}$. Each language $A\subseteq\Sigma^*$ has a **characteristic sequence**: the infinite binary sequence whose $i$-th bit is 1 iff $s_i\in A$. For example, if $\Sigma^*=\{\varepsilon,0,1,00,\dots\}$, the language $\{0,00\}$ has sequence $0\,1\,0\,1\,0\,0\ldots$. This is a one-to-one correspondence between languages and infinite binary sequences, which are uncountable by part (a).
3. Each TM recognises one language. Since there are only countably many TMs but uncountably many languages, some language is recognised by **no** TM. $\blacksquare$`,

  "10c": r`**Theorem.** $L$ is decidable $\iff$ both $L$ and $\overline L$ are Turing-recognisable.

**(⇒)** If $M$ decides $L$, then $M$ recognises $L$. Swapping $M$'s accept and reject states gives a TM that always halts and accepts exactly $\overline L$, so $\overline L$ is recognisable (in fact decidable).

**(⇐)** Let $M_1$ recognise $L$ and $M_2$ recognise $\overline L$. Build $M$ = "On input $w$: run $M_1$ and $M_2$ on $w$ in parallel, alternating one step of each. If $M_1$ accepts, **accept**; if $M_2$ accepts, **reject**."

Every $w$ is in exactly one of $L$, $\overline L$, so exactly one of $M_1$, $M_2$ eventually accepts it. Therefore $M$ always halts, accepts iff $w\in L$, and decides $L$. (Running them one after the other would fail: the first could loop for ever.) $\blacksquare$`,

  "10d": r`**The halting problem.**
$$
\text{HALT}_{TM}=\{\langle M,w\rangle \mid M \text{ is a TM and } M \text{ halts on input } w\}.
$$
It is Turing-recognisable (simulate $M$ on $w$) but not decidable.

**A language that is not Turing-recognisable:** $\overline{A_{TM}}=\{\langle M,w\rangle \mid M$ does not accept $w\}$. If it were recognisable, then $A_{TM}$ (recognisable) and its complement would both be recognisable, making $A_{TM}$ decidable by part (c), which it is not. (Another example: the diagonalisation language $L_d$.)`,

  "11a": r`**(i) Multi-tape TM.**

${after(b22Solutions["10"], "**Simulation")}

**(ii) Nondeterministic TM.**

${after(b13Solutions["7c"], "**Idea.**")}

**(iii) Two-dimensional tape.** The 2-D machine $M$ has cells $(i,j)$ for all integers $i,j$, and moves L, R, U, D. Simulate it with a one-tape TM $N$:

- At any time only finitely many cells are non-blank: they fit in a rectangle. $N$ stores this rectangle **row by row**, rows separated by a marker #, with the head position marked.
- A left/right move of $M$ is a move within the current row. An up/down move goes to the same column of the previous/next row: $N$ counts the column position (marking it), moves to the next #, and walks the same distance, using marks to keep count.
- If $M$ moves outside the rectangle, $N$ **enlarges** it: add a blank column to every row (shifting each row's contents) or a new blank row at the top or bottom.

Each move of $M$ costs a number of moves of $N$ polynomial in the rectangle's size, and $N$ accepts iff $M$ does. So 2-D TMs recognise the same languages as ordinary TMs.`,

  "11b": r`**Idea (Sipser's halving machine).** $a^m$ with $m$ a power of 2 can be halved repeatedly until one a is left; any odd $m>1$ fails. The b marks the right end.

1. Blank out the first a (it marks the left end; it counts as one of the a's).
2. Sweep right to the b, crossing off **every other** remaining a.
3. If exactly one a was present on this sweep (only the blanked one), accept, provided nothing follows the b.
4. If the number of a's on this sweep was odd and greater than 1, reject.
5. Return to the left end and repeat from 2.

${fig("b09-11b")}

**Configurations on aaaab** (state written before the scanned cell):
${tmTraceTex(b09tmPow, "aaaab", { stateTex: tmName })}

Each sweep halves the number of uncrossed a's, so the machine halts on every input: it decides $L$. (Checked on every string over $\{a,b\}$ up to length 18.)`,

  "12a": r`**Decidable vs recognisable.** A TM **decides** $L$ if it halts on every input, accepting exactly the strings of $L$. It **recognises** $L$ if it accepts exactly the strings of $L$; on other inputs it may reject or run for ever. $L$ is Turing-decidable (recursive) or Turing-recognisable (RE) if some TM does so.

**$M$ recognises $w$ (accepts it) when:**

1. $M$ starts in its **start configuration** on $w$: the start state, with $w$ on the tape and the head on the first cell;
2. each configuration **yields the next** according to $\delta$: $C_1\vdash C_2\vdash\cdots\vdash C_k$ (a finite computation);
3. the last configuration $C_k$ is an **accepting configuration** (its state is the accept state), where $M$ halts.`,

  "12b": r`**Reading the machine** (Lewis–Papadimitriou notation; the head starts on the blank just left of the input $w$):

- $R$: move one cell right; call the symbol found $a$. If $a\ne\sqcup$, continue; otherwise halt.
- $R$: move right again; call the symbol $b$. If $b\ne\sqcup$, continue; otherwise halt.
- $R_\sqcup$: move right to the first blank (just after $w$); write $a$.
- $R_\sqcup$: move right to the next blank (the cell just after that $a$); write $b$.

**So it copies the first two symbols of the input to the end:** $\sqcup w\ \to\ \sqcup w\,ab$, where $a,b$ are the first two symbols of $w$. If $w$ has fewer than two symbols, it halts without writing anything.

**$LR$ vs $RL$: not always the same.** Both normally return the head to the cell where it started, without changing the tape. The difference is at the **left end** of the tape: there $L$ cannot move (the head stays), so $LR$ ends one cell to the **right** of the starting cell, while $RL$ always returns to the starting cell.`,

  "12c": b13Solutions["7a"],

  "12d": r`**Informal description.** $L(G)$: $T$ generates $u\#v\,u^R$ ($u$ around the #, mirrored; $v$ any string), and $S\to TX$ appends any string. So $L=\{u\#v\,u^Rx \mid u,v,x\in\{0,1\}^*\}$: some string, a #, then the reverse of the part before the # appears later (immediately after some string $v$, followed by anything).

The PDA (HMU's construction, one state, acceptance by empty stack) starts with $S$ on the stack and repeatedly:

- if a variable is on top, replaces it by one of its bodies ($S\to TX$; $T\to0T0\mid1T1\mid\#X$; $X\to0X\mid1X\mid\varepsilon$), nondeterministically;
- if a terminal is on top, matches it with the next input symbol and pops it.

It accepts when the stack is empty and the input is used up.

${fig("b09-12d")}

**Trace on 0#0:**
${pdaTraceTex(pdaAcceptingTrace(b09pda12d, "0#0")!)}

(Checked against the grammar on every string over $\{0,1,\#\}$ up to length 6.)`,

  "13a": r`**Formal description** (Sipser form) of a PDA for all palindromes over $\{0,1\}$:
$$
P=(\{q_s,q_p,q_m,q_{acc}\},\ \{0,1\},\ \{0,1,\$\},\ \delta,\ q_s,\ \{q_{acc}\}),
$$
where $\delta$ is (each entry: input, pop $\to$ new state, push):

| From | Move | To | Meaning |
|---|---|---|---|
| $q_s$ | $\varepsilon,\varepsilon\to\text{\textdollar}$ | $q_p$ | bottom marker |
| $q_p$ | $0,\varepsilon\to0$ and $1,\varepsilon\to1$ | $q_p$ | push the first half |
| $q_p$ | $\varepsilon,\varepsilon\to\varepsilon$ | $q_m$ | guess the middle (even length) |
| $q_p$ | $0,\varepsilon\to\varepsilon$ and $1,\varepsilon\to\varepsilon$ | $q_m$ | guess the middle symbol (odd length) |
| $q_m$ | $0,0\to\varepsilon$ and $1,1\to\varepsilon$ | $q_m$ | match the second half |
| $q_m$ | $\varepsilon,\text{\textdollar}\to\varepsilon$ | $q_{acc}$ | everything matched |

${fig("b09-13a")}

${pdaTraceTex(pdaAcceptingTrace(b09pal, "010")!, pdaName)}

(Checked against "palindrome" on every binary string up to length 10.)`,

  "13b": r`**Standard conversion (HMU, for a PDA accepting by empty stack).** Write the PDA of 13(a) in HMU form with states $q$ (pushing) and $p$ (popping), start symbol $Z_0$:

- $\delta(q,a,X)\ni(q,aX)$ for $a\in\{0,1\}$ and every top $X$ (push);
- $\delta(q,\varepsilon,X)\ni(p,X)$ (even middle) and $\delta(q,a,X)\ni(p,X)$ (odd middle);
- $\delta(p,a,a)=\{(p,\varepsilon)\}$ (match); $\delta(p,\varepsilon,Z_0)=\{(p,\varepsilon)\}$ (empty the stack).

**Variables** $[sXt]$: "the PDA, in state $s$ with $X$ on top, eventually pops $X$ and is then in state $t$". **Rules:**

- $S\to[qZ_0t]$ for every state $t$;
- for a move $\delta(s,a,X)\ni(r,\varepsilon)$: $[sXr]\to a$;
- for a move $\delta(s,a,X)\ni(r,Y_1Y_2\cdots Y_k)$: $[sXt]\to a[rY_1s_1][s_1Y_2s_2]\cdots[s_{k-1}Y_kt]$ for all choices of states $s_1,\dots,s_{k-1},t$.

Removing variables that generate nothing or cannot be reached leaves:

${grammarTex(b09palCfg.trimmed)}

which is the palindrome grammar in disguise. (The generated grammar was checked against "palindrome" on every binary string up to length 8.)`,

  "13c": r`This is Sipser's PDA for $\{ww^R\}$: push the input, guess the middle, pop and match.

**Input 1001: accepted.**
${pdaTraceTex(pdaAcceptingTrace(b09given, "1001")!, sub)}

**Input 0101: rejected.** Every branch guesses the middle somewhere:

| Middle guessed after | Stack (top first) | Remaining | Result |
|---|---|---|---|
| $\varepsilon$ | $\text{\textdollar}$ | 0101 | $q_3$ needs 0 on top: stuck |
| 0 | $0\text{\textdollar}$ | 101 | 1 does not match 0: stuck |
| 01 | $10\text{\textdollar}$ | 01 | 0 does not match 1: stuck |
| 010 | $010\text{\textdollar}$ | 1 | 1 does not match 0: stuck |
| 0101 | $1010\text{\textdollar}$ | ε | stack not at the bottom marker: no accept |

No branch accepts, so 0101 is rejected.

**What the PDA does.** It accepts exactly the **even-length palindromes** $\{ww^R \mid w\in\{0,1\}^*\}$ (including $\varepsilon$, since $q_1$ is accepting). (Checked on every binary string up to length 10.)`,
}

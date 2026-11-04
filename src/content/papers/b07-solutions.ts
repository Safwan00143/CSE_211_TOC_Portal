/* Worked solutions for the 7-batch (2008-2009) paper, keyed by part ("1i", "2a", "8c"). */
import { tmTableMd, tmTraceTex } from "@/lib/automata"
import { grammarTex } from "@/lib/cnf"
import { derivation, treesOf } from "@/lib/derivations"
import { b07g2, b07g2Eps, b07g2Unit, b07g2Useless, b07g8c, b07re7b, b07tmXor } from "../machines/b07"
import { after } from "./compose"
import { b09Solutions } from "./b09-solutions"
import { b11Solutions } from "./b11-solutions"
import { b13Solutions } from "./b13-solutions"
import { b17Solutions } from "./b17-solutions"
import { b18Solutions } from "./b18-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const re = (s: string) => s.replace(/\*/g, "^*").replace(/ε/g, "\\varepsilon")
const tmName = (q: string) => ({ q0: "q_0", c0: "c_0", c1: "c_1", d0: "d_0", d1: "d_1", qf: "q_f" })[q] ?? q
const [aab1, aab2] = treesOf(b07g8c, "aab")
const same = (a: unknown) => (t: unknown) => JSON.stringify(t) === JSON.stringify(a)

export const b07Solutions: Record<string, string> = {
  "1i": r`**A PDA exists.** Push **two** symbols for every a; pop one for every b; accept when the stack is back to the bottom marker. Then the number of b's must be exactly twice the number of a's.

${fig("pda-anb2n")}

To require $n>0$ (as here), the first a must be read before the machine is allowed to accept: the start state is not accepting, and the empty string has no accepting path. (The PDA is checked against $\{a^nb^{2n}\}$ in the PDA note.)`,

  "1ii": r`**No PDA exists: $L=\{a^nb^{2n}c^n\}$ is not context-free.** Use the pumping lemma for CFLs.

1. Assume $L$ is context-free with pumping length $p$, and take $s=a^pb^{2p}c^p\in L$.
2. Let $s=uvxyz$ with $|vxy|\le p$ and $|vy|>0$.
3. The b-block has length $2p>p$, so $vxy$ cannot contain both an a and a c: it touches at most two adjacent blocks (a and b, or b and c).
4. Pump down: $uxz$. At least one block shrinks and at least one block (the a's or the c's) keeps its length. The ratio $1:2:1$ is broken, so $uxz\notin L$. (If $v$ or $y$ mixes two symbols, pumping up breaks the order; pumping down still removes symbols from at most two adjacent blocks, as just argued.)
5. Contradiction; $L$ is not context-free, so no PDA accepts it. $\blacksquare$

(Brute-force checked over every legal split for $p=1,2,3$.)`,

  "2a": r`${grammarTex(b07g2)}

**Nullable variables:** ${b07g2Eps.nullable.join(", ")} ($S\to\varepsilon$). $A$ is not nullable (every $A$-rule produces an a), and neither is $B$ (its bodies contain b or $A$).

**Replace each body by every version with nullable occurrences dropped** (never leaving an empty body), and drop $S\to\varepsilon$. (The new grammar generates $L(G)-\{\varepsilon\}$; add $S\to\varepsilon$ back if $\varepsilon$ is wanted.)

- $S\to ASB$ gives $ASB$, $AB$.
- $A\to aAS$ gives $aAS$, $aA$.
- $B\to SbS$ gives $SbS$, $Sb$, $bS$, $b$.

${grammarTex(b07g2Eps.grammar)}`,

  "2b": r`**Unit productions:** only $B\to A$. The unit pairs are ${b07g2Unit.pairs.map(([a, b]) => `$(${a},${b})$`).join(", ")}. For the pair $(B,A)$, copy $A$'s non-unit bodies to $B$ and delete $B\to A$:

${grammarTex(b07g2Unit.grammar)}`,

  "2c": r`**Generating symbols:** $a$, $b$ (terminals); $A$ (via $A\to a$); $B$ (via $B\to b$); $S$ (via $S\to AB$). Every variable is generating.

**Reachable symbols** from $S$: $S\to ASB$ reaches $A$, $B$; their rules reach $a$, $b$. Every symbol is reachable.

**So there are no useless symbols**, and the grammar stays as it is:

${grammarTex(b07g2Useless.grammar)}

(Each step was checked by machine to preserve the language, apart from the removed $\varepsilon$, on all strings up to length 7.)`,

  "3a": r`A (deterministic) Turing machine is a 7-tuple $M=(Q,\Sigma,\Gamma,\delta,q_0,B,F)$:

- $Q$: finite set of states;
- $\Sigma$: input alphabet; $\Gamma\supseteq\Sigma$: tape alphabet, with the **blank** $B\in\Gamma-\Sigma$;
- $\delta: Q\times\Gamma\to Q\times\Gamma\times\{L,R\}$, a partial function: $\delta(q,X)=(p,Y,D)$ means "in state $q$ reading $X$: go to $p$, write $Y$, move $D$";
- $q_0\in Q$: start state; $F\subseteq Q$: accepting states.

An **instantaneous description** $\alpha q\beta$ shows the tape contents $\alpha\beta$ with the head on the first symbol of $\beta$; $M$ accepts $w$ if $q_0w\vdash^*\alpha p\beta$ with $p\in F$.`,

  "3b": r`**Assumptions.** Input $w_1\#w_2$ with $|w_1|=|w_2|\ge1$; the head starts on the first symbol; the result $w_1\oplus w_2$ is left alone on the tape (in the cells of $w_2$).

**Idea.** One round per bit: **erase** the next bit $a$ of $w_1$ and carry it in the state; go past # to the first unmarked bit $b$ of $w_2$, replace it by the **marked** result $*(a\oplus b)$; return to the left. When $w_1$ is used up (the head finds #), erase the # and remove the marks.

| State | Meaning |
|---|---|
| $q_0$ | at the next bit of $w_1$ |
| $c_a$ | carrying bit $a$ to the #  |
| $d_a$ | in $w_2$, looking for its next unmarked bit |
| back | returning to the left |
| $u$ | removing marks |
| $q_f$ | halt |

${fig("b07-3b")}

${tmTableMd(b07tmXor, tmName)}

(Checked on every valid input up to length 9: the tape always ends with exactly $w_1\oplus w_2$.)`,

  "3c": r`**Simulation on 1011#0010** (XOR $=1001$):
${tmTraceTex(b07tmXor, "1011#0010", { stateTex: tmName })}

The tape ends with 1001.`,

  "4a": r`**Rice's theorem.** Every **nontrivial** property of the RE languages is undecidable. A property $P$ is a set of RE languages; it is nontrivial if some RE language has it and some does not. Formally: $L_P=\{\langle M\rangle \mid L(M)\in P\}$ is undecidable for every nontrivial $P$. (Properties of the **language**, not of the machine: "accepts 0110", "$L(M)$ is regular", "$L(M)=\emptyset$" are covered; "M has 5 states" is not.)

**Proof sketch** (reduce $L_u=A_{TM}$ to $L_P$).

1. Assume first that $\emptyset\notin P$ (otherwise use $\overline P$: if $L_{\overline P}$ is undecidable, so is its complement $L_P$). Since $P$ is nontrivial, some RE language $L\in P$; let $M_L$ accept it.
2. Given $\langle M,w\rangle$, build $M'$: on input $x$, first simulate $M$ on $w$; if $M$ accepts $w$, then simulate $M_L$ on $x$ and accept if it accepts.
3. If $M$ accepts $w$, then $L(M')=L\in P$. If $M$ does not accept $w$, $M'$ accepts nothing: $L(M')=\emptyset\notin P$.
4. So $\langle M,w\rangle\in A_{TM}\iff\langle M'\rangle\in L_P$, and $M'$ is computable from $\langle M,w\rangle$. A decider for $L_P$ would decide $A_{TM}$, which is impossible. $\blacksquare$`,

  "4b": r`**Undecidable.** "The language accepted by $M$ consists only of palindromes" (or: is a palindrome language) is a property of $L(M)$, and it is **nontrivial**: the RE language $\{0,00\}$ has it and $\{01\}$ does not. By Rice's theorem, $\{\langle M\rangle \mid L(M) \text{ has the property}\}$ is undecidable.`,

  "4c": r`$L_u=A_{TM}=\{\langle M,w\rangle \mid M \text{ accepts } w\}$ (or the halting problem). It is **RE**: the universal TM simulates $M$ on $w$ and accepts if $M$ accepts. It is **not recursive**: a decider for it would make the diagonalisation language decidable (see the $A_{TM}$ proofs elsewhere on the site).

${after(b18Solutions["11"], "**(d)").split("**(e)")[0]}`,

  "4d": b09Solutions["10c"],

  "5a": b13Solutions["4b"],

  "5b": r`$L=\{0^n10^n \mid n\ge1\}$.

1. Assume $L$ is regular with pumping length $p$, and take $s=0^p10^p\in L$ (with $p\ge1$).
2. $|xy|\le p$ forces $y=0^k$ ($k\ge1$) inside the first block.
3. Pump down: $xz=0^{p-k}10^p\notin L$ (the blocks differ).
4. Contradiction; $L$ is not regular. (Brute-force checked for small $p$.)`,

  "5c": r`**DFA.** $A=(Q,\Sigma,\delta,q_0,F)$: finite set of states $Q$, alphabet $\Sigma$, **transition function** $\delta:Q\times\Sigma\to Q$ (exactly one next state), start $q_0$, accepting states $F\subseteq Q$. $A$ accepts $w$ if its unique run on $w$ ends in $F$.

**NFA.** $N=(Q,\Sigma,\delta,q_0,F)$ with $\delta:Q\times\Sigma_\varepsilon\to\mathcal P(Q)$: from each state, on each symbol (or on ε), **a set** of possible next states, possibly empty. $N$ accepts $w$ if **some** sequence of choices reading $w$ ends in $F$.

Every DFA is an NFA; every NFA has an equivalent DFA (subset construction).`,

  "6a": r`**Idea.** Keep the value modulo 3: appending bit $b$ to $v$ gives $2v+b$, so $r\to(2r+b)\bmod3$. Accept in remainder 0. (A separate non-accepting start state rejects the empty string.)

${fig("dfa-div3")}

(This DFA is checked against "value divisible by 3" in the DFA note.)`,

  "6b": r`**Example.** $L_n$ = binary strings whose **$n$-th symbol from the end is 1**.

**NFA with $n+1$ states:** $q_0$ loops on 0 and 1; $q_0\xrightarrow{1}q_1$ (guess: this 1 is $n$-th from the end); $q_1\xrightarrow{0,1}q_2\xrightarrow{0,1}\cdots\xrightarrow{0,1}q_n$; $q_n$ accepting. For $n=3$:

${fig("nfa-third-last")}

**Every DFA for $L_n$ needs at least $2^n$ states.** Suppose a DFA $D$ has fewer than $2^n$ states. There are $2^n$ strings of length $n$, so two different ones, $x\ne y$, lead $D$ to the **same** state. They differ in some position $i$ ($1\le i\le n$), say $x_i=1$, $y_i=0$. Append $z=0^{i-1}$: in $xz$ the symbol $x_i$ is now $n$-th from the end, so $xz\in L_n$, while $yz\notin L_n$. But $xz$ and $yz$ lead $D$ to the same state, so $D$ accepts both or neither: a contradiction. Hence $D$ has at least $2^n$ states (and the subset construction gives exactly $2^n$).`,

  "6c": b17Solutions["1c"],

  "7a": after(b11Solutions["8b"], "### (⇒) Every regular language is described by a regular expression"),

  "7b": r`**(i) At least one a and at least one c** (over $\{a,b,c\}$): an a somewhere before a c, or a c before an a:
$$
${re(b07re7b.i)}.
$$

**(ii) No two consecutive 0s, or no two consecutive 1s:**
$$
${re(b07re7b.ii)}.
$$
$(1+01)^*(\varepsilon+0)$ has every 0 followed by a 1 (except possibly the last symbol): no 00. Symmetrically $(0+10)^*(\varepsilon+1)$ has no 11.

(Both checked on every string up to length 6 and 10.)`,

  "7c": r`Build from the parts (each symbol gives a two-state NFA):

1. $0+1$: a new start $q_5$ with ε-moves to $q_1\xrightarrow{0}q_2$ and $q_3\xrightarrow{1}q_4$.
2. $(0+1)^*$: a new accepting start $q_6$ with $q_6\xrightarrow{\varepsilon}q_5$, and ε-moves from $q_2$, $q_4$ back to $q_5$.
3. Concatenate with 1: ε-moves from $q_6$, $q_2$, $q_4$ to $q_7\xrightarrow{1}q_8$.
4. Concatenate with $0+1$: $q_8\xrightarrow{\varepsilon}q_{13}$, where $q_{13}$ is the union start for $q_9\xrightarrow{0}q_{10}$ and $q_{11}\xrightarrow{1}q_{12}$.

${fig("b07-7c")}

It accepts exactly the strings whose second-to-last symbol is 1 (checked on every binary string up to length 9).`,

  "8a": r`**The two halves.** $L_1=\{a^nb^nc^md^m\}$ (a's match b's, c's match d's) and $L_2=\{a^nb^mc^md^n\}$ (a's match d's, b's match c's). A natural grammar: $S\to AB\mid C$, $A\to aAb\mid ab$, $B\to cBd\mid cd$, $C\to aCd\mid aDd$, $D\to bDc\mid bc$. It is ambiguous: $a^nb^nc^nd^n$ lies in both halves and has a tree through $AB$ and another through $C$.

${fig("cfg-inherent")}

**Why every grammar is ambiguous (HMU, sketch).**

- A grammar for $L$ must produce $a^nb^nc^md^m$ with $n\ne m$ by generating a's together with b's, and c's together with d's (there is no other way to keep both counts equal). Using the pumping lemma on long strings with $n\ne m$, one shows the grammar has variables that pump matching numbers of a's and b's, and others for c's and d's.
- Similarly, for $a^nb^mc^md^n$ with $n\ne m$ it must have variables that pump a's with d's, and b's with c's.
- The string $a^nb^nc^nd^n$ (for $n$ large, e.g. a multiple of the pumping constants) can be derived both ways: once by pumping a/b and c/d pairs, once by pumping a/d and b/c pairs. These two derivations give **different** parse trees.

So every grammar for $L$ has an ambiguous string: $L$ is **inherently ambiguous**.`,

  "8b": b11Solutions["7a"],

  "8c": r`In $S\to aS\mid aSbS\mid\varepsilon$, the b of aab can be matched with either a.

**(i) Two parse trees:**

${fig("b07-8c")}

**(ii) Two leftmost derivations:**
${derivation(b07g8c, "aab", "lm", same(aab1))}
${derivation(b07g8c, "aab", "lm", same(aab2))}

**(iii) Two rightmost derivations:**
${derivation(b07g8c, "aab", "rm", same(aab1))}
${derivation(b07g8c, "aab", "rm", same(aab2))}

(A machine count confirms aab has exactly two parse trees.)`,
}

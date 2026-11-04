/* Worked solutions for the 14-batch (2015-2016) paper, keyed by part ("1a", "4b", "8b"). */
import { faRunTex, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { derivation } from "@/lib/derivations"
import { b14f1, b14g4, b14more0, b14not3, b14pda5, b14re3a, b14tmAbc, b14tmMonus, b14wx, reachableIds, type Id } from "../machines/b14"
import { b15mid0 } from "../machines/b15"
import { b16three1 } from "../machines/b16"
import { pdaEqualAb } from "../machines/notes-pda-hmu"
import { b15Solutions } from "./b15-solutions"
import { b18Solutions } from "./b18-solutions"
import { b21Solutions } from "./b21-solutions"
import { b22Solutions } from "./b22-solutions"
import { after } from "./compose"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const re = (k: keyof typeof b14re3a) => b14re3a[k].replace(/\*/g, "^*").replace(/ε/g, "\\varepsilon")
const idTex = (id: Id) => `(${id.q},\\ ${id.rest || "\\varepsilon"},\\ ${id.stack.map((s) => (s === "Z0" ? "Z_0" : s)).join("")})`
const idLevels = (w: string) => {
  const levels = reachableIds(b14pda5, w)
  const rows = levels.map((lv, i) => `| ${i} | ${lv.map((id) => `$${idTex(id)}$`).join(", ")} |`)
  const accepted = levels.flat().some((id) => id.rest === "" && id.q === "p")
  return `| Moves | Reachable IDs |\n|---|---|\n${rows.join("\n")}\n\n${accepted ? `**Accepted:** an ID $(p,\\varepsilon,\\ldots)$ is reached.` : "**Not accepted:** no ID with state $p$ and the input used up is reachable."}`
}
const tmName = (q: string) => (q === "qf" ? "q_f" : q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b14Solutions: Record<string, string> = {
  "1a": r`**Definition.** A (deterministic) finite state machine is a 5-tuple $M=(Q,\Sigma,\delta,q_0,F)$:

1. $Q$ is a finite set of **states**;
2. $\Sigma$ is a finite **alphabet**;
3. $\delta: Q\times\Sigma\to Q$ is the **transition function**;
4. $q_0\in Q$ is the **start state**;
5. $F\subseteq Q$ is the set of **accepting states**.

$M$ accepts $w=w_1\cdots w_n$ if the run $r_0=q_0$, $r_{i}=\delta(r_{i-1},w_i)$ ends in $F$.

**$F_1$ formally.** $Q=\{a,b,c,d,e\}$, $\Sigma=\{0,1\}$, $q_0=a$, $F=\{c,e\}$, and

| $\delta$ | 0 | 1 |
|---|---|---|
| → $a$ | $b$ | $d$ |
| $b$ | $b$ | $c$ |
| \* $c$ | – | – |
| $d$ | $e$ | – |
| \* $e$ | – | – |

The figure shows only five transitions, so $\delta$ is **partial** ("–" = no move, the input is rejected). To make it a total function as the definition requires, add a dead state $t$ with every missing transition going to $t$ and $t$ looping on 0 and 1.`,

  "1b": r`$L(F_1)=\{0^n1 \mid n\ge1\}\cup\{10\}=0^+1+10$.

- Upper path: $a\xrightarrow{0}b$, any number of further 0s at $b$, then a single 1 to $c$. $c$ has no moves, so nothing may follow.
- Lower path: $a\xrightarrow{1}d\xrightarrow{0}e$, and $e$ has no moves: only the string 10.

${faRunTex(b14f1, "0001")}
${faRunTex(b14f1, "100")}

(Checked by simulation on every binary string up to length 9.)`,

  "1c": r`${fig("b14-1c")}

With the loop $\delta(d,1)=d$, the lower path reads $1$, then any number of further 1s, then a single 0:
$$
L(F_2)=0^+1\;\cup\;1^+0.
$$
(Checked by simulation.)`,

  "1d": r`**No, this is not possible**, and in fact the claim does not make sense for $F_1$.

$L(F_1)$ is **infinite**: it contains $01, 001, 0001, \dots$. For an infinite language, adding one string does not change its size: $|L(F_1)\cup\{x\}|=|L(F_1)|$ (both are countably infinite, $\aleph_0+1=\aleph_0$). So $|L(F_3)|=|L(F_1)|+1$ cannot hold in the intended sense of "exactly one more string": an infinite language has no "next" cardinality.

What *is* possible is a change that adds exactly one **string**: for example, redirect the missing move $\delta(e,0)$ … but that adds a transition, which is not allowed. Keeping 5 states and 5 transitions, one could, say, move the $d\xrightarrow{0}e$ edge to make $e$ reachable on a different single string; but the size of the language stays infinite either way. So the friend's claim about the cardinality increasing by exactly 1 is false.`,

  "1e": r`**Yes, the brother is right.** $L(R_1)$ has exactly 5 strings, and $D_1$ is supposed to be equivalent to $R_1$, i.e. to accept exactly those 5 strings. The program (assumed to implement $D_1$ correctly) accepted 1000 **different** strings, so $D_1$ accepts at least 1000 strings. Since $1000>5$, $L(D_1)\ne L(R_1)$: the DFA is wrong, whatever the 1000 strings were.`,

  "2a": r`**Intuition.** Reading a binary number left to right, appending a bit $b$ to a number $v$ gives the number $2v+b$. Divisibility only depends on the remainder, and
$$
(2v+b)\bmod3=(2\,(v\bmod3)+b)\bmod3.
$$
So the DFA only needs to remember $v\bmod3$: three states $r_0,r_1,r_2$.

| From | bit 0 | bit 1 |
|---|---|---|
| $r_0$ | $r_0$ | $r_1$ |
| $r_1$ | $r_2$ | $r_0$ |
| $r_2$ | $r_1$ | $r_2$ |

Start in $r_0$ (no bits read = value 0). **Accept** in $r_1$ and $r_2$: the number is not divisible by 3. (The empty string has value 0 and is rejected.)

${fig("b14-2a")}

**How it works on the examples.** 1111 ($=15$):
${faRunTex(b14not3, "1111", { name: sub })}
111 ($=7$):
${faRunTex(b14not3, "111", { name: sub })}

(Checked against the definition on every binary string up to length 11.)`,

  "2b": r`The regular operations are **union**, **concatenation** and **star**. Let $A_1=L(N_1)$, $A_2=L(N_2)$ for NFAs $N_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$, $N_2=(Q_2,\Sigma,\delta_2,q_2,F_2)$ with disjoint state sets. (Every regular language has an NFA, and every NFA has an equivalent DFA, so it suffices to build NFAs.)

### Union

$N=(\{q_0\}\cup Q_1\cup Q_2,\Sigma,\delta,q_0,F_1\cup F_2)$ with a new start $q_0$ and $\delta(q_0,\varepsilon)=\{q_1,q_2\}$, all other moves copied. $N$ guesses which machine to run; a branch accepts iff that machine accepts. So $L(N)=A_1\cup A_2$.

### Concatenation

${after(b15Solutions["4b"], "**Construction.**")}

### Star

$N=(\{q_0\}\cup Q_1,\Sigma,\delta,q_0,\{q_0\}\cup F_1)$: a new **accepting** start $q_0$ with $q_0\xrightarrow{\varepsilon}q_1$, and from every accepting state of $N_1$ an extra ε-move back to $q_1$.

- If $w=w_1\cdots w_k$ with each $w_i\in A_1$ ($k\ge0$): for $k=0$, $N$ accepts in $q_0$; otherwise it runs $N_1$ on $w_1$, returns to $q_1$ by an ε-move, runs $N_1$ on $w_2$, and so on, ending in $F_1$.
- If $N$ accepts $w\ne\varepsilon$: cut the accepting run at each ε-return to $q_1$; each piece is an accepting run of $N_1$, so $w\in A_1^*$.

The new start state is needed: making $q_1$ accepting instead could accept unfinished pieces (see the "Hasty" question).

Hence the regular languages are closed under all three regular operations. $\blacksquare$`,

  "3a": r`${fig("b14-3a")}

**(i)** Begins with 1, ends with 0: $\ ${re("i")}$. The DFA rejects a leading 0 (dead state $d$); after the first 1 it tracks whether the last symbol is 0 ($z$, accepting) or 1 ($o$).

**(ii)** Third symbol 0: $\ ${re("ii")}$. Count the first two symbols ($t_1,t_2$); the third decides (0 → accepting trap $f$, 1 → dead $d$).

**(iii)** Even number of 0s **or** exactly two 1s:
$$
${re("iii")}.
$$
The DFA is the product of "parity of 0s" ($E$/$O$) and "number of 1s" (0, 1, 2, 3 = three or more); a state accepts if the parity is even **or** the count is 2. The regular expression is the union of the two parts: $(1^*01^*0)^*1^*$ (even 0s) and $0^*10^*10^*$ (exactly two 1s).

**(iv)** Every string except 11 and 111:
$$
${re("iv")}.
$$
The DFA follows the input only while it is $\varepsilon$, 1, 11 or 111; anything else (a 0 anywhere, or a fourth symbol) moves to the accepting trap "all". The rejecting states are exactly "11" and "111".

**(v)** At least two 0s and at most one 1:
$$
${re("v")}.
$$
The DFA counts 0s up to 2 and 1s up to 1 (a second 1 goes to the dead state). The expression lists where the single 1 can be: absent ($000^*$), after at least two 0s ($000^*10^*$), after exactly one 0 ($0100^*$), or first ($1000^*$).

(All five DFAs and all five regular expressions were checked against their definitions on every binary string up to length 10.)`,

  "3b": b21Solutions["3b"],

  "4a": r`${(() => "")()}**(i) Variables:** $R, S, T, X$. **(ii) Terminals:** $a, b$. **(iii) Start variable:** $R$ (the first rule's head).

**What each variable generates.**

- $X$: a single symbol, a or b.
- $T\to XTX\mid X\mid\varepsilon$: adds symbols on both sides, then ends with one or zero symbols: **every** string over $\{a,b\}$.
- $S\to aTb\mid bTa$: strings that **begin and end with different symbols** (length $\ge2$).
- $R\to XRX\mid S$: wraps $S$ in $k$ symbols on each side. So $R$ generates $u\,s\,v$ with $|u|=|v|$ and $s$ starting and ending with different symbols: two positions that mirror each other ($i$ and $n+1-i$) hold different symbols.

**(vi) $L(G)$ is the set of strings over $\{a,b\}$ that are not palindromes.** (A string is not a palindrome iff some pair of mirror positions differ; take the outermost such pair as the ends of $s$.)

**(iv) In $L(G)$:** ab, ba, aab (also abb, baa). **(v) Not in $L(G)$:** $\varepsilon$, a, aba (also aa, abba): palindromes.

Derivation of aab:
${derivation(b14g4, "aab", "lm")}

**(vii)** ("$\Rightarrow$" is one step, "$\overset*\Rightarrow$" is zero or more steps.)

| | Statement | | Reason |
|---|---|---|---|
| S1 | $T\Rightarrow aba$ | False | no single rule $T\to aba$ |
| S2 | $T\overset*\Rightarrow aba$ | True | $T\Rightarrow XTX\Rightarrow XXX\overset*\Rightarrow aba$ |
| S3 | $T\Rightarrow T$ | False | no rule $T\to T$ |
| S4 | $T\overset*\Rightarrow T$ | True | zero steps |
| S5 | $XXX\overset*\Rightarrow aba$ | True | $X\to a$, $X\to b$, $X\to a$ |
| S6 | $X\overset*\Rightarrow aba$ | False | $X$ only derives a or b |
| S7 | $T\overset*\Rightarrow XX$ | True | $T\Rightarrow XTX\Rightarrow XX$ (using $T\to\varepsilon$) |
| S8 | $T\overset*\Rightarrow XXX$ | True | $T\Rightarrow XTX\Rightarrow XXX$ |
| S9 | $S\overset*\Rightarrow\varepsilon$ | False | every $S$-string has at least two terminals |

(The language description was checked by machine on all strings up to length 9, and S1, S2, S3, S6, S9 by direct computation.)`,

  "4b": r`**(i) At least three 1s:** $S\to A1A1A1A$, $A\to0A\mid1A\mid\varepsilon$.

**(ii) Odd length, 0 in the middle:** $S\to ASA\mid0$, $A\to0\mid1$.

${derivation(b15mid0, "10011", "lm")}

**(iii) More 0s than 1s:**
$$
\begin{aligned}
S&\to T0T\\
T&\to TT\mid0T1\mid1T0\mid0\mid\varepsilon
\end{aligned}
$$
$T$ generates the strings with **at least as many** 0s as 1s (balanced pieces $0T1$, $1T0$, concatenations, and extra 0s). A string with more 0s than 1s has a 0 at which the running surplus of 0s first reaches its final value; splitting there as $T\,0\,T$ works.

${derivation(b14more0, "001", "lm")}

**(iv) $w\#x$ with $w^R$ a substring of $x$:** write $x=y\,w^R\,z$. Generate $w\#y\,w^R$ from the outside in, then $z$:
$$
\begin{aligned}
S&\to RA\\
R&\to0R0\mid1R1\mid\#A\\
A&\to0A\mid1A\mid\varepsilon
\end{aligned}
$$
Each step of $R$ puts a symbol of $w$ on the left and the same symbol on the right, so the right side reads $w$ backwards; $\#A$ gives the separator and the arbitrary prefix $y$ of $x$; the final $A$ gives $z$.

${derivation(b14wx, "01#1010", "lm")}

(Each grammar was checked against its definition on all strings up to length 8 or 9; (i) is the grammar from 2017-18 Q5(b), checked there.)

${derivation(b16three1, "0111", "lm")}`,

  "4c": r`**$A=\{0^n1^n2^n\}$.** Assume $A$ is regular with pumping length $p$, and take $w=0^p1^p2^p$. Since $|xy|\le p$, $y=0^k$ with $k\ge1$. Then $xz=0^{p-k}1^p2^p\notin A$ (fewer 0s than 1s), contradicting the lemma. So $A$ is not regular.

**$B=\{0^i1^j \mid i>j\}$.** Assume $B$ is regular with pumping length $p$, and take $w=0^{p+1}1^p\in B$. Since $|xy|\le p$, $y=0^k$ with $1\le k\le p$. Pump **down**: $xz=0^{p+1-k}1^p$ has $p+1-k\le p$ zeros, so $i\le j$ and $xz\notin B$. Contradiction; $B$ is not regular. (Pumping up would not work here: more 0s keeps the string in $B$.)

(Both arguments are brute-force checked over every legal split for small $p$.)`,

  "5a": r`${fig("b14-5a")}

Each label is *input, top of stack $\to$ string pushed in its place*:

- on $q$: $0,Z_0\to XZ_0$; $0,X\to XX$; $1,X\to X$;
- $q\to p$: $\varepsilon,X\to\varepsilon$;
- on $p$: $\varepsilon,X\to\varepsilon$; $1,X\to XX$; $1,Z_0\to\varepsilon$.`,

  "5b": r`An ID is (state, remaining input, stack with the top on the left). Each row lists the IDs first reached after that many moves (an ID already seen is not repeated).

### (i) $w=0011$

${idLevels("0011")}

### (ii) $w=0101$

${idLevels("0101")}

### (iii) $w=1010$

${idLevels("1010")}

From $(q,1010,Z_0)$ there is no move at all: in $q$ the only moves on 1 or ε need $X$ on top, and the only move with $Z_0$ on top reads 0.

(The ID sets were generated by an exhaustive search of the PDA's moves.)`,

  "6a": r`**Idea (HMU form, acceptance by final state).** Use the stack to hold the **surplus**: the stack contains only a's (if more a's than b's have been read) or only b's.

- Reading a symbol equal to the top (or with $Z_0$ on top): push it.
- Reading a symbol different from the top: pop (one a cancels one b).
- When $Z_0$ is on top, the counts are equal: an ε-move to the accepting state $f$.

$P=(\{q,f\},\{a,b\},\{a,b,Z_0\},\delta,q,Z_0,\{f\})$:

| Move | Meaning |
|---|---|
| $\delta(q,a,Z_0)=\{(q,aZ_0)\}$, $\delta(q,a,a)=\{(q,aa)\}$ | a with no b's waiting: push |
| $\delta(q,a,b)=\{(q,\varepsilon)\}$ | a cancels a waiting b |
| $\delta(q,b,Z_0)=\{(q,bZ_0)\}$, $\delta(q,b,b)=\{(q,bb)\}$ | b with no a's waiting: push |
| $\delta(q,b,a)=\{(q,\varepsilon)\}$ | b cancels a waiting a |
| $\delta(q,\varepsilon,Z_0)=\{(f,Z_0)\}$ | counts equal: accept |

${fig("hmu-equal-ab")}

**Trace on abba:**
${pdaTraceTex(pdaAcceptingTrace(pdaEqualAb, "abba")!)}

(The PDA is checked against "equal numbers of a's and b's" in the PDA note.)`,

  "6b": r`**Yes, always.** Definitions:

- $P_F=(Q,\Sigma,\Gamma,\delta_F,q_0,Z_0,F)$ accepts by **final state**: $L(P_F)=\{w \mid (q_0,w,Z_0)\overset*\vdash(q,\varepsilon,\alpha),\ q\in F\}$.
- $P_N=(Q',\Sigma,\Gamma',\delta_N,p_0,X_0)$ accepts by **empty stack**: $N(P_N)=\{w \mid (p_0,w,X_0)\overset*\vdash(q,\varepsilon,\varepsilon)\}$.

${after(b18Solutions["10a"], "**Final state $\\Rightarrow$ empty stack.**").split("So a language is accepted")[0]}`,

  "7a": r`**Working principle.** Repeatedly cross off one a, one b and one c (replacing them by X, Y, Z). When no a is left, check that no b or c is left either.

1. $q_0$: at the leftmost uncrossed a, replace it by X and move right ($q_1$).
2. $q_1$: skip a's and Y's to the first b; replace it by Y ($q_2$).
3. $q_2$: skip b's and Z's to the first c; replace it by Z and turn left ($q_3$).
4. $q_3$: move left back to the last X, then step right into $q_0$.
5. If $q_0$ sees Y (all a's used), go right in $q_4$ over Y's and Z's; reaching the blank means everything matched: **accept**.

Any mismatch (no b or c where needed, a stray symbol in $q_4$, or wrong order) leaves the machine with no move, so it halts and rejects. Since every round crosses off three symbols, the machine always halts: it decides the language.

${tmTableMd(b14tmAbc, tmName)}

**Trace on aabbcc:**
${tmTraceTex(b14tmAbc, "aabbcc", { stateTex: tmName })}

(Checked on every string over $\{a,b,c\}$ up to length 9.)`,

  "7b": r`**Reduction.** A reduction from $P$ to $Q$ is an algorithm (a TM that always halts) that transforms every instance $x$ of $P$ into an instance $f(x)$ of $Q$ with the **same answer**:
$$
x\in P \iff f(x)\in Q.
$$

**Theorem.** If $P$ reduces to $Q$ and $P$ is undecidable, then $Q$ is undecidable.

**Proof (by contradiction).** Suppose $Q$ were decidable, decided by a TM $M_Q$ that always halts. Build $M_P$: on input $x$, compute $f(x)$ (this halts, since $f$ is computed by an algorithm), run $M_Q$ on $f(x)$, and give the same answer.

- $M_P$ always halts, since both stages do.
- $M_P$ accepts $x$ iff $M_Q$ accepts $f(x)$ iff $f(x)\in Q$ iff $x\in P$.

So $M_P$ decides $P$, contradicting the undecidability of $P$. Hence $Q$ is undecidable. $\blacksquare$

**The direction matters.** We reduce the **known** hard problem $P$ **to** the new problem $Q$ ("if I could solve $Q$, I could solve $P$"). Reducing $Q$ to $P$ would prove nothing.

**Example.** $P=L_u=\{(M,w) \mid M \text{ accepts } w\}$ (undecidable), $Q=\text{HALT}$. Given $(M,w)$, let $f(M,w)=(M',w)$, where $M'$ runs $M$ on $w$, halts if $M$ accepts, and loops forever if $M$ rejects. Then $M$ accepts $w$ iff $M'$ halts on $w$, so HALT is undecidable.`,

  "8a": r`**Working principle.** The tape holds $1^a01^b$. Repeatedly erase one 1 of $a$ (from the left end) and one 1 of $b$ (from the right end).

- If $a$ runs out first (the leftmost symbol is the 0): erase the 0 and halt. The remaining $b-a$ ones are the answer.
- If $b$ runs out first (the rightmost symbol is the 0): erase the 0 and every remaining 1 of $a$, and halt with an empty tape (answer 0, since $b<a$).

| State | Meaning |
|---|---|
| $q_0$ | at the left end: erase a 1 of $a$, or finish if $a$ is used up |
| $q_1$ | move right to the end |
| $q_2$ | at the right end: erase a 1 of $b$, or start erasing if $b$ is used up |
| $q_3$ | move back to the left end |
| $q_4$ | erase the rest of $a$ |
| $q_f$ | halt |

${tmTableMd(b14tmMonus, tmName)}

**Trace on $1\,0\,111$** ($a=1$, $b=3$: answer 2):
${tmTraceTex(b14tmMonus, "10111", { stateTex: tmName })}

(Checked on every input $1^a01^b$ up to length 9: the tape always ends with exactly $\max(b-a,0)$ ones.)`,

  "8b": r`${after(b22Solutions["10"], "**Multi-tape TM.**").split("**Simulation")[0]}**Multiple tracks.** A **one-tape** TM whose tape symbols are $k$-tuples: each cell holds one symbol per track, and the single head reads all tracks of a cell at once. For example, track 1 holds the input and track 2 holds check marks.

**The difference.**

| | Multiple tracks | Multiple tapes |
|---|---|---|
| Heads | one head, reading all tracks of one cell | one head per tape, moving independently |
| What it really is | an ordinary one-tape TM with a larger tape alphabet $\Gamma=\Gamma_1\times\cdots\times\Gamma_k$ | a genuinely different model |
| Simulation by a basic TM | immediate (it *is* a basic TM) | needs the track-and-marker construction, $O(n^2)$ slowdown |

Neither extension adds power: both accept exactly the RE languages. Tracks are a programming convenience; multiple tapes also make machines faster (by up to a square), e.g. copying or comparing strings.

${after(b22Solutions["10"], "**Simulation")}`,
}

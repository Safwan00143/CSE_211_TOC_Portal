/* Worked solutions for the 11-batch (2012-2013) paper, keyed by part ("1a", "5c", "8c"). */
import { faRunTex, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { derivation } from "@/lib/derivations"
import { b11g1, b11g7a, b11midA, b11mult5, b11pda1, b11tmPar, b11tmWww } from "../machines/b11"
import { after } from "./compose"
import { b13Solutions } from "./b13-solutions"
import { b14Solutions } from "./b14-solutions"
import { b16Solutions } from "./b16-solutions"
import { b18Solutions } from "./b18-solutions"
import { b22Solutions } from "./b22-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const pdaName = (q: string) => ({ qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" })[q] ?? q
const tmName = (q: string) => ({ q0: "q_0", q1: "q_1", q9: "q_9", q10: "q_{10}", qa: "q_{acc}", w0: "w_0", w1: "w_1" })[q] ?? (/^[cmdn][ab]$/.test(q) ? `${q[0]}_${q[1]}` : q)

export const b11Solutions: Record<string, string> = {
  "1a": r`**Definition (HMU).** A pushdown automaton is a 7-tuple $P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)$:

- $Q$: finite set of states; $\Sigma$: input alphabet; $\Gamma$: stack alphabet;
- $\delta: Q\times(\Sigma\cup\{\varepsilon\})\times\Gamma\to$ finite subsets of $Q\times\Gamma^*$; a move $(p,\gamma)\in\delta(q,a,X)$ means: in state $q$, reading $a$ (or nothing), with $X$ on top, go to $p$ and replace $X$ by the string $\gamma$;
- $q_0\in Q$: start state; $Z_0\in\Gamma$: start stack symbol; $F\subseteq Q$: accepting states.

(Sipser's version uses a 6-tuple without $Z_0$, with moves that pop and push at most one symbol.)

**The PDA for the grammar.** Use the one-state construction: $P=(\{q\},\{0,1,2\},\{S,A,B,0,1,2\},\delta,q,S)$, accepting by empty stack, with

| Top | Moves |
|---|---|
| $S$ | $\delta(q,\varepsilon,S)=\{(q,BS),\ (q,A)\}$ |
| $A$ | $\delta(q,\varepsilon,A)=\{(q,0A),\ (q,\varepsilon)\}$ |
| $B$ | $\delta(q,\varepsilon,B)=\{(q,BB1),\ (q,2)\}$ |
| terminal $x\in\{0,1,2\}$ | $\delta(q,x,x)=\{(q,\varepsilon)\}$ |

Each ε-move replaces a variable on top by one of its bodies; each input symbol must match the terminal on top. The PDA traces leftmost derivations, so it accepts exactly $L(G)$.

${fig("b11-1a")}

**Trace on 2210** ($S\Rightarrow BS\Rightarrow BB1S\Rightarrow 2B1S\Rightarrow\cdots$):
${pdaTraceTex(pdaAcceptingTrace(b11pda1, "2210", (left) => left + 1)!)}

(Checked against the grammar on every string over $\{0,1,2\}$ up to length 6.)

${derivation(b11g1, "2210", "lm")}`,

  "1b": r`**Theorem.** $L$ is context-free if and only if some PDA accepts $L$.

### (⇒) Every CFL is accepted by a PDA

Let $G=(V,T,P,S)$ generate $L$. Build the one-state PDA $P_G=(\{q\},T,V\cup T,\delta,q,S)$ accepting by empty stack: for each variable $A$, $\delta(q,\varepsilon,A)=\{(q,\beta) \mid A\to\beta\in P\}$; for each terminal $a$, $\delta(q,a,a)=\{(q,\varepsilon)\}$.

**Correctness.** By induction, $P_G$ goes from $(q,w,S)$ to $(q,y,\alpha)$ (having consumed $x$, where $w=xy$) exactly when there is a leftmost derivation $S\Rightarrow^*_{lm}x\alpha$ whose unmatched tail $\alpha$ is on the stack. In particular it empties its stack on $w$ iff $S\Rightarrow^*w$. So $N(P_G)=L(G)$; and a PDA accepting by empty stack can be converted to one accepting by final state.

### (⇐) Every PDA's language is context-free

${after(b13Solutions["7a"], "**Step 1: normalise $P$.**")}`,

  "2a": r`**Recognisable vs decidable.**

- $L$ is **Turing-recognisable** (Turing-acceptable, RE) if some TM $M$ accepts exactly $L$: on $w\in L$ it halts and accepts; on $w\notin L$ it may reject **or run forever**.
- $L$ is **decidable** (recursive) if some TM **halts on every input**, accepting exactly the strings of $L$.

So a recogniser may never give an answer on strings outside $L$; a decider always answers. Every decidable language is recognisable, but not conversely: the halting language below is recognisable but not decidable.

${after(b18Solutions["12"], "**HALT is RE.**").split("**The halting problem is not recursive.**")[0]}(It is **not** decidable; see the halting-problem proofs in later papers.)`,

  "2b": b22Solutions["7"],

  "3a": after(b22Solutions["10"], "**Simulation"),

  "3b": r`**High-level description.** $M$ = "On input $x$:

1. Check that $x$ contains exactly two −'s; otherwise reject.
2. Repeat: cross off (x) the first unmarked symbol $c$ of the first part; move right past the first −, skip x's and check that the first unmarked symbol is $c$, cross it off; do the same after the second −; return to the left end.
3. When the first part has no unmarked symbol left (the head reaches the first −), check that every symbol of the second and third parts is crossed off: accept if so, otherwise reject."

Each round crosses off three symbols, so $M$ always halts: it decides $L$. (Step 1 is folded into the matching: a missing or extra − leaves $M$ without a move.)

${fig("b11-3b")}

**Trace on a−a−a:**
${tmTraceTex(b11tmWww, "a-a-a", { stateTex: tmName })}

(Checked on every string over $\{a,b,-\}$ up to length 8.)`,

  "3c": r`**Idea.** First find the parity of $n$ by scanning $w$ (two states alternate on each symbol). At the blank after $w$, walk back to # overwriting every symbol with 0 (if $n$ is even) or 1 (if $n$ is odd), then accept.

${fig("b11-3c")}

${tmTableMd(b11tmPar, tmName)}

**Trace on #101** ($n=3$, odd: result #111):
${tmTraceTex(b11tmPar, "#101", { stateTex: tmName })}

(Checked on every input #w with $|w|\le8$: the tape always ends as $\#0^n$ or $\#1^n$ as required.)`,

  "4a": r`**Idea.** Every a and every b must be matched by a c. Push an X for each a and each b; pop one X for each c; accept when the stack is back to the bottom marker.

${fig("pda-sum")}

The states force the order $a^*b^*c^*$; the number of pops equals the number of pushes iff $k=i+j$. (This PDA is checked against the language in the PDA note.)`,

  "4b": b13Solutions["7c"],

  "4c": r`**Idea.** Push one X per symbol until a guessed middle **a**; then pop one X per symbol. The input is accepted iff the guessed a has equally many symbols on each side, i.e. it is the middle symbol of an odd-length string.

${fig("b11-4c")}

**Trace on bbabb:**
${pdaTraceTex(pdaAcceptingTrace(b11midA, "bbabb")!, pdaName)}

baab is rejected: it has even length, so no a can have equally many symbols on both sides. (Checked on every string over $\{a,b\}$ up to length 9.)`,

  "5a": b16Solutions["6"].split("### (b)")[0].replace("### (a) The grammar is ambiguous", "**Yes, the grammar is ambiguous.**"),

  "5b": r`$L=\{0^n \mid n \text{ is a perfect square}\}=\{\varepsilon,0,0^4,0^9,\dots\}$.

1. Assume $L$ is regular, with pumping length $p$, and take $s=0^{p^2}\in L$.
2. Any split has $y=0^k$ with $1\le k\le p$ (since $|xy|\le p$).
3. Pump up: $|xy^2z|=p^2+k$, and $p^2<p^2+k\le p^2+p<(p+1)^2$.
4. So $p^2+k$ lies strictly between consecutive squares: $xy^2z\notin L$. Contradiction.

Hence $L$ is not regular. (Brute-force checked for small $p$.)`,

  "5c": r`**Definition.** A language is **regular** if some finite automaton (DFA) recognises it; equivalently, if some NFA recognises it, or some regular expression describes it.

${after(b14Solutions["2b"], "### Concatenation")}`,

  "6a": r`**The two parts.** $L_1=\{a^nb^nc^m\}$ (a's match b's) and $L_2=\{a^nb^mc^m\}$ (b's match c's). Each part alone has an unambiguous grammar, e.g.
$$
S\to S_1\mid S_2,\quad S_1\to AC,\ A\to aAb\mid ab,\ C\to cC\mid c,\quad S_2\to DB,\ D\to aD\mid a,\ B\to bBc\mid bc.
$$
This grammar is ambiguous: $a^nb^nc^n$ is in both parts and has one tree through $S_1$ and one through $S_2$.

**Why every grammar for $L$ is ambiguous (idea of HMU's proof).**

- Any grammar for $L$ must generate the strings $a^nb^nc^m$ with $m\ne n$ by matching a's with b's, and $a^nb^mc^m$ with $m\ne n$ by matching b's with c's. A grammar cannot "count three things at once" (that would generate $\{a^nb^nc^n\}$, which is not context-free).
- Using the pumping lemma on a long string $a^nb^nc^{n+n!}$, one shows that the grammar must have a derivation in which a's and b's are generated together by a repeated variable; similarly for $a^{n+n!}b^nc^n$, b's and c's are generated together.
- Now consider $a^{n+n!}b^{n+n!}c^{n+n!}$: pumping both kinds of derivations appropriately gives **two** derivations of this same string, one through each kind of matching, with different parse trees.

So **every** grammar for $L$ gives some string two parse trees: $L$ is **inherently ambiguous**. Ambiguity cannot be removed by changing the grammar, because it comes from the language itself (the overlap $a^nb^nc^n$ must be explained both ways).`,

  "6b": r`**Yes: the pumping lemma** gives a test for *non*-regularity (it is a necessary condition for regularity, so a language that fails it is not regular). To prove a language **is** regular, construct a DFA, NFA or regular expression for it. (The Myhill–Nerode theorem gives an exact test, but it is not in this course.)

${b13Solutions["4b"]}

**How it is used.** To show $L$ is not regular: assume it is, take its pumping length $p$, choose a string $s\in L$ with $|s|\ge p$, and show that **every** split $s=xyz$ with $|xy|\le p$, $|y|>0$ has some $i$ with $xy^iz\notin L$.`,

  "6c": r`Even number of 1s:
$$
0^*(10^*10^*)^*.
$$
Leading 0s, then pairs of 1s with any 0s after each. (Checked on every binary string up to length 10.)`,

  "7a": r`$0^*1(0+1)^*$ = strings containing at least one 1 (some 0s, the first 1, then anything):
$$
\begin{aligned}
S&\to A1B\\
A&\to0A\mid\varepsilon\\
B&\to0B\mid1B\mid\varepsilon
\end{aligned}
$$
$A$ generates $0^*$ and $B$ generates $(0+1)^*$. (Checked on every binary string up to length 9.)

**Leftmost derivation of 00101:**
${derivation(b11g7a, "00101", "lm")}

**Rightmost derivation of 00101:**
${derivation(b11g7a, "00101", "rm")}`,

  "7b": r`The DFA: start 1; 2 and 3 accepting; $1\xrightarrow{a}2$, $1\xrightarrow{b}3$, $2\xrightarrow{a}1$, $2\xrightarrow{b}2$, $3\xrightarrow{a}2$, $3\xrightarrow{b}1$.

**Equations** (Arden's rule $X=AX+B \Rightarrow X=A^*B$). Let $L_q$ be the set of strings that lead from $q$ to an accepting state:
$$
\begin{aligned}
L_1&=aL_2+bL_3\\
L_2&=\varepsilon+aL_1+bL_2 \;\Rightarrow\; L_2=b^*(\varepsilon+aL_1)\\
L_3&=\varepsilon+aL_2+bL_1=\varepsilon+ab^*+(ab^*a+b)L_1.
\end{aligned}
$$
Substituting into $L_1$:
$$
L_1=ab^*(\varepsilon+aL_1)+b\big(\varepsilon+ab^*+(ab^*a+b)L_1\big)=(ab^*a+bab^*a+bb)\,L_1+(ab^*+b+bab^*),
$$
so by Arden's rule
$$
L_1=(ab^*a+bab^*a+bb)^*(ab^*+b+bab^*).
$$
The starred part is every way to leave state 1 and return to it ($a\,b^*\,a$ via 2; $b\,a\,b^*\,a$ via 3 and 2; $bb$ via 3); the final part is every way to end in 2 or 3.

(The expression was checked against the DFA on every string up to length 10.)`,

  "7c": r`**Idea.** Keep the value modulo 5: appending bit $b$ to $v$ gives $2v+b$, so $r_i\to r_{(2i+b)\bmod5}$. A separate start state $s$ rejects the empty string; leading zeros are fine. Accept in $r_0$.

${fig("b11-7c")}

${faRunTex(b11mult5, "1010", { name: sub })}
${faRunTex(b11mult5, "111", { name: sub })}

(Checked against the definition on every binary string up to length 11.)`,

  "8a": r`| | DFA | NFA |
|---|---|---|
| 1. Moves | exactly one next state for each state and symbol: $\delta:Q\times\Sigma\to Q$ | any number (including none) of next states: $\delta:Q\times\Sigma_\varepsilon\to\mathcal P(Q)$ |
| 2. ε-moves | not allowed | allowed: change state without reading input |
| 3. Acceptance | the unique run ends in an accepting state | **some** run ends in an accepting state |

**Examples** over $\{0,1\}$, "strings ending in 01":

- **NFA:** $q_0$ loops on 0, 1; $q_0\xrightarrow{0}q_1\xrightarrow{1}q_2$ (accepting). From $q_0$ on 0 there are two choices, and $q_1$ has no move on 0: both are impossible in a DFA.
- **DFA:** three states remembering the relevant suffix (none, "0", "01"), with every state having exactly one move on each symbol.

Also: an NFA is often much smaller (an NFA for "the $n$-th symbol from the end is 1" has $n+1$ states; any DFA needs $2^n$), but both recognise exactly the regular languages (subset construction).`,

  "8b": r`**Theorem (Kleene).** A language is regular iff some regular expression describes it.

### (⇐) Every regular expression describes a regular language

By induction on the structure of $R$, build an NFA for $L(R)$:

- $R=a$: two states, $q_0\xrightarrow{a}q_1$, $q_1$ accepting. $R=\varepsilon$: one accepting start state. $R=\emptyset$: one non-accepting state.
- $R=R_1\cup R_2$, $R_1R_2$, $R_1^*$: combine the NFAs for $R_1$, $R_2$ by the union, concatenation and star constructions (each adds ε-moves and at most one new start state).

So $L(R)$ is recognised by an NFA, hence by a DFA: it is regular.

### (⇒) Every regular language is described by a regular expression

Let $D$ be a DFA for $L$. Convert it into a **generalised NFA** (GNFA), whose edges are labelled by regular expressions:

1. Add a new start state with an ε-edge to $D$'s start, and a new single accepting state with ε-edges from $D$'s accepting states. Label missing edges $\emptyset$; combine parallel edges with $\cup$.
2. **Eliminate the other states one at a time.** To remove $q_{rip}$, for every pair $q_i,q_j$ replace the label $R_{ij}$ by
$$
R_{ij}\ \cup\ R_{i,rip}\,(R_{rip,rip})^*\,R_{rip,j}.
$$
This keeps the language: any path through $q_{rip}$ (entering, looping, leaving) is described by the new label.
3. When only the start and accepting states remain, the label on the edge between them is a regular expression for $L$.

(Each elimination preserves the language, by induction on the number of states.) $\blacksquare$`,

  "8c": r`$L=\{0^n10^n \mid n>1\}$.

1. Assume $L$ is regular with pumping length $p$, and take $s=0^{p+2}10^{p+2}\in L$ (the exponent is greater than 1 and at least $p$).
2. Any split with $|xy|\le p$ has $y=0^k$, $1\le k\le p$, inside the first block of 0s.
3. Pump down: $xz=0^{p+2-k}10^{p+2}$ has fewer 0s before the 1 than after, so $xz\notin L$.
4. Contradiction; $L$ is not regular.

(Brute-force checked over every legal split for small $p$.)`,
}


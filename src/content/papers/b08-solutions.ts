/* Worked solutions for the 8-batch (2009-2010) paper, keyed by part ("1", "10a", "13d"). */
import { closureTableMd, faRunTex, pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { grammarTex } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import { b08cfg11b, b08eq, b08g11, b08g6, b08pal, b08palEven, b08pda11, b08q2, b08q3, b08tmAcbd } from "../machines/b08"
import { after } from "./compose"
import { b09Solutions } from "./b09-solutions"
import { b14Solutions } from "./b14-solutions"
import { b15Solutions } from "./b15-solutions"
import { b20Solutions } from "./b20-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const tmName = (q: string) => (q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b08Solutions: Record<string, string> = {
  "1": r`The statement means: **nondeterminism adds convenience but no power** to finite automata. Every language accepted by an NFA (even with ε-moves) is accepted by some DFA.

${b20Solutions["2a"]}

**The proof** is the subset construction: a DFA whose states are sets of NFA states tracks all branches at once.

${after(b09Solutions["1"], "**Construction (subset construction).**")}`,

  "2": r`**Reading.** Let $c$ be the first symbol. The string is rejected if $ccc$ appears anywhere (including at the start). Only runs of the first symbol matter: abaab is fine (no aaa), and baaabba is fine (it starts with b and has no bbb, even though it has aaa).

**Design.** The first symbol chooses one of two copies of a small "count the current run" DFA:

| State | Meaning |
|---|---|
| $s$ | nothing read (accepting: ε contains no three copies) |
| $a_0$ / $a_1$ / $a_2$ | first symbol a; the current run of a's at the end has length 0 / 1 / 2 |
| $b_0$ / $b_1$ / $b_2$ | the same with b |
| $d$ | three copies of the first symbol in a row (dead) |

${fig("b08-2")}

${faRunTex(b08q2, "baaabba", { name: sub })}
${faRunTex(b08q2, "abaaab", { name: sub })}

(Checked on every string up to length 10 and on the four examples.)`,

  "3": r`**ε-closures** (from the figure: $q_1\xrightarrow{\varepsilon}q_2$, $q_3\xrightarrow{\varepsilon}q_5$, $q_4\xrightarrow{\varepsilon}q_5$):

${closureTableMd(b08q3)}

**Lazy evaluation**, starting from $E(q_1)=\{q_1,q_2\}$:

${subsetTableMd(b08q3)}

${fig("b08-3")}

Four reachable states; the accepting ones contain $q_5$. (The DFA was checked against the ε-NFA on every string up to length 9.)`,

  "4": r`$L_1=1(1\cup0)^*000$: strings that **start with 1 and end with 000**. $L_2=(1(01)^*0)^*$: concatenations of blocks $1(01)^k0$, i.e. 10, 1010, 101010, …; in particular $\varepsilon\in L_2$.

$w\in L_1\circ L_2$ iff $w=xy$ with $x\in L_1$ and $y\in L_2$.

**(a) 1000: yes.** Take $x=1000\in L_1$ (1, then the empty middle, then 000) and $y=\varepsilon\in L_2$.

**(b) 1000101010: yes.** $x=1000\in L_1$, $y=101010=1(01)^20\in L_2$.

**(c) 10000111000100000: yes.** The whole string starts with 1 and ends with 000, so $x=10000111000100000\in L_1$ and $y=\varepsilon$. (Since $\varepsilon\in L_2$, $L_1\subseteq L_1\circ L_2$.)

(All three confirmed by matching against the regular expression $L_1L_2$.)`,

  "5": b15Solutions["4c"],

  "6": r`**(a)** Nonterminals: $\langle pop\rangle$, $\langle bop\rangle$, $\langle boop\rangle$. Terminals: $[\ ,\ ]\ ,\ (\ ,\ )\ ,\ x,\ y,\ z$ (the brackets, the comma, the parentheses and the three letters).

**(b)** The start symbol is $\langle pop\rangle$: it is the head of the first rule, it is the only nonterminal not used inside another nonterminal's definition except recursively, and every sentence is built from it (by convention the first rule's head is the start symbol).

**(c)** The sentence in the question cannot be read on the scan. A parse tree for the sample sentence $[x,[y,z]]$ (a list containing $x$ and the list $[y,z]$):

${derivation(b08g6, "[x,[y,z]]", "lm")}

${fig("b08-6")}

(In the grammar here $P$, $B$, $O$ stand for $\langle pop\rangle$, $\langle bop\rangle$, $\langle boop\rangle$.)`,

  "7": r`**Palindromes over $\{0,1\}$:**
$$
P\to\varepsilon\mid0\mid1\mid0P0\mid1P1.
$$
A palindrome is empty, a single symbol, or a symbol, a palindrome, and the same symbol again. (Checked up to length 9.)

**Over $\{0,1,a\}$, even length only:** add a rule for the new symbol and drop the single-symbol rules (which create the odd-length middle):
$$
P\to\varepsilon\mid0P0\mid1P1\mid aPa.
$$
Every rule adds two symbols, so all strings have even length. (Checked up to length 8.)

${derivation(b08palEven, "0aa0", "lm")}
${derivation(b08pal, "101", "lm")}`,

  "8": r`Both are ways to show that a string $w$ is in $L(G)$; they build the same parse tree in opposite directions.

**Recursive inference (bottom-up).** Start from the body: terminals are in the language of no variable yet; if $A\to X_1\cdots X_k$ is a rule and each $X_i$ is a terminal or a variable already known to derive $w_i$, infer that $A$ derives $w_1\cdots w_k$. Repeat until $S$ is shown to derive $w$.

**Derivation (top-down).** Start from $S$ and repeatedly replace a variable by one of its bodies: $S\Rightarrow\alpha_1\Rightarrow\cdots\Rightarrow w$.

**Example.** $G$: $E\to E+E\mid a$, $w=a+a$.

- Inference: $a$ is an $E$ (rule $E\to a$), twice; then $E+E$ with both parts known gives $a+a$ is an $E$.
- Derivation: $E\Rightarrow E+E\Rightarrow a+E\Rightarrow a+a$.

**Similarities.** For a CFG the following are equivalent (HMU): (1) $w$ is inferred to be in the language of $A$; (2) $A\Rightarrow^*w$; (3) $A\Rightarrow^*_{lm}w$; (4) $A\Rightarrow^*_{rm}w$; (5) there is a parse tree with root $A$ and yield $w$. So both describe the same language, and either can be converted into a parse tree.

**Differences.** Inference works on **terminal strings** only and goes from the leaves up; a derivation passes through **sentential forms** containing variables and goes from the root down. A derivation also fixes an order of expansion (leftmost, rightmost, …), which inference does not.`,

  "9": r`**Grammar:**
$$
S\to aSbS\mid bSaS\mid\varepsilon
$$
Each rule adds one a and one b, so every generated string is balanced. Conversely, a nonempty balanced string starting with a splits as $a\,u\,b\,v$ at the first point where the counts become equal, with $u$, $v$ balanced (symmetrically for b). (Checked up to length 10.)

**Leftmost derivation of aabbab:**
${derivation(b08eq, "aabbab", "lm")}`,

  "10a": r`**Definition (Sipser).** A PDA is a 6-tuple $(Q,\Sigma,\Gamma,\delta,q_0,F)$: states $Q$, input alphabet $\Sigma$, stack alphabet $\Gamma$, transition function $\delta: Q\times\Sigma_\varepsilon\times\Gamma_\varepsilon\to\mathcal P(Q\times\Gamma_\varepsilon)$, start state $q_0$, accepting states $F$. A move reads an input symbol (or nothing), pops a stack symbol (or nothing), pushes a symbol (or nothing) and changes state. (HMU adds a start stack symbol $Z_0$ and allows pushing strings.)

**i) $\{0^n1^n \mid n\ge1\}$.** Push a bottom marker; push a 0 for each 0; pop one for each 1; accept when the marker reappears. The PDA below accepts $n\ge0$; to exclude $\varepsilon$, require the first 0 on a separate move (or make the start state non-accepting, as here, and go to the popping state only after at least one 0).

${fig("pda-0n1n")}

**ii) Equal numbers of 0s and 1s.** Keep the surplus on the stack: push a symbol when it matches the top (or the stack is empty), pop when it differs; accept when only the bottom marker remains.

${fig("pda-equal")}

**iii) Palindromes.** Push the first half, guess the middle (between symbols, or on a single middle symbol), pop and match.

${fig("pda-pal")}

(All three PDAs are checked against their languages in the PDA note.)`,

  "10b": r`**i) Transition diagram** (HMU labels: input, top $\to$ replacement):

${fig("b08-10b")}

**ii) Final state → empty stack.** This is the same PDA as 2015–16 Q5, with start symbol $Z$.

${after(b14Solutions["6b"], "**Final state $\\Rightarrow$ empty stack.**")}

**Applied to $P$:** new start $p_0$ with $\delta_1(p_0,\varepsilon,X_0)=\{(q,ZX_0)\}$; all seven moves of $P$; from the accepting state $p$, $\delta_1(p,\varepsilon,Y)\ni(r,\varepsilon)$ for $Y\in\{Z,X,X_0\}$; and $\delta_1(r,\varepsilon,Y)=\{(r,\varepsilon)\}$ for every $Y$. (The figure's right panel; the new PDA was checked to accept by empty stack exactly what $P$ accepts by final state, on every string up to length 9.)`,

  "11a": r`**One-state PDA (HMU construction), acceptance by empty stack:** $P=(\{q\},\{0,1\},\{S,A,B,0,1\},\delta,q,S)$ with

| Top | Moves |
|---|---|
| $S$ | $\delta(q,\varepsilon,S)=\{(q,AS),\ (q,A)\}$ |
| $A$ | $\delta(q,\varepsilon,A)=\{(q,0A),\ (q,1B),\ (q,1)\}$ |
| $B$ | $\delta(q,\varepsilon,B)=\{(q,0B),\ (q,0)\}$ |
| 0 | $\delta(q,0,0)=\{(q,\varepsilon)\}$ |
| 1 | $\delta(q,1,1)=\{(q,\varepsilon)\}$ |

${fig("b08-11a")}

${pdaTraceTex(pdaAcceptingTrace(b08pda11, "0110", (left) => left + 1)!)}

(Checked against the grammar on every binary string up to length 7.)

${derivation(b08g11, "0110", "lm")}`,

  "11b": r`**Construction (HMU, empty-stack PDA → CFG).** Variables $[sXt]$ mean "from state $s$ with $X$ on top, the PDA eventually pops $X$ and is then in state $t$". Rules:

- $S\to[qZt]$ for each state $t\in\{p,q\}$;
- $\delta(s,a,X)\ni(r,\varepsilon)$ gives $[sXr]\to a$;
- $\delta(s,a,X)\ni(r,Y_1Y_2)$ gives $[sXt]\to a[rY_1u][uY_2t]$ for all states $u,t$;
- $\delta(s,a,X)\ni(r,Y)$ gives $[sXt]\to a[rYt]$ for every $t$.

**Applying it:**

- $\delta(q,1,Z)=\{(q,XZ)\}$: $[qZt]\to1[qXu][uZt]$ for $u,t\in\{p,q\}$;
- $\delta(q,0,X)=\{(p,X)\}$: $[qXt]\to0[pXt]$;
- $\delta(p,1,X)=\{(p,\varepsilon)\}$: $[pXp]\to1$.

${grammarTex(b08cfg11b.full)}

**Simplifying.** No move pops $Z$, so $[pZp]$, $[pZq]$ (and therefore $[qZq]$, $[qZp]$) generate no terminal string: they are all useless, and so is $S$. **The grammar generates the empty language.** That matches the PDA: it can never empty its stack (the bottom $Z$ is never removed), so it accepts nothing by empty stack. (Both facts were checked by machine.)

If the PDA were meant to accept by final state or to pop $Z$ at the end (e.g. with a move $\delta(p,\varepsilon,Z)=\{(p,\varepsilon)\}$), the same construction would give $[pZp]\to\varepsilon$ and the grammar $S\to1\,0\,1$, i.e. $\{101\}$.`,

  "11c": r`A **deterministic PDA** has at most one possible move in every situation:

1. for each state $q$, input $a\in\Sigma$ and stack top $X$, $|\delta(q,a,X)|\le1$;
2. if $\delta(q,\varepsilon,X)\ne\emptyset$, then $\delta(q,a,X)=\emptyset$ for every $a\in\Sigma$ (no choice between an ε-move and reading input).

DPDAs (accepting by final state) recognise the **deterministic CFLs**, a proper subclass of the CFLs that contains all regular languages. They are what parsers for programming languages use, and every DCFL has an unambiguous grammar.

**Example:** $\{wcw^R \mid w\in\{0,1\}^*\}$. Push symbols until the c; then pop and match; accept when $Z_0$ is exposed. Every step has exactly one choice, because the c marks the middle. In contrast $\{ww^R\}$ (no middle marker) needs a guess of the middle and has **no** DPDA.

${fig("b13-6c")}`,

  "12a": r`**Formal definition (Lewis–Papadimitriou).** A Turing machine is a 5-tuple $M=(K,\Sigma,\delta,s,H)$: a finite set of states $K$; an alphabet $\Sigma$ containing the blank $\sqcup$ and the left-end symbol $\triangleright$; a start state $s\in K$; a set of halting states $H\subseteq K$; and a transition function $\delta:(K-H)\times\Sigma\to K\times(\Sigma\cup\{\leftarrow,\rightarrow\})$ (write a symbol, or move left/right). On $\triangleright$ the machine must move right, and it never writes $\triangleright$.

**A TM that scans right until it finds two consecutive a's, then halts.** $K=\{q_0,q_1,q_2,h\}$, $s=q_0$, $H=\{h\}$, $\Sigma=\{a,b,\sqcup,\triangleright\}$. $q_0$: start, move right onto the input; $q_1$: the last symbol read was not a; $q_2$: the last symbol read was a.

| State | $a$ | $b$ | $\sqcup$ | $\triangleright$ |
|---|---|---|---|---|
| $q_0$ | $(q_1,\rightarrow)$ | $(q_1,\rightarrow)$ | $(q_1,\rightarrow)$ | $(q_0,\rightarrow)$ |
| $q_1$ | $(q_2,\rightarrow)$ | $(q_1,\rightarrow)$ | $(q_1,\rightarrow)$ | $(q_1,\rightarrow)$ |
| $q_2$ | $(h,a)$ | $(q_1,\rightarrow)$ | $(q_1,\rightarrow)$ | $(q_2,\rightarrow)$ |

(Here $q_0$ is entered at the left end on $\triangleright$; the first move goes onto the first input cell. Reading a in $q_1$ moves on to $q_2$; reading a again in $q_2$ means aa has been found, and the machine halts, rewriting the a unchanged. If the input has no aa, the machine runs right for ever over blanks.)`,

  "12b": r`**Idea.** Repeatedly cross off one a, one c, one b and one d (marking them W, X, Y, Z), each time returning to the left. When no a is left, check that only marks remain. The order $a^*c^*b^*d^*$ and the equal counts are both enforced, because each sweep must find the next unmarked symbol of each block in order.

1. $q_0$: at the leftmost unmarked a: mark it W ($q_1$). A blank (empty input, $n=0$): accept.
2. $q_1$: skip a's and X's; mark the first c as X ($q_2$).
3. $q_2$: skip c's and Y's; mark the first b as Y ($q_3$).
4. $q_3$: skip b's and Z's; mark the first d as Z and turn left ($q_4$).
5. $q_4$: back to the last W; step right into $q_0$.
6. If $q_0$ sees X, every a is used: $q_5$ checks that only X, Y, Z follow, and accepts at the blank.

${tmTableMd(b08tmAcbd, tmName)}

**Trace on acbd:**
${tmTraceTex(b08tmAcbd, "acbd", { stateTex: tmName })}

Any missing, extra or misplaced symbol leaves the machine without a move (reject); every round marks four symbols, so it always halts. (Checked on every string over $\{a,b,c,d\}$ up to length 8.)`,

  "12c": r`**Set-up.** Tape 1 holds $x;y$ (binary, $x\ge y$). Tape 2 will hold $y$, tape 3 the result $x-y$.

1. **Copy $y$ to tape 2.** Move tape 1's head past the ;, copy $y$ onto tape 2 (and erase it with the ; from tape 1, leaving only $x$). Move both heads to the **right ends** (least significant bits) of $x$ and $y$.
2. **Subtract right to left with a borrow** kept in the finite control (states $b_0$: no borrow, $b_1$: borrow). At each step read bit $u$ of $x$ (tape 1) and bit $v$ of $y$ (tape 2, or 0 once $y$ is used up), and with borrow $c$ compute
$$
d=u-v-c,\qquad \text{write } d \bmod 2 \text{ on tape 3},\qquad \text{new borrow }=1 \text{ if } d<0.
$$
   | $u$ | $v$ | $c$ | write | new borrow |
   |---|---|---|---|---|
   | 0 | 0 | 0 | 0 | 0 |
   | 1 | 0 | 0 | 1 | 0 |
   | 0 | 1 | 0 | 1 | 1 |
   | 1 | 1 | 0 | 0 | 0 |
   | 0 | 0 | 1 | 1 | 1 |
   | 1 | 0 | 1 | 0 | 0 |
   | 0 | 1 | 1 | 0 | 1 |
   | 1 | 1 | 1 | 1 | 1 |

   Move all three heads one cell left after each bit (tape 3 is written right to left).
3. **Finish.** When the left end of $x$ is reached, the borrow is 0 (since $x\ge y$). The result is on tape 3 (strip leading 0s if wanted); copy it back to tape 1 if the answer must be there, and halt.

Each bit takes a constant number of moves, so the machine runs in $O(n)$ time; on one tape the same method would need $O(n^2)$ because the head would shuttle between $x$ and $y$. (This is a design description; the site's simulator runs one-tape machines only.)

Example: $x=1011$ (11), $y=11$ (3). Bits from the right: $1-1=0$; $1-1=0$; $0-0=0$; $1-0=1$: result 1000 (8).`,

  "13a": r`**Yes.** A Turing machine may **loop for ever** on some inputs: it never enters a halting state. This is unavoidable in general (it is what makes the halting problem undecidable).

**Example.** $M$ over $\{0,1\}$: in state $q_0$, on 0 write 0 and move right staying in $q_0$; on a blank, write blank and move **left** into $q_1$; in $q_1$, on 0 move **right** into $q_0$. On input 0, $M$ moves right to the blank, left to the 0, right to the blank, … for ever. More naturally, a TM that searches for a counterexample to a conjecture (e.g. "an even number greater than 2 that is not the sum of two primes") halts only if one exists.

So the possible outcomes of running a TM are **accept**, **reject** and **loop**; a *decider* is a TM that never loops.`,

  "13b": r`Let $M$ be a TM that decides $L$: it **halts on every input**, accepting exactly the strings of $L$. Build $\overline M$ from $M$ by **swapping its accept and reject states** (for HMU-style machines that halt only by having no move, add an explicit reject state: if $M$ halts in a non-accepting state, $\overline M$ moves to its accept state).

- $\overline M$ halts on every input, because $M$ does and the swap does not change the moves.
- $\overline M$ accepts $w$ iff $M$ rejects $w$ iff $w\notin L$.

So $\overline M$ decides $\overline L$, and $\overline L$ is recursive. $\blacksquare$

(This fails for RE languages: if $M$ only recognises $L$, it may loop on strings not in $L$, and swapping accept and reject does not make it accept them.)`,

  "13c": r`A **universal Turing machine** $U$ takes as input the **encoding** of any TM $M$ together with an input $w$, written $\langle M,w\rangle$ (for example, $M$'s binary code, then 111, then $w$), and **simulates** $M$ on $w$:
$$
U \text{ accepts } \langle M,w\rangle \iff M \text{ accepts } w.
$$

**How it works (HMU's multitape $U$).**

1. Tape 1 holds $\langle M,w\rangle$; $U$ first checks that the code is a valid TM.
2. Copy $w$ onto tape 2, encoding each symbol $X_j$ of $M$ as $0^j$ separated by 1s; this tape plays the role of $M$'s tape.
3. Tape 3 holds $M$'s current state, $q_i$ written as $0^i$ (initially $q_1$).
4. **Repeat:** find on tape 1 the move $0^i10^j10^k10^l10^m$ that matches the current state $0^i$ and the symbol $0^j$ under tape 2's head. Change tape 3 to $0^k$, replace the symbol on tape 2 by $0^l$ (shifting if the lengths differ), and move tape 2's head left or right as $D_m$ says.
5. If $M$ enters its accepting state, $U$ accepts; if $M$ has no move, $U$ halts and rejects; if $M$ runs for ever, so does $U$.

**Example.** $M$ with the single move $\delta(q_1,0)=(q_2,1,R)$, accepting state $q_2$, has code $0\,1\,0\,1\,00\,1\,00\,1\,00$. On $\langle M,0\rangle$, $U$ looks up the move for state $q_1$ and symbol 0, writes 1, moves right, sets the state to $q_2$ and accepts, exactly as $M$ accepts 0.

**Why it matters.** $U$ is a single, fixed machine that can run any program: the idea of a stored-program computer. Its language $L_u=\{\langle M,w\rangle \mid M \text{ accepts } w\}$ is RE but not recursive.`,

  "13d": r`**The halting problem:** given a TM $M$ and input $w$, does $M$ halt on $w$? As a language, $\text{HALT}=\{\langle M,w\rangle \mid M \text{ halts on } w\}$. It is **undecidable**: no algorithm answers this for all $M$, $w$.

**Example.** A program that, for $n=4,6,8,\dots$, checks whether $n$ is a sum of two primes and halts if it finds one that is not. It halts iff Goldbach's conjecture is false; deciding whether it halts would settle the conjecture. A general halting decider would settle every such question.

**Why it is undecidable (sketch).** Suppose $H$ decided HALT. Build $D$: on input $\langle M\rangle$, run $H$ on $\langle M,\langle M\rangle\rangle$; if $H$ says "halts", loop for ever; if it says "does not halt", halt. Then $D$ on $\langle D\rangle$ halts iff it does not halt: a contradiction. (HALT is still RE: simulate $M$ on $w$ and accept if it halts.)`,
}

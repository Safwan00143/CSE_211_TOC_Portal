/* Worked solutions for the 5-batch (2006-2007) paper, keyed by part ("1a", "5", "13"). */
import { faRunTex, faTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { derivation } from "@/lib/derivations"
import { b05exprFixed, b05g5, b05g6, b05q1a, b05q2b, b05tm12, b05tmXor, ithBinary } from "../machines/b05"
import { after } from "./compose"
import { b06Solutions } from "./b06-solutions"
import { b09Solutions } from "./b09-solutions"
import { b15Solutions } from "./b15-solutions"
import { b21Solutions } from "./b21-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const n1 = (q: string) => ({ zo: "z_o", ze: "z_e", oo: "o_o", oe: "o_e" })[q] ?? q
const xorName = (q: string) => ({ q0: "q_0", c0: "c_0", c1: "c_1", d0: "d_0", d1: "d_1", b1: "b_1", b2: "b_2", qf: "q_f" })[q] ?? q

export const b05Solutions: Record<string, string> = {
  "1a": r`**Design.** The first symbol decides the required parity of the length, so remember it, and then track the parity:

| State | Meaning |
|---|---|
| $s$ | nothing read |
| $z_o$ / $z_e$ | started with 0; length so far odd / even |
| $o_o$ / $o_e$ | started with 1; length so far odd / even |

Accept $z_o$ (starts with 0, odd length) and $o_e$ (starts with 1, even length).

${fig("b05-1a")}

${faTableMd(b05q1a, { label: n1 })}

${faRunTex(b05q1a, "010", { name: n1 })}
${faRunTex(b05q1a, "10", { name: n1 })}

(Checked on every binary string up to length 10.)`,

  "1b": after(b15Solutions["3b"], "**(i) Alternating 0s and 1s**").split("**(ii)")[0],

  "1c": r`**Both are languages over every alphabet.** A language over $\Sigma$ is any subset of $\Sigma^*$.

- $\emptyset$ (the empty language) contains **no strings**; it is a subset of every $\Sigma^*$.
- $\{\varepsilon\}$ contains exactly **one string**, the empty string $\varepsilon$, which belongs to $\Sigma^*$ for every $\Sigma$ (the string of length 0 needs no symbols).

So both are languages over any alphabet. (The question writes "$\varepsilon$" for the language $\{\varepsilon\}$.)

**They are not equivalent.** $|\emptyset|=0$ but $|\{\varepsilon\}|=1$. They also behave differently:

- Concatenation: $L\emptyset=\emptyset$ but $L\{\varepsilon\}=L$.
- Star: $\emptyset^*=\{\varepsilon\}$ and $\{\varepsilon\}^*=\{\varepsilon\}$.
- Automata: a DFA for $\emptyset$ has no reachable accepting state; a DFA for $\{\varepsilon\}$ has an accepting start state and every move leads to a dead state.`,

  "2a": b06Solutions["2a"],

  "2b": r`**Design.** Track the parity of 0s and of 1s: four states $ee, eo, oe, oo$ (first letter: 0s, second: 1s). Reading 0 flips the first parity, reading 1 the second. Start $ee$ (no symbols); accept $eo$ (even 0s, odd 1s).

${fig("b05-2b")}

${faTableMd(b05q2b)}

**$\hat\delta(q_0,11010)$** with $q_0=ee$:
${faRunTex(b05q2b, "11010")}

$\hat\delta(ee,11010)=eo$, which is accepting: 11010 has two 0s (even) and three 1s (odd). (Checked on every binary string up to length 10.)`,

  "2c": r`A DFA has a single path of computation: each input symbol determines the next state. An NFA may have **several** choices (or none) at each step, so its computation on an input is a **tree**:

- the **root** is the start state;
- each node is a state reached after reading some prefix; its **children** are all the states reachable by the next symbol (after following ε-moves);
- a branch **dies** when there is no move;
- the input is **accepted** if **some** leaf at depth $|w|$ (after the whole input) is an accepting state.

**Example.** NFA over $\{0,1\}$ for "ends in 01": $q_0$ loops on 0,1; $q_0\xrightarrow{0}q_1\xrightarrow{1}q_2$ (accepting). On input 001:

| Read | Possible states |
|---|---|
| (start) | $q_0$ |
| 0 | $q_0$, $q_1$ |
| 0 | $q_0$, $q_1$ (from $q_0$); the branch in $q_1$ dies (no move on 0) |
| 1 | $q_0$ (from $q_0$), $q_2$ (from $q_1$) |

One leaf is $q_2$, so 001 is accepted. Each level of the tree is exactly a state of the subset-construction DFA (here $\{q_0\}$, $\{q_0,q_1\}$, $\{q_0,q_2\}$), which is why the tree view explains why NFAs and DFAs are equivalent.`,

  "3a": r`$L=\{w\in\{0,1\}^* \mid w \text{ has equally many 0s and 1s}\}$.

1. Assume $L$ is regular, with pumping length $p$.
2. Take $s=0^p1^p\in L$, $|s|=2p\ge p$.
3. Any split $s=xyz$ with $|xy|\le p$, $|y|>0$ has $y=0^k$, $1\le k\le p$.
4. Pump up: $xy^2z=0^{p+k}1^p$ has more 0s than 1s, so it is not in $L$.
5. Contradiction; $L$ is not regular. $\blacksquare$

(The order of the symbols does not matter for $L$, but choosing a string in which the first $p$ symbols are all 0 lets $|xy|\le p$ pin down $y$. Brute-force checked in the pumping-lemma note.)`,

  "3b": r`**Lazy evaluation** builds only the DFA states that are reachable, instead of all $2^{|Q|}$ subsets.

1. **Compute ε-closures.** For each NFA state $q$, $E(q)$ = all states reachable from $q$ by ε-moves alone (including $q$).
2. **Start state.** $q_D=E(q_0)$. Put it in a work list.
3. **Process each new DFA state** $S$ from the work list. For each symbol $a$:
   - compute $\bigcup_{p\in S}\delta_N(p,a)$, the states reachable by one $a$-move from any state of $S$;
   - take the ε-closure of that set: $\delta_D(S,a)=E\big(\bigcup_{p\in S}\delta_N(p,a)\big)$;
   - if this set has not been seen before, add it to the DFA and to the work list. (The empty set is a dead state.)
4. **Repeat** until the work list is empty.
5. **Accepting states:** every DFA state $S$ that contains at least one accepting NFA state.

Only the subsets reachable from $q_D$ are ever created, which usually gives far fewer than $2^{|Q|}$ states. Worked examples: 2009–10 Q3 and January 2020 Q4(b).`,

  "3c": r`**Enumeration.** The binary strings can be listed in a fixed order, so that each string gets a position number: by **length**, and within each length in **numerical** (lexicographic) order:
$$
\varepsilon,\ 0,\ 1,\ 00,\ 01,\ 10,\ 11,\ 000,\ 001,\ \dots
$$
(HMU's rule: the $i$-th string $w_i$ is the string such that $1w_i$ is $i$ written in binary.) This shows the set of binary strings is **countable**, and it is how TMs and strings are numbered for the diagonalisation argument.

**The 13th string.** $13=1101_2$; drop the leading 1: **$w_{13}=$ 101**. Check by counting: positions 1–7 are $\varepsilon$, 0, 1, 00, 01, 10, 11; then 000 (8), 001 (9), 010 (10), 011 (11), 100 (12), **101 (13)**.

(Computed: the 13th string is ${ithBinary(13)}.)`,

  "4a": b21Solutions["12"],

  "4b": r`With $\Sigma=\{0,1\}$:

| | Expression | Language |
|---|---|---|
| i | $0^*10^*$ | strings with **exactly one** 1 |
| ii | $\Sigma^*1\Sigma^*$ | strings with **at least one** 1 |
| iii | $1^*(01^+)^*$ | strings in which **every 0 is immediately followed by at least one 1** |
| iv | $(\Sigma\Sigma\Sigma)^*$ | strings whose **length is a multiple of 3** |
| v | $0\Sigma^*0\cup1\Sigma^*1\cup0\cup1$ | nonempty strings that **start and end with the same symbol** |
| vi | $01\cup10$ | exactly the two strings $\{01,10\}$ |
| vii | $(0\cup\varepsilon)1^*$ | $01^*\cup1^*$: any number of 1s, optionally preceded by **one** 0 |
| viii | $(01\cup010)^*$ | all concatenations of the blocks 01 and 010, e.g. $\varepsilon$, 01, 010, 0101, 01001, 010010; in particular the strings are empty or start with 0, and contain no 11 and no 000 |

(Descriptions i–vii were checked against the expressions by machine on all strings up to length 8 or 9.)`,

  "4c": r`**Encoding (HMU).** States $q_1,q_2,q_3$ ($q_1$ start, $q_2$ accepting) are coded $0^i$; tape symbols $X_1=0$, $X_2=1$, $X_3=B$ are coded $0^j$; directions $D_1=L$, $D_2=R$ are coded $0^m$. A move $\delta(q_i,X_j)=(q_k,X_l,D_m)$ is coded $0^i10^j10^k10^l10^m$, and the machine is the list of move codes separated by 11.

| Move | $i,j,k,l,m$ | Code |
|---|---|---|
| $\delta(q_1,1)=(q_3,0,R)$ | 1, 2, 3, 1, 2 | $0\,1\,00\,1\,000\,1\,0\,1\,00$ |
| $\delta(q_3,0)=(q_1,1,R)$ | 3, 1, 1, 2, 2 | $000\,1\,0\,1\,0\,1\,00\,1\,00$ |
| $\delta(q_3,1)=(q_2,0,R)$ | 3, 2, 2, 1, 2 | $000\,1\,00\,1\,00\,1\,0\,1\,00$ |
| $\delta(q_3,B)=(q_3,1,L)$ | 3, 3, 3, 2, 1 | $000\,1\,000\,1\,000\,1\,00\,1\,0$ |

**Code of $M$:**
$$
0100100010100\ 11\ 0001010100100\ 11\ 00010010010100\ 11\ 0001000100010010.
$$
(Any order of the four moves gives a valid code of $M$.)`,

  "5": r`**Definition.** A context-free grammar is $G=(V,T,P,S)$: variables $V$, terminals $T$ (disjoint from $V$), productions $P$ of the form $A\to\alpha$ with $A\in V$, $\alpha\in(V\cup T)^*$, and start variable $S\in V$.

**Grammar for $\{a^mb^n \mid m>n,\ n\ge1\}$:**
$$
\begin{aligned}
S&\to aSb\mid aAb\\
A&\to aA\mid a
\end{aligned}
$$
$S$ wraps matching pairs $a\ldots b$ around a core $aAb$, which has at least one extra a ($A$ produces $a^+$). So every string has $n\ge1$ b's and $m=n+(\text{at least }1)$ a's. (Checked on every string up to length 10.)

${derivation(b05g5, "aaab", "lm")}`,

  "6": r`**Parse tree.** For a CFG, a tree whose interior nodes are labelled by variables, leaves by terminals, variables or $\varepsilon$, and in which each interior node $A$ with children $X_1\cdots X_k$ corresponds to a production $A\to X_1\cdots X_k$. **Yield:** the string of leaf labels read left to right; for a complete tree rooted at the start symbol it is a string of the language.

**(i) Leftmost derivation of** bin_ab00=101,b1,b1;
${derivation(b05g6, "bin_ab00=101,b1,b1;", "lm")}

**(ii) Rightmost derivation of** bin_a=10,b=1;
${derivation(b05g6, "bin_a=10,b=1;", "rm")}

(The grammar is the declaration grammar: $T$ is the type keyword, $L$ a comma-separated list of variables $V$, each an identifier $I$ optionally initialised with a binary number $N$. Both derivations were generated from the grammar by machine.)`,

  "7": r`**Ambiguous.** $a+a*a$ has two parse trees (the grammar does not fix precedence), shown here with $I\Rightarrow a$ in each leaf:

${fig("cfg-amb-expr")}

$E\Rightarrow E+E\Rightarrow I+E\Rightarrow a+E\Rightarrow a+E*E\Rightarrow\cdots\Rightarrow a+a*a$ and $E\Rightarrow E*E\Rightarrow E+E*E\Rightarrow\cdots\Rightarrow a+a*a$ are two different leftmost derivations. (Also $a+a+a$ has two trees: associativity is not fixed.)

**Unambiguous grammar** (HMU): one variable per precedence level.
$$
\begin{aligned}
E&\to E+T\mid T\\
T&\to T*F\mid F\\
F&\to(E)\mid I\\
I&\to a\mid b\mid Ia\mid Ib\mid I0\mid I1
\end{aligned}
$$
A **factor** is an identifier or a parenthesised expression; a **term** is a product of factors; an **expression** is a sum of terms. So $*$ binds tighter than $+$, and both group to the left. (The new grammar generates the same language and every string up to length 5 has exactly one parse tree, checked by machine.)

${derivation(b05exprFixed, "a+a*a", "lm")}`,

  "8": r`**Definition (HMU).** A PDA is $P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)$: states $Q$, input alphabet $\Sigma$, stack alphabet $\Gamma$, transition function $\delta(q,a,X)$ = a finite set of pairs $(p,\gamma)$ (for $a\in\Sigma$ or $a=\varepsilon$, $X\in\Gamma$, $\gamma\in\Gamma^*$), start state $q_0$, start stack symbol $Z_0$, and accepting states $F$. A move $(p,\gamma)\in\delta(q,a,X)$: in state $q$, reading $a$ (or nothing), with $X$ on top, go to $p$ and replace $X$ by $\gamma$ (leftmost symbol on top).

**Instantaneous description.** An ID is a triple $(q,w,\gamma)$: the current state $q$, the **remaining** input $w$, and the stack contents $\gamma$ (top first). A move is written $(q,aw,X\beta)\vdash(p,w,\gamma\beta)$ when $(p,\gamma)\in\delta(q,a,X)$. $P$ accepts $w$ by final state if $(q_0,w,Z_0)\vdash^*(q,\varepsilon,\alpha)$ with $q\in F$.

**Example: $\{0^n1^n \mid n\ge1\}$.** $\delta(q_0,0,Z_0)=\{(q_0,0Z_0)\}$, $\delta(q_0,0,0)=\{(q_0,00)\}$, $\delta(q_0,1,0)=\{(q_1,\varepsilon)\}$, $\delta(q_1,1,0)=\{(q_1,\varepsilon)\}$, $\delta(q_1,\varepsilon,Z_0)=\{(q_2,Z_0)\}$, $F=\{q_2\}$. On 0011:
$$
(q_0,0011,Z_0)\vdash(q_0,011,0Z_0)\vdash(q_0,11,00Z_0)\vdash(q_1,1,0Z_0)\vdash(q_1,\varepsilon,Z_0)\vdash(q_2,\varepsilon,Z_0).
$$`,

  "9": b09Solutions["13a"],

  "10": b06Solutions["7"],

  "11": r`**Idea.** For each position, carry the bit $a$ of the first number $x$ (marking it), and replace the corresponding bit $b$ of the second number $y$ by the marked bit $a\oplus b$. At the end remove all marks. The tape changes from $x,y$ to $x,(x\oplus y)$.

| State | Meaning |
|---|---|
| $q_0$ | at the next unmarked bit of $x$ |
| $c_a$ | carrying bit $a$ to the comma |
| $d_a$ | in $y$, at the first unmarked bit |
| $b_2$, $b_1$ | returning: across $y$, then across $x$ to the last marked bit |
| $u$, $v$ | removing marks (right through $y$, then left through $x$) |
| $q_f$ | halt |

${tmTableMd(b05tmXor, xorName)}

**Trace on 10,11** (result 10,01):
${tmTraceTex(b05tmXor, "10,11", { stateTex: xorName })}

(Checked on every valid input up to length 9: the tape always ends as $x,(x\oplus y)$.)`,

  "12": r`**Language of a TM.** $L(M)=\{w\in\Sigma^* \mid q_0w\vdash^*\alpha p\beta \text{ for some accepting state } p\}$: the input strings that make $M$ enter an accepting state. **Recursive language:** $L=L(M)$ for some TM $M$ that **halts on every input** (accepting the strings in $L$, halting without accepting on the others).

**The given TM.** $q_0$ expects a 0 (and rewrites it as 1), $q_1$ expects a 1 (rewriting it as 0); each switches to the other. A blank in either state is accepted; a wrong symbol (1 in $q_0$, 0 in $q_1$) has no move, so $M$ halts without accepting. So $M$ accepts exactly the strings that **alternate starting with 0**:
$$
L(M)=(01)^*(\varepsilon+0)=\{\varepsilon,0,01,010,0101,\dots\}.
$$
$M$ halts on every input (it moves right each step), so $L(M)$ is recursive.

${tmTraceTex(b05tm12, "010")}

(Checked on every binary string up to length 10.)`,

  "13": r`**Multitape TM.** A finite control with $k$ tapes, each with its own head; the input is on tape 1. Each move depends on the state and all $k$ scanned symbols, writes on every tape and moves each head independently.

**Nondeterministic TM.** $\delta(q,X)$ is a **set** of moves $(p,Y,D)$; the NTM accepts $w$ if **some** sequence of choices leads to an accepting state.

**No: neither accepts a language that a basic one-tape deterministic TM cannot.**

- **Multitape → one tape:** a one-tape TM with $2k$ tracks stores the $k$ tapes and a head marker for each; it simulates one move by sweeping across to read all marked cells and sweeping back to update them. $n$ moves cost $O(n^2)$ moves.
- **NTM → DTM:** a deterministic TM explores all computation branches **breadth-first** (a queue of IDs on its tape); if any branch accepts, it eventually finds it. This may take exponentially longer.

So both models recognise exactly the RE languages; they differ only in **efficiency**: multitape machines are polynomially faster at most, and whether NTMs can be simulated in polynomial time is the P versus NP question.`,
}

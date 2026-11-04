import { tmTableMd, tmTraceTex } from "@/lib/automata"
import { tm0n1n, tmMonus } from "../machines/notes-tm"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const tmBasicsNote = r`
## Why a new machine

Neither finite automata nor pushdown automata are general models of computers: they cannot even recognise $\{a^nb^nc^n \mid n\ge0\}$. The **Turing machine**, after Alan Turing (1912–1954), can recognise this and far more. It is essentially a finite automaton with a single tape of infinite length that it can **read and write**.

## The machine

- A **finite control**, in one of finitely many states.
- A **tape** divided into cells, each holding one of finitely many symbols, infinite in both directions.
- Initially the **input**, a finite string over the input alphabet, is on the tape. Every other cell holds the **blank** B. The blank is a tape symbol but not an input symbol; there may be other tape symbols too.
- A **tape head** always scans one cell, initially the leftmost input symbol.

**One move** depends on the current state and the scanned symbol. In one move the TM

1. changes state (possibly to the same state),
2. writes a tape symbol in the scanned cell (possibly the same symbol),
3. moves the head one cell left or right. In this formalism the head must move; it may not stay put.

## Formal definition

$$
M=(Q,\Sigma,\Gamma,\delta,q_0,B,F)
$$

- $Q$: finite set of states of the finite control;
- $\Sigma$: finite set of input symbols;
- $\Gamma$: complete set of tape symbols, with $\Sigma\subset\Gamma$;
- $\delta$: transition function. $\delta(q,X)$, for a state $q$ and tape symbol $X$, if defined, is a triple $(p,Y,D)$: next state $p\in Q$, symbol $Y\in\Gamma$ written over the scanned cell, and direction $D\in\{L,R\}$;
- $q_0\in Q$: start state;
- $B\in\Gamma\setminus\Sigma$: the blank;
- $F\subseteq Q$: final (accepting) states.

$\delta$ is a **partial** function: if $\delta(q,X)$ is undefined, the machine has no move and halts.

## Instantaneous descriptions

After finitely many moves a TM has visited only finitely many cells, so an ID shows just the part of the tape between the leftmost and rightmost non-blanks, with the state written **immediately left of the scanned cell**:
$$
X_1X_2\cdots X_{i-1}\,q\,X_iX_{i+1}\cdots X_n
$$
means: the state is $q$, the head scans the $i$-th symbol, and $X_1\cdots X_n$ is the non-blank portion. If the head is on a blank just outside that portion, that blank is shown too. State names must not clash with tape symbols.

**Moves.** $\vdash_M$ (or $\vdash$) is one move, $\overset{*}{\vdash}$ zero or more.

**Leftward move**, $\delta(q,X_i)=(p,Y,L)$:
$$
X_1\cdots X_{i-1}\,q\,X_iX_{i+1}\cdots X_n\ \vdash\ X_1\cdots X_{i-2}\,p\,X_{i-1}YX_{i+1}\cdots X_n.
$$
Two exceptions:

1. If $i=1$, the head moves onto the blank left of $X_1$: $qX_1X_2\cdots X_n\vdash pBYX_2\cdots X_n$.
2. If $i=n$ and $Y=B$, the B written over $X_n$ joins the trailing blanks and is dropped: $X_1\cdots X_{n-1}qX_n\vdash X_1\cdots X_{n-2}pX_{n-1}$.

**Rightward move**, $\delta(q,X_i)=(p,Y,R)$:
$$
X_1\cdots X_{i-1}\,q\,X_iX_{i+1}\cdots X_n\ \vdash\ X_1\cdots X_{i-1}Y\,p\,X_{i+1}\cdots X_n.
$$
Two exceptions:

1. If $i=n$, the next cell is a blank not in the old ID: $X_1\cdots X_{n-1}qX_n\vdash X_1\cdots X_{n-1}YpB$.
2. If $i=1$ and $Y=B$, the B joins the leading blanks and is dropped: $qX_1X_2\cdots X_n\vdash pX_2\cdots X_n$.

${fig("tm-0n1n-tape")}

## Example: a TM for 0ⁿ1ⁿ

The language is $\{0^n1^n \mid n\ge1\}$.

**Idea.** Repeatedly change the leftmost 0 to X, run right over 0's and Y's to the first 1, change it to Y, run left over Y's and 0's to the rightmost X, and step right to the next 0. When no 0 remains (the head sees Y), check that only Y's are left before the first blank.

At every point the visited part of the tape looks like $X^*0^*Y^*1^*$: some 0's changed to X, some not yet, then some 1's changed to Y, some not yet.

| State | Role |
|---|---|
| $q_0$ | at the leftmost remaining 0; start of each round |
| $q_1$ | moving right over 0's and Y's, looking for a 1 |
| $q_2$ | moving left over Y's and 0's, looking for an X |
| $q_3$ | all 0's are X: moving right over Y's, expecting a blank |
| $q_4$ | accept |

$M=(\{q_0,q_1,q_2,q_3,q_4\},\{0,1\},\{0,1,X,Y,B\},\delta,q_0,B,\{q_4\})$ with $\delta$:

${tmTableMd(tm0n1n)}

A missing entry ("–") means the TM dies. In $q_1$, seeing X or B means the input was not of the form $0^n1^n$. In $q_3$, another 1 means too many 1's, and a 0 means wrong order.

${fig("tm-0n1n")}

**Accepting computation on 0011:**
${tmTraceTex(tm0n1n, "0011")}

**Rejecting computation on 0010.** It behaves like 0011 until, in $q_1$, it scans the final 0 and moves right onto a blank. $q_1$ has no move on B, so M dies:
${tmTraceTex(tm0n1n, "0010")}

## Transition diagrams

Nodes are states; an arc from $q$ to $p$ is labelled by one or more items $X/Y\,D$, meaning $\delta(q,X)=(p,Y,D)$. The direction is drawn as an arrow: $\leftarrow$ for left, $\rightarrow$ for right. The start state has an incoming arrow, accepting states are double circles, and the blank is B unless stated otherwise.

## A TM that computes a function: monus

Turing's original view was a machine that computes integer functions, with numbers in **unary** (blocks of one symbol). **Monus** (proper subtraction) is
$$
m\dot-n=\max(m-n,0).
$$

$M=(\{q_0,\dots,q_6\},\{0,1\},\{0,1,B\},\delta,q_0,B)$; there is no set of accepting states because it computes rather than accepts. It starts with $0^m10^n$ and halts with $0^{m\dot-n}$ on the tape.

**Idea.** Repeatedly replace the leftmost remaining 0 by B, run right to the 1, keep going right to the first 0 of the second block and change it to 1, then run back left to the blank and start again. The rounds stop when:

1. **Searching right for a 0, M finds a blank.** All $n$ 0's of the second block became 1's, and $n+1$ of the first $m$ 0's became B. M changes the $n+1$ 1's back into one 0 and $n$ B's, leaving $m-n$ 0's.
2. **Starting a round, M finds no 0** (the first block is used up). Then $n\ge m$ and $m\dot-n=0$: M blanks the rest of the tape.

| State | Role |
|---|---|
| $q_0$ | start a round: a 0 means continue (replace it by B); a 1 means the first block is used up, go to $q_5$ |
| $q_1$ | run right through the first block to the 1 |
| $q_2$ | run right over 1's to the first 0 of the second block and change it to 1; a blank means case 1, go to $q_4$ |
| $q_3$ | run left to the blank, then start the next round |
| $q_4$ | case 1: move left changing 1's to B, and restore one B to 0 (one 0 was wrongly blanked) |
| $q_5$ | case 2: change every remaining 0 and 1 to B |
| $q_6$ | halt |

${tmTableMd(tmMonus)}

${fig("tm-monus")}

**On $0000100$ ($4\dot-2=2$):**
${tmTraceTex(tmMonus, "0000100")}

**On $0010000$ ($2\dot-4=0$):**
${tmTraceTex(tmMonus, "0010000")}

## The language of a TM

Put the input on the tape, start in $q_0$ on the leftmost input symbol. The input is accepted if the TM eventually enters an accepting state:
$$
L(M)=\{w\in\Sigma^* \mid q_0w\overset{*}{\vdash}\alpha p\beta \text{ for some } p\in F \text{ and any tape strings } \alpha,\beta\}.
$$
The languages accepted by Turing machines are the **recursively enumerable** (RE) languages. The name comes from formalisms that predate Turing machines and define the same class.

**Halting.** A TM **halts** if it enters a state $q$ scanning $X$ and $\delta(q,X)$ is undefined. We may assume a TM halts whenever it accepts. A TM that **halts on every input** gives an algorithm; its language is **recursive** (decidable). A TM that may run forever on some inputs it does not accept still has a language, which is RE. The monus machine halts on every string of 0's and 1's.

## Notational conventions

1. Lower-case letters at the start of the alphabet ($a,b,\dots$) are input symbols.
2. Capital letters near the end ($X,Y,Z$) are tape symbols, which may or may not be input symbols; B is the blank.
3. Lower-case letters near the end ($w,x,y,z$) are strings of input symbols.
4. Greek letters ($\alpha,\beta,\gamma$) are strings of tape symbols.
5. $p$, $q$ and nearby letters are states.

## Common short questions

These come up in older papers; the answers follow from the definition (Sipser, Exercise 3.5 discusses the same points).

- **Can a TM write the blank?** Yes. B is in $\Gamma$, and $\delta$ may write any symbol of $\Gamma$. The monus machine does exactly this.
- **Can $\Gamma=\Sigma$?** No. The blank is in $\Gamma$ but never in $\Sigma$, so $\Gamma$ always has at least one symbol more.
- **Can the head be on the same cell in two successive steps?** In this formalism the head must move L or R, so after one move it is on a different cell. (In Sipser's model, on a one-way tape, moving left from the leftmost cell leaves the head where it is, so it can happen there; models with an S "stay" move allow it too.)
- **Can a TM have a single state?** With HMU's definition, yes: one state that is both start and accepting accepts every input at once; one non-accepting state halts or loops but never accepts. (Sipser's definition needs distinct accept and reject states, so at least two.)
- **How does a TM find the left end of its tape?** It marks it. Before starting, shift the input one cell right and write a special symbol, such as $\triangleright$ or #, in the first cell; moving left until that symbol is seen finds the end. (On a one-way infinite tape, another trick: write a special mark on the current cell, move left, and if the mark is still under the head, the head did not move, so it is at the left end.)

## Three levels of description (Sipser)

Exam answers describe TMs at one of three levels:

1. **Formal description:** the full 7-tuple, $\delta$ as a table or diagram.
2. **Implementation description:** English prose about how the head moves and what is written, with no states.
3. **High-level description:** an algorithm in English, ignoring the tape mechanics.

When a question asks to "design" or "construct" a TM, give the idea, then the formal description (diagram or table), then a trace. When it asks to "describe" one, a careful implementation-level description is usually enough.
`

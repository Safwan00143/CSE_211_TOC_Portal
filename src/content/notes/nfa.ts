import { closureTableMd, faTableMd, subsetTableMd } from "@/lib/automata"
import { enfaExample, enfaExampleRemoved, nfa101, nfaAba, nfaMissing, nfaThirdLast } from "../machines/notes-nfa"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const nfaNote = r`
## Finding versus verifying

Some problems are hard to *solve* but easy to *check*. Solving a maze or a Sudoku may need long search; checking a proposed path or a filled grid is quick. Nondeterminism is the dream of a machine that could simply guess the right choice and then only verify it.

Three equivalent ways to picture a nondeterministic computation:

1. **Lucky guessing.** At every choice the machine guesses, and it is as if it always guesses right whenever a right guess exists.
2. **Parallel copies.** At every choice the machine splits into copies, one per option, all running at once. A copy with no legal move dies.
3. **A tree of possibilities.** The whole computation is a tree: the root is the start configuration, each branch point is a choice, and each root-to-leaf path is one possible run. The input is accepted if **some** leaf is an accepting configuration.

Real machines do not guess. Nondeterminism matters because it makes machines easier to design, gives clean proofs, and is the idea behind NP later in the course.

## From DFA to NFA

In a DFA, $\delta(q,a)$ is one state. In an NFA, a situation may allow several next states, or none:
$$
\delta(q,a)=\{q_1,q_2,\dots,q_k\}.
$$

**Example.** $\text{CONTAINS101}=\{w\in\{0,1\}^* : w \text{ contains } 101\}$. Members: 101, 0101, 1010, 1110100. Non-members: $\varepsilon$, 0, 11, 1000, 0100.

A DFA must track partial progress (nothing, 1, 10, 101). An NFA can think differently: whenever it sees a 1, it may guess "this 1 starts 101". A wrong guess just dies.

${fig("nfa-101")}

At $q_0$ on input 1 there are two choices, $\delta(q_0,1)=\{q_0,q_1\}$: ignore this 1, or guess it starts the pattern. Both are explored.

### Three outcomes of a branch

| Outcome | Meaning |
|---|---|
| Accepted | input fully read, branch ends in an accepting state |
| Rejected | input fully read, branch ends in a non-accepting state |
| Dead | branch gets stuck (no move) before the input is fully read |

**The NFA accepts if at least one branch is accepted.** Many bad branches do not matter if one good branch exists.

**Tree for 0101.** From $q_0$, read 0: $\{q_0\}$. Read 1: $\{q_0,q_1\}$. Read 0: $q_0\to q_0$, $q_1\to q_2$, giving $\{q_0,q_2\}$. Read 1: $q_0\to\{q_0,q_1\}$, $q_2\to q_3$, giving $\{q_0,q_1,q_3\}$. One leaf is $q_3\in F$, so 0101 is accepted.

**Tree for 1000.** Read 1: $\{q_0,q_1\}$. Read 0: $\{q_0,q_2\}$. Read 0: the $q_2$ branch dies (no move on 0), leaving $\{q_0\}$. Read 0: $\{q_0\}$. The only surviving leaf is $q_0\notin F$, so 1000 is rejected.

### Proving acceptance versus rejection

| Claim | What must be shown |
|---|---|
| $w$ is accepted | one valid accepting branch |
| $w$ is rejected | every branch fails: none may accept |

A DFA has one timeline. An NFA has many.

## The formal definition

A **nondeterministic finite automaton** is a 5-tuple $M=(Q,\Sigma,\delta,q_0,F)$ where $Q$, $\Sigma$, $q_0$ and $F$ are as for a DFA and
$$
\delta: Q\times\Sigma\to\mathcal P(Q).
$$
Only $\delta$ changes. $\mathcal P(Q)$ is the **power set**, the set of all subsets of $Q$. With $Q=\{q_0,q_1,q_2\}$ there are $2^3=8$ subsets, from $\emptyset$ to $\{q_0,q_1,q_2\}$.

- $\delta(q,a)=\emptyset$: no branch survives.
- $\delta(q,a)=\{r\}$: exactly one possibility.
- $\delta(q,a)=\{r,s,t\}$: the computation branches three ways.

The 101 NFA as a table ($\emptyset$ entries are dead ends):

${faTableMd(nfa101)}

In a DFA table each entry is a state; in an NFA table each entry is a *set* of states.

**Every DFA is an NFA:** read $\delta(q,a)=r$ as $\delta(q,a)=\{r\}$. The real question is the converse, answered below.

### DFA versus NFA at a glance

| | DFA | NFA |
|---|---|---|
| Transition function | $\delta: Q\times\Sigma\to Q$ | $\delta: Q\times\Sigma\to\mathcal P(Q)$ (and $\Sigma_\varepsilon$ with ε-moves) |
| Moves per state and symbol | exactly one | zero, one or many |
| ε-moves | not allowed | allowed (Sipser's convention) |
| Runs on an input | exactly one | possibly many (a tree) |
| Accepts when | the one run ends in $F$ | **some** run ends in $F$ |
| Size for the same language | can be up to $2^n$ states | can be exponentially smaller |
| Power | regular languages | regular languages (same) |

## More examples: what NFAs are good at

### Contains fed or dff

$L=\{w\in\{d,e,f\}^* : w \text{ contains fed or dff}\}$. Members: fed, dff, efed, dffd, ffdff. Non-members: $\varepsilon$, d, ff, def, fef, edf.

${fig("nfa-fed-dff")}

On f the machine may guess that fed begins; on d, that dff begins. Missing transitions mean the branch dies.

### Guessing a split point

$L=\{w_1w_2 : |w_1| \text{ is a multiple of } 3 \text{ and } w_2 \text{ has an even number of b's}\}$ over $\{a,b\}$. Members: $\varepsilon$, a, aa, bb, aaa, aab, abba. Non-members: b, ab, ba, aaab, abbb.

${fig("nfa-split")}

$r_0$ is accepting because the NFA may choose $w_2=\varepsilon$. From $r_0$ the next symbol may either continue $w_1$ or be the first symbol of $w_2$: $r_0\xrightarrow{a}E$, $r_0\xrightarrow{b}O$. No ε-move is needed.

### Missing at least one symbol

$L=\{w\in\{a,b,c\}^* : w \text{ is missing at least one of } a,b,c\}$. Members: $\varepsilon$, a, ab, bbbb, acac, ccaa. Non-members: abc, acb, baac, cbabc.

${fig("nfa-missing")}

${faTableMd(nfaMissing, { label: (q) => (q === "s" ? "$s$" : `$q_{\\neg ${q[1]}}$`) })}

On abc every branch eventually dies.

**The common theme.** An NFA expresses "there exists a good choice": where a pattern begins, where one part ends and the next begins, or which condition will stay true.

## ε-transitions

An **ε-NFA** may move without reading input. Formally $M=(Q,\Sigma,\delta,q_0,F)$ with
$$
\delta: Q\times\Sigma_\varepsilon\to\mathcal P(Q),\qquad \Sigma_\varepsilon=\Sigma\cup\{\varepsilon\}.
$$
$q\xrightarrow{\varepsilon}r$ means: move from $q$ to $r$ without consuming input.

**Acceptance.** An ε-NFA accepts $w\in\Sigma^*$ if there is a path $q_0=p_0\to p_1\to\cdots\to p_m$ such that

1. each transition label is a symbol of $\Sigma$ or $\varepsilon$;
2. deleting the $\varepsilon$'s from the labels leaves exactly $w$;
3. $p_m\in F$.

Free ε-moves may happen before, between or after reading symbols.

**Why they help: modularity.** For $L=\{ab, acd\}$, read the common a, then jump freely into a "b" module and a "cd" module.

${fig("enfa-ab-acd")}

On acd, the b branch dies on c and the cd branch accepts. One accepting path: $q_0\xrightarrow{a}q_a\xrightarrow{\varepsilon}r_0\xrightarrow{c}r_1\xrightarrow{d}r_2$; deleting ε leaves acd, and $r_2\in F$.

**Terminology.** In Sipser, and from here on in the course, "NFA" allows ε-moves unless it says "NFA without ε-transitions".

## ε-closure and removing ε-moves

The **ε-closure** of a state $q$ is everything reachable from $q$ by zero or more ε-moves:
$$
E(q)=\{r\in Q : r \text{ is reachable from } q \text{ using only ε-moves}\}.
$$
It always contains $q$ itself. For a set, $E(S)=\bigcup_{q\in S}E(q)$.

**Removing ε-moves.** From an ε-NFA $M=(Q,\Sigma,\delta,q_0,F)$ build $M'=(Q,\Sigma,\delta',q_0,F')$ with no ε-moves:

1. Compute $E(q)$ for every state.
2. For each $q\in Q$ and $a\in\Sigma$:
$$
\delta'(q,a)=E\Big(\bigcup_{r\in E(q)}\delta(r,a)\Big).
$$
That is: take free moves, read $a$, then take free moves again.
3. New accepting states:
$$
F'=\{q\in Q : E(q)\cap F\neq\emptyset\}.
$$
A state that reaches an accepting state for free must accept, to cover acceptance after the input is used up.

### Worked example

$Q=\{q_0,\dots,q_4\}$, $\Sigma=\{0,1\}$, $F=\{q_4\}$; missing transitions go to $\emptyset$.

${fig("enfa-example")}

**Step 1: ε-closures.**

${closureTableMd(enfaExample)}

**Step 2: new accepting states.** $E(q_2)=\{q_2,q_4\}$ meets $F$, and so does $E(q_4)$. So $F'=\{q_2,q_4\}$.

**Step 3: new transition table.**

${faTableMd(enfaExampleRemoved)}

**One entry explained.** Why is $\delta'(q_0,0)=\{q_2,q_4\}$? $E(q_0)=\{q_0,q_1\}$. Reading 0: $\delta(q_0,0)\cup\delta(q_1,0)=\emptyset\cup\{q_2\}=\{q_2\}$. Closing again: $E(\{q_2\})=\{q_2,q_4\}$.

ε-moves add no recognising power; they only make constructions cleaner.

## Every NFA has an equivalent DFA

Two machines are **equivalent** if they recognise the same language. Every DFA is an NFA. The surprising part is the converse:

> **Theorem.** Every NFA has an equivalent DFA.

So nondeterminism does not increase the power of finite automata: both recognise exactly the regular languages.

**Why it is surprising.** Guessing feels strictly more powerful, and an NFA can be exponentially smaller. **Why it is useful.** We may *design* with an NFA, where guessing and ε-moves make constructions short (union, concatenation, star, regex to automaton), and still conclude a DFA exists. This is why "nondeterminism is an inessential feature of finite automata": it changes convenience and size, never the class of languages.

### The subset construction

A DFA can be in one state; an NFA can be in several at once across its branches. So let each DFA state be a **set** of NFA states: the set of states some branch could be in.

Let $N=(Q,\Sigma,\delta,q_0,F)$ be an NFA without ε-moves. Build $M=(Q',\Sigma,\delta',q_0',F')$:

1. **States:** $Q'=\mathcal P(Q)$.
2. **Start state:** $q_0'=\{q_0\}$.
3. **Accepting states:** $F'=\{R\subseteq Q : R\cap F\neq\emptyset\}$, the subsets containing at least one NFA accepting state.
4. **Transitions:** for $R\subseteq Q$ and $a\in\Sigma$,
$$
\delta'(R,a)=\bigcup_{r\in R}\delta(r,a).
$$

**With ε-moves** (Sipser's version), close every set: start state $E(\{q_0\})$, and $\delta'(R,a)=E\big(\bigcup_{r\in R}\delta(r,a)\big)$. Alternatively remove ε-moves first, as above.

If $|Q|=n$, the DFA has up to $2^n$ states. In practice build only the subsets **reachable** from the start state, adding a new row whenever a new subset appears. Older papers call this **lazy evaluation**.

**Procedure (lazy subset construction).**

1. Put the start subset in the table, unmarked.
2. Take an unmarked subset $R$. For each symbol $a$, compute $\delta'(R,a)$ (union of moves, then ε-closure if needed). Record it; if it is a new subset, add it unmarked. Mark $R$.
3. Repeat until every subset is marked.
4. Accepting rows are those containing an NFA accepting state. $\emptyset$, if it appears, is a dead state.

### Worked example: contains aba

${fig("nfa-aba")}

$Q=\{q_0,q_1,q_2,q_3\}$, so 16 subsets are possible.

${subsetTableMd(nfaAba)}

Reading two rows from the slides: from $A=\{q_0\}$ on a, $\delta(q_0,a)=\{q_0,q_1\}$, a new state $B$. From $B$ on b, $\delta(q_0,b)\cup\delta(q_1,b)=\{q_0\}\cup\{q_2\}=\{q_0,q_2\}$, a new state $C$. Rows containing $q_3$ accept. No new subsets appear after $F$, so only **6 of the 16** subsets are reachable.

${fig("dfa-aba")}

The DFA tracks the longest matched prefix of aba, and once aba has appeared it stays in the accepting part. Smaller equivalent DFAs may exist; the construction just guarantees *some* DFA.

### Subset construction straight from the ε-NFA

For the ε-NFA of the previous section (start $E(q_0)=\{q_0,q_1\}$):

${subsetTableMd(enfaExample)}

### Proof that the DFA recognises the same language

This proof is from Sipser (Theorem 1.39) and HMU (Theorem 2.11); the slides give the construction only. Write $\hat\delta_N(q_0,w)$ for the set of states the NFA can be in after reading $w$, and $\hat\delta_D(\{q_0\},w)$ for the DFA state after $w$.

**Claim.** For every string $w$, $\hat\delta_D(\{q_0\},w)=\hat\delta_N(q_0,w)$.

**Basis, $w=\varepsilon$.** Both sides are $\{q_0\}$: the DFA starts in $\{q_0\}$, and the NFA, reading nothing, can only be in $q_0$.

**Inductive step.** Let $w=xa$ and assume the claim for $x$, i.e. $\hat\delta_D(\{q_0\},x)=\hat\delta_N(q_0,x)=S$. Then
$$
\hat\delta_D(\{q_0\},xa)=\delta'(S,a)=\bigcup_{r\in S}\delta(r,a).
$$
And the NFA, being in some state of $S$ after $x$, can be in exactly the states $\bigcup_{r\in S}\delta(r,a)$ after $xa$. The two sides agree.

**Conclusion.** The DFA accepts $w$ iff $\hat\delta_D(\{q_0\},w)\in F'$, iff $\hat\delta_N(q_0,w)\cap F\neq\emptyset$, iff the NFA accepts $w$. So $L(D)=L(N)$. With ε-moves the same induction works with an ε-closure at each step.

## How big can the DFA be?

From an $n$-state NFA, the subset construction gives a DFA with **at most $2^n$** states (every subset, $\emptyset$ included). For a 5-state NFA that is at most $2^5=32$. It can be as few as **1**: if the NFA accepts $\Sigma^*$ or $\emptyset$, a one-state DFA does the job, and in general the reachable part may be tiny.

The upper bound can really be needed. Let $L_n=\{w\in\{0,1\}^* : \text{the } n\text{-th symbol from the end is } 1\}$. An NFA needs only $n+1$ states: loop in $q_0$, guess "this 1 is $n$-th from the end", then count $n-1$ more symbols. For $n=3$:

${fig("nfa-third-last")}

**Any DFA for $L_n$ needs at least $2^n$ states.** Take two different strings $x\neq y$ of length $n$. They differ at some position; say $x$ has 1 and $y$ has 0 there, $i$ symbols from the end ($1\le i\le n$). Append $z=0^{n-i}$. Now that position is exactly $n$-th from the end in both, so $xz\in L_n$ and $yz\notin L_n$. A DFA in the same state after $x$ and after $y$ would treat $xz$ and $yz$ alike, which is impossible. So all $2^n$ strings of length $n$ lead to different states. (HMU, Section 2.3.6.)

For $n=3$ the subset construction indeed reaches all ${String(2 ** 3)} subsets that contain $q_0$:

${subsetTableMd(nfaThirdLast)}
`

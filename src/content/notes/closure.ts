const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const closureNote = r`
## The three regular operations

A language is a set of strings, so languages can be combined like sets. Three operations are fundamental. For languages $A$ and $B$:

1. **Union:** $A\cup B=\{x \mid x\in A \text{ or } x\in B\}$.
2. **Concatenation:** $A\circ B=\{xy \mid x\in A \text{ and } y\in B\}$, usually written $AB$.
3. **Star:** $A^*=\{x_1x_2\cdots x_k \mid k\ge 0 \text{ and each } x_i\in A\}$.

With $A=\{\text{good},\text{bad}\}$ and $B=\{\text{boy},\text{girl}\}$:
$$
A\cup B=\{\text{good},\text{bad},\text{boy},\text{girl}\},\qquad AB=\{\text{goodboy},\text{goodgirl},\text{badboy},\text{badgirl}\}.
$$
With $A=\{ab,c\}$: $A^*=\{\varepsilon, ab, c, abab, abc, cab, cc, ababab,\dots\}$.

**Star always contains $\varepsilon$.** $A^*=\{\varepsilon\}\cup A\cup AA\cup AAA\cup\cdots$; the case $k=0$ joins zero strings and gives $\varepsilon$. So $\varepsilon\in A^*$ for every $A$, and in particular $\emptyset^*=\{\varepsilon\}$, not $\emptyset$.

These are operations on **sets of strings**. Machines come later: a closure proof asks, if the input languages have machines, can we build a machine for the output?

### Sizes of combined languages

Useful facts when asked whether a combination is finite or infinite:

- $L\emptyset=\emptyset L=\emptyset$ for every $L$: there is nothing to pair with.
- $L\{\varepsilon\}=L$.
- If $A$ and $B$ are both nonempty and at least one is infinite, $AB$ is infinite: fix one string of the finite (or any) side and pair it with infinitely many of the other.
- If $A$ and $B$ are both finite, $AB$ is finite (at most $|A|\cdot|B|$ strings).
- $A^*$ is infinite whenever $A$ contains a nonempty string; $\emptyset^*=\{\varepsilon\}^*=\{\varepsilon\}$.

## Regular languages and closure

A language is **regular** if some DFA recognises it; equivalently, some NFA recognises it (every DFA is an NFA and every NFA has an equivalent DFA).

A collection is **closed** under an operation if applying the operation to members always gives a member. The natural numbers are closed under addition ($3+5=8\in\mathbb N$) but not subtraction ($3-5\notin\mathbb N$).

> **Theorem (Sipser).** The class of regular languages is closed under the regular operations: union, concatenation and star.

The proofs use NFAs, because ε-moves make each construction a few arrows. This is why nondeterminism is not a side topic: it is the cleanest design tool we have.

**Running examples.** $N_1$ accepts strings ending in 0; $N_2$ accepts strings of even length.

${fig("cl-parts")}

## Closure under union

**Idea.** Accept $w$ if $N_1$ accepts it or $N_2$ accepts it. With nondeterminism, just guess which one.

**Construction.** Let $N_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$ recognise $A_1$ and $N_2=(Q_2,\Sigma,\delta_2,q_2,F_2)$ recognise $A_2$, with $Q_1$, $Q_2$ disjoint. Build $N=(Q,\Sigma,\delta,q_0,F)$:

1. $Q=\{q_0\}\cup Q_1\cup Q_2$, with $q_0$ a new start state.
2. $F=F_1\cup F_2$.
3. Keep every old transition and add $\delta(q_0,\varepsilon)=\{q_1,q_2\}$.

Written as one function, for $q\in Q$ and $a\in\Sigma_\varepsilon$:
$$
\delta(q,a)=\begin{cases}
\delta_1(q,a) & q\in Q_1\\
\delta_2(q,a) & q\in Q_2\\
\{q_1,q_2\} & q=q_0 \text{ and } a=\varepsilon\\
\emptyset & q=q_0 \text{ and } a\neq\varepsilon
\end{cases}
$$

The four cases: inside $N_1$, behave exactly like $N_1$; inside $N_2$, exactly like $N_2$; from the new start, branch for free into both machines; and the new start reads no symbol itself, so every real input is processed by one of the old machines.

${fig("cl-union")}

**Why the new start state?** Its only job is to branch. Merging the two old start states instead would let a run wander from $N_1$ into $N_2$ through the merged state and accept strings in neither language. The start state is not accepting unless one old start was ($\varepsilon$ is accepted only if $\varepsilon\in A_1\cup A_2$, through the ε-moves).

**Correctness, both directions.** If $N$ accepts $w$, the accepting branch went into $N_1$ or into $N_2$ and stayed there, so $w\in A_1$ or $w\in A_2$. Conversely, if $w\in A_1$, take the branch into $N_1$ and follow $N_1$'s accepting run; likewise for $A_2$.

**Union with DFAs (the product version).** If $M_1$, $M_2$ are DFAs, union can also be done deterministically: build the product machine below and accept a pair $(r_1,r_2)$ when $r_1\in F_1$ **or** $r_2\in F_2$. This is the answer when a question asks for a **DFA** for $L_1\cup L_2$.

## Closure under concatenation

**Idea.** For $w\in A_1A_2$ we must split $w=xy$ with $x\in A_1$, $y\in A_2$, but we don't know where the split is. For $w=001101$ it might be $00\cdot1101$, $001\cdot101$, $0011\cdot01$. The NFA guesses: whenever $N_1$ is in an accepting state, it may jump into $N_2$.

**Construction.** Start in $N_1$'s start state $q_1$; accept only in $N_2$'s accepting states $F_2$; keep all transitions; and add
$$
q_2\in\delta(r,\varepsilon)\quad\text{for every } r\in F_1.
$$
$N_1$'s accepting states are **no longer accepting**.

${fig("cl-concat")}

**Correctness.** An accepting run reads some prefix $x$ inside $N_1$, ending in $F_1$, crosses the ε-move, then reads the rest $y$ inside $N_2$ ending in $F_2$; so $x\in A_1$, $y\in A_2$. Conversely, given $x\in A_1$, $y\in A_2$, run $N_1$ on $x$, cross, run $N_2$ on $y$.

## Closure under star

**Idea.** A string of $A^*$ is a sequence of strings of $A$. When $N_1$ finishes one piece (reaches an accepting state), jump back to the start to read the next piece. Also accept $\varepsilon$ (zero pieces).

**Construction.** Let $N_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$ recognise $A$.

1. Add a new start state $q_0$ that is **accepting**: $Q=Q_1\cup\{q_0\}$, $F=F_1\cup\{q_0\}$.
2. Add $\delta(q_0,\varepsilon)=\{q_1\}$.
3. For every $r\in F_1$, add $q_1\in\delta(r,\varepsilon)$.

As one function, for $q\in Q$ and $a\in\Sigma_\varepsilon$:
$$
\delta(q,a)=\begin{cases}
\delta_1(q,a) & q\in Q_1,\ q\notin F_1\\
\delta_1(q,a) & q\in F_1,\ a\neq\varepsilon\\
\delta_1(q,a)\cup\{q_1\} & q\in F_1,\ a=\varepsilon\\
\{q_1\} & q=q_0,\ a=\varepsilon\\
\emptyset & q=q_0,\ a\neq\varepsilon
\end{cases}
$$

The cases in words: (1) ordinary states behave as in $N_1$; (2) an accepting state still reads symbols as in $N_1$, so a piece can continue; (3) from an accepting state, a free move back to $q_1$ starts the next piece, while keeping $N_1$'s own ε-moves; (4) the new start state jumps to $q_1$ to begin the first piece; (5) the new start reads nothing itself. It is accepting only so that $\varepsilon$ (zero pieces) is accepted.

${fig("cl-star")}

### Why the new start state is needed

A tempting shortcut: don't add $q_0$, just make the old start $q_1$ accepting and keep the ε-moves back to $q_1$. This **fails when $q_1$ has incoming transitions**, because then a run can return to $q_1$ partway through a piece and stop there, accepting an unfinished piece.

**Counterexample.** $N_1$ recognises $A=a^*b$ (it loops on a at $q_1$). Then $A^*=(a^*b)^*$, and $a\notin A^*$ (every nonempty string of $A^*$ ends in b). The shortcut machine reads a by looping at $q_1$, which is now accepting, so it **accepts a**. In fact it accepts $(a^*b)^*a^*$, strictly more than $(a^*b)^*$.

${fig("cl-star-flaw")}

The new start state $q_0$ has **no incoming transitions**, so it can be accepting without letting any partial run be accepted. The shortcut works only when the original start state has no incoming arrows.

## A closure-proof template

1. Start with machines for the input languages.
2. Say what the operation needs the new machine to do.
3. Build the new finite automaton.
4. Argue **both directions**: $L(N)\subseteq L$ (the machine accepts nothing extra) and $L\subseteq L(N)$ (it accepts everything required).

Because regular languages are closed under union, concatenation and star, these three operations form a toolkit for building regular languages, which is what regular expressions are.

## Closure under complement

The complement of $A$ is $\overline A=\Sigma^*\setminus A$.

> **Theorem.** Regular languages are closed under complement.

**Construction.** Let $M=(Q,\Sigma,\delta,q_0,F)$ be a **complete DFA** for $A$. Then $\overline M=(Q,\Sigma,\delta,q_0,Q\setminus F)$ recognises $\overline A$: same machine, accepting and non-accepting states swapped.

**Why it works.** In a complete DFA every input has exactly one run, which ends in exactly one state $r$. $w\in A$ iff $r\in F$, iff $r\notin Q\setminus F$. So $\overline M$ accepts exactly what $M$ rejects.

${fig("cl-complement")}

**It needs a complete DFA.** If some $\delta(q,a)$ is missing, a string that gets stuck is rejected by $M$ *and* still rejected after swapping. Add a dead state for every missing move first, then swap.

**It does not work for NFAs.** An NFA accepts if **some** branch ends in $F$. After swapping, it accepts if some branch ends in the old non-accepting states. A string can have one branch of each kind, and then it is accepted by both machines.

${fig("cl-swap-nfa")}

Here $N$ accepts strings containing a 1. On input 1, one branch stays in $q_0$ and one moves to $q_1$. After swapping, the $q_0$ branch accepts, so 1 is accepted though it is not in the complement. To complement an NFA, convert it to a DFA first (subset construction), then swap.

## Closure under intersection

$A\cap B=\{x \mid x\in A \text{ and } x\in B\}$. Two proofs.

**Proof 1: the product construction.** Let $M_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$ and $M_2=(Q_2,\Sigma,\delta_2,q_2,F_2)$ be DFAs. Run both at once:

1. States $Q=Q_1\times Q_2=\{(r_1,r_2) \mid r_1\in Q_1, r_2\in Q_2\}$.
2. Start state $(q_1,q_2)$.
3. $\delta((r_1,r_2),a)=(\delta_1(r_1,a),\delta_2(r_2,a))$.
4. Accepting states $F=F_1\times F_2$: both coordinates accept.

A state $(r,s)$ means: after the same input, $M_1$ is in $r$ and $M_2$ is in $s$. Choosing a different $F$ gives other operations: "either accepts" for union, "first accepts and second does not" for difference.

${fig("cl-product")}

In practice build only the pairs reachable from the start pair, as with the subset construction.

**Proof 2: De Morgan.** $A\cap B=\overline{\overline A\cup\overline B}$. Complement and union preserve regularity, so the intersection is regular. No new machine needed.

## Difference and reverse

**Difference.** $A\setminus B=A\cap\overline B=\{x \mid x\in A \text{ and } x\notin B\}$, regular by complement and intersection.

**Reverse.** $A^R=\{w^R \mid w\in A\}$. Take a DFA $M$ for $A$ and build an NFA $N$ for $A^R$:

1. Reverse the direction of every arrow.
2. The old start state becomes the only accepting state.
3. Add a new start state.
4. Add ε-moves from the new start state to every old accepting state.

The result is generally nondeterministic: reversing can give a state two outgoing arrows on the same symbol, and there may be several old accepting states to start from.

${fig("cl-reverse")}

## Using closure as a proof shortcut

Closure properties prove a language regular without drawing a machine.

**Example.** $L$ = strings over $\{0,1\}$ that contain 101 but do not end in 11. $L_1=\{w \mid w \text{ contains } 101\}$ and $L_2=\{w \mid w \text{ ends in } 11\}$ are regular, and $L=L_1\setminus L_2$. So $L$ is regular.

**Example.** If $A$ = strings containing 101 and $B$ = strings of even length, $A\cap B$ is regular.

Closure also works in reverse for **non**-regularity: if $L\cap R$ is non-regular for some regular $R$, then $L$ is non-regular. See the pumping-lemma topic.

## What closure does not say

- **Subsets of regular languages need not be regular.** $\{0^n1^n \mid n\ge0\}\subseteq 0^*1^*$; the right side is regular and the left is not. Every language over $\Sigma$ is a subset of the regular language $\Sigma^*$.
- **Infinite unions need not be regular.** Each $\{0^n1^n\}$ is finite, hence regular, but $\bigcup_{n\ge0}\{0^n1^n\}$ is not. Closure under union is for finitely many languages.

## Summary table

| Operation | Construction | Machine used |
|---|---|---|
| Union $A\cup B$ | new start, ε to both starts; or product with "or" | NFA (or DFA) |
| Concatenation $AB$ | ε from $F_1$ to $N_2$'s start | NFA |
| Star $A^*$ | new accepting start, ε back from $F$ to old start | NFA |
| Complement $\overline A$ | swap $F$ and $Q\setminus F$ | **complete DFA** only |
| Intersection $A\cap B$ | product, $F=F_1\times F_2$; or De Morgan | DFA |
| Difference $A\setminus B$ | $A\cap\overline B$ | DFA |
| Reverse $A^R$ | flip arrows, new start with ε to old $F$ | NFA |
`

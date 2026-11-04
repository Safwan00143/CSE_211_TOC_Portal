const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const regexNote = r`
## What a regular expression is

Arithmetic builds expressions like $(5+3)\times4$ that evaluate to numbers. The regular operations build expressions that evaluate to **languages**. $(0\cup1)0^*$ evaluates to the strings that start with a 0 or a 1 followed by any number of 0's.

A regular expression is **syntax**; its meaning is a language, written $L(R)$.

| Expression | Kind | Language |
|---|---|---|
| $0$ | a symbol | $\{0\}$ |
| $0^*$ | star | $\{\varepsilon,0,00,000,\dots\}$ |
| $0\cup1$ | union | $\{0,1\}$ |

## Formal definition

**Syntax (inductive).** $R$ is a regular expression over $\Sigma$ if $R$ is

1. $a$ for some $a\in\Sigma$,
2. $\varepsilon$,
3. $\emptyset$,
4. $(R_1\cup R_2)$ for regular expressions $R_1,R_2$,
5. $(R_1\circ R_2)$ for regular expressions $R_1,R_2$,
6. $(R_1^*)$ for a regular expression $R_1$.

**Semantics (also inductive).**
$$
\begin{aligned}
L(a)&=\{a\}, & L(\varepsilon)&=\{\varepsilon\}, & L(\emptyset)&=\emptyset,\\
L(R_1\cup R_2)&=L(R_1)\cup L(R_2), & L(R_1R_2)&=L(R_1)L(R_2), & L(R_1^*)&=L(R_1)^*.
\end{aligned}
$$
Because both definitions are inductive, induction on the structure of $R$ is the natural way to prove things about regular expressions.

**The base cases differ.** $\varepsilon$ describes one string (the empty one); $\emptyset$ describes no strings.

| Symbol | Language | Strings |
|---|---|---|
| $\emptyset$ | no strings | 0 |
| $\varepsilon$ | the empty string only | 1 |

So $R\emptyset=\emptyset$ but $R\varepsilon=R$.

**Shorthands** (convenience only, no extra power):

| Shorthand | Meaning |
|---|---|
| $\Sigma$ | union of all symbols, e.g. $(0\cup1)$ |
| $R^+$ | $RR^*$ (one or more) |
| $R^?$ | $R\cup\varepsilon$ (optional) |
| $R^k$ | $R$ concatenated $k$ times |
| $[0\text{-}9]$ | $0\cup1\cup\cdots\cup9$ |

Many books and exam papers write $+$ for union, as in $(0+1)^*$. It means the same as $\cup$.

**Precedence**, highest first: star, then concatenation, then union. So $0^*10^*\cup1$ means $\big((0^*)1(0^*)\big)\cup1$.

## Reading and writing regular expressions

Take $\Sigma=\{0,1\}$.

1. $0^*10^*$: any 0's, exactly one 1, any 0's. **Strings with exactly one 1.**
2. $\Sigma^*1\Sigma^*$: anything, a 1, anything. **Strings with at least one 1.**
3. $1^*\emptyset=\emptyset$: concatenating with the empty set gives the empty set, like multiplying by 0.
4. $\emptyset^*=\{\varepsilon\}$: star always contains the concatenation of zero pieces.
5. $\Sigma^*1\Sigma^*1\Sigma^*$: **at least two 1's**. The three $\Sigma^*$'s are what comes before the first chosen 1, between the two, and after the second.

**Translating English.**

- Ends in 00: $(0\cup1)^*00$.
- Even length: blocks of two symbols, any number of times: $((0\cup1)(0\cup1))^*$, or $(\Sigma\Sigma)^*$.
- Odd length: $\Sigma(\Sigma\Sigma)^*$.
- Exactly $k$ occurrences of a symbol: put $k$ copies with "anything else" between, e.g. exactly two a's over $\{a,b\}$ is $b^*ab^*ab^*$.
- At most $k$: make each copy optional, e.g. at most two a's is $b^*(a\cup\varepsilon)b^*(a\cup\varepsilon)b^*$.
- Number of a's divisible by 3: $(b^*ab^*ab^*ab^*)^*\,b^*$, or equivalently $b^*(ab^*ab^*ab^*)^*$.
- Does not contain a pattern: think about what may follow each symbol, or build the DFA first and convert it (below).

**The same language has many expressions.** Strings ending in 1: $(0\cup1)^*1$, $0^*1(1\cup0^+1)^*$, $\Sigma^*1$. When checking a proposed expression, test both directions: every string it generates is in the language, and every string of the language can be generated.

## Useful identities

For any regular expressions $R,S,T$:

| Identity | Why |
|---|---|
| $R\cup\emptyset=R$ | adding nothing |
| $R\varepsilon=\varepsilon R=R$ | $\varepsilon$ is the identity for concatenation |
| $R\emptyset=\emptyset R=\emptyset$ | nothing to pair with |
| $\emptyset^*=\varepsilon$, $\varepsilon^*=\varepsilon$ | only zero pieces available |
| $(R^*)^*=R^*$ | starring twice adds nothing |
| $R^*R^*=R^*$ | two runs of pieces are one run |
| $R\cup R=R$ | union is idempotent |
| $(R\cup S)^*=(R^*S^*)^*$ | both mean any sequence of $R$- and $S$-pieces |
| $R(S\cup T)=RS\cup RT$ | concatenation distributes over union |

**A non-identity.** $(R_1\cup R_2)^*\neq R_1^*\cup R_2^*$ in general. With $R_1=a$, $R_2=b$: $ab\in(a\cup b)^*$ but $ab\notin a^*\cup b^*$, since $a^*\cup b^*$ only has strings of all a's or all b's.

## Kleene's theorem

> **Theorem (Kleene).** A language is regular if and only if some regular expression describes it.

So DFAs, NFAs and regular expressions describe exactly the same class of languages. The proof has two lemmas:

- **Lemma 1.** If a regular expression describes $L$, then $L$ is regular: convert the expression to an NFA.
- **Lemma 2.** If $L$ is regular, some regular expression describes it: convert a DFA to an expression.

The full circle: regex $\to$ NFA (Lemma 1), NFA $\to$ DFA (subset construction), DFA $\to$ regex (GNFA, Lemma 2).

## Lemma 1: regular expression to NFA

**Proof by structural induction**, following the definition of a regular expression.

**Base cases.**

1. $R=a$: two states, the start and an accepting state, joined by an arrow labelled $a$. $L=\{a\}$.
2. $R=\varepsilon$: one state, both start and accepting, no arrows. $L=\{\varepsilon\}$.
3. $R=\emptyset$: one state, start and **not** accepting, no arrows. $L=\emptyset$.

**Inductive steps.** Assume $R_1$ and $R_2$ already have NFAs $N_1$, $N_2$. For $R_1\cup R_2$, $R_1R_2$ and $R_1^*$, plug them into the union, concatenation and star constructions from the closure topic. This systematic translation is often called **Thompson's construction**; the slides and exam papers call it converting "using basic principles".

**Procedure.**

1. Parse the expression: star binds tightest, then concatenation, then union.
2. Build the small NFA for each symbol (and each $\varepsilon$ or $\emptyset$).
3. Combine bottom-up, exactly following the parse: concatenation joins with an ε-move, union adds a new start with two ε-moves, star adds a new accepting start and ε-moves back.
4. Do not "optimise" states away when the question says basic principles; the marker wants each construction visible.

**Example: $(ab\cup a)^*$.**

1. NFAs for a ($q_1\to q_2$) and b ($q_3\to q_4$).
2. Concatenate: ε from $q_2$ to $q_3$ gives $ab$.
3. NFA for a ($q_5\to q_6$); union with a new start $q_7$ gives $ab\cup a$.
4. Star: new accepting start $q_8$, ε to $q_7$, and ε from the accepting states $q_4$, $q_6$ back to $q_7$.

${fig("re-ab-a-star")}

## Lemma 2: DFA to regular expression (GNFA)

A **generalised NFA** (GNFA) is an NFA whose arrows are labelled by **regular expressions**, not just symbols. An arrow $q_i\xrightarrow{R}q_j$ means: go from $q_i$ to $q_j$ by reading any block of input that matches $R$. Its transition function is
$$
\delta: (Q\setminus\{q_{accept}\})\times(Q\setminus\{q_{start}\})\to\mathcal R,
$$
where $\mathcal R$ is the set of regular expressions: exactly one label for each allowed ordered pair, $\emptyset$ when there is no real way to move.

**Sipser's GNFA form.**

1. The start state has arrows to every other state and none coming in.
2. There is one accept state, with arrows coming in from every other state and none going out.
3. The start and accept states are different.
4. Every other pair of states, including a state with itself, has exactly one arrow in each direction.

**Preparing a DFA.**

1. Add a new start state with an ε-arrow to the old start.
2. Add a new accept state with ε-arrows from every old accepting state.
3. Combine parallel arrows by union: arrows on a and on b become one arrow $a\cup b$.
4. Any required arrow that is missing gets the label $\emptyset$ (and is usually not drawn).

The new start and accept states make sure nothing enters the start, nothing leaves the accept, and there is one accept state. So at the end exactly two states remain and the one label between them is the answer.

**Ripping a state.** Remove any state $q_{rip}$ other than start and accept. For every remaining pair $q_i$ (not the accept) and $q_j$ (not the start), a run used to go either directly or through $q_{rip}$, looping there any number of times:
$$
R_{new}(q_i,q_j)=R(q_i,q_j)\ \cup\ R(q_i,q_{rip})\,R(q_{rip},q_{rip})^*\,R(q_{rip},q_j).
$$
With $R_1=R(q_i,q_{rip})$, $R_2=R(q_{rip},q_{rip})$, $R_3=R(q_{rip},q_j)$ and $R_4=R(q_i,q_j)$, the new label is $R_4\cup R_1R_2^*R_3$.

**Algorithm Convert($G$).**

1. Let $k$ be the number of states of $G$.
2. If $k=2$, return the label from start to accept.
3. Otherwise pick any $q_{rip}$, build $G'$ with $k-1$ states using the formula for every pair, and return Convert($G'$).

**Why it is correct** (Sipser, Claim 1.65): ripping preserves the language. Any run of $G$ that passes through $q_{rip}$ enters it from some $q_i$, loops some number of times and leaves to some $q_j$; that piece of input matches $R_1R_2^*R_3$, which is in the new $q_i\to q_j$ label. Conversely, any block matching a new label corresponds to such a run in $G$. By induction on $k$, the final label describes $L(G)$, which is the DFA's language.

### Worked example: ε or binary multiples of 3

${fig("re-div3-dfa")}

**Step 1: make the GNFA.**

${fig("re-gnfa-1")}

**Step 2: rip $q_2$.** The only path through $q_2$ is $q_1\to q_2\to q_1$:
$$
R_{new}(q_1,q_1)=\emptyset\cup 0\,1^*\,0=01^*0.
$$

${fig("re-gnfa-2")}

**Step 3: rip $q_1$.** The only path through $q_1$ is $q_0\to q_1\to q_0$:
$$
R_{new}(q_0,q_0)=0\cup 1(01^*0)^*1.
$$

${fig("re-gnfa-3")}

**Step 4: rip $q_0$.** The path is $q_s\to q_0\to q_a$:
$$
R(q_s,q_a)=\varepsilon\,\big(0\cup1(01^*0)^*1\big)^*\,\varepsilon=\big(0\cup1(01^*0)^*1\big)^*.
$$

${fig("re-gnfa-4")}

**Sanity check.** 3 is 11, matched by $1(\cdots)^*1$ with zero inner loops. 9 is 1001, matched by $1(01^*0)1$ with $1^*$ empty. Both are multiples of 3.

The algorithm gives *a* correct expression, not necessarily the shortest. Ripping states in a different order gives a different but equivalent expression.

## Exam technique

- **Write a regex for a language:** describe the structure in words first (blocks, what may follow what), then translate. Check one string that should match, one that should not, and the edge cases $\varepsilon$ and single symbols.
- **Choose the correct options:** for each option, either find a string it wrongly includes or wrongly excludes (a counterexample kills it), or argue both inclusions to show it is correct.
- **Convert an automaton:** use the GNFA method and show each rip with the formula. Choosing to rip states with few connections first keeps expressions short.
`

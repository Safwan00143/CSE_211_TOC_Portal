const r = String.raw

export const dfaNote = r`
## What a state is

A system reads a sequence of events and cannot remember every one of them. A **state** is a compressed summary of the past: exactly the information needed to decide future behaviour, with the irrelevant history thrown away.

The whole skill of designing a finite automaton is choosing that summary. For "even number of 1's" the summary is one bit, *even so far* or *odd so far*, however long the input is.

**Role of a state.** A state is the machine's only memory. There are finitely many states, so the machine can only distinguish finitely many "situations". That is both why DFAs are simple and why they cannot count without bound. Infinite capacity is impossible by definition: a machine with infinitely many states would not be a finite automaton, and could recognise any language at all (one state per string).

## The formal definition

A **deterministic finite automaton** (DFA) is a 5-tuple
$$
M=(Q,\Sigma,\delta,q_0,F)
$$
where

- $Q$ is a finite set of **states**,
- $\Sigma$ is a finite **input alphabet**,
- $\delta: Q\times\Sigma\to Q$ is the **transition function**,
- $q_0\in Q$ is the **start state**,
- $F\subseteq Q$ is the set of **accepting states**.

*Deterministic* means $\delta$ is a function: from every state, on every symbol, there is **exactly one** next state. No choice, no missing move.

### The running example

$\text{EVEN}_1=\{w\in\{0,1\}^* : w \text{ contains an even number of 1's}\}$. Members: $\varepsilon$, $0$, $11$, $1010$. Non-members: $1$, $10$, $111$.

` + "```fig\ndfa-even1\n```" + r`

The same machine as mathematics: $M=(\{q_E,q_O\},\{0,1\},\delta,q_E,\{q_E\})$ with

| $\delta$ | 0 | 1 |
|---|---|---|
| $\to * q_E$ | $q_E$ | $q_O$ |
| $q_O$ | $q_O$ | $q_E$ |

The diagram is good for intuition and design; the tuple is good for proofs. A transition table is just one way to write down $\delta$.

**Reading a transition table.** There is one row per state and one column per input symbol, so the table is $|Q|\times|\Sigma|$. The arrow $\to$ marks the start state and $*$ marks accepting states. Marking a state accepting adds a $*$ but no row or column, so **the number of accepting states never changes the table's size**. It only changes which rows carry a $*$.

## Acceptance and the language of a DFA

Let $M=(Q,\Sigma,\delta,q_0,F)$ and let $w=w_1w_2\cdots w_n$ with each $w_i\in\Sigma$. $M$ **accepts** $w$ if there is a sequence of states $r_0,r_1,\dots,r_n$ with

1. $r_0=q_0$ (start at the start state),
2. $\delta(r_i,w_{i+1})=r_{i+1}$ for $0\le i\le n-1$ (each step follows $\delta$),
3. $r_n\in F$ (end in an accepting state).

Otherwise $M$ **rejects** $w$. The **language** of $M$ is
$$
L(M)=\{w : M \text{ accepts } w\}.
$$
$M$ **recognises** $L$ when $L(M)=L$: every $w\in L$ is accepted and every $w\notin L$ is rejected.

Hopcroft–Motwani–Ullman (and some older papers) write the same thing with the **extended transition function** $\hat\delta$: $\hat\delta(q,\varepsilon)=q$ and $\hat\delta(q,xa)=\delta(\hat\delta(q,x),a)$, and $M$ accepts $w$ iff $\hat\delta(q_0,w)\in F$. It is the state reached after reading all of $w$.

**The empty string.** On input $\varepsilon$ the machine reads nothing and stays in $q_0$. So a DFA accepts $\varepsilon$ exactly when $q_0\in F$.

**Dead states.** A dead (trap) state is one from which acceptance is impossible: it is not accepting and every symbol loops back to it. Dead states keep $\delta$ total, so the machine stays deterministic and complete. Diagrams sometimes leave the dead state out to save clutter; any missing arrow then goes to it implicitly.

### Tracing $\text{EVEN}_1$

On $1010$ (accepted): $q_E \xrightarrow{1} q_O \xrightarrow{0} q_O \xrightarrow{1} q_E \xrightarrow{0} q_E$, and $q_E\in F$.

On $111$ (rejected): $q_E \xrightarrow{1} q_O \xrightarrow{1} q_E \xrightarrow{1} q_O$, and $q_O\notin F$.

## How to design a DFA

1. **Decide what information must be remembered.** This is almost always the hard step.
2. **Make one state for each possible memory situation.**
3. **Define how each input symbol updates that information.** Every state needs a move on every symbol.
4. **Mark the accepting states.**

Then check the design by saying in words what each state remembers, and trace a few strings that should be accepted and a few that should not.

## Example 1: strings containing 001

$L=\{w\in\{0,1\}^* : w \text{ contains } 001 \text{ as a substring}\}$. Members: $001$, $1001$, $0010$. Non-members: $\varepsilon$, $00$, $0101$.

**What to remember:** the longest suffix of the input so far that is also a prefix of $001$.

| State | Remembers |
|---|---|
| $q$ | nothing useful yet |
| $q_0$ | the input ends in 0 (but not 00) |
| $q_{00}$ | the input ends in 00 |
| $q_{001}$ | 001 has appeared somewhere |

` + "```fig\ndfa-001\n```" + r`

Two moves need care. From $q_0$, reading 1 gives "01", whose longest useful suffix is nothing, so go back to $q$. From $q_{00}$, reading 0 gives "000", whose suffix "00" is still useful, so stay.

Trace $1001$: $q\xrightarrow1 q\xrightarrow0 q_0\xrightarrow0 q_{00}\xrightarrow1 q_{001}$, accepted. Trace $0101$: $q\xrightarrow0 q_0\xrightarrow1 q\xrightarrow0 q_0\xrightarrow1 q$, rejected.

## Example 2: binary numbers divisible by 3

$L=\{w\in\{0,1\}^+ : w \text{ is the binary representation of a multiple of 3}\}$. Members: $0$, $11$, $110$, $1001$. Non-members: $\varepsilon$, $1$, $10$, $100$.

Note $\Sigma^+$: one or more symbols, so $\varepsilon\notin\Sigma^+$, whereas $\varepsilon\in\Sigma^*$.

**What to remember:** only the value mod 3. Appending bit $b$ to the right doubles the number and adds $b$, so if the current value has remainder $r$, the new remainder is
$$
r\ \mapsto\ 2r+b \pmod 3.
$$

| Remainder $r$ | read 0: $2r$ | read 1: $2r+1$ |
|---|---|---|
| 0 | 0 | 1 |
| 1 | 2 | 0 |
| 2 | 1 | 2 |

States $q_0,q_1,q_2$ hold remainders 0, 1, 2. A separate start state $q_s$ ("no bit read yet") stops $\varepsilon$ from being accepted. Accept in $q_0$.

` + "```fig\ndfa-div3\n```" + r`

Trace $1001$ (nine): $q_s\xrightarrow1 q_1\xrightarrow0 q_2\xrightarrow0 q_1\xrightarrow1 q_0$, accepted. Trace $100$ (four): $q_s\xrightarrow1 q_1\xrightarrow0 q_2\xrightarrow0 q_1$, rejected.

The same idea gives "divisible by $k$" for any $k$ and any base: keep the remainder, and update $r\mapsto (\text{base}\cdot r+\text{digit}) \bmod k$.

## Example 3: valid football scores

Over $\Sigma=\{0,d,-\}$, where $d$ stands for any nonzero digit:
$$
L=\{x\text{-}y : x,y \text{ are nonnegative integers with no leading zeros}\}.
$$
Members: 0-0, d-0, d0-dd. Non-members: $\varepsilon$, 00-d, d-, d--0.

**What to remember:** are we in the first score or the second, did the current score start with 0 or with a nonzero digit, and has the single hyphen been used?

` + "```fig\ndfa-scores\n```" + r`

A score that starts with 0 must end there ($0_1$, $0_2$: any further digit is fatal). A score that starts with $d$ may continue with any digits ($d_1$, $d_2$ loop). Both halves must be nonempty, so only $0_2$ and $d_2$ accept.

## Product construction: two conditions at once

$L=\{w\in\{0,1\}^* : w \text{ has an even number of 0's and } |w| \text{ is a multiple of } 3\}$. Members: $\varepsilon$, 111, 001. Non-members: 0, 11, 011.

Two independent facts must be tracked: the parity of 0's (2 values) and the length mod 3 (3 values). A state is a pair $(p,\ell)$, so $2\times3=6$ states. Reading 0 flips $p$ and adds 1 to $\ell$; reading 1 keeps $p$ and adds 1 to $\ell$. Accept only $(E,0)$.

` + "```fig\ndfa-product\n```" + r`

This is the **product construction**: run two DFAs side by side in one machine whose states are pairs. Choosing which pairs accept gives intersection (both accept), union (either accepts) or difference. The closure-properties topic proves it in general.

## The k-th symbol from the end

$L=\{w\in\{0,1\}^* : \text{the 2nd symbol from the right is } 1\}$. Members: 10, 011, 110, 0011. Non-members: $\varepsilon$, 0, 1, 100.

The machine cannot know where the end is, so it keeps a **sliding window** of the last two symbols: $q_{xy}$ means "the last two symbols were $x$, then $y$". Reading $a$ moves from $q_{xy}$ to $q_{ya}$. The start state $q_{00}$ pretends the input began with two 0's, which is harmless because those 0's are never "the 2nd from the right" of a real string of length at least 2.

` + "```fig\ndfa-second-last\n```" + r`

Accept when the older symbol $x$ is 1: $q_{10}$ and $q_{11}$. For the $k$-th symbol from the end the window needs $2^k$ states, which is why this language is the standard example where an NFA is exponentially smaller (next topic).

## Pattern interference: contains ab but not ba

$L=\{w\in\{a,b\}^* : w \text{ contains } ab \text{ but not } ba\}$. Members: ab, aab, abb, aaabbb. Non-members: $\varepsilon$, a, b, aba, ba.

Once a $b$ occurs, no $a$ may follow (that would create $ba$). And an $ab$ must appear. So the valid strings are exactly $a^+b^+$.

` + "```fig\ndfa-ab-not-ba\n```" + r`

| State | Remembers |
|---|---|
| $S$ | nothing read |
| $A$ | only $a$'s so far |
| $AB$ | $a^+b^+$ so far: accept |
| $B$ | started with $b$: can never contain $ab$ without $ba$ first |
| Dead | $ba$ has appeared |

## No symbol repeated

$L=\{w\in\{a,b,c\}^* : \text{no symbol appears more than once in } w\}$. Members: $\varepsilon$, a, ba, cab, bca. Non-members: aa, aba, cabc, bb.

**What to remember:** the *set* of symbols seen so far. There are $2^3=8$ sets, plus a dead state $D$ for a repeat. Every state except $D$ accepts. This one is clearer as a table:

| State | on $a$ | on $b$ | on $c$ |
|---|---|---|---|
| $\to\emptyset$ | a | b | c |
| a | D | ab | ac |
| b | ab | D | bc |
| c | ac | bc | D |
| ab | D | D | abc |
| ac | D | abc | D |
| bc | abc | D | D |
| abc | D | D | D |
| D | D | D | D |

## Lexical analysis: one C-style block comment

Over $\Sigma=\{/,*,x\}$ ($x$ is any other character): $L=$ strings that are exactly one block comment, starting with /\* and ending at the first later \*/, with nothing after it. Members: /\*\*/, /\*x\*/, /\*/x\*\*/. Non-members: /\*, /x\*/, /\*x\*/x, /\*x\*/\*/.

` + "```fig\ndfa-comment\n```" + r`

$q_3$ remembers "inside the comment and the last symbol was a star". A star keeps us there; a slash closes the comment ($q_4$); anything else drops back to $q_2$. After closing, any further symbol is an error. This is exactly how a compiler's lexer strips comments.

## Checklist

Given a DFA you should be able to:

- name $Q$, $\Sigma$, $\delta$, $q_0$ and $F$;
- say in words what each state remembers;
- trace an input and decide whether it is accepted;
- describe the language it recognises.

Given a language, start by asking what finite information is enough. A DFA is not just a diagram: it is a mathematical object that computes with finite memory.
`

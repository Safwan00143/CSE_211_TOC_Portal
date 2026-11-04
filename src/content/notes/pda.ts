import { pdaAcceptingTrace, pdaTraceTex, type PdaSipser } from "@/lib/automata"
import {
  pda0n1n,
  pdaAnB2n,
  pdaBalanced,
  pdaEqual,
  pdaIEqK,
  pdaILeJ,
  pdaNested,
  pdaPal,
  pdaSum,
  pdaWHashWr,
} from "../machines/notes-pda"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

/** State names as on the slides: q_{push}, q_{acc}, q_=, c_0, p_a … */
const tex = (q: string) => {
  if (q === "qe") return "q_="
  if (/^[cpr][a-z0-9]$/.test(q)) return `${q[0]}_{${q[1]}}`
  if (/^q\d+$/.test(q)) return `q_{${q.slice(1)}}`
  return q.length > 1 && q[0] === "q" ? `q_{\\text{${q.slice(1)}}}` : q
}
const trace = (m: PdaSipser, w: string) => {
  const t = pdaAcceptingTrace(m, w)
  if (!t) throw new Error(`${w} is not accepted`)
  return pdaTraceTex(t, tex)
}

export const pdaNote = r`
## Why a stack

The pumping lemma showed that $A=\{0^n1^n \mid n\ge0\}$ needs more memory than a finite automaton has. A recogniser must remember how many 0's it saw and then check exactly that many 1's.

| A DFA has | A stack can |
|---|---|
| finitely many states | push one marker per 0 |
| no growing memory | pop one marker per 1 |
| no way to store an arbitrary $n$ | detect a mismatch or wrong order |

A stack is **last in, first out**: push puts a symbol on top, pop removes the top symbol, and only the top is directly visible.

A **pushdown automaton** (PDA) is roughly an NFA with a stack. At each step it uses the current state, the next input symbol or $\varepsilon$, and the top stack symbol or $\varepsilon$.

**Strategy for $0^n1^n$.** While reading 0's, push one 0 per input 0. On the first 1, switch to popping. Pop one 0 per input 1. Accept only when the input is used up and the stack is empty. The stack height records $\#0-\#1$ so far.

**How bad strings fail.** 001: input ends with a 0 still on the stack. 011: a 1 needs a pop but the stack is empty. 0101: after the 1-phase begins, a 0 has no legal move. A PDA rejects when **every** branch fails.

## Formal definition (Sipser)

A **pushdown automaton** is a 6-tuple $P=(Q,\Sigma,\Gamma,\delta,q_0,F)$:

- $Q$: finite set of states;
- $\Sigma$: input alphabet;
- $\Gamma$: stack alphabet;
- $q_0\in Q$: start state;
- $F\subseteq Q$: accept states;
- $\delta: Q\times\Sigma_\varepsilon\times\Gamma_\varepsilon\to\mathcal P(Q\times\Gamma_\varepsilon)$, where $\Sigma_\varepsilon=\Sigma\cup\{\varepsilon\}$ and $\Gamma_\varepsilon=\Gamma\cup\{\varepsilon\}$.

**Why a separate stack alphabet?** $\Gamma$ holds memory, which need not look like the input. For $0^n1^n$ take $\Sigma=\{0,1\}$ and $\Gamma=\{0,\text{\textdollar}\}$: a 0 is pushed per input 0, and \$ marks the bottom.

**Bottom-of-stack marker.** A special symbol (\$, Z or $Z_0$) pushed first, with the move $\varepsilon,\varepsilon\to\text{\textdollar}$. Seeing it again means every stored symbol has been removed. It is a design choice, not part of Sipser's definition, but without it a PDA cannot test for an empty stack.

**Reading $\delta$.** If $(r,c)\in\delta(q,a,b)$, the PDA may

1. move from $q$ to $r$,
2. read $a$ from the input, unless $a=\varepsilon$,
3. pop $b$ from the stack, unless $b=\varepsilon$,
4. push $c$ onto the stack, unless $c=\varepsilon$.

| Pop $b$ | Push $c$ | Effect |
|---|---|---|
| $X$ | $Y$ | replace $X$ by $Y$ |
| $X$ | $\varepsilon$ | pop $X$ |
| $\varepsilon$ | $Y$ | push $Y$ |
| $\varepsilon$ | $\varepsilon$ | stack unchanged |

$\delta$ returns a **set**, so a PDA is nondeterministic: $\delta(q,\varepsilon,\varepsilon)=\{(q_1,\varepsilon),(q_2,\varepsilon)\}$ lets it move to either. This is how it guesses a midpoint, which part to compare, or which branch of a union holds.

**Diagram labels** are written *input, pop $\to$ push*:

| Label | Meaning |
|---|---|
| $0,\varepsilon\to0$ | read 0, push 0, pop nothing |
| $1,0\to\varepsilon$ | read 1, pop a 0, push nothing |
| $\varepsilon,\varepsilon\to\text{\textdollar}$ | read nothing, pop nothing, push the bottom marker |
| $\varepsilon,\text{\textdollar}\to\varepsilon$ | read nothing, remove the bottom marker |

$\varepsilon$ has three roles: in the input slot it means "consume nothing", in the pop slot "do not inspect or remove", in the push slot "add nothing". It is an instruction, never a symbol on the tape or stack.

## Configurations and acceptance

A **configuration** $(q,w,s)$ records the current state $q$, the unread input $w$, and the stack contents $s$ **with the top on the left**. $(q_{pop},11,00)$: in the popping state, 11 still to read, two 0's on the stack.

**One step.** If $(r,c)\in\delta(q,a,b)$ then
$$
(q,aw,bs)\vdash(r,w,cs),
$$
where an $\varepsilon$ in $a$, $b$ or $c$ means that piece is absent.

**Acceptance by final state.** $P$ accepts $w$ if some sequence of moves gives
$$
(q_0,w,\varepsilon)\overset{*}{\vdash}(q_f,\varepsilon,s)
$$
for some $q_f\in F$ and any stack $s$. Two requirements: the **whole input** is consumed, and **some** branch ends in an accept state. (Acceptance by empty stack is the other standard convention; it recognises the same languages. Atif Sir's part covers it.)

## A complete PDA for 0ⁿ1ⁿ

${fig("pda-0n1n")}

**Correctness, both directions.** For $0^n1^n$ the PDA pushes \$, pushes $n$ markers, pops $n$ markers, pops \$ and accepts. Conversely, an accepting run must read only 0's while pushing, then only 1's while popping, and can reach $q_4$ only when \$ is on top, i.e. after every pushed 0 was popped by a 1, so the counts are equal. $q_1$ is accepting for $n=0$.

Trace of 0011:
${trace(pda0n1n, "0011")}

**A warning about the slide's drawing.** The slide's version has no bottom marker and moves from $q_{pop}$ to $q_{acc}$ on $\varepsilon,\varepsilon\to\varepsilon$:

${fig("pda-slide-0n1n")}

With final-state acceptance that move may fire while 0's remain on the stack, so the machine accepts 001, and the direct $q_{push}\to q_{acc}$ move accepts 0 and 00. Checked by simulation, it accepts exactly $\{0^n1^m \mid m\le n\}$. The fix is the bottom marker above. This is the most common PDA mistake in answers: **accepting without checking the stack is empty**.

## Nondeterminism: guessing the middle

$B=\{ww^R \mid w\in\{0,1\}^*\}$ ($\varepsilon$, 00, 11, 0110, 1001, 010010). Plan: push the first half, switch at the midpoint, compare the second half. But nothing marks the midpoint, so the PDA **guesses**: at every position one branch keeps pushing and another switches to matching. A wrong guess just dies. The input is accepted if one branch guesses right.

With a delimiter, $C=\{w\#w^R\}$, the # marks the midpoint and no guess is needed:

${fig("pda-w-hash-wr")}

${trace(pdaWHashWr, "01#10")}

01#01 is rejected: after #, the first symbol is 0 but the top is 1, and there is no move $0,1\to\varepsilon$.

**Union by branching.** For $\{0^i1^j2^k \mid i=j \text{ or } j=k\}$ the PDA nondeterministically picks one job: check $i=j$ and ignore the 2's, or ignore the 0's and check $j=k$. Nondeterministic branching is a natural way to build a union.

## Design patterns

1. **Count and match.** The stack is an unbounded counter when later input must match an earlier quantity: $a^nb^n$, $a^ib^jc^k$ with $i=j$. The stack is not random access, so its LIFO order matters once symbols, not just counts, must agree.
2. **Store and reverse.** When the second part must reproduce the first in reverse ($w\#w^R$, $ww^R$), push symbols then pop and compare; LIFO reverses for free.
3. **Guess a boundary.** When a phase change is not marked: add an ε-move to the new phase, allow it anywhere, and make sure only the right guess can finish.

**Checklist.**

1. What information must survive for an unbounded distance?
2. What does each stack symbol mean?
3. When does the machine push and when does it pop?
4. Is the phase boundary visible, or must it be guessed?
5. Which malformed orders should simply have no transition?
6. How are $\varepsilon$ and the empty input handled?
7. Why can no string outside the language reach an accept state?

**Common mistakes.**

1. Accepting as soon as the stack is empty while input remains, or accepting with symbols still on the stack.
2. Forgetting the empty string when $n=0$ is allowed.
3. Popping without checking that the popped symbol matches.
4. A transition that accidentally allows symbols in the wrong order.
5. Treating nondeterminism as "try one choice" instead of "accept if some branch succeeds".
6. Confusing $\varepsilon$ with a real input or stack symbol.

| | Finite automaton | Pushdown automaton |
|---|---|---|
| Memory | current state only | state plus unbounded stack |
| Access | finite control | top of stack only |
| Typical power | local patterns | nested or matched structure |
| Example | strings ending in 01 | $0^n1^n$, palindromes |
| Nondeterminism | adds no power | strictly adds power |

One stack still has limits: $\{0^n1^n2^n\}$ is not recognised by any PDA. After comparing the 0's with the 1's, the stack no longer holds the count needed for the 2's. The pumping lemma for CFLs proves it.

## Ten worked PDAs

All examples push a bottom marker Z first and accept by final state, with the only accepting move taken after Z is visible again. Push while reading the part to remember; pop while reading the part that must match; let wrong order, wrong symbol or wrong count get stuck.

### 1. $a^nb^{2n}$

${fig("pda-anb2n")}

After $n$ a's the stack is $X^nZ$; exactly two b's remove one X.

${trace(pdaAnB2n, "aabbbb")}

Failure modes: an odd number of b's, too few or too many b's, or an a after a b.

### 2. $a^ib^j$ with $i\le j$

${fig("pda-i-le-j")}

${trace(pdaILeJ, "aabbb")}

aab is rejected: one b removes only one X, so Z never reaches the top and $q_x$ cannot be entered.

### 3. $a^ib^jc^k$ with $i=k$

${fig("pda-i-eq-k")}

${trace(pdaIEqK, "aabbcc")}

The b's never change the stack, so the height records $i-k$.

### 4. $w\#w^R$

See the diagram above. Before # push each symbol; after # pop and compare.

### 5. All palindromes

${fig("pda-pal")}

Two guesses for the middle: an ε-move (even length) or consume one symbol without pushing (odd length). One accepting branch for 01010:
${trace(pdaPal, "01010")}

### 6. Balanced parentheses

${fig("pda-balanced")}

${trace(pdaBalanced, "(()())")}

Invariant: the stack holds exactly the unmatched ( of the prefix read so far. A prefix with more ) than ( gets stuck because there is no X to pop.

### 7. Equal numbers of 0's and 1's

${fig("pda-equal")}

The stack stores the current imbalance: in $q_0$ the X's are extra 0's, in $q_1$ extra 1's. Reading the opposite symbol cancels one X; $c_0$/$c_1$ then look at the top (pop X and push it back) to decide whether an imbalance remains.

${trace(pdaEqual, "001011")}

### 8. $a^ib^jc^k$ with $i=j$ or $j=k$

${fig("pda-ij-or-jk")}

For $a^3b^3c^5$ the top branch accepts ($i=j=3$, c's ignored). For $a^4b^2c^2$ the bottom branch accepts (a's ignored, $j=k=2$). The PDA does not need to know which equality holds.

### 9. $a^nb^mc^md^n$

${fig("pda-nested")}

${trace(pdaNested, "aabbccdd")}

The B's sit above the A's, so all c's must match the b's before any d can match an a.

### 10. $a^ib^jc^{i+j}$

${fig("pda-sum")}

${trace(pdaSum, "aabccc")}

The stack counts the a's and b's together; the c-block must remove exactly that many markers.

### Summary

| Language type | Role of the stack |
|---|---|
| $a^nb^{2n}$, $a^ib^j$ with $i\le j$ | counter with a modified popping rule |
| $a^ib^jc^k$ with $i=k$, $a^ib^jc^{i+j}$ | ignore an irrelevant block, match a total |
| $w\#w^R$, palindromes | store symbols and compare in reverse |
| balanced parentheses | store unmatched opening symbols |
| $\#_0=\#_1$ | store the current imbalance |
| $i=j$ or $j=k$ | nondeterministically choose a branch |
| $a^nb^mc^md^n$ | nested LIFO structure |
`

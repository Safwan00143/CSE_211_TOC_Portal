import { indexOf, ithString, moveCode, pcpSolves, tmCode, type CodedMove } from "@/lib/encoding"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

/** HMU Example 9.1, as on the slides. */
const ex: CodedMove[] = [
  { q: 1, x: 2, p: 3, y: 1, d: 2 },
  { q: 3, x: 1, p: 1, y: 2, d: 2 },
  { q: 3, x: 2, p: 2, y: 1, d: 2 },
  { q: 3, x: 3, p: 3, y: 2, d: 1 },
]
const exRules = [
  r`\delta(q_1,1)=(q_3,0,R)`,
  r`\delta(q_3,0)=(q_1,1,R)`,
  r`\delta(q_3,1)=(q_2,0,R)`,
  r`\delta(q_3,B)=(q_3,1,L)`,
]
const codeRows = ex.map((m, k) => `| $${exRules[k]}$ | $(${m.q},${m.x},${m.p},${m.y},${m.d})$ | \`${moveCode(m)}\` |`).join("\n")
const enumRows = Array.from({ length: 8 }, (_, k) => k + 1)
  .map((i) => `| ${i} | \`1${ithString(i)}\` | ${ithString(i) || "$\\varepsilon$"} |`)
  .join("\n")
const pcpA = ["1", "10111", "10"]
const pcpB = ["111", "10", "0"]
if (!pcpSolves(pcpA, pcpB, [2, 1, 1, 3])) throw new Error("PCP example is wrong")

export const undecidabilityNote = r`
## The question

In 1900 Hilbert posed 23 problems; the tenth asked for a process to decide whether a polynomial such as $6x^3yz^2+3xy^2-x^3-10$ has integer roots. In 1931 Gödel showed that no consistent, effectively listable system of axioms proves every truth of arithmetic. In 1936 Church ($\lambda$-calculus) and Turing (Turing machines) gave formal definitions of "computable", and showed they coincide with Gödel and Herbrand's general recursive functions. In 1970 Matiyasevich, building on Davis, Putnam and Robinson, showed that **no algorithm** decides Hilbert's tenth problem.

**Church–Turing thesis.** Any general way to compute computes only what Turing machines compute. It cannot be proved, because "general way to compute" is informal, but we have seen TMs and computers simulate each other.

**Some undecidable problems:** Hilbert's Entscheidungsproblem (is a statement provable from the axioms?), satisfiability of first-order Horn clauses, the **halting problem**, whether a CFG is ambiguous, whether two CFGs generate the same language, and the mortal matrix problem (can some product of given integer matrices be zero?).

## Recursive and RE languages

- $L$ is **recursively enumerable** (RE) if $L=L(M)$ for some TM $M$. If $w\in L$, $M$ eventually accepts; if $w\notin L$, $M$ may run forever.
- $L$ is **recursive** if $L=L(M)$ for some TM $M$ that **halts on every input**: if $w\in L$, $M$ accepts (and halts); if $w\notin L$, $M$ eventually halts without accepting.

A problem is **decidable** if its language is recursive and **undecidable** otherwise. (Sipser's names: *Turing-recognisable* for RE, *decidable* for recursive. Old papers use both.)

So every language falls into exactly one of three classes:

1. recursive;
2. RE but not recursive;
3. not RE.

${fig("undec-classes")}

## Some decidable languages

Everything about finite automata and the membership and emptiness problems for grammars is decidable (Sipser, Section 4.1):

| Language | Decider idea |
|---|---|
| $A_{DFA}=\{\langle B,w\rangle \mid B \text{ is a DFA accepting } w\}$ | simulate $B$ on $w$; accept iff it ends in an accepting state |
| $A_{NFA}$ | convert to a DFA (subset construction), then use $A_{DFA}$ |
| $A_{REX}=\{\langle R,w\rangle \mid R \text{ generates } w\}$ | convert $R$ to an NFA, then $A_{NFA}$ |
| $E_{DFA}=\{\langle A\rangle \mid L(A)=\emptyset\}$ | mark states reachable from the start; accept iff no accepting state is marked |
| $EQ_{DFA}=\{\langle A,B\rangle \mid L(A)=L(B)\}$ | build a DFA for the symmetric difference (product construction); test it with $E_{DFA}$ |
| $A_{CFG}=\{\langle G,w\rangle \mid G \text{ generates } w\}$ | convert $G$ to CNF and run CYK |
| $E_{CFG}=\{\langle G\rangle \mid L(G)=\emptyset\}$ | test whether the start variable is generating |

$EQ_{CFG}$, by contrast, is **undecidable**.

**Proof that $A_{DFA}$ is decidable.** On input $\langle B,w\rangle$: (1) check the input is a valid encoding of a DFA and a string, rejecting otherwise; (2) simulate $B$ on $w$, keeping track of the current state and position, one transition per symbol; (3) when $w$ is used up, accept if the current state is accepting, otherwise reject. The simulation takes $|w|$ steps, so this TM always halts, and it accepts exactly when $B$ accepts $w$.

The same pattern shows that, given DFAs $A$, $B$, $C$, "$L(C)=L(A)\cup L(B)$" is decidable: build a DFA for $L(A)\cup L(B)$ by the product construction and test equality with $C$ using $EQ_{DFA}$.

## Encoding Turing machines

To talk about "the $i$-th TM" we turn every TM into a binary string.

### Enumerating binary strings

Give each binary string a positive integer: for a string $w$, read $1w$ as a binary number $i$; then $w$ is the **$i$-th string** $w_i$. Equivalently, order strings by length, and strings of the same length lexicographically.

| $i$ | $i$ in binary | $w_i$ |
|---|---|---|
${enumRows}

For example, the 13th string: $13=1101_2$; drop the leading 1 to get $w_{13}=101$. Conversely 101 has index ${indexOf("101")}.

### Codes for TMs

Take a TM $M=(Q,\{0,1\},\Gamma,\delta,q_1,B,F)$ and number everything:

- states $q_1,q_2,\dots,q_r$, with $q_1$ the start state and $q_2$ the **only** accepting state (a TM may halt when it accepts, so one accepting state suffices);
- tape symbols $X_1,X_2,\dots,X_s$, with $X_1=0$, $X_2=1$, $X_3=B$, and the rest in any order;
- directions $D_1=L$, $D_2=R$.

A rule $\delta(q_i,X_j)=(q_k,X_l,D_m)$ is coded as
$$
0^i\,1\,0^j\,1\,0^k\,1\,0^l\,1\,0^m.
$$
All of $i,j,k,l,m$ are at least 1, so a single rule's code never contains two consecutive 1's. The code for $M$ is all its rules' codes in some order, separated by **11**:
$$
C_1\,11\,C_2\,11\,\cdots\,11\,C_n.
$$

**Example (HMU 9.1).** $M=(\{q_1,q_2,q_3\},\{0,1\},\{0,1,B\},\delta,q_1,B,\{q_2\})$:

| Rule | $(i,j,k,l,m)$ | Code |
|---|---|---|
${codeRows}

One code for $M$:
$$
\texttt{${tmCode(ex)}}
$$
The four rules can be listed in any of $4!=24$ orders, so $M$ has 24 codes (more if states or symbols are renumbered). That does not matter.

**Countably many TMs.** Every TM has a binary code, and binary strings can be listed $w_1,w_2,\dots$, so the TMs can be listed $M_1,M_2,\dots$: there are only **countably** many TMs.

**Strings that are not codes.** If $w_i$ is not a valid code (for example 11001 starts with 1, or a string has 111), let $M_i$ be the TM with one state and no moves, which halts at once and accepts nothing: $L(M_i)=\emptyset$.

## The diagonalization language Ld

$M_i$ is the TM whose code is $w_i$. Define
$$
L_d=\{w_i \mid w_i\notin L(M_i)\}:
$$
the strings $w$ such that the TM coded by $w$ does **not** accept $w$.

**Why "diagonalization".** Picture a table: row $i$ is the characteristic vector of $L(M_i)$, entry $(i,j)$ is 1 if $M_i$ accepts $w_j$. $L_d$ is the **complemented diagonal**. It differs from row $i$ in column $i$, for every $i$, so it equals no row: no TM accepts it.

| | $w_1$ | $w_2$ | $w_3$ | $w_4$ | ⋯ |
|---|---|---|---|---|---|
| $M_1$ | **0** | 1 | 1 | 0 | ⋯ |
| $M_2$ | 1 | **1** | 0 | 0 | ⋯ |
| $M_3$ | 0 | 0 | **1** | 1 | ⋯ |
| $M_4$ | 0 | 1 | 0 | **1** | ⋯ |
| ⋮ | | | | | ⋱ |

With these (illustrative) entries the diagonal is 0, 1, 1, 1, …, so $L_d$ begins 1, 0, 0, 0, …: it contains $w_1=\varepsilon$ and not $w_2$, $w_3$, $w_4$.

The barber of Seville, who shaves exactly those who do not shave themselves, is the same paradox: does he shave himself?

> **Theorem.** $L_d$ is not recursively enumerable: no TM accepts $L_d$.

**Proof.**

1. Suppose $L_d=L(M)$ for some TM $M$.
2. $L_d$ is over $\{0,1\}$, so $M$ is in the list: $M=M_i$ for some $i$ (a code of $M$ is $w_i$).
3. Is $w_i\in L_d$?
   - If $w_i\in L_d$, then $M_i$ accepts $w_i$ (because $L(M_i)=L_d$). But by definition of $L_d$, $w_i\in L_d$ means $M_i$ does **not** accept $w_i$. Contradiction.
   - If $w_i\notin L_d$, then $M_i$ does not accept $w_i$. By definition of $L_d$, that puts $w_i\in L_d$. Contradiction.
4. $w_i$ can be neither in nor out of $L_d$, so $M$ cannot exist. $\blacksquare$

## Complements

> **Theorem.** If $L$ is recursive, so is $\overline L$.

**Proof.** Let $M$ halt on every input with $L(M)=L$. Build $\overline M$:

1. make $M$'s accepting states non-accepting, with no moves (so $\overline M$ halts there without accepting);
2. add a new accepting state $r$ with no moves;
3. for every non-accepting state and tape symbol where $M$ has no move (that is, $M$ halts without accepting), add a move to $r$.

$M$ always halts, so $\overline M$ always halts, and $\overline M$ accepts exactly what $M$ does not. So $\overline L$ is recursive.

> **Theorem.** If both $L$ and $\overline L$ are RE, then $L$ (and hence $\overline L$) is recursive.

**Proof.** Let $L=L(M_1)$ and $\overline L=L(M_2)$. Build a two-tape TM $M$ that simulates $M_1$ and $M_2$ **in parallel**, one step of each in turn, one on each tape, with both states as components of $M$'s state. Every $w$ is in $L$ or in $\overline L$, so one of them eventually accepts. If $M_1$ accepts, $M$ accepts and halts; if $M_2$ accepts, $M$ halts without accepting. $M$ halts on every input and $L(M)=L$, so $L$ is recursive. (Convert $M$ to one tape if needed.) Running them one after the other would not work: the first might never halt.

**Consequences.**

- Of $L$ and $\overline L$: both recursive; or neither RE; or one RE-but-not-recursive and the other not RE. Never one recursive and the other not.
- Equivalently: **$L$ is decidable iff both $L$ and $\overline L$ are Turing-recognisable.** (The "only if" direction: a decider is a recogniser, and complements of recursive languages are recursive.)
- $\overline{L_d}$: since $L_d$ is not RE, $\overline{L_d}$ is not recursive. It is in fact RE (it is essentially $L_u$ restricted to pairs $(w,w)$), so it is RE but not recursive.

**Union of RE languages is RE.** If $L_1=L(M_1)$ and $L_2=L(M_2)$, run $M_1$ and $M_2$ in parallel on $w$ (alternating steps) and accept as soon as either accepts. If $w\in L_1\cup L_2$ one of them accepts in finitely many steps; otherwise the machine never accepts. (Running them in sequence fails if $M_1$ loops on some $w\in L_2$.)

## The universal language Lu

$$
L_u=\{(M,w) \mid M \text{ is a TM over } \{0,1\} \text{ and } w\in L(M)\},
$$
coded as the binary string (code of $M$)$\,111\,w$.

**The universal TM $U$** accepts $L_u$. It is a multitape TM:

- **Tape 1** holds the input: the transitions of $M$, then 111, then $w$.
- **Tape 2** holds $M$'s simulated tape, in the same code: tape symbol $X_i$ as $0^i$, cells separated by single 1's.
- **Tape 3** holds $M$'s state, $q_i$ as $0^i$.
- A **scratch tape** for shifting.

**Operation.**

1. Check that tape 1 holds a legitimate TM code. If not, halt without accepting.
2. Write $w$ in coded form on tape 2.
3. Write 0 (the start state $q_1$) on tape 3 and put tape 2's head on the first simulated cell.
4. To simulate a move: search tape 1 for a rule $0^i10^j10^k10^l10^m$ with $0^i$ equal to tape 3 and $0^j$ the symbol under tape 2's head. Then change tape 3 to $0^k$ (new state), replace $0^j$ by $0^l$ on tape 2 (shifting over if the length changes), and move tape 2's head to the next 1 to the left ($m=1$) or right ($m=2$).
5. If no rule matches, $M$ halts, and so does $U$.
6. If $M$ enters its accepting state ($q_2$), $U$ accepts.

$U$ accepts $(M,w)$ iff $M$ accepts $w$, so $L_u=L(U)$ and **$L_u$ is RE**.

> **Theorem.** $L_u$ is RE but not recursive.

**Proof.** Suppose $L_u$ were recursive. Then $\overline{L_u}$ would be recursive; let $M$ accept $\overline{L_u}$ (and always halt). Build $M'$:

1. given $w$, change the input to $w\,111\,w$;
2. run $M$ on it.

If $w=w_i$, $M$ is deciding whether $M_i$ accepts $w_i$, and $M$ accepts exactly when $M_i$ does **not** accept $w_i$, that is, when $w_i\in L_d$. So $L(M')=L_d$. But $L_d$ is not RE, so $M'$ cannot exist, and $L_u$ is not recursive. $\blacksquare$

## The halting problem

Turing's own machines accepted by **halting**. Let $H(M)$ be the set of inputs on which $M$ halts, whether it accepts or not. The **halting problem** is
$$
\text{HALT}=\{(M,w) \mid w\in H(M)\}=\{(M,w) \mid M \text{ halts on input } w\}.
$$

**HALT is RE.** Build $U_H$ like $U$: simulate $M$ on $w$, and if $M$ halts (in any state), accept and halt. If $M$ runs forever, so does $U_H$, which is allowed for a recogniser.

**HALT is not recursive.** We know $L_u$ is not recursive. Suppose HALT were recursive, decided by $H$. Decide $L_u$ as follows: on $(M,w)$,

1. run $H$ on $(M,w)$. If $M$ does not halt on $w$, reject;
2. otherwise run $M$ on $w$ to completion (it halts); accept if it halted in an accepting state, else reject.

This always halts and accepts exactly $L_u$, so $L_u$ would be recursive. Contradiction. We have **reduced $L_u$ to HALT**; HALT is RE but not recursive.

### Sipser's direct proof that $A_{TM}$ is undecidable

Older papers ask this with Sipser's notation, $A_{TM}=\{\langle M,w\rangle \mid M \text{ is a TM that accepts } w\}$ (the same language as $L_u$).

1. Suppose a TM $H$ decides $A_{TM}$: $H(\langle M,w\rangle)$ accepts if $M$ accepts $w$ and rejects otherwise.
2. Build $D$: on input $\langle M\rangle$, run $H$ on $\langle M,\langle M\rangle\rangle$ and output the **opposite**: accept if $H$ rejects, reject if $H$ accepts.
3. Run $D$ on its own description: $D(\langle D\rangle)$ accepts iff $H$ rejects $\langle D,\langle D\rangle\rangle$ iff $D$ does not accept $\langle D\rangle$. Contradiction.

So no such $H$ exists. This is the diagonal argument again: $D$ disagrees with every machine on that machine's own description.

## Reductions

If an algorithm converts every instance of problem $P_1$ into an instance of $P_2$ with the same answer, then **$P_1$ reduces to $P_2$**, and $P_2$ is at least as hard as $P_1$:

- if $P_1$ is not recursive, $P_2$ is not recursive;
- if $P_1$ is not RE, $P_2$ is not RE.

The direction matters: to prove a new problem $Q$ undecidable, **reduce a known undecidable problem $P$ to $Q$**. Suppose $Q$ were decidable by $D_Q$; build, from $D_Q$ and the conversion, a decider for $P$; that contradicts $P$ being undecidable. Reducing $Q$ to $P$ proves nothing about $Q$.

**Template answer.**

1. State the known undecidable problem $P$ (for example $L_u$ or HALT) and the target $Q$.
2. Give the conversion: from an instance $x$ of $P$, build an instance $f(x)$ of $Q$ (often a new TM built from $M$ and $w$).
3. Prove both directions: $x\in P\iff f(x)\in Q$.
4. Conclude: a decider for $Q$ would give a decider for $P$; so $Q$ is undecidable.

### Undecidable problems about TMs (Rice's theorem)

Every **nontrivial property of the language a TM accepts** is undecidable. Nontrivial means some RE languages have it and some do not. So it is undecidable whether $L(M)$ is empty, finite, regular, context-free, a set of palindromes, and so on. (This is Rice's theorem, HMU Section 9.3.3; Atif Sir's slides state the consequences.)

**Proof sketch.** Let $\mathcal P$ be a nontrivial property; assume $\emptyset\notin\mathcal P$ (otherwise use the complement property). Pick a TM $M_L$ with $L(M_L)\in\mathcal P$. Reduce $L_u$: from $(M,w)$ build $M'$ that, on input $x$, first simulates $M$ on $w$; if that accepts, it simulates $M_L$ on $x$. Then $L(M')=L(M_L)\in\mathcal P$ if $M$ accepts $w$, and $L(M')=\emptyset\notin\mathcal P$ if not. A decider for $\mathcal P$ would decide $L_u$.

### Post's Correspondence Problem

An **instance of PCP** is two lists of strings of equal length, $A=w_1,\dots,w_k$ and $B=x_1,\dots,x_k$. It has a **solution** if some nonempty index sequence $i_1,\dots,i_m$ gives $w_{i_1}\cdots w_{i_m}=x_{i_1}\cdots x_{i_m}$.

**Example (HMU 9.13).** $A=(${pcpA.join(",\\ ")})$, $B=(${pcpB.join(",\\ ")})$. The sequence 2, 1, 1, 3 is a solution:
$$
w_2w_1w_1w_3=10111\cdot1\cdot1\cdot10=101111110=10\cdot111\cdot111\cdot0=x_2x_1x_1x_3.
$$

**PCP is undecidable.** Through PCP many grammar questions are undecidable:

- whether a CFG is ambiguous;
- for CFGs $G_1$, $G_2$ and a regular expression $R$: whether $L(G_1)=L(G_2)$, whether $L(G_1)=L(R)$, whether $L(G_1)\subseteq L(G_2)$, and whether $L(R)\subseteq L(G_1)$.

## Countability (Sipser, Section 4.2)

Older papers prove some languages are not Turing-recognisable by **counting**.

**Definitions.** A set is **countable** if it is finite or has a one-to-one correspondence with $\mathbb N=\{1,2,3,\dots\}$, i.e. its elements can be listed $s_1,s_2,s_3,\dots$.

**The rationals are countable.** Arrange the positive rationals $p/q$ in an infinite grid, row $p$, column $q$. List them along the anti-diagonals $p+q=2,3,4,\dots$, skipping any fraction not in lowest terms (so each rational appears once): $1/1,\ 2/1,\ 1/2,\ 3/1,\ 1/3,\ 4/1,\ 3/2,\ 2/3,\ 1/4,\dots$. Every positive rational lies on one finite anti-diagonal, so it gets a position in the list. (Include 0 and negative rationals by interleaving.)

**$\Sigma^*$ is countable**: list strings by length, then lexicographically. **The set of TMs is countable**: each has a code in $\{0,1\}^*$.

**The set of infinite binary sequences is uncountable.** Suppose they could be listed $s_1,s_2,s_3,\dots$. Build $t$ whose $i$-th bit is the opposite of the $i$-th bit of $s_i$. Then $t$ differs from every $s_i$ (at position $i$), so it is not in the list. Contradiction.

**Some languages are not Turing-recognisable.** Each language $A\subseteq\Sigma^*$ corresponds to its characteristic sequence (bit $i$ is 1 iff $w_i\in A$), and every infinite binary sequence is such a characteristic sequence. So there are uncountably many languages. There are only countably many TMs, each recognising one language, so some languages are recognised by no TM.

## Examples for each class

| Class | Example |
|---|---|
| regular | $0^*1^*$; strings with an even number of 1's |
| context-free, not regular | $\{0^n1^n \mid n\ge0\}$; balanced parentheses |
| recursive, not context-free | $\{a^nb^nc^n \mid n\ge0\}$ |
| RE, not recursive | $L_u$ ($A_{TM}$); HALT |
| not RE | $L_d$; $\overline{L_u}$ |

## Short answers often asked

- **Can a TM run forever?** Yes: for example a TM that moves right forever on blanks. That is why RE languages need not be recursive.
- **Recognisable vs decidable:** a recogniser must accept every string in $L$ but may loop on strings outside it; a decider must halt on every input.
- **For $w$ to be recognised by $M$** (Sipser's three conditions on a computation): the computation starts in the start configuration on $w$, each configuration legally yields the next, and the last configuration is accepting.
- **Is a language with a single string $s$ decidable, when $s$ depends on an unknown fact** (for example, whether life will ever be found on Mars)? Yes. Either $s=0$ or $s=1$, and in either case a TM accepting exactly that one string exists. One of those two TMs is a decider; we just do not know which. Decidability asks whether a decider *exists*, not whether we can name it.
- **Is $\{\langle G\rangle \mid G \text{ is a connected undirected graph}\}$ decidable?** Yes: mark the first node, repeatedly mark any node adjacent to a marked one until nothing changes, then accept iff every node is marked. Each round marks a new node or stops, so it halts.
`

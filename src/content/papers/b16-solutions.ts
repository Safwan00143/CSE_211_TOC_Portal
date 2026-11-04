/* Worked solutions for the 16-batch (2017-2018) paper, keyed by part ("1a", "5", "13"). */
import { faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd, grammarTex } from "@/lib/cnf"
import { derivation, rootBody } from "@/lib/derivations"
import { b16exprAmb, b16exprFixed, b16g7, b16g7Cnf, b16g7Eps, b16g7Unit, b16g7Useless, b16gap, b16mult5, b16pda, b16pow2, b16re4b, b16three1, b16tmOr } from "../machines/b16"
import { gEqual } from "../machines/notes-cfg"
import { b17Solutions } from "./b17-solutions"
import { b20Solutions } from "./b20-solutions"
import { b21Solutions } from "./b21-solutions"
import { b22Solutions } from "./b22-solutions"
import { after, before } from "./compose"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const tmName = (q: string) => (q.includes(",") ? `[q_${q[1]},${q.split(",")[1]}]` : q === "qf" ? "q_f" : /^u\d$/.test(q) ? `u_${q[1]}` : `q_${q.slice(1)}`)
const pdaName = (q: string) => ({ qs: "q_s", qa: "q_a", qb: "q_b", qm: "q_m", qc: "q_c", qd: "q_d", qacc: "q_{acc}" })[q] ?? q

export const b16Solutions: Record<string, string> = {
  "1a": r`**Boolean Satisfiability (SAT).** Given a Boolean formula $\phi$ built from variables, $\land$, $\lor$ and $\lnot$, is there a truth assignment (each variable true or false) that makes $\phi$ true? As a language, $\text{SAT}=\{\langle\phi\rangle \mid \phi \text{ is satisfiable}\}$.

**Examples.**

- $\phi_1=(x\lor y)\land(\bar x\lor\bar y)$ is **satisfiable**: $x=1,y=0$ makes both clauses true.
- $\phi_2=x\land\bar x$ is **unsatisfiable**: no value of $x$ makes both true.
- $\phi_3=(x_1\lor\bar x_2\lor x_3)\land(\bar x_1\lor x_2)\land(\bar x_3)$ is satisfiable with $x_1=x_2=1$, $x_3=0$.

**Variants.** CNF-SAT restricts $\phi$ to an AND of clauses, each an OR of literals ($x$ or $\bar x$). **3-SAT** further requires exactly three literals per clause, e.g. $(x_1\lor\bar x_2\lor\bar x_3)\land(x_1\lor x_3\lor x_4)$.

SAT is in NP (guess an assignment, evaluate the formula in polynomial time) and is NP-complete by Cook's theorem; 3-SAT is also NP-complete.`,

  "1b": r`**3-COLOR:** given an undirected graph $G$, can its vertices be coloured with three colours so that every edge joins two different colours?

**Step 1: 3-COLOR ∈ NP.** The certificate is a colouring (one of three colours per vertex). The verifier checks every edge's endpoints differ: $O(|V|+|E|)$ time.

**Step 2: 3-SAT $\le_p$ 3-COLOR.** Given a 3-CNF formula $\phi$ with variables $x_1,\dots,x_n$ and clauses $C_1,\dots,C_m$, build $G$:

1. **Palette triangle** T, F, N (true, false, neutral), joined in a triangle. They must get three different colours; call those colours *true*, *false* and *neutral*.
2. **Variable gadgets.** For each $x_i$, two vertices $x_i$ and $\bar x_i$, joined to each other and both joined to N. So each is coloured true or false, and they differ: the colouring encodes a truth assignment.
3. **Clause gadgets.** An **OR gadget** with inputs $u,v$ has three new vertices $p,q,o$: edges $u\!-\!p$, $v\!-\!q$, $p\!-\!q$, $p\!-\!o$, $q\!-\!o$.
   - If $u$ and $v$ are both *false*, then $p$ and $q$ (adjacent to false vertices and to each other) must be *true* and *neutral* in some order, so $o$ is forced to be *false*.
   - If $u$ or $v$ is *true*, the gadget can be coloured with $o$ *true*.

   For a clause $(\ell_1\lor\ell_2\lor\ell_3)$, chain two gadgets: $o_a=\text{OR}(\ell_1,\ell_2)$, $o_b=\text{OR}(o_a,\ell_3)$ (6 new vertices). Join $o_b$ to F and N, which forces $o_b$ to be *true*.

**Step 3: correctness.**

- *If $\phi$ is satisfiable:* colour each $x_i$/$\bar x_i$ by the satisfying assignment. Every clause has a true literal, so its chained gadgets can be coloured with $o_b$ *true*, consistent with its edges to F and N.
- *If $G$ is 3-colourable:* read the assignment off the variable vertices. In each clause gadget $o_b$ is *true*; if all three literals were *false*, the OR gadgets would force $o_a$ and then $o_b$ to be *false*. So every clause has a true literal, and $\phi$ is satisfied.

**Step 4: polynomial time.** $G$ has $3+2n+6m$ vertices and $3+3n+12m$ edges, built in one pass over $\phi$.

Since 3-SAT is NP-complete and reduces to 3-COLOR, and 3-COLOR ∈ NP, **3-COLOR is NP-complete**.

(Checked by brute force: the clause gadget is 3-colourable exactly when at least one literal vertex is coloured true, for all 8 input colourings; and the graph built from an unsatisfiable formula is not 3-colourable.)`,

  "1c": r`Variables $x_1,\dots,x_4$; clauses $C_1=(x_1\lor\bar x_2\lor\bar x_3)$ and $C_2=(x_1\lor x_3\lor x_4)$. The graph has $3+2\cdot4+6\cdot2=23$ vertices:

- palette T, F, N (triangle);
- $x_i$, $\bar x_i$ for $i=1..4$, each pair joined, and all joined to N;
- for $C_1$: $p_{1a},q_{1a},o_{1a}$ with inputs $x_1,\bar x_2$; then $p_{1b},q_{1b},o_{1b}$ with inputs $o_{1a},\bar x_3$; $o_{1b}$ joined to F and N;
- for $C_2$: the same with inputs $x_1,x_3$ and then $o_{2a},x_4$.

${fig("b16-1c")}

The formula is satisfiable ($x_1=$ true satisfies both clauses), so the graph is 3-colourable; the figure shows a valid colouring found by a computer search with $x_1$ true and $x_2,x_3,x_4$ false.`,

  "2a": r`**Method: swap the accepting and non-accepting states.** Given $D=(Q,\Sigma,\delta,q_0,F)$, take $\overline{D}=(Q,\Sigma,\delta,q_0,Q-F)$.

**Why it works.** A DFA has exactly one run on each input $w$, ending in exactly one state $\hat\delta(q_0,w)$. In $\overline D$ the run is the same, and $w$ is accepted iff $\hat\delta(q_0,w)\in Q-F$, i.e. iff $D$ rejects $w$. So $L(\overline D)=\Sigma^*-L$.

**When it does not work: an incomplete DFA.** If $D$ has missing transitions (a "partial" DFA, often drawn without its dead state), some inputs have **no** run at all and are rejected. After swapping they are still rejected, although they belong to $\Sigma^*-L$. Fix: first add an explicit dead (trap) state for every missing move, then swap. (Swapping must also be done over the right alphabet: the complement is relative to $\Sigma^*$.)

${after(b21Solutions["3b"], "**Why it fails for an NFA.**")}`,

  "2b": r`### (i) Begins with 1, multiple of 5

Keep the value modulo 5. Appending bit $b$ to a number $v$ gives $2v+b$, so $r_i\to r_{(2i+b)\bmod5}$. A separate start $s$ forces the first symbol to be 1 (a leading 0 goes to the dead state $d$).

${fig("b16-2b-i")}

${faTableMd(b16mult5, { label: sub })}

1010 ($=10$): accepted
${faRunTex(b16mult5, "1010", { name: sub })}
111 ($=7$): rejected
${faRunTex(b16mult5, "111", { name: sub })}

### (ii) Begins with 1, a power of 2

In binary, the powers of 2 are exactly 1, 10, 100, …, i.e. $10^*$ (including $2^0=1$).

${fig("b16-2b-ii")}

${faRunTex(b16pow2, "1000")}
${faRunTex(b16pow2, "1010")}

(Both DFAs were checked on every binary string up to length 11.)`,

  "2c": r`Build from the pieces (Sipser's closure constructions):

1. NFAs for $a$ ($q_1\xrightarrow{a}q_2$) and $b$ ($q_3\xrightarrow{b}q_4$).
2. **Union** $a\cup b$: a new start $q_5$ with ε-moves to $q_1$ and $q_3$.
3. **Star** $(a\cup b)^*$: a new accepting start $q_6$ with $q_6\xrightarrow{\varepsilon}q_5$, and ε-moves from $q_2$, $q_4$ back to $q_5$.
4. NFAs for $a$, $b$, $a$ again: $q_7\xrightarrow{a}q_8$, $q_9\xrightarrow{b}q_{10}$, $q_{11}\xrightarrow{a}q_{12}$.
5. **Concatenate** them all: ε-moves from the accepting states of $(a\cup b)^*$ ($q_6,q_2,q_4$) to $q_7$, then $q_8\to q_9$, $q_{10}\to q_{11}$. Only $q_{12}$ accepts.

${fig("b16-2c")}

The NFA accepts exactly the strings ending in aba (checked on every string up to length 9).`,

  "3a": r`**Reading of the question.** We need two 0s with a **nonzero multiple of 4** characters strictly between them: $\Sigma^*\,0\,\big((0+1)^4\big)^+\,0\,\Sigma^*$. This fits 101111010 (four 1s between the 0s at positions 2 and 7), 01000010111011 (1000 between positions 1 and 6), and rejects 00 and 10101010 (all gaps are odd). The example 00000 does not fit: its farthest 0s have only 3 characters between them, so it is **rejected** under the stated definition.

**Idea.** Guess the first 0 of the pair, count the characters after it modulo 4 (at least four of them), and guess the second 0.

${fig("b16-3a")}

**Transition table:**

${faTableMd(b16gap, { sets: true, label: sub })}

**Trace** on 101111010 (sets of states):
${faRunTex(b16gap, "101111010", { name: sub, perLine: 5 })}

(Checked against the definition on every binary string up to length 11, and on the examples.)`,

  "3b": r`All three opinions are flawed.

**(i) $L_1=\{ww\}$.** ${after(b17Solutions["1b"], "- The pumping lemma is a").split("**(ii)")[0].replace(/^- /, "")}
**(ii) $L_2=\{n_0(w)=2n_1(w)\}$.**

- $y=01$ is **not a legal choice**: $|xy|\le p$ forces $y$ into the first $p$ symbols of $0^{2p}1^p$, which are all 0s. And the prover never chooses $y$; the adversary does.
- With any legal split, $y=0^k$ ($1\le k\le p$), and $xy^2z=0^{2p+k}1^p$ has $n_0=2p+k\ne2p=2n_1$. Every split fails, so **$L_2$ is not regular**. The string was well chosen; only the split was wrong.

**(iii) $L_3=\{0^n1^n0^n\}$.**

- The string $0^k1^k0^k$ with $k=\lfloor p/3\rfloor$ has length $3k\le p$, which may be **less than $p$**. The lemma only applies to strings of length at least $p$, so it may say nothing about this string. (And if $|w|\le p$, then $|xy|\le p$ no longer confines $y$ to the first block.)
- "$\forall i\ge0$, $xy^iz\notin L_3$" is also false: for $i=1$, $xy^1z=w\in L_3$. A proof needs only **one** $i$ that leaves the language, for **every** split.

The conclusion is right, but the proof must be: take $w=0^p1^p0^p$; $|xy|\le p$ forces $y=0^k$ in the first block; $xz=0^{p-k}1^p0^p\notin L_3$. (Brute-force checked for $p=1..4$.)`,

  "4a": b17Solutions["1c"],

  "4b": r`**i. Contains a, b and c.** Some a, some b and some c appear, in one of six orders. With $\Sigma=(a+b+c)$:
$$
\Sigma^*a\Sigma^*b\Sigma^*c\Sigma^* + \Sigma^*a\Sigma^*c\Sigma^*b\Sigma^* + \Sigma^*b\Sigma^*a\Sigma^*c\Sigma^* + \Sigma^*b\Sigma^*c\Sigma^*a\Sigma^* + \Sigma^*c\Sigma^*a\Sigma^*b\Sigma^* + \Sigma^*c\Sigma^*b\Sigma^*a\Sigma^*
$$
(the six orders of the first occurrences).

**ii. $a^nb^m$, $n\ge3$, $m$ odd:** $\ ${b16re4b.ii.replace(/\*/g, "^*")}$. Three a's then more; one b then pairs.

**iii. $a^nb^m$, $n+m$ odd:** $n$ odd and $m$ even, or $n$ even and $m$ odd:
$$
a(aa)^*(bb)^* + (aa)^*b(bb)^*.
$$

**iv. $vwv$, $|v|=2$:** the string starts and ends with the same two symbols, with anything (possibly nothing) between:
$$
aa(a+b)^*aa + ab(a+b)^*ab + ba(a+b)^*ba + bb(a+b)^*bb.
$$
(Length at least 4: the two copies of $v$ do not overlap.)

**v. Number of a's divisible by 3:** $\ b^*(ab^*ab^*ab^*)^*$.

(All five were checked against their definitions on every string up to length 6–10.)`,

  "5": r`### (a) Equal numbers of 0s and 1s

$$
S\to0S1S\mid1S0S\mid\varepsilon
$$

Every rule adds one 0 and one 1, so every generated string is balanced. Conversely a nonempty balanced string starting with 0 can be cut as $0u1v$ at the first point where the counts become equal, with $u$, $v$ balanced (symmetric for 1).

${derivation(gEqual, "0110", "lm")}

### (b) At least three 1s

$$
\begin{aligned}
S &\to A1A1A1A\\
A &\to 0A\mid1A\mid\varepsilon
\end{aligned}
$$

$A$ generates any string; $S$ places three 1s with arbitrary strings around them. Any string with at least three 1s splits around its first three 1s.

${derivation(b16three1, "10101", "lm")}

(Checked on all strings up to length 9.)`,

  "6": r`### (a) The grammar is ambiguous

The string $a+a\times a$ has two parse trees (written with $*$ for $\times$ below):

${fig("cfg-amb-expr")}

Leftmost derivation with $+$ at the root:
${derivation(b16exprAmb, "a+a*a", "lm", (t) => rootBody(t) === "E+E")}
Leftmost derivation with $\times$ at the root:
${derivation(b16exprAmb, "a+a*a", "lm", (t) => rootBody(t) === "E*E")}

The two trees mean $a+(a\times a)$ and $(a+a)\times a$: the grammar fixes neither the **precedence** of the operators nor their **associativity** ($a+a+a$ is also ambiguous).

### (b) An unambiguous grammar

Introduce one variable per precedence level:
${grammarTex(b16exprFixed)}

- $E$ (expression) is a sum of terms; $T$ (term) is a product of factors; $F$ (factor) is $a$ or a parenthesised expression.
- **Precedence:** a $\times$ can only combine factors inside a term, so $\times$ binds tighter than $+$.
- **Associativity:** $E\to E+T$ is left-recursive, so $a+a+a$ groups as $(a+a)+a$; similarly for $\times$.

Now $a+a\times a$ has one tree, with $+$ at the root:
${derivation(b16exprFixed, "a+a*a", "lm")}

The new grammar generates the same language (checked on all strings up to length 7) and every one of those strings has exactly one parse tree.`,

  "7": r`**The grammar as printed.** $B$ has no productions and $D$ is never reached from $S$. So $B$ and $D$ are **useless**, $S\to B$ contributes nothing, and $L(G)$ is the set of binary strings containing at least one 1 (from $S\to A1A$). (If $B\to00$ was intended, $L(G)$ would additionally contain 00, and the CNF below would gain $S\to ZZ$.)

### (a) Conversion to CNF

${grammarTex(b16g7)}

**Step 1: ε-productions.** Nullable: ${b16g7Eps.nullable.join(", ")}. Expand every body by dropping nullable occurrences (never leaving an empty body); $S$ is not nullable, so no $S\to\varepsilon$:

${grammarTex(b16g7Eps.grammar)}

**Step 2: unit productions.** The only unit production is $S\to B$, and $B$ has no bodies to copy, so it is simply dropped:

${grammarTex(b16g7Unit.grammar)}

**Step 3: useless symbols.** $B$ is non-generating (no rules) and $D$ is unreachable; remove both.

${grammarTex(b16g7Useless.grammar)}

**Step 4: terminals and long bodies.** $Z\to0$, $O\to1$; $S\to AOA$ becomes $S\to AC_1$, $C_1\to OA$:

${grammarTex(b16g7Cnf.grammar)}

### (b) CYK on 01101

${cykWorkingMd(b16g7Cnf.grammar, "01101")}

${cykTableMd(b16g7Cnf.grammar, "01101")}

${fig("b16-7")}

$S\in X_{15}$, so **01101 is in the language** (it contains a 1, as expected). (Each intermediate grammar was checked against the original on all strings up to length 8.)`,

  "8": r`**Design.** Two independent matchings, one after the other, with the bottom marker Z separating the phases.

1. Push Z. For each a push A; the first b must pop an A, so $n\ge1$.
2. Pop one A per b. When Z is exposed again (all a's matched), move to $q_m$.
3. The first c pushes C (so $m\ge1$); push C per further c; pop one C per d.
4. Accept when Z is exposed after the d's.

${fig("b16-8")}

**Accepting trace on aabbcd:**
${pdaTraceTex(pdaAcceptingTrace(b16pda, "aabbcd")!, pdaName)}

**Rejected:** aabcd (after one b an A remains, so $q_m$ cannot be reached); abcdd (the second d finds Z, not C).

(Checked against the definition on every string over $\{a,b,c,d\}$ up to length 10.)`,

  "9": r`**Idea: one round per bit**, as in the AND/XOR machines: check off the next bit $a$ of $N_1$ and carry it in the state; check off the bit $b$ in the same position of $N_2$ and carry $a\lor b$; append it after the second #; walk back. A checked bit $x$ is written $*x$ (a second track).

| State | Meaning |
|---|---|
| $q_0$ | at the next unchecked bit of $N_1$ |
| $[q_1,a]$ | carrying bit $a$ of $N_1$ to $N_2$ |
| $[q_2,a]$ | in $N_2$, looking for its next unchecked bit |
| $[q_3,r]$, $[q_4,r]$ | carrying the result $r=a\lor b$ to the end |
| $q_5,q_6,q_7$ | walking back to $N_1$ |
| $u_1,u_2$ | removing check marks |
| $q_f$ | halt |

${tmTableMd(b16tmOr, tmName)}

**Trace on $10\#00\#$** (OR $=10$):
${tmTraceTex(b16tmOr, "10#00#", { stateTex: tmName })}

(Checked on every valid input up to length 10.)`,

  "10": r`${before(b20Solutions["10"], "**(ii)")}**(ii) Not known to be true; believed false.** The known simulation of a nondeterministic TM explores its IDs breadth-first: with at most $m$ choices per move there can be $1+m+\cdots+m^n\le(n+1)m^n$ IDs after $n$ moves, which is exponential. A polynomial simulation for every NTM would put NP inside P, i.e. prove P = NP, which is open and widely believed false.

${after(b21Solutions["11"], "**(i)").replace("**(i) True.**", "**(iii) True.**").split("**(ii) Not known")[0]}`,

  "11": r`${before(after(b20Solutions["11"], "**(i)"), "**The halting problem is not recursive.**")}**(iii) The halting problem.** $\text{HALT}=\{(M,w) \mid M \text{ halts on input } w\}$: does a given TM stop (accepting or rejecting) on a given input? It is RE (simulate $M$ on $w$ and accept if it halts) but not recursive.

### $L_d$ is not RE

${after(b21Solutions["12"], "**Theorem.**")}`,

  "12": r`**SUBGRAPH-ISOMORPHISM** $=\{\langle G_1,G_2\rangle \mid G_1$ has a subgraph isomorphic to $G_2\}$.

**Step 1: it is in NP.** The certificate is a one-to-one map $f$ from the vertices of $G_2$ to vertices of $G_1$ (at most $|V_2|\cdot\log|V_1|$ bits). The verifier checks that $f$ is one-to-one and that **every edge** $\{u,v\}$ of $G_2$ has $\{f(u),f(v)\}$ an edge of $G_1$, in $O(|V_2|+|E_2|)$ lookups. (For an *induced* copy, as the question's wording "together with the edges among them" suggests, also check that non-edges map to non-edges: $O(|V_2|^2)$ lookups. Both versions are in NP.)

**Step 2: CLIQUE $\le_p$ SUBGRAPH-ISOMORPHISM.** CLIQUE $=\{\langle G,k\rangle \mid G$ has a complete subgraph on $k$ vertices$\}$ is NP-complete (by reduction from 3-SAT). Given $\langle G,k\rangle$, output
$$
f(\langle G,k\rangle)=\langle G_1,G_2\rangle=\langle G,\ K_k\rangle,
$$
where $K_k$ is the complete graph on $k$ vertices.

- **Correctness.** $G$ has a $k$-clique $\iff$ $G$ contains a copy of $K_k$. A copy of $K_k$ is exactly a set of $k$ vertices that are pairwise adjacent. (Since $K_k$ has every possible edge, the induced and non-induced versions coincide here.)
- **Polynomial time.** Copy $G$ and write down $K_k$, which has $k\le|V|$ vertices and $\binom k2=O(|V|^2)$ edges. (If $k>|V|$, output a fixed "no" instance.)

Since SUBGRAPH-ISOMORPHISM is in NP and the NP-complete problem CLIQUE reduces to it in polynomial time, **SUBGRAPH-ISOMORPHISM is NP-complete**.`,

  "13": r`### (a) Definitions

- **P**: the languages decided by a deterministic TM in polynomial time, i.e. $\bigcup_k\text{TIME}(n^k)$.
- **NP**: the languages decided by a nondeterministic TM in polynomial time (every branch halts within $p(n)$ moves, and $w$ is accepted iff some branch accepts). Equivalently, the languages with polynomial-time verifiers for polynomial-size certificates.
- **PSPACE**: the languages decided by a deterministic TM using polynomial space: at most $p(n)$ tape cells on inputs of length $n$.
- **NPSPACE**: the languages decided by a nondeterministic TM using polynomial space on every branch.

### (b) Relationships

**(i) P ⊆ NP, believed proper.** ${after(b20Solutions["13"], "- P ⊆ NP:").split("**ii)")[0].trim()}

**(ii) PSPACE = NPSPACE (proved).**

${b22Solutions["12ii"]}

**(iii) NP ⊆ PSPACE, believed proper.** A polynomial-time NTM uses polynomial space on each branch; a deterministic machine can try the branches one at a time (as a depth-first search, recording only the current sequence of choices), reusing the same polynomial space. So NP ⊆ PSPACE. It is believed the inclusion is proper: PSPACE-complete problems such as QBF (quantified Boolean formulas) seem much harder than NP problems, but no proof is known.`,
}

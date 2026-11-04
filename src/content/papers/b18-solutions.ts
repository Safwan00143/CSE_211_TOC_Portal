/* Worked solutions for the 18-batch (2019-2020) paper, keyed by part ("1a", "5", "10b"). */
import { faRunTex, faTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import { b18anbn3, b18base3, b18fooling, b18sum5 } from "../machines/b18"
import { b22g6 } from "../machines/b22"
import { gBalanced, gEqual } from "../machines/notes-cfg"
import { tmAnd } from "../machines/notes-tm2"
import { b20Solutions } from "./b20-solutions"
import { b22Solutions } from "./b22-solutions"
import { after } from "./compose"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const tmName = (q: string) => (q.includes(",") ? `[q_${q[1]},${q.split(",")[1]}]` : q === "qf" ? "q_f" : /^u\d$/.test(q) ? `u_${q[1]}` : `q_${q.slice(1)}`)

export const b18Solutions: Record<string, string> = {
  "1a": r`**Not acceptable as it stands.** The pumping lemma only applies to strings **in** $L$ of length at least $p$. The pumping length $p$ is a number the lemma gives us; we do not get to choose it, and it need not be prime. If $p$ is composite (say $p=4$), then $w=a^p\notin L$, and the lemma says nothing about $w$.

**The fix.** Start with "Given $p$, let $w=a^q$, where $q$ is a prime with $q\ge p+2$" (such a prime exists because there are infinitely many primes). Then $w\in L$ and $|w|\ge p$, and the proof can continue:

- any split has $y=a^k$ with $1\le k\le p$;
- pump with $i=q+1$: $|xy^{q+1}z|=q+qk=q(1+k)$;
- $q\ge2$ and $1+k\ge2$, so $q(1+k)$ is not prime, and $xy^{q+1}z\notin L$.

So $L$ is not regular. (The phrase "$w=a^p\ldots$" is fine only if it continues "where $p$ is replaced by a prime at least $p$".) This argument is brute-force checked for small $p$ in the pumping-lemma note.`,

  "1b": r`**Scenario: secure online banking (public-key cryptography).** When you log in to a bank website, your browser and the bank agree on a secret key over the open internet, and the bank proves its identity with a digital signature.

- **What must be easy:** for the legitimate parties, encrypting, decrypting with the key, signing and verifying all run in polynomial time.
- **What must be hard:** for an eavesdropper, recovering the secret key or forging a signature. For RSA this is (as far as is known) as hard as **factoring** a 2048-bit number $N=pq$; for Diffie–Hellman it is the **discrete logarithm** problem. The best known algorithms take super-polynomial time, so an attacker would need far longer than the age of the universe.

Here an **easy** problem would be a disaster: a fast factoring algorithm would let anyone read everyone's banking traffic. The whole system relies on the *hardness* of a problem.

**The Theory of Computation connection.** Security is stated in complexity-theoretic terms: no polynomial-time algorithm can break the scheme except with negligible probability. These problems are in NP (a proposed key or factor is easy to check), so if **P = NP** they would be easy and public-key cryptography would collapse. Other scenarios that need hardness in the same way: password hashing (inverting a one-way function), CAPTCHAs (problems hard for computers), and proof-of-work in blockchains.`,

  "1c": r`**Idea.** Keep the sum modulo 5. State $r_i$ means "sum $\equiv i \pmod 5$". A digit $d$ moves $r_i$ to $r_{(i+d)\bmod5}$; R moves every state to $r_0$. Accept in $r_1$ and $r_2$.

${fig("b18-1c")}

${faTableMd(b18sum5, { label: sub })}

**Traces.** 22R1 (sum 4, reset, then 1): accepted
${faRunTex(b18sum5, "22R1", { name: sub })}
2222 (sum 8 ≡ 3): rejected
${faRunTex(b18sum5, "2222", { name: sub })}

(Checked against the definition on every string over $\{0,1,2,R\}$ up to length 6.)`,

  "2a": r`A state is the automaton's **memory**. A finite automaton cannot look back at the input it has already read; everything it needs to remember about that input must be summarised by which state it is in.

- Each state stands for a **class of prefixes** that the machine treats the same way: two inputs that lead to the same state are indistinguishable for every possible continuation.
- With finitely many states, the machine can remember only a **bounded** amount of information (for example a count modulo 3, or the last two symbols), which is exactly why finite automata cannot count without bound (e.g. $0^n1^n$).
- **Designing a DFA = deciding what to remember.** Writing down, for each state, what it "means" (e.g. "$q_1$: the number read so far is $\equiv1 \pmod 3$") is the standard way to design and check a DFA.
- The start state is the situation before any input; accepting states are the situations in which the input read so far should be accepted.`,

  "2b": r`**(i) $\emptyset^*\cup a^*\cup b^*\cup(a\cup b)^* \;=\; (a\cup b)^*$.**

- $\emptyset^*=\{\varepsilon\}$ (the star of the empty set contains only the empty string).
- $\{\varepsilon\}$, $a^*$ and $b^*$ are all subsets of $(a\cup b)^*$, which contains every string over $\{a,b\}$.
- A union with subsets of $(a\cup b)^*$ adds nothing.

**(ii) $((a^*b^*)^*(b^*a^*)^*)^* \;=\; (a\cup b)^*$.**

- $a^*b^*$ contains $a$ and $b$ (take one block empty), so $(a^*b^*)^*\supseteq(a\cup b)^*$; and everything is over $\{a,b\}$, so $(a^*b^*)^*=(a\cup b)^*$.
- Then the inside is $(a\cup b)^*(b^*a^*)^*\supseteq(a\cup b)^*$, and starring $(a\cup b)^*$ again changes nothing.

**(iii) $(a^*b)^*\cup(b^*a)^* \;=\; (a\cup b)^*$.**

- $(a^*b)^*$: $\varepsilon$, together with **every string that ends in b**. (Cut a string ending in b just after each b: every piece is $a^*b$.)
- $(b^*a)^*$: $\varepsilon$, together with every string that ends in a, by the same argument.
- Every nonempty string ends in a or b, so the union is every string.

(Each simplification was checked by comparing the original expression with $(a\cup b)^*$ on every string up to length 8.)`,

  "2c": r`**Idea.** Keep the value read so far modulo 4. Reading a base-3 number left to right, appending digit $d$ to a number of value $v$ gives $3v+d$. So if $v\equiv i\pmod4$, the new value is $\equiv(3i+d)\bmod4$.

| From | $d=0$ | $d=1$ | $d=2$ |
|---|---|---|---|
| $r_0$ | $r_0$ | $r_1$ | $r_2$ |
| $r_1$ | $r_3$ | $r_0$ | $r_1$ |
| $r_2$ | $r_2$ | $r_3$ | $r_0$ |
| $r_3$ | $r_1$ | $r_2$ | $r_3$ |

A separate start state $s$ (nothing read) is not accepting, because the empty string is not a number; its moves are those of $r_0$ (value 0). Accept in $r_1$, $r_2$, $r_3$ (remainder nonzero).

${fig("b18-2c")}

**Traces.** 102 ($=11$, $11\bmod4=3$): accepted
${faRunTex(b18base3, "102", { name: sub })}
11 ($=4$): rejected
${faRunTex(b18base3, "11", { name: sub })}

(Checked against the definition on every base-3 string up to length 8. Leading zeros are allowed; they do not change the value.)`,

  "3a": r`Build bottom-up (Sipser's basic principles).

1. **$a$:** $q_1\xrightarrow{a}q_2$.
2. **$a^*$:** new accepting start $q_3$ with $q_3\xrightarrow{\varepsilon}q_1$, and $q_2\xrightarrow{\varepsilon}q_1$ to repeat. Accepting: $q_3,q_2$.
3. **$a$ again:** $q_4\xrightarrow{a}q_5$.
4. **$(a^*)a$:** ε-moves from the accepting states of $a^*$ ($q_3$, $q_2$) to $q_4$. Accepting: $q_5$.
5. **$((a^*)a)^*$:** new accepting start $q_6$ with $q_6\xrightarrow{\varepsilon}q_3$, and $q_5\xrightarrow{\varepsilon}q_3$. Accepting: $q_6$, $q_5$.

${fig("b18-3a")}

**Remark.** $(a^*)a=a^+$, and $(a^+)^*=a^*$, so the NFA accepts exactly $a^*$: every string of a's, including $\varepsilon$ (checked by machine). The question asks for the construction, which is why the NFA is larger than the 1-state NFA for $a^*$.`,

  "3b": r`$L=\{a^nb^n \mid n\le3\}=\{\varepsilon,\ ab,\ aabb,\ aaabbb\}$ (taking $n\ge0$).

**Idea.** Count the a's ($p_0,\dots,p_3$). On the first b, switch to counting down the b's still needed. "Still need $k$ b's" is the same situation whether we got there from $aab$ or $aaabb$, so the b-states are **shared**: $r_2$ (need 2), $r_1$ (need 1), and $f$ (done).

${fig("b18-3b")}

| State | Meaning |
|---|---|
| $p_0$ | nothing read (accepting: $\varepsilon\in L$) |
| $p_1,p_2,p_3$ | read 1, 2, 3 a's |
| $r_2,r_1$ | need exactly 2, 1 more b's |
| $f$ | a complete $a^nb^n$ (accepting) |

**Traces.** aabb (accepted):
${faRunTex(b18anbn3, "aabb", { name: sub })}
aab (rejected, one b missing):
${faRunTex(b18anbn3, "aab", { name: sub })}

**Why 7 states is the minimum.** Use a *fooling set*: pairs $(x_i,y_i)$ with every $x_iy_i\in L$, but for $i\ne j$ at least one of $x_iy_j$, $x_jy_i$ is not in $L$. In any NFA, the state reached after $x_i$ on an accepting path for $x_iy_i$ must differ for different $i$ (otherwise we could swap the tails and accept both cross strings). This set of 7 pairs works:
$$
${b18fooling.map(([x, y]) => `(${x || "\\varepsilon"},\\ ${y || "\\varepsilon"})`).join(",\\ ")}.
$$
For example, $(a,abb)$ and $(aab,b)$: $a\cdot b=ab\in L$ but $aab\cdot abb\notin L$. So **every NFA for $L$ needs at least 7 states**, and the NFA above is minimal.

(The NFA was checked against $L$ on every string up to length 9; a computer search confirmed that 7 is the size of the largest fooling set.)`,

  "3c": r`Let $Q=\{q_0\}\cup Q_1\cup Q_2$ (with $Q_1,Q_2$ disjoint and $q_0$ new), $F=F_1\cup F_2$. For $q\in Q$ and $a\in\Sigma_\varepsilon$:
$$
\delta(q,a)=
\begin{cases}
\delta_1(q,a) & q\in Q_1\\
\delta_2(q,a) & q\in Q_2\\
\{q_1,q_2\} & q=q_0 \text{ and } a=\varepsilon\\
\emptyset & q=q_0 \text{ and } a\ne\varepsilon
\end{cases}
$$

**Line 1, $q\in Q_1$: copy $N_1$.** Once $N$ is inside $N_1$'s states it must behave exactly as $N_1$, so that a branch in $Q_1$ accepts iff $N_1$ accepts.

**Line 2, $q\in Q_2$: copy $N_2$.** The same for $N_2$. Because $Q_1\cap Q_2=\emptyset$, the two cases never conflict, and a branch can never cross from one machine to the other.

**Line 3, $q_0$ on ε: start both machines.** $N$ must accept if *either* machine accepts, and it cannot know which in advance, so it nondeterministically starts both, **without reading input**, so each machine still sees the whole input.

**Line 4, $q_0$ on a symbol: no moves.** If $q_0$ consumed a symbol, that symbol would be lost to both $N_1$ and $N_2$. Also, $q_0$ is never re-entered (no transition leads into it).

**Accepting states $F=F_1\cup F_2$**: a branch ends in $F_1$ exactly when $N_1$ accepts, and in $F_2$ exactly when $N_2$ accepts. So $N$ accepts $w$ iff $w\in L_1\cup L_2$.`,

  "4a": r`**Maximum: $2^5=32$ states.** Each DFA state of the subset construction is a **set** of NFA states, and a 5-state NFA has $2^5=32$ subsets (including $\emptyset$). So the DFA can never need more than 32 states.

The bound can actually be reached. For example, take NFA states $0,\dots,4$ (start and accept $0$) over $\{a,b,c\}$: $a$ moves every state $i$ to $i+1 \bmod 5$ (rotate); $b$ keeps every state and also adds 1 when 0 is present; $c$ keeps every state except 0. Rotating, adding and removing can build any subset, and a computer check confirms that all **32** subsets are reachable.

**Minimum: 1 state.** If only reachable subsets are built, the DFA can be tiny: for example, if the 5-state NFA accepts every string and its start state's ε-closure contains all states with every state looping to all states, the only reachable subset is $Q$ itself, giving a 1-state DFA. (A DFA always has at least one state, its start state.)

So the DFA has between **1** and **32** states. In practice the subset construction is usually built lazily, from the start state, keeping only reachable subsets, which is typically far fewer than $2^n$.`,

  "4b": r`**(i) Number of a's divisible by 3:** $b^*(ab^*ab^*ab^*)^*$.

The leading $b^*$ covers b's before the first a; each block $ab^*ab^*ab^*$ contains exactly three a's together with the b's after them. Zero blocks gives strings with no a's.

**(ii) At most three a's:** $b^*(a+\varepsilon)b^*(a+\varepsilon)b^*(a+\varepsilon)b^*$.

Three optional a's, with any b's around them.

**(iii) Exactly one occurrence of aaa** (occurrences may overlap, so aaaa contains two):
$$
(b+ab+aab)^*\ aaa\ (b+ba+baa)^*.
$$

- Exactly one occurrence means there is one run of exactly three a's, and every other run of a's has length at most 2.
- Before the aaa: a string with no aaa that is empty or ends in b, which is exactly $(b+ab+aab)^*$.
- After the aaa: a string with no aaa that is empty or starts with b, which is exactly $(b+ba+baa)^*$. The b next to the aaa is what stops the run from being longer.

(All three were checked against their definitions on every string up to length 10 or 11.)`,

  "4c": r`$L=\{a^{2n}b^{3n}a^n \mid n\ge0\}$.

1. Assume $L$ is regular, with pumping length $p$.
2. Choose $w=a^{2p}b^{3p}a^p\in L$, with $|w|=6p\ge p$.
3. Let $w=xyz$ with $|xy|\le p$ and $|y|>0$. The first $2p\ge p$ symbols are all a's, so $y=a^k$ with $1\le k\le p$, lying inside the first block.
4. Pump down ($i=0$): $xz=a^{2p-k}b^{3p}a^p$.
5. For this to be in $L$ with $n=p$ (the number of a's at the end), the first block must have $2p$ a's, but it has $2p-k<2p$. So $xz\notin L$.
6. This contradicts the pumping lemma, so $L$ is not regular.

(Brute force over every legal split for $p=1,\dots,4$ confirms that pumping down always leaves $L$.)`,

  "5": r`### (i) Balanced parentheses

$$
S\to SS\mid(S)\mid\varepsilon
$$

$(S)$ wraps a balanced string in a matching pair; $SS$ places two balanced strings side by side; $\varepsilon$ is balanced. Every balanced nonempty string is $(u)v$ with $u,v$ balanced (match the first "(" with its partner), so the rules generate them all.

Leftmost derivation of (()()):
${derivation(gBalanced, "(()())", "lm")}

### (ii) Equal numbers of 0s and 1s

$$
S\to0S1S\mid1S0S\mid\varepsilon
$$

**Why it works.** Every rule adds one 0 and one 1, so every generated string is balanced. Conversely, take a nonempty balanced string $w$ and suppose it starts with 0. Track "number of 0s minus number of 1s" from left to right: it starts at 1 and ends at 0, so there is a first point where it returns to 0, which happens just after a 1. So $w=0\,u\,1\,v$, where $u$ and $v$ are both balanced, and $S\to0S1S$ applies with $u$ and $v$ generated recursively. Strings starting with 1 are symmetric.

Leftmost derivation of 0110:
${derivation(gEqual, "0110", "lm")}

(Both grammars are checked against their definitions in the CFG note.)`,

  "6": b20Solutions["6"],

  "7": r`$w=01100$, $n=5$. $X_{ij}$ is the set of variables deriving symbols $i$ through $j$.

**Cell-by-cell working:**

${cykWorkingMd(b22g6, "01100")}

**The table:**

${cykTableMd(b22g6, "01100")}

${fig("b18-7")}

**Conclusion.** $S\in X_{15}$, so **$01100\in L(G)$**.

**The language.** $A$ generates every nonempty binary string ($A\to ZA\mid YA$ prepends a bit; $A\to0\mid1$ ends). $B\to ZA$ gives "0 then a nonempty string", $C\to YA$ gives "1 then a nonempty string". So:

- $S\to BZ$: $0x0$ with $x$ nonempty; $S\to ZZ$: 00;
- $S\to CY$: $1x1$ with $x$ nonempty; $S\to YY$: 11.

**$L(G)$ is the set of binary strings of length at least 2 whose first and last symbols are the same.** 01100 starts and ends with 0, in agreement with the table. (Checked by machine on all strings up to length 10.)`,

  "8": b20Solutions["7"],

  "9": r`**Idea: one round per bit.** Check off the leftmost unchecked bit $a$ of $w_1$ and carry it in the state; in $w_2$, check off the bit $b$ in the same position and carry $a\wedge b$ instead; append it after the second $c$; go back for the next bit. A checked bit $x$ is written $*x$ (a second track).

| State | Meaning |
|---|---|
| $q_0$ | at the next unchecked bit of $w_1$ |
| $[q_1,a]$ | carrying bit $a$ of $w_1$ to $w_2$ |
| $[q_2,a]$ | in $w_2$, looking for its next unchecked bit |
| $[q_3,r]$, $[q_4,r]$ | carrying the result bit $r=a\wedge b$ to the end |
| $q_5,q_6,q_7$ | walking back to $w_1$ |
| $u_1,u_2$ | removing check marks |
| $q_f$ | halt |

When $q_0$ meets the first $c$, every bit has been processed: the machine removes the check marks (right through $w_2$, then left through $w_1$) and halts. The tape ends as $w_1cw_2c(w_1\wedge w_2)$.

**Transition table** (a "–" means no move):

${tmTableMd(tmAnd, tmName)}

**Trace on $10c11c$** (AND $=10$):
${tmTraceTex(tmAnd, "10c11c", { stateTex: tmName })}

The finite control stores one bit at a time (storage in the state), and the check marks form a second track. (The machine is checked on every valid input up to length 10.)`,

  "10a": r`Let $L(P)$ be the language $P$ accepts by final state and $N(P)$ the language it accepts by empty stack. We show each kind of PDA can be converted into the other.

**Empty stack $\Rightarrow$ final state.** Given $P_N$ with start state $q_0$ and start symbol $Z_0$, build $P_F$:

1. A new start state $p_0$ and new bottom marker $X_0$: $\delta_F(p_0,\varepsilon,X_0)=\{(q_0,Z_0X_0)\}$.
2. All moves of $P_N$.
3. A new accepting state $p_f$, with $\delta_F(q,\varepsilon,X_0)=\{(p_f,\varepsilon)\}$ for **every** state $q$ of $P_N$.

$X_0$ appears on top exactly when $P_N$ would have emptied its stack, so $P_F$ can then enter $p_f$. Hence $L(P_F)=N(P_N)$.

${fig("hmu-empty-to-final")}

**Final state $\Rightarrow$ empty stack.** Given $P_F$ with accepting states $F$, build $P_N$:

1. A new start state $p_0$ and bottom marker $X_0$: $\delta_N(p_0,\varepsilon,X_0)=\{(q_0,Z_0X_0)\}$. $X_0$ prevents $P_F$ from emptying its stack "by accident" in a non-accepting state.
2. All moves of $P_F$.
3. From each accepting state $q\in F$, for every stack symbol $Y$ (including $X_0$): $\delta_N(q,\varepsilon,Y)\ni(p,\varepsilon)$, a move to a new draining state $p$.
4. In $p$, pop everything: $\delta_N(p,\varepsilon,Y)=\{(p,\varepsilon)\}$ for every $Y$.

$P_N$ empties its stack exactly when $P_F$ has reached an accepting state (after reading all the input). Hence $N(P_N)=L(P_F)$.

${fig("hmu-final-to-empty")}

So a language is accepted by final state by some PDA **iff** it is accepted by empty stack by some PDA: both describe exactly the context-free languages.`,

  "10b": after(b22Solutions["10"], "**Simulation"),

  "11": r`**(a) Regular:** $L_a=\{w\in\{0,1\}^* \mid w \text{ ends in } 1\}=(0+1)^*1$. A 2-state DFA accepts it.

**(b) Context-free but not regular:** $L_b=\{0^n1^n \mid n\ge0\}$. Generated by $S\to0S1\mid\varepsilon$; not regular by the pumping lemma (pumping a block of 0s from $0^p1^p$ unbalances it).

**(c) Recursive but not context-free:** $L_c=\{a^nb^nc^n \mid n\ge0\}$. A TM decides it (cross off one a, one b and one c per round; reject on any mismatch; it always halts). It is not context-free by the pumping lemma for CFLs.

**(d) RE but not recursive:** the universal language $L_u=\{(M,w) \mid M \text{ accepts } w\}$ (or the halting problem). It is RE: the universal TM simulates $M$ on $w$ and accepts if $M$ does. It is not recursive: a decider for $L_u$ would give a decider for $\overline{L_d}$, hence for $L_d$, which is not even RE.

**(e) Not RE:** the diagonalization language $L_d=\{w_i \mid w_i\notin L(M_i)\}$. If $L_d=L(M_i)$ for some machine $M_i$, then $w_i\in L_d\iff w_i\notin L(M_i)=L_d$, a contradiction. ($\overline{L_u}$ is another example.)

Each class is strictly contained in the next: regular ⊂ context-free ⊂ recursive ⊂ RE.`,

  "12": r`**The halting problem.** Given a Turing machine $M$ and an input $w$, does $M$ halt on $w$? As a language:
$$
\text{HALT}=\{(M,w) \mid M \text{ halts on input } w\}.
$$

**HALT is RE.** A TM $H'$ on input $(M,w)$ simulates $M$ on $w$ (as the universal TM does). If the simulation halts, in any state, $H'$ accepts. Then $H'$ accepts exactly the pairs in HALT; on pairs where $M$ runs forever, $H'$ runs forever too, which is allowed for an RE language.

${after(b22Solutions["11"], "**The halting problem is not recursive.**")}`,

  "13": r`**(a) True.** SAT is NP-complete (Cook's theorem): every language $L\in$ NP has a polynomial-time reduction $f$ to SAT. If SAT had a polynomial algorithm $A$, then to decide $w\in L$ we compute $f(w)$ (polynomial time, and $|f(w)|$ is polynomial in $|w|$) and run $A$ on it (polynomial in $|f(w)|$, hence in $|w|$). So every NP language is in P: NP ⊆ P, and with P ⊆ NP, P = NP.

**(b) False (as far as anyone knows; believed false).** The statement says PSPACE ⊆ NP. What is known is the **reverse**: NP ⊆ PSPACE, since a polynomial-time NTM can be simulated deterministically by trying its branches one after another, reusing polynomial space each time. Whether PSPACE ⊆ NP is open, and it is widely believed that NP ≠ PSPACE: PSPACE-complete problems such as QBF are believed not to be in NP.

**(c) True.** PSPACE = NPSPACE.

${b22Solutions["12ii"]}`,
}

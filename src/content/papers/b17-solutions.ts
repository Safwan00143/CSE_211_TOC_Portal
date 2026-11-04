/* Worked solutions for the 17-batch (January 2020 term) paper, keyed by part ("1a", "5", "12b"). */
import { closureTableMd, faRunTex, subsetTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import { b17g5a, b17q2, b17q4b, b17q4bSubset, b17tmXor } from "../machines/b17"
import { b22g6 } from "../machines/b22"
import { b18Solutions } from "./b18-solutions"
import { b20Solutions } from "./b20-solutions"
import { b21Solutions } from "./b21-solutions"
import { after, before } from "./compose"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d+)$/, "$1_{$2}")
const tmName = (q: string) => (q.includes(",") ? `[q_${q[1]},${q.split(",")[1]}]` : q === "qf" ? "q_f" : /^u\d$/.test(q) ? `u_${q[1]}` : `q_${q.slice(1)}`)
const dfaLetter = (q: string) => "ABCDE"[b17q4bSubset.dfa.states.indexOf(q)] ?? q

export const b17Solutions: Record<string, string> = {
  "1a": r`**The Dominating Set problem.** Given a graph $G=(V,E)$ and an integer $k$: is there a set $D\subseteq V$ with $|D|\le k$ such that **every** vertex is either in $D$ or adjacent to a vertex of $D$?

**The certificate** is the set $D$ itself (a list of at most $k$ vertices). Its size is at most $|V|$, polynomial in the input.

**The verifier** checks, given $G$, $k$ and $D$:

1. $|D|\le k$ and every element of $D$ is a vertex of $G$: $O(|V|)$ time.
2. For each vertex $v\in V$: either $v\in D$, or some edge $\{v,u\}$ has $u\in D$. Scanning the adjacency list of every vertex takes $O(|V|+|E|)$ time (or $O(|V|^2)$ with an adjacency matrix).
3. Accept if every check passes.

If $G$ has a dominating set of size at most $k$, that set is a certificate the verifier accepts; if not, no certificate passes check 2 for every vertex. The verifier runs in polynomial time, so **Dominating Set is in NP**. Equivalently, an NTM guesses $D$ (nondeterministically choosing up to $k$ vertices) and then runs the deterministic check, all in polynomial time.

(Dominating Set is in fact NP-complete, but membership in NP only needs this certificate argument.)`,

  "1b": r`Both opinions are wrong.

**(i) $L_1=\{ww\}$: the argument proves nothing.**

- The pumping lemma is a **necessary** condition for regularity. Showing that a string *can* be pumped never proves that a language **is** regular; the lemma is only useful for showing non-regularity.
- Skye also chose the split ($x=\varepsilon$, $y=(00)^k$). Even for a non-regularity proof, the split is chosen by the adversary, and one convenient split shows nothing.
- His string $0^p0^p=0^{2p}$ does pump: $xy^iz=0^{2p+2k(i-1)}$ has even length and is a $ww$. But that is a poor choice of string, not evidence of regularity.

**In fact $L_1$ is not regular.** Take $w=0^p10^p1\in L_1$. Since $|xy|\le p$, $y=0^k$ with $k\ge1$, and $xy^2z=0^{p+k}10^p1$ is not of the form $ww$ (its two halves would have to end in 1 and contain equally many 0s). This contradicts the lemma.

**(ii) $L_2=\{n_0(w)=3n_1(w)\}$: the "failure" is Skye's own mistake.**

- The choice $y=0001$ is **illegal**: the lemma requires $|xy|\le p$, and the first $p$ symbols of $0^{3p}1^p$ are all 0s, so $y$ cannot contain a 1. (In any case, the prover may not choose $y$.)
- With a legal split, $y=0^k$ ($1\le k\le p$), and $xy^2z=0^{3p+k}1^p$ has $n_0=3p+k\ne3p=3n_1$, so it is not in $L_2$. Every legal split fails, so **$L_2$ is not regular**. The chosen string was a good one; only the split was wrong.`,

  "1c": r`**ε-closures.** $E(p)=\{p\}$, $E(q)=\{p,q\}$ (since $q\xrightarrow{\varepsilon}p$), $E(r)=\{p,q,r\}$ (since $r\xrightarrow{\varepsilon}q\xrightarrow{\varepsilon}p$).

**Track the set of possible states** (the subset construction). Start: $E(p)=\{p\}$.

| Set | $a$ | $b$ | $c$ |
|---|---|---|---|
| $\{p\}$ | $\{p\}$ | $E(q)=\{p,q\}$ | $E(r)=\{p,q,r\}$ |
| $\{p,q\}$ | $\{p,q\}$ | $E(\{q,r\})=\{p,q,r\}$ | $E(r)=\{p,q,r\}$ |
| $*\{p,q,r\}$ | $\{p,q,r\}$ | $\{p,q,r\}$ | $\{p,q,r\}$ |

${fig("b17-1c")}

So the meaning of the sets is:

- $\{p\}$: so far only a's (no b, no c);
- $\{p,q\}$: exactly one b so far, and no c;
- $\{p,q,r\}$: a c has been read, or a second b. This set contains $r$, so it accepts, and it is never left.

**The automaton accepts exactly the strings that contain at least one c, or at least two b's.**

**General forms of accepted strings of length at most 3:**

- **length 1:** $c$;
- **length 2:** $xc$ or $cx$ for any symbol $x$ (ac, bc, cc, ca, cb), and $bb$;
- **length 3:** any of the 19 strings that contain a c, and the strings over $\{a,b\}$ with at least two b's: abb, bab, bba, bbb.

The empty string, a, b, aa, ab, ba, aaa, aab, aba, baa are rejected (no c and at most one b).

Example runs: bab is accepted ($\{p\}\xrightarrow{b}\{p,q\}\xrightarrow{a}\{p,q\}\xrightarrow{b}\{p,q,r\}$); aba is rejected (it ends in $\{p,q\}$, which does not contain $r$).

(The description was checked against the NFA on every string over $\{a,b,c\}$ up to length 7: there are 30 accepted strings of length at most 3.)`,

  "2a": r`**What each state remembers.** $q_1$: the last symbol was 0 (and the one before was not 0); $q_2$: the last symbol was 1 (the one before was not 1); $q_3$: the last two symbols were 00; $q_4$: the last two were 11. Reading 0 from $q_1$ or $q_3$ goes to $q_3$; reading 1 from $q_2$ or $q_4$ goes to $q_4$; a change of symbol goes to $q_1$ or $q_2$.

**$L$ = the binary strings that end in 00 or 11** (whose last two symbols are equal). Equivalently $(0+1)^*(00+11)$.

${faRunTex(b17q2, "0100", { name: sub })}
${faRunTex(b17q2, "0110", { name: sub })}

(Checked on every binary string up to length 10.)`,

  "2b": r`An NFA can **guess** where the last two symbols begin: loop in the start state on anything, then nondeterministically read 00 or 11 and stop.

${fig("b17-2b")}

- $s$: loops on 0 and 1 (the prefix);
- $s\xrightarrow{0}z_1\xrightarrow{0}f$ and $s\xrightarrow{1}o_1\xrightarrow{1}f$;
- $f$ is accepting and has no moves, so a branch survives only if the 00 or 11 was really at the end.

Four states instead of five. (Checked against the DFA's language on every string up to length 10.)`,

  "2c": r`The complement: binary strings that **do not** end in 00 or 11. These are the strings of length less than 2, and the strings whose last two symbols differ:
$$
\varepsilon+0+1+(0+1)^*(01+10).
$$
Equivalently, swap the accepting states of the DFA ($q_0,q_1,q_2$ accept instead) and read off the expression.

(Checked against the complement of the DFA on every string up to length 10.)`,

  "3a": r`Recall $\emptyset^*=\{\varepsilon\}$ (choosing zero strings always gives $\varepsilon$), and concatenating with $\emptyset$ gives $\emptyset$.

**i.** $\emptyset^*\emptyset^*\emptyset^*\emptyset^*=\{\varepsilon\}\{\varepsilon\}\{\varepsilon\}\{\varepsilon\}=\{\varepsilon\}$.

**ii.** $\emptyset^*\cup\{\varepsilon\}=\{\varepsilon\}\cup\{\varepsilon\}=\{\varepsilon\}$.

**iii.** $(\emptyset^*\cup1)\{0,1\}=\{\varepsilon,1\}\{0,1\}=\{0,1,10,11\}$.

**iv.** $(11)^*\emptyset(00)^*=\emptyset$: any concatenation with $\emptyset$ is empty, because there is no string to take from the middle factor.

**v.** $(\emptyset^*\cup0)\{0,1,11\}=\{\varepsilon,0\}\{0,1,11\}=\{0,1,11,00,01,011\}$.

(Each set was confirmed by matching the expression against every binary string up to length 5.)`,

  "3b": r`This is Sipser's star construction: $Q=\{q_0\}\cup Q_1$, new start $q_0$, $F=\{q_0\}\cup F_1$. Each case:

**1. $q\in Q_1$, $q\notin F_1$: $\delta(q,a)=\delta_1(q,a)$.** Inside $N_1$, away from its accepting states, $N$ behaves exactly like $N_1$. **Purpose:** to recognise one piece of $L_1$ correctly.

**2. $q\in F_1$, $a\ne\varepsilon$: $\delta(q,a)=\delta_1(q,a)$.** An accepting state of $N_1$ keeps its ordinary moves on input symbols. **Purpose:** a piece of $L_1$ may itself have a prefix in $L_1$ (for example $a$ and $aa$ both in $L_1$); reaching $F_1$ must not force the current piece to end.

**3. $q\in F_1$, $a=\varepsilon$: $\delta(q,a)=\delta_1(q,\varepsilon)\cup\{q_1\}$.** Keep $N_1$'s own ε-moves, and **add** an ε-move back to $N_1$'s start $q_1$. **Purpose:** when one piece of $L_1$ has just been read completely, $N$ may start reading the **next** piece. This is what gives concatenations $w_1w_2\cdots w_k$ of any number of pieces.

**4. $q=q_0$, $a=\varepsilon$: $\delta(q,a)=\{q_1\}$.** From the new start, move to $N_1$'s start without reading input. **Purpose:** to begin reading the first piece.

**5. $q=q_0$, $a\ne\varepsilon$: $\delta(q,a)=\emptyset$.** The new start reads nothing itself. **Purpose:** every input symbol must be read by $N_1$, so that the input splits exactly into pieces of $L_1$.

**Why a new start state?** $\varepsilon\in L_1^*$ always, so $N$ must accept $\varepsilon$; $q_0$ is accepting for this. Simply making $q_1$ accepting would be wrong: if $N_1$ can return to $q_1$ midway through a piece, $N$ would accept unfinished pieces. $q_0$ has no incoming transitions, so it can be accepting safely.`,

  "4a": r`**$L$ = the binary strings with no two consecutive 1s** (no substring 11).

**Why.**

- Each block $00^*1$ is one or more 0s followed by a single 1. Consecutive blocks join as $\ldots1\,0\ldots$, so a 1 is always followed by a 0 inside $(00^*1)^*$.
- The optional leading 1 is followed either by a block (which starts with 0), by the trailing $0^*$, or by nothing. Either way no 11 is formed.
- The trailing $0^*$ adds only 0s.

So no generated string contains 11. Conversely, take any string without 11. Its 1s are separated by at least one 0. If it starts with 1, take that 1 as the leading $(1+\varepsilon)$. Each later 1 is preceded by at least one 0: group "those 0s + that 1" as a block $00^*1$. The 0s after the last 1 form $0^*$.

Examples: $\varepsilon$, 0, 1, 10, 0101, 1001 are in $L$; 11, 0110 are not. (Checked on every binary string up to length 11.)`,

  "4b": r`**Step 1: ε-closures.**

${closureTableMd(b17q4b)}

**Step 2: subset construction.** Start with $A=E(q_0)$. For each new set and each symbol, take the states reachable on that symbol, then their ε-closure.

${subsetTableMd(b17q4b)}

**Step 3: the DFA.** Name the sets $A$–$E$:

| Name | Set |
|---|---|
${b17q4bSubset.dfa.states.map((q) => `| $${dfaLetter(q)}$ | $${q.replace(/q(\d+)/g, "q_{$1}").replace(/[{}]/g, (m) => "\\" + m)}$ |`).join("\n")}

$E$ is the only accepting state (it contains $q_{10}$).

${fig("b17-4b-dfa")}

**The language.** The NFA is $(0\cup1)^*011$ written out by basic principles, so the DFA accepts exactly the strings ending in 011. Its states record progress towards 011: $B$ "ends in 0", $D$ "ends in 01", $E$ "ends in 011", and $C$ "no useful progress".

(The DFA was checked against the NFA on every binary string up to length 10.)`,

  "5": r`### (a) At least one 0 and at least one 1

$$
\begin{aligned}
S &\to A0A1A \mid A1A0A\\
A &\to 0A \mid 1A \mid \varepsilon
\end{aligned}
$$

$A$ generates any binary string. A string has at least one 0 and one 1 exactly when it has some 0 before some 1 ($A0A1A$) or some 1 before some 0 ($A1A0A$).

Leftmost derivation of 110:
${derivation(b17g5a, "110", "lm")}

(Checked against the definition on every binary string up to length 9.)

${after(b18Solutions["5"], "### (ii)").replace("### (ii)", "### (b)")}`,

  "6": b21Solutions["6"],

  "7": r`$w=10011$, $n=5$.

**Cell-by-cell working:**

${cykWorkingMd(b22g6, "10011")}

**The table:**

${cykTableMd(b22g6, "10011")}

${fig("b17-7")}

**Conclusion.** $S\in X_{15}$, so **$10011\in L(G)$**. This agrees with the language of $G$: binary strings of length at least 2 whose first and last symbols are equal (10011 starts and ends with 1).`,

  "8": b21Solutions["8"],

  "9": r`**Idea: one round per bit**, exactly as for AND but storing $a\oplus b$ instead of $a\wedge b$. Check off the leftmost unchecked bit $a$ of $w_1$ and carry it in the state; in $w_2$, check off the bit $b$ in the same position and carry $r=a\oplus b$ (0 if $a=b$, 1 otherwise); append $r$ after the second $c$; walk back for the next bit. A checked bit $x$ is written $*x$.

| State | Meaning |
|---|---|
| $q_0$ | at the next unchecked bit of $w_1$ |
| $[q_1,a]$ | carrying bit $a$ of $w_1$ to $w_2$ |
| $[q_2,a]$ | in $w_2$, looking for its next unchecked bit |
| $[q_3,r]$, $[q_4,r]$ | carrying the result bit $r=a\oplus b$ to the end |
| $q_5,q_6,q_7$ | walking back to $w_1$ |
| $u_1,u_2$ | removing check marks |
| $q_f$ | halt |

**Transition table** (a "–" means no move):

${tmTableMd(b17tmXor, tmName)}

**Trace on $10c11c$** (XOR $=01$):
${tmTraceTex(b17tmXor, "10c11c", { stateTex: tmName })}

(Checked on every valid input $w_1cw_2c$ up to length 10: the tape always ends as $w_1cw_2c(w_1\oplus w_2)$.)`,

  "10": r`${before(b20Solutions["10"], "**(ii)")}${after(b21Solutions["11"], "**(i)").replace("**(i)", "**(ii)").split("**(ii) Not known")[0]}`,

  "11": r`**a) Definitions.**

- A language $L$ is **recursively enumerable (RE)** if $L=L(M)$ for some Turing machine $M$: $M$ accepts every string in $L$. On strings not in $L$, $M$ may reject **or run forever**.
- A language $L$ is **recursive** (decidable) if $L=L(M)$ for some TM $M$ that **halts on every input**: it accepts the strings in $L$ and rejects all others. Such an $M$ is an *algorithm* for $L$.

Every recursive language is RE, but not conversely. The recursive languages are closed under complement; and $L$ is recursive iff both $L$ and $\overline{L}$ are RE.

**b)** ${after(b18Solutions["11"], "**(d)").replace("**(d) RE but not recursive:**", "**ii) RE but not recursive:**").replace("**(e) Not RE:**", "**i) Not RE:**")}`,

  "12a": r`**Cook's theorem.** SAT, the satisfiability problem for Boolean formulas, is **NP-complete**: SAT ∈ NP, and every language in NP reduces to SAT in polynomial time. (The reduction builds, from a polynomial-time NTM $M$ and input $w$, a polynomial-size formula that is satisfiable iff $M$ has an accepting computation on $w$.)

${b20Solutions["12ii"]}`,

  "12b": r`${fig("b17-12b")}

- **P ⊆ NP:** a deterministic polynomial-time TM is a special NTM.
- **NP ⊆ PSPACE:** a polynomial-time NTM uses polynomial space on each branch; a deterministic machine can try the branches one after another, reusing the same polynomial space.
- **PSPACE = NPSPACE:** Savitch's theorem, $\text{NSPACE}(f(n))\subseteq\text{SPACE}(f^2(n))$; the square of a polynomial is a polynomial.
- **PSPACE ⊆ EXPTIME:** a machine using $p(n)$ space has at most $c^{p(n)}$ different configurations; if it halts, it does so within that many steps, which is exponential time.
- **P ⊊ EXPTIME** is proved (time hierarchy theorem), so at least one of the inclusions P ⊆ NP ⊆ PSPACE ⊆ EXPTIME is proper. It is widely believed that **all** of them are proper, but none has been proved individually.`,
}

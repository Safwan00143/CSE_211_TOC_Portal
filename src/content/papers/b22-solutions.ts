/* Worked solutions for the 22-batch (2023-2024) paper, keyed by part ("1a", "5", "12i"). */
import { faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd, grammarTex } from "@/lib/cnf"
import { derivation, rootBody } from "@/lib/derivations"
import { b22aMod3, b22awa, b22g5, b22g6, b22pda, b22q1b, b22tmEq } from "../machines/b22"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

const q1bName = (q: string) => (q === "D" ? "D" : `(${q})`)
const pdaName = (q: string) => (q === "qs" ? "q_s" : q === "qacc" ? "q_{acc}" : `q_${q.slice(1)}`)
const pdaTrace = (w: string) => pdaTraceTex(pdaAcceptingTrace(b22pda, w)!, pdaName)
const tmName = (q: string) => (q.includes(",") ? `[q_${q[1]},${q.split(",")[1]}]` : q === "u" ? "u" : q === "qf" ? "q_f" : `q_${q.slice(1)}`)

export const b22Solutions: Record<string, string> = {
  /* ───────────── Section A ───────────── */

  "1a": r`When a problem seems hard (for instance, it is NP-complete or worse), giving up is not the only choice. The options:

**1. Make sure it really is hard.** Look for a polynomial-time algorithm first; if none is found, prove hardness by a polynomial-time reduction **from** a known NP-complete problem. Then you know a fast exact algorithm for every input is unlikely (it would prove P = NP).

**2. Solve a special case.** Your inputs may be restricted: 2-SAT is in P although 3-SAT is NP-complete; graph colouring is easy on trees and bipartite graphs. Check whether the instances you actually meet have such structure.

**3. Exploit a small parameter.** If the hardness depends on a parameter $k$ that is small in practice, an algorithm taking time like $2^k\cdot n$ is practical.

**4. Accept an approximate answer.** For optimisation versions, an approximation algorithm runs in polynomial time and guarantees a solution within a known factor of optimal (vertex cover has a simple 2-approximation).

**5. Use heuristics or randomisation.** Local search, branch and bound, modern SAT solvers and randomised algorithms often work well in practice, without a worst-case guarantee.

**6. Settle for average-case behaviour** when bad inputs are rare.

**7. Use exhaustive search on small inputs.** Exponential time is fine when $n$ is small.

**8. Use the hardness.** If the hard problem is something an adversary must solve, hardness is a feature: cryptography relies on problems believed infeasible (factoring, discrete logarithm).

What none of these gives, unless P = NP, is an algorithm that is exact, polynomial-time and correct on every input.`,

  "1b": r`**What a state must remember.** Runs of a's are the maximal blocks of a's. Only blocks of length **exactly 3** count. So the DFA needs:

- $c$: how many blocks of exactly three a's have been **completed** so far (0, 1 or 2; a third one makes the string fail for good);
- $r$: the length of the current block of a's (0, 1, 2, 3, or "4 or more", written 4).

A block is only known to have length exactly 3 when it **ends**, at a b or at the end of the input. So:

- reading **a**: $r\to\min(r+1,4)$;
- reading **b**: if $r=3$ the block that just ended counts, so $c\to c+1$ (and if that makes 3, go to the dead state $D$); in every case $r\to0$.

| State | Remembers |
|---|---|
| $(c,0)$ | $c$ completed three-runs; not inside a block of a's |
| $(c,1)$, $(c,2)$ | inside a block of a's of length 1 or 2 |
| $(c,3)$ | inside a block of length exactly 3 so far |
| $(c,4)$ | inside a block of length 4 or more (it will never count) |
| $D$ | three blocks of exactly three a's have appeared |

**Accepting states.** At the end of the input a block in progress also ends. So the string is accepted iff $c+[r=3]\le2$: every state except $D$ and $(2,3)$.

${fig("b22-1b")}

**Traces.**

aaabaaab (two three-runs), accepted:
${faRunTex(b22q1b, "aaabaaab", { name: q1bName })}

aaaabaaabaaab (the first block has four a's and does not count), accepted:
${faRunTex(b22q1b, "aaaabaaabaaab", { name: q1bName })}

aaabaaabaaa (three three-runs; the last ends with the input), rejected:
${faRunTex(b22q1b, "aaabaaabaaa", { name: q1bName })}

This DFA has 16 states; it is checked by machine against the definition on every string up to length 14.`,

  "1c": r`**Step 1: NFA for $L_1=\{w \mid w \text{ contains at least three 1s}\}$.** States $q_0,q_1,q_2,q_3$ count the 1's seen so far (capped at 3); 0's loop. $q_3$ is accepting.

**Step 2: NFA for $L_2=\emptyset$.** By the basic construction, one state $r_0$ that is the start state, is **not** accepting, and has no transitions.

**Step 3: the concatenation construction.** For $N_1=(Q_1,\Sigma,\delta_1,q_0,F_1)$ and $N_2=(Q_2,\Sigma,\delta_2,r_0,F_2)$, build $N=(Q_1\cup Q_2,\Sigma,\delta,q_0,F_2)$:

- start at $N_1$'s start $q_0$;
- keep all transitions of $N_1$ and $N_2$;
- add an ε-move from every accepting state of $N_1$ to $N_2$'s start: $\delta(q_3,\varepsilon)=\{r_0\}$;
- the accepting states are $F_2$ only; $q_3$ stops accepting.

${fig("b22-1c")}

**Result.** $F_2=\emptyset$, so $N$ has **no accepting state** and accepts nothing:
$$
L(N)=L_1\circ\emptyset=\emptyset.
$$
That matches the algebra: $L\emptyset=\{xy \mid x\in L,\ y\in\emptyset\}$ is empty, because there is no $y$ to choose.`,

  /* ───── Q2 ───── */

  "2a": r`**Where the condition comes from.** Let $M$ be a DFA for a regular language $A$ with $p$ states, and $s\in A$ with $|s|\ge p$. While reading the **first $p$ symbols** of $s$, $M$ passes through $p+1$ states $r_0,r_1,\dots,r_p$. There are only $p$ different states, so by the pigeonhole principle two of these are equal: $r_j=r_\ell$ with $j<\ell\le p$. Cutting $s$ there,
$$
x=s_1\cdots s_j,\qquad y=s_{j+1}\cdots s_\ell,\qquad z=s_{\ell+1}\cdots s_n,
$$
and $y$ takes $M$ round a cycle, so $xy^iz\in A$ for all $i$. Because the repeat was found among the first $p+1$ states, $|xy|=\ell\le p$. The lemma can promise this extra fact for free.

**Example.** $A=\{w\in\{a,b\}^* \mid \text{the number of a's is divisible by 3}\}$, recognised by a DFA with $p=3$ states:

${fig("b22-2a")}

${faRunTex(b22aMod3, "aaab")}

For $s=aaab$, the first repeated state among $r_0,\dots,r_3$ is $q_0$ (at $r_0$ and $r_3$), so $x=\varepsilon$, $y=aaa$, $z=b$, and $|xy|=3\le p$. Pumping $y$ adds or removes three a's at a time, staying in $A$.

**Why the condition is needed in proofs.** It tells us **where** $y$ is: inside the first $p$ symbols. Without it, the adversary could choose $y$ anywhere in $s$, and for many languages some far-away $y$ pumps harmlessly, so the proof would fail.

Take the non-regular language $L=\{a^nb^nc^m \mid n,m\ge0\}$ and $s=a^pb^pc^p$.

- **With $|xy|\le p$:** $y=a^k$ with $1\le k\le p$, so $xy^0z=a^{p-k}b^pc^p\notin L$. Every legal split fails: $L$ is not regular.
- **Without $|xy|\le p$:** the adversary may pick $y=c$ (one symbol of the c-block). Then $xy^iz=a^pb^pc^{p-1+i}\in L$ for every $i$, and the proof gets nowhere with this $s$.

So $|xy|\le p$ is both **true** (forced by the pigeonhole principle on the first $p$ steps) and **what makes the lemma usable**: it lets the prover trap $y$ in a part of the string they control.`,

  "2b": r`$L=\{awa \mid w\in\{a,b\}^*\}$: strings of length at least 2 that begin **and** end with a. (The single string a is not in $L$: $awa$ has length at least 2.)

**What each state remembers.**

| State | Remembers |
|---|---|
| $q_0$ | nothing read |
| $q_1$ | began with a, and either only that a has been read or the last symbol was b |
| $q_2$ | began with a, length at least 2, last symbol a (accept) |
| $d$ | began with b: dead |

${fig("b22-2b")}

${faTableMd(b22awa)}

**Traces.** abba:
${faRunTex(b22awa, "abba")}
aba:
${faRunTex(b22awa, "aba")}
ab (does not end in a):
${faRunTex(b22awa, "ab")}
a (too short):
${faRunTex(b22awa, "a")}

A DFA exists, so $L$ is regular. (Equivalently $L=L(a(a+b)^*a)$.)`,

  "2c": r`**No.** The transition table has

- one **row** per state: $|Q|$ rows;
- one **column** per input symbol: $|\Sigma|$ columns.

Being accepting is a property marked on a row (with $*$, or a double circle in the diagram). Making a state accepting or non-accepting changes only that mark; it adds or removes no row and no column. So two DFAs with the same states and alphabet have tables of the same size whatever their accepting sets: for example, a DFA and its complement (accepting states swapped) have identical tables apart from the $*$ marks.

The **entries** of the table are also unaffected; only which rows are starred changes. (Changing $F$ changes the *language*, and so may change the size of the *minimal* DFA for it, but not the table of a given DFA.)`,

  /* ───── Q3 ───── */

  "3a": r`**Simplify the language first.** In $\{b^ma^k \mid m\ge0,k\ge0\}$ take $m=0$: it contains every $a^k$ with $k\ge0$, so it already contains $\{a^n \mid n\ge1\}$. Hence
$$
L=\{b^ma^k \mid m,k\ge0\}=b^*a^*.
$$

**A 3-state NFA** (one branch per part of the union):

${fig("b22-3a")}

- $s$ (start, accepting): reading b's, $m\ge0$; accepting covers $\varepsilon$ and $b^m$.
- $q$ (accepting): reading the a's after the b's, $k\ge1$.
- $t$ (accepting): the branch for $a^n$, $n\ge1$; it is entered on the first a from $s$.

**Can fewer states work? Yes, 2 are enough**, as the right-hand diagram shows: $p$ (start, accepting, loop b) and $q$ (accepting, loop a), with $p\xrightarrow{a}q$. It accepts exactly $b^*a^*$: b's in $p$, then a's in $q$; a b after an a has no move.

**But not 1.** A one-state NFA must have its only state accepting, because $\varepsilon\in L$. If that state had no loop on a it would reject a; with no loop on b it would reject b; with both loops it would accept ab $\notin L$. So the minimum is 2 states, and the 3-state machine is not minimal.

Both machines are checked against $b^*a^*$ on all strings up to length 10.`,

  "3b": r`**The correct construction** adds a **new** start state that is accepting, with an ε-move to the old start $q_1$, and ε-moves from each accepting state of $N_1$ back to $q_1$.

**The proposal** keeps the ε-moves back to $q_1$ but, instead of adding a new state, makes $q_1$ itself accepting (so that $\varepsilon$ is accepted).

**Why it is a bad idea.** If $q_1$ has **incoming** transitions inside $N_1$, a computation can return to $q_1$ in the **middle** of reading one piece. With $q_1$ now accepting, stopping there accepts an **unfinished** piece. The new start state of the correct construction has no incoming transitions, so it can be accepting without that danger.

**Counterexample.** Let $A=a^*b$, recognised by $N_1$: start $q_1$ with a loop on a, and $q_1\xrightarrow{b}q_2$, $q_2$ accepting.

${fig("cl-star-flaw")}

- $A^*=(a^*b)^*$: every nonempty string in it **ends in b**. So $a\notin A^*$.
- The proposed machine reads a by looping at $q_1$, and $q_1$ is accepting, so it **accepts a**.

So the proposed construction recognises a language different from $A^*$; checked by simulation, it accepts exactly $(a^*b)^*a^*$, which is every string over $\{a,b\}$. The correct machine (right) accepts exactly $(a^*b)^*$.`,

  "3c": r`In a context-free grammar every production has the form
$$
A\to\alpha,
$$
a **single variable** on the left. Such a rule may replace **any** occurrence of $A$ in a sentential form, whatever symbols surround it. The rewriting does not depend on the **context** of $A$: hence "context-free".

**Example.** With $S\to aSb\mid\varepsilon$, in $aaSbb$ the $S$ can be replaced by $aSb$ or $\varepsilon$ regardless of the a's to its left and b's to its right.

**Contrast: context-sensitive rules** have the form $\alpha A\beta\to\alpha\gamma\beta$: $A$ may become $\gamma$ only when it sits between $\alpha$ and $\beta$. For example
$$
aB\to ab
$$
lets $B$ become b only immediately after an a; in $cB$ it cannot be rewritten by this rule.

**Why it matters.** Because each variable is expanded independently of its surroundings, a derivation is a **tree** (each node's subtree depends only on its own label). That gives parse trees, the CYK algorithm, and the pumping lemma for CFLs; it is also why CFGs cannot enforce constraints between distant parts of a string, such as $a^nb^nc^n$.`,

  /* ───── Q4 ───── */

  "4a": r`${fig("b22-4a")}

$N$ has states $s$ (start, not accepting), $q$ and $f$ (both accepting), and three edges:

- $s\xrightarrow{\varepsilon}q$, the edge to be removed;
- $q\xrightarrow{a}q$, a loop;
- $s\xrightarrow{a}f$.

**$L(N)=\{a\}^*$.** $\varepsilon$: $s\xrightarrow{\varepsilon}q$, accepting. $a^n$ for $n\ge1$: $s\xrightarrow{\varepsilon}q$ then the loop $n$ times. Only a's exist, so nothing else is accepted.

**Remove $s\xrightarrow{\varepsilon}q$.** Now $q$ cannot be reached at all. From $s$ the only move is $s\xrightarrow{a}f$, and $f$ has no outgoing edges. So exactly one string is accepted: a. $\varepsilon$ is rejected ($s$ is not accepting) and $aa$ is rejected ($f$ has no move).

**Why the removed edge must be an ε-edge from the start.** The smaller machine must reject $\varepsilon$, so in $N$ the only way to accept $\varepsilon$ must use the removed edge, and an edge on a path reading no input is an ε-edge. Both machines are checked by simulation.`,

  "4b": r`Let $L$ be the strings over $\{a,b\}$ with **at most one occurrence** of aa (occurrences may overlap, so aaa contains two). **Only option B is correct.**

**Useful facts.**

- $(b+ab)^*$ generates exactly the strings in which **every a is immediately followed by b**: no aa, and not ending in a.
- $(b+ba)^*$ generates exactly the strings in which **every a is immediately preceded by b**: no aa, and not starting with a.

**A. $(b+ab)^*(\varepsilon+a+aa)(b+ab)^*$: wrong.**

- It **includes** aaab $\notin L$: take $\varepsilon$, then aa, then $ab\in(b+ab)^*$. The string aaab contains aa twice (positions 1–2 and 2–3).
- It also **misses** aaba $\in L$: after the middle part, the suffix must be in $(b+ab)^*$, so it cannot end in a; and no other split works.

**B. $(b+ab)^*(\varepsilon+a+aa)(b+ba)^*$: correct.** Write a string as $u\,m\,v$ with $u\in(b+ab)^*$, $m\in\{\varepsilon,a,aa\}$, $v\in(b+ba)^*$.

- *Every generated string is in $L$.* $u$ has no aa and is empty or ends in b; $v$ has no aa and is empty or starts with b. So no aa can straddle $u|m$ or $m|v$, and the only possible occurrence is $m=aa$ itself: at most one.
- *Every string of $L$ is generated.*
  - If $w$ contains aa, write $w=x\,aa\,y$ at that occurrence. $x$ cannot end in a and $y$ cannot start with a (either would make a second aa), and neither contains aa. So $x\in(b+ab)^*$, $y\in(b+ba)^*$; take $m=aa$.
  - If $w$ has no aa and does not end in a, every a is followed by b, so $w\in(b+ab)^*$; take $m=v=\varepsilon$.
  - If $w$ has no aa and ends in a, $w=xa$ where $x$ does not end in a, so $x\in(b+ab)^*$; take $m=a$, $v=\varepsilon$.

**C. $(b+ab)^*(\varepsilon+a)(b+ba)^*$: wrong.** It never produces aa at all (by the argument for B with $m\ne aa$), so it **misses** aa $\in L$ (and aab, baa, …). It describes "no aa", not "at most one".

**D. $(b+ba)^*(\varepsilon+a+aa)(b+ba)^*$: wrong.**

- It **includes** baaa $\notin L$: $ba\in(b+ba)^*$, then aa, giving b·a·aa with two occurrences of aa.
- It **misses** abaa $\in L$: the prefix part can never start with a, and starting with the middle a leaves baa for $(b+ba)^*$, which cannot contain aa.

All four options were also compared with $L$ by machine on every string up to length 9, with the same conclusions; option B agrees with $L$ on all strings up to length 11.`,

  "4c": r`Let $L=\{a^{n!} \mid n\ge1\}=\{a,a^2,a^6,a^{24},\dots\}$.

1. **Assume** $L$ is regular, and let $p$ be its pumping length.
2. **Choose** $s=a^{(p+1)!}$. Then $s\in L$ and $|s|=(p+1)!\ge p$.
3. **Split.** By the lemma $s=xyz$ with $|y|>0$ and $|xy|\le p$. The string has only a's, so $y=a^k$ with $1\le k\le p$.
4. **Pump with $i=2$.** $|xy^2z|=(p+1)!+k$. Then
$$
(p+1)!<(p+1)!+k\le(p+1)!+p<(p+1)!+(p+1)\cdot(p+1)!=(p+2)!.
$$
   The middle inequality uses $p<(p+1)\cdot(p+1)!$. So $(p+1)!+k$ lies **strictly between two consecutive factorials** $(p+1)!$ and $(p+2)!$.
5. The factorials are increasing for $n\ge1$, so no factorial lies strictly between them, and $xy^2z\notin L$. This contradicts the lemma, so **$L$ is not regular**.

**Why $(p+1)!$ and not $p!$?** With $p=1$, $s=a^{1!}=a$, $y=a$ and $xy^2z=aa=a^{2!}\in L$: the gap between $1!$ and $2!$ is too small. Using $(p+1)!$ makes the gap to the next factorial, $(p+1)\cdot(p+1)!$, larger than $p$ for every $p\ge1$. (The argument is also checked by brute force over every split for $p=1,\dots,4$.)`,

  /* ───────────── Section B ───────────── */

  "5": r`$L=\{a^ib^jc^k \mid (i=j \text{ or } i=k),\ i,j,k\ge1\}$ is a **union** of two languages, so the grammar has one branch for each:

- $i=j$: $a^ib^i$ followed by $c^k$, $k\ge1$;
- $i=k$: $a^i$ wrapped around $b^j$ with matching $c^i$, $j\ge1$.

**Grammar.**
${grammarTex(b22g5)}

- $A\to aAb\mid ab$ generates $a^ib^i$ with $i\ge1$ (wrapping keeps the counts equal); $C\to cC\mid c$ generates $c^k$, $k\ge1$. So $S\to AC$ gives exactly the strings with $i=j$.
- $B\to aBc\mid aDc$ wraps $a$ and $c$ in pairs around $D$, so the numbers of a's and c's are equal and at least 1; $D\to bD\mid b$ generates $b^j$, $j\ge1$. So $S\to B$ gives exactly the strings with $i=k$.

Every string generated is in $L$, and every string of $L$ satisfies $i=j$ or $i=k$ and is produced by the matching branch. (Checked by machine on all strings up to length 9.)

**The grammar is ambiguous.** A string with $i=j=k$ is in **both** parts of the union. Take abc:

${fig("b22-5")}

Leftmost derivation through $S\to AC$:
${derivation(b22g5, "abc", "lm", (t) => rootBody(t) === "AC")}
Leftmost derivation through $S\to B$:
${derivation(b22g5, "abc", "lm", (t) => rootBody(t) === "B")}

Two different leftmost derivations (two parse trees) for the same string: the grammar is ambiguous. (In fact this language is inherently ambiguous, so every grammar for it is ambiguous.)`,

  "6a": r`$w=0010$, $n=4$. $X_{ij}$ is the set of variables deriving symbols $i$ through $j$.

**Bottom row.** $0$ comes from $A\to0$ and $Z\to0$; $1$ comes from $A\to1$ and $Y\to1$.

**Cell-by-cell working:**

${cykWorkingMd(b22g6, "0010")}

**The table:**

${cykTableMd(b22g6, "0010")}

${fig("b22-6")}

**Conclusion.** $S\in X_{14}$, so **$0010\in L(G)$**. (One derivation: $S\Rightarrow BZ\Rightarrow ZAZ\Rightarrow0AZ\Rightarrow0ZAZ\Rightarrow00AZ\Rightarrow001Z\Rightarrow0010$.)`,

  "6b": r`Work out what each variable generates, starting from the terminal rules.

- $Z$ generates 0; $Y$ generates 1.
- $A\to ZA\mid YA\mid0\mid1$: $A$ is a 0 or 1 followed by another $A$, or a single bit. So $A$ generates **every nonempty binary string**, $\{0,1\}^+$.
- $B\to ZA$ generates $0\{0,1\}^+$: a 0 followed by at least one bit.
- $C\to YA$ generates $1\{0,1\}^+$.
- $S\to BZ$: $0\,x\,0$ with $x$ nonempty. $S\to CY$: $1\,x\,1$ with $x$ nonempty. $S\to ZZ$: 00. $S\to YY$: 11.

**$L(G)$ is the set of binary strings of length at least 2 that begin and end with the same symbol.** For example 00, 11, 010, 0010 and 1101 are in it; 0, 01 and 0011 are not.

(Checked by machine: the grammar and this description agree on all strings up to length 10.)`,

  "7": r`**Example:** $L=\{a^nb^nc^n \mid n\ge0\}$. It needs three equal blocks; a single stack can match only two.

**Proof that $L$ is not context-free.**

1. Assume $L$ is context-free; let $p$ be its pumping length.
2. Choose $w=a^pb^pc^p$. Then $w\in L$ and $|w|=3p\ge p$.
3. By the lemma, $w=uvxyz$ with $|vxy|\le p$ and $|vy|>0$, and $uv^ixy^iz\in L$ for all $i\ge0$.
4. **$vxy$ touches at most two adjacent blocks.** To contain both an a and a c it would have to contain at least one a, all $p$ b's and at least one c: $|vxy|\ge p+2>p$. So $vxy$ contains no c, or contains no a.
5. **Pump with $i=2$.** Two cases cover every split.
   - **Case 1: $v$ or $y$ contains two different symbols.** Say $v=a^rb^s$ with $r,s>0$. Then $v^2=a^rb^sa^rb^s$ puts an a after a b, so $uv^2xy^2z$ is not even of the form $a^*b^*c^*$. The same happens for any piece containing b's and c's.
   - **Case 2: $v$ and $y$ each contain only one kind of symbol.** By step 4, at least one of the three blocks is untouched by $v$ and $y$ and keeps length exactly $p$. Since $|vy|>0$, at least one other block grows. So the three counts in $uv^2xy^2z$ are not all equal.
6. In every case $uv^2xy^2z\notin L$, contradicting the lemma. **$L$ is not context-free.**

(The argument is also checked by brute force over every legal split for $p=1,\dots,4$.)`,

  "8": r`$L=\{a^nb^mc^md^n \mid n\ge1,\ m\ge1\}$ is **nested**: the c's match the b's inside, and the d's match the a's outside. A stack handles this naturally: the B's for the b's sit **on top of** the A's for the a's, so the c's are matched first, then the d's.

**Design.**

1. Push the bottom marker Z.
2. For each a push A; the first a is read on the way from $q_1$ to $q_a$, so $n\ge1$.
3. For each b push B; the first b moves to $q_b$, so $m\ge1$ (and a's can no longer come).
4. For each c pop a B; for each d pop an A.
5. Accept only when Z is on top again after the d's, i.e. every A and B has been matched.

${fig("b22-8")}

Labels are *input, pop $\to$ push*. Any symbol out of order has no transition, so the machine gets stuck.

**Why it is correct.** Pushes and pops match one-for-one, so reaching $q_{acc}$ requires $\#c=\#b$ (each c pops a B, and the d's cannot start until B's are gone because a d needs A on top) and $\#d=\#a$. The order $a^+b^+c^+d^+$ is forced by the states.

**Accepting trace** on aabcdd ($n=2$, $m=1$):
${pdaTrace("aabcdd")}

And aabbccdd ($n=m=2$):
${pdaTrace("aabbccdd")}

**Rejected:** aabccdd has two c's but one b. After the first c pops the only B, the top is A, and there is no move on c with A on top, so every branch gets stuck.

(The PDA is checked by machine against the definition on every string up to length 9.)`,

  "9": r`**Idea: check off one bit of each number per round, with the current bit stored in the state.** Use two-track symbols: a bit $x$ is $[B,x]$ (written $x$), and a checked bit is $[*,x]$ (written $*x$).

**Round.**

1. In $q_0$, at the leftmost unchecked bit $a$ of $w_1$: check it ($a\to *a$) and move right in state $[q_1,a]$, **remembering $a$**.
2. $[q_1,a]$ moves right over the rest of $w_1$ to the first c, then becomes $[q_2,a]$.
3. $[q_2,a]$ skips checked bits of $w_2$ to the first unchecked bit $b$ and checks it.
   - If $b=a$: go left in $q_3$ to start the next round.
   - If $b\ne a$: the numbers differ. Go right in $[q_4,1]$ ("answer 1").
4. $q_3$ moves left over $w_2$ and the first c, then $q_5$ moves left over the unchecked part of $w_1$ to the last checked bit, and steps right into $q_0$.

**End.** If $q_0$ sees c, every bit of $w_1$ was matched: go right in $[q_4,0]$ ("answer 0"). $[q_4,r]$ runs right to the second c, $[q_6,r]$ writes $r$ on the blank after it, then state $u$ walks left removing check marks, and the machine halts in $q_f$. The tape ends as $w_1cw_2cr$.

| State | Meaning |
|---|---|
| $q_0$ | at the next unchecked bit of $w_1$ |
| $[q_1,a]$ | carrying bit $a$ to $w_2$ |
| $[q_2,a]$ | in $w_2$, looking for its next unchecked bit, to compare with $a$ |
| $q_3$, $q_5$ | walking back to $w_1$ |
| $[q_4,r]$, $[q_6,r]$ | carrying the answer $r$ to the end, then writing it |
| $u$ | removing check marks |
| $q_f$ | halt (accept) |

**Transition table** (a "–" means no move):

${tmTableMd(b22tmEq, tmName)}

**Trace on $0c0c$ (equal, writes 0):**
${tmTraceTex(b22tmEq, "0c0c", { stateTex: tmName })}

**Trace on $0c1c$ (different, writes 1):**
${tmTraceTex(b22tmEq, "0c1c", { stateTex: tmName })}

The finite control stores one bit (and the answer), and the tape uses one extra track for check marks: exactly the "storage in the state" and "multiple tracks" techniques. (The machine is checked on every valid input $w_1cw_2c$ up to length 10: it always ends with $w_1cw_2c$ followed by 0 if $w_1=w_2$ and 1 otherwise.)`,

  "10": r`**Multi-tape TM.** A $k$-tape TM has a finite control and $k$ tapes, each with its own head. The input starts on tape 1 with its head on the first symbol; every other cell is blank. One move depends on the state and all $k$ scanned symbols; it changes state, writes a symbol on each tape, and moves each head **independently** left, right or stationary (L, R, S). It accepts by entering an accepting state.

**Simulation by a one-tape TM with tracks and storage in the state.** Let $M$ have $k$ tapes. Build a one-tape TM $N$ whose tape has $2k$ **tracks**:

- tracks $2,4,\dots,2k$ hold the contents of $M$'s tapes;
- tracks $1,3,\dots,2k-1$ hold a single marker X each, showing where $M$'s corresponding head is.

| Track | Example contents ($k=2$) |
|---|---|
| 1 (head 1) | . . X . . |
| 2 (tape 1) | $A_1A_2A_3A_4A_5$ |
| 3 (head 2) | . . . . X |
| 4 (tape 2) | $B_1B_2B_3B_4B_5$ |

**Storage in the state:** $N$'s finite control holds $M$'s current state, the symbols seen under the head markers so far, and how many markers lie to its left (so it never gets lost).

**One move of $M$:**

1. $N$ sweeps across its tape, visiting each of the $k$ markers, and records the symbol under each in its finite control.
2. Knowing $M$'s state and all $k$ scanned symbols, $N$ knows $M$'s move.
3. $N$ sweeps back, at each marker writing the new symbol on that tape's track and moving the marker left or right as $M$'s head moves.
4. $N$ updates $M$'s state in its finite control.

$N$ accepts exactly when the recorded state of $M$ is accepting, so $L(N)=L(M)$: multitape TMs accept only RE languages.

**Cost.** After $n$ moves $M$'s heads are at most $2n$ cells apart, so each simulated move takes $O(n)$ moves of $N$, and $n$ moves take $O(n^2)$.`,

  "11": r`**A non-RE language: the diagonalization language $L_d$.** List binary strings $w_1,w_2,\dots$ and Turing machines $M_1,M_2,\dots$ ($M_i$ is the TM whose code is $w_i$). Then
$$
L_d=\{w_i \mid w_i\notin L(M_i)\}.
$$
**$L_d$ is not RE.** Suppose $L_d=L(M)$. $M$ has a code, so $M=M_i$ for some $i$. If $w_i\in L_d$, then $M_i$ accepts $w_i$, so by definition $w_i\notin L_d$; if $w_i\notin L_d$, then $M_i$ does not accept $w_i$, so $w_i\in L_d$. Both are impossible, so no such $M$ exists.

**The halting problem is not recursive.** $\text{HALT}=\{(M,w) \mid M \text{ halts on input } w\}$. We may assume the universal language $L_u=\{(M,w) \mid M \text{ accepts } w\}$ is not recursive.

1. Suppose, for contradiction, that HALT is recursive, decided by a TM $H$ that always halts.
2. **Decide $L_u$ using $H$.** On input $(M,w)$:
   - run $H$ on $(M,w)$. If $H$ says $M$ does not halt on $w$, **reject** (a machine that runs forever does not accept);
   - otherwise $M$ halts on $w$, so run $M$ on $w$ to completion; **accept** if it halts in an accepting state, else **reject**.
3. This procedure always halts: the first step always halts, and the second only runs $M$ when $M$ is known to halt.
4. It accepts exactly the pairs where $M$ accepts $w$, so it decides $L_u$.
5. That contradicts $L_u$ being not recursive. So **HALT is not recursive**. (We have reduced $L_u$ to HALT.)

HALT is RE, though: simulate $M$ on $w$ and accept if it halts. So HALT is RE but not recursive.`,

  "12i": r`${fig("b22-12")}

- **P ⊆ NP:** a deterministic TM is a nondeterministic one with no choices.
- **NP-complete ⊆ NP:** by definition. If P ≠ NP (the widely believed case), P and the NP-complete problems are **disjoint**: a polynomial algorithm for any NP-complete problem would give P = NP.
- **NP ⊆ recursive:** an NTM with polynomial time bound can be simulated by a DTM that tries every branch (exponential time but always halting), so every NP language is decidable.
- **Recursive ⊆ RE**, and the inclusion is strict: $L_u$ and HALT are RE but not recursive. $L_d$ lies outside RE altogether.`,

  "12ii": r`**PSPACE = NPSPACE.**

- **PSPACE ⊆ NPSPACE** trivially: a deterministic TM is a nondeterministic TM.
- **NPSPACE ⊆ PSPACE** by **Savitch's theorem**: $\text{NSPACE}(f(n))\subseteq\text{SPACE}(f^2(n))$ for $f(n)\ge n$.

**Why Savitch's theorem holds (idea).** An $f(n)$-space NTM accepts, if at all, within $c^{1+f(n)}$ moves (it has only that many IDs). A DTM asks recursively whether the start ID can reach an accepting ID within $m$ moves, by trying every middle ID $K$ and checking both halves with $m/2$ moves each. The two recursive calls are made one after the other, so the recursion stack has only $\log_2 m=O(f(n))$ frames, each holding two IDs and a counter of size $O(f(n))$. Total space $O(f^2(n))$.

If $f$ is a polynomial, so is $f^2$, so nondeterminism gives no extra power for polynomial **space** (unlike time, where P vs NP is open).`,

  "13": r`**Cook's theorem: SAT is NP-complete.** SAT is in NP (guess an assignment, evaluate the formula). For the other half, let $L$ be any language in NP, accepted by an NTM $M$ that runs at most $p(n)$ steps on inputs of length $n$. For each input $w$ the reduction builds, in polynomial time, a Boolean formula $F(M,w)$ that is **satisfiable iff some computation branch of $M$ on $w$ accepts**. So every NP language reduces to SAT.

A truth assignment to $F$'s variables **describes one branch**:

- $s(q,j)$: $M$ is in state $q$ at step $j$;
- $l_{ij}$: the head is on cell $i$ at step $j$;
- $c(i,j,t)$: cell $i$ holds symbol $t$ at step $j$;
- $u(i,j)$: cell $i$ is unchanged from step $j$ to $j+1$,

for $0\le i,j\le p(n)$. $F$ is the AND of rules saying that at every step there is exactly one state, one head position, one symbol per cell; unchanged cells keep their symbols; each step follows $\delta$; the first step is the initial configuration on $w$; and the last state is accepting. Its size is polynomial (dominated by the $\delta$ rule, $O(|Q|\,|\Gamma|\,p(n)^3)$), so the reduction is polynomial. Hence SAT is NP-complete: a polynomial algorithm for SAT would put every NP problem in P.

**The rule for $\delta(q,t)=\{(q_1,t_1,R),(q_2,t_2,L)\}$ at cell $i$, step $j$** (the head not at either end, so moving right goes to $i+1$ and left to $i-1$):
$$
\big[s(q,j)\land l_{ij}\land c(i,j,t)\big]\ \to\ \Big[\bigwedge_{k\ne i}u(k,j)\Big]\land\Big[\big(s(q_1,j+1)\land l_{i+1,\,j+1}\land c(i,j+1,t_1)\big)\lor\big(s(q_2,j+1)\land l_{i-1,\,j+1}\land c(i,j+1,t_2)\big)\Big].
$$

In words: if at step $j$ the machine is in $q$, scanning cell $i$, which holds $t$, then

- every other cell is unchanged at step $j+1$, and
- **one** of the two moves happens: either the state becomes $q_1$, cell $i$ becomes $t_1$ and the head moves to $i+1$; or the state becomes $q_2$, cell $i$ becomes $t_2$ and the head moves to $i-1$.

The OR between the two options is how the formula captures nondeterminism.`,
}

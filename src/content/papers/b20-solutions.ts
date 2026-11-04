/* Worked solutions for the 20-batch (2021-2022) paper, keyed by part ("1a", "5", "12i"). */
import { closureTableMd, faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTableMd, tmTraceTex } from "@/lib/automata"
import { grammarTex } from "@/lib/cnf"
import { derivation, rootBody } from "@/lib/derivations"
import {
  b20concat,
  b20g2d,
  b20g5,
  b20g5Cnf,
  b20g5Eps,
  b20g5Unit,
  b20g5Useless,
  b20g6,
  b20pda,
  b20q1b,
  b20q3b,
  b20q3cNfa,
  b20tm,
} from "../machines/b20"
import { b21Solutions } from "./b21-solutions"
import { b22Solutions } from "./b22-solutions"
import { after } from "./compose"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^q(a+|b)$/, "q_{$1}").replace(/^([ab])(\d)$/, "$1_$2")
const pdaName = (q: string) => ({ qs: "q_s", qe: "q_e", qo: "q_o", qacc: "q_{acc}" })[q] ?? q
const pdaTrace = (w: string) => pdaTraceTex(pdaAcceptingTrace(b20pda, w)!, pdaName)

export const b20Solutions: Record<string, string> = {
  /* ───────────── Section A ───────────── */

  "1a": r`The three central areas are **automata theory**, **computability theory** and **complexity theory**. A password login system mainly uses **complexity theory**, with a supporting role for automata.

**Complexity theory (the main one).** A sensible system never stores passwords in plain text. It stores $h(\text{password})$, where $h$ is a **one-way (cryptographic hash) function**: computing $h(x)$ is fast, but finding any $x$ with $h(x)=y$ is believed to be computationally **infeasible**.

- Logging in: the system computes $h$ of what you typed and compares it with the stored value. This is fast (polynomial time).
- Attacking: someone who steals the password file must invert $h$. The security rests on the belief that no efficient (polynomial-time) algorithm does this; the best known attack is essentially exhaustive search over possible passwords, whose number grows exponentially with the length.

So the system works because of the gap between an **easy** problem and a **hard** one, which is exactly what complexity theory studies. If P = NP, checking a candidate password being easy would make finding one easy too, and one-way functions could not exist.

**Automata theory (supporting).** Password rules such as "at least 8 characters, with a digit and an uppercase letter" are regular languages: the system checks them with a finite automaton or a regular expression, and the login dialog itself is a finite-state system (waiting, checking, locked after three failures).`,

  "1b": r`**Idea.** Reject anything that starts with b. After that, remember just enough of the tail to spot aab: whether the last symbols are a single a, or aa (a b now would complete aab), or a b.

| State | Remembers |
|---|---|
| $q_0$ | nothing read |
| $q_a$ | began with a; last symbol a, and the one before was not a |
| $q_{aa}$ | began with a; last two symbols aa |
| $q_b$ | began with a; last symbol b |
| $d$ | began with b, or aab has appeared (dead) |

Accepting: $q_a$, $q_{aa}$, $q_b$. Five states in all.

${fig("b20-1b")}

${faTableMd(b20q1b, { label: sub })}

**Traces.** abaa (accepted):
${faRunTex(b20q1b, "abaa", { name: sub })}
abaab (rejected, contains aab):
${faRunTex(b20q1b, "abaab", { name: sub })}
ba (rejected, starts with b):
${faRunTex(b20q1b, "ba", { name: sub })}

(Checked against the definition on every string up to length 11.)`,

  "1c": b21Solutions["3b"],

  "1d": r`All three arguments are **unacceptable**. In (i) and (ii) the conclusion happens to be true but the argument is broken; in (iii) the conclusion itself is false.

**(i) Palindromes.** 00011000 is indeed a palindrome, but:

- **The string does not depend on $p$.** The lemma only applies to strings of length at least $p$, and $p$ is unknown. If $p>8$ the lemma says nothing about 00011000.
- **"$xy$ lies in the $0^p$ at the start" is unjustified.** $w$ begins with only three 0s. For $p\ge4$, $xy$ may include 1s. For example, with $p=8$ the split $x=00$, $y=0110$, $z=00$ satisfies $|xy|\le p$, and $xy^iz=00(0110)^i00$ is a palindrome for every $i$, so no contradiction arises.

**Fix:** take $w=0^p10^p$. Now $|xy|\le p$ really does force $y=0^k$ with $k\ge1$, and $xz=0^{p-k}10^p$ is not a palindrome. So the set of palindromes is not regular.

**(ii) Equal numbers of 0s and 1s.**

- $|w|=p$ (and $p/4$ need not even be an integer). With $|xy|\le p$, $y$ can lie **anywhere** in $w$, not just in the first 0s.
- The adversary can choose $y=01$ (across the first two blocks) or $y=10$. Then $xy^iz$ has equal 0s and 1s for every $i$, so pumping never leaves the language. (A brute-force check confirms such surviving splits for $p=4$ and $p=8$.)

**Fix:** take $w=0^p1^p$, whose first $p$ symbols are all 0. Then $y=0^k$, and $xy^2z=0^{p+k}1^p$ is not in the language. So the language is not regular.

**(iii) $\{0^{2n}\}$.** This argument is wrong, and so is the conclusion: **the language is regular** (a 2-state DFA tracks the parity of the length; regular expression $(00)^*$).

The mistake is in **who picks the split**. The lemma says *some* split $xyz$ works; the prover must show that *every* legal split fails. BLP picked one convenient split ($y=0$) and showed it fails. But the split $y=00$ pumps fine: $xy^iz=0^{2p+2(i-1)}$ always has even length. A single failing split proves nothing.`,

  "1e": b22Solutions["3c"],

  /* ───── Q2 ───── */

  "2a": r`**Why it is surprising.** An NFA seems much more powerful than a DFA: it can be in many states at once, follow ε-moves, and "guess" the right path (for example, guess where the last three symbols begin). One would expect this guessing ability to let NFAs recognise more languages. It does not: **every NFA can be converted into a DFA** that accepts the same language, by the subset construction (each DFA state is the set of NFA states the NFA could be in). Nondeterminism gives no extra power here, only extra convenience. (The DFA may need exponentially more states: up to $2^n$ for an $n$-state NFA.)

**Why it is useful.**

- **Design with NFAs, run with DFAs.** NFAs are often far smaller and easier to design ("guess the position where ... starts"); the result can then be converted to a DFA, which is easy to implement (one table lookup per symbol).
- **Simpler proofs.** Closure of regular languages under union, concatenation and star is easy with NFAs (just add ε-moves). Because NFAs and DFAs are equivalent, the results hold for regular languages.
- **Regular expressions.** The conversion from a regular expression to an automaton naturally produces an NFA. The equivalence then shows regular expressions describe exactly the regular languages, and it is how tools like grep and lexers work.
- **Choice of tool.** Some properties are easier with DFAs (complement: swap the accepting states; minimisation; equivalence testing), others with NFAs. Equivalence lets us use whichever is convenient.`,

  "2b": r`Build the NFA bottom-up, one operator at a time (Sipser's basic principles).

**Step 1: single symbols.** For each symbol, a two-state NFA: start $\xrightarrow{\text{symbol}}$ accept.

**Step 2: $00$.** Concatenate the NFAs for 0 and 0: $q_1\xrightarrow{0}q_2\xrightarrow{\varepsilon}q_3\xrightarrow{0}q_4$.

**Step 3: $(00)^*$.** Add a new accepting start $q_5$ with $q_5\xrightarrow{\varepsilon}q_1$, and $q_4\xrightarrow{\varepsilon}q_1$ to repeat.

**Step 4: $11$.** $q_6\xrightarrow{1}q_7\xrightarrow{\varepsilon}q_8\xrightarrow{1}q_9$.

**Step 5: $(00)^*(11)$.** Concatenate: ε-moves from the accepting states of $(00)^*$ ($q_5$ and $q_4$) to $q_6$. Only $q_9$ accepts.

**Step 6: $01$.** $q_{10}\xrightarrow{0}q_{11}\xrightarrow{\varepsilon}q_{12}\xrightarrow{1}q_{13}$.

**Step 7: union.** A new start $q_{14}$ with ε-moves to $q_5$ and $q_{10}$; accepting: $q_9$, $q_{13}$.

**Step 8: star.** A new **accepting** start $q_{15}$ with $q_{15}\xrightarrow{\varepsilon}q_{14}$, and ε-moves from $q_9$ and $q_{13}$ back to $q_{14}$. Accepting: $q_{15}$, $q_9$, $q_{13}$.

${fig("b20-2b")}

**Check.** 0011 is accepted: $q_{15}\to q_{14}\to q_5\to q_1\xrightarrow{0}q_2\to q_3\xrightarrow{0}q_4\to q_6\xrightarrow{1}q_7\to q_8\xrightarrow{1}q_9$. 0101 is accepted through the 01 branch twice. 00 is rejected: after 00 the machine is in $q_4$ and must still read 11.

(The NFA was checked against the regular expression on every binary string up to length 10.)`,

  "2c": r`**i. $L_1^*\circ L_2^*$: infinite.** $L_1$ contains a nonempty string (a), so $L_1^*$ contains $a,aa,aaa,\dots$: infinitely many strings. $L_2^*$ contains $\varepsilon$, so $L_1^*\circ L_2^*\supseteq L_1^*\circ\{\varepsilon\}=L_1^*$, which is infinite.

**ii. $L_1\circ(L_1\cup L_2)$: finite.** $L_1$ has 3 strings and $L_1\cup L_2=\{a,aa,aaa,ab,aab,aabb\}$ has 6, so the concatenation has at most $3\times6=18$ strings. Some coincide (e.g. $a\cdot aa=aa\cdot a$), and it has exactly 12:
$$
\{${b20concat.join(",\\ ")}\}.
$$
In general, a concatenation of two finite languages is finite.

**iii. $L_2\circ L_3$: infinite.** $L_3$ is infinite ($\varepsilon, bbb, b^6, \dots$, and any number of a's), and $L_2$ is nonempty. Fixing $x=a\in L_2$, the strings $a\,y$ for $y\in L_3$ are all different, so the concatenation is infinite.

(If the dots in (i) were not stars, $L_1\circ L_2$ would be a concatenation of two finite languages and therefore finite.)`,

  "2d": r`**Design idea.** $i\ne j+k$ means either $i>j+k$ or $i<j+k$. Build a grammar for each case and take the union.

The key picture is $i=j+k$: the a's at the front are matched against the c's at the **end** (outermost) and then the b's (inside):
$$
a^ib^jc^k=a^k\,\big(a^{\,i-k}b^j\big)\,c^k.
$$
So the grammar wraps a's around c's first, then a's around b's, and finally puts the **excess** in the middle.

- **$i>j+k$ (variable $X$):** after matching every c and every b, at least one a is left over. $X\to aXc$ matches a with c; $P\to aPb$ matches a with b; $E\to aE\mid a$ produces the one or more extra a's in the middle.
- **$i<j+k$ (variable $Y$):** after matching a's with c's, either
  - c's remain (some b's and at least one c): $Q$ produces $b^*c^+$; or
  - all c's are used, and the remaining a's are fewer than the b's: $R\to aRb$ matches a with b, and $D\to bD\mid b$ produces the one or more extra b's.

**Grammar.**
${grammarTex(b20g2d)}

**Why it is correct.** Every derivation from $X$ gives $a^{k}a^{m}a^{e}b^{m}c^{k}$ with $e\ge1$, so $i=k+m+e>m+k=j+k$. Every derivation from $Y$ gives either $a^kb^jc^{t}c^k$ with $t\ge1$ (so $j+k+t>k=i$) or $a^ka^mb^mb^dc^k$ with $d\ge1$ (so $j+k=m+d+k>m+k=i$). Conversely any string with $i>j+k$ or $i<j+k$ falls into one of the shapes above.

Example: $aab$ has $i=2>1=j+k$:
${derivation(b20g2d, "aab", "lm")}

(The grammar was checked against $i\ne j+k$ on every string over $\{a,b,c\}$ up to length 8.)`,

  /* ───── Q3 ───── */

  "3a": b21Solutions["3c"],

  "3b": r`**Idea.** "At least two 0s" and "exactly two 1s" are easy separately, so build an NFA for each and let the start state **guess** which one to check, with ε-moves (the union construction).

${fig("b20-3b")}

- **Top branch (at least two 0s):** $a_0,a_1,a_2$ count the 0s seen (capped at 2); 1s loop. $a_2$ accepts and loops on everything.
- **Bottom branch (exactly two 1s):** $b_0,b_1,b_2$ count the 1s; 0s loop. $b_2$ accepts; it has no move on 1, so a third 1 kills this branch.

**Traces** (sets of current states).

0101 (two 0s, also two 1s): accepted
${faRunTex(b20q3b, "0101", { name: sub })}
1011 (one 0, three 1s): rejected
${faRunTex(b20q3b, "1011", { name: sub })}

(Checked against the definition on every binary string up to length 10.)`,

  "3c": r`**Assumption.** The printed table does not mark start or accepting states. As in the textbook version of this NFA, take **$q_1$ as the start** and **$q_2$ as the only accepting state**. (With other accepting states the DFA's transitions below are unchanged; only which sets are accepting changes.)

**ε-closures.**

${closureTableMd(b20q3cNfa)}

**Subset construction** (start state $E(\{q_1\})=\{q_1,q_2\}$; each entry is the ε-closure of the states reached):

${subsetTableMd(b20q3cNfa, false)}

${fig("b20-3c")}

A DFA state is accepting when its set contains $q_2$: $\{q_1,q_2\}$, $\{q_1,q_2,q_3\}$ and $\{q_2,q_3\}$. $\emptyset$ is a dead state. Only four of the eight subsets are reachable.

(The DFA was checked against the NFA on every string up to length 10.)`,

  "3d": r`**The language:** strings that contain 00 somewhere **and** 11 somewhere, in either order. **Answer: B.**

**B. $(0+1)^*(00(0+1)^*11+11(0+1)^*00)(0+1)^*$: correct.** Every generated string contains 00 and 11 (the middle part has both). Conversely, if a string contains both, look at the first occurrence of each. Either 00 comes before 11 or 11 comes before 00 (they cannot overlap, as 00 and 11 share no symbol). In the first case write the string as $u\,00\,v\,11\,x$, which matches the first alternative; otherwise it matches the second.

**A: wrong.** It only allows 00 and 11 **adjacent**, as 0011 or 1100. It misses 001011, which contains 00 and 11 separated by 01.

**C: wrong.** It is "contains 00 **or** contains 11" (a union of two languages). It accepts 00, which has no 11.

**D: wrong.** It forces the string to **start** with one pair and **end** with the other. It misses 10011, which has 00 and 11 but starts with a single 1.

(B was checked against the definition on every binary string up to length 11, and each counterexample above was confirmed by machine.)`,

  /* ───── Q4 ───── */

  "4a": r`The pumping lemma states a property that **every regular language has**:
$$
L \text{ regular} \implies L \text{ satisfies the pumping condition}.
$$
It is a **necessary** condition, not a **sufficient** one.

- **Negative use (valid):** if a language does *not* satisfy the condition, it cannot be regular. This is the contrapositive, and it is how all pumping proofs work.
- **Positive use (invalid):** showing that a language *does* satisfy the condition proves nothing: the converse is false. Some non-regular languages pump perfectly well.

**Example (Sipser).** $F=\{a^ib^jc^k \mid i,j,k\ge0, \text{ and if } i=1 \text{ then } j=k\}$ is not regular, yet it satisfies the pumping lemma with $p=2$:

- if $i=0$ or $i\ge3$, pump the first symbol (keeping the number of a's $\ne1$; with $i=2$ use $y=aa$);
- if $i=1$, take $y=a$: removing or repeating it gives $i=0$ or $i\ge2$, where $j,k$ are unrestricted.

(Checked by brute force: every member of $F$ up to length 9 has a pumpable split with $p=2$.)

So to prove regularity you must instead **construct** a DFA, NFA or regular expression, or use closure properties. The lemma can only ever show that something is **not** regular.`,

  "4b": r`This is the union construction for NFAs: $Q=\{q_0\}\cup Q_1\cup Q_2$, with a **new** state $q_0$.

**i. The start state.** A new state $q_0$, not in $Q_1$ or $Q_2$. **Reason:** $N$ must accept $w$ if *either* $N_1$ or $N_2$ accepts it, and it cannot know in advance which. Starting in a fresh state that can branch to both starts lets $N$ run both machines in parallel. Using $q_1$ or $q_2$ as the start would favour one machine, and their own incoming transitions could mix the two runs.

**ii. The accept states.** $F=F_1\cup F_2$. **Reason:** $w\in L_1\cup L_2$ iff $w$ leads $N_1$ to an accepting state of $N_1$ or leads $N_2$ to one of $N_2$. Since the two state sets are disjoint and $N$ runs both, a branch ends in $F_1$ exactly when $N_1$ accepts, and in $F_2$ exactly when $N_2$ accepts. ($q_0$ is not accepting: if $\varepsilon\in L_1\cup L_2$, that is handled by the ε-moves to $q_1$ or $q_2$, which then lie in $F_1$ or $F_2$.)

**iii. Transitions from $q_0$.** For each $a\in\Sigma_\varepsilon=\Sigma\cup\{\varepsilon\}$ two cases arise:

- **$a=\varepsilon$:** $\delta(q_0,\varepsilon)=\{q_1,q_2\}$. These are the moves that start both machines, without reading input, so the input is read in full by each machine.
- **$a\in\Sigma$:** $\delta(q_0,a)=\emptyset$. $q_0$ must not consume any input itself; otherwise the first symbol would be lost to both machines.

All other transitions are copied: for $q\in Q_1$, $\delta(q,a)=\delta_1(q,a)$; for $q\in Q_2$, $\delta(q,a)=\delta_2(q,a)$.`,

  "4c": r`Both grammars are flawed. The target is $L=\{a^ib^jc^k \mid i=j \text{ or } j=k\}$ (in particular every string is of the form $a^*b^*c^*$).

**(i) $S\to aSb\mid bSc\mid aS\mid Sc\mid\varepsilon$.**

- **Wrong order of symbols.** $S\Rightarrow aSb\Rightarrow abScb\Rightarrow abcb$: the rules $aSb$ and $bSc$ can nest inside each other, so b's appear after c's. abcb is not even of the form $a^*b^*c^*$.
- **No link between the counts.** $aS$ and $Sc$ add a's and c's freely, independently of everything else. For example $S\Rightarrow aS\Rightarrow aSc\Rightarrow ac$ gives $i=1$, $j=0$, $k=1$: neither $i=j$ nor $j=k$. Similarly aac, aab are generated.

So (i) generates many strings outside $L$ (it does generate every string of $L$).

**(ii)**

- **Wrong order again.** $S_1\to aS_1bS_2c$ puts a full copy of $S_1$ (with its own c's) **before** a b. $S_1\Rightarrow aS_1bS_2c\Rightarrow a(abc)bc$ gives aabcbc, not in $L$.
- **The counts are wrong.** $S_1$ is meant to give $i=j$ with any number of c's, but every application of $aS_1bS_2c$ adds at least one c, so the c's are tied to the a's; and $S_1$ cannot produce any string with c's alone. $S_3$ is meant to give $j=k$ with any number of a's, but $S_4$ (the a's) is nested inside, before each b.
- **It misses strings of $L$.** For example c ($i=j=0$), bc ($j=k=1$) and ab ($i=j=1$, $k=0$) are in $L$ but cannot be generated.

**A correct grammar** (one branch for each equality):
$$
\begin{aligned}
S&\to S_1\mid S_2 && S_1\to AC,\ A\to aAb\mid\varepsilon,\ C\to cC\mid\varepsilon \quad (i=j)\\
&&& S_2\to DE,\ D\to aD\mid\varepsilon,\ E\to bEc\mid\varepsilon \quad (j=k)
\end{aligned}
$$

(All the strings quoted above were checked by machine against both grammars.)`,

  "4d": r`Recall: a **string** is ambiguous (in a grammar) if it has two or more parse trees; a **grammar** is ambiguous if at least one string has two or more parse trees; a **language** is inherently ambiguous if every grammar for it is ambiguous.

**i. One tree for $s$, several for some other strings.** $s$ is **unambiguous** in this grammar, but the **grammar is ambiguous**, because ambiguity of a grammar needs only one ambiguous string. Example: $E\to E+E\mid a$; $s=a+a$ has one tree but $a+a+a$ has two. (Nothing follows about the language: an unambiguous grammar may exist.)

**ii. One tree for $s$ and for every other string.** Both $s$ and the **grammar are unambiguous**. Moreover the **language is not inherently ambiguous**, since this grammar is an unambiguous grammar for it.

**iii. More than one leftmost derivation for $s$.** Leftmost derivations correspond one-to-one with parse trees, so $s$ has **more than one parse tree**: $s$ is **ambiguous** and therefore the **grammar is ambiguous**. Whether the *language* is inherently ambiguous cannot be decided from this alone: another grammar might generate the same language unambiguously (as $E\to E+T\mid T$, $T\to a$ does for $E\to E+E\mid a$).`,

  /* ───────────── Section B ───────────── */

  "5": r`Follow the order: remove ε-productions, then unit productions, then useless symbols, then put the bodies in CNF.

**Original grammar.**
${grammarTex(b20g5)}

**Step 1: ε-productions.** The nullable variables are: ${b20g5Eps.nullable.join(", ")} ($A\to\varepsilon$). $S$ and $B$ are not nullable, so $\varepsilon\notin L$ and no $S\to\varepsilon$ is needed. Replace each body by every version with some nullable occurrences dropped (but never the empty body):

- $S\to A1A$ gives $A1A$, $1A$, $A1$, $1$;
- $A\to0A$ gives $0A$, $0$; $A\to1A$ gives $1A$, $1$.

${grammarTex(b20g5Eps.grammar)}

**Step 2: unit productions.** The only unit production is $S\to B$. The unit pairs are $(S,S)$, $(S,B)$, $(A,A)$, $(B,B)$. For $(S,B)$, copy $B$'s non-unit bodies to $S$: $S\to1$ (already present).

${grammarTex(b20g5Unit.grammar)}

**Step 3: useless symbols.** Every variable generates a terminal string, but $B$ is now **unreachable** from $S$, so remove it.

${grammarTex(b20g5Useless.grammar)}

**Step 4: terminals in long bodies.** Introduce $Z\to0$ and $O\to1$ and use them wherever a terminal appears in a body of length $\ge2$:

${grammarTex(b20g5Cnf.afterTerminals)}

**Step 5: break bodies longer than 2.** $S\to AOA$ becomes $S\to AC_1$, $C_1\to OA$.

**Final grammar in CNF:**
${grammarTex(b20g5Cnf.grammar)}

Every rule is now $X\to YZ$ or $X\to a$. (Every intermediate grammar was checked to generate the same language as the original, the binary strings containing a 1, on all strings up to length 8.)`,

  "6": r`**Ambiguous grammar.** A CFG is ambiguous if some string in its language has **two or more different parse trees** (equivalently, two leftmost derivations, or two rightmost derivations).

**Inherently ambiguous language.** A CFL is inherently ambiguous if **every** grammar that generates it is ambiguous. Ambiguity of a grammar can often be removed by rewriting it (as with arithmetic expressions); for an inherently ambiguous language it never can. Example: $\{a^ib^jc^k \mid i=j \text{ or } j=k\}$.

**The given grammar is ambiguous.**

What it generates:

- $A\to aAb\mid ab$ gives $a^nb^n$ ($n\ge1$); $B\to cB\mid c$ gives $c^m$ ($m\ge1$). So $S\to AB$ gives $a^nb^nc^m$.
- $C\to aCc\mid aDc$ wraps matching a's and c's around $D$, and $D\to bD\mid b$ gives $b^m$. So $S\to C$ gives $a^nb^mc^n$.

So $L(G)=\{a^ib^jc^k \mid i,j,k\ge1,\ i=j \text{ or } i=k\}$. A string with $i=j=k$, such as abc, belongs to both parts and gets one parse tree from each:

${fig("b20-6")}

Leftmost derivation through $S\to AB$:
${derivation(b20g6, "abc", "lm", (t) => rootBody(t) === "AB")}
Leftmost derivation through $S\to C$:
${derivation(b20g6, "abc", "lm", (t) => rootBody(t) === "C")}

Two different parse trees for abc, so the grammar is **ambiguous**. (In fact the language is inherently ambiguous: every grammar for it must treat strings $a^nb^nc^n$ in two ways.)`,

  "7": r`**Idea.** A legal expression alternates **operands** and **operators**, starts and ends with an operand, and has balanced parentheses. The finite control tracks what may come next; the stack matches parentheses.

- In $q_e$ an **operand is expected**: an a completes an operand (go to $q_o$); a "(" opens a subexpression (push it, stay in $q_e$, since an operand is still expected inside).
- In $q_o$ an **operand has just ended**: + or * must be followed by another operand (go to $q_e$); ")" closes a subexpression and must match a "(" on the stack (pop it, stay in $q_o$: the parenthesised group is itself an operand).
- Accept in $q_o$ when only the bottom marker \$ is on the stack (all parentheses closed).

${fig("b20-7")}

Labels are *input, pop $\to$ push*. Why each bad example fails:

- aa*a: after a, the machine is in $q_o$, which has no move on a.
- a++a: after +, it is in $q_e$, which has no move on +.
- +a: $q_e$ has no move on +.
- (a+a)): the second ")" finds \$ on top, not "(".

**Accepting traces.** a+a*a:
${pdaTrace("a+a*a")}

(a+a)*a:
${pdaTrace("(a+a)*a")}

(The PDA was checked against the expression grammar $E\to E+T\mid T$, $T\to T*F\mid F$, $F\to(E)\mid a$ on every string over $\{a,+,*,(,)\}$ up to length 7.)`,

  "8": b22Solutions["7"],

  "9": r`**Idea.**

1. Look at the MSB. If it is 0, halt: the number stays as it is.
2. If it is 1, mark it ($1\to*1$) so the machine can recognise the left end later, and run right to the end of the number.
3. From the LSB, move left **copying 0s** (leaving them unchanged) until the first 1, which is also left unchanged.
4. Then move left **flipping** every bit, until the marked MSB is reached.
5. Restore the MSB to 1 and halt. If no 1 is found in step 3 (the magnitude is all 0s), the number is unchanged.

| State | Meaning |
|---|---|
| $q_0$ | at the MSB |
| $q_1$ | moving right to the end |
| $q_2$ | copying 0s from the LSB, looking for the first 1 |
| $q_3$ | flipping the remaining magnitude bits |
| $q_f$ | halt |

**Transition table** (a "–" means no move):

${tmTableMd(b20tm)}

**Trace on 1011** ($-3$ in signed magnitude; two's complement 1101):
${tmTraceTex(b20tm, "1011")}

**Trace on 1100** (copy the two 0s and the first 1, then nothing is left to flip: 1100):
${tmTraceTex(b20tm, "1100")}

**Trace on 0110** (positive, unchanged):
${tmTraceTex(b20tm, "0110")}

The machine uses **storage in the state** (which phase it is in) and a **second track** for the mark on the MSB. (Checked on every binary input of length 1 to 10: the tape always ends holding exactly the expected result.)`,

  "10": r`**(i) True.** A one-tape TM $N$ with $2k$ tracks simulates a $k$-tape TM $M$:

- tracks $2,4,\dots,2k$ hold the contents of $M$'s $k$ tapes;
- tracks $1,3,\dots,2k-1$ each hold a single marker X showing where the corresponding head is.

To simulate one move of $M$, $N$ sweeps across its tape, visiting every head marker and storing the scanned symbols **in its finite control** (with $M$'s state and a count of markers passed). It then knows $M$'s move. It sweeps back, updating the symbol under each marker and moving each marker one cell left or right as $M$'s head moves, and finally updates $M$'s state stored in its control. $N$ accepts exactly when $M$ does, so $L(N)=L(M)$.

The simulation is also efficient: after $n$ moves the markers are at most $2n$ cells apart, so each move of $M$ costs $O(n)$ moves of $N$, and $n$ moves cost $O(n^2)$.

${after(b21Solutions["11"], "**(ii)")}`,

  "11": r`**(i) The diagonalization language.** List the binary strings $w_1,w_2,\dots$ and let $M_i$ be the TM whose binary code is $w_i$. Then
$$
L_d=\{w_i \mid w_i\notin L(M_i)\}:
$$
the codes of machines that do **not** accept their own code. Looking at the table "does $M_i$ accept $w_j$?", $L_d$ is the complement of the diagonal. $L_d$ is **not RE**: if $L_d=L(M_i)$, then $w_i\in L_d$ iff $w_i\notin L(M_i)=L_d$, a contradiction.

**(ii) The universal language.**
$$
L_u=\{(M,w) \mid M \text{ is a TM that accepts } w\},
$$
encoded as the binary string $\text{code}(M)111w$. $L_u$ is **RE**: the universal TM $U$ simulates $M$ on $w$ and accepts if $M$ accepts. But $L_u$ is **not recursive**: if it were, its complement would be recursive too, and $L_d$ would reduce to that complement (on input $w_i$, ask whether $(M_i,w_i)\notin L_u$), making $L_d$ recursive, which it is not.

${after(b22Solutions["11"], "**The halting problem is not recursive.**")}`,

  "12i": b21Solutions["13i"],

  "12ii": r`**Definitions.** A language $L$ is **NP-complete** if (1) $L\in$ NP and (2) every language $L'\in$ NP reduces to $L$ in polynomial time: there is a polynomial-time computable function $f$ with $w\in L' \iff f(w)\in L$.

**Claim.** If some NP-complete language $L$ has a polynomial-time algorithm, then P = NP.

**Proof.** P ⊆ NP always holds, so we show NP ⊆ P. Let $L'$ be any language in NP, and let $A$ be the polynomial-time algorithm for $L$, running in time $q(m)$ on inputs of length $m$.

1. Since $L$ is NP-complete, there is a reduction $f$ from $L'$ to $L$, computable in time $p(n)$ for some polynomial $p$.
2. To decide whether $w\in L'$ (with $|w|=n$): compute $f(w)$, then run $A$ on $f(w)$, and answer as $A$ does. This is correct because $w\in L' \iff f(w)\in L$.
3. **Time:** computing $f(w)$ takes $p(n)$ steps, so $|f(w)|\le p(n)$ (a machine writes at most one symbol per step). Running $A$ then takes at most $q(p(n))$ steps. The total $p(n)+q(p(n))$ is a polynomial, since a polynomial of a polynomial is a polynomial.

So $L'\in$ P. As $L'$ was an arbitrary NP language, NP ⊆ P, and hence **P = NP**. $\blacksquare$

This is why NP-complete problems are "the hardest in NP": one fast algorithm for any of them would give fast algorithms for all of NP. Since none has been found for decades, it is widely believed that P ≠ NP.`,

  "13": r`**i) P and NP: P ⊆ NP, believed proper (P ≠ NP).**

- P ⊆ NP: a deterministic polynomial-time TM is a nondeterministic one that never uses its choices.
- Whether P = NP is open. It is widely believed that P ≠ NP: NP contains the NP-complete problems (SAT, TSP, clique, …), and no polynomial algorithm is known for any of them despite enormous effort. If any one had a polynomial algorithm, all of NP would be in P.

**ii) P and PSPACE: P ⊆ PSPACE, believed proper.**

- A TM running in polynomial time $p(n)$ can visit at most $p(n)+1$ cells, so it uses polynomial space. Hence P ⊆ PSPACE (and in fact NP ⊆ PSPACE as well: try each nondeterministic branch in turn, reusing the same space).
- Space can be reused but time cannot, so PSPACE seems much larger: a polynomial-space machine may run for exponentially many steps. It is believed that P ≠ PSPACE (PSPACE-complete problems such as QBF are thought not to be in P), but this is not proved.

**iii) PSPACE and NPSPACE: equal (proved, not just believed).**

${b22Solutions["12ii"]}

**Summary:** P ⊆ NP ⊆ PSPACE = NPSPACE, with both inclusions believed to be proper.`,
}

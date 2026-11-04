/* Worked solutions for the 21-batch (2022-2023) paper, keyed by part ("1a", "5", "13i"). */
import { faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd, grammarTex } from "@/lib/cnf"
import { derivation, rootBody } from "@/lib/derivations"
import {
  b21alt,
  b21f1,
  b21f2,
  b21f3,
  b21f4,
  b21f5,
  b21g6,
  b21g7,
  b21odd,
  b21paren,
  b21pda,
  b21runs,
  b21sum,
  b21tmNot,
  b21two1,
  b21union,
} from "../machines/b21"
import { b22Solutions } from "./b22-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2").replace(/^([qf])([ab])$/, "$1_$2")
const pairName = (q: string) => q.replace(/([sq])(\d)/g, "$1_$2")
const pdaName = (q: string) => (q === "qs" ? "q_s" : q === "qacc" ? "q_{acc}" : q.length === 2 && q !== "qs" ? `${q[0]}_${q[1]}` : q)
const pdaTrace = (w: string) => pdaTraceTex(pdaAcceptingTrace(b21pda, w)!, pdaName)
const tmName = (q: string) => (q.includes(",") ? `[q_1,${q.split(",")[1]}]` : q === "u" ? "u" : q === "qf" ? "q_f" : `q_${q.slice(1)}`)

export const b21Solutions: Record<string, string> = {
  /* ───────────── Section A ───────────── */

  "1a": r`**Asymmetric (public-key) cryptography.** Each party has a **key pair**:

- a **public key**, published to everyone;
- a **private key**, kept secret by its owner.

The two keys are mathematically linked, but knowing the public key does not (as far as anyone knows) let you compute the private key in reasonable time.

**How they work together.** Suppose Alice wants to talk to Bob.

1. **Confidentiality.** Alice encrypts her message with **Bob's public key**. Only **Bob's private key** can decrypt it, so an eavesdropper who sees the ciphertext and the public key learns nothing useful.
2. **Authentication and integrity (digital signatures).** Alice signs a message (in practice, a hash of it) with **her private key**. Anyone can check the signature with **her public key**; a forger without her private key cannot produce a valid signature, and changing the message breaks it.
3. **Key exchange.** Public-key operations are slow, so in practice they are used to agree on a shared secret key (as in TLS), and the bulk data is then encrypted with a fast symmetric cipher.

Example (RSA): Bob picks large primes $p,q$, publishes $N=pq$ and an exponent $e$, and keeps $d$ with $ed\equiv1 \pmod{(p-1)(q-1)}$. Encryption is $c=m^e \bmod N$, decryption $m=c^d \bmod N$. Computing $d$ from $(N,e)$ is as hard as factoring $N$, as far as is known.

**The role of the Theory of Computation.**

- **Complexity theory says what "hard" means.** Security is the claim that every *efficient* (polynomial-time) attacker fails. Complexity theory defines efficient computation (the class P) and gives the language to state such claims precisely.
- **Security rests on unproven hardness assumptions.** Breaking RSA would follow from factoring quickly; breaking Diffie–Hellman from computing discrete logarithms quickly. These problems are in NP (a proposed answer is easy to check), but no polynomial algorithm is known. If **P = NP**, one-way functions could not exist and essentially all public-key cryptography would be broken. So the P versus NP question, from this course, sits under every secure web connection.
- **Reductions give the proofs.** A security proof is a reduction: "if an attacker could break the scheme, we could use it to solve the hard problem". This is the same technique used to prove NP-completeness and undecidability.
- **Trapdoors.** The private key is a *trapdoor*: extra information that turns a hard problem (inverting $m\mapsto m^e$) into an easy one. Complexity theory explains why the legitimate user's job is easy and the attacker's is hard.
- **Models of computation matter.** Shor's algorithm factors in polynomial time on a quantum computer, so RSA's security depends on which model of computation the attacker has.

So the keys provide the mechanism, and the Theory of Computation provides the reason to trust it: the asymmetry between the easy task (encrypting, decrypting with the key) and the hard task (decrypting without it).`,

  "1b": r`**The claim is wrong: two states are not enough. Three states are necessary.**

**The correct 3-state DFA.** State $r_i$ means "the sum so far is $\equiv i \pmod 3$".

${fig("b21-1b")}

${faTableMd(b21sum, { label: sub })}

**Where the 2-state design breaks.** Null Pointer's states are $Z$ (remainder 0) and $N$ (remainder nonzero). Consider reading 1 in state $N$:

- after input 1 (remainder 1), reading 1 gives remainder 2: we must **stay in $N$**;
- after input 2 (remainder 2), reading 1 gives remainder 0: we must **go to $Z$**.

Both strings 1 and 2 lead to $N$, and a DFA has exactly one move from $N$ on 1. So whichever move we choose, one of 11 (sum 2, reject) and 21 (sum 3, accept) is handled wrongly. Merging remainders 1 and 2 throws away information the machine needs later.

**No 2-state DFA can work, whatever it looks like.** Take the three strings $\varepsilon$, 1 and 2. Any DFA with only two states ends in the same state on two of them. Then it must treat every continuation of those two the same way. But each pair can be told apart:

| Pair | Suffix | Results |
|---|---|---|
| $\varepsilon$, 1 | $\varepsilon$ | $\varepsilon$: sum 0, accept; 1: sum 1, reject |
| $\varepsilon$, 2 | $\varepsilon$ | $\varepsilon$: accept; 2: reject |
| 1, 2 | 2 | 12: sum 3, accept; 22: sum 4, reject |

So the three strings need three different states, and **3 is the minimum**. (A brute-force search over all 1024 two-state DFAs on $\{R,0,1,2\}$ confirms that none agrees with the language even on all strings up to length 5.)

**What the two-state machine *can* do.** It could track "sum $\equiv0$" correctly only if the input never needed to tell remainder 1 from 2, for example if the only digits were 0 and 3. With digits 1 and 2, the two nonzero remainders behave differently and must be separate states.`,

  "1c": r`**Idea.** A string with neither aa nor bb **alternates**: every symbol differs from the one before it. So the DFA only needs to remember the last symbol.

| State | Remembers |
|---|---|
| $q_0$ | nothing read yet (start) |
| $q_a$ | last symbol a, no aa or bb so far |
| $q_b$ | last symbol b, no aa or bb so far |
| $d$ | aa or bb has appeared (dead) |

All states except $d$ are accepting ($\varepsilon$, a, b, ab, ba, … are all in the language).

${fig("b21-1c")}

**Transition table** ($\to$ start, $*$ accepting):

${faTableMd(b21alt, { label: sub })}

**Traces.** abab (accepted):
${faRunTex(b21alt, "abab", { name: sub })}
abba (rejected, contains bb):
${faRunTex(b21alt, "abba", { name: sub })}

So the language is $(\varepsilon+b)(ab)^*(\varepsilon+a)$: the alternating strings.`,

  /* ───── Q2 ───── */

  "2a": r`States are named as in the redrawn figures; $d$ is a dead (trap) state in each.

**(i) $L=(ab)^*a$: alternating a's and b's that start and end with a** (a, aba, ababa, …).

From $s$, a goes to the accepting state $t$; from $t$, b returns to $s$. Any other move (b from $s$, a from $t$ and everything from $r$) ends in the trap $d$.

${faRunTex(b21f1, "ababa")}
${faRunTex(b21f1, "abaa")}

**(ii) $L=a^*b$: any number of a's (possibly none) followed by exactly one b** (b, ab, aab, …).

The upper path reads $a^+$ (looping) then b; the lower path reads just b. Both end in accepting states with every move leading to the trap, so nothing may follow the b.

${faRunTex(b21f2, "aab")}
${faRunTex(b21f2, "abb")}

**(iii) $L=(a(ab)^*b)^*$: equal numbers of a's and b's, where in every prefix the a's lead the b's by 0, 1 or 2.**

Think of a as "+1" and b as "−1". The states $s$, $m$, $r$ are heights 0, 1, 2. The walk must never go below 0 or above 2 (those moves go to the trap), and must end at height 0 to accept. For example ab, aabb, aababb are in; ba (goes below 0), aaab (goes above 2) and aab (ends at height 1) are not.

${faRunTex(b21f3, "aababb")}
${faRunTex(b21f3, "aaab")}

**(iv) $L=(ab+ba)^*$: strings made of the blocks ab and ba** (ε, ab, ba, abba, baab, …). Equivalently: even length, and in each consecutive pair of positions (1–2, 3–4, …) the two symbols differ.

From the accepting start state, a goes right and must be answered by b; b goes left and must be answered by a. Either way the machine returns to the start after each block, and a repeated symbol within a block leads to the trap.

${faRunTex(b21f4, "abba")}
${faRunTex(b21f4, "aabb")}

**(v) $L$ = strings that contain aab or bba as a substring.** Equivalently: some symbol is repeated and then followed by the other symbol.

| State | Remembers |
|---|---|
| $q_0$ | nothing read yet |
| $q_1$ / $q_2$ | no repeat yet; last symbol a / b |
| $q_3$ | just read a run aa (or longer) |
| $q_4$ | just read a run bb (or longer) |
| $q_5$ | aab or bba has occurred (accepting, loops on everything) |

$q_3$ needs a b to finish aab, and keeps waiting on more a's; $q_4$ needs an a to finish bba. Strings such as aa, bbb, abab are rejected.

${faRunTex(b21f5, "abaab")}
${faRunTex(b21f5, "babaa")}

All five descriptions were checked by machine against the transcribed automata on every string up to length 10 or 12.`,

  "2b": r`**The lemma's requirement.** $p$ is a pumping length for $L$ if every $s\in L$ with $|s|\ge p$ can be written $s=xyz$ with $|y|\ge1$, $|xy|\le p$ and $xy^iz\in L$ for **every** $i\ge0$.

**What a split can look like.** Every string of $L$ is unary: $a^n$ with $n=2,5,8,\dots$ or $b^n$ with $n=10,22,34,\dots$. So $y=a^j$ (or $b^j$), and pumping changes only the length: $|xy^iz|=n+(i-1)j$.

- **For $a^n$:** $i=2$ needs $n+j\equiv2 \pmod 3$, so $j$ is a multiple of 3. $i=0$ needs $n-j\ge2$. With $j=3$ both hold whenever $n\ge5$, and then every $i$ works.
- **For $b^n$:** $j$ must be a multiple of **12**, and $i=0$ needs $n-j\ge10$, so $n\ge22$. With $j=12$ every $i$ works.

In particular **$b^{10}$ cannot be pumped at all** (the only usable $j$ is 12 or more, which is longer than the string), and **$b^{22}$ can be pumped only with $|y|=12$**, which needs $|xy|\ge12$.

**p = 3, 5, 9: not pumping lengths.** In each case $b^{10}\in L$ and $|b^{10}|=10\ge p$, so the lemma would have to pump it, and no split can. ✗

**p = 24: a pumping length.** Take any $s\in L$ with $|s|\ge24$.

- $s=a^n$ ($n\ge26$): $x=\varepsilon$, $y=aaa$, $z=a^{n-3}$; $|xy|=3\le24$ and $xy^iz=a^{n+3(i-1)}\in L$ for all $i$ (since $n-3\ge2$).
- $s=b^n$ ($n\ge34$): $x=\varepsilon$, $y=b^{12}$, $z=b^{n-12}$; $|xy|=12\le24$ and $xy^iz=b^{n+12(i-1)}\in L$ for all $i$ (since $n-12\ge10$). ✓

**The minimum pumping length is 12.**

- **$p\le10$ fails:** $b^{10}$ has length $\ge p$ and cannot be pumped.
- **$p=11$ fails:** $b^{10}$ is now exempt, but $b^{22}$ has length $22\ge11$, and the only usable $y$ is $b^{12}$, which does not fit in $|xy|\le11$.
- **$p=12$ works:** the members of length $\ge12$ are $a^n$ with $n\ge14$ and $b^n$ with $n\ge22$. Use $y=aaa$ and $y=b^{12}$ as above; $|xy|\le12$ in both cases.

So 3, 5 and 9 are not pumping lengths, 24 is, and every $p\ge12$ is (the same splits work), with **12 the smallest**.

(Checked by brute force: for each $p=1,\dots,30$, every member up to length 90 and every legal split was tried with $i=0,\dots,6$. Exactly $p=12,\dots,30$ pass.)`,

  /* ───── Q3 ───── */

  "3a": r`**Design idea.** Read the string left to right. A run of 0s ends at a 1 or at the end of the input. A run is bad only if, when it ends, its length is even. So the DFA needs to know:

- whether it is inside a run of 0s, and if so the **parity** of the run's length so far;
- whether a bad run has already ended (then reject for good).

The parity flips with each 0, and the run is judged when it ends:

| State | Remembers | Accepting? |
|---|---|---|
| $s$ | not inside a run (start, or the last symbol was 1) | yes |
| $o$ | inside a run of odd length so far | yes (ending here leaves an odd run) |
| $e$ | inside a run of even length $\ge2$ so far | no (ending here leaves an even run) |
| $d$ | an even run has been ended by a 1 | no (dead) |

From $e$, a 0 makes the run odd again, so $e$ is **not** dead; only a 1 seals the even run.

${fig("b21-3a")}

${faTableMd(b21runs)}

**Traces on the examples from the question.**

0001100 (rejected: the last run, 00, is even and ends with the input):
${faRunTex(b21runs, "0001100")}
01110001 (accepted: runs of length 1 and 3):
${faRunTex(b21runs, "01110001")}
000010 (rejected: the run 0000 is ended by a 1):
${faRunTex(b21runs, "000010")}
11111 (accepted: no run of 0s):
${faRunTex(b21runs, "11111")}`,

  "3b": r`**No.** Swapping accepting and non-accepting states complements an NFA's language only in special cases; in general it fails.

**Why it works for a DFA.** A DFA has exactly **one** run on each input $w$, ending in one state $q$. Swapping makes $w$ accepted exactly when $q$ was not accepting, i.e. when $w\notin L$.

**Why it fails for an NFA.** An NFA accepts $w$ if **some** branch ends in an accepting state. After swapping, it accepts if some branch ends in a state that was **non-accepting**. The complement needs "**every** branch ends in a non-accepting state", which is a different condition. A string can have one accepting branch and one rejecting branch, and then it is accepted both before and after the swap. (Also, branches that die midway leave no state at all to swap.)

**Example.** $N$ accepts the binary strings that contain a 1:

${fig("cl-swap-nfa")}

- $N$: $q_0$ loops on 0 and 1; $q_0\xrightarrow{1}q_1$; $q_1$ loops on 0 and 1; $q_1$ is accepting.
- Complement: $\overline{L(N)}=0^*$ (no 1 at all).
- After the swap, $q_0$ is accepting. On input 1, the branch that loops at $q_0$ ends in $q_0$, which now accepts. So the swapped NFA **accepts 1**, but $1\notin0^*$. In fact it accepts **every** string, because the $q_0$ loop is always available.

**The correct method:** convert the NFA to a DFA by the subset construction first, then swap. In the subset DFA, a state is accepting iff the set contains an accepting NFA state, so swapping gives "no branch accepts", which is exactly the complement.`,

  "3c": r`**Definition of star.** For any language $A$,
$$
A^*=\bigcup_{k\ge0}A^k=A^0\cup A^1\cup A^2\cup\cdots,
$$
where $A^k$ is the concatenation of $k$ strings from $A$, and $A^0=\{\varepsilon\}$ **by definition**: concatenating zero strings gives the empty string.

**Apply it to $A=\emptyset$.**

- $\emptyset^0=\{\varepsilon\}$.
- For $k\ge1$, $\emptyset^k=\emptyset$: to form a concatenation of $k\ge1$ strings you must pick at least one string from $\emptyset$, and there is none. ($L\emptyset=\{xy \mid x\in L, y\in\emptyset\}=\emptyset$.)

So
$$
\emptyset^*=\{\varepsilon\}\cup\emptyset\cup\emptyset\cup\cdots=\{\varepsilon\}.
$$

**Why it must be so.** "Choose any number of pieces from $A$, including zero, and join them." With $A$ empty you can still choose zero pieces, and that produces $\varepsilon$. Every star language contains $\varepsilon$, even when $A$ has nothing in it.

**The same answer from the star construction.** The NFA for $\emptyset$ is one non-accepting state with no moves. The star construction adds a new start state that is accepting, with an ε-move to the old start. The new machine accepts $\varepsilon$ (it starts in an accepting state) and nothing else (there are no symbol moves at all).

**A common confusion.** $\emptyset^*$ is not the empty string itself, and not the empty set: it is the **set containing the empty string**, $\{\varepsilon\}$. It has one element, while $\emptyset$ has none. (Also $\{\varepsilon\}^*=\{\varepsilon\}$.)`,

  /* ───── Q4 ───── */

  "4a": r`**(i) $L(D_1)=\{\varepsilon\}$: only the empty string.** The start state $s_0$ is accepting, but every symbol moves to $s_1$, which is not accepting and never left. So the empty string is accepted and every nonempty string is rejected.

(For reference, $L(D_2)$ is the strings that contain at least one 1: $D_2$ reaches $q_2$ on the first 1, and $q_2$ and $q_3$ are both accepting and never left.)

**(ii) The union DFA $D$ by the product construction.** States are pairs $(p,q)$ with $p$ a state of $D_1$ and $q$ a state of $D_2$; the machine runs both at once:
$$
\delta\big((p,q),x\big)=\big(\delta_1(p,x),\ \delta_2(q,x)\big),
$$
starting at $(s_0,q_1)$. For the **union**, a pair is accepting if **either** component is accepting.

- **Start:** $(s_0,q_1)$. It is **accepting**, because $s_0$ is.
- **On 0:** $(\delta_1(s_0,0),\delta_2(q_1,0))=(s_1,q_1)$. Not accepting (neither component is).
- **On 1:** $(\delta_1(s_0,1),\delta_2(q_1,1))=(s_1,q_2)$. **Accepting**, because $q_2$ is.

${fig("b21-4a")}

Continuing the construction from these states adds only $(s_1,q_3)$:

${faTableMd(b21union, { label: pairName })}

So $L(D)=\{\varepsilon\}\cup\{w \mid w \text{ contains a }1\}$, as expected.`,

  "4b": r`**Idea.** The first symbol fixes the branch: if it is 0 the last must be 1, and vice versa. Between them is a **middle** part, and the total length is odd exactly when the middle has **odd** length ($1+\text{odd}+1$ is odd). So each branch counts the middle's length mod 2, and **guesses** when it reads the last symbol: the final move is allowed only from the "odd" state.

${fig("b21-4b")}

| State | Meaning |
|---|---|
| $s$ | start |
| $a_1$, $a_2$ | first symbol was 0; middle so far has even / odd length |
| $f_a$ | read a final 1 after an odd middle (accept) |
| $b_1$, $b_2$, $f_b$ | the same for strings starting with 1 and ending with 0 |

The nondeterminism: in $a_2$, reading a 1 can either be part of the middle (go to $a_1$) or be the last symbol (go to $f_a$). $f_a$ has no moves, so if more input follows that branch dies.

**Traces** (sets of states, since this is an NFA).

00101 (starts 0, ends 1, length 5): accepted
${faRunTex(b21odd, "00101", { name: sub })}
0011 (even length): rejected
${faRunTex(b21odd, "0011", { name: sub })}
101 (starts and ends with 1): rejected
${faRunTex(b21odd, "101", { name: sub })}

(Checked against the definition on every binary string up to length 11.)`,

  "4c": r`**What the DFA accepts.** $q_1$ is entered on every 1 and left on every 0, so the DFA is in $q_1$ exactly when the **last symbol read is 1**. $L=\{w \mid w \text{ ends in } 1\}$.

**A. $0^*1(1+00^*1)^*$: correct.**

- Every string it generates ends in 1: $0^*1$ ends in 1, and so does each block $1$ and $00^*1$.
- Every string ending in 1 is generated. Cut the string just after each 1: the pieces have the form $0^k1$. The first piece matches $0^*1$; each later piece is $1$ (if $k=0$) or $00^*1$ (if $k\ge1$).

**B. $0^*1^*1+11^*0^*1$: incorrect.** Both alternatives end in 1, so it accepts nothing wrong, but it **misses** many strings of $L$.

- $0^*1^*1$ gives only $0^i1^j$ with $j\ge1$: some 0s then some 1s.
- $11^*0^*1$ gives only $1^j0^k1$ with $j\ge1$.

For example 1011 ends in 1, but it has a 1 after the 0s that is followed by more symbols, and neither form allows that. Similarly 0101 and 00101 are missed.

**C. $(0+1)^*1$: correct.** Any string, followed by a final 1: exactly the strings that end in 1.

**Answer: A and C.** (Both were checked against the DFA on every string up to length 11; B was checked to accept exactly $0^*1^+\cup1^+0^*1$, and to reject 1011.)`,

  /* ───────────── Section B ───────────── */

  "5": r`### (i) Balanced parentheses

$$
S\to SS\mid (S)\mid\varepsilon
$$

- $S\to(S)$: wrap a balanced string in a matching pair.
- $S\to SS$: put two balanced strings side by side.
- $S\to\varepsilon$: the empty string is balanced.

Every rule keeps the string balanced (each "(" is added together with its matching ")"), and every balanced string is either empty, or $(u)v$ with $u$, $v$ balanced (match the first "(" with its partner), which the rules build.

Leftmost derivation of (()()):
${derivation(b21paren, "(()())", "lm")}

This grammar is ambiguous (for example ()()() has two trees, depending on how the $SS$ rule groups it). That is allowed here; an unambiguous alternative is $S\to(S)S\mid\varepsilon$.

### (ii) At least two 1s

$$
\begin{aligned}
S &\to A1A1A\\
A &\to 0A\mid 1A\mid\varepsilon
\end{aligned}
$$

$A$ generates any binary string. $S$ places two 1s with arbitrary strings before, between and after them, so every generated string has at least two 1s. Conversely, a string with at least two 1s splits as $x\,1\,y\,1\,z$ around (say) its first two 1s, with $x,y,z$ generated by $A$.

Leftmost derivation of 0110:
${derivation(b21two1, "0110", "lm")}

(Both grammars were checked against their definitions on every string up to length 10 and 9.)`,

  "6": r`$L$ is a **union** of two languages, so the grammar has one branch for each.

- $a^nb^nc^md^m$: the a's match the b's and, separately, the c's match the d's: two **side-by-side** blocks.
- $a^nb^mc^md^n$: the a's match the d's on the **outside**, the b's match the c's on the **inside**: nested blocks.

**Grammar.**
${grammarTex(b21g6)}

- $A\to aAb\mid ab$ generates $a^nb^n$ ($n\ge1$); $B\to cBd\mid cd$ generates $c^md^m$ ($m\ge1$). So $S\to AB$ gives the first language.
- $C\to aCd\mid aDd$ wraps a's and d's in pairs around $D$; $D\to bDc\mid bc$ generates $b^mc^m$ ($m\ge1$). So $S\to C$ gives the second language.

(Checked by machine on every string up to length 8.)

**Ambiguity.** A string with $n=m$ is in **both** parts: for abcd, $a^1b^1c^1d^1$ fits both. It has two parse trees:

${fig("cfg-inherent")}

Leftmost derivation through $S\to AB$:
${derivation(b21g6, "abcd", "lm", (t) => rootBody(t) === "AB")}
Leftmost derivation through $S\to C$:
${derivation(b21g6, "abcd", "lm", (t) => rootBody(t) === "C")}

Two different parse trees (two different leftmost derivations) for abcd, so the grammar is ambiguous. (This language is in fact **inherently ambiguous**: every grammar for it is ambiguous, because strings $a^nb^nc^nd^n$ can always be generated both ways.)`,

  "7": r`$w=0100$, $n=4$. $X_{ij}$ is the set of variables that derive symbols $i$ through $j$ of $w$.

**Bottom row.** 0 comes from $A\to0$ and $Z\to0$; 1 comes from $S\to1$, $A\to1$ and $Y\to1$.

**Cell-by-cell working:**

${cykWorkingMd(b21g7, "0100")}

**The table:**

${cykTableMd(b21g7, "0100")}

${fig("b21-7")}

**Conclusion.** $S\in X_{14}$, so **$0100\in L(G)$**. Reading the split off the table ($S\to AB$ with $A\in X_{11}$, $B\in X_{24}$) gives a derivation:
$$
S\Rightarrow AB\Rightarrow0B\Rightarrow0YA\Rightarrow01A\Rightarrow01ZA\Rightarrow010A\Rightarrow0100.
$$

**Aside: the whole language.** $A$ generates every nonempty binary string, $B$ generates 1 followed by a nonempty string, and $S\to AB\mid AY\mid YA\mid1$ places a 1 in the middle, at the end, at the start, or alone. So $L(G)$ is exactly the binary strings that contain at least one 1 (checked by machine up to length 9). 0100 has a 1, which agrees with the table.`,

  "8": r`$L$ is a **union**: $i=j$ or $i=k$. A PDA cannot know in advance which equality will hold, so it **guesses** at the start, using nondeterminism, and each branch checks one equality.

**Design.**

1. Push the bottom marker Z, then guess a branch.
2. **Branch $i=j$ (top):** push X for each a; pop one X for each b; when Z is on top again (all a's matched), read any number of c's; accept when the input ends.
3. **Branch $i=k$ (bottom):** push X for each a; read any number of b's without touching the stack; pop one X for each c; accept when Z is on top again.

${fig("b21-8")}

Labels are *input, pop $\to$ push*; ε-moves between the phases let each count be 0.

**Why it is correct.** In the top branch, reaching $p_c$ requires Z on top after the b's, so exactly as many b's as a's ($i=j$); $k$ is free. In the bottom branch, reaching $q_{acc}$ requires Z on top after the c's, so $i=k$; $j$ is free. The order $a^*b^*c^*$ is forced by the states. The PDA accepts if **either** branch accepts, which is the union.

**Accepting traces.**

aabbc ($i=j=2$), via the top branch:
${pdaTrace("aabbc")}

aabcc ($i=k=2$), via the bottom branch:
${pdaTrace("aabcc")}

**Rejected:** aabc has $i=2$, $j=k=1$. The top branch is left with an X after the single b, so cannot move to $p_c$; the bottom branch is left with an X after the single c, so cannot reach $q_{acc}$.

(The PDA was checked against the definition on every string over $\{a,b,c\}$ up to length 9; $\varepsilon$ is accepted, since $i=j=k=0$.)`,

  "9": r`**The pumping lemma for CFLs (HMU form).** If $L$ is a context-free language, there is a constant $n$ such that every $z\in L$ with $|z|\ge n$ can be written $z=uvwxy$ with

1. $|vwx|\le n$,
2. $vx\ne\varepsilon$,
3. $uv^iwx^iy\in L$ for all $i\ge0$.

(Sipser's letters are $uvxyz$ with $|vxy|\le p$ and $|vy|>0$: the same statement.)

**Proof.**

**Step 1: a CNF grammar.** If $L$ is empty or $\{\varepsilon\}$ the lemma holds trivially (choose $n$ larger than every string). Otherwise let $G$ be a CNF grammar for $L-\{\varepsilon\}$, with $m$ variables. Put $n=2^m$.

**Step 2: a long string needs a long path.** Let $z\in L$ with $|z|\ge n=2^m$ and take a parse tree for $z$. By the given theorem, if the longest path in the tree had length $k\le m$, then $|z|\le2^{k-1}\le2^{m-1}<n$. So the longest path has length at least $m+1$.

**Step 3: a repeated variable.** A path of length at least $m+1$ has at least $m+2$ nodes. The last is a terminal leaf; all the others are variables, so there are at least $m+1$ variable nodes on it. Look at the **lowest $m+1$** of them. There are only $m$ variables, so by the pigeonhole principle two of these nodes have the same label, say $A$: one at node $A_1$ and a lower one at node $A_2$ (inside $A_1$'s subtree).

**Step 4: cut the string.** Let $A_2$'s subtree yield $w$, and $A_1$'s subtree yield $vwx$ (the parts of $A_1$'s yield to the left and right of $w$). Then $z=uvwxy$, where $u$ and $y$ are the parts of $z$ outside $A_1$'s subtree. So $A\Rightarrow^* vAx$ and $A\Rightarrow^* w$.

**Step 5: $|vwx|\le n$.** The subtree at $A_1$: its longest path starts at one of the lowest $m+1$ variables, so it has length at most $m+1$ (we chose the longest path of the whole tree, so no path below $A_1$ is longer than the part of it below $A_1$). By the theorem, its yield has $|vwx|\le2^{(m+1)-1}=2^m=n$.

**Step 6: $vx\ne\varepsilon$.** In CNF, $A_1$ uses a rule $A\to BC$. $A_2$ lies inside one child's subtree, say $B$'s. The other child, $C$, derives a nonempty string (CNF has no ε-rules), and that string is part of $v$ or $x$. So $vx\ne\varepsilon$.

**Step 7: pumping.** Since $A\Rightarrow^*vAx$ and $A\Rightarrow^*w$:

- **$i=0$:** replace the subtree at $A_1$ by the subtree at $A_2$: a valid tree with yield $uwy$.
- **$i\ge2$:** replace the subtree at $A_2$ by a copy of the subtree at $A_1$, and repeat: yields $uv^2wx^2y$, $uv^3wx^3y$, ….

So $uv^iwx^iy\in L$ for every $i\ge0$, which proves the lemma. $\blacksquare$`,

  "10": r`**Idea: copy $w$ one bit at a time, complementing it, with the bit carried in the state.** A checked bit $x$ of $w$ is written $*x$ (a second track holding a check mark).

1. In $q_0$, at the leftmost unchecked bit $a$ of $w$: check it ($a\to*a$) and move right in state $[q_1,\bar a]$, **remembering the complement $\bar a$**.
2. $[q_1,\bar a]$ moves right over the rest of $w$, the $c$, and the bits already written, to the first blank. There it writes $\bar a$ and turns left in $q_2$.
3. $q_2$ moves left over the output bits, the $c$ and the unchecked bits of $w$, to the last checked bit; then it steps right into $q_0$.
4. When $q_0$ sees $c$, all of $w$ has been copied. State $u$ walks left, removing the check marks, and the machine halts in $q_f$ at the left end. The tape is $wc\bar w$.

| State | Meaning |
|---|---|
| $q_0$ | at the next unchecked bit of $w$ |
| $[q_1,b]$ | carrying the bit $b$ (the NOT of the bit just checked) to the end |
| $q_2$ | returning to the last checked bit |
| $u$ | removing check marks |
| $q_f$ | halt |

**Transition table** (a "–" means no move):

${tmTableMd(b21tmNot, tmName)}

**Trace on $01c$** (the output should be $01c10$):
${tmTraceTex(b21tmNot, "01c", { stateTex: tmName })}

The finite control stores one bit ("storage in the state") and the check marks form a second track ("multiple tracks"). (Checked on every input $wc$ with $|w|\le8$: the machine always halts with $wc\bar w$ on the tape.)`,

  "11": r`**(i) True.** A deterministic TM can simulate a conventional computer with only **polynomial** slowdown.

- Hold the computer's memory on a TM tape as a list of (address, contents) pairs, the instruction counter on another tape, and use a scratch tape.
- Assume (as is reasonable for real machines) that each instruction lengthens a word by at most one bit, and that each instruction can be done by a multitape TM on $k$-bit words in $O(k^2)$ steps (addition, comparison, shifts; multiplication is done as repeated shift-and-add).
- After $n$ instructions, no word or address is longer than $c+n$ bits, and at most $d+n$ addresses are in use ($c,d$ constants depending on the program). So the memory tape holds $O(n^2)$ cells.
- Simulating one instruction means a constant number of scans of the memory tape plus one $O(n^2)$ operation, so $O(n^2)$ TM steps. $n$ instructions take $O(n^3)$ steps on a **multitape** TM.
- A one-tape TM simulates $t$ steps of a multitape TM in $O(t^2)$ steps, so a **one-tape** TM needs $O(n^6)$.

Both are polynomials, so the statement is true, with $P(n)=O(n^6)$ for a one-tape TM.

**(ii) Not known to be true; believed false.**

- The known method simulates a nondeterministic TM $M_N$ by **breadth-first search** over its IDs. If each ID has at most $m$ choices, after $n$ moves there are up to $1+m+m^2+\cdots+m^n\le(n+1)m^n$ IDs to explore: **exponential** time.
- A conventional computer and a deterministic TM simulate each other with polynomial slowdown (part (i) and its converse). So if a computer could simulate $n$ moves of any NTM in $P(n)$ moves, a deterministic TM could too, in polynomial time.
- That would put every language accepted by a polynomial-time NTM into polynomial deterministic time: **NP ⊆ P, so P = NP**.

Whether P = NP is the major open problem in the field, and it is widely believed that P ≠ NP. So the statement **cannot be justified as true**: nobody knows a polynomial simulation, and the expected answer is that none exists.`,

  "12": r`**Enumerating strings and machines.** List the binary strings in order of length, and within each length in numerical order: $\varepsilon,0,1,00,01,\dots$. Call the $i$-th one $w_i$ (equivalently, $1w_i$ is $i$ in binary). Every TM with input alphabet $\{0,1\}$ has a **binary code**; let $M_i$ be the TM whose code is $w_i$ (if $w_i$ is not a valid code, $M_i$ is a machine that accepts nothing). So every TM appears in the list $M_1,M_2,\dots$.

**The diagonalization language.**
$$
L_d=\{w_i \mid w_i\notin L(M_i)\}:
$$
the strings $w_i$ that are **not** accepted by the machine whose code is $w_i$.

Picture a table whose entry in row $i$, column $j$ is 1 if $M_i$ accepts $w_j$, and 0 otherwise. Row $i$ is the **characteristic vector** of $L(M_i)$. $L_d$ is obtained by going down the **diagonal** and flipping every bit: $w_i\in L_d$ iff entry $(i,i)$ is 0.

| | $w_1$ | $w_2$ | $w_3$ | $w_4$ | … |
|---|---|---|---|---|---|
| $M_1$ | **0** | 1 | 1 | 0 | |
| $M_2$ | 1 | **1** | 0 | 0 | |
| $M_3$ | 0 | 0 | **1** | 1 | |
| $M_4$ | 0 | 1 | 0 | **1** | |

(Sample entries.) Here the diagonal is 0 1 1 1, so $L_d$ starts $1\,0\,0\,0\ldots$: it contains $w_1$ but not $w_2,w_3,w_4$.

**Theorem.** $L_d$ is not recursively enumerable: no TM accepts it.

**Proof.**

1. Suppose, for contradiction, that $L_d=L(M)$ for some TM $M$.
2. $M$ has input alphabet $\{0,1\}$, so it has a code and appears in the list: $M=M_i$ for some $i$.
3. Ask whether $w_i\in L_d$.
   - If $w_i\in L_d$: since $L_d=L(M_i)$, $M_i$ accepts $w_i$. But by the definition of $L_d$, $w_i\in L_d$ means $M_i$ does **not** accept $w_i$. Contradiction.
   - If $w_i\notin L_d$: then $M_i$ does not accept $w_i$ (as $L(M_i)=L_d$). But by the definition, $M_i$ not accepting $w_i$ puts $w_i$ **in** $L_d$. Contradiction.
4. Both cases are impossible, so no such $M$ exists. $\blacksquare$

**In terms of the table:** $L_d$ differs from row $i$ in column $i$, for every $i$. So $L_d$ is not any row, i.e. not the language of any TM.`,

  "13i": r`**Cook's theorem: SAT is NP-complete.** Two things must be shown.

**1. SAT is in NP.** Guess a truth assignment and evaluate the formula; both take polynomial time.

**2. Every language in NP reduces to SAT in polynomial time.** Let $L\in$ NP, accepted by a nondeterministic TM $M$ within $p(n)$ moves on inputs of length $n$. For an input $w$ of length $n$, build a Boolean formula $E_{M,w}$ such that
$$
E_{M,w} \text{ is satisfiable} \iff M \text{ has an accepting computation on } w.
$$
Within $p(n)$ moves, $M$ uses at most $p(n)+1$ tape cells. So a computation is a table of $p(n)+1$ IDs, each of $p(n)+1$ cells: polynomially many entries. The formula's variables describe this table:

- which state $M$ is in at each step;
- where the head is at each step;
- which symbol is in each cell at each step.

$E_{M,w}$ is the AND of polynomially many pieces saying:

- **each step is a valid ID:** exactly one state, one head position and one symbol per cell;
- **the first ID is the start ID on $w$:** start state, head on cell 0, the cells hold $w$ followed by blanks;
- **each ID follows from the previous one by a move of $M$:** cells away from the head do not change, and the cell, state and head position at the head change according to **one of** the choices in $\delta$ (an OR over the choices, which is how nondeterminism appears in the formula);
- **the computation accepts:** some step is in an accepting state.

A satisfying assignment spells out an accepting branch, and an accepting branch gives a satisfying assignment.

The formula has $O(p(n)^2)$ table entries and a fixed amount of formula per entry (the machine $M$ is fixed), so it has polynomial size and can be written in polynomial time. Hence $L\le_p$ SAT.

**Consequence.** Every NP problem reduces to SAT, so a polynomial-time algorithm for SAT would give one for every problem in NP (P = NP). SAT was the first NP-complete problem; others (3-SAT, clique, vertex cover, …) are proved NP-complete by reducing SAT, or a problem already shown NP-complete, to them.`,

  "13ii": b22Solutions["12ii"],
}

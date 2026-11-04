/* Worked solutions for the 13-batch (2014-2015) paper, keyed by part ("1a", "5c", "8c"). */
import { faRunTex, pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTraceTex } from "@/lib/automata"
import { derivation, treesOf } from "@/lib/derivations"
import { b13div4, b13evenA, b13even01, b13g5a, b13g6a, b13re3b, b13same, b13sum, b13tmWw, b13wcwr } from "../machines/b13"
import { b15mid0 } from "../machines/b15"
import { b15Solutions } from "./b15-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const sub = (q: string) => q.replace(/^([a-z])(\d)$/, "$1_$2")
const re = (s: string) => s.replace(/\*/g, "^*").replace(/ε/g, "\\varepsilon")
const [amb1, amb2] = treesOf(b13g6a, "001011")
const same = (a: unknown) => (t: unknown) => JSON.stringify(t) === JSON.stringify(a)
const pdaName = (q: string) => ({ qs: "q_s", qp: "q_p", qm: "q_m", qacc: "q_{acc}" })[q] ?? q

export const b13Solutions: Record<string, string> = {
  "1a": r`**Idea.** Only the sum modulo 3 matters. State $r_i$ means "sum so far $\equiv i\pmod3$". Digit $d$ moves $r_i$ to $r_{(i+d)\bmod3}$, so 0 and 3 change nothing; R returns to $r_0$. Accept in $r_0$.

${fig("b13-1a")}

${faRunTex(b13sum, "21R30")}
${faRunTex(b13sum, "2R11")}

(Checked against the definition on every string over $\{0,1,2,3,R\}$ up to length 5.)`,

  "1b": r`**Construction.** Let state $s_n$ mean "the actual sum so far is $n$". From $s_n$: digit $d$ goes to $s_{n+d}$; R goes to $s_0$. Accept in $s_n$ when $n$ is a multiple of 3: $s_0,s_3,s_6,\dots$

${fig("b13-1b")}

**The problem: this is not a finite automaton.** The sum can grow without bound (the string $2^k$ has sum $2k$), so the machine needs a state $s_n$ for **every** natural number $n$: infinitely many states. A DFA must have a **finite** set of states, so this "DFA" does not exist as a DFA.

**The fix.** Two sums $n$ and $n'$ with $n\equiv n'\pmod3$ behave identically for every continuation (adding the same digits keeps them congruent, and R resets both). So the states $s_n$ can be merged by remainder, giving the 3-state DFA of part (a) (with $\Sigma$ reduced to $\{0,1,2,R\}$). Remembering more than the machine needs to know is exactly what makes the state set infinite.`,

  "2a": r`$L=\{1^{n^2} \mid n\ge0\}=\{\varepsilon,1,1^4,1^9,\dots\}$. **It is not regular.**

1. Assume $L$ is regular, with pumping length $p$.
2. Choose $w=1^{p^2}\in L$, $|w|=p^2\ge p$.
3. Any split $w=xyz$ with $|xy|\le p$, $|y|>0$ has $y=1^k$, $1\le k\le p$.
4. Pump up ($i=2$): $|xy^2z|=p^2+k$, and
$$
p^2<p^2+k\le p^2+p<p^2+2p+1=(p+1)^2.
$$
5. So $p^2+k$ lies strictly between two consecutive squares and is not a square: $xy^2z\notin L$. Contradiction; $L$ is not regular.

(Brute-force checked over every legal split for $p=1,\dots,6$.)`,

  "2b": r`**How it works.** Reading bits left to right, appending bit $b$ to a number $v$ gives $2v+b$. A number is divisible by 4 iff its **last two bits are 00** (since $4\mid 2v+b$ iff $b=0$ and $v$ is even). The DFA keeps the value mod 4:

| From | 0 | 1 |
|---|---|---|
| $s$ (start, nothing read) | $r_0$ | $r_1$ |
| $r_0$ | $r_0$ | $r_1$ |
| $r_1$ | $r_2$ | $r_3$ |
| $r_2$ | $r_0$ | $r_1$ |
| $r_3$ | $r_2$ | $r_3$ |

Accept in $r_0$. The separate start $s$ keeps the empty string (not a number) from being accepted; the string 0 itself (value 0) is accepted. ($r_0,r_2$ and $r_1,r_3$ could be merged by "last bit", but the mod-4 reading explains the design.)

${fig("b13-2b")}

${faRunTex(b13div4, "1100", { name: sub })}
${faRunTex(b13div4, "110", { name: sub })}

(Checked against the definition on every binary string up to length 11.)`,

  "3a": r`**Language.** Strings whose final block of a's (the maximal run of a's at the end) has even length $\ge2$: $(a+b)^*b(aa)^+ + (aa)^+$.

**Idea.** Guess where the final run of a's begins, then check it has even, nonzero length. The guess must be "at the very start" or "just after a b".

${fig("b13-3a")}

- $s_0$: ε-moves to $s$ (the string has a prefix ending in b) or $m$ (the whole string is a's).
- $s$: loops on a, b; on b it may guess that this is the last b and go to $m$.
- $m\xrightarrow{a}o\xrightarrow{a}f\xrightarrow{a}o$: $f$ (accepting) after an even, nonzero number of a's. $f$ and $o$ have no move on b, so the run really is final.

**Traces** (sets of states). abbaa (accepted):
${faRunTex(b13evenA, "abbaa", { name: sub })}
abbaaa (rejected, odd final run):
${faRunTex(b13evenA, "abbaaa", { name: sub })}

(Checked on every string up to length 10 and on all the examples.)`,

  "3b": r`**(i) Decimal numbers divisible by 5, no leading zeros:** a multiple of 5 ends in 0 or 5. So: the single digits 0 and 5, or a nonzero first digit followed by any digits and a final 0 or 5:
$$
${re(b13re3b.i)}.
$$

**(ii) Odd number of 0s, or odd number of 1s:**
$$
${re(b13re3b.ii)}.
$$
$1^*01^*(01^*01^*)^*$: one 0, then pairs of 0s, with 1s anywhere: an odd number of 0s. The second part is the same with 0 and 1 swapped.

**(iii) No 101:** a 0 between two 1s must be part of a run of at least two 0s. After any leading 0s, the string is blocks "1s followed by at least two 0s", then optionally a final block of 1s with any number of 0s after it:
$$
${re(b13re3b.iii)}.
$$

(Checked against the definitions: (i) on all digit strings up to length 3, (ii) and (iii) on all binary strings up to length 10 or 11.)`,

  "4a": r`**Idea.** An occurrence of 01 is exactly a run of 0s followed by a run of 1s. Write any binary string as $1^*\,(0^+1^+)^k\,0^*$; then $k$ is the number of occurrences of 01. For $k$ even:
$$
1^*\,(0^+1^+0^+1^+)^*\,0^*.
$$

**NFA.** $s$ reads leading 1s; $a_1,b_1$ read the first block pair $0^+1^+$ and $a_2,b_2$ the second (so each full round adds two occurrences); $z$ reads trailing 0s. The nondeterminism is on 0 from $s$ or $b_2$: start another block pair, or start the final run of 0s.

${fig("b13-4a")}

**Subset construction** (reachable part only):

${subsetTableMd(b13even01)}

The DFA has 5 states; accepting are the sets containing $s$, $b_2$ or $z$. In words: $A$ "only 1s so far", $B$ "even number of 01s and the last symbol is 0", $C$ "odd, last symbol 1", $D$ "odd, last symbol 0", $E$ "even ($\ge2$), last symbol 1".

(Both machines were checked against "even number of 01s" on every binary string up to length 11.)`,

  "4b": r`**The pumping lemma.** If $A$ is a regular language, there is a number $p$ (the pumping length) such that every $s\in A$ with $|s|\ge p$ can be divided as $s=xyz$ with

1. $xy^iz\in A$ for every $i\ge0$,
2. $|y|>0$,
3. $|xy|\le p$.

**Idea.** A DFA for $A$ has only $p$ states. Reading a string of length at least $p$, it visits more than $p$ states, so some state repeats. The part of the input read between the two visits takes the machine round a **loop**; going round the loop any number of times (including zero) leads to the same final state, so the string stays in $A$.

**Proof.** Let $M=(Q,\Sigma,\delta,q_1,F)$ be a DFA for $A$ and $p=|Q|$. Let $s=s_1s_2\cdots s_n\in A$ with $n\ge p$, and let $r_1,\dots,r_{n+1}$ be the states $M$ visits ($r_1=q_1$, $r_{i+1}=\delta(r_i,s_i)$, $r_{n+1}\in F$).

- Among the first $p+1$ states $r_1,\dots,r_{p+1}$ there must be a repeat (pigeonhole: only $p$ states). Let $r_j=r_\ell$ with $j<\ell\le p+1$.
- Let $x=s_1\cdots s_{j-1}$, $y=s_j\cdots s_{\ell-1}$, $z=s_\ell\cdots s_n$.
- $x$ takes $M$ from $r_1$ to $r_j$; $y$ takes it from $r_j$ back to $r_\ell=r_j$; $z$ takes it from $r_\ell$ to $r_{n+1}\in F$. So $xy^iz$ takes $M$ from $r_1$ to $r_j$, round the loop $i$ times, then to $r_{n+1}$: **accepted for every $i\ge0$** (condition 1).
- $j\ne\ell$, so $|y|=\ell-j>0$ (condition 2).
- $\ell\le p+1$, so $|xy|=\ell-1\le p$ (condition 3). $\blacksquare$`,

  "5a": r`Each use of $S\to abScB$ puts ab on the left and $cB$ on the right of the inner $S$, so after $n$ steps and $S\to\varepsilon$:
$$
(ab)^n\;cB\;cB\cdots cB \quad(n \text{ copies}),
$$
and each $B$ generates $b^+$ (one or more b's). Hence
$$
L(G)=\{(ab)^n\,c\,b^{m_1}\,c\,b^{m_2}\cdots c\,b^{m_n} \mid n\ge0,\ m_i\ge1\}:
$$
$n$ copies of ab followed by $n$ blocks, each a c followed by at least one b. For example $\varepsilon$, abcb, abcbbb, ababcbcbb.

${derivation(b13g5a, "ababcbcbb", "lm")}

(Checked against this description on every string over $\{a,b,c\}$ up to length 10.)`,

  "5b": r`**(i) Starts and ends with the same symbol:**
$$
S\to0A0\mid1A1\mid0\mid1,\qquad A\to0A\mid1A\mid\varepsilon.
$$
(The single symbols 0 and 1 start and end with themselves.)

${derivation(b13same, "0110", "lm")}

**(ii) Odd length with 0 in the middle:**
$$
S\to ASA\mid0,\qquad A\to0\mid1.
$$

${derivation(b15mid0, "100", "lm")}

(Both checked on every binary string up to length 9.)`,

  "5c": r`**Chomsky normal form.** A CFG is in CNF if every rule has the form
$$
A\to BC \quad\text{or}\quad A\to a,
$$
with $A,B,C$ variables ($B,C$ not the start variable) and $a$ a terminal; Sipser also allows $S\to\varepsilon$ for the start variable. Every CFL (without ε, or with the $S\to\varepsilon$ exception) has a CNF grammar. In CNF every parse tree is binary, which is what the CYK algorithm and the CFL pumping lemma use.

${b15Solutions["6b"]}`,

  "6a": r`A grammar is ambiguous if some string has **two different parse trees** (equivalently, two leftmost derivations).

This grammar generates the nonempty strings with equal numbers of 0s and 1s: $A$ generates the strings with one more 1 than 0 (what is still owed after a 0), and $B$ those with one more 0 than 1. The rules $A	o0AA$ and $B	o1BB$ let a string be cut into such pieces in more than one way. The shortest ambiguous strings have length 6; one is 001011:

${fig("b13-6a")}

Leftmost derivation for tree 1:
${derivation(b13g6a, "001011", "lm", same(amb1))}
Leftmost derivation for tree 2:
${derivation(b13g6a, "001011", "lm", same(amb2))}

Two different parse trees (two different leftmost derivations) for 001011, so the grammar is ambiguous.

(A computer search confirms that 001011, 001101, 110010, 110100 are the shortest ambiguous strings.)`,

  "6b": r`$L=\{a^nb^jc^k \mid k=jn\}$. Use the pumping lemma for CFLs.

1. Assume $L$ is context-free with pumping length $p$.
2. Choose $s=a^pb^pc^{p^2}\in L$ ($k=p\cdot p$), $|s|\ge p$.
3. Let $s=uvxyz$ with $|vxy|\le p$, $|vy|>0$. Pump with $i=2$: let $\alpha$, $\beta$, $\gamma$ be the numbers of a's, b's, c's added.
4. If $v$ or $y$ contains two kinds of symbols, $uv^2xy^2z$ is not of the form $a^*b^*c^*$: not in $L$.
5. Otherwise $v$ and $y$ are each inside one block. Since $|vxy|\le p$ and the b-block has length $p$, $vxy$ cannot touch both the a's and the c's.
   - **No c's added ($\gamma=0$):** then $\alpha+\beta>0$, and the new product is $(p+\alpha)(p+\beta)>p^2=k$. Not in $L$.
   - **Some c's added ($\gamma>0$):** then $vxy$ touches no a's, so $\alpha=0$, and we need $p^2+\gamma=p(p+\beta)$, i.e. $\gamma=p\beta$. If $\beta=0$ this fails since $\gamma>0$. If $\beta\ge1$ then $\gamma\ge p$, but $\beta+\gamma\le|vy|\le p$ gives $\gamma\le p-1$. Contradiction.
6. Every split fails, so $L$ is not context-free. $\blacksquare$

(Brute-force checked over every legal split for $p=1,2,3$.)`,

  "6c": r`**Design.** Push every symbol of $w$; the c marks the middle, so switch to matching (no guessing is needed); pop and compare each symbol of the second half; accept when the bottom marker \$ is exposed.

${fig("b13-6c")}

**Computation on bbcbb** (state, remaining input, stack with the top on the left):
${pdaTraceTex(pdaAcceptingTrace(b13wcwr, "bbcbb")!, pdaName)}

(Checked against $\{wcw^R\}$ on every string over $\{a,b,c\}$ up to length 9.)`,

  "7a": r`**Theorem.** For every PDA $P$ there is a CFG $G$ with $L(G)=L(P)$. (Sipser's construction.)

**Step 1: normalise $P$.** Modify $P$ so that (1) it has a single accepting state $q_{acc}$, (2) it empties its stack before accepting, and (3) every move either pushes one symbol or pops one symbol (not both, not neither). This does not change the language: add ε-moves to a new accepting state that pops everything, and split each move into a pop followed by a push through new states (or a push and pop of a dummy symbol for moves that do neither).

**Step 2: variables.** For each pair of states $p,q$, a variable $A_{pq}$ that generates exactly the strings taking $P$ from $p$ with an **empty** stack to $q$ with an empty stack (equivalently, from $p$ to $q$ without disturbing whatever is below). The start variable is $A_{q_0q_{acc}}$.

**Step 3: rules.** Consider such a computation from $p$ to $q$. Its first move pushes some $t$; its last move pops some symbol.

- If the symbol popped at the end is the same $t$ pushed at the start (the stack is never empty in between): for $\delta(p,a,\varepsilon)\ni(r,t)$ and $\delta(s,b,t)\ni(q,\varepsilon)$ add $A_{pq}\to aA_{rs}b$.
- Otherwise the stack becomes empty at some middle state $r$: add $A_{pq}\to A_{pr}A_{rq}$ for all $p,q,r$.
- Add $A_{pp}\to\varepsilon$ for every $p$.

**Step 4: correctness** (both directions, by induction). If $A_{pq}\Rightarrow^*x$ then $x$ takes $P$ from $p$ (empty stack) to $q$ (empty stack): induction on the derivation, using the three rule types. Conversely, if $x$ does that, then $A_{pq}\Rightarrow^*x$: induction on the length of the computation, splitting at the first or the middle point where the stack is empty. With $p=q_0$, $q=q_{acc}$: $L(G)=L(P)$. $\blacksquare$

(Atif Sir's notes give the HMU version of the same idea, with variables $[pXq]$ and a PDA accepting by empty stack.)`,

  "7b": r`**Theorem.** The set $\mathcal B$ of all infinite binary sequences $b_1b_2b_3\cdots$ is uncountable.

**Proof (Cantor's diagonal argument).** Suppose $\mathcal B$ were countable: then its elements can be listed as $s_1,s_2,s_3,\dots$, every sequence appearing somewhere. Write $s_i=s_{i1}s_{i2}s_{i3}\cdots$.

| | 1 | 2 | 3 | 4 | … |
|---|---|---|---|---|---|
| $s_1$ | **0** | 1 | 1 | 0 | |
| $s_2$ | 1 | **1** | 0 | 1 | |
| $s_3$ | 0 | 0 | **0** | 1 | |
| $s_4$ | 1 | 0 | 1 | **1** | |

(Sample entries.) Define a new sequence $d$ by flipping the diagonal: $d_i=1-s_{ii}$. Here $d=1\,0\,1\,0\cdots$.

$d$ is an infinite binary sequence, so it must be some $s_k$. But $d_k=1-s_{kk}\ne s_{kk}$: $d$ differs from $s_k$ in position $k$. This holds for every $k$, so $d$ is not in the list, a contradiction. Hence $\mathcal B$ is uncountable. $\blacksquare$

**Why it matters.** The set of Turing machines is countable (each has a finite binary code), but the set of languages over $\{0,1\}$ corresponds to infinite binary sequences (characteristic sequences), which is uncountable. So **some languages are not recognised by any TM**; $L_d$ is built by exactly this diagonal argument.`,

  "7c": r`**Theorem.** Every nondeterministic TM $N$ has an equivalent deterministic TM $D$ ($L(D)=L(N)$). (The converse is trivial: a DTM is an NTM with one choice per move.)

**Idea.** $D$ explores **all** computation branches of $N$ **breadth-first**, so that if any branch accepts, $D$ eventually finds it. (Depth-first would fail: it could follow an infinite branch for ever.)

**Construction (HMU).** $D$ is a multitape TM (which can then be converted to one tape).

1. Tape 1 holds a **queue of IDs** of $N$, separated by markers; the ID being processed is marked. Initially it holds the start ID $q_0w$.
2. Repeat: take the marked ID; if its state is accepting, **accept**. Otherwise, using a scratch tape, copy it and write after the end of the queue **every** ID reachable from it in one move of $N$ (there are at most $m$, the largest number of choices in $N$'s transition function). Move the mark to the next ID.

**Correctness.** IDs are processed in order of the number of moves from the start. If $N$ accepts $w$ after $n$ moves, the accepting ID is among the at most $1+m+m^2+\cdots+m^n\le(n+1)m^n$ IDs reached within $n$ moves, so $D$ reaches and accepts it after finitely many steps. If $N$ never accepts, $D$ never accepts. So $L(D)=L(N)$. $\blacksquare$

**Cost.** The simulation may take exponentially more steps than $N$; whether this can be avoided is the P versus NP question.`,

  "8a": r`Let $M$ be a Turing machine. On an input $w$, $M$ may **accept** (halt in an accepting state), **reject** (halt otherwise), or **loop** (never halt).

- A language $L$ is **Turing-recognisable** (recursively enumerable) if some TM $M$ accepts exactly the strings of $L$: $L=L(M)$. On strings not in $L$, $M$ may reject or loop.
- A language $L$ is **decidable** (recursive) if some TM $M$ **decides** it: $M$ halts on every input, accepting the strings in $L$ and rejecting the others.
- A language is **undecidable** if no TM decides it.

Every decidable language is recognisable; $L$ is decidable iff both $L$ and $\overline L$ are recognisable. Examples: $\{0^n1^n\}$ is decidable; $A_{TM}$ is recognisable but undecidable; $\overline{A_{TM}}$ is not even recognisable.`,

  "8b": r`**Idea (Sipser's zig-zag machine).** Repeatedly cross off the first unmarked symbol of $w$ and the matching symbol after the −, checking they agree.

1. $q_1$: at the first unmarked symbol of the first half. If it is − (first half used up), go right in $q_8$ checking that only crossed-off symbols remain, then accept at the blank.
2. Otherwise cross it off (x), remembering a ($q_2$) or b ($q_3$); move right past the −.
3. $q_4$/$q_5$: skip crossed-off symbols; the first unmarked symbol must equal the remembered one: cross it off; otherwise **reject** (no move).
4. $q_6$, $q_7$: move back left to the leftmost x of the first half, and step right into $q_1$.

${fig("b13-8b")}

**Trace on ab−ab:**
${tmTraceTex(b13tmWw, "ab-ab")}

Every round crosses off two symbols, so the machine always halts: it decides $L$. (Checked on every string over $\{a,b,-\}$ up to length 9.)`,

  "8c": b15Solutions["8a"],
}


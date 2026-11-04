/* Worked solutions for the 15-batch (2016-2017) paper, keyed by part ("1a", "5a", "8c"). */
import { closureTableMd, faRunTex, pdaAcceptingTrace, pdaTraceTex, subsetTableMd, tmTableMd, tmTraceTex, type FA } from "@/lib/automata"
import { grammarTex } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import {
  b15g6b,
  b15g6bCnf,
  b15g6bEps,
  b15g6bUnit,
  b15inc,
  b15mid0,
  b15odd,
  b15pal4,
  b15pda6a,
  b15q2a,
  b15q2b,
  b15stones3,
  b15stones4,
  b15stones6,
  b15tmEq,
  b15tree,
  b15wwr,
  stoneClasses,
} from "../machines/b15"
import { b16three1 } from "../machines/b16"
import { b21Solutions } from "./b21-solutions"
import { b22Solutions } from "./b22-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const tri = (k: string) => `(${k})`
const classList = (g: FA) => {
  const c = stoneClasses(g)
  const of = (x: string) => g.states.filter((s) => c[s] === x).map(tri).join(", ") || "none"
  return `- **Must fail:** ${of("must")}\n- **Can't fail:** ${of("cant")}\n- **Might fail:** ${of("might")}`
}
const pdaName = (q: string) => ({ qs: "q_s", q0: "q_0", qx: "q_x", q1: "q_1", qp: "q_p", qm: "q_m", qacc: "q_{acc}" })[q] ?? q
const tmName = (q: string) => (q === "qf" ? "q_f" : q === "qa" ? "q_{acc}" : `q_${q.slice(1)}`)

export const b15Solutions: Record<string, string> = {
  "1a": r`**States and events.** With 3 stones a state is $(r,g,b)$ with $r+g+b=3$: 10 states. An R-event needs a green and a blue stone: $(r,g,b)\to(r+2,g-1,b-1)$; similarly $G$: $(r-1,g+2,b-1)$ and $B$: $(r-1,g-1,b+2)$. A state with all stones one colour has failed and has no events.

${fig("b15-1a")}

- The six states that use exactly two colours, such as (2,1,0), have only one possible event, and they form a single cycle: $(2,1,0)\xrightarrow{B}(1,0,2)\xrightarrow{G}(0,2,1)\xrightarrow{R}(2,1,0)$, and similarly round the other way. None of them ever reaches a failed state.
- (1,1,1) has three possible events, and **every one** of them makes all stones one colour.

${classList(b15stones3)}

(The failed states themselves count as "must fail".)`,

  "1b": r`With 4 stones there are 15 states.

${fig("b15-1b")}

${classList(b15stones4)}

Every non-failed state can reach a failed corner (for example $(2,1,1)\xrightarrow{R}(4,0,0)$), and every non-failed state can also reach the cycle $(2,1,1)\to(1,3,0)\to(0,2,2)\to(2,1,1)$, which avoids failure for ever. So all non-corner states are "might fail".

(All classifications in this question were computed by searching the state graphs.)`,

  "1c": r`**Symmetry 1: renaming colours.** The rules treat the three colours alike. Permuting the colours (6 permutations) maps the state diagram onto itself: for example $(3,1,0)$, $(3,0,1)$, $(1,3,0)$, $(0,3,1)$, $(1,0,3)$, $(0,1,3)$ all behave the same way. Each event maps to the corresponding event of the permuted colour.

**Reduced scheme.** Use one state per **multiset** of counts, written in decreasing order: $(3,1,0)$ stands for all six arrangements above. Draw an arrow from pattern $X$ to pattern $Y$ if some event leads from an arrangement of $X$ to an arrangement of $Y$. Event names are dropped, since they depend on which colour is which. For 4 stones this reduces 15 states to 4: $(4,0,0)$, $(3,1,0)$, $(2,2,0)$, $(2,1,1)$. Must-, might- and can't-fail are properties of a pattern, so they can be read off the reduced diagram.

**Symmetry 2: an invariant.** Every event changes each count by $+2$ or $-1$, and $+2\equiv-1\pmod 3$. So all three counts change by the same amount mod 3, and the **differences between counts stay the same mod 3**.

A failed state $(n,0,0)$ has two equal counts. So if two counts are **different mod 3** they can never become equal, and the planet **can't fail**. In particular, a state whose three counts are pairwise different mod 3 (such as $(2,1,0)$ or $(3,2,1)$) can't fail. This explains which states fall into which class without drawing anything.`,

  "1d": r`With 6 stones the 28 states reduce to 7 patterns: $(6,0,0)$, $(5,1,0)$, $(4,2,0)$, $(4,1,1)$, $(3,3,0)$, $(3,2,1)$, $(2,2,2)$.

${fig("b15-1d")}

${classList(b15stones6)}

**Why.**

- $(5,1,0)$, $(4,2,0)$, $(3,2,1)$: the counts are $\{2,1,0\}$ mod 3, all different, so by the invariant two counts can never become equal. These three patterns only lead to each other: **can't fail**.
- $(4,1,1)$, $(3,3,0)$, $(2,2,2)$ each have two counts equal mod 3, and they form the cycle $(4,1,1)\to(3,3,0)\to(2,2,2)\to(4,1,1)$, from which $(4,1,1)\to(6,0,0)$ is also possible: **might fail**.
- $(6,0,0)$ has failed: **must fail**. No other pattern is forced to fail.`,

  "2a": r`**Idea.** Track two things independently and combine them (a product of two small DFAs):

- the number of a's modulo 3 (0, 1, 2);
- the parity of the digit sum (even or odd). Reading 2 does not change the parity; reading 1 flips it. b changes nothing.

So there are $3\times2=6$ states $kp$, and the start state $0e$ is the only accepting state ($\varepsilon$ has 0 a's and digit sum 0).

${fig("b15-2a")}

**Traces.** aab12a1 (3 a's, digit sum 4): accepted
${faRunTex(b15q2a, "aab12a1", { perLine: 4 })}
1121 (digit sum 5): rejected
${faRunTex(b15q2a, "1121")}

(Checked on every string up to length 6, and on all eight examples in the question.)`,

  "2b": r`**ε-closures** (from the figure: $p\xrightarrow{\varepsilon}r$, $q\xrightarrow{\varepsilon}r$, $r\xrightarrow{\varepsilon}s$):

${closureTableMd(b15q2b)}

**Subset construction** from $E(p)=\{p,r,s\}$:

${subsetTableMd(b15q2b, false)}

${fig("b15-2b")}

A DFA state is accepting when it contains $q$: $\{p,q,r,s\}$ and $\{q,r,s\}$. Only three subsets are reachable, and no dead state is needed, because every set contains $r$ (with a move on 1) and $s$ (with a move on 0).

(The DFA was checked against the NFA on every binary string up to length 9.)`,

  "2c": b21Solutions["3c"],

  "3a": r`### (i) The final digit has appeared before

Guess an earlier occurrence of the final digit and check that the input ends with the same digit.

${fig("b15-3a-i")}

$s$ loops on every digit (the prefix). On digit $d$ it may move to $p_d$ ("I have seen $d$ and bet that the input ends with $d$"). $p_d$ loops on every digit. On $d$, $p_d$ may move to the accepting state $f$, which has no moves, so this branch accepts only if that $d$ was the last symbol.

### (ii) The final digit has not appeared before

Guess the final digit $d$ at the very start, and check that $d$ does not occur until the end.

${fig("b15-3a-ii")}

$s\xrightarrow{\varepsilon}n_d$ for each digit $d$. $n_d$ loops on every digit **except** $d$; reading $d$ moves to the accepting $f_d$, which has no moves. So a branch accepts exactly when the input is (digits other than $d$)$^*\,d$.

### (iii) Two 0s separated by a multiple of 4 positions

Reading "separated by $k$ positions" as "$k$ characters strictly between them" (so 00 is separated by 0 positions, as the question says): $L=\Sigma^*0\big((0+1)^4\big)^*0\Sigma^*$.

${fig("b15-3a-iii")}

$s$ guesses the first 0 of the pair; $g_0\ldots g_3$ count the characters read since then, mod 4; a 0 read in $g_0$ (after 0, 4, 8, … characters) completes the pair.

**Remark on the examples.** 00 fits this reading, but 10111010 and 01010111011 do not (for example, the 0s at positions 2 and 6 of 10111010 have 3 characters between them). They fit the reading "the **positions** differ by a multiple of 4". For that reading, move the final $\xrightarrow{0}f$ edge from $g_0$ to $g_3$ (exactly $3,7,11,\dots$ characters between), and 00 is then not accepted.

(All three NFAs were checked on every string up to length 6 or 11; (i) and (ii) on the digits 0–2, since the machine for 0–9 has the same shape.)`,

  "3b": r`**(i) Alternating 0s and 1s** (no 00 and no 11):
$$
(\varepsilon+1)(01)^*(\varepsilon+0).
$$
An optional leading 1, then pairs 01, then an optional final 0. This covers $\varepsilon$, 0, 1, 01, 10, 010, 101, …

**(ii) At least one a and at least one b** over $\{a,b,c\}$: either some a comes before some b, or some b before some a:
$$
(a+b+c)^*a(a+b+c)^*b(a+b+c)^* + (a+b+c)^*b(a+b+c)^*a(a+b+c)^*.
$$

**(iii) Every 00 appears before any 11.** Split the string just before its first 11 (if any). The part before contains no 11; the part from there on contains no 00.

- Strings with no 11: $(10+0)^*(\varepsilon+1)$ (every 1 is followed by a 0, except possibly the last symbol).
- Strings with no 00: $(01+1)^*(\varepsilon+0)$.

$$
(10+0)^*(\varepsilon+1)(01+1)^*(\varepsilon+0).
$$

(All three were checked against their definitions on every string up to length 6–11.)`,

  "4a": b22Solutions["3b"],

  "4b": r`**Theorem.** If $A_1$ and $A_2$ are regular, so is $A_1\circ A_2=\{xy \mid x\in A_1, y\in A_2\}$.

**Proof idea.** Take NFAs $N_1$ for $A_1$ and $N_2$ for $A_2$, and run $N_1$ then $N_2$: whenever $N_1$ is in an accepting state, it may guess that the first part is over and jump (by an ε-move) to $N_2$'s start.

**Construction.** Let $N_1=(Q_1,\Sigma,\delta_1,q_1,F_1)$ and $N_2=(Q_2,\Sigma,\delta_2,q_2,F_2)$ with $Q_1\cap Q_2=\emptyset$. Build $N=(Q_1\cup Q_2,\Sigma,\delta,q_1,F_2)$:
$$
\delta(q,a)=
\begin{cases}
\delta_1(q,a) & q\in Q_1,\ q\notin F_1\\
\delta_1(q,a) & q\in F_1,\ a\ne\varepsilon\\
\delta_1(q,a)\cup\{q_2\} & q\in F_1,\ a=\varepsilon\\
\delta_2(q,a) & q\in Q_2
\end{cases}
$$

- The start state is $N_1$'s start $q_1$.
- The accepting states are only $N_2$'s, $F_2$.
- From each accepting state of $N_1$ there is an extra ε-move to $q_2$.

**Correctness.**

- If $w=xy$ with $x\in A_1$, $y\in A_2$: $N$ reads $x$ along an accepting run of $N_1$, ending in some state of $F_1$, takes the ε-move to $q_2$, then reads $y$ along an accepting run of $N_2$, ending in $F_2$. So $N$ accepts $w$.
- If $N$ accepts $w$: an accepting branch ends in $F_2\subseteq Q_2$. The only way from $Q_1$ into $Q_2$ is an ε-move from some state of $F_1$ to $q_2$, taken after reading some prefix $x$ of $w$; the run up to there is an accepting run of $N_1$ on $x$, so $x\in A_1$. The rest $y$ takes $N_2$ from $q_2$ to $F_2$, so $y\in A_2$. Hence $w=xy\in A_1\circ A_2$.

So $L(N)=A_1\circ A_2$, and since every NFA has an equivalent DFA, $A_1\circ A_2$ is regular. $\blacksquare$`,

  "4c": r`$L=\{1^n \mid n \text{ is prime}\}$.

1. Assume $L$ is regular, with pumping length $p$.
2. Choose a prime $q\ge p+2$ (there are infinitely many primes) and $w=1^q\in L$, so $|w|\ge p$.
3. Any split $w=xyz$ with $|xy|\le p$, $|y|\ge1$ has $y=1^k$, $1\le k\le p$.
4. Pump with $i=q+1$: $|xy^{q+1}z|=q+qk=q(1+k)$.
5. Both factors are at least 2 ($q\ge2$ and $1+k\ge2$), so $q(1+k)$ is **not prime**, and $xy^{q+1}z\notin L$.
6. This contradicts the pumping lemma, so $L$ is not regular.

(Why not just $w=1^p$? $p$ need not be prime, and then $1^p\notin L$. The argument is brute-force checked in the pumping-lemma note.)`,

  "5a": r`**(i) Odd length:**
$$
S\to AAS\mid A,\qquad A\to0\mid1.
$$
Each $AAS$ adds two symbols; the derivation ends with one more. (Checked up to length 9.)

${derivation(b15odd, "010", "lm")}

**(ii) At least three 1s:**
$$
S\to A1A1A1A,\qquad A\to0A\mid1A\mid\varepsilon.
$$
$A$ is any string; three 1s are placed among four arbitrary strings.

${derivation(b16three1, "1011", "lm")}

**(iii) Odd length with middle symbol 0:**
$$
S\to ASA\mid0,\qquad A\to0\mid1.
$$
Each step adds one symbol on each side, keeping the 0 exactly in the middle.

${derivation(b15mid0, "10011", "lm")}

(All three grammars were checked against their definitions on every binary string up to length 9.)`,

  "5b": r`**Working principle (pseudo code).**

1. Start on #. Move right to the end of the number (the first blank), then step back onto the last bit (the LSB).
2. **Add 1 with carry, right to left.** While the bit is 1: write 0 (1 + 1 = 10, carry 1) and move left.
3. At the first 0: write 1 (the carry is absorbed) and halt.
4. If the carry runs past the MSB and reaches #, the number was all 1s: replace # with 1 (the new leading bit) and halt. E.g. #111 becomes 1000.

| State | Meaning |
|---|---|
| $q_0$ | on #, at the start |
| $q_1$ | moving right to the end |
| $q_2$ | adding the carry, moving left |
| $q_f$ | halt |

${tmTableMd(b15inc)}

**Trace on #101** ($5+1=6$):
${tmTraceTex(b15inc, "#101")}

**Trace on #11** ($3+1=4$, the # becomes the leading 1):
${tmTraceTex(b15inc, "#11")}

(Checked on every input #N with $|N|\le8$: the tape always ends holding $N+1$.)`,

  "6a": r`**Idea.** Each 0 must be matched by **one or two** 1s. For each 0, the PDA nondeterministically pushes either one X or two X's (the second through $q_x$); afterwards each 1 pops one X. If the 0s pushed $t$ symbols in total, $n\le t\le2n$, and the input is accepted iff it has exactly $t$ 1s. So the accepted strings are exactly $0^n1^m$ with $n\le m\le2n$.

${fig("b15-6a")}

**00111 is accepted** ($n=2$, $m=3$: the first 0 pushes one X, the second pushes two):
${pdaTraceTex(pdaAcceptingTrace(b15pda6a, "00111")!, pdaName)}

**0011111 is rejected** ($m=5>2n=4$). Two 0s push at most 4 X's. After at most four 1s the stack shows Z, there is no move on 1 with Z on top, and the fifth 1 can never be read. So no branch reads the whole input, and the string is rejected.

(The PDA was checked against $n\le m\le2n$ on every binary string up to length 12.)`,

  "6b": r`${grammarTex(b15g6b)}

Here $L=\{0^{2k} \mid k\ge0\}$ (any even number of 0s, including $\varepsilon$). Following HMU, build a CNF grammar for $L-\{\varepsilon\}$ and note separately that $\varepsilon\in L$.

**Step 1: ε-productions.** Nullable: ${b15g6bEps.nullable.join(", ")}. From $A\to BAB$ we get $BAB$, $AB$, $BA$, $BB$, $A$, $B$; drop the ε-rules:

${grammarTex(b15g6bEps.grammar)}

**Step 2: unit productions.** Unit pairs: ${b15g6bUnit.pairs.map(([a, b]) => `$(${a},${b})$`).join(", ")}. $A\to A$ is dropped; $A\to B$ is replaced by $B$'s body $00$:

${grammarTex(b15g6bUnit.grammar)}

**Step 3: useless symbols.** None (both $A$ and $B$ generate strings and are reachable).

**Step 4: CNF.** $Z\to0$; $A\to BAB$ becomes $A\to BC_1$, $C_1\to AB$:

${grammarTex(b15g6bCnf.grammar)}

The grammar generates every nonempty even run of 0s, and $\varepsilon$ is the only string of $L$ it omits. (Sipser's version would instead add a new start $S_0\to A\mid\varepsilon$.) (Each grammar was checked on all strings up to length 12.)`,

  "6c": r`**Idea.** Repeatedly cross off one 0 and one 1. If everything gets crossed off, accept; if a 0 (or 1) is crossed off but no partner can be found, reject.

1. $q_0$: scan right from the left end, skipping X's. On a blank: everything is crossed off, **accept**. On 0: cross it off (write X) and go to $q_1$. On 1: cross it off and go to $q_2$.
2. $q_1$: move right looking for a 1. Found: cross it off and go to $q_3$. Reaching the blank: no partner, **reject** (no move).
3. $q_2$: the same, looking for a 0.
4. $q_3$: move left to the left end (the blank), then right into $q_0$.

${tmTableMd(b15tmEq, tmName)}

**Trace on 0110** (accepted):
${tmTraceTex(b15tmEq, "0110", { stateTex: tmName })}

The machine halts on every input (each round crosses off two symbols, or stops), so it **decides** the language. (Checked on every binary string up to length 9.)`,

  "7a": r`**Yes: $A$ is decidable.** A TM can check connectivity by marking the vertices reachable from one vertex (a graph search) and seeing whether every vertex gets marked.

$M$ = "On input $\langle G\rangle$:

1. Check that the input is a valid encoding of an undirected graph: a list of vertices followed by a list of edges whose endpoints are listed vertices. If not, reject.
2. Mark the first vertex.
3. Repeat until no new vertex is marked: for each edge $\{u,v\}$, if exactly one of $u,v$ is marked, mark the other one.
4. If every vertex is marked, **accept**; otherwise **reject**."

**It always halts.** Step 3 marks at least one new vertex in each round, or stops; so it runs at most $|V|$ rounds, each scanning the edge list once. With $n=|V|$ and $m=|E|$ this is $O(nm)$ scans, polynomial in the input length. So $A$ is decidable (in fact $A\in$ P).

**Example.** $G$: vertices 1, 2, 3, 4; edges $\{1,2\},\{2,3\},\{3,4\}$, encoded $\langle G\rangle=(1,2,3,4)((1,2),(2,3),(3,4))$.

| Round | Marked |
|---|---|
| start | 1 |
| 1 | 1, 2, 3, 4 (edges are scanned in order, so the marks spread along the path) |

All four marked: accept. If the edge $\{3,4\}$ were removed, the marks would stop at $\{1,2,3\}$, vertex 4 would stay unmarked, and $M$ would reject.`,

  "7b": r`**Idea.** Push the first half; nondeterministically guess the middle; then pop and match the second half symbol by symbol. The stack reverses the first half, which is exactly what $w^R$ needs.

${fig("b15-7b")}

**Trace on 0110** ($w=01$):
${pdaTraceTex(pdaAcceptingTrace(b15wwr, "0110")!, pdaName)}

On 0101 every guess of the middle fails: after any split, the symbols popped do not match the remaining input. (Checked against "even-length palindrome" on every binary string up to length 10.)`,

  "7c": b22Solutions["7"],

  "8a": r`**Claim.** $A_{TM}=\{\langle M,w\rangle \mid M \text{ is a TM that accepts } w\}$ is undecidable. (Sipser's proof by diagonalization.)

**Proof.**

1. Suppose, for contradiction, that a TM $H$ decides $A_{TM}$:
$$
H(\langle M,w\rangle)=\begin{cases}\text{accept} & M \text{ accepts } w\\ \text{reject} & M \text{ does not accept } w.\end{cases}
$$
2. Build a TM $D$ that uses $H$ as a subroutine. $D$ = "On input $\langle M\rangle$, where $M$ is a TM: run $H$ on $\langle M,\langle M\rangle\rangle$, and output the **opposite**: if $H$ accepts, reject; if $H$ rejects, accept."
   So $D$ decides whether a machine accepts its **own description**, and does the opposite.
3. $D$ always halts, since $H$ does. Now run $D$ on its own description $\langle D\rangle$:
$$
D(\langle D\rangle)=\begin{cases}\text{accept} & D \text{ does not accept } \langle D\rangle\\ \text{reject} & D \text{ accepts } \langle D\rangle.\end{cases}
$$
4. Either way $D$ does the opposite of what it does: a contradiction. So $H$ cannot exist, and **$A_{TM}$ is undecidable**.

**The diagonal picture.** List the TMs $M_1,M_2,\dots$ and make a table whose entry $(i,j)$ is $H$'s answer on $\langle M_i,\langle M_j\rangle\rangle$. $D$ is built to differ from $M_i$ on input $\langle M_i\rangle$, the diagonal entry, for every $i$, so $D$ cannot be any $M_i$, yet $D$ is a TM. That is the contradiction.

($A_{TM}$ is Turing-recognisable: the universal TM simulates $M$ on $w$ and accepts if $M$ does. So it is RE but not decidable.)`,

  "8b": r`$w=w^R$ with $|w|$ divisible by 4 means $w=uu^R$ with $|u|$ **even**. Generate the palindrome from the outside in, two symbols (one on each side) per step, alternating between two variables so that the number of steps is even:
$$
\begin{aligned}
S &\to 0A0\mid1A1\mid\varepsilon\\
A &\to 0S0\mid1S1
\end{aligned}
$$
Each pass $S\to\cdot A\cdot\to\cdot\cdot S\cdot\cdot$ adds 4 symbols, and a derivation can only stop at $S\to\varepsilon$. So the lengths are $0,4,8,\dots$, and each symbol is matched with its mirror image.

${derivation(b15pal4, "01100110", "lm")}

(Checked on every binary string up to length 12.)`,

  "8c": r`Read the rules off the internal nodes of the tree: ⟨EXPR⟩ has children ⟨EXPR⟩ + ⟨TERM⟩ (and, in the left subtree, just ⟨TERM⟩); ⟨TERM⟩ has children ⟨TERM⟩ × ⟨FACTOR⟩ (and elsewhere just ⟨FACTOR⟩); ⟨FACTOR⟩ is a.
$$
\begin{aligned}
\langle\text{EXPR}\rangle &\to \langle\text{EXPR}\rangle+\langle\text{TERM}\rangle \mid \langle\text{TERM}\rangle\\
\langle\text{TERM}\rangle &\to \langle\text{TERM}\rangle\times\langle\text{FACTOR}\rangle \mid \langle\text{FACTOR}\rangle\\
\langle\text{FACTOR}\rangle &\to a
\end{aligned}
$$
(One may add $\langle\text{FACTOR}\rangle\to(\langle\text{EXPR}\rangle)$ for parentheses; it is not needed for this tree.)

${fig("b15-8c")}

The tree is the only parse tree of a + a × a in this grammar (it is the standard unambiguous expression grammar), and × sits lower in the tree than +, which is why × binds tighter.

${derivation(b15tree, "a+a*a", "lm")}`,
}

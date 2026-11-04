/* Sipser problems (Part A topics). Statements are paraphrased; every machine, grammar and regex is checked in machines/book.ts. */
import { faTableMd } from "@/lib/automata"
import { s14c, s120, s120Samples } from "../machines/book"
import type { BookProblem } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const Sipser = "Sipser" as const

const samples = (k: keyof typeof s120) => {
  const [yes, no] = s120Samples[k]
  const t = (w: string) => (w === "ε" ? r`$\varepsilon$` : `\`${w}\``)
  return `members ${yes.map(t).join(", ")}; non-members ${no.map(t).join(", ")}`
}

export const sipserProblems: BookProblem[] = [
  /* ───── intro ───── */
  {
    id: "bk-s0-5",
    topic: "intro",
    book: Sipser,
    ref: "Exercise 0.5",
    prompt: r`A set $C$ has $c$ elements. How many elements does its power set $\mathcal{P}(C)$ have? Justify the count.`,
    solution: r`$|\mathcal{P}(C)| = 2^c$.

A subset of $C$ is fixed by answering one yes/no question for each element: "is this element in the subset?". There are $c$ independent questions with 2 answers each, so there are $2 \cdot 2 \cdots 2 = 2^c$ ways to answer them, and each way gives a different subset. Every subset arises this way, including $\emptyset$ (all "no") and $C$ itself (all "yes").

Example: $C = \{a, b\}$ gives $\mathcal{P}(C) = \{\emptyset, \{a\}, \{b\}, \{a, b\}\}$, which has $2^2 = 4$ elements.`,
  },
  {
    id: "bk-s0-11",
    topic: "intro",
    book: Sipser,
    ref: "Problem 0.11",
    prompt: r`Let $S(n) = 1 + 2 + \cdots + n$ and $C(n) = 1^3 + 2^3 + \cdots + n^3$. Prove by induction on $n$ that (a) $S(n) = \tfrac12 n(n+1)$ and (b) $C(n) = \tfrac14(n^4 + 2n^3 + n^2)$, and conclude that $C(n) = S(n)^2$ for every $n$.`,
    solution: r`**(a)** *Basis* $n = 1$: $S(1) = 1 = \tfrac12 \cdot 1 \cdot 2$.

*Step.* Assume $S(k) = \tfrac12 k(k+1)$. Then
$$
S(k+1) = S(k) + (k+1) = \tfrac12 k(k+1) + (k+1) = \tfrac12 (k+1)(k+2),
$$
which is the formula for $n = k + 1$.

**(b)** *Basis* $n = 1$: $C(1) = 1 = \tfrac14(1 + 2 + 1)$.

*Step.* Assume $C(k) = \tfrac14(k^4 + 2k^3 + k^2) = \tfrac14 k^2(k+1)^2$. Then
$$
C(k+1) = \tfrac14 k^2(k+1)^2 + (k+1)^3 = \tfrac14 (k+1)^2\bigl(k^2 + 4k + 4\bigr) = \tfrac14 (k+1)^2(k+2)^2,
$$
and $\tfrac14 (k+1)^2(k+2)^2$ expands to $\tfrac14\bigl((k+1)^4 + 2(k+1)^3 + (k+1)^2\bigr)$, the formula for $n = k + 1$.

**Conclusion.** $S(n)^2 = \tfrac14 n^2(n+1)^2 = \tfrac14(n^4 + 2n^3 + n^2) = C(n)$.`,
  },

  /* ───── dfa ───── */
  {
    id: "bk-s1-4c",
    topic: "dfa",
    book: Sipser,
    ref: "Exercise 1.4(c)",
    prompt: r`Over $\{a, b\}$: $\{w \mid w \text{ has an even number of a's and one or two b's}\}$. Build simple DFAs for the two conditions and combine them with the product construction.`,
    solution: r`**Two small DFAs.**

- Even a's: states $e$ (even so far, accepting) and $o$; $a$ swaps them, $b$ loops.
- One or two b's: states $b_0, b_1, b_2, b_3$ counting b's, with $b_3$ meaning "three or more" (a trap); $a$ loops; accept $b_1, b_2$.

**Product.** A state is a pair (parity of a's, b-count). The first part moves on $a$, the second on $b$. Accept a pair when *both* parts accept: $(e, b_1)$ and $(e, b_2)$. This gives $2 \times 4 = 8$ states.

${faTableMd(s14c)}

${fig("bk-s1-4c")}

The pairs $(e, b_3)$ and $(o, b_3)$ can never accept, so they could be merged into one dead state (7 states); the plain product is what the construction asks for.`,
  },
  {
    id: "bk-s1-5b",
    topic: "dfa",
    book: Sipser,
    ref: "Exercise 1.5(b)",
    prompt: r`Over $\{a, b\}$: the strings that do not contain the substring $baba$. Build a DFA for the language that *does* contain $baba$, then turn it into one for the complement.`,
    solution: r`**DFA for "contains baba".** Each state remembers the longest suffix read so far that is a prefix of $baba$:

- $q_0$: none
- $q_1$: $b$
- $q_2$: $ba$
- $q_3$: $bab$
- $q_4$: $baba$ has been seen (a trap).

The failure moves follow the longest-suffix rule:

- In $q_1$ an extra $b$ keeps the suffix $b$, so it loops.
- In $q_2$ a $a$ gives $baa$, which has no useful suffix, so it goes back to $q_0$.
- In $q_3$ a $b$ gives $babb$, whose longest useful suffix is $b$, so it goes to $q_1$.

**Complement.** The machine is a complete DFA, so swapping accepting and non-accepting states recognises the complement: accept $q_0, q_1, q_2, q_3$ and reject only $q_4$.

${fig("bk-s1-5b")}`,
  },
  {
    id: "bk-s1-6c",
    topic: "dfa",
    book: Sipser,
    ref: "Exercise 1.6(c)",
    prompt: r`Over $\{0, 1\}$: $\{w \mid w \text{ contains the substring } 0101\}$. Give the state diagram of a DFA.`,
    solution: r`The states record the longest suffix of the input that is a prefix of $0101$: $\varepsilon$, $0$, $01$, $010$, and then "found" (a trap).

The tricky moves are the failures:

- After $01$ a $1$ gives $011$, so we go back to $\varepsilon$.
- After $010$ a $0$ gives $0100$, whose useful suffix is $0$.
- After $0$ another $0$ stays in $0$.

${fig("bk-s1-6c")}`,
  },
  {
    id: "bk-s1-6i",
    topic: "dfa",
    book: Sipser,
    ref: "Exercise 1.6(i)",
    prompt: r`Over $\{0, 1\}$: $\{w \mid \text{every odd position of } w \text{ is a } 1\}$ (positions counted from 1). Give the state diagram of a DFA.`,
    solution: r`Track the parity of the *next* position to be read.

- **odd** (start): the next symbol is at an odd position. Reading $1$ goes to **even**; reading $0$ breaks the rule, so it goes to the dead state $d$.
- **even**: any symbol is fine, and either one goes back to **odd**.

Both live states accept, so $\varepsilon$, $1$, $10$, $11$ and $1010$ are in, while $0$ and $100$ are out.

${fig("bk-s1-6i")}`,
  },
  {
    id: "bk-s1-13",
    topic: "dfa",
    book: Sipser,
    ref: "Exercise 1.13",
    prompt: r`Let $F$ be the set of strings over $\{0, 1\}$ that contain no two 1s separated by an odd number of symbols. Give a DFA with five states for $F$.`,
    solution: r`**Restate the condition.** Two 1s at positions $i < j$ have $j - i - 1$ symbols between them. That is odd exactly when $i$ and $j$ have the *same parity*. So $w \in F$ iff no two 1s sit at positions of equal parity.

**State $XY$.** Two bits:

- $X$: a 1 has already appeared at a position with the same parity as the next position.
- $Y$: a 1 has appeared at the other parity.

Reading a symbol moves us one position, so the two parities swap roles.

- Reading $1$ when $X = 1$ completes a bad pair, so go to the dead state $d$.
- Otherwise the new state is $X' = Y$, $Y' = X \lor (\text{symbol} = 1)$.

The start state is $00$. All four states $00, 01, 10, 11$ accept; only $d$ rejects. That makes five states.

${fig("bk-s1-13")}

*Check:* $101 \notin F$, since the 1s at positions 1 and 3 have one symbol between them. The run is $00 \xrightarrow{1} 01 \xrightarrow{0} 10 \xrightarrow{1} d$. On the other hand $1001 \in F$ (two symbols between): $00 \to 01 \to 10 \to 01 \to 11$.`,
  },

  /* ───── nfa ───── */
  {
    id: "bk-s1-7a",
    topic: "nfa",
    book: Sipser,
    ref: "Exercise 1.7(a)",
    prompt: r`Give an NFA with three states for the strings over $\{0, 1\}$ that end with $00$.`,
    solution: r`Stay in $q_0$ on anything. On a $0$, guess that it is the second-to-last symbol and move to $q_1$. A second $0$ reaches the accepting $q_2$, which has no outgoing moves, so the branch dies if more input follows.

${fig("bk-s1-7a")}`,
  },
  {
    id: "bk-s1-7e",
    topic: "nfa",
    book: Sipser,
    ref: "Exercise 1.7(e)",
    prompt: r`Give an NFA with three states for $0^*1^*0^+$ over $\{0, 1\}$.`,
    solution: r`One state per block:

- $q_1$ loops on $0$ for the $0^*$ block.
- An $\varepsilon$-move goes to $q_2$, which loops on $1$ for $1^*$.
- A $0$ moves to the accepting $q_3$, which loops on $0$, so $0^+$ is at least one $0$.

The $\varepsilon$-move lets the $1^*$ block be empty: for example $00$ is read as $q_1 \xrightarrow{0} q_1 \xrightarrow{\varepsilon} q_2 \xrightarrow{0} q_3$.

${fig("bk-s1-7e")}`,
  },
  {
    id: "bk-s1-7f",
    topic: "nfa",
    book: Sipser,
    ref: "Exercise 1.7(f)",
    prompt: r`Give an NFA with three states for $1^*(001^+)^*$ over $\{0, 1\}$.`,
    solution: r`$q_1$ is the start state and is accepting; it loops on $1$, which covers $1^*$. One round of $001^+$ is $q_1 \xrightarrow{0} q_2 \xrightarrow{0} q_3 \xrightarrow{1} q_1$. Any further 1s of the $1^+$ are absorbed by the loop on $q_1$.

${fig("bk-s1-7f")}

This NFA happens to be deterministic, apart from missing moves that would go to a dead state.`,
  },

  /* ───── closure ───── */
  {
    id: "bk-s1-8a",
    topic: "closure",
    book: Sipser,
    ref: "Exercise 1.8(a)",
    prompt: r`Using the union construction, build an NFA for the union of the languages of Exercise 1.6(a), $\{w \mid w \text{ begins with 1 and ends with 0}\}$, and 1.6(b), $\{w \mid w \text{ contains at least three 1s}\}$.`,
    solution: r`Take the two DFAs, rename their states apart, and add a new start state $q_0$ with $\varepsilon$-moves to both old start states. The accepting states are those of both machines.

- **1.6(a)**: $s \xrightarrow{1} o$, $s \xrightarrow{0} d$ (dead); $o$ loops on $1$, $o \xrightarrow{0} z$; $z$ loops on $0$, $z \xrightarrow{1} o$. Accept $z$.
- **1.6(b)**: $c_0 \to c_1 \to c_2 \to c_3$ on 1s, with every state looping on $0$ and $c_3$ also looping on $1$. Accept $c_3$.

${fig("bk-s1-8a")}

The result has $1 + 4 + 4 = 9$ states.`,
  },
  {
    id: "bk-s1-10a",
    topic: "closure",
    book: Sipser,
    ref: "Exercise 1.10(a)",
    prompt: r`Using the star construction, build an NFA for $A^*$, where $A$ is the language of Exercise 1.6(b) (at least three 1s).`,
    solution: r`Start from the DFA $c_0 \to c_1 \to c_2 \to c_3$ for $A$. Make two additions:

- A new start state $q_0$ that is accepting (so $\varepsilon \in A^*$), with an $\varepsilon$-move to $c_0$.
- An $\varepsilon$-move from the accepting state $c_3$ back to $c_0$, to start another piece.

${fig("bk-s1-10a")}

As a check on the meaning: a concatenation of strings that each have three or more 1s has three or more 1s. Conversely, any such string is already one piece. So $A^* = \{\varepsilon\} \cup A$, and the verifier confirms the NFA accepts exactly that.`,
  },
  {
    id: "bk-s1-31",
    topic: "closure",
    book: Sipser,
    ref: "Problem 1.31",
    prompt: r`For a language $A$ let $A^R = \{w^R \mid w \in A\}$. Show that if $A$ is regular then so is $A^R$. Illustrate the construction on the DFA for "contains $0101$".`,
    solution: r`**Construction.** Let $M = (Q, \Sigma, \delta, q_0, F)$ be a DFA for $A$. Build an NFA $N$:

- Use the same states, with every arrow reversed: if $\delta(p, a) = q$, then $N$ has $q \xrightarrow{a} p$.
- Add a new start state $r$ with $\varepsilon$-moves to every state of $F$.
- The only accepting state is $q_0$.

**Why it works.** $M$ has a path $q_0 \xrightarrow{w_1} \cdots \xrightarrow{w_n} f$ with $f \in F$ exactly when $N$ has the path $r \xrightarrow{\varepsilon} f \xrightarrow{w_n} \cdots \xrightarrow{w_1} q_0$. So $N$ accepts $w^R$ iff $M$ accepts $w$. Thus $L(N) = A^R$. An NFA language is regular, so $A^R$ is regular.

**Example.** Reversing the DFA for "contains $0101$" (Exercise 1.6(c)) gives an NFA for "contains $1010$", since the reverse of $0101$ is $1010$.

${fig("bk-s1-31")}`,
  },

  /* ───── regex ───── */
  {
    id: "bk-s1-18",
    topic: "regex",
    book: Sipser,
    ref: "Exercise 1.18(c), (i)",
    prompt: r`Over $\Sigma = \{0, 1\}$ give regular expressions for (c) $\{w \mid w \text{ contains } 0101\}$ and (i) $\{w \mid \text{every odd position of } w \text{ is a } 1\}$.`,
    solution: r`**(c)** $\Sigma^*0101\Sigma^*$, that is, $(0 \cup 1)^*0101(0 \cup 1)^*$.

**(i)** $(1\Sigma)^*(\varepsilon \cup 1)$. Each $1\Sigma$ covers an odd position (forced to be 1) and the even position after it (free). The optional final $1$ allows odd length.

Both expressions were compared with the definitions on every string up to length 10.`,
  },
  {
    id: "bk-s1-20",
    topic: "regex",
    book: Sipser,
    ref: "Exercise 1.20(a), (b), (f), (h)",
    prompt: r`Over $\Sigma = \{a, b\}$ give two members and two non-members of each language: (a) $a^*b^*$, (b) $a(ba)^*b$, (f) $aba \cup bab$, (h) $(a \cup ba \cup bb)\Sigma^*$.`,
    solution: r`- **(a)** ${samples("a")}. (Any $a$ after a $b$ breaks the form.)
- **(b)** ${samples("b")}. (Every member starts with $a$, ends with $b$ and alternates.)
- **(f)** ${samples("f")}. (Exactly two members exist.)
- **(h)** ${samples("h")}. (The language is every string except $\varepsilon$ and $b$: a nonempty string starting with $a$, or any string of length at least 2 starting with $b$.)

Each sample was tested against the expression.`,
  },
  {
    id: "bk-s1-22",
    topic: "regex",
    book: Sipser,
    ref: "Exercise 1.22",
    prompt: r`Comments in a language are delimited by /# and #/. Let $C$ be the set of valid comments over $\Sigma = \{a, b, /, \#\}$: strings that begin with /#, end with #/, and contain no #/ in between. (a) Give a DFA for $C$. (b) Give a regular expression for $C$.`,
    solution: r`**(a)** States:

- $s_0$: start
- $s_1$: saw /
- $s_2$: inside the comment, last symbol not #
- $s_3$: inside, last symbol #
- $s_4$: closed (accepting)
- $d$: dead.

Inside, a # moves to $s_3$, and more #s stay there. From $s_3$ a / closes the comment, and $a$ or $b$ goes back to $s_2$. Any symbol after closing is fatal.

${fig("bk-s1-22")}

**(b)**
$$
/\#\,\bigl(a \cup b \cup / \cup \#^+(a \cup b)\bigr)^*\,\#^+/
$$
The body is a sequence of pieces, each $a$, $b$, $/$, or a run of #s followed by a letter, so no # is followed by a /. The final $\#^+/$ closes the comment.

Both the DFA and the expression were tested against the definition on all strings up to length 7.`,
  },

  /* ───── pumping-regular ───── */
  {
    id: "bk-s1-29c",
    topic: "pumping-regular",
    book: Sipser,
    ref: "Problem 1.29(c)",
    prompt: r`Use the pumping lemma to show that $A_3 = \{a^{2^n} \mid n \ge 0\}$ is not regular.`,
    solution: r`Assume $A_3$ is regular with pumping length $p$. Take $s = a^{2^p} \in A_3$; then $|s| = 2^p \ge p$.

Any split $s = xyz$ with $|xy| \le p$ and $|y| \ge 1$ has $y = a^k$ with $1 \le k \le p$. Pump up with $i = 2$:
$$
|xy^2z| = 2^p + k, \qquad 2^p < 2^p + k \le 2^p + p < 2^p + 2^p = 2^{p+1}.
$$
The length lies strictly between two consecutive powers of 2, so $xy^2z \notin A_3$. This contradicts the lemma, so $A_3$ is not regular.

(The strict step uses $p < 2^p$, which holds for every $p \ge 1$.)`,
  },
  {
    id: "bk-s1-30",
    topic: "pumping-regular",
    book: Sipser,
    ref: "Problem 1.30",
    prompt: r`Find the error in this "proof" that $0^*1^*$ is not regular: assume it is regular with pumping length $p$; take $s = 0^p1^p$, which is in $0^*1^*$; the textbook example for $\{0^n1^n\}$ shows that $s$ cannot be pumped; contradiction.`,
    solution: r`The example shows that $s$ cannot be pumped *while staying inside* $\{0^n1^n\}$. The lemma here is about $0^*1^*$, a different and larger language, and inside $0^*1^*$ the string $s$ *can* be pumped.

Take $x = \varepsilon$, $y = 0$, $z = 0^{p-1}1^p$. Then $|xy| = 1 \le p$ and $|y| = 1$, and $xy^iz = 0^{p-1+i}1^p \in 0^*1^*$ for every $i \ge 0$.

So no contradiction arises. Indeed $0^*1^*$ is regular: it is a regular expression.`,
  },

  /* ───── cfg ───── */
  {
    id: "bk-s2-6b",
    topic: "cfg",
    book: Sipser,
    ref: "Exercise 2.6(b)",
    prompt: r`Give a CFG for the complement of $\{a^nb^n \mid n \ge 0\}$ over $\{a, b\}$.`,
    solution: r`A string is *not* of the form $a^nb^n$ in one of three ways:

- It has the form $a^ib^j$ with $i > j$.
- It has the form $a^ib^j$ with $i < j$.
- It is not of the form $a^*b^*$ at all, which means it contains $ba$.

$$
\begin{aligned}
S &\to X \mid Z \mid D\\
X &\to aXb \mid aY \qquad Y \to aY \mid \varepsilon\\
Z &\to aZb \mid Wb \qquad W \to Wb \mid \varepsilon\\
D &\to R\,ba\,R \qquad R \to aR \mid bR \mid \varepsilon
\end{aligned}
$$

- $X$ matches $a$'s with $b$'s from the outside in and then insists on at least one extra $a$.
- $Z$ does the same with extra $b$'s.
- $D$ is any string with $ba$ inside.

The grammar was compared with the definition on all strings up to length 9.`,
  },
  {
    id: "bk-s2-6d",
    topic: "cfg",
    book: Sipser,
    ref: "Exercise 2.6(d)",
    prompt: r`Over $\{a, b, \#\}$ give a CFG for $\{x_1\#x_2\#\cdots\#x_k \mid k \ge 1,\ \text{each } x_i \in \{a,b\}^*, \text{ and } x_i = x_j^R \text{ for some } i, j\}$.`,
    solution: r`Split the string into three parts:

- A prefix of whole blocks, possibly empty.
- A middle part $u \cdots u^R$, where $u$ is the matched pair.
- A suffix of whole blocks, possibly empty.

$$
\begin{aligned}
S &\to LMR\\
L &\to \varepsilon \mid X\# \qquad R \to \varepsilon \mid \#X\\
X &\to aX \mid bX \mid \#X \mid \varepsilon\\
M &\to aMa \mid bMb \mid N\\
N &\to \varepsilon \mid a \mid b \mid \# \mid \#T\# \qquad T \to aT \mid bT \mid \#T \mid \varepsilon
\end{aligned}
$$

$M$ generates $u\,N\,u^R$ for $u \in \{a, b\}^*$, and $N$ decides what sits between the two copies.

- $N \to \#$ gives neighbouring blocks: $x_i = u$ and $x_{i+1} = u^R$.
- $N \to \#T\#$ puts other blocks between them.
- $N \to \varepsilon \mid a \mid b$ covers $i = j$, where $x_i = x_i^R$ is a palindrome. The definition does not forbid $i = j$.

The grammar was compared with the definition on all strings up to length 6.`,
  },
  {
    id: "bk-s2-13",
    topic: "cfg",
    book: Sipser,
    ref: "Exercise 2.13",
    prompt: r`$G$ has variables $S, T, U$, terminals $0, \#$ and rules $S \to TT \mid U$, $T \to 0T \mid T0 \mid \#$, $U \to 0U00 \mid \#$. (a) Describe $L(G)$ in English. (b) Prove that $L(G)$ is not regular.`,
    solution: r`**(a)**

- $T$ generates $0^i\#0^j$ for any $i, j \ge 0$, so $TT$ generates every string with exactly two #s: $0^i\#0^j\#0^k$.
- $U$ generates $0^n\#0^{2n}$.

So $L(G)$ is the set of strings with exactly two #s, together with the strings with one # that have twice as many 0s after it as before it.

**(b)** Suppose $L(G)$ were regular. $0^*\#0^*$ is regular, and regular languages are closed under intersection, so
$$
L(G) \cap 0^*\#0^* = \{0^n\#0^{2n} \mid n \ge 0\}
$$
would be regular. It is not. Pump $s = 0^p\#0^{2p}$: since $|xy| \le p$, $y$ is a block of 0s before the #. Pumping down ($i = 0$) leaves fewer than $p$ 0s before the # but still $2p$ after. Contradiction, so $L(G)$ is not regular.

(The intersection equality and the pumping argument were both brute-force checked for small cases.)`,
  },

  /* ───── pumping-cfl ───── */
  {
    id: "bk-s2-30c",
    topic: "pumping-cfl",
    book: Sipser,
    ref: "Problem 2.30(c)",
    prompt: r`Use the pumping lemma to show that $\{w\#t \mid w \text{ is a substring of } t,\ w, t \in \{a, b\}^*\}$ is not context free.`,
    solution: r`Assume it is context free with pumping length $p$. Take $s = a^pb^p\#a^pb^p$, which is in the language with $w = t$. Let $s = uvxyz$ with $|vxy| \le p$ and $|vy| \ge 1$.

1. **$v$ or $y$ contains #.** Then $uv^0xy^0z$ has no #, so it is out.
2. **$vxy$ lies entirely left of #.** Pump up: $uv^2xy^2z = w'\#t$ with $|w'| > 2p = |t|$. A longer string cannot be a substring, so it is out.
3. **$vxy$ lies entirely right of #.** Pump down: $t$ shrinks below $2p = |w|$, so it is out.
4. **$vxy$ straddles #.** Since $|vxy| \le p$, $v$ lies inside the $b^p$ of $w$ and $y$ inside the $a^p$ of $t$.
   - If $y \ne \varepsilon$, pump down: $t$ becomes $a^{p-k}b^p$ with $k \ge 1$, but $w$ still starts with $a^p$. The new $t$ contains no run of $p$ a's, so it is out.
   - If $y = \varepsilon$, then $v \ne \varepsilon$. Pump up: $|w|$ grows past $|t|$, so it is out.

Every split fails, so the language is not context free.`,
  },
  {
    id: "bk-s2-31",
    topic: "pumping-cfl",
    book: Sipser,
    ref: "Problem 2.31",
    prompt: r`Let $B$ be the palindromes over $\{0, 1\}$ with equally many 0s and 1s. Show that $B$ is not context free.`,
    solution: r`Assume $B$ is context free with pumping length $p$. Take $s = 0^p1^{2p}0^p \in B$: it is a palindrome with $2p$ 0s and $2p$ 1s. Let $s = uvxyz$ with $|vxy| \le p$, $|vy| \ge 1$, and pump down to $uxz$.

- $vxy$ cannot touch both 0-blocks, since they are $2p$ symbols apart.
- **$vy$ has only 1s.** Then $uxz = 0^p1^{2p-k}0^p$ has fewer 1s than 0s, so it is out.
- **$vy$ has some 0s.** They all come from one 0-block, so the first and last runs of 0s now differ in length. The string is no longer a palindrome, so it is out.

Every split fails, so $B$ is not context free.`,
  },
  {
    id: "bk-s2-32",
    topic: "pumping-cfl",
    book: Sipser,
    ref: "Problem 2.32",
    prompt: r`Over $\{1, 2, 3, 4\}$ let $C = \{w \mid \#_1(w) = \#_2(w) \text{ and } \#_3(w) = \#_4(w)\}$. Show that $C$ is not context free.`,
    solution: r`Assume $C$ is context free with pumping length $p$. Take $s = 1^p3^p2^p4^p \in C$ and split it as $uvxyz$ with $|vxy| \le p$ and $|vy| \ge 1$.

- The 1s and the 2s are separated by $3^p$, so $vxy$ cannot contain both.
- Likewise $vxy$ cannot contain both 3s and 4s.

$vy$ contains at least one symbol. If it contains a 1, it contains no 2, so pumping down ($i = 0$) makes $\#_1 < \#_2$. The same holds with the roles of 1 and 2 swapped, and with 3 and 4. In every case $uxz \notin C$, so $C$ is not context free.

(The point of the order $1\,3\,2\,4$ is to keep each pair far apart. With $1^p2^p3^p4^p$, a $vxy$ such as $1^k2^k$ would pump safely.)`,
  },

  /* ───── pda ───── */
  {
    id: "bk-s2-7b",
    topic: "pda",
    book: Sipser,
    ref: "Exercise 2.7 (for 2.6(b))",
    prompt: r`Give an informal description and a state diagram of a PDA for the complement of $\{a^nb^n \mid n \ge 0\}$ over $\{a, b\}$.`,
    solution: r`The PDA guesses which way the input fails to be $a^nb^n$.

1. Push $\text{\textdollar}$, then push an $A$ for every $a$ ($q_a$). Then pop one $A$ per $b$ ($q_b$).
2. **More a's.** If the input ends with $A$'s left on the stack, take $\varepsilon, A \to A$ into the accepting $q_x$. It can also empty the rest with $\varepsilon, A \to \varepsilon$.
3. **More b's.** If a $b$ arrives when $\text{\textdollar}$ is on top, go to the accepting $q_y$, which reads further b's.
4. **Out of order.** From any b-reading state, a nondeterministic branch goes to $q_z$ on a $b$. $q_z$ reads more b's, and an $a$ takes it to the accepting $q_{acc}$, which reads anything. That branch has found "ba".

${fig("bk-s2-7b")}

The PDA was compared with the definition on all strings up to length 9.`,
  },
  {
    id: "bk-s2-12",
    topic: "pda",
    book: Sipser,
    ref: "Exercise 2.12",
    prompt: r`Convert the CFG $R \to XRX \mid S$, $S \to aTb \mid bTa$, $T \to XTX \mid X \mid \varepsilon$, $X \to a \mid b$ (Exercise 2.3) to an equivalent PDA, using the construction from the proof that every CFL has a PDA.`,
    solution: r`The construction has three main states:

- $q_{start} \xrightarrow{\varepsilon, \varepsilon \to \text{\textdollar}R} q_{loop}$, which pushes $\text{\textdollar}$ and then the start variable $R$.
- $q_{loop} \xrightarrow{\varepsilon, \text{\textdollar} \to \varepsilon} q_{accept}$.
- Self-loops on $q_{loop}$:
  - for each rule $A \to w$: $\varepsilon, A \to w$, pushing $w$ so that its first symbol ends up on top;
  - for each terminal: $a, a \to \varepsilon$ and $b, b \to \varepsilon$.

The rule loops on $q_{loop}$ are
$$
\begin{gathered}
\varepsilon, R \to XRX \quad \varepsilon, R \to S \quad \varepsilon, S \to aTb \quad \varepsilon, S \to bTa\\
\varepsilon, T \to XTX \quad \varepsilon, T \to X \quad \varepsilon, T \to \varepsilon \quad \varepsilon, X \to a \quad \varepsilon, X \to b
\end{gathered}
$$

In a strict diagram each multi-symbol push such as $XRX$ is a chain of single pushes through fresh states. Sipser writes it as one shorthand arrow.

**Checked:** the same rules as a one-state PDA (HMU's form of this construction, which is what the verifier runs) accept exactly $L(G)$ on all strings up to length 7.`,
  },
]

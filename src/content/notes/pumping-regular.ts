const r = String.raw

export const pumpingRegularNote = r`
## Why finite memory must repeat

Consider $B=\{0^n1^n \mid n\ge0\}$. To accept $00001111$ a machine must remember that it saw exactly four 0's. A DFA has a fixed number of states, say $p$. What happens on $p+1$ zeros?

**Pigeonhole principle.** If $m+1$ pigeons go into $m$ holes, some hole gets two. A DFA is a directed graph and reading a string is a walk in it. Reading a string of length at least $p$ visits at least $p+1$ states counting the start, so **some state is visited twice**.

A walk that revisits a state contains a **cycle**. Split the string as $s=xyz$:

- $x$: from the start to the first visit of the repeated state,
- $y$: once round the cycle, back to that state,
- $z$: from the repeated state to the end (an accepting state).

**The pump.** The DFA cannot tell how many times it went round the cycle. If it accepts $xyz$, it must also accept $xz$ (zero laps), $xyyz$, $xyyyz$, and so on.

## The pumping lemma (Sipser)

> **Pumping lemma.** If $A$ is a regular language, then there is a number $p$ (the **pumping length**) such that every string $s\in A$ with $|s|\ge p$ can be divided into three pieces $s=xyz$ satisfying:
>
> 1. for each $i\ge0$, $xy^iz\in A$,
> 2. $|y|>0$,
> 3. $|xy|\le p$.

- **Why $|y|>0$?** The cycle must consume at least one symbol; otherwise nothing is pumped.
- **Why $|xy|\le p$?** By the pigeonhole principle, the first repeated state already appears within the first $p$ steps. In proofs this is what lets *you* know where $y$ is: it lies inside the first $p$ symbols of $s$, so choosing $s$ well traps $y$ in a region you understand.

### Proof

Let $M=(Q,\Sigma,\delta,q_1,F)$ be a DFA recognising $A$, and let $p=|Q|$ be its number of states.

1. Take any $s=s_1s_2\cdots s_n\in A$ with $n\ge p$. Let $r_1,r_2,\dots,r_{n+1}$ be the states $M$ passes through on $s$: $r_1=q_1$ and $r_{i+1}=\delta(r_i,s_i)$. Since $s\in A$, $r_{n+1}\in F$.
2. Look at the first $p+1$ states $r_1,\dots,r_{p+1}$ (they exist since $n+1\ge p+1$). There are only $p$ different states, so by the pigeonhole principle two of them are equal: $r_j=r_\ell$ with $j<\ell\le p+1$.
3. Let $x=s_1\cdots s_{j-1}$, $y=s_j\cdots s_{\ell-1}$, $z=s_\ell\cdots s_n$.
4. $x$ takes $M$ from $r_1$ to $r_j$; $y$ takes it from $r_j$ back to $r_\ell=r_j$; $z$ takes it from $r_j$ to $r_{n+1}\in F$.
5. So $M$ accepts $xy^iz$ for every $i\ge0$: after $x$ it is in $r_j$, each copy of $y$ returns it to $r_j$, and $z$ then reaches $r_{n+1}$. Condition 1 holds.
6. $j\neq\ell$, so $|y|=\ell-j>0$. Condition 2 holds.
7. $\ell\le p+1$, so $|xy|=\ell-1\le p$. Condition 3 holds. $\blacksquare$

## Using the lemma: the logic

The lemma is an implication: **if** $A$ is regular **then** $A$ has the pumping property. By contraposition, if $A$ does **not** have the pumping property, $A$ is not regular.

**It only proves non-regularity.** The converse is false: some non-regular languages have the pumping property. Example: $L=\{a^ib^jc^k \mid i=0 \text{ or } j=k\}$.

- **$L$ pumps with $p=1$.** Take $y$ to be the first symbol. If $s$ starts with a, every $s\in L$ starting with a has $j=k$, and adding or removing a's keeps $j=k$ (or makes $i=0$), so $xy^iz\in L$. If $s$ starts with b or c, then $i=0$, and pumping that symbol keeps $i=0$, so $xy^iz\in L$.
- **$L$ is not regular.** $L\cap ab^*c^*=\{ab^jc^j\}$, which is not regular.

So passing the pumping test proves nothing; failing it proves non-regularity. To show a language **is** regular, build a DFA, NFA or regular expression, or use closure properties.

## The adversary game

Negating the lemma gives nested quantifiers: for **every** $p$ there is **some** $s\in A$ with $|s|\ge p$ such that for **every** split $s=xyz$ with $|y|>0$ and $|xy|\le p$ there is **some** $i\ge0$ with $xy^iz\notin A$. Play it as a game against a demon who claims $A$ is regular:

| Turn | Who | Action |
|---|---|---|
| 1 | Demon | picks the pumping length $p$ (unknown to you: treat it as a variable) |
| 2 | **You** | pick a string $s\in A$ with $\lvert s\rvert\ge p$ |
| 3 | Demon | splits $s=xyz$ any way with $\lvert y\rvert>0$ and $\lvert xy\rvert\le p$ |
| 4 | **You** | pick $i\ge0$ with $xy^iz\notin A$ |

**You do not choose the split.** Your $i$ must work for **every** split the demon could make. That is why most proofs use $|xy|\le p$ to say exactly what $y$ can look like.

## The 5-step proof template

1. **Assume** for contradiction that $L$ is regular.
2. **Let $p$** be the pumping length given by the lemma. Do not give it a value.
3. **Choose** a specific $s\in L$ with $|s|\ge p$, written in terms of $p$. Check both $s\in L$ and $|s|\ge p$.
4. **Split.** By the lemma, $s=xyz$ with $|y|>0$ and $|xy|\le p$. Use $|xy|\le p$ to say what $y$ must be, for **every** such split.
5. **Pump.** Choose $i$, show $xy^iz\notin L$, and conclude that $L$ is not regular.

## Worked examples from the slides

### $L_1=\{0^n1^n \mid n\ge0\}$

1. Assume $L_1$ is regular; let $p$ be its pumping length.
2. Choose $s=0^p1^p$. Then $s\in L_1$ and $|s|=2p\ge p$.
3. For every split with $|xy|\le p$, both $x$ and $y$ lie in the first block of 0's, so $y=0^k$ with $1\le k\le p$.
4. Take $i=0$: $xz=0^{p-k}1^p$. Since $k>0$, $p-k\neq p$, so $xz\notin L_1$.
5. Contradiction; $L_1$ is not regular.

Pumping can only add or remove early 0's without touching the 1's.

### Palindromes over $\{a,b\}$

Choose $s=a^pba^p$, a palindrome with $|s|=2p+1\ge p$. $|xy|\le p$ forces $y=a^k$, $1\le k\le p$, inside the first block. Then $xy^0z=a^{p-k}ba^p$: the two sides of the b differ, so it is not a palindrome. Contradiction.

### $L_3=\{a^nb^nc^n \mid n\ge0\}$

Choose $s=a^pb^pc^p$. $y=a^k$ with $1\le k\le p$. Take $i=2$: $xy^2z=a^{p+k}b^pc^p$ has counts $p+k$, $p$, $p$, not all equal. Contradiction.

### $L_4=\{w\#w \mid w\in\{0,1\}^*\}$

Choose $s=0^p1\#0^p1$; $|s|=2p+3\ge p$. $y=0^k$ in the first block. $xy^0z=0^{p-k}1\#0^p1$: the words on the two sides of # differ. Contradiction.

### $L_5=\{a^{n^2} \mid n\ge0\}$

Choose $s=a^{p^2}$ ($p\ge1$). Every split has $y=a^k$ with $1\le k\le p$. Take $i=2$: the length is $p^2+k$, and
$$
p^2<p^2+k\le p^2+p<p^2+2p+1=(p+1)^2.
$$
$p^2+k$ lies strictly between consecutive squares, so it is not a square and $xy^2z\notin L_5$. Contradiction.

### What the five examples teach

| Language | What must be remembered | What pumping breaks |
|---|---|---|
| $0^n1^n$ | one count | equality of two blocks |
| palindromes | distant symbols | left–right symmetry |
| $a^nb^nc^n$ | three counts | three-way synchronisation |
| $w\#w$ | a whole word | exact copying |
| $a^{n^2}$ | special lengths | arithmetic spacing |

Every proof uses the same five moves: assume, let $p$, choose $s$, trap $y$, pump.

## More examples

| Language | Choose $s$ | Forced $y$ | Pump and contradiction |
|---|---|---|---|
| $\{a^{n+1}b^n\}$ | $a^{p+1}b^p$ | $a^k$, $k>0$ | $i=0$: $a^{p+1-k}b^p$ no longer has exactly one more a |
| $\{a^mb^n : m>n\}$ | $a^{p+1}b^p$ | $a^k$, $k>0$ | $i=0$: $p+1-k\le p$, so a's no longer outnumber b's |
| $\{a^nb^{2n}\}$ | $a^pb^{2p}$ | $a^k$ | $i=0$: counts $p-k$ and $2p$, but $2p\ne2(p-k)$ |
| $\{a^mb^nc^{m+n}\}$ | $a^pb^pc^{2p}$ | $a^k$ | $i=0$: first two blocks total $2p-k$, last block $2p$ |
| $\{a^ib^jc^k : i=j \text{ or } j=k\}$ | $a^pb^pc^{p+1}$ | $a^k$ | $i=0$: $p-k\ne p$ and $p\ne p+1$, neither equality holds |
| $\{u\#v : \lvert u\rvert=\lvert v\rvert\}$ | $0^p\#1^p$ | $0^k$ | $i=0$: side lengths $p-k$ and $p$ |
| $\{a^{2^n}\}$ | $a^{2^m}$, $2^m>p$ | $a^k$, $1\le k\le p$ | $i=2$: $2^m<2^m+k<2^{m+1}$, not a power of two |
| $\{a^mb^n : m=n \text{ or } m=2n\}$ | $a^pb^p$ | $a^k$ | $i=0$: $p-k$ is neither $p$ nor $2p$ |
| $\{a^mb^{m+n}c^n\}$ | $a^pb^{2p}c^p$ | $a^k$ | $i=0$: outer blocks total $2p-k$, middle $2p$ |

## Primes, composites and Fibonacci lengths

### $L_{prime}=\{a^t \mid t \text{ is prime}\}$

1. Assume $L_{prime}$ is regular; let $p$ be its pumping length.
2. There are infinitely many primes, so choose a prime $q>p$ and $s=a^q$. Then $s\in L_{prime}$ and $|s|=q\ge p$.
3. Every valid split has $y=a^k$ with $1\le k\le p$.
4. Take $i=q+1$. One copy of $y$ becomes $q+1$ copies, adding $qk$ symbols:
$$
|xy^{q+1}z|=q+qk=q(k+1).
$$
5. $q\ge2$ and $k+1\ge2$, so $q(k+1)$ is composite and $xy^{q+1}z\notin L_{prime}$. Contradiction.

**Common errors.**

- $p$ is arbitrary; it need not be prime, so do **not** choose $s=a^p$. Choose a prime $q>p$ after receiving $p$.
- You do not choose $y$; you only know $y=a^k$, $1\le k\le p$.
- Pumping to $i$ gives length $q+(i-1)k$, not $ik$.
- $i$ may depend on $p$ and $s$; it need not be a constant.

Why not $i=0$ or $i=2$? Their lengths $q-k$ and $q+k$ can themselves be prime, so they do not work for every split. $i=q+1$ always gives a composite length.

### $L_{comp}=\{a^t \mid t \text{ is composite}\}$, by closure

0 and 1 are neither prime nor composite, so
$$
a^*=L_{prime}\cup L_{comp}\cup\{\varepsilon,a\}.
$$
If $L_{comp}$ were regular, then $L_{comp}\cup\{\varepsilon,a\}$ would be regular (a finite language is regular), and so would its complement within $a^*$:
$$
a^*\setminus\big(L_{comp}\cup\{\varepsilon,a\}\big)=L_{prime},
$$
which is not regular. So $L_{comp}$ is not regular. Forgetting lengths 0 and 1 is the usual mistake: $a^*\setminus L_{comp}=L_{prime}\cup\{\varepsilon,a\}$, not $L_{prime}$.

### $L_{Fib}=\{a^{F_n} \mid n\ge0\}$ ($F_0=0$, $F_1=1$, $F_{n+1}=F_n+F_{n-1}$)

Choose $m\ge3$ with $F_{m-1}>p$, and $s=a^{F_m}$; then $|s|=F_m>F_{m-1}>p$. Every split has $y=a^k$, $1\le k\le p$. Take $i=2$: since $k\ge1$ and $k\le p<F_{m-1}$,
$$
F_m<F_m+k<F_m+F_{m-1}=F_{m+1}.
$$
$F_m+k$ lies strictly between consecutive Fibonacci numbers. Contradiction. Choosing only $F_m>p$ is not enough: the proof needs $k<F_{m-1}$. Pumping down instead may land on another Fibonacci number.

## When pumping is awkward, use closure

If $L$ were regular and $R$ is regular, then $L\cap R$, $L\setminus R$, $\overline L$ and $L^R$ would all be regular. Find such a combination that gives a language already known to be non-regular.

**Unequal block lengths.** $L_{\ne}=\{0^m1^n : m\neq n\}$. Pumping can keep $m\ne n$, so it is awkward. Instead: if $L_{\ne}$ were regular, so would be $0^*1^*\setminus L_{\ne}=\{0^n1^n\}$, which is not.

**$\{0^m1^n : m<n\}$.** If it were regular, reversing and swapping 0 with 1 would make $\{0^m1^n : m>n\}$ regular, so their union $\{0^m1^n : m\neq n\}$ would be regular, and then $0^*1^*\setminus$ that $=\{0^n1^n\}$. Contradiction.

**Equal numbers of 0's and 1's in any order.** $L_=\{w : \#_0(w)=\#_1(w)\}$. If $L_=$ were regular, then $L_=\cap0^*1^*=\{0^n1^n\}$ would be regular. Contradiction. (The intersection is what forces the 0's before the 1's; $L_=$ itself contains 0101, 1100, ….) A direct pumping proof also works: $s=0^p1^p$, $y=0^k$, $i=0$ gives fewer 0's than 1's.

### Equal numbers of ab and ba over $\{a,b,c\}$

$L=\{w : \#_{ab}(w)=\#_{ba}(w)\}$, counting overlapping occurrences; aba and abcba are in $L$, abcab is not.

1. With $R=(abc)^*(bac)^*$: a string $(abc)^m(bac)^n$ has $m$ ab's and $n$ ba's, so $L\cap R=K=\{(abc)^n(bac)^n\}$. If $L$ were regular, $K$ would be.
2. Pump $K$ with $s=(abc)^p(bac)^p$, $|s|=6p$. $|xy|\le p$ puts $y$ inside the first $(abc)^p$ (which has length $3p$). Let $k=|y|$, $i=0$.
3. **Case $3\nmid k$:** $|xz|=6p-k$ is not divisible by 3, but every string of $K$ has length $6n$. So $xz\notin K$.
4. **Case $k=3r$:** $(abc)^p$ has period 3, so removing $3r$ consecutive symbols leaves $(abc)^{p-r}$; $xz=(abc)^{p-r}(bac)^p\notin K$.
5. Every split fails, so $K$ is not regular, hence $L$ is not.

Over $\{a,b\}$ alone the same language **is** regular: $\#_{ab}(w)-\#_{ba}(w)$ is $1$, $-1$ or $0$ according to the first and last symbols. The extra symbol c lets the difference grow without bound.

## Checklist for your proofs

1. Did I write "let $p$ be the pumping length" rather than inventing a value like $p=5$?
2. Is my string $s$ written in terms of $p$?
3. Did I check $s\in L$ **and** $|s|\ge p$?
4. Did I use $|xy|\le p$ to say where $y$ must be?
5. Did I handle **every** valid split, instead of choosing $y$ myself?
6. Did I give an explicit $i$ and prove $xy^iz\notin L$?

### Classic mistakes when critiquing an argument

- **Choosing the split.** "Take $y=\dots$" is wrong: the split is given, not chosen. An argument that picks a convenient $y$ shows nothing.
- **Concluding regularity.** Finding a split that pumps fine does **not** show a language is regular.
- **Not covering all splits.** If the chosen $s$ allows $y$ to sit somewhere you did not analyse, the proof is incomplete.
- **$|s|<p$.** A string like $00011000$ with no $p$ in it is not a valid choice: $p$ may be larger than its length.
- **$i$ that does not break membership.** With $s=0^{2p}$ in $\{0^{2n}\}$, $y=0$ is just one possible split; if $|y|$ is even, $xz$ is still in the language. The language is in fact regular.
`

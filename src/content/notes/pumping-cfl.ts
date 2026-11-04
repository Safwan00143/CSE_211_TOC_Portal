const r = String.raw

export const pumpingCflNote = r`
## What CFGs cannot do

CFGs generate $a^nb^n$, $wcw^R$ and $a^nb^mc^md^n$, but some languages need more coordination than one derivation can keep:

- $\{a^nb^nc^n\}$: three groups to match;
- $\{a^nb^mc^nd^m\}$: two pairs of matches that **cross** instead of nest;
- $\{ww \mid w\in\{0,1\}^*\}$: two copies of an arbitrary string;
- $\{a^q \mid q \text{ prime}\}$ and $\{a^nb^{n^2}\}$: non-linear lengths.

The tool for proving that no CFG exists is the pumping lemma for context-free languages.

## The idea

A long enough string needs a tall parse tree. A tall tree has a long root-to-leaf path, and there are only finitely many variables, so some variable $A$ repeats on that path: $A\overset{*}{\Rightarrow}vAy$ and $A\overset{*}{\Rightarrow}x$. The repeated part of the tree can be used again or removed:
$$
A\Rightarrow vAy\Rightarrow vvAyy\Rightarrow vvvAyyy\Rightarrow\cdots
$$
So **two** pieces of the string, $v$ and $y$, are pumped **together**.

## The lemma (Sipser's form, as on Hakim Sir's slides)

> If $L$ is context-free, there is an integer $p\ge1$ (the pumping length) such that every $w\in L$ with $|w|\ge p$ can be written $w=uvxyz$ with
>
> 1. $|vxy|\le p$,
> 2. $|vy|>0$,
> 3. $uv^ixy^iz\in L$ for every $i\ge0$.

| $i$ | $uv^ixy^iz$ |
|---|---|
| 0 | $uxz$ |
| 1 | $uvxyz=w$ |
| 2 | $uvvxyyz$ |
| 3 | $uvvvxyyyz$ |

$|vxy|\le p$ is **locality**: both pumped pieces lie inside one short window. $|vy|>0$ makes sure pumping changes the string. Either of $v$, $y$ may be empty, but not both.

**Who chooses what.** The language fixes $p$. You choose $w$ (in terms of $p$) and $i$. The adversary chooses the split $uvxyz$, subject only to $|vxy|\le p$ and $|vy|>0$. So a proof must handle **every** valid split.

## Proof template

1. Assume, for contradiction, that $L$ is context-free.
2. Let $p$ be the pumping length.
3. Choose $w\in L$ with $|w|\ge p$, using $p$ in the block lengths.
4. Take an arbitrary split $w=uvxyz$ with $|vxy|\le p$, $|vy|>0$. Use $|vxy|\le p$ to restrict where $v$ and $y$ can be.
5. Choose $i$ (usually 0 or 2). Show $uv^ixy^iz\notin L$ in **every** case. Conclude $L$ is not context-free.

**Organising the cases.** Rather than listing every position, split into two groups:

1. $v$ or $y$ contains two different symbols: then pumping up ($i=2$) puts symbols out of order.
2. $v$ and $y$ each contain one kind of symbol: then pumping changes at most the blocks they touch, and $|vxy|\le p$ limits which blocks those can be.

**Choosing a witness.**

| Property to break | Typical witness |
|---|---|
| three equal blocks | $a^pb^pc^p$ |
| two crossing equalities | $a^pb^pc^pd^p$ |
| prime length | $a^q$, $q>p$ prime |
| non-linear relation | $a^pb^{p^2}$ |
| copy $ww$ | $0^p1^p0^p1^p$ |

## Example: three equal blocks

$L=\{a^nb^nc^n \mid n\ge0\}$.

1. Assume it is context-free; let $p$ be the pumping length. Choose $w=a^pb^pc^p\in L$, $|w|=3p\ge p$.
2. **Where can $vxy$ lie?** To contain both an a and a c it would have to contain at least one a, all $p$ b's and at least one c, so $|vxy|\ge p+2$. Impossible. So $vxy$ touches at most two adjacent blocks.
3. **Pump with $i=2$.**
   - *Case 1: $v$ or $y$ contains two kinds of symbol*, say $v=a^rb^s$ with $r,s>0$. Then $v^2=a^rb^sa^rb^s$ puts an a after a b, so $uv^2xy^2z$ is not of the form $a^*b^*c^*$. The case with b's and c's is the same.
   - *Case 2: $v$ and $y$ each lie inside one block.* Since $vxy$ touches at most two blocks, at least one of the three blocks is untouched and keeps length $p$, while $|vy|>0$ makes some other block longer. So the three counts are no longer equal.
4. Every split fails, so $\{a^nb^nc^n\}$ is not context-free.

Atif Sir's version of this argument, for $\{0^n1^n2^n \mid n\ge1\}$, uses $i=0$: $vwx$ cannot contain both 0's and 2's. If it has no 2's, $uwy$ has fewer 0's or 1's than 2's; if it has no 0's, $uwy$ has $n$ 0's but fewer 1's or 2's.

## Example: crossing dependencies

$L=\{a^nb^mc^nd^m \mid n,m\ge0\}$.

Choose $w=a^pb^pc^pd^p$. Matching pairs are a with c and b with d, which are **not adjacent**. Since $|vxy|\le p$, $vxy$ touches at most two **adjacent** blocks.

- If $v$ or $y$ crosses a block boundary, $i=2$ breaks the order $a^*b^*c^*d^*$.
- Otherwise pumping changes the lengths of one or two adjacent blocks. A changed a-block has its partner c-block unchanged (they are $p$ apart, too far for the window), and likewise for the other blocks. So $\#a\ne\#c$ or $\#b\ne\#d$ after pumping.

Hence the language is not context-free.

## Example: prime lengths

$L=\{a^q \mid q \text{ is prime}\}$.

Choose a prime $q>p$ and $w=a^q$. Let $d=|v|+|y|$; then $1\le d\le|vxy|\le p<q$. Only the length matters. Take $i=q+1$:
$$
|uv^{q+1}xy^{q+1}z|=q+qd=q(1+d).
$$
Both $q\ge2$ and $1+d\ge2$, so the length is composite. Contradiction. Since every regular language is context-free, this also re-proves that the prime-length language is not regular.

## Example: quadratic growth

$L=\{a^nb^{n^2} \mid n\ge0\}$.

Choose $w=a^pb^{p^2}$. Let $\alpha=\#_a(vy)$ and $\beta=\#_b(vy)$, so $\alpha+\beta=|vy|$ with $1\le\alpha+\beta\le p$.

- If $v$ or $y$ contains both a's and b's, $i=2$ puts a b before an a.
- Otherwise $uv^2xy^2z=a^{p+\alpha}b^{p^2+\beta}$. Membership needs $p^2+\beta=(p+\alpha)^2$, that is $\beta=2p\alpha+\alpha^2$.
  - If $\alpha=0$: then $\beta>0$, so the b-count $p^2+\beta\ne p^2$ while the a-count is still $p$. Not in $L$.
  - If $\alpha>0$: then $\beta=2p\alpha+\alpha^2\ge2p+1>p\ge\beta$. Impossible.

Pumping changes counts by fixed linear amounts, but the language needs $\#b=(\#a)^2$.

## Example: copies

$L=\{ww \mid w\in\{0,1\}^*\}$.

Choose $s=0^p1^p0^p1^p$, which is $ww$ with $w=0^p1^p$, of length $4p$. Pump down ($i=0$). Let $d=|vy|$, so $1\le d\le p$ and $|uxz|=4p-d$.

- **$d$ odd.** $|uxz|$ is odd, so it cannot be $ww$.
- **$d$ even**, $d=2e$ with $1\le e\le p/2$. Then $uxz$ would have to split into two halves of length $2p-e$ each. Since $|vxy|\le p$, the window $vxy$ lies in the first $2p$ symbols, in the last $2p$ symbols, or across the midpoint, in which case it lies inside the middle $1^p0^p$.
  - *Window in the first $2p$ symbols.* The last $2p$ symbols $0^p1^p$ are untouched, so $uxz=P\,0^p1^p$ with $|P|=2p-2e$. The first half of $uxz$ is $P$ followed by $0^e$, so it ends in 0; the second half ends in 1. They differ.
  - *Window in the last $2p$ symbols.* Symmetric: $uxz=0^p1^p\,P$. The second half begins with the last $e$ symbols of $0^p1^p$, which are 1's, while the first half begins with 0. They differ.
  - *Window across the midpoint.* Then $uxz=0^p1^{p-a}0^{p-b}1^p$ with $a+b=2e$. If $uxz=ww$, $w$ begins with $0^p$, so positions $2p-e+1$ through $3p-e$ of $uxz$ must all be 0. But the 0's of the third block occupy positions $2p-a+1$ through $3p-a-b=3p-2e$, and $3p-e>3p-2e$, so position $3p-e$ is a 1. Contradiction.

Every split fails, so $\{ww\}$ is not context-free. (Compare $\{ww^R\}$, which is.)

## Choosing the pumping value

| Pump down: $i=0$ | Pump up: $i=2$ |
|---|---|
| breaks an equality between blocks | creates symbols out of order |
| removes a required part | makes block lengths unequal |
| breaks a minimum-length condition | makes something too large |

A larger $i$ is sometimes needed, as in the prime example.

## Common mistakes

- **Choosing the split.** "Let $v=a$ and $y=b$" proves nothing; you do not control $v$ and $y$. Say "consider an arbitrary valid decomposition" and show every placement fails.
- **Pumping only one piece.** Both $v$ and $y$ are pumped. Track their combined effect, for instance $\#_a(vy)$, $\#_b(vy)$ and $|v|+|y|$.
- **Incomplete cases.** For $a^pb^pc^p$, $vxy$ may lie inside the a-block, the b-block or the c-block, or across the a/b or b/c boundary. Cover all of them, ideally with the two-group split above.
- **Proving context-freeness by pumping.** The lemma is only a necessary condition. To show $L$ **is** context-free, give a CFG or a PDA.

## The lemma in HMU form, with proof (Atif Sir)

Atif Sir states the same lemma with HMU's letters: there is a constant $n$ such that every $z\in L$ with $|z|\ge n$ can be written $z=uvwxy$ with

1. $|vwx|\le n$ (the middle portion is not too long),
2. $vx\neq\varepsilon$ (at least one pumped piece is nonempty),
3. $uv^iwx^iy\in L$ for all $i\ge0$.

Sipser's $(u,v,x,y,z)$ and HMU's $(u,v,w,x,y)$ name the same five pieces; only the letters differ.

### Size of parse trees

**Lemma.** In a parse tree for a Chomsky-normal-form grammar, if the yield is a terminal string $w$ and the longest root-to-leaf path has $n$ edges, then $|w|\le2^{n-1}$.

*Proof by induction on $n$.* If $n=1$, the tree is one rule $A\to a$, and $|w|=1=2^0$. If $n>1$, the root uses a rule $A\to BC$; each subtree's longest path has at most $n-1$ edges, so by induction each yields at most $2^{n-2}$ symbols, and $|w|\le2\cdot2^{n-2}=2^{n-1}$.

### Proof of the pumping lemma

1. If $L$ is $\emptyset$ or $\{\varepsilon\}$ there is nothing to prove. Otherwise let $G$ be a CNF grammar for $L-\{\varepsilon\}$ with $m$ variables, and choose $n=2^m$.
2. Let $z\in L$ with $|z|\ge n$. If every path in a parse tree for $z$ had at most $m$ edges, the lemma would give $|z|\le2^{m-1}=n/2<n$. So a parse tree for $z$ has a path with at least $m+1$ edges.
3. Take a longest path. Its labels are variables $A_0,A_1,\dots,A_k$ followed by a terminal, with $k\ge m$. The last $m+1$ variables, $A_{k-m},\dots,A_k$, use only $m$ different names, so two are equal: $A_i=A_j=A$ with $k-m\le i<j\le k$.
4. Let the subtree rooted at $A_j$ have yield $w$, and the subtree rooted at $A_i$ have yield $vwx$. The rest of the tree gives $z=uvwxy$.
5. **Pumping.** Replacing the subtree at $A_i$ by the one at $A_j$ gives a valid tree with yield $uwy$, the case $i=0$. Replacing the subtree at $A_j$ by a copy of the one at $A_i$ gives yield $uv^2wx^2y$, and repeating gives $uv^iwx^iy$ for every $i$.
6. **$vx\ne\varepsilon$.** $A_i$ uses a rule $A\to BC$, and the path continues into one child. The other child's subtree is not empty (a CNF grammar for $L-\{\varepsilon\}$ has no ε-rules), and its yield lies in $v$ or $x$.
7. **$|vwx|\le n$.** $A_i$ is within the last $m+1$ variables of a *longest* path, so every path below $A_i$ has at most $m+1$ edges. By the lemma, its yield $vwx$ has length at most $2^m=n$. $\blacksquare$

## Closure properties of CFLs, briefly

CFLs are closed under union, concatenation, star and reversal, and intersection with a **regular** language. They are **not** closed under intersection or complement: $\{a^nb^nc^m\}$ and $\{a^mb^nc^n\}$ are context-free, but their intersection $\{a^nb^nc^n\}$ is not. This gives another route to non-context-freeness: if $L\cap R$ is not context-free for a regular $R$, then neither is $L$.

## Checklist

1. Did I assume $L$ is context-free and let $p$ be an arbitrary pumping length?
2. Is my witness in $L$, with $|w|\ge p$?
3. Did I consider an arbitrary valid split and use both $|vxy|\le p$ and $|vy|>0$?
4. Did I cover every placement of $vxy$?
5. Did I choose $i$ and prove the pumped string is outside $L$?
6. Did I state the conclusion?
`

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const complexityNote = r`
## Efficient versus inefficient

Undecidability asks what can be computed at all. **Intractability** asks which **decidable** problems can be solved by a TM in time **polynomial** in the input size.

- Polynomial time on a typical computer and on a TM are the same thing: each simulates the other with polynomial slowdown (TM variants topic).
- Polynomial-time problems are usually solvable in tolerable time in practice; exponential-time problems usually are not, except for small instances.

## The class P

A TM $M$ has **time complexity** (running time) $T(n)$ if on every input $w$ of length $n$ it halts after at most $T(n)$ moves.

$L$ is in **P** if $L=L(M)$ for some **deterministic** TM $M$ of time complexity $T(n)$, for some polynomial $T(n)$. So P is the class of problems solvable in polynomial time by a DTM, or a computer.

**Examples in P:** minimum spanning tree, shortest path, edit distance, maximum flow.

## The class NP

$L$ is in **NP** (nondeterministic polynomial) if there is a **nondeterministic** TM $M$ and a polynomial $T(n)$ such that $L=L(M)$ and, on any input of length $n$, $M$ has no sequence of more than $T(n)$ moves (every branch stops within $T(n)$).

Equivalently, NP is the class of problems whose solutions can be **checked** in polynomial time. A **certificate** (witness) is a proposed solution; a polynomial-time **verifier** checks it. The NTM "guesses" the certificate and checks it.

**Examples in NP:** everything in P, satisfiability, Hamiltonian path, travelling salesman (decision version), vertex cover, independent set.

**Example: Dominating Set is in NP.** A dominating set of $G=(V,E)$ is a set $D\subseteq V$ such that every vertex is in $D$ or adjacent to a vertex of $D$. The problem: given $G$ and $k$, is there a dominating set of size at most $k$? **Certificate:** the set $D$ itself. **Verifier:** check $|D|\le k$; then for every $v\in V$ check $v\in D$ or some neighbour of $v$ is in $D$. That is $O(|V|\cdot|V|)$ adjacency tests, polynomial. So Dominating Set is in NP.

### P versus NP

Every DTM is an NTM that never has a choice, so
$$
\text{P}\subseteq\text{NP}.
$$
NP appears to contain much more: a polynomial-time NTM can in effect guess one of exponentially many candidate solutions and check each in polynomial time, all in parallel. **Whether P = NP is one of the deepest open questions in mathematics.**

**Decision versus optimisation.** P and NP are defined for decision (yes/no) problems. An optimisation problem becomes one by adding a bound $k$: "is there a solution of value at most (at least) $k$?" If that can be answered in polynomial time, binary search over $k$ finds the optimum in polynomial time too.

## Polynomial-time reductions

A **polynomial-time reduction** from $P_1$ to $P_2$ is an algorithm that, in polynomial time, turns any instance of $P_1$ into an instance of $P_2$ with the **same answer**. Then a polynomial-time algorithm for $P_2$ gives one for $P_1$: $P_2$ is at least as hard as $P_1$.

## NP-complete and NP-hard

$L$ is **NP-complete** if

1. $L$ is in NP, and
2. every language $L'$ in NP has a polynomial-time reduction to $L$.

$L$ is **NP-hard** if condition 2 holds but we cannot (or do not) show condition 1. NP-hard problems are at least as hard as everything in NP but need not be in NP.

> **Theorem.** If $P_1$ is NP-complete, $P_2$ is in NP, and $P_1$ reduces to $P_2$ in polynomial time, then $P_2$ is NP-complete.

**Proof.** Let $L$ be any language in NP. Since $P_1$ is NP-complete, $L$ reduces to $P_1$ in polynomial time. Composing with the reduction from $P_1$ to $P_2$ gives a reduction from $L$ to $P_2$, still polynomial (a polynomial of a polynomial is a polynomial). So every NP language reduces to $P_2$, and $P_2$ is in NP: $P_2$ is NP-complete.

> **Theorem.** If some NP-complete problem $P$ is in P, then P = NP.

**Proof.** Every $L$ in NP reduces to $P$ in polynomial time. Solve an instance of $L$ by reducing it and running the polynomial algorithm for $P$: polynomial in total. So $L\in$ P for every $L\in$ NP, i.e. NP $\subseteq$ P, and with P $\subseteq$ NP, P = NP.

So finding a polynomial-time algorithm for **any one** NP-complete problem (SAT, say) would prove P = NP.

**How to prove $P_2$ is NP-complete.**

1. Show $P_2$ is in NP: give a certificate and a polynomial-time verifier.
2. Pick a known NP-complete problem $P_1$ and give a polynomial-time reduction **from $P_1$ to $P_2$**. Mind the direction: the known hard problem reduces *to* the new one.
3. Prove the reduction is correct in **both** directions: a yes-instance of $P_1$ maps to a yes-instance of $P_2$, and a yes-instance of $P_2$ (in the image) comes from a yes-instance of $P_1$.
4. Argue the construction takes polynomial time.

${fig("cx-classes")}

## SAT and Cook's theorem

A **Boolean formula** is built from Boolean variables, the operators AND ($\land$), OR ($\lor$) and NOT ($\lnot$, or a bar), and parentheses. A **truth assignment** gives each variable true or false. It **satisfies** the formula if it makes the formula true, and a formula is **satisfiable** if some assignment satisfies it.

**SAT:** given a Boolean formula, decide whether it is satisfiable. Examples: $(x\lor y)\land(\bar x\lor z)$ is satisfiable ($x$ false, $y$ true); $x\land\bar x$ is not.

**CNF and 3-SAT.** A formula is in **conjunctive normal form** if it is an AND of **clauses**, each an OR of literals (variables or negated variables). **3-SAT**: SAT restricted to CNF formulas with exactly three literals per clause. It is also NP-complete, and is the usual starting point for reductions.

> **Theorem (Cook, 1971).** SAT is NP-complete.

**SAT is in NP:** the certificate is a truth assignment; evaluate the formula in polynomial time.

**Every $L$ in NP reduces to SAT.** Let $M$ be a single-tape NTM and $p(n)$ a polynomial such that $M$ takes at most $p(n)$ steps on every branch for inputs of length $n$. If $M$ accepts $w$ ($|w|=n$), there are IDs $\alpha_0\vdash\alpha_1\vdash\cdots\vdash\alpha_k$ with $k\le p(n)$, $\alpha_0$ the initial ID on $w$, and $\alpha_k$ accepting.

The reduction maps $(M,w)$ to a formula $F(M,w)$ that is **satisfiable iff some branch of $M$ on $w$ accepts**. It does not try to understand the branches. Instead a truth assignment *describes* one branch, step by step, and $F$ checks that the description is a legal accepting computation. The exponentially many branches correspond to the exponentially many assignments.

**Variables**, for $0\le i,j\le p(n)$ (cells and steps; the head never goes beyond cell $p(n)$ in $p(n)$ steps):

1. $s(q,j)$: $M$ is in state $q$ at step $j$;
2. $l_{ij}$: the head is on cell $i$ at step $j$;
3. $c(i,j,t)$: cell $i$ holds symbol $t$ at step $j$;
4. $u(i,j)$: cell $i$ is unchanged from step $j$ to step $j+1$ ($j\le p(n)-1$).

**The seven rule families** (all ANDed together).

**Rule 1: exactly one state at each step.** For every $j$: $\bigvee_{q\in Q}s(q,j)$, and for every $q$: $s(q,j)\to\bigwedge_{\hat q\neq q}\lnot s(\hat q,j)$.

**Rule 2: the head is in exactly one cell.** For every $j$: $\bigvee_{i=0}^{p(n)}l_{ij}$, and for every $k$: $l_{kj}\to\bigwedge_{i\ne k}\lnot l_{ij}$.

**Rule 3: each cell holds exactly one symbol.** For every $i,j$: $\bigvee_{t\in\Gamma}c(i,j,t)$, and for every $t$: $c(i,j,t)\to\bigwedge_{\hat t\ne t}\lnot c(i,j,\hat t)$.

**Rule 4: an unchanged cell keeps its symbol.** For every $i$, $j\le p(n)-1$, $t$:
$$
c(i,j,t)\land u(i,j)\to c(i,j+1,t).
$$

**Rule 5: the next configuration follows $\delta$.** For every $i$, $j\le p(n)-1$, $t\in\Gamma$, $q\in Q$, with $\delta(q,t)=\{(q_1,t_1,d_1),\dots,(q_m,t_m,d_m)\}$:
$$
\big[s(q,j)\land l_{ij}\land c(i,j,t)\big]\to\Big[\bigwedge_{k\neq i}u(k,j)\Big]\land\Big[\bigvee_{r=1}^{m}\big(s(q_r,j+1)\land l_{\lambda(r),\,j+1}\land c(i,j+1,t_r)\big)\Big],
$$
where the new head position is
$$
\lambda(r)=\begin{cases}i-1 & d_r=L \text{ and } i>0\\ i & d_r=L \text{ and } i=0, \text{ or } d_r=R \text{ and } i=p(n)\\ i+1 & d_r=R \text{ and } i<p(n).\end{cases}
$$
In words: if at step $j$ the machine is in $q$, on cell $i$, reading $t$, then every **other** cell is unchanged, and **one** of the moves in $\delta(q,t)$ is carried out (new state, new head position, symbol written on cell $i$). The OR over $r$ is where the nondeterminism lives.

**Rule 6: the initial configuration** (a single formula): state $q_0$, head on cell 0, and cells holding $w$ followed by blanks:
$$
s(q_0,0)\land l_{00}\land c(0,0,w_1)\land\cdots\land c(n-1,0,w_n)\land c(n,0,B)\land\cdots\land c(p(n),0,B).
$$

**Rule 7: acceptance** (a single formula): $s(q_a,p(n))$, the machine is in the accepting state at the last step (an accepting machine may be assumed to stay in $q_a$ once there).

> **Lemma.** $F(M,w)$, the AND of all seven families, can be computed from $M$ and $w$, and its size is bounded by a polynomial in $n$.

Each formula is written mechanically from its parameters. The largest family is Rule 5, with $O(|Q|\,|\Gamma|\,p(n)^2)$ formulas each of size $O(p(n))$: $O(|Q|\,|\Gamma|\,p(n)^3)$ in all, a polynomial. So $L$ reduces to SAT in polynomial time, and since $L$ was any language in NP, SAT is NP-complete.

**Example of Rule 5.** For $\delta(q,t)=\{(q_1,t_1,R),(q_2,t_2,L)\}$ with the head at cell $i$ in step $j$, not at either end ($0<i<p(n)$):
$$
\big[s(q,j)\land l_{ij}\land c(i,j,t)\big]\to\Big[\bigwedge_{k\ne i}u(k,j)\Big]\land\Big[\big(s(q_1,j+1)\land l_{i+1,\,j+1}\land c(i,j+1,t_1)\big)\lor\big(s(q_2,j+1)\land l_{i-1,\,j+1}\land c(i,j+1,t_2)\big)\Big].
$$

## Reductions from the lectures

In 1972 Karp showed 21 problems NP-complete. The lecture proves four.

### Directed Hamiltonian cycle

**DIRHAMCYCLE:** given a digraph $G=(V,E)$, is there a directed cycle visiting every vertex exactly once?

**In NP:** the certificate is the cycle; check that every vertex appears exactly once and every consecutive pair (including last to first) is an edge.

**Reduction from 3-SAT.** Given a 3-CNF formula $\phi$ over $x_1,\dots,x_n$ with clauses $C_1,\dots,C_m$, build in polynomial time a digraph $G$ with
$$
\phi \text{ satisfiable} \iff G \text{ has a Hamiltonian cycle}.
$$

**Idea.** A Hamiltonian cycle must make binary choices; let each choice be one variable's value.

1. **Variable gadget.** For each $x_i$, a row of $3m+3$ vertices $v_{i,1},\dots,v_{i,3m+3}$ with edges both ways between neighbours. A cycle entering a row at one end must walk straight to the other end (turning back would revisit a vertex), so each row is traversed in one of two directions: **left-to-right = true**, **right-to-left = false**.
2. **Wiring.** Add vertices $s$ and $t$. Connect $s$ to both ends of row 1, both ends of row $i$ to both ends of row $i+1$, both ends of row $n$ to $t$, and $t\to s$. The cycle goes $s\to$ row 1 $\to$ row 2 $\to\cdots\to$ row $n\to t\to s$, choosing each row's direction independently.
3. **Clause gadget.** For each clause $C_j$ add a vertex $c_j$, and reserve positions $3j$ and $3j+1$ in every row for it. If $x_i\in C_j$, add $v_{i,3j}\to c_j\to v_{i,3j+1}$ (a detour usable when row $i$ runs left to right). If $\bar x_i\in C_j$, add $v_{i,3j+1}\to c_j\to v_{i,3j}$ (usable when row $i$ runs right to left). The detour replaces one row edge by two edges through $c_j$, losing no vertex.

**A detour cannot switch rows.** If the cycle entered $c_j$ from row $i$ and left into a different row, the stranded vertex $v_{i,3j+1}$ would have both its usual in-edges already used and could only be entered from $v_{i,3j+2}$ and left toward a vertex already committed: impossible. So every $c_j$ is visited as a clean detour inside one row. (The spacer positions $3j+2$ make this argument work.)

**($\Rightarrow$)** Given a satisfying assignment, traverse row $i$ left-to-right iff $x_i$ is true. For each clause pick one true literal, say on $x_i$; row $i$ then runs in the direction its detour edges point, so take the detour to $c_j$. Distinct clauses use distinct positions, so detours never clash. Every vertex is visited exactly once.

**($\Leftarrow$)** Given a Hamiltonian cycle, remove each $c_j$ and reconnect its row edge: what remains traverses each row in one direction; read off the assignment. Each $c_j$ was visited by a detour from some row $i$, and the detour's orientation matches row $i$'s direction, which is exactly the direction making that literal true. So every clause has a true literal.

The graph has $n(3m+3)+m+2$ vertices: polynomial.

### Clique (from Independent Set)

**Clique:** given $G=(V,E)$ and $k$, are there $k$ mutually adjacent vertices? **Independent set:** $k$ vertices with no edges between them (known NP-complete).

**In NP:** check the $\binom k2$ pairs of the given $k$ vertices.

**Reduction.** From $(G,k)$ build $(\bar G,k)$ where $\bar G=(V,\bar E)$ with $\bar E=\{(u,v) \mid u\ne v, (u,v)\notin E\}$, the complement graph. A set of vertices is independent in $G$ iff all its pairs are edges of $\bar G$, i.e. iff it is a clique in $\bar G$. So $G$ has an independent set of size $k$ iff $\bar G$ has a clique of size $k$. Building $\bar G$ takes $O(|V|^2)$ time.

### Maximum common subgraph (from Clique)

**Problem:** given $G_1$, $G_2$ and $k$, do they have a common **induced** subgraph with at least $k$ vertices?

**In NP:** the certificate is the two vertex sets and the matching between them; check that the induced edges correspond.

**Reduction.** From a clique instance $(G,k)$ build $G_1=G$, $G_2=K_{|V|}$ (the complete graph on $|V|$ vertices), same $k$. Every induced subgraph of $G_2$ is complete, so a common induced subgraph on $k$ vertices is a $k$-clique of $G$. Conversely a $k$-clique of $G$ is isomorphic to any $k$ vertices of $G_2$. So the answers agree.

**Subgraph isomorphism** (does $G_1$ contain a copy of $G_2$ as a subgraph?) is NP-complete the same way: it is in NP (certificate: the injective map of $G_2$'s vertices into $G_1$; check every edge of $G_2$ maps to an edge of $G_1$), and Clique reduces to it by taking $G_2=K_k$, since $G_1$ contains a copy of $K_k$ iff it has a $k$-clique.

### Partition (from Subset Sum)

**Partition:** given nonnegative integers $a_1,\dots,a_m$, is there $S\subseteq\{1,\dots,m\}$ with $\sum_{i\in S}a_i=\sum_{j\notin S}a_j$? **Subset Sum:** given $a_1,\dots,a_m$ and $t$, is there $S$ with $\sum_{i\in S}a_i=t$ (known NP-complete)?

**In NP:** the certificate is $S$; add up both sides.

**Reduction.** Let $a=\sum_{i=1}^ma_i$. Add one number $a_{m+1}$ so that the total is $2T$ and a half of size $T$ can be built from a subset summing to $t$:

- **Case $2t\ge a$:** $a_{m+1}=2t-a$. The new total is $2t$, so each half must be $t$.
  - If $S$ solves Subset Sum ($\sum_Sa_i=t$), its complement $T=\{1,\dots,m+1\}\setminus S$ sums to $(a-t)+(2t-a)=t$: a partition.
  - If $S$ is a partition, each side sums to $t$; the side not containing $m+1$ is a Subset Sum solution.
- **Case $2t<a$:** $a_{m+1}=a-2t$. The new total is $2a-2t$, so each half must be $a-t$.
  - If $\sum_Sa_i=t$, then $S\cup\{m+1\}$ sums to $t+(a-2t)=a-t$: a partition.
  - If there is a partition, the side **containing** $m+1$ has its other elements summing to $(a-t)-(a-2t)=t$: a Subset Sum solution.

Either way the new instance is built in linear time.

### Graph 3-colourability (from 3-SAT)

Asked in older papers (Sipser, Problem 7.29; Garey and Johnson). **3-COLOR:** can the vertices of $G$ be coloured with 3 colours so that adjacent vertices differ?

**In NP:** the certificate is a colouring; check every edge.

**Reduction from 3-SAT.** Given $\phi$:

1. **Palette triangle.** Three vertices T, F, N (true, false, neutral) joined in a triangle, so they get three different colours; call those colours *true*, *false*, *neutral*.
2. **Variable gadgets.** For each $x_i$, vertices $x_i$ and $\bar x_i$ joined by an edge, and both joined to N. Each must be coloured true or false, and they differ: a truth assignment.
3. **Clause gadgets.** For each clause $(\ell_1\lor\ell_2\lor\ell_3)$, an "OR gadget" of six new vertices: a triangle-based gadget whose output vertex can be coloured *true* only if at least one input literal vertex is coloured true. Its output is joined to F and N, forcing the output to be *true*.

$\phi$ is satisfiable iff the graph is 3-colourable: a satisfying assignment colours every gadget consistently, and conversely the forced *true* output of each clause gadget means some literal is true. The graph has $3+2n+6m$ vertices, so the reduction is polynomial.

## Space complexity

The **space complexity** of a deterministic TM $M$ that halts on all inputs is the function $f(n)$ = the maximum number of tape cells $M$ scans on any input of length $n$. For a nondeterministic TM whose branches all halt, $f(n)$ is the maximum over all branches.

- $\text{SPACE}(f(n))$: languages decided by an $O(f(n))$-space DTM.
- $\text{NSPACE}(f(n))$: languages decided by an $O(f(n))$-space NTM.
- **PSPACE**: languages decided in polynomial space by a DTM; **NPSPACE**: by an NTM.

**Space is reusable; time is not.** SAT, which is NP-complete, can be solved in **linear space**: try the assignments one at a time, reusing the same cells.

**$\text{P}\subseteq\text{PSPACE}$ and $\text{NP}\subseteq\text{NPSPACE}$.** In $T(n)$ moves a TM can visit at most $T(n)+1$ cells, so polynomial time implies polynomial space.

> **Theorem.** If $M$ (deterministic or not) has polynomial space bound $p(n)$ and accepts $w$ ($|w|=n$), it does so within $c^{1+p(n)}$ moves, for some constant $c$.

**Proof.** With $s$ states and $t$ tape symbols there are at most $s\,p(n)\,t^{p(n)}$ IDs using $p(n)$ cells (a state, a head position, and the cell contents). An accepting computation never needs to repeat an ID, so it needs at most that many moves. With $c=s+t$, the binomial expansion of $(t+s)^{1+p(n)}$ has the term $(1+p(n))\,s\,t^{p(n)}\ge s\,p(n)\,t^{p(n)}$. Consequently a PSPACE (NPSPACE) language is accepted by a polynomial-space TM that halts within $c^{q(n)}$ moves: count the moves and halt after $c^{1+p(n)}$. In particular $\text{PSPACE}\subseteq\text{EXPTIME}$.

> **Theorem (Savitch).** For $f(n)\ge n$, $\text{NSPACE}(f(n))\subseteq\text{SPACE}(f^2(n))$. Hence $\text{PSPACE}=\text{NPSPACE}$.

**Proof.** $\text{PSPACE}\subseteq\text{NPSPACE}$ is immediate (a DTM is an NTM). For the converse we simulate an $f(n)$-space NTM $N$ deterministically.

- **The naive approach fails.** Trying the branches one by one needs to record the choices made along the current branch, and a branch may run $c^{O(f(n))}$ steps: exponential space.
- **Reachability instead.** $\text{reach}(I,J,m)$: can $N$ get from ID $I$ to ID $J$ within $m$ moves, using $f(n)$ space? Decide it recursively: if $m=1$, check directly; otherwise try every ID $K$ of size $f(n)$ and test $\text{reach}(I,K,m/2)$ and $\text{reach}(K,J,m/2)$.
- **Space.** The two recursive calls run one after the other, so only one chain of calls is active: frames $(I,J,m)$, $(I',J',m/2)$, $(I'',J'',m/4)$, …, at most $\log_2m$ frames. With $m=c^{1+f(n)}$ that is $O(f(n))$ frames. Each frame holds two IDs ($1+f(n)$ cells each) and $m$ in binary ($O(f(n))$ cells): $O(f(n))$ space. Total $O(f^2(n))$.
- **Acceptance.** On input $w$, call $\text{reach}(I_0,J,c^{1+f(n)})$ for each accepting ID $J$ of size at most $f(n)$, enumerated systematically, where $I_0$ is the initial ID. Accept if any call succeeds.

If $f$ is a polynomial, so is $f^2$, so every NPSPACE language is in PSPACE.

### The overall picture

$$
\text{P}\subseteq\text{NP}\subseteq\text{PSPACE}=\text{NPSPACE}\subseteq\text{EXPTIME}.
$$

| Pair | Known | Widely believed |
|---|---|---|
| P and NP | $\text{P}\subseteq\text{NP}$ | $\text{P}\subsetneq\text{NP}$ |
| NP and PSPACE | $\text{NP}\subseteq\text{PSPACE}$ | $\text{NP}\subsetneq\text{PSPACE}$ |
| P and PSPACE | $\text{P}\subseteq\text{PSPACE}$ | $\text{P}\subsetneq\text{PSPACE}$ |
| PSPACE and NPSPACE | **equal** (Savitch) | equal |
| P and EXPTIME | $\text{P}\subsetneq\text{EXPTIME}$ (time hierarchy) | |

**True/false checks often asked.**

- "If SAT is solvable in polynomial time, then P = NP": **true** (SAT is NP-complete).
- "Languages decided by polynomial-time NTMs (NP) are a superset of those decided by polynomial-space DTMs (PSPACE)": **false as far as known**; in fact $\text{NP}\subseteq\text{PSPACE}$, and NP is believed strictly smaller.
- "Polynomial-space DTMs and polynomial-space NTMs decide the same languages": **true** (Savitch).
`

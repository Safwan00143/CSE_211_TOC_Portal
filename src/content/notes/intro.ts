const r = String.raw

export const introNote = r`
## What the course is about

Theory of computation studies the limits of all machines, not the details of any one machine. Hakim Sir's first lecture frames the course around four questions:

1. **Can finite memory understand arbitrarily deep structure?** Password rules need only finite memory. Balanced parentheses do not. This leads to finite automata and their limits.
2. **Can every problem be solved by an algorithm?** No. The halting problem has no solution, and that is a theorem, not an engineering failure.
3. **Can every program be analysed automatically?** No perfect bug detector, malware detector or verifier exists for all programs. Useful tools exist; perfect ones do not.
4. **Can every efficiently checkable solution also be found efficiently?** Checking a filled Sudoku is fast; filling one may need huge search. This is the P versus NP question.

The three classical areas, as Atif Sir lists them:

| Area | Question | Course topics |
|---|---|---|
| Automata | What can machines with limited memory do? | DFA, NFA, regex, CFG, PDA |
| Computability | What can be solved at all? | Turing machines, decidability |
| Complexity | What can be solved *efficiently*? | P, NP, NP-completeness, PSPACE |

They are linked by one question: what are the fundamental capabilities and limitations of computers?

## A hierarchy of memory

| Machine model | Memory | Language class | Example |
|---|---|---|---|
| Finite automaton | finite | regular | password rules, tokens |
| Pushdown automaton | one stack | context-free | parentheses, JSON |
| Turing machine | unbounded tape | decidable / recognisable | any program |
| Efficient algorithm | bounded time or space | complexity classes | SAT, Sudoku |

Some problems stay impossible even at the top of this table.

## Alphabets and strings

An **alphabet** is a finite, nonempty set of symbols, usually written $\Sigma$. Examples: $\Sigma_1=\{0,1\}$, $\Sigma_2=\{a,b,\dots,z\}$, $\Sigma_3=\{A,C,G,T\}$.

A **string** over $\Sigma$ is a finite sequence of symbols from $\Sigma$. The **empty string** $\varepsilon$ has no symbols.

- **Length:** $|w|$ is the number of symbols. $|1011|=4$, $|\varepsilon|=0$.
- **Concatenation:** $xy$ is $x$ followed by $y$. $01\cdot 10=0110$, and $\varepsilon w=w\varepsilon=w$.
- **Power:** $w^k$ is $w$ concatenated with itself $k$ times; $w^0=\varepsilon$. So $0^2=00$, $(ab)^3=ababab$.
- **Reverse:** $w^R$ is $w$ written backwards. $(10110)^R=01101$.

$\Sigma^*$ is the set of **all** finite strings over $\Sigma$, including $\varepsilon$:
$$
\{0,1\}^* = \{\varepsilon, 0, 1, 00, 01, 10, 11, 000, \dots\}.
$$
$\Sigma^*$ is infinite, but every string in it is finite.

## Languages

A **language** over $\Sigma$ is any set of strings over $\Sigma$, that is, any subset of $\Sigma^*$. With $\Sigma=\{0,1\}$:

- $L_1=\{0, 10, 111\}$ (finite),
- $L_2=\{w : w \text{ contains an even number of 1s}\}$ (infinite),
- $L_3=\emptyset$ (no strings at all),
- $L_4=\Sigma^*$ (every string).

A language separates the YES strings from the NO strings.

**Set-builder (set-former) notation** is how languages are usually written: $\{w : P(w)\}$ means "all strings $w$ for which the property $P$ holds". Hakim Sir writes the colon; Atif Sir and most exam papers write a bar, $\{w \mid P(w)\}$, with the same meaning. For example
$$
\text{PAL}=\{w\in\{0,1\}^* : w=w^R\},\qquad \{0^n1^n : n\ge 0\}=\{\varepsilon,01,0011,\dots\}.
$$

### Three objects that look alike

| Notation | Meaning | Number of strings |
|---|---|---|
| $\varepsilon$ | the empty string (a string, length 0) | not a language |
| $\emptyset$ | the empty language | 0 |
| $\{\varepsilon\}$ | the language holding only the empty string | 1 |

So $\emptyset\ne\{\varepsilon\}$. A DFA whose start state is accepting accepts $\varepsilon$; a DFA with no accepting state accepts $\emptyset$. Concatenating with them behaves very differently:
$$
L\{\varepsilon\}=L,\qquad L\emptyset=\emptyset.
$$
The first holds because each string of $L$ can be followed by $\varepsilon$; the second because there is nothing in $\emptyset$ to follow it with.

### Why the star of the empty set is $\{\varepsilon\}$

By definition, $L^*$ is every concatenation of **zero or more** strings from $L$:
$$
L^* = \{x_1x_2\cdots x_k : k\ge 0 \text{ and each } x_i\in L\}=L^0\cup L^1\cup L^2\cup\cdots
$$
The case $k=0$ joins no strings at all and gives $\varepsilon$. It needs no member of $L$, so it is available even when $L=\emptyset$. Every case with $k\ge 1$ needs at least one string from $\emptyset$, and there is none. Hence
$$
\emptyset^* = \{\varepsilon\}.
$$
Machine view: the star construction adds a new start state that is also accepting. Starting from a machine for $\emptyset$ (no accepting state), that new state is the only accepting state and accepts only $\varepsilon$. (Lecture 5 covers the star in full.)

## Every problem is a language

Every object a computer handles can be encoded as a string: numbers, DNA, programs, images, prompts. So a YES/NO question becomes a language: the set of encodings of its YES instances.

| Problem | Language |
|---|---|
| Is a binary number divisible by 3? | $\{w : w \text{ is a binary multiple of } 3\}$ |
| Is this JSON valid? | $\text{JSON}=\{x : x \text{ is valid JSON}\}$ |
| Is this formula satisfiable? | $\text{SAT}=\{\langle\phi\rangle : \phi \text{ is satisfiable}\}$ |

**Solving the problem** means deciding membership in the language. The course asks: which machines can recognise which languages?

## When a problem is hard

This section is not on the slides; past papers ask it, so it is filled in from Sipser (Chapter 7, Section 10.1 on approximation and Section 10.6 on cryptography).

**Options when a problem looks computationally hard** (for example, NP-complete):

1. **Check whether your instances are special.** Many NP-complete problems become easy on restricted inputs: 2-SAT is in P, and graph colouring is easy on trees.
2. **Use an algorithm that is exponential only in a small parameter.** If the hard part depends on a small number $k$, a running time like $2^k\,n$ can be practical.
3. **Accept an approximate answer.** Approximation algorithms guarantee a solution within a known factor of optimal; vertex cover has a simple 2-approximation.
4. **Use heuristics or randomisation.** Local search, branch and bound, SAT solvers and randomised algorithms often work well in practice with no worst-case guarantee.
5. **Settle for average-case behaviour** when the worst case is rare for your inputs.
6. **Use exponential time on small inputs.** Exhaustive search is fine when $n$ is small.

What you cannot do, unless P = NP, is find an algorithm that is exact, polynomial-time and works on every input.

**Where hardness helps: cryptography.** Public-key cryptography needs problems that are easy one way and hard the other.

- Each party publishes a **public key** for encryption or signature checking, and keeps a **private key** for decryption or signing.
- Anyone can encrypt a message to Bob with Bob's public key, but only Bob's private key decrypts it.
- Security rests on a **one-way function** (also called trapdoor): easy to compute, believed hard to invert without the secret. Examples are multiplying two large primes and recovering them, as in RSA, and computing discrete logarithms.
- Theory of computation supplies the language for this: polynomial time as "easy", and hardness assumptions as "infeasible for every efficient adversary". Notably, one-way functions can exist only if P ≠ NP. If P = NP, every such scheme could be broken efficiently.

So here we *want* the problem to be hard: the attacker's task must be infeasible while the honest user's task stays easy.
`

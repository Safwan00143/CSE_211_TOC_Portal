const r = String.raw

export const tmVariantsNote = r`
## Same power, different convenience

Several models look more powerful than the one-tape TM (more tapes, nondeterminism) and several look weaker (a semi-infinite tape, stacks, counters). All of them accept exactly the **recursively enumerable** languages. The multitape TM matters because it is much easier to see how it simulates a real computer.

## Multitape Turing machines

A multitape TM has a finite control and some finite number $k$ of tapes, each divided into cells holding symbols of one finite tape alphabet (which contains the blank, and a subset of input symbols not containing the blank).

**Initially:**

1. the input is on the first tape;
2. every other cell of every tape holds the blank;
3. the control is in the initial state;
4. the first head is at the left end of the input;
5. the other heads are anywhere (their tapes are blank, so every cell looks the same).

**One move** depends on the state and the symbols under **all** $k$ heads. In one move the machine

1. enters a new state (possibly the same one),
2. writes a symbol on the scanned cell of each tape,
3. moves each head **independently** left (L), right (R) or **stationary** (S).

So $\delta(q,X_1,\dots,X_k)=(p,Y_1,\dots,Y_k,D_1,\dots,D_k)$ with each $D_i\in\{L,R,S\}$. The one-tape model did not allow S. A multitape TM accepts by entering an accepting state.

### Every multitape TM has an equivalent one-tape TM

> **Theorem.** Every language accepted by a multitape TM is recursively enumerable.

A one-tape TM is a multitape TM, so multitape TMs accept every RE language. The question is the converse: could a multitape TM accept something more? No.

**Proof (simulation with $2k$ tracks).** Let $M$ be a $k$-tape TM accepting $L$. Build a one-tape TM $N$ whose tape has $2k$ tracks:

- tracks $2,4,\dots,2k$ hold the contents of $M$'s tapes $1,\dots,k$;
- tracks $1,3,\dots,2k-1$ each hold a single marker X showing where the corresponding head of $M$ is.

For $k=2$:

| Track | Holds | Cells |
|---|---|---|
| 1 | head of tape 1 | . . X . . . |
| 2 | tape 1 | $A_1\ A_2\ A_3\ A_4\ A_5\ A_6$ |
| 3 | head of tape 2 | . . . . X . |
| 4 | tape 2 | $B_1\ B_2\ B_3\ B_4\ B_5\ B_6$ |

**To simulate one move of $M$, $N$:**

1. Sweeps across its tape, visiting each of the $k$ head markers. So that it never gets lost, it keeps in its **finite control** the count of markers to its left. At each marker it stores the symbol scanned on that track in its finite control (**storage in the state**).
2. Now knows $M$'s state (also kept in its own finite control) and all $k$ scanned symbols, hence $M$'s move.
3. Revisits each marker, writes the new symbol on that track, and moves the marker left or right if $M$'s head moves.
4. Updates $M$'s state in its own finite control.

$N$'s accepting states are those recording an accepting state of $M$. So $N$ accepts exactly when $M$ does, and $L(N)=L(M)$. Everything $N$ uses is a one-tape TM with **multiple tracks and storage in the state**, which is why "a one-tape TM with multiple tracks and storage in the state can simulate a multitape TM" is **true**.

### Running time

> **Theorem.** The one-tape TM $N$ simulates $n$ moves of the $k$-tape TM $M$ in $O(n^2)$ moves.

After $n$ moves of $M$, its heads cannot be more than $2n$ cells apart (each head moves at most one cell per move). Starting at the leftmost marker, $N$ moves at most $2n$ cells right to visit all markers, then at most $2n$ cells left to update them, plus at most $2k$ moves to turn round when shifting markers. So **one** move of $M$ costs at most $4n+2k=O(n)$ moves of $N$, and $n$ moves cost $O(n^2)$.

## Nondeterministic Turing machines

An NTM has, for each state $q$ and tape symbol $X$, a finite **set** of choices:
$$
\delta(q,X)=\{(q_1,Y_1,D_1),(q_2,Y_2,D_2),\dots,(q_k,Y_k,D_k)\}.
$$
At each step it picks one triple **whole**: it cannot take the state from one triple and the symbol or direction from another. It accepts $w$ if **some** sequence of choices leads from the initial ID to an accepting state; other choices that fail do not matter.

> **Theorem.** If $M_N$ is an NTM, there is a DTM $M_D$ with $L(M_N)=L(M_D)$.

**Proof (breadth-first search over IDs).** $M_D$ is a multitape TM.

- **Tape 1** holds a queue of IDs of $M_N$, separated by a marker. One ID is marked "current"; everything to its left has been explored.
- **Tape 2** is scratch space for copying.

To process the current ID, $M_D$:

1. Reads the state and scanned symbol of the current ID. The choices $M_N$ has for each (state, symbol) pair are built into $M_D$'s finite control. If the state is accepting, $M_D$ accepts.
2. Otherwise, if $M_N$ has $k$ choices here, copies the ID $k$ times onto the **end** of the queue, using tape 2.
3. Changes each copy according to a different one of the $k$ moves.
4. Moves the "current" mark to the next ID and repeats.

**Why a queue (breadth first), not a stack?** A depth-first search could follow an infinite branch forever and never reach an accepting branch. With a queue, every ID reachable in $j$ moves is examined before any reachable in $j+1$ moves.

**Correctness.** Let $m$ be the largest number of choices $M_N$ has in any situation. After $n$ moves $M_N$ can reach at most $1+m+m^2+\cdots+m^n\le nm^n$ IDs. If $M_N$ accepts within $n$ moves, $M_D$ examines that accepting ID after at most about $nm^n$ IDs, so it accepts. If $M_N$ never accepts, neither does $M_D$. Hence $L(M_D)=L(M_N)$, and a two-tape DTM converts to a one-tape DTM as above.

**Cost.** $M_D$ may take **exponentially** more moves than $M_N$. No polynomial simulation of NTMs by DTMs is known: that is exactly the P versus NP question. So "a DTM can simulate $n$ moves of an NTM in $P(n)$ moves" is **not known to be true**, and is believed false. The same goes for "a conventional computer can simulate $n$ moves of an NTM in $P(n)$ moves", because a computer and a DTM simulate each other with polynomial slowdown (below).

## Restricted machines with the same power

### Semi-infinite tape

The head need only move at or to the right of its initial position: a TM with a **semi-infinite** tape (no cells left of the start) can simulate one with a two-way infinite tape. So two-way and one-way infinite tapes recognise the same languages.

**Construction: fold the tape in two tracks.**

| Upper track | $X_0$ | $X_1$ | $X_2$ | $X_3$ | … |
|---|---|---|---|---|---|
| **Lower track** | $*$ | $X_{-1}$ | $X_{-2}$ | $X_{-3}$ | … |

- The upper track holds the original cells $X_0,X_1,X_2,\dots$ (at and right of the start position $X_0$).
- The lower track holds $X_{-1},X_{-2},\dots$ (left of the start) in reverse order.
- A special mark $*$ on the leftmost cell's lower track is an endmarker, so the head never falls off the left end.

The simulating machine remembers in its finite control whether it is currently working on the upper track (original head right of $X_0$) or the lower track (left of $X_0$). On the lower track it moves in the opposite direction to the original head: original "left" means move right. When it reaches the leftmost cell (sees $*$), it switches tracks. The converse is immediate: a two-way infinite tape can imitate a one-way one by never moving left of the start.

### Multistack machines

A TM can accept languages that no one-stack PDA accepts, such as $\{0^n1^n2^n\}$. But **two stacks are enough** for everything a TM can do.

A $k$-stack machine is a deterministic PDA with $k$ stacks: a finite control, input read from an input source (not a tape), and one finite stack alphabet for all stacks.

> **Theorem.** If a TM accepts $L$, then a two-stack machine accepts $L$.

**Idea.** One stack holds the tape to the **left** of the head, the other holds the head's cell and everything to the **right**, each with the cells nearest the head on top. A move right pops the right stack and pushes onto the left stack (after writing); a move left does the opposite. The machine first copies its input onto a stack so the "tape" is available.

### Counter machines

A counter machine has the structure of a multistack machine, but each stack is replaced by a **counter**: it holds any nonnegative integer, and the machine can only test whether a counter is zero. In one move it

1. changes state, and
2. adds or subtracts 1 from any of its counters, independently (never below 0).

> **Theorem.** Every recursively enumerable language is accepted by a **two-counter** machine.

(The route: a stack over a $b$-symbol alphabet can be encoded as one integer in base $b$, so stacks become counters; four counters simulate two stacks, and two counters can in turn simulate any number of counters by encoding them as $2^i3^j5^k\cdots$.)

### Other extensions (Sipser)

A **two-dimensional tape**, infinite in every direction, adds no power either. A one-tape TM stores the used rectangle of the grid row by row, separated by a marker such as #, and remembers the current column in its moves. A move up or down means walking to the same column of the neighbouring row; when the rectangle must grow, every row is widened by shifting.

## Turing machines and computers

A real computer can simulate a TM, given enough memory: store the tape in memory, and keep the finite control in the program. Conversely, **a TM can simulate a computer**, and does so with only polynomial slowdown. (The arguments are informal, since "a typical computer" is not a mathematical object.)

**Assumptions about the computer.**

- Memory is an indefinitely long sequence of **words**, each with an integer address 0, 1, 2, …; neither the number of words nor their length is bounded.
- The program is stored in memory; each instruction involves a limited number of words and changes the value of at most one word.
- Instructions are arithmetic/logic (add, and, …), data handling (copy between memory locations, input/output), and control flow (jump, conditional jump, call). Any operation may act on any word.

**The simulating multitape TM.**

1. **Tape 1: memory.** Addresses and contents alternate, both in binary, separated by markers: $\text{\textdollar}\,0{*}w_0\#1{*}w_1\#10{*}w_2\#\cdots$. The \$ marks the start.
2. **Tape 2: instruction counter**, one binary integer: the address of the next instruction.
3. **Tape 3: memory address**, or the contents of that address once it is found.
4. A **scratch tape** for shifting.

**Instruction cycle.**

1. Search tape 1 for the address equal to tape 2 (start at the \$, compare each address).
2. Read the instruction found there. Its first bits say what to do (copy, add, branch …); the rest name addresses.
3. If it needs a value, copy that address onto tape 3, mark the instruction's position on a second track of tape 1, find the address on tape 1, and copy its value onto tape 3.
4. Execute the instruction.
   - **Copy:** find the target address and write the value there, shifting if the space changes (or inserting address and value if the address is new).
   - **Add:** find the other operand and do ripple-carry binary addition from the right ends.
   - **Jump:** copy tape 3 onto tape 2.
5. If it was not a jump, add 1 to tape 2 and repeat.

**Shifting over**, when a new value needs a different amount of space: copy everything to the right onto the scratch tape, write the new value, copy the scratch tape back.

### How fast?

Multiplication is the catch: starting from 2 and squaring $n$ times gives $2^{2^n}$, which needs $2^n+1$ bits, so a TM would need exponential time just to write it. The fix: each instruction may produce a word **at most one bit longer** than its longest argument. Addition qualifies; multiplication does not, but can be done by $m$ additions and shifts (time proportional to $m^2$).

> **Theorem.** If a computer (i) has only instructions that increase the maximum word length by at most 1, and (ii) has only instructions that a multitape TM can perform on words of length $k$ in $O(k^2)$ steps, then the multitape TM above simulates $n$ steps of the computer in $O(n^3)$ steps.

**Why.** The program is fixed: let $c$ be the longest word or address in it, $d$ the number of words it occupies.

- After $n$ steps no word or address is longer than $c+n$ bits.
- Each instruction gives a value to at most one new address, so there are at most $d+n$ addresses.
- Each address–value pair uses at most $2(c+n)+2$ cells with its markers, so tape 1 holds at most $2(c+n+1)(d+n)=O(n^2)$ cells.
- Each of the fixed number of address lookups per instruction scans tape 1: $O(n^2)$. Each operation on $O(n)$-bit words is $O(n^2)$ by assumption (ii). Shifting copies $O(n^2)$ cells: $O(n^2)$.
- So one computer step is $O(n^2)$ TM steps, and $n$ steps are $O(n^3)$.

Converting the multitape TM to one tape squares the time, so a **one-tape TM simulates $n$ steps of the computer in $O(n^6)$ steps**. Either way the slowdown is polynomial, so "a deterministic TM can simulate $n$ moves of a conventional computer in $P(n)$ moves" is **true**. This is why polynomial time means the same thing on a TM and on a real computer, and why TMs are the right model for complexity theory.

## Summary of equivalences

| Model | Accepts | Simulation cost by a one-tape DTM |
|---|---|---|
| multitape TM | RE | $O(n^2)$ |
| nondeterministic TM | RE | exponential (no polynomial simulation known) |
| semi-infinite tape | RE | linear (fold the tape) |
| two-stack machine | RE | polynomial |
| two-counter machine | RE | (very slow, but same languages) |
| computer (word growth ≤ 1 bit per step) | RE | $O(n^3)$ multitape, $O(n^6)$ one-tape |
`

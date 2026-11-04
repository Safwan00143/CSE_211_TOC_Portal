import { tmTableMd, tmTraceTex } from "@/lib/automata"
import { tmFirstSymbol } from "../machines/notes-tm2"

const r = String.raw
const st = (q: string) => `[${q.replace(/^q(\d)/, "q_$1")}]`

export const tmTechniquesNote = r`
## Tricks, not new power

A TM is exactly as powerful as a conventional computer. The techniques below make TM programs easier to write and read; none of them extends the basic model. Each is only a way of naming states or tape symbols.

## Storage in the state

The finite control can hold a finite amount of **data** as well as a position in the "program". Think of a state as a tuple $[q,A,B,C]$: a control part $q$ and data parts. The set of states is still finite, so nothing changes formally.

**Example (HMU 8.6).** $M=(Q,\{0,1\},\{0,1,B\},\delta,[q_0,B],B,\{[q_1,B]\})$ remembers the first symbol and checks that it never appears again, so $L(M)=01^*+10^*$. Here $Q=\{q_0,q_1\}\times\{0,1,B\}$:

1. $\delta([q_0,B],a)=([q_1,a],a,R)$ for $a\in\{0,1\}$: copy the first symbol into the state.
2. $\delta([q_1,a],\bar a)=([q_1,a],\bar a,R)$, where $\bar a$ is the complement of $a$: skip symbols different from the stored one.
3. $\delta([q_1,a],B)=([q_1,B],B,R)$: reaching the first blank, accept.

There is no move for $([q_1,a],a)$, so a second copy of the stored symbol halts M without accepting.

${tmTableMd(tmFirstSymbol, st)}

On 01111 (accepted):
${tmTraceTex(tmFirstSymbol, "01111", { stateTex: st })}

On 01101 M halts in $[q_1,0]$ scanning the second 0, with no move, so it rejects.

## Multiple tracks

Think of the tape as several **tracks**: each cell holds a tuple $[X,Y,Z]$, one symbol per track. The tape alphabet is just a set of tuples, so again nothing new is added.

A common use: one track holds the data, another holds **check marks**. Checking off a symbol ($[B,0]\to[*,0]$) records that it has been used, or marks a few positions. The input symbol $0$ is identified with $[B,0]$.

**Example (HMU 8.7):** $L_{wcw}=\{wcw \mid w\in(0+1)^+\}$, which is not context-free. States $\{q_1,\dots,q_9\}\times\{0,1,B\}$ (storage in the state too), tape symbols $\{B,*\}\times\{0,1,c,B\}$. With $a,b\in\{0,1\}$:

1. $\delta([q_1,B],[B,a])=([q_2,a],[*,a],R)$: pick up the next unchecked symbol of the first block, store it, check it off.
2. $\delta([q_2,a],[B,b])=([q_2,a],[B,b],R)$: move right looking for c.
3. $\delta([q_2,a],[B,c])=([q_3,a],[B,c],R)$: pass the c.
4. $\delta([q_3,a],[*,b])=([q_3,a],[*,b],R)$: skip checked symbols.
5. $\delta([q_3,a],[B,a])=([q_4,B],[*,a],L)$: the first unchecked symbol matches the stored one; check it, forget the stored symbol, go left.
6. $\delta([q_4,B],[*,a])=([q_4,B],[*,a],L)$: move left over checked symbols.
7. $\delta([q_4,B],[B,c])=([q_5,B],[B,c],L)$: at c, look at the symbol just left of it.
8. $\delta([q_5,B],[B,a])=([q_6,B],[B,a],L)$: it is unchecked, so more of the first block remains.
9. $\delta([q_6,B],[B,a])=([q_6,B],[B,a],L)$: move left over unchecked symbols.
10. $\delta([q_6,B],[*,a])=([q_1,B],[*,a],R)$: at a checked symbol, step right and start the next round.
11. $\delta([q_5,B],[*,a])=([q_7,B],[*,a],R)$: the symbol left of c is checked, so the first block is done.
12. $\delta([q_7,B],[B,c])=([q_8,B],[B,c],R)$: pass the c.
13. $\delta([q_8,B],[*,a])=([q_8,B],[*,a],R)$: skip checked symbols of the second block.
14. $\delta([q_8,B],[B,B])=([q_9,B],[B,B],R)$: blank reached with nothing unchecked: accept.

If $q_8$ meets an unchecked 0 or 1, the blocks differ and M halts without accepting.

## Subroutines

A **subroutine** is a set of states that performs one useful task: it has a start state and a state with temporarily no moves that acts as the "return". Calling it means moving to its start state. A TM cannot remember a return address, so if a subroutine is needed from several places, make **copies** of it, one per call site, each returning to its own state. (HMU's multiplication machine, for example, calls a "Copy" subroutine once per 0 of the first factor.)

## Template: bitwise operations on two binary numbers

Exam questions often give $w_1cw_2c$ (equal lengths) and ask for AND, OR, XOR, NOT, or equality after the second c. Combine the two tricks:

1. **Pick up** the leftmost unchecked bit $a$ of $w_1$, check it off, store $a$ in the state.
2. **Move right** past c to the leftmost unchecked bit $b$ of $w_2$, check it off, store $r=a\ \mathrm{op}\ b$ in the state (the state only needs to remember $r$ now).
3. **Move right** past the second c and past the bits already written, and write $r$ in the first blank.
4. **Return left**: over the results, over c, over $w_2$, over c, over the unchecked part of $w_1$ to the last checked bit, then step right.
5. **Repeat** until step 1 finds c instead of a bit; then remove the check marks if the question wants a clean tape, and halt (accept).

The data stored in the state is one bit, so each control state is doubled at most: $[q,0]$ and $[q,1]$. The site's verified machine for AND uses exactly these steps and is checked on every valid input up to length 10. Changing the operation only changes which $r$ step 2 stores; for equality, store "still equal / differs" instead and write 0 or 1 once at the end.
`

/* Worked solutions for the 6-batch (2007-2008) paper, keyed by part ("1a", "5", "13"). */
import { faRunTex, faTableMd, pdaAcceptingTrace, pdaTraceTex, tmTableMd, tmTraceTex } from "@/lib/automata"
import { cykTableMd, cykWorkingMd } from "@/lib/cnf"
import { derivation } from "@/lib/derivations"
import { b06g13, b06pda5, b06q1b, b06tm01, b06tm11, b06tmAdd } from "../machines/b06"
import { b08pal } from "../machines/b08"
import { after } from "./compose"
import { b08Solutions } from "./b08-solutions"
import { b12Solutions } from "./b12-solutions"
import { b15Solutions } from "./b15-solutions"
import { b18Solutions } from "./b18-solutions"
import { b21Solutions } from "./b21-solutions"
import { b22Solutions } from "./b22-solutions"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"
const pdaName = (q: string) => ({ qs: "q_s", qa: "q_a", qc: "q_c", qb: "q_b", qm: "q_m", qacc: "q_{acc}" })[q] ?? q
const addName = (q: string) => (q === "qf" ? "q_f" : q)

export const b06Solutions: Record<string, string> = {
  "1a": r`A **parse tree** for a CFG $G=(V,T,P,S)$ shows how a string is derived. Its properties (HMU):

1. **Each interior node** is labelled by a variable in $V$.
2. **Each leaf** is labelled by a variable, a terminal, or $\varepsilon$; a leaf labelled $\varepsilon$ is the only child of its parent.
3. **If an interior node is labelled $A$ and its children are $X_1,\dots,X_k$** (left to right), then $A\to X_1\cdots X_k$ is a production.
4. The **root** is labelled by the start variable (for a derivation of a string in $L(G)$).
5. The **yield** (the leaves read left to right) is a sentential form derivable from the root; if all leaves are terminals or $\varepsilon$, the yield is a string of the language.

**Key facts.** A string $w$ has a parse tree with root $A$ and yield $w$ iff $A\Rightarrow^*w$ iff $A\Rightarrow^*_{lm}w$ iff $A\Rightarrow^*_{rm}w$. Each parse tree corresponds to **exactly one** leftmost (and one rightmost) derivation, and a grammar is **ambiguous** iff some string has two parse trees.

**Example.** $E\to E+E\mid E*E\mid a$: the string $a+a*a$ has the parse tree with root $E\to E+E$, whose right child expands by $E\to E*E$; its yield is $a+a*a$. A second tree, with $E\to E*E$ at the root, shows the grammar is ambiguous:

${fig("cfg-amb-expr")}`,

  "1b": r`**Reading.** "Each a is followed by at least one b" is taken as: every a is **immediately** followed by a b (so ab, abb, babab are in; aab, ba are not). The language is $(b+ab)^*$.

**Design steps.**

1. **What must be remembered?** Only whether the last symbol was an a that still needs its b.
2. **States:** $s$ = "every a so far has had its b" (accepting, start); $w$ = "the last symbol was a, waiting for b"; $d$ = "an a was followed by an a" (dead).
3. **Transitions:** from $s$, b stays and a goes to $w$; from $w$, b returns to $s$ and a goes to $d$; $d$ loops.
4. **Accepting:** $s$ only (in $w$ the last a has no b).

${fig("b06-1b")}

${faTableMd(b06q1b)}

${faRunTex(b06q1b, "babab")}
${faRunTex(b06q1b, "aab")}

(Checked on every string up to length 10.) If instead "followed by" means "somewhere later", the language is the strings in which the last a (if any) has a b after it, i.e. that is, every string except those ending in a: $\varepsilon+(a+b)^*b$.`,

  "1c": r`A **set-former** (set-builder notation) defines a language by a property its strings must satisfy:
$$
L=\{w \mid \text{statement about } w\}\quad\text{or}\quad L=\{\text{expression with parameters} \mid \text{conditions on the parameters}\}.
$$

**Examples.**

- $\{w \mid w \text{ consists of an equal number of 0s and 1s}\}$: the property is stated in words.
- $\{w \mid w \text{ is a binary integer that is prime}\}$.
- $\{0^n1^n \mid n\ge1\}=\{01,0011,000111,\dots\}$: the strings are given by a formula with a parameter $n$.
- $\{0^i1^j \mid 0\le i\le j\}$: two parameters with a condition.

Set-formers describe **what** is in the language, not how to recognise it; automata, grammars and regular expressions give constructive descriptions. A set-former can describe languages of any complexity (regular, context-free, or not even recognisable).`,

  "2a": after(b12Solutions["8b"], "**Construction (subset construction).**"),

  "2b": r`**$(0\cup1)^*$** is the set of **all** binary strings, including $\varepsilon$: $\Sigma^*$.

**$(0\Sigma^*)\cup(\Sigma^*1)$** is the set of binary strings that **start with 0 or end with 1** (or both). For example 0, 01, 0110, 1, 11, 101 are in it; $\varepsilon$, 10, 110 are not. (Checked on every binary string up to length 9.)`,

  "2c": b18Solutions["2a"] + r`

**Infinite capacity?** No, not for a finite automaton: by definition it has **finitely many** states, so it can distinguish only finitely many situations. This is exactly why finite automata cannot recognise languages like $\{0^n1^n\}$ (they would need a separate state for every $n$). A machine with infinitely many states would not be a finite automaton; to get unbounded memory we add an **external** store instead: a stack (PDA) or a tape (Turing machine).`,

  "3a": b15Solutions["4c"],

  "3b": r`**Ambiguity.** A CFG is ambiguous if some string has **two different parse trees** (equivalently two leftmost derivations). Example: $E\to E+E\mid E*E\mid(E)\mid a$, where $a+a*a$ can be grouped as $a+(a*a)$ or $(a+a)*a$.

**Removing ambiguity.** There is no general algorithm (deciding whether a CFG is ambiguous is undecidable), but common ambiguities can be removed by restructuring the grammar:

- **Precedence:** one variable per precedence level, so higher-precedence operators appear lower in the tree: $E\to E+T\mid T$, $T\to T*F\mid F$, $F\to(E)\mid a$.
- **Associativity:** make the recursion one-sided (left recursion for left-associative operators: $E\to E+T$).
- **Dangling else:** separate "matched" and "unmatched" statements.

The new grammar generates the same language with exactly one parse tree per string.

**Inherent ambiguity.** A CFL is inherently ambiguous if **every** grammar for it is ambiguous, so the ambiguity cannot be removed. Example: $\{a^nb^nc^md^m\}\cup\{a^nb^mc^md^n\}$: strings $a^nb^nc^nd^n$ must be generated both ways in any grammar.`,

  "3c": b08Solutions["1"],

  "4a": r`**Grammar.**
$$
P\to\varepsilon\mid0\mid1\mid0P0\mid1P1
$$

**Claim.** $L(G)=\{w\in\{0,1\}^* \mid w=w^R\}$.

**(⊇) Every palindrome is generated**, by induction on $|w|$.

- *Basis:* $|w|\le1$: $w$ is $\varepsilon$, 0 or 1, generated in one step.
- *Induction:* $|w|\ge2$ and $w=w^R$. Then $w$ begins and ends with the same symbol: $w=0x0$ or $w=1x1$, and $x$ is a palindrome (reversing $w$ reverses $x$), shorter than $w$. By the induction hypothesis $P\Rightarrow^*x$, so $P\Rightarrow0P0\Rightarrow^*0x0=w$ (similarly for 1).

**(⊆) Every generated string is a palindrome**, by induction on the number of derivation steps.

- *Basis:* one step: $P\Rightarrow\varepsilon$, 0 or 1, all palindromes.
- *Induction:* a longer derivation starts $P\Rightarrow0P0$ (or $1P1$), and the inner $P$ derives some $x$ in fewer steps. By the hypothesis $x$ is a palindrome, so $w=0x0$ satisfies $w^R=0x^R0=0x0=w$.

Hence $L(G)$ is exactly the set of palindromes over $\{0,1\}$. $\blacksquare$ (Also checked by machine on all strings up to length 9.)

${derivation(b08pal, "0110", "lm")}`,

  "4b": b08Solutions["8"],

  "4c": r`Even though regular expressions, DFAs, NFAs and ε-NFAs all describe exactly the regular languages, regular expressions are needed because:

1. **Declarative and compact.** A regular expression says *what* the strings look like, in one line, e.g. $(0+1)^*011$; an automaton describes *how* to check, as a diagram or table.
2. **Text-friendly.** They can be typed and stored as strings, so they are the input language of tools: grep, sed, editors' search, programming languages' regex libraries.
3. **Algebra.** They obey algebraic laws ($R+R=R$, $(R^*)^*=R^*$, $R(S+T)=RS+RT$, …) that let us simplify and compare patterns by calculation.
4. **Front end for automata.** Tools such as lexical-analyser generators (lex/flex) take regular expressions for tokens and **compile** them into automata (regex → ε-NFA → DFA → minimal DFA) automatically.

So automata are the efficient **implementation**, and regular expressions the convenient **specification**.`,

  "5": r`$L=\{a^ic^k(bc)^i \mid i,k\ge0\}$: some a's, any c's, then **as many bc pairs as a's**.

**Design.** Push X for each a; read any c's without touching the stack; then for each bc pair pop one X (the b pops, the c just follows); accept when the bottom marker is exposed.

${fig("b06-5")}

**Trace on acbc** ($i=1$, $k=1$):
${pdaTraceTex(pdaAcceptingTrace(b06pda5, "acbc")!, pdaName)}

(Checked against the definition on every string over $\{a,b,c\}$ up to length 9.)`,

  "6": b18Solutions["10a"],

  "7": r`**HMU's machine.** Repeatedly change the leftmost 0 to X, move right to the leftmost 1 and change it to Y, and return. When no 0 remains, check that no 1 remains.

${fig("b06-7")}

**Transition table** (– means no move, so the machine halts and rejects):

${tmTableMd(b06tm01)}

**IDs on 0011:**
${tmTraceTex(b06tm01, "0011")}

It reaches the accepting state $q_4$, so 0011 is accepted. (Checked on every binary string up to length 10; every round marks two symbols, so the machine always halts.)`,

  "8": r`**Idea (any kind of TM is allowed, so take the simplest correct one).** Use $x+y=(x+1)+(y-1)$: repeatedly **decrement** $y$ and **increment** $x$ (both in binary) until $y=0$; then erase $y$ and the comma.

1. **go:** move right to the comma; **z:** scan $y$. If it contains a 1, go to its end (**e**); if $y$ is all 0s, go to **erase**.
2. **dec:** subtract 1 from $y$, right to left: 0 becomes 1 (borrow, keep going left), the first 1 becomes 0.
3. **left, inc:** move left past the comma to the end of $x$ and add 1: 1 becomes 0 (carry), the first 0 becomes 1; a carry past the top bit writes a new leading 1 in the blank to the left.
4. **home:** return to the left end, and repeat from 1.
5. **erase:** blank out $y$ and the comma, and halt. The tape holds $x+y$.

${tmTableMd(b06tmAdd, addName)}

**Example: 01,01** ($1+1=2$): one round turns $y$ into 00 and $x$ into 10, then $y$ is erased, leaving **10**. Abbreviated trace:
${tmTraceTex(b06tmAdd, "01,01", { stateTex: addName })}

(Checked on every valid input up to length 7: the tape always ends with exactly the binary sum. This machine takes time proportional to the **value** of $y$, i.e. exponential in its length; a faster machine adds column by column with a carry, as in the subtraction question of 2009–10 Q12(c), using a second tape or marked bits.)`,

  "9": r`**(i) Multitape Turing machine.** ${after(b22Solutions["10"], "A $k$-tape TM").split("**Simulation")[0]}It is no more powerful than a one-tape TM (a one-tape machine with $2k$ tracks simulates it, $n$ moves in $O(n^2)$ moves), but it is often much faster and easier to program (e.g. copying or comparing strings).

**(ii) Multistack machine.** A PDA with $k$ stacks: one move depends on the state, the input symbol (or ε) and the top of **every** stack, and may replace each top independently.

- **One stack** = an ordinary PDA: exactly the context-free languages.
- **Two stacks already have the full power of a Turing machine**: keep the tape to the left of the head on one stack and the tape from the head rightwards on the other (top = the scanned cell). Moving the head right pops a symbol from the right stack and pushes it onto the left one; moving left does the reverse; writing replaces the top of the right stack. So every TM can be simulated, and conversely a TM can simulate any multistack machine (one track per stack).
- Hence $k$-stack machines for $k\ge2$ accept exactly the RE languages.`,

  "10": after(b21Solutions["11"], "**(i) True.**").split("**(ii)")[0].replace("**(i) True.** A deterministic TM can simulate a conventional computer with only **polynomial** slowdown.", "A Turing machine can simulate a conventional computer, with only **polynomial** slowdown:"),

  "11": r`**Definitions.**

- **Recursive** (decidable): some TM accepts $L$ and **halts on every input** (accepting exactly the strings of $L$).
- **Recursively enumerable** (RE): some TM accepts exactly $L$; on strings not in $L$ it may reject or run for ever.
- **Non-RE**: no TM accepts $L$. Example: the diagonalisation language $L_d$.

Recursive ⊂ RE ⊂ all languages, both inclusions proper ($L_u$ is RE but not recursive).

**The given TM.** $q_0$ erases 0s and moves right; on the first 1 it moves to $q_1$; $q_1$ erases 1s; on the blank after them it accepts. Any 0 after a 1, or a blank while still in $q_0$, has no move (reject).

$$
L(M)=\{0^m1^n \mid m\ge0,\ n\ge1\}=0^*1^+.
$$

${tmTraceTex(b06tm11, "011")}

(Checked on every binary string up to length 9.)`,

  "12": b21Solutions["12"],

  "13": r`**Chomsky normal form.** Every production is $A\to BC$ (two variables) or $A\to a$ (one terminal); the start variable may also have $S\to\varepsilon$ (Sipser). Every CFL without $\varepsilon$ has a CNF grammar.

**CYK on $w=$ abaab.**

${cykWorkingMd(b06g13, "abaab")}

${cykTableMd(b06g13, "abaab")}

${fig("b06-13")}

$S\in X_{15}$, so **abaab $\in L(G)$**. (Confirmed by a direct membership test.)`,
}

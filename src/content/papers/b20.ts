import type { Paper } from "../types"

const r = String.raw

export const paperB20: Paper = {
  slug: "b20",
  batch: "20 batch",
  course: "CSE 211",
  session: "2021-2022",
  year: 2023,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2021-2022",
  date: "03/10/2023",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer Question No. 1 and any TWO from the rest. Question No. 1 is COMPULSORY.",
      questions: [
        {
          no: 1,
          stem: "**[COMPULSORY]**",
          parts: [
            {
              part: "a",
              marks: 4,
              topic: "intro",
              prompt: r`In the password-protected login system of a computer, which of the three traditionally central areas of the Theory of Computation has been applied? Explain clearly.`,
            },
            {
              part: "b",
              marks: 10,
              topic: "dfa",
              prompt: r`Design a deterministic finite automaton (DFA) with not more than five states for the alphabet $\Sigma = \{a, b\}$, which accepts the strings that begin with $a$ but does not contain the substring $aab$. Showing only the state diagram for this DFA should suffice.`,
            },
            {
              part: "c",
              marks: 9,
              topic: "closure",
              prompt: r`If $M$ is a deterministic finite automaton (DFA) that recognizes the language $C$, swapping the accepting and non-accepting states in $M$ yields a DFA that recognizes $\overline{C}$. Explain why this technique works. Does this method work for non-deterministic finite automatons (NFA) as well? Why? Give examples. *(6+3)*`,
              alsoAsked: ["2022–23 Q3(b)"],
            },
            {
              part: "d",
              marks: 9,
              topic: "pumping-regular",
              prompt: r`Comment on the acceptability of the following arguments by B L Perfunctory (BLP) related to the pumping lemma for regular languages:

(i) Consider the set of palindromes over $\{0, 1\}$. BLP supposed that the set of palindromes is regular. Let $p$ be the pumping length. Consider the string $w = 00011000$. Clearly $w$ is a palindrome. By the pumping lemma, there must exist strings $x$, $y$, and $z$ satisfying the constraints of the pumping lemma. $xy$ is entirely contained in the $0^p$ at the start of $w$. So $x$ and $y$ consist entirely of zeros.

Now, consider $xz$. By the pumping lemma, $xz$ must be in the language. But $xz$ can't be a palindrome. This means that the set of palindromes doesn't satisfy the pumping lemma and, thus, the set of palindromes cannot be regular.

(ii) Consider the language $\{w \mid w \text{ has an equal number of 0s and 1s}\}$. BLP supposed that the language is regular. If $p$ is the pumping length, let $w$ be the string $0^{p/4}1^{p/4}0^{p/4}1^{p/4}$, $w = xyz$, where for any $i \ge 0$ the string $xy^iz$ is in the language. $y$ will be entirely contained in the first 0s. For any length of $y$ in the permissible range, $xy^iz$ will have an unequal number of 0s and 1s and hence not in the given language. Thus BLP concluded that the given language cannot be regular.

(iii) Consider the language $\{0^{2n} \mid n \ge 0\}$. BLP supposed that the language is regular. If $p$ is the pumping length, let $w$ be the string $w = 0^{2p}$, $w = xyz$, where for any $i \ge 0$, the string $xy^iz$ is in the language. If $x = \varepsilon$, $y = 0$, $z = 0^{2p-1}$, taking $i = 0$, we get $xy^iz = 0^{2p-1}$, which isn't in the language because its length is odd. So, the language isn't regular after all.`,
            },
            {
              part: "e",
              marks: 3,
              topic: "cfg",
              prompt: r`Why are context free grammars called "context free"?`,
              alsoAsked: ["2023–24 Q3(c)"],
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 4,
              topic: "nfa",
              prompt: r`"Deterministic and nondeterministic finite automata recognize the same class of languages. Such equivalence is both surprising and useful". Why is this equivalence both surprising and useful?`,
            },
            {
              part: "b",
              marks: 10,
              topic: "regex",
              prompt: r`Using the basic principles convert the regular expression $(((00)^*(11)) \cup 01)^*$ into a nondeterministic finite automata (NFA).`,
            },
            {
              part: "c",
              marks: 6,
              topic: "closure",
              prompt: r`Consider the languages given below for an alphabet $\{a, b\}$,

$L_1 = \{a, aa, aaa\}$,

$L_2 = \{a, ab, aab, aabb\}$,

$L_3 = \{\text{Number of } b\text{'s is a multiple of } 3\}$

Now, comment on the size (finite/infinite) for each of the following languages. You must state the reason in each case.

i. $L_1^* \circ L_2^*$

ii. $L_1 \circ (L_1 \cup L_2)$

iii. $L_2 \circ L_3$`,
              note: "In (i) the superscripts are printed as small dots; they are read here as stars.",
            },
            {
              part: "d",
              marks: 15,
              topic: "cfg",
              prompt: r`Design a context free grammar for the language $\{a^ib^jc^k \mid i \ne j + k, \text{ where } i, j, k \ge 0\}$. Merely putting forth the production rules shall not suffice. You need to explain your design idea first for your answer to be acceptable.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 4,
              topic: "intro",
              prompt: r`Why is the Kleene star of a null set an empty string?`,
              alsoAsked: ["2022–23 Q3(c)", "2016–17 Q2(c)"],
            },
            {
              part: "b",
              marks: 10,
              topic: "nfa",
              prompt: r`Design a nondeterministic finite automaton (NFA) which accepts binary numbers which contains at least two 0s, or exactly two 1s. Showing only the state diagram for this NFA should suffice.`,
            },
            {
              part: "c",
              marks: 9,
              topic: "nfa",
              prompt: r`Convert the following non-deterministic finite automaton (NFA) into an equivalent deterministic finite automaton (DFA). You don't need to show the calculations. Showing only the state diagram for the DFA should be sufficient.

| | $a$ | $b$ | $\varepsilon$ |
|---|---|---|---|
| $q_1$ | $\{q_3\}$ | $\emptyset$ | $\{q_2\}$ |
| $q_2$ | $\{q_1\}$ | $\emptyset$ | $\emptyset$ |
| $q_3$ | $\{q_2\}$ | $\{q_2,q_3\}$ | $\emptyset$ |`,
              note: "The printed table marks neither the start state nor the accepting states. The solution takes q1 as the start and q2 as the only accepting state, as in the textbook version of this NFA (Sipser, Exercise 1.16(b)).",
            },
            {
              part: "d",
              marks: 12,
              topic: "regex",
              prompt: r`Which one of the following regular expressions represents the language: the set of *all* binary strings having two consecutive 0s as well as two consecutive 1s? You need to provide the necessary explanation regarding why your choice is correct while the others are not. Your answer will not be accepted without proper explanations.

A. $(0+1)^*0011(0+1)^* + (0+1)^*1100(0+1)^*$

B. $(0+1)^*(00(0+1)^*11 + 11(0+1)^*00)(0+1)^*$

C. $(0+1)^*00(0+1)^* + (0+1)^*11(0+1)^*$

D. $00(0+1)^*11 + 11(0+1)^*00$`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 4,
              topic: "pumping-regular",
              prompt: r`Why is it said that the pumping lemma for regular languages is useful for "negative proofs" only?`,
            },
            {
              part: "b",
              marks: 12,
              topic: "closure",
              prompt: r`Let $N_1 = (Q_1, \Sigma, \delta_1, q_1, F_1)$ recognizes $L_1$, and $N_2 = (Q_2, \Sigma, \delta_2, q_2, F_2)$ recognizes $L_2$. We want to construct $N = (Q, \Sigma, \delta, q_0, F)$ to recognize $L_1 \cup L_2$. Now answer clearly the following with detailed explanations (must include the reason behind an action):

i. How do we get the start state for $N$?

ii. How do we get the set of accept states for $N$?

iii. When we are considering the transitions originating from the start state of $N$, what are the cases that need to be considered? Why? What are the possible destination states in each case?`,
              alsoAsked: ["2019–20 Q3(c) (similar)"],
            },
            {
              part: "c",
              marks: 9,
              topic: "cfg",
              prompt: r`To design a context free grammar (CFG) for the language, $\{a^ib^jc^k \mid i = j, \text{ or, } j = k, \text{ where } i, j, k \ge 0\}$, A B Sloppy produced the following solutions:

i. $S \to aSb \mid bSc \mid aS \mid Sc \mid \varepsilon$

ii.
$$
\begin{aligned}
S_0 &\to S_1 \mid S_3\\
S_1 &\to aS_1bS_2c \mid \varepsilon\\
S_2 &\to S_2c \mid \varepsilon\\
S_3 &\to aS_4bS_3c \mid \varepsilon\\
S_4 &\to aS_4 \mid \varepsilon
\end{aligned}
$$

Do you find any flaw in the above solutions? Explain clearly. *(3+6)*`,
            },
            {
              part: "d",
              marks: 10,
              topic: "cfg",
              prompt: r`We have a certain grammar for an infinite language. For a string $s$ in that language, comment with reasons on the ambiguity of $s$ and the grammar for each of the following scenarios.

i. The grammar generates only one parse tree for $s$ but generates more than one parse trees for other strings in the language.

ii. The grammar generates only one parse tree for $s$ as well for other strings in the language.

iii. The grammar generates more than one leftmost derivations for $s$.`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are NINE questions in this section. Answer any SEVEN.",
      questions: [
        {
          no: 5,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cnf-cyk",
              prompt: r`Convert the following context-free grammar into an equivalent grammar in *Chomsky normal form (CNF)*. Show the steps of your conversion.
$$
\begin{aligned}
S &\to A1A \mid B\\
A &\to 0A \mid 1A \mid \varepsilon\\
B &\to 1
\end{aligned}
$$`,
              alsoAsked: ["2017–18 Q7(a) (similar)"],
            },
          ],
        },
        {
          no: 6,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cfg",
              prompt: r`What is an ambiguous grammar and an inherently ambiguous language? Determine whether the following grammar is ambiguous or not: *(6+9)*
$$
\begin{aligned}
S &\to AB \mid C\\
A &\to aAb \mid ab\\
B &\to cB \mid c\\
C &\to aCc \mid aDc\\
D &\to bD \mid b
\end{aligned}
$$`,
              alsoAsked: ["2019–20 Q6"],
            },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "pda",
              prompt: r`Let $\Sigma = \{a, +, *, (, )\}$ and consider the language $\text{ARITH} = \{w \in \Sigma^* \mid w \text{ is a legal arithmetic expression}\}$. Construct a pushdown automaton (PDA) that recognizes the language ARITH. Show its transition diagram. For example: $a+a*a$ and $((a+a)*(a+a))+(a)$ are legal expressions whereas $aa*a$ (two consecutive variables without an operator), $a{+}{+}a$ (two consecutive operators), $+a$ (starts with an operator) and $(a+a))$ (imbalanced parentheses) are not.`,
              alsoAsked: ["2019–20 Q8"],
            },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "pumping-cfl",
              prompt: r`Provide an example of a language that is not *context-free*. Illustrate that the language you provided is not context-free using the pumping lemma for context-free languages. *(5+10)*`,
              alsoAsked: ["2023–24 Q7"],
            },
          ],
        },
        {
          no: 9,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "tm-techniques",
              prompt: r`Construct a Turing machine that takes as input a number $w$ in *signed magnitude* form and computes the 2's *complement* of the number. Initially the tape contains a number in binary, MSB being the leftmost bit. If the MSB is 0, the number will remain the same. However, if the MSB is 1, $w$ needs to be converted to its two's complement. Recall that you can convert a number to its two's complement by working from the least significant bit (LSB) towards the most significant bit (MSB), copying all the zeros until the first 1 is reached; then copy that 1, and flipping all the remaining bits (leave the MSB as 1). Your TM should terminate with only the two's complement of the number on the tape. (You can use multiple tracks, storages in the state if you wish).`,
            },
          ],
        },
        {
          no: 10,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "tm-variants",
              prompt: r`Justify whether the following statements are true or false: *(7+8)*

i) A one-tape Turing machine with multiple tracks can simulate a Multi-tape Turing machine.

ii) A conventional computer can simulate $n$ moves of a non-deterministic Turing machine in $P(n)$ moves, where $P(n)$ is some polynomial in $n$.`,
              alsoAsked: ["2022–23 Q11(ii)", "2023–24 Q10"],
            },
          ],
        },
        {
          no: 11,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "undecidability",
              prompt: r`What is (i) the Diagonalization language, and (ii) the Universal language? Show that the Halting problem is *not recursive*. *(6+9)*`,
              alsoAsked: ["2023–24 Q11", "2022–23 Q12"],
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "i",
              marks: 8,
              topic: "complexity",
              prompt: r`Briefly explain how Cook's theorem shows that all problems in NP are reducible to the *satisfiability* problem in polynomial time.`,
              alsoAsked: ["2022–23 Q13(i)"],
            },
            {
              part: "ii",
              marks: 7,
              topic: "complexity",
              prompt: r`Explain how finding a polynomial time algorithm for any NP-complete problem implies P = NP.`,
            },
          ],
        },
        {
          no: 13,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "complexity",
              prompt: r`For each of the following pairs of classes of languages, what is the widely believed relationship between the classes (whether they are equal or which one is a subset of the other)? Briefly justify your answer.

i) P and NP

ii) P and PSPACE

iii) PSPACE and NPSPACE`,
            },
          ],
        },
      ],
    },
  ],
}

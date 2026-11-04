import type { Paper } from "../types"

const r = String.raw

export const paperB16: Paper = {
  slug: "b16",
  batch: "16 batch",
  course: "CSE 211",
  session: "2017-2018",
  year: 2019,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2017-2018",
  date: "07/04/2019",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer any THREE.",
      questions: [
        {
          no: 1,
          parts: [
            { part: "a", marks: 6, topic: "complexity", prompt: r`Define the Boolean Satisfiability Problem with necessary examples.` },
            { part: "b", marks: 20, topic: "complexity", prompt: r`With the knowledge that 3-SAT problem is NP, prove that graph 3-colorability is NP-Complete.` },
            {
              part: "c",
              marks: 9,
              topic: "complexity",
              prompt: r`Using the graph framework in Question (b), show how the final 3-color graph for a 3-SAT problem of,
$$
(x_1 \lor \overline{x_2} \lor \overline{x_3}) \land (x_1 \lor x_3 \lor x_4),
$$
will look like.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "closure",
              prompt: r`Let us say that we have a DFA $D$ for a certain language $L$ for an alphabet $\Sigma$. How can you readily find the DFA from $D$ for the language, $\Sigma^* - L$? Explain why your proposed method works. Is there any scenario for which this will not work? Does your proposed method work for NFA's as well? Explain.`,
              alsoAsked: ["2021–22 Q1(c)", "2022–23 Q3(b)"],
            },
            {
              part: "b",
              marks: 17,
              topic: "dfa",
              prompt: r`Give DFA's (draw state diagrams only) accepting the following languages over the alphabet $\{0, 1\}$: *(10+7)*

(i) The set of all strings beginning with a 1 that, when interpreted as a binary integer, is a multiple of 5. For example, strings 101, 1010, and 1111 are in the language; 0, 100, 0101, and 111 are not.

(ii) The set of all strings beginning with a 1 that, when interpreted as a binary integer, is a power of 2.`,
            },
            { part: "c", marks: 8, topic: "regex", prompt: r`Using the techniques of proving closure properties of regular languages, draw the NFA for the regular expression, $(a \cup b)^*aba$.` },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 18,
              topic: "nfa",
              prompt: r`Design an NFA which accepts all and only the set of strings over the alphabet $\{0, 1\}$ such that there are at least two 0's with nonzero number of characters between these two 0's and that (number of characters) is a multiple of 4. In addition to these pairs of 0's, there may be other 0's in the string. Some of the strings accepted by this NFA are, 00000, 101111010, 01000010111011. And some of the strings not accepted by this NFA are, 00, 10101010. Show the NFA using state diagram as well as transition table.`,
              note: "The example 00000 does not fit the definition: its two outermost 0s have only 3 characters between them. The solution follows the definition, which all the other examples agree with.",
            },
            {
              part: "b",
              marks: 17,
              topic: "pumping-regular",
              prompt: r`After learning the pumping lemma (difficult to understand, easy to go astray when applying it), Surcharged Skye got very excited and came up with very personal opinions regarding a number of languages as follows:

(i) For $L_1 = \{ww \mid w \in \{0,1\}^*\}$, we choose the string $0^p0^p$, take $x = \varepsilon$, $y = (00)^k$, $k \le \frac{p}{2}$. Now, since $\forall i \ge 0$, $xy^iz \in L_1$, $L_1$ is regular.

(ii) For $\Sigma = \{0, 1\}$, $L_2 = \{w \in \Sigma^* \mid n_0(w) = 2n_1(w)\}$ ($n_a(w)$ denote the number of $a$'s in $w$), we choose the string $0^{2p}1^p$, take $y = 01$. Since $\forall i \ge 0$, $xy^iz \in L_2$, we have failed to demonstrate that $L_2$ contradicts pumping lemma.

(iii) For $L_3 = \{0^n1^n0^n \mid n \ge 0\}$, we chose the string $0^k1^k0^k$, where $k = \left\lfloor \frac{p}{3} \right\rfloor$. Now, since $\forall i \ge 0$, $xy^iz \notin L_3$, for all possible $y$'s, $L_3$ is not regular.

Explain clearly whether you find anything wrong in each of the opinion expressed by Skye. Symbols used have got their usual meanings used in class.`,
              alsoAsked: ["January 2020 Q1(b)"],
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "nfa",
              prompt: r`Consider the NFA given below:

| | $a$ | $b$ | $c$ | $\varepsilon$ |
|---|---|---|---|---|
| $\to p$ | $\{p\}$ | $\{q\}$ | $\{r\}$ | $\emptyset$ |
| $q$ | $\{q\}$ | $\{r\}$ | $\emptyset$ | $\{p\}$ |
| $*r$ | $\{r\}$ | $\emptyset$ | $\{p\}$ | $\{q\}$ |

(i) Give, with necessary explanations, general forms of all the strings of length three or less accepted by the automaton.

(ii) Convert the automaton to an equivalent DFA. Showing the detailed computations is optional.`,
              alsoAsked: ["January 2020 Q1(c)"],
            },
            {
              part: "b",
              marks: 20,
              topic: "regex",
              prompt: r`Find regular expressions for each of the following languages:

i. $\Sigma = \{a, b, c\}$, $L = \{w \in \Sigma^* \mid w \text{ contains at least one occurrence of each symbol in } \Sigma\}$,

ii. $\Sigma = \{a, b\}$, $L = \{a^nb^m \mid n \ge 3, m \text{ is odd}\}$,

iii. $\Sigma = \{a, b\}$, $L = \{a^nb^m \mid (n + m) \text{ is odd}\}$,

iv. $\Sigma = \{a, b\}$, $L = \{vwv \mid v, w \in \Sigma^*, |v| = 2\}$,

v. $\Sigma = \{a, b\}$, $L = \{w \mid w \in \Sigma^*, n_a(w) \bmod 3 = 0\}$, where $n_a(w)$ denotes the number of $a$'s in $w$.`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are NINE questions in this Section. Answer any SEVEN.",
      questions: [
        {
          no: 5,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cfg",
              prompt: r`Provide context-free grammars that generate the following languages (the alphabet $\Sigma$ is $\{0, 1\}$): *(7+8)*

(a) The set of all strings with equal number of 0s and 1s

(b) $\{w \mid w \text{ contains at least three 1s}\}$`,
              alsoAsked: ["2019–20 Q5(ii)", "January 2020 Q5(b)"],
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
              prompt: r`(a) Show that the following grammar is ambiguous by giving two different parse trees for some string.
$$
E\to E+E \qquad E\to E\times E \qquad E\to(E) \qquad E\to a
$$
(b) Remove ambiguity from the grammar given above. *(7+8)*`,
            },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cnf-cyk",
              prompt: r`(a) Convert the following context-free grammar into an equivalent grammar in Chomsky normal form. Show the steps of your conversion. Here, 0 and 1 are the terminals.
$$
\begin{aligned}
S &\to A1A \mid B\\
A &\to 0A \mid 1A \mid \varepsilon\\
D &\to 00
\end{aligned}
$$
(b) Determine whether 01101 is in the language of the grammar thus found using the CYK algorithm. *(8+7)*`,
              note: "As printed, B has no production and D is never used; probably B → 00 was meant. The solution converts the grammar exactly as printed and explains the effect of the likely intended rule.",
              alsoAsked: ["2021–22 Q5 (same grammar with B → 1)"],
            },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "pda",
              prompt: r`Design a PDA that recognizes the language
$$
L = \{a^nb^nc^md^m \mid n \ge 1, m \ge 1\}.
$$
Draw its transition diagram.`,
              alsoAsked: ["2023–24 Q8 (a^n b^m c^m d^n)"],
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
              prompt: r`Design a Turing machine (TM) that takes as input two numbers $N_1$ and $N_2$ of equal length in binary and computes the logical OR of the two numbers. The tape initially contains $N_1\#N_2\#$, where '#' is a tape symbol that is used as the separator. Your TM should terminate with the OR of the two numbers in binary after the second #. (You can use multiple tracks, storage in the state if you wish).`,
              alsoAsked: ["2019–20 Q9 (AND)", "January 2020 Q9 (XOR)"],
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
              prompt: r`Briefly explain whether the following statements are true or false:

(i) A one-tape Turing machine with multiple tracks can simulate a Multi-tape Turing machine.

(ii) A deterministic Turing machine can simulate $n$ moves of a non-deterministic Turing machine in $P(n)$ moves, where $P(n)$ is some polynomial in $n$.

(iii) A deterministic Turing machine can simulate $n$ moves of a conventional computer in $P(n)$ moves, where $P(n)$ is some polynomial in $n$.`,
              alsoAsked: ["2021–22 Q10", "2022–23 Q11", "January 2020 Q10"],
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
              prompt: r`Define the following: *(9+6)*

(i) Diagonalization language

(ii) Universal language

(iii) Halting problem

Show that one of the above is not recursively enumerable (RE).`,
              alsoAsked: ["2021–22 Q11", "2022–23 Q12"],
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "complexity",
              prompt: r`The subgraph isomorphism problem is, given graphs $G_1$ and $G_2$, does $G_1$ contain a copy of $G_2$ as a subgraph? That is, can we find a subset of the nodes of $G_1$ that, together with the edges among them in $G_1$ forms an exact copy of $G_2$, when we choose the one to one correspondence between nodes of $G_2$ and nodes of the subgraph of $G_1$ properly? Prove that the subgraph isomorphism problem is NP-complete.`,
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
              prompt: r`(a) Define the following classes of languages: (i) P (ii) NP (iii) PSPACE (iv) NPSPACE

(b) For each of the following pairs of classes of languages, what is the widely believed relationship between the classes (whether they are equal or which one is a subset of the other)? Briefly justify your answer. (i) P and NP (ii) PSPACE and NPSPACE (iii) NP and PSPACE *(6+9)*`,
              alsoAsked: ["2021–22 Q13"],
            },
          ],
        },
      ],
    },
  ],
}

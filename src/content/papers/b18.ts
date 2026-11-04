import type { Paper } from "../types"

const r = String.raw

export const paperB18: Paper = {
  slug: "b18",
  batch: "18 batch",
  course: "CSE 211",
  session: "2019-2020",
  year: 2022,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2019-2020",
  date: "27/03/2022",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer any THREE questions.",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "a",
              marks: 5,
              topic: "pumping-regular",
              prompt: r`Using pumping lemma for regular languages we want to show that the language, $L = \{a^n \mid n \text{ is a prime number}\}$ is not regular. We start our argument with, "Given $p$, let $w = a^p \ldots$", where $p$ is the pumping length. Comment on the acceptability of this.`,
            },
            {
              part: "b",
              marks: 15,
              topic: "intro",
              prompt: r`Generally, an easy computational problem is preferable to a hard one. Describe one scenario which specifically requires computational problems that are hard, rather than the easy ones.`,
              alsoAsked: ["2022–23 Q1(a) (similar)"],
            },
            {
              part: "c",
              marks: 15,
              topic: "dfa",
              prompt: r`Design a deterministic finite automaton (DFA) which has an alphabet, $\Sigma = \{0, 1, 2, R\}$. This automaton keeps a running count of the sum of the numerical input symbols it reads. However, every time it receives the $R$ symbol, it resets the sum to 0. It accepts a string if the sum is 1 modulo 5 or 2 modulo 5. Showing only the state diagram should suffice.`,
              alsoAsked: ["2022–23 Q1(b) (same machine, mod 3)"],
            },
          ],
        },
        {
          no: 2,
          parts: [
            { part: "a", marks: 5, topic: "dfa", prompt: r`What is the role of a state in a finite automaton? Explain briefly.`, alsoAsked: ["2007–08 Q2(c) (similar)"] },
            {
              part: "b",
              marks: 15,
              topic: "regex",
              prompt: r`Rewrite, with necessary explanations, each of the following regular expressions as a simpler expression representing the same set.

(i) $\emptyset^* \cup a^* \cup b^* \cup (a \cup b)^*$

(ii) $((a^*b^*)^*(b^*a^*)^*)^*$

(iii) $(a^*b)^* \cup (b^*a)^*$`,
            },
            {
              part: "c",
              marks: 15,
              topic: "dfa",
              prompt: r`Design a deterministic finite automaton (DFA) which accepts the base-3 (symbols 0, 1, and 2) numbers which are not divisible by 4. Showing only the state diagram should suffice.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            { part: "a", marks: 5, topic: "regex", prompt: r`Construct the non-deterministic finite automaton NFA for the regular expression $((a^*)a)^*$ using the basic principles.` },
            {
              part: "b",
              marks: 15,
              topic: "nfa",
              prompt: r`Design an NFA for the language, $L = \{a^nb^n \mid w \text{ has an equal number of } a\text{'s and } b\text{'s},\ n \le 3\}$, with an alphabet, $\Sigma = \{a, b\}$. Showing only the state diagram will suffice. You may be penalized for using more states than the required minimum.`,
            },
            {
              part: "c",
              marks: 15,
              topic: "closure",
              prompt: r`The NFAs, $N_1 = (Q_1, \Sigma, \delta_1, q_1, F_1)$ and $N_2 = (Q_2, \Sigma, \delta_2, q_2, F_2)$ recognize the languages $L_1$ and $L_2$. You want to construct $N = (Q, \Sigma, \delta, q_0, F)$ to recognize $L_1 \cup L_2$. Write down the expression for $\delta$ and explain in detail each part of the expression with necessary justifications.`,
              alsoAsked: ["2021–22 Q4(b)"],
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 5,
              topic: "nfa",
              prompt: r`When an NFA with five states is converted to an equivalent DFA, what is the minimum and maximum number of possible states in the DFA? Answer with necessary justifications.`,
            },
            {
              part: "b",
              marks: 15,
              topic: "regex",
              prompt: r`For $\Sigma = \{a, b\}$. Write regular expressions for the following sets.

(i) All strings in $\Sigma^*$ whose number of $a$'s is divisible by three.

(ii) All strings in $\Sigma^*$ with no more than three $a$'s.

(iii) All strings in $\Sigma^*$ with exactly one occurrence of the substring $aaa$.`,
            },
            {
              part: "c",
              marks: 15,
              topic: "pumping-regular",
              prompt: r`Using pumping lemma for regular languages, prove that the language, $L = \{a^{2n}b^{3n}a^n \mid n \ge 0\}$ is not regular.`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are NINE questions in this section. Answer any SEVEN questions.",
      questions: [
        {
          no: 5,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cfg",
              prompt: r`Give context-free grammars that generate the following languages: *(7+8)*

(i) The set of all strings of balanced parentheses over the alphabet $\{\,(\,,\,)\,\}$. For example, (()()), ((())), $\varepsilon$ are in the language whereas ((()), ())), )()( are not in the language.

(ii) The set of all strings with equal number of 0s and 1s.`,
              alsoAsked: ["2022–23 Q5 (similar)"],
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
              prompt: r`Define *ambiguous grammar* and *inherently ambiguous language*. Show that the following grammar is ambiguous: *(5+10)*
$$
\begin{aligned}
S &\to AB \mid C\\
A &\to aAb \mid ab\\
B &\to cB \mid c\\
C &\to aCc \mid aDc\\
D &\to bD \mid b
\end{aligned}
$$`,
              alsoAsked: ["2021–22 Q6"],
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
              prompt: r`The following are the productions of a grammar $G$ in Chomsky Normal Form ($S$ is the start symbol):
$$
\begin{aligned}
S &\to BZ \mid CY \mid ZZ \mid YY\\
B &\to ZA\\
C &\to YA\\
A &\to ZA \mid YA \mid 0 \mid 1\\
Z &\to 0\\
Y &\to 1
\end{aligned}
$$
Determine whether 01100 is in $L(G)$ using the CYK algorithm (you need to show the table). Describe the language generated by the above grammar informally. *(10+5)*`,
              alsoAsked: ["2023–24 Q6 (same grammar)"],
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
              prompt: r`Let $\Sigma = \{a, +, *, (, )\}$ and consider the language $\text{ARITH} = \{w \in \Sigma^* \mid w \text{ is a legal arithmetic expression}\}$. Design a pushdown automaton (PDA) that recognizes the language ARITH. Show its transition diagram.

For example: $a+a*a$ and $((a+a)*(a+a))+(a)$ are legal expressions, whereas $aa*a$ (two consecutive variables without an operator), $a{+}{+}a$ (two consecutive operators), $+a$ (starts with an operator) and $(a+a))$ (imbalanced parentheses) are not.`,
              alsoAsked: ["2021–22 Q7"],
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
              prompt: r`Design a Turing machine (TM) that takes as input two numbers of equal lengths in binary $w_1$ and $w_2$, and computes the logical AND of the two numbers. The tape initially contains $w_1cw_2c$ where '$c$' is a tape symbol that is used as the separator. Your TM should terminate with the AND of the two numbers in binary after the second $c$. (You can use multiple tracks and storage in states if you wish.)`,
            },
          ],
        },
        {
          no: 10,
          parts: [
            {
              part: "a",
              marks: 8,
              topic: "pda-hmu",
              prompt: r`Show that the set of languages that are accepted by final state by some pushdown automaton (PDA) is same as the set of languages that are accepted by empty stack by some PDA.`,
            },
            {
              part: "b",
              marks: 7,
              topic: "tm-variants",
              prompt: r`Explain how a one-tape Turing machine with multiple tracks and storage in the state can simulate a multi-tape Turing machine.`,
              alsoAsked: ["2023–24 Q10"],
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
              prompt: r`Give one example from each of the following sets of languages:

(a) Regular languages

(b) Languages that are context-free but not regular

(c) Languages that are recursive but not context-free

(d) Languages that are recursively enumerable but not recursive

(e) Languages that are not recursively enumerable`,
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "undecidability",
              prompt: r`What is the *halting problem*? Prove that the halting problem is recursively enumerable (RE) but not recursive. *(4+11)*`,
              alsoAsked: ["2023–24 Q11", "2021–22 Q11"],
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
              prompt: r`Briefly explain whether the following are true or false:

(a) If the *satisfiability* problem (SAT) can be solved in polynomial time, then P = NP.

(b) The set of languages decided by polynomial time non-deterministic Turing machines is a superset of the set of languages decided by polynomial space deterministic Turing machines.

(c) The set of languages decided by polynomial space deterministic Turing machines is same as the set of languages decided by polynomial space non-deterministic Turing machines.`,
            },
          ],
        },
      ],
    },
  ],
}

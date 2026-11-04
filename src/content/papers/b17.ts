import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB17: Paper = {
  slug: "b17",
  batch: "17 batch",
  course: "CSE 211",
  session: "January 2020 Term",
  year: 2021,
  exam: "L-2/T-2 B. Sc. Engineering Examinations (January 2020 Term)",
  date: "16/01/2021",
  fullMarks: 180,
  time: "2 hours (Sections A + B)",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer any THREE. (Section marks: 90)",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "a",
              marks: 6,
              topic: "complexity",
              prompt: r`Given an instance of the Dominating Set problem, describe how the certificate can determine whether the Dominating Set problem is in NP.`,
            },
            {
              part: "b",
              marks: 12,
              topic: "pumping-regular",
              prompt: r`After learning the pumping lemma (difficult to understand, easy to go astray when applying it), Surcharged Skye got very excited and came up with his very personal opinions regarding a number of languages as follows:

i. For $\Sigma = \{0, 1\}$, $L_1 = \{ww \mid w \in \{0,1\}^*\}$, we choose the string $0^p0^p$, take $x = \varepsilon$, $y = (00)^k$, $k \le \frac{p}{2}$. Now, since $\forall i \ge 0$, $xy^iz \in L_1$, $L_1$ is regular.

ii. For $\Sigma = \{0, 1\}$, $L_2 = \{w \in \Sigma^* \mid n_0(w) = 3n_1(w)\}$ ($n_a(w)$ denotes the number of $a$'s in $w$), we choose the string $0^{3p}1^p$, take $y = 0001$. Since $\forall i \ge 0$, $xy^iz \in L_2$, we have failed to demonstrate that $L_2$ contradicts pumping lemma.

Explain clearly whether you find anything wrong in each of the opinions expressed by Skye.`,
            },
            {
              part: "c",
              marks: 12,
              topic: "nfa",
              prompt: r`Consider the NFA given below:

| | $a$ | $b$ | $c$ | $\varepsilon$ |
|---|---|---|---|---|
| $\to p$ | $\{p\}$ | $\{q\}$ | $\{r\}$ | $\emptyset$ |
| $q$ | $\{q\}$ | $\{r\}$ | $\emptyset$ | $\{p\}$ |
| $*r$ | $\{r\}$ | $\emptyset$ | $\{p\}$ | $\{q\}$ |

Give, with necessary explanations, general forms of all the strings of length three or less accepted by the automaton.`,
            },
          ],
        },
        {
          no: 2,
          stem: r`${fig("b17-2a")}`,
          parts: [
            { part: "a", marks: 7, topic: "dfa", prompt: r`State informally, the language accepted by the DFA shown in the figure.` },
            { part: "b", marks: 13, topic: "nfa", prompt: r`For the DFA in Question 2(a), draw the equivalent NFA for the corresponding language.` },
            { part: "c", marks: 10, topic: "regex", prompt: r`For the DFA in Question 2(a), write down the regular expression for the strings that *do not* belong to the corresponding language.` },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "regex",
              prompt: r`Evaluate the following regular expressions. Show the detailed computations.

i. $\emptyset^*\emptyset^*\emptyset^*\emptyset^*$

ii. $\emptyset^* \cup \{\varepsilon\}$

iii. $(\emptyset^* \cup 1)\{0, 1\}$

iv. $(11)^*\emptyset(00)^*$

v. $(\emptyset^* \cup 0)\{0, 1, 11\}$`,
            },
            {
              part: "b",
              marks: 20,
              topic: "closure",
              prompt: r`We have got an NFA $N_1 = (Q_1, \Sigma, \delta_1, q_1, F_1)$ which recognizes the language $L_1$. We want to construct $N = (Q, \Sigma, \delta, q_0, F)$ to recognize $L_1^*$. In this process, we define $\delta$ for $N$ such that for any $q \in Q$ and any $a \in \Sigma_\varepsilon$,
$$
\delta(q,a)=\begin{cases}
\delta_1(q,a) & q\in Q_1 \text{ and } q\notin F_1\\
\delta_1(q,a) & q\in F_1 \text{ and } a\ne\varepsilon\\
\delta_1(q,a)\cup\{q_1\} & q\in F_1 \text{ and } a=\varepsilon\\
\{q_1\} & q=q_0 \text{ and } a=\varepsilon\\
\emptyset & q=q_0 \text{ and } a\ne\varepsilon
\end{cases}
$$
Explain clearly in plain English (stressing on the purpose) each of the conditions (at right) in the above transition function.`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 10, topic: "regex", prompt: r`Give a description in English of the language of the regular expression: $(1 + \varepsilon)(00^*1)^*0^*$.` },
            {
              part: "b",
              marks: 20,
              topic: "nfa",
              prompt: r`Convert the NFA shown in the figure to an equivalent DFA. Show the computations.

${fig("b17-4b")}`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are EIGHT questions in this section. Answer any SIX. (Section marks: 90)",
      questions: [
        {
          no: 5,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cfg",
              prompt: r`Give context-free grammars that generate the following languages for an alphabet, $\Sigma = \{0, 1\}$: *(7+8)*

a) $\{w \mid w \text{ contains at least one 0 and at least one 1}\}$,

b) The set of all strings with equal number of 0s and 1s.`,
              alsoAsked: ["2019–20 Q5(ii)"],
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
              prompt: r`Design a context-free grammar for an alphabet, $\Sigma = \{a, b, c, d\}$ that generates the language,
$$
L = \{a^nb^nc^md^m \mid n \ge 1, m \ge 1\} \cup \{a^nb^mc^md^n \mid n \ge 1, m \ge 1\}.
$$
Show that the grammar you designed is ambiguous by giving two different parse trees for some string in the language. *(10+5)*`,
              alsoAsked: ["2022–23 Q6"],
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
Determine whether 10011 is in $L(G)$ using the CYK algorithm (you need to show the table).`,
              alsoAsked: ["2019–20 Q7", "2023–24 Q6"],
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
              prompt: r`Design a pushdown automaton (PDA) that recognizes the language $\{a^ib^jc^k \mid i, j, k \ge 0 \text{ and } (i = j \text{ or } i = k)\}$. Show its transition diagram. Recall that, PDAs are non-deterministic.`,
              alsoAsked: ["2022–23 Q8"],
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
              prompt: r`Design a Turing machine (TM) that takes as input two numbers, $w_1$ and $w_2$, in binary of equal lengths and computes the logical XOR of the two numbers. The tape initially contains $w_1cw_2c$ where '$c$' is a tape symbol that is used as the separator. Your TM should terminate with the XOR of the two numbers in binary after the second $c$. (You can use multiple tracks and storage in the state if you wish).`,
              alsoAsked: ["2019–20 Q9 (AND)"],
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
              prompt: r`Briefly explain whether the following statements are true or false: *(7+8)*

i) A one-tape Turing machine with multiple tracks and storage in the state can simulate a multi-tape Turing machine.

ii) A deterministic Turing machine can simulate $n$ steps of a conventional computer in $p(n)$ steps, where $p(n)$ is some polynomial in $n$.`,
              alsoAsked: ["2021–22 Q10", "2022–23 Q11"],
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
              prompt: r`a) Define recursively enumerable (RE) languages and recursive languages.

b) Give one example of the following (with definitions):

i) A language that is not recursively enumerable (not RE),

ii) A language that is RE but not recursive. *(7+8)*`,
              alsoAsked: ["2019–20 Q11"],
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "complexity",
              prompt: r`State Cook's theorem. Explain why finding a polynomial time algorithm for an NP-complete problem implies P = NP.`,
              alsoAsked: ["2021–22 Q12(ii)"],
            },
            {
              part: "b",
              marks: 8,
              topic: "complexity",
              prompt: r`Draw the Venn diagram showing the widely believed relationships (whether they are equal or which one is a subset of the other) among the classes of problems P, NP, PSPACE, NPSPACE and EXPTIME. Briefly justify your answer.`,
            },
          ],
        },
      ],
    },
  ],
}

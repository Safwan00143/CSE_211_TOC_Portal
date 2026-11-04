import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB12: Paper = {
  slug: "b12",
  batch: "12 batch",
  course: "CSE 211",
  session: "2013-2014",
  year: 2015,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2013-2014",
  date: "06/08/2015",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this Section. Answer any THREE.",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "pda-hmu",
              prompt: r`Convert the following context free grammar into an equivalent pushdown automaton:
$$
\begin{aligned}
E &\to E+T \mid T\\
T &\to T\times F \mid T/F \mid F\\
F &\to (E) \mid a
\end{aligned}
$$`,
            },
            {
              part: "b",
              marks: 7,
              topic: "pda",
              prompt: r`Construct the state diagram of a pushdown automaton that recognizes the following language $L = \{a^ib^jc^k : i = j \text{ or } j = k \text{ where } i, j, k \ge 0\}$.`,
              alsoAsked: ["2022–23 Q8 (i = j or i = k)"],
            },
            { part: "c", marks: 9.33, topic: "pda-hmu", prompt: r`Prove that for any pushdown automaton $P$, there exists a context free grammar $G$ such that $L(P) = L(G)$.`, alsoAsked: ["2014–15 Q7(a)"] },
          ],
        },
        {
          no: 2,
          parts: [
            { part: "a", marks: 7, topic: "tm-basics", prompt: r`Build a Turing machine to recognize the language $L = \{0^N1^N0^N \mid N \ge 0\}$.` },
            { part: "b", marks: 7, topic: "tm-basics", prompt: r`How can we recognize the left end of the tape of a Turing machine? Explain.` },
            {
              part: "c",
              marks: 9.33,
              topic: "pumping-cfl",
              prompt: r`Use the pumping lemma to show that the following languages are not context free:

(i) $L = \{0^n1^n0^n1^n \mid n \ge 0\}$.

(ii) $L = \{0^n\#0^{2n}\#0^{3n} \mid n \ge 0\}$.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "tm-basics",
              prompt: r`Answer the following questions, and explain your reasoning:

(i) Can a Turing machine ever write the blank symbol on its tape?

(ii) Can the tape alphabet $\Gamma$ be the same as the input alphabet $\Sigma$?

(iii) Can a Turing machine's head ever be in the same location in two successive steps?

(iv) Can a Turing machine contain just a single state?`,
            },
            {
              part: "b",
              marks: 7,
              topic: "undecidability",
              prompt: r`Let $A$ be the language containing only the single string $s$, where
$$
s=\begin{cases}0 & \text{if life never will be found on Mars}\\ 1 & \text{if life will be found on Mars someday.}\end{cases}
$$
Is $A$ decidable? Why or why not? For the purposes of this problem, assume that the question of whether life will be found on Mars has an unambiguous YES or NO answer.`,
            },
            { part: "c", marks: 9.33, topic: "tm-variants", prompt: r`Show that every nondeterministic Turing machine has an equivalent deterministic Turing machine.`, alsoAsked: ["2014–15 Q7(c)"] },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 7, topic: "undecidability", prompt: r`Consider the language $A_{DFA} = \{\langle B, w\rangle \mid B \text{ is a DFA accepting } w\}$. Prove that $A_{DFA}$ is decidable.` },
            { part: "b", marks: 7, topic: "undecidability", prompt: r`Prove that the set of rational numbers is countable.` },
            { part: "c", marks: 9.33, topic: "undecidability", prompt: r`Prove that $A_{TM} = \{\langle M, w\rangle \mid M \text{ is a Turing machine accepting } w\}$ is not decidable.`, alsoAsked: ["2016–17 Q8(a)", "2014–15 Q8(c)"] },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are FOUR questions in this Section. Answer any THREE.",
      questions: [
        {
          no: 5,
          parts: [
            { part: "a", marks: 8, topic: "closure", prompt: r`Prove that regular languages are closed under minus ($-$) operation where minus ($-$) operation is defined as $L_1 - L_2 = \{w \mid w \in L_1 \text{ but } w \notin L_2\}$.` },
            { part: "b", marks: 5, topic: "regex", prompt: r`Show a counter-example to disprove the following statement: If $R_1$ and $R_2$ are two regular expressions, then $(R_1 \cup R_2)^* = R_1^* \cup R_2^*$.` },
            { part: "c", marks: 10.33, topic: "dfa", prompt: r`Construct a DFA to recognize the following language $L$: $L = \{w \in \{a,b\}^* \mid w = a^pb^q,\ p + q \text{ is even}\}$.` },
          ],
        },
        {
          no: 6,
          parts: [
            { part: "a", marks: 7.33, topic: "pumping-regular", prompt: r`State and prove the Pumping lemma for regular languages.`, alsoAsked: ["2014–15 Q4(b)"] },
            {
              part: "b",
              marks: 8,
              topic: "pumping-regular",
              prompt: r`Let $\Sigma = \{(, )\}$ and let $L$ be the language consisting of all strings of properly nested parenthesis. For example $L$ contains "( ) ( )", "((( )))", "(( )( ) ((( )( )))", and $\varepsilon$, but not ")(" and "((((". Using Pumping lemma show that $L$ is not regular.`,
            },
            {
              part: "c",
              marks: 8,
              topic: "regex",
              prompt: r`Construct a regular expression from the following NFA:

${fig("b12-6c")}`,
            },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "a",
              marks: 9,
              topic: "nfa",
              prompt: r`Eliminate all empty ($\varepsilon$) transitions from the following NFA: start $q_0$, accepting $q_2$; $q_0\xrightarrow{a}q_1$, $q_0\xrightarrow{\varepsilon}q_4$, $q_4\xrightarrow{b}q_1$, $q_4\xrightarrow{a}q_3$, $q_3\xrightarrow{b}q_1$, $q_3\xrightarrow{\varepsilon}q_2$, $q_1\xrightarrow{\varepsilon}q_2$, $q_2\xrightarrow{a}q_1$ (drawn on the left of the solution's figure).`,
            },
            {
              part: "b",
              marks: 8.33,
              topic: "cfg",
              prompt: r`Construct a context free grammar to recognize the following language $L$: $L = \{w \in \{a,b,c\}^* \mid w = a^ib^jc^k, i \ge 0, j \ge 0, k \ge 0\}$. Draw a parse tree for the string $ab^2c^3$ according to your grammar.`,
            },
            { part: "c", marks: 6, topic: "pumping-cfl", prompt: r`Show that the following language $L$ is not context free: $L = \{w \in \{a,b,c\}^* \mid w = a^nb^{2n}c^{3n}, n \ge 0\}$.` },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "closure",
              prompt: r`Suppose $L_1$ and $L_2$ are two regular languages. Let $M_1 = \langle\Sigma, Q_1, q_0^1, \delta_1, F_1\rangle$ and $M_2 = \langle\Sigma, Q_2, q_0^2, \delta_2, F_2\rangle$ be DFAs that recognize $L_1$ and $L_2$ respectively. Describe the steps to construct a DFA that recognizes the language $L_1 \cup L_2$.`,
            },
            { part: "b", marks: 10.33, topic: "nfa", prompt: r`Prove that every NFA has an equivalent DFA.` },
            { part: "c", marks: 6, topic: "closure", prompt: r`Show a counter-example to disprove the following statement: Every subset of a regular language is also regular.` },
          ],
        },
      ],
    },
  ],
}

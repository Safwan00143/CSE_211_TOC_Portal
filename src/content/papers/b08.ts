import type { Paper } from "../types"

const r = String.raw
const one = (no: number, marks: number, topic: Paper["sections"][number]["questions"][number]["parts"][number]["topic"], prompt: string, extra: object = {}) => ({ no, parts: [{ part: "", marks, topic, prompt, ...extra }] })

export const paperB08: Paper = {
  slug: "b08",
  batch: "08 batch",
  course: "CSE 211",
  session: "2009-2010",
  year: 2011,
  exam: "L-2/T-2 B. Sc. Examinations 2009-2010",
  date: "14/07/2011",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are NINE questions in this Section, answer any SEVEN questions.",
      questions: [
        one(1, 10, "nfa", r`"Nondeterminism is an inessential feature of finite automata" - explain.`),
        one(
          2,
          10,
          "dfa",
          r`Design a deterministic finite automaton which accepts the language which consists of strings from $\{a, b\}^*$ and does not contain the character anywhere in the string consecutively three times which started the string. So, abaab, baaabba are accepted, but abaaab, bbbaa are rejected. Depict the automaton using transition diagram.`,
        ),
        one(
          3,
          10,
          "nfa",
          r`Convert the NFA shown in the figure into an equivalent DFA using lazy evaluation. The NFA has start $q_1$, accepting $q_5$, and moves $q_1\xrightarrow{\varepsilon}q_2$, $q_2\xrightarrow{a}q_3$, $q_3\xrightarrow{a}q_2$, $q_3\xrightarrow{b}q_3$, $q_3\xrightarrow{\varepsilon}q_5$, $q_2\xrightarrow{b}q_4$, $q_4\xrightarrow{b}q_2$, $q_4\xrightarrow{a}q_3$, $q_4\xrightarrow{\varepsilon}q_5$ (drawn on the left of the solution's figure).`,
        ),
        one(
          4,
          10,
          "regex",
          r`We have two languages, $L_1 = 1(1\cup0)^*000$, and $L_2 = (1(01)^*0)^*$. Find out whether each of the followings belongs to $L_1 \circ L_2$ with necessary reasoning. (a) 1000. (b) 1000101010. (c) 10000111000100000.`,
        ),
        one(5, 10, "pumping-regular", r`Using pumping lemma show whether the language consisting of all strings of 1's whose length is a prime is a regular language or not.`, { alsoAsked: ["2016–17 Q4(c)"] }),
        one(
          6,
          10,
          "cfg",
          r`Consider the grammar given below.
$$
\begin{aligned}
\langle pop\rangle &\to [\langle bop\rangle, \langle pop\rangle] \mid \langle bop\rangle\\
\langle bop\rangle &\to \langle boop\rangle \mid (\langle pop\rangle)\\
\langle boop\rangle &\to x \mid y \mid z
\end{aligned}
$$
(a) What are the nonterminal and terminal symbols? (b) What is the start symbol? Why? (c) Draw a parse tree for the sentence ….`,
          { note: "The sentence in (c) cannot be read on the scan. The solution draws a parse tree for the sample sentence [x,[y,z]] instead." },
        ),
        one(7, 10, "cfg", r`Describe the grammar which represents the set of palindromes over $\{0, 1\}$. How do you modify the grammar when the alphabet changes to $\{0, 1, a\}$ and the length is restricted to even length only?`),
        one(8, 10, "cfg", r`Describe with necessary examples the differences and similarities between recursive inference and derivation with respect to context free grammars.`),
        one(9, 10, "cfg", r`Consider the language $L = \{w \in \{a, b\}^* : w \text{ contains equal numbers of } a\text{'s and } b\text{'s}\}$. Write a context-free grammar $G$ for $L$. Show a leftmost derivation for the string aabbab using $G$.`),
      ],
    },
    {
      name: "Section B",
      instructions: "There are FOUR questions in this Section. Answer any THREE questions.",
      questions: [
        {
          no: 10,
          parts: [
            {
              part: "a",
              marks: 14,
              topic: "pda",
              prompt: r`Formally define Pushdown Automata (PDA). Design PDA to accept each of the following languages. *(2+4+4+4)* i) $\{0^n1^n \mid n \ge 1\}$ ii) The set of all strings of 0's and 1's with an equal number of 0's and 1's iii) The set of all palindromes of 0's and 1's`,
            },
            {
              part: "b",
              marks: 9.33,
              topic: "pda-hmu",
              prompt: r`Suppose the PDA $P = (\{p, q\}, \{0, 1\}, \{Z, X\}, \delta, q, Z, \{p\})$ has the following transition functions: $\delta(q, 0, Z) = \{(q, XZ)\}$, $\delta(q, 0, X) = \{(q, XX)\}$, $\delta(q, 1, X) = \{(q, X)\}$, $\delta(q, \varepsilon, X) = \{(p, \varepsilon)\}$, $\delta(p, \varepsilon, X) = \{(p, \varepsilon)\}$, $\delta(p, 1, X) = \{(p, XX)\}$, $\delta(p, 1, Z) = \{(p, \varepsilon)\}$.

i) Represent the PDA $P$ by a transition diagram. ii) Convert $P$ to another PDA $P_1$ that accepts by empty stack the same language that $P$ accepts by final state. *(3+6⅓)*`,
              alsoAsked: ["2015–16 Q5 (same PDA)"],
            },
          ],
        },
        {
          no: 11,
          parts: [
            {
              part: "a",
              marks: 5,
              topic: "pda-hmu",
              prompt: r`Convert the following grammar to a PDA that accepts the same language by empty stack.
$$
\begin{aligned}
S &\to AS \mid A\\
A &\to 0A \mid 1B \mid 1\\
B &\to 0B \mid 0
\end{aligned}
$$`,
            },
            {
              part: "b",
              marks: 13,
              topic: "pda-hmu",
              prompt: r`Suppose the PDA $P = (\{p, q\}, \{0, 1\}, \{Z, X\}, \delta, q, Z)$ has the following transition functions: $\delta(q, 1, Z) = \{(q, XZ)\}$, $\delta(q, 0, X) = \{(p, X)\}$, $\delta(p, 1, X) = \{(p, \varepsilon)\}$. Convert the PDA $P$ to a context free grammar.`,
            },
            { part: "c", marks: 5.33, topic: "pda-hmu", prompt: r`Briefly describe Deterministic Pushdown Automata (DPDA) with an appropriate example.` },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "a",
              marks: 5,
              topic: "tm-basics",
              prompt: r`Give formal definition of a Turing Machine. Write out in full a Turing Machine that scans to the right until it finds two consecutive a's and then halts. The alphabet of the Turing machine should be $\{a, b, \sqcup, \triangleright\}$. *(2+3)*`,
            },
            { part: "b", marks: 7, topic: "tm-basics", prompt: r`Design a Turing Machine that decides the language $L = \{a^nc^nb^nd^n : n \ge 0\}$.` },
            {
              part: "c",
              marks: 11.33,
              topic: "tm-variants",
              prompt: r`Give a three tape Turing machine which, when starts with two binary integers separated by a ';' on its first tape, computes their subtraction. Consider that of the two integers the first integer is greater or equal than the second integer.`,
            },
          ],
        },
        {
          no: 13,
          parts: [
            { part: "a", marks: 4, topic: "tm-basics", prompt: r`"The operation of a Turing machine may never stop" - do you agree? Justify your answer with appropriate example.` },
            { part: "b", marks: 4, topic: "undecidability", prompt: r`Prove that if $L$ is recursive language, then its complement $\overline{L}$ is also recursive.` },
            { part: "c", marks: 11, topic: "undecidability", prompt: r`Briefly describe Universal Turing Machine with an appropriate example.` },
            { part: "d", marks: 4.33, topic: "undecidability", prompt: r`Explain the "Halting Problem" with an appropriate example.` },
          ],
        },
      ],
    },
  ],
}

import type { Paper } from "../types"

const r = String.raw

export const paperB13: Paper = {
  slug: "b13",
  batch: "13 batch",
  course: "CSE 211",
  session: "2014-2015",
  year: 2016,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2014-2015",
  date: "20/07/2016",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer any THREE.",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "dfa",
              prompt: r`Design a DFA $M$ with alphabet $\Sigma = \{0, 1, 2, 3, R\}$, which recognizes the language $A$. The language $A$ is the set of all strings where the sum of the numbers is a multiple of 3, except that the sum is reset to 0 whenever the symbol $R$ appears. Only a diagrammatic description of $M$ should suffice.`,
              alsoAsked: ["2022–23 Q1(b)", "2019–20 Q1(c)"],
            },
            {
              part: "b",
              marks: 13.33,
              topic: "dfa",
              prompt: r`For the DFA in Question 1(a) we change the alphabet to $\Sigma = \{0, 1, 2, R\}$, and you decide to use the states to remember actual sums of the numbers. Show diagrammatically how this DFA can be constructed. What is the problem with this DFA? Explain clearly.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            { part: "a", marks: 10, topic: "pumping-regular", prompt: r`Use pumping lemma for regular languages to find out, whether the unary language, $\{1^{n^2} \mid n \ge 0\}$, is a regular language or not.` },
            { part: "b", marks: 13.33, topic: "dfa", prompt: r`Design a DFA which accepts all and only the binary number strings divisible by 4. Explain how the DFA works.` },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 13.33,
              topic: "nfa",
              prompt: r`Design an NFA over the alphabet $\Sigma = \{a, b\}$ which accepts all and only the strings of nonzero length having nonzero even number of $a$'s at the end. Thus, this NFA will accept, aa, aaaa, abbaa, abaababaaaa, but will reject, aaa, ab, b, abbaaa and abaabbbb.`,
            },
            {
              part: "b",
              marks: 10,
              topic: "regex",
              prompt: r`Provide regular expressions generating the following languages. *(4+3+3)*

(i) $\Sigma = \{0, 1, 2, 3, 4, 5, 6, 7, 8, 9\}$. The members of this language are numbers divisible by 5. A number cannot start with a 0 except for standalone 0s.

(ii) Binary strings consisting of either an odd number of 0s (and any number of 1s) or an odd number of 1s (and any number of 0s).

(iii) Binary strings that do not contain the sequence 101 embedded anywhere.`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 11.33,
              topic: "nfa",
              prompt: r`Construct an NFA over the alphabet $\Sigma = \{0, 1\}$ that accepts the set of strings that contain an even number of occurrences of substring 01. Then convert this NFA to an equivalent DFA. Give only the portion of the DFA that is reachable from the start state. *(7⅓+4)*`,
            },
            { part: "b", marks: 12, topic: "pumping-regular", prompt: r`State and prove pumping lemma for regular language. First, explain your ideas about the proof and then carry out the actual proof.` },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are FOUR questions in this section. Answer any THREE.",
      questions: [
        {
          no: 5,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "cfg",
              prompt: r`Consider the following context free grammar:
$$
\begin{aligned}
S &\to abScB \mid \varepsilon\\
B &\to bB \mid b
\end{aligned}
$$
What language does it generate?`,
            },
            {
              part: "b",
              marks: 7,
              topic: "cfg",
              prompt: r`Construct context free grammars to accept the following languages over $\Sigma = \{0, 1\}$:

(i) $\{w \mid w \text{ starts and ends with the same symbol}\}$.

(ii) $\{w \mid |w| \text{ is odd and its middle symbol is } 0\}$.`,
              alsoAsked: ["2016–17 Q5(a)(iii)"],
            },
            {
              part: "c",
              marks: 9.33,
              topic: "cnf-cyk",
              prompt: r`What is Chomsky normal form? Convert the following context free grammar into an equivalent grammar in Chomsky normal form:
$$
\begin{aligned}
A &\to BAB \mid B \mid \varepsilon\\
B &\to 00 \mid \varepsilon
\end{aligned}
$$`,
              alsoAsked: ["2016–17 Q6(b)"],
            },
          ],
        },
        {
          no: 6,
          parts: [
            {
              part: "a",
              marks: 7,
              topic: "cfg",
              prompt: r`Explain why the context free grammar below is ambiguous:
$$
\begin{aligned}
S &\to 0A \mid 1B\\
A &\to 0AA \mid 1S \mid 1\\
B &\to 1BB \mid 0S \mid 0
\end{aligned}
$$`,
            },
            { part: "b", marks: 7, topic: "pumping-cfl", prompt: r`Show that the following language over $\Sigma = \{a, b, c\}$ is not context free: $L = \{a^nb^jc^k : k = jn\}$.` },
            {
              part: "c",
              marks: 9.33,
              topic: "pda",
              prompt: r`Construct the state diagram of a pushdown automaton that recognizes the following language $L = \{wcw^R \mid w \in \{a,b\}^* \text{ and } w^R \text{ is the reverse of } w\}$. Trace the computation that accepts "bbcbb" by configuration.`,
            },
          ],
        },
        {
          no: 7,
          parts: [
            { part: "a", marks: 7, topic: "pda-hmu", prompt: r`Prove that for any pushdown automaton $P$, there exists a context free grammar $G$ such that $L(P) = L(G)$.` },
            { part: "b", marks: 7, topic: "undecidability", prompt: r`Prove that the set of infinite binary sequences is not countable.` },
            { part: "c", marks: 9.33, topic: "tm-variants", prompt: r`Prove that a non-deterministic Turing machine is equivalent to a deterministic Turing machine.` },
          ],
        },
        {
          no: 8,
          parts: [
            { part: "a", marks: 7, topic: "undecidability", prompt: r`What do you mean by decidable, Turing recognizable, and undecidable languages?` },
            { part: "b", marks: 7, topic: "tm-basics", prompt: r`Let $L = \{w - w \mid w \in \{a, b\}^*\}$ be a language. Draw a state diagram of a Turing machine that decides $L$.` },
            { part: "c", marks: 9.33, topic: "undecidability", prompt: r`Prove that the language $A_{TM} = \{\langle M, w\rangle \mid M \text{ is a Turing machine accepting } w\}$ is undecidable.`, alsoAsked: ["2016–17 Q8(a)"] },
          ],
        },
      ],
    },
  ],
}

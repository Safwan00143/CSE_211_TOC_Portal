import type { Paper, PaperQuestion } from "../types"

const r = String.raw
const one = (no: number, marks: number, topic: PaperQuestion["parts"][number]["topic"], prompt: string, extra: object = {}): PaperQuestion => ({ no, parts: [{ part: "", marks, topic, prompt, ...extra }] })

export const paperB05: Paper = {
  slug: "b05",
  batch: "05 batch",
  course: "CSE 211",
  session: "2006-2007",
  year: 2008,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2006-2007",
  date: "03/06/2008",
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
              marks: 10,
              topic: "dfa",
              prompt: r`Design a DFA accepting the set of all strings which start with 0 and has odd length, or start with 1 and has even length. Depict the designed automaton using transition diagram as well as transition table.`,
            },
            { part: "b", marks: 8, topic: "regex", prompt: r`Develop a regular expression for the set of strings that consist of alternating 0's and 1's.`, alsoAsked: ["2016–17 Q3(b)(i)"] },
            { part: "c", marks: 5.33, topic: "intro", prompt: r`"$\emptyset$, $\varepsilon$ are languages over any alphabet" – explain. Can these two be called equivalent? Why?` },
          ],
        },
        {
          no: 2,
          parts: [
            { part: "a", marks: 10, topic: "nfa", prompt: r`Prove the theorem, "If $D = (Q_D, \Sigma, \delta_D, \{q_0\}, F_D)$ is the DFA constructed from NFA $N = (Q_N, \Sigma, \delta_N, q_0, F_N)$ by the subset construction, then $L(D) = L(N)$".`, alsoAsked: ["2007–08 Q2(a)"] },
            { part: "b", marks: 8, topic: "dfa", prompt: r`Design a DFA to accept the language $L = \{w \mid w \text{ has an even number of 0's and an odd number of 1's}\}$. Verify that your DFA works by finding out $\hat\delta(q_0, 11010)$, where $q_0$ is the start state.` },
            { part: "c", marks: 5.33, topic: "nfa", prompt: r`"One way to think of a nondeterministic computation is as a tree of possibilities" – elaborate this statement with necessary example.` },
          ],
        },
        {
          no: 3,
          parts: [
            { part: "a", marks: 10, topic: "pumping-regular", prompt: r`Using pumping lemma show that the language consisting of all strings with an equal number of 0's and 1's (not in any particular order) is not a regular language.` },
            { part: "b", marks: 8, topic: "nfa", prompt: r`Describe the steps in detail in finding the equivalent DFA of an $\varepsilon$-NFA using lazy evaluation.` },
            { part: "c", marks: 5.33, topic: "undecidability", prompt: r`What is meant by enumeration of binary strings? Find out the 13th binary string.` },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 10, topic: "undecidability", prompt: r`Prove that the diagonalization language is not a recursively enumerable language.`, alsoAsked: ["2022–23 Q12"] },
            {
              part: "b",
              marks: 8,
              topic: "regex",
              prompt: r`Describe the languages which each of the following regular expression represents. You may assume that the alphabet $\Sigma$ is $\{0, 1\}$.

i. $0^*10^*$, ii. $\Sigma^*1\Sigma^*$, iii. $1^*(01^+)^*$, iv. $(\Sigma\Sigma\Sigma)^*$, v. $0\Sigma^*0 \cup 1\Sigma^*1 \cup 0 \cup 1$, vi. $01 \cup 10$, vii. $(0 \cup \varepsilon)1^*$, viii. $(01 \cup 010)^*$.`,
              note: "In (ii) the middle symbol is printed as a 'j'; it is read here as 1.",
            },
            {
              part: "c",
              marks: 5.33,
              topic: "undecidability",
              prompt: r`Encode the Turing machine, $M = (\{q_1, q_2, q_3\}, \{0, 1\}, \{0, 1, B\}, \delta, q_1, B, \{q_2\})$, where $\delta$ is given by $\{\delta(q_1, 1) = (q_3, 0, R), \delta(q_3, 0) = (q_1, 1, R), \delta(q_3, 1) = (q_2, 0, R), \delta(q_3, B) = (q_3, 1, L)\}$.`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are NINE questions in this Section. Answer any SEVEN.",
      questions: [
        one(5, 10, "cfg", r`Define context-free grammar. Design context-free grammar for the language $\{a^mb^n \mid m > n, n \ge 1\}$.`),
        one(
          6,
          10,
          "cfg",
          r`Define parse tree for a grammar. What is yield of a parse tree? Consider the grammar with start symbol $D$ given by the following productions:
$$
\begin{aligned}
D &\to TL;\\
T &\to \text{bin\_}\\
L &\to L, V \mid V\\
V &\to I \mid I = N\\
I &\to a \mid b \mid Ia \mid Ib \mid I0 \mid I1\\
N &\to 1 \mid N1 \mid N0
\end{aligned}
$$
Derive: (i) bin_ab00 = 101, b1, b1; using leftmost derivation (ii) bin_a = 10, b = 1; using rightmost derivation.`,
        ),
        one(
          7,
          10,
          "cfg",
          r`Show that the following grammar is ambiguous.
$$
\begin{aligned}
E &\to E + E \mid E * E \mid (E) \mid I\\
I &\to a \mid b \mid Ia \mid Ib \mid I0 \mid I1
\end{aligned}
$$
Remove ambiguity from the above grammar.`,
          { alsoAsked: ["2017–18 Q6"] },
        ),
        one(8, 10, "pda-hmu", r`Define pushdown automata (PDA) with an example. What is instantaneous description (ID) of a PDA?`),
        one(9, 10, "pda", r`Draw the transition diagram of a pushdown automaton to accept palindromes of all length over the alphabet $\{0, 1\}$.`, { alsoAsked: ["2010–11 Q13(a)"] }),
        one(10, 10, "tm-basics", r`Design a Turing machine to decide the language $\{0^n1^n \mid n \ge 1\}$. Draw transition diagram of this Turing machine.`, { alsoAsked: ["2007–08 Q7"] }),
        one(
          11,
          10,
          "tm-techniques",
          r`Construct a Turing machine of any kind to compute exclusive OR (XOR) of two binary numbers of equal length. When the machine is started, its tape contains two binary numbers separated by a ',' (comma). The machine computes exclusive OR of two numbers and replaces the second number by it.`,
          { alsoAsked: ["2008–09 Q3(b)", "January 2020 Q9"] },
        ),
        one(
          12,
          10,
          "undecidability",
          r`What is meant by the language of a Turing machine? Define recursive language. Consider the Turing machine $M = (\{q_0, q_1, q_f\}, \{0, 1\}, \{0, 1, B\}, \delta, q_0, B, \{q_f\})$. Describe the language $L(M)$ if $\delta$ consists of the following set of rules: $\delta(q_0, 0) = (q_1, 1, R)$; $\delta(q_0, B) = (q_f, B, R)$; $\delta(q_1, 1) = (q_0, 0, R)$; $\delta(q_1, B) = (q_f, B, R)$.`,
          { alsoAsked: ["2007–08 Q11"] },
        ),
        one(13, 10, "tm-variants", r`What are multitape Turing machines and nondeterministic Turing machines (NTM)? Do they accept any language not accepted by basic Turing machines?`),
      ],
    },
  ],
}

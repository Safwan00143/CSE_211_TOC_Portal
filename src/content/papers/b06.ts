import type { Paper, PaperQuestion } from "../types"

const r = String.raw
const one = (no: number, marks: number, topic: PaperQuestion["parts"][number]["topic"], prompt: string, extra: object = {}): PaperQuestion => ({ no, parts: [{ part: "", marks, topic, prompt, ...extra }] })

export const paperB06: Paper = {
  slug: "b06",
  batch: "06 batch",
  course: "CSE 211",
  session: "2007-2008",
  year: 2009,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2007-2008",
  date: "31/08/2009",
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
            { part: "a", marks: 10, topic: "cfg", prompt: r`Explain the properties of parse trees with necessary examples.` },
            {
              part: "b",
              marks: 8,
              topic: "dfa",
              prompt: r`Design a deterministic finite automaton which accepts the language which consist of strings from $\{a, b\}^*$ and each a is followed by at least one b. You need to mention the design steps. The designed automaton is to be depicted using transition diagram as well as transition table.`,
            },
            { part: "c", marks: 5.33, topic: "intro", prompt: r`Explain how set-formers can be used to define a language.` },
          ],
        },
        {
          no: 2,
          parts: [
            { part: "a", marks: 10, topic: "nfa", prompt: r`Prove that if $D = (Q_D, \Sigma, \delta_D, \{q_0\}, F_D)$ is the DFA constructed from NFA, $N = (Q_N, \Sigma, \delta_N, q_0, F_N)$ by subset construction, then $L(D) = L(N)$.`, alsoAsked: ["2006–07 Q2(a)"] },
            { part: "b", marks: 8, topic: "regex", prompt: r`If $\Sigma = \{0, 1\}$, which language is represented by $(0 \cup 1)^*$? Which language is represented by $(0\Sigma^*) \cup (\Sigma^*1)$?` },
            { part: "c", marks: 5.33, topic: "dfa", prompt: r`Describe the most important role played by states in automaton. Is it possible to make this role with infinite capacity? Why?`, alsoAsked: ["2019–20 Q2(a)"] },
          ],
        },
        {
          no: 3,
          parts: [
            { part: "a", marks: 10, topic: "pumping-regular", prompt: r`Use pumping lemma to prove whether the language, consisting of all strings of 1's whose lengths are prime is a regular language or not.`, alsoAsked: ["2016–17 Q4(c)"] },
            { part: "b", marks: 8, topic: "cfg", prompt: r`What is meant by ambiguity in grammars? How do we remove ambiguity from grammars? What is inherent ambiguity?` },
            { part: "c", marks: 5.33, topic: "nfa", prompt: r`"Nondeterminism is an inessential feature of finite automata" – explain.`, alsoAsked: ["2009–10 Q1"] },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 10, topic: "cfg", prompt: r`Describe the grammar which represents the set of palindromes over $\{0, 1\}$. Then use induction techniques to prove validity of this grammar.` },
            { part: "b", marks: 8, topic: "cfg", prompt: r`Describe with necessary examples the differences and similarities between recursive inference and derivation with respect to context free grammars.`, alsoAsked: ["2009–10 Q8"] },
            { part: "c", marks: 5.33, topic: "regex", prompt: r`"Regular expressions can define exactly the same languages that the various forms of automata describe" – then why do we need regular expressions?` },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are NINE questions in this Section. Answer any SEVEN.",
      questions: [
        one(5, 10, "pda", r`Draw the transition diagram of a pushdown automaton to accept the language $L = \{a^ic^k(bc)^i \mid i, k \ge 0\}$.`),
        one(6, 10, "pda-hmu", r`"A language $L$ has a pushdown automaton (PDA) that accepts it by final state if and only if $L$ has a PDA that accepts it by empty stack" – justify the statement.`, { alsoAsked: ["2019–20 Q10(a)"] }),
        one(7, 10, "tm-basics", r`Design a Turing machine (TM) to decide the language $\{0^n1^n \mid n \ge 1\}$ and depict it using a transition table. Show the instantaneous descriptions (ID's) of the TM if the input tape contains 0011. *(7+3)*`),
        one(8, 10, "tm-techniques", r`Construct a Turing machine (TM) of any kind to add two binary numbers of equal lengths. When the machine is started, its tape contains two numbers separated by a ',' (comma). The machine adds the two numbers and ends with only the sum on the tape.`),
        one(9, 10, "tm-variants", r`Write short notes on the following: (i) Multitape Turing machine (ii) Multistack machine`),
        one(10, 10, "tm-variants", r`Describe how a Turing machine can simulate a computer.`),
        one(
          11,
          10,
          "undecidability",
          r`What are recursive, recursively enumerable (RE) and non-RE languages? Consider the Turing machine $M = (\{q_0, q_1, q_f\}, \{0, 1\}, \{0, 1, B\}, \delta, q_0, B, \{q_f\})$. Describe the language $L(M)$ if $\delta$ consists of the following set of rules: $\delta(q_0, 0) = (q_0, B, R)$; $\delta(q_0, 1) = (q_1, B, R)$; $\delta(q_1, 1) = (q_1, B, R)$; $\delta(q_1, B) = (q_f, B, R)$. *(6+4)*`,
        ),
        one(12, 10, "undecidability", r`Define the diagonalization language. Prove that the diagonalization language is not a recursively enumerable language.`, { alsoAsked: ["2022–23 Q12"] }),
        one(
          13,
          10,
          "cnf-cyk",
          r`What is Chomsky Normal Form (CNF) of a grammar? The following are the productions of a CNF grammar $G$:
$$
\begin{aligned}
S &\to AB \mid BC\\
A &\to BA \mid a\\
B &\to CC \mid b\\
C &\to AB \mid a
\end{aligned}
$$
Use the CYK algorithm to determine whether the string 'abaab' is in $L(G)$.`,
        ),
      ],
    },
  ],
}

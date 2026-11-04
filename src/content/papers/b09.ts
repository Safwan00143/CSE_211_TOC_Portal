import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB09: Paper = {
  slug: "b09",
  batch: "09 batch",
  course: "CSE 211",
  session: "2010-2011",
  year: 2012,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2010-2011",
  date: "26/12/2012",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are NINE questions in this section. Answer any SEVEN.",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "nfa",
              prompt: r`You have designed a deterministic finite automaton (DFA) for a certain language from another nondeterministic finite automaton (NFA) using subset construction method. Do you think that the new DFA will accept/reject the same languages as the original NFA? Explain with necessary justification.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "dfa",
              prompt: r`Design a deterministic finite automaton which accepts the language consisting of strings from $\{a, b\}^*$ and $n \bmod 3 = 1$, where $n$ is the number of $a$'s in the string. Depict the automaton using transition diagram as well as mathematical representation.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "nfa",
              prompt: r`Convert the NFA shown below into an equivalent DFA using lazy evaluation.

| | 0 | 1 |
|---|---|---|
| $\to p$ | $\{p,q\}$ | $\{p\}$ |
| $q$ | $\{r,s\}$ | $\{t\}$ |
| $r$ | $\{p,r\}$ | $\{t\}$ |
| $s*$ | $\emptyset$ | $\emptyset$ |
| $t*$ | $\emptyset$ | $\emptyset$ |`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "", marks: 10, topic: "dfa", prompt: r`Design a deterministic finite automaton which accepts the language consisting of strings from $\{0, 1\}^*$ and the language does *not* contain the substring 110. Now, show the regular expression for this language. *(7+3)*` },
          ],
        },
        { no: 5, parts: [{ part: "", marks: 10, topic: "pumping-regular", prompt: r`State and prove the pumping lemma.`, alsoAsked: ["2014–15 Q4(b)"] }] },
        { no: 6, parts: [{ part: "", marks: 10, topic: "pumping-regular", prompt: r`Using pumping lemma show whether the language $L = \{0^n1^m0^n \mid m, n \ge 0\}$ is a regular language or not.` }] },
        {
          no: 7,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "cfg",
              prompt: r`Consider the grammar $G = (V, \Sigma, P, S)$, where $V = \{a, b, S, A\}$, $\Sigma = \{a, b\}$, $P = \{S \to AA, A \to AAA, A \to a, A \to bA, A \to Ab\}$. For any $m, n, p > 0$, describe with necessary explanation a derivation in $G$ of the string $b^mab^nab^p$.`,
            },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "cfg",
              prompt: r`Consider the alphabet $\Sigma = \{a, b, (, ), \cup, *, \emptyset\}$. Use the rules (basic and inductive) for building regular expressions to construct a context-free grammar that generates all strings in $\Sigma^*$ that are regular expressions over $\{a, b\}$.`,
            },
          ],
        },
        {
          no: 9,
          parts: [
            {
              part: "",
              marks: 10,
              topic: "cfg",
              prompt: r`Give a context-free grammar for each of the following languages.

(a) $L_1 = \{0^n1^m0^m1^n \mid n, m \ge 0\}$,

(b) $L_2 = \{a^nb^mc^k \mid n, m, k \ge 0 \text{ and } n = m + k\}$,

(c) $L_3 = \{a^nb^mc^k \mid n, m, k \ge 0 \text{ and } n = 2m + 3k\}$,

(d) $L_4 = \{a^nb^m \mid 0 \ge n \ge m \ge 2n\}$.`,
              note: "(d) is printed as 0 ≥ n ≥ m ≥ 2n, which only allows n = m = 0; it is almost certainly meant to be 0 ≤ n ≤ m ≤ 2n. The solution answers both.",
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are FOUR questions in this Section. Answer any THREE.",
      questions: [
        {
          no: 10,
          parts: [
            { part: "a", marks: 4, topic: "undecidability", prompt: r`Show that the set of all infinite binary sequence is uncountable.`, alsoAsked: ["2014–15 Q7(b)"] },
            { part: "b", marks: 8.33, topic: "undecidability", prompt: r`Using the findings of Question 10(a), prove that some languages are not Turing-recognizable.` },
            { part: "c", marks: 7, topic: "undecidability", prompt: r`Prove that a language is decidable if and only if both the language and its complement are Turing-recognizable.` },
            { part: "d", marks: 4, topic: "undecidability", prompt: r`Give a formal description of the halting problem. Give an example of a language that is not Turing-recognizable.` },
          ],
        },
        {
          no: 11,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "tm-variants",
              prompt: r`Describe equivalent single tape Turing machines that can be used to completely simulate the following variants of Turing machines. *(3×5)*

(i) Multi-tape Turing machine, (ii) Non-deterministic Turing machine with a single-tape, (iii) Turing machine with two-dimensional tape stretched to infinity in all directions.`,
            },
            {
              part: "b",
              marks: 8.33,
              topic: "tm-basics",
              prompt: r`Describe a Turing machine that decides the following language: $L = \{a^{2^n}b \mid n \ge 0\}$. Show the state diagram of the machine. Show the sequence of configurations of the machine for the input string aaaab.`,
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "a",
              marks: 4,
              topic: "undecidability",
              prompt: r`What is the difference between Turing-decidable and Turing-recognizable languages? What are the three conditions that must be met by a Turing Machine $M$ if it is to recognize a string $w$ of a language $L$?`,
            },
            {
              part: "b",
              marks: 3,
              topic: "tm-basics",
              prompt: r`What does the following Turing machine do?
$$
>R \xrightarrow{a\ne\sqcup} R \xrightarrow{b\ne\sqcup} R_\sqcup\, a\, R_\sqcup\, b
$$
Do the Turing machines $LR$ and $RL$ always automate the same way? Explain.`,
              note: "This uses the macro notation of Lewis and Papadimitriou (R, L: move one cell; R⊔: move right to the next blank; a written after a machine: write a).",
            },
            { part: "c", marks: 11, topic: "pda-hmu", prompt: r`Prove that if a PDA recognizes some language $L$, then $L$ is context free.`, alsoAsked: ["2014–15 Q7(a)"] },
            {
              part: "d",
              marks: 5.33,
              topic: "pda-hmu",
              prompt: r`Give an informal description and state diagram for the PDA that recognizes the following CFG:
$$
\begin{aligned}
S &\to TX\\
T &\to 0T0 \mid 1T1 \mid \#X\\
X &\to 0X \mid 1X \mid \varepsilon
\end{aligned}
$$
where the starting symbol is $S$.`,
            },
          ],
        },
        {
          no: 13,
          parts: [
            { part: "a", marks: 8, topic: "pda", prompt: r`Formally describe a PDA that recognizes the following language: $L = \{w \in \{0, 1\}^* \mid w = w^R\}$.` },
            { part: "b", marks: 7.33, topic: "pda-hmu", prompt: r`Convert the PDA derived in Question 13(a), into an equivalent CFG following standard rules of conversion.` },
            {
              part: "c",
              marks: 8,
              topic: "pda",
              prompt: r`Automate the following PDA for the input 1001 and 0101 separately. What does the PDA do?

${fig("b09-13c")}`,
            },
          ],
        },
      ],
    },
  ],
}

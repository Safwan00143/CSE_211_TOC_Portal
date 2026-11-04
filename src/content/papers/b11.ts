import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB11: Paper = {
  slug: "b11",
  batch: "11 batch",
  course: "CSE 211",
  session: "2012-2013",
  year: 2015,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2012-2013",
  date: "11/01/2015",
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
              topic: "pda-hmu",
              prompt: r`Give formal definition of pushdown automata. Construct a pushdown automaton that recognizes the same language as recognized by the following context free grammar:
$$
\begin{aligned}
S &\to BS \mid A\\
A &\to 0A \mid \varepsilon\\
B &\to BB1 \mid 2
\end{aligned}
$$`,
            },
            { part: "b", marks: 13.33, topic: "pda-hmu", prompt: r`Prove that a language is context free language (CFL) if and only if there exists a pushdown automaton (PDA) accepting it.` },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "undecidability",
              prompt: r`What is the difference between Turing recognizable and decidable languages? Explain. The halting problem can be described by the following language: $L = \{\langle M, w\rangle : M \text{ is a Turing machine and } M \text{ halts on input string } w\}$. Show that the language $L$ is Turing-acceptable.`,
              alsoAsked: ["2019–20 Q12"],
            },
            {
              part: "b",
              marks: 13.33,
              topic: "pumping-cfl",
              prompt: r`Give a formal definition of pumping lemma for context free language (CFL). Use the pumping lemma for CFL to show that the language $L = \{a^nb^nc^n \mid n \ge 0\}$ is not CFL.`,
              alsoAsked: ["2023–24 Q7", "2016–17 Q7(c)"],
            },
          ],
        },
        {
          no: 3,
          parts: [
            { part: "a", marks: 8, topic: "tm-variants", prompt: r`Prove that every multi-tape Turing machine has an equivalent single-tape Turing machine.`, alsoAsked: ["2023–24 Q10"] },
            {
              part: "b",
              marks: 7,
              topic: "tm-basics",
              prompt: r`Let $\Sigma = \{-, a, b\}$ and $L = \{w{-}w{-}w \mid w \in \{a, b\}^*\}$. Give a high level description of a Turing machine $M$ that decides $L$. Draw a state diagram for $M$. You may assume $M$ has a doubly infinite tape.`,
              alsoAsked: ["2014–15 Q8(b) (w−w)"],
            },
            {
              part: "c",
              marks: 8.33,
              topic: "tm-basics",
              prompt: r`Give the state diagram of a Turing machine $M$ that does the following on input string '#w' where $w \in \{0, 1\}^*$. Let $n = |w|$ (the length of the string $w$). If $n$ is even, then $M$ converts string #w to the string #0^n (symbol 0 is repeated $n$ times). If $n$ is odd, then $M$ converts #w to the string #1^n (symbol 1 is repeated $n$ times). The machine should enter the accepting state after the conversion. Do not care where the head should be at the end of conversion. Do not show the reject state and the corresponding transitions to the reject state.`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 8, topic: "pda", prompt: r`Construct the state diagram of a pushdown automaton that recognizes the following language $L = \{a^ib^jc^k : i + j = k\}$.` },
            { part: "b", marks: 7, topic: "tm-variants", prompt: r`Show that every nondeterministic Turing machine has an equivalent deterministic Turing machine.`, alsoAsked: ["2014–15 Q7(c)"] },
            {
              part: "c",
              marks: 8.33,
              topic: "pda",
              prompt: r`Construct the state diagram of a pushdown automaton that accepts the following language: $L = \{w : w \in \{a, b\}^* \text{ and length of } w \text{ is odd with middle symbol 'a'}\}$. Few example strings in the language $L$ are: aaa, bbabb, baaba.`,
            },
          ],
        },
      ],
    },
    {
      name: "Section B",
      instructions: "There are FOUR questions in this Section. Answer any THREE. Assume reasonable any missing data. Symbols carry their usual meaning.",
      questions: [
        {
          no: 5,
          parts: [
            { part: "a", marks: 8, topic: "cfg", prompt: r`Consider the grammar $E \to E + E \mid E * E \mid (E) \mid a$. Is this grammar ambiguous? Explain with respect of $a + a * a$.`, alsoAsked: ["2017–18 Q6"] },
            { part: "b", marks: 5.33, topic: "pumping-regular", prompt: r`Prove that Language $\{0^n \mid n \text{ is a perfect square}\}$ is not regular.`, alsoAsked: ["2014–15 Q2(a)"] },
            {
              part: "c",
              marks: 10,
              topic: "closure",
              prompt: r`Define regular language. Prove that the class of regular language is closed under the following operations: (i) Star operation (ii) Concatenation operation`,
            },
          ],
        },
        {
          no: 6,
          parts: [
            {
              part: "a",
              marks: 8,
              topic: "cfg",
              prompt: r`Let $L = \{a^nb^nc^m \mid n \ge 1, m \ge 1\} \cup \{a^nb^mc^m \mid n \ge 1, m \ge 1\}$ be a context free language. Explain that all grammars for $L$ are ambiguous.`,
            },
            { part: "b", marks: 12.33, topic: "pumping-regular", prompt: r`Is there any technique to test whether a given language $L$ is regular or not? State and prove it.` },
            { part: "c", marks: 3, topic: "regex", prompt: r`Write regular expressions for the following language: String of 0's and 1's having even parity, that is, an even number of 1's.` },
          ],
        },
        {
          no: 7,
          parts: [
            { part: "a", marks: 8, topic: "cfg", prompt: r`Design a context free grammar $G$ to generate the language of regular expression $0^*1(0+1)^*$. Using $G$, give leftmost and rightmost derivations of the string 00101.` },
            {
              part: "b",
              marks: 7.33,
              topic: "regex",
              prompt: r`Convert the following DFA into Regular expression

${fig("b11-7b")}`,
            },
            { part: "c", marks: 8, topic: "dfa", prompt: r`Design a DFA to accept the language: $L = \{w \mid w \text{ is a binary string having a decimal value that is multiple of five}\}$.` },
          ],
        },
        {
          no: 8,
          parts: [
            { part: "a", marks: 5, topic: "nfa", prompt: r`Give three differences between DFA and NFA with examples.` },
            { part: "b", marks: 12.33, topic: "regex", prompt: r`Prove that a set is regular if and only if it can be described by a regular expression.` },
            { part: "c", marks: 6, topic: "pumping-regular", prompt: r`Prove that $\{0^n10^n \mid n > 1\}$ is not a regular language.` },
          ],
        },
      ],
    },
  ],
}

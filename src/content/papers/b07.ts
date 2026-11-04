import type { Paper } from "../types"

const r = String.raw

export const paperB07: Paper = {
  slug: "b07",
  batch: "07 batch",
  course: "CSE 211",
  session: "2008-2009",
  year: 2010,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2008-2009",
  date: "23/03/2010",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this Section. Answer any THREE.",
      questions: [
        {
          no: 1,
          stem: r`For the following languages, either design a push down automata that accepts those or prove that it is impossible to do so:`,
          parts: [
            { part: "i", marks: 10, topic: "pda", prompt: r`$L = \{a^nb^{2n} ; n > 0\}$` },
            { part: "ii", marks: 13.33, topic: "pumping-cfl", prompt: r`$L = \{a^nb^{2n}c^n ; n \ge 0\}$` },
          ],
        },
        {
          no: 2,
          stem: r`For the following grammar
$$
\begin{aligned}
S &\to ASB \mid \varepsilon\\
A &\to aAS \mid a\\
B &\to SbS \mid A \mid bb
\end{aligned}
$$`,
          parts: [
            { part: "a", marks: 7.33, topic: "cnf-cyk", prompt: r`Eliminate $\varepsilon$-production` },
            { part: "b", marks: 8, topic: "cnf-cyk", prompt: r`Eliminate any unit production` },
            { part: "c", marks: 8, topic: "cnf-cyk", prompt: r`Eliminate any useless symbol` },
          ],
        },
        {
          no: 3,
          parts: [
            { part: "a", marks: 2.33, topic: "tm-basics", prompt: r`Describe formal notation of the Turing Machine.` },
            {
              part: "b",
              marks: 13,
              topic: "tm-techniques",
              prompt: r`Design a Turing Machine that computes Bitwise XOR of two binary strings having the same length. For example, if input is 0010 # 1011, then the output should be: 1001. (Here, # is separator symbol. Make necessary assumptions)`,
              alsoAsked: ["January 2020 Q9"],
            },
            { part: "c", marks: 8, topic: "tm-techniques", prompt: r`Simulate your Turing Machine of 3(b) for the following input 1011 # 0010.` },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 12, topic: "undecidability", prompt: r`Describe and sketch a proof of Rice's theorem. *(3+9)*` },
            { part: "b", marks: 3.33, topic: "undecidability", prompt: r`Argue whether the following problem is decidable: "whether the language accepted by a Turing Machine is palindromic."` },
            { part: "c", marks: 3, topic: "undecidability", prompt: r`Give an example of a language that is recursively enumerable but not recursive.` },
            { part: "d", marks: 5, topic: "undecidability", prompt: r`Prove that "if both $L$ and $\overline{L}$ are recursively enumerable then both $L$ and $\overline{L}$ are recursive."`, alsoAsked: ["2010–11 Q10(c)"] },
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
            {
              part: "a",
              marks: 10,
              topic: "pumping-regular",
              prompt: r`Let $L$ be a regular language. Prove that there exists a constant $n$ (which depends on $L$) such that for every string $w$ in $L$, $|w| \ge n$, we can break $w$ into three strings, $w = xyz$, such that: (i) $y \ne \varepsilon$. (ii) $|xy| \le n$. (iii) For all $k \ge 0$, the string $xy^kz$ is in $L$.`,
            },
            { part: "b", marks: 8, topic: "pumping-regular", prompt: r`Prove that $\{0^n10^n \mid n \ge 1\}$ is not a regular language.`, alsoAsked: ["2012–13 Q8(c)"] },
            { part: "c", marks: 5.33, topic: "nfa", prompt: r`Define a deterministic finite automaton and a nondeterministic finite automaton.` },
          ],
        },
        {
          no: 6,
          parts: [
            { part: "a", marks: 9, topic: "dfa", prompt: r`Design a DFA to accept the language: $L = \{w \mid w \text{ is a binary string having a decimal value that is a multiple of three}\}$.` },
            { part: "b", marks: 9, topic: "nfa", prompt: r`Give an illustrative example of an NFA with $n+1$ states, which has no equivalent DFA with fewer than $2^n$ states.` },
            {
              part: "c",
              marks: 5.33,
              topic: "nfa",
              prompt: r`Consider the following $\varepsilon$-NFA

| | $\varepsilon$ | $a$ | $b$ | $c$ |
|---|---|---|---|---|
| $\to p$ | $\emptyset$ | $\{p\}$ | $\{q\}$ | $\{r\}$ |
| $q$ | $\{p\}$ | $\{q\}$ | $\{r\}$ | $\emptyset$ |
| $*r$ | $\{q\}$ | $\{r\}$ | $\emptyset$ | $\{p\}$ |

(i) Compute the $\varepsilon$-closure of each state. (ii) Convert the automaton to a DFA.`,
              alsoAsked: ["January 2020 Q1(c)", "2017–18 Q4(a)"],
            },
          ],
        },
        {
          no: 7,
          parts: [
            { part: "a", marks: 14, topic: "regex", prompt: r`Prove that if $L = L(A)$ for some DFA $A$, then there is a regular expression $R$ such that $L = L(R)$.` },
            {
              part: "b",
              marks: 5,
              topic: "regex",
              prompt: r`Write regular expressions for the following languages: (i) The set of strings over alphabet $\{a, b, c\}$ containing at least one a and at least one c. (ii) The set of binary strings with no two consecutive 0's or no two consecutive 1's.`,
            },
            { part: "c", marks: 4.33, topic: "regex", prompt: r`Convert the regular expression $(0 + 1)^*1(0 + 1)$ to an $\varepsilon$-NFA.` },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "a",
              marks: 9,
              topic: "cfg",
              prompt: r`Let $L = \{a^nb^nc^md^m \mid n \ge 1, m \ge 1\} \cup \{a^nb^mc^md^n \mid n \ge 1, m \ge 1\}$ be a context-free language. Explain that all grammars for $L$ are ambiguous.`,
              alsoAsked: ["2012–13 Q6(a) (similar)"],
            },
            { part: "b", marks: 9, topic: "cfg", prompt: r`Design a context-free grammar $G$ to generate the language of regular expression $0^*1(0 + 1)^*$. Using $G$, give leftmost and rightmost derivations of the string 00101.`, alsoAsked: ["2012–13 Q7(a)"] },
            { part: "c", marks: 5.33, topic: "cfg", prompt: r`Consider the grammar $S \to aS \mid aSbS \mid \varepsilon$. Show in particular that the string aab has two - (i) Parse trees. (ii) Leftmost derivations. (iii) Rightmost derivations.` },
          ],
        },
      ],
    },
  ],
}

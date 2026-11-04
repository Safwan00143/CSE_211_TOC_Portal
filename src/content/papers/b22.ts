import type { Paper } from "../types"

const r = String.raw

export const paperB22: Paper = {
  slug: "b22",
  batch: "22 batch",
  course: "CSE 211",
  session: "2023-2024",
  year: 2026,
  exam: "L-2/T-II B. Sc. Engineering Examinations 2023-2024",
  date: "05/05/2026",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer Q. No. 1 and any TWO from the rest. Answer to Question No. 1 is compulsory.",
      questions: [
        {
          no: 1,
          stem: "**[COMPULSORY]**",
          parts: [
            {
              part: "a",
              marks: 8,
              topic: "intro",
              prompt: r`What are the options that I have when I confront a problem that appears to be computationally hard?`,
            },
            {
              part: "b",
              marks: 17,
              topic: "dfa",
              prompt: r`A *run* in a string is a substring of length at least two, as long as possible, and consisting entirely of the same symbol. For instance, the string abbbaab contains a run of b's of length three and a run of a's of length two. Find deterministic finite automata (DFAs) for the language over the alphabet $\{a,b\}$:
$$
L = \{w \mid \text{there are at most two runs of } a\text{'s of length exactly three}\}.
$$
Show only the state diagram for this DFA.`,
            },
            {
              part: "c",
              marks: 10,
              topic: "closure",
              prompt: r`Draw the state diagrams of Nondeterministic Finite Automata (NFAs) recognizing the concatenation of the languages over the alphabet $\{0,1\}$;

(i) $\{w \mid w \text{ contains at least three 1s}\}$,

(ii) The empty set.

You will start with the individual NFAs for each of the languages and then use the technique used in the proof of the theorem related to closure of regular languages under the concatenation operation.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "pumping-regular",
              prompt: r`Justify why, in the pumping lemma for regular languages, the decomposition, $w = xyz$ must satisfy the condition, $|xy| \le p$. Explain clearly with an example language and corresponding finite automaton.`,
            },
            {
              part: "b",
              marks: 15,
              topic: "dfa",
              prompt: r`Show that the language, $L = \{awa \mid w \in \{a,b\}^*\}$ is regular by constructing a deterministic finite automaton (DFA) for it.`,
            },
            {
              part: "c",
              marks: 5,
              topic: "dfa",
              prompt: r`Does the number of accepting states in a deterministic finite automaton (DFA) have any effect on the number of rows and columns in the transition table for the DFA in any manner? Explain.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "nfa",
              prompt: r`Find a Nondeterministic Finite Automaton (NFA) with three states that accepts the language, $L = \{a^n \mid n \ge 1\} \cup \{b^m a^k \mid m \ge 0, k \ge 0\}$.

Showing only the state diagram for this NFA should suffice.

Do you think that the above language can be accepted by an NFA with fewer than three states? Elaborate your response.`,
            },
            {
              part: "b",
              marks: 13,
              topic: "closure",
              prompt: r`We are proving the theorem related to closure of regular languages under the star operation. Someone suggested making the original start state as the accepting state without adding any additional state as the new start state (to be used as one of the accepting states as well), while keeping the rest of the construction the same. Argue carefully to explain why this is a bad idea. Give a counterexample to show that the newly proposed construction fails.`,
              alsoAsked: ["2016–17 Q4(a)"],
            },
            {
              part: "c",
              marks: 7,
              topic: "cfg",
              prompt: r`Why are context free grammars called "context free"? Explain with necessary examples.`,
              alsoAsked: ["2021–22 Q1(e)"],
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "nfa",
              prompt: r`Find a Nondeterministic Finite Automaton (NFA) that accepts $\{a\}^*$ and is such that if in its transition graph a single edge is removed (without any other changes), the resulting automaton accepts $\{a\}$. Showing only the state diagram for this NFA should suffice.`,
            },
            {
              part: "b",
              marks: 12,
              topic: "regex",
              prompt: r`We are trying to find a regular expression corresponding to the language of all and only the strings over the alphabet $\{a, b\}$ that contain no more than one occurrence of the string aa. We are presented with the following options:

A. $(b+ab)^*(\varepsilon+a+aa)(b+ab)^*$

B. $(b+ab)^*(\varepsilon+a+aa)(b+ba)^*$

C. $(b+ab)^*(\varepsilon+a)(b+ba)^*$

D. $(b+ba)^*(\varepsilon+a+aa)(b+ba)^*$

Find out which of the option(s) is/are correct. You must state the reasons in each case.`,
            },
            {
              part: "c",
              marks: 13,
              topic: "pumping-regular",
              prompt: r`Use the pumping lemma for regular languages to show that the language
$$
L = \{a^{n!} \mid n \ge 1\}
$$
is not regular.`,
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
              prompt: r`Design a context-free grammar that generates the language
$$
L = \{a^ib^jc^k \mid (i=j \text{ or } i=k),\ i \ge 1,\ j \ge 1,\ k \ge 1\}.
$$
Show that the grammar you designed is ambiguous by giving two different parse trees for some string in the language. *(10+5)*`,
            },
          ],
        },
        {
          no: 6,
          stem: r`The following are the productions of a grammar $G$ in *Chomsky Normal Form* (CNF):
$$
\begin{aligned}
S &\to BZ \mid CY \mid ZZ \mid YY\\
B &\to ZA\\
C &\to YA\\
A &\to ZA \mid YA \mid 0 \mid 1\\
Z &\to 0\\
Y &\to 1
\end{aligned}
$$`,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "cnf-cyk",
              prompt: r`Determine whether 0010 is in $L(G)$ using the CYK algorithm (you need to show the corresponding table).`,
              alsoAsked: ["2019–20 Q7 (same grammar)"],
            },
            {
              part: "b",
              marks: 5,
              topic: "cnf-cyk",
              prompt: r`Describe the language generated by the grammar $G$ in simple English.`,
            },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "pumping-cfl",
              prompt: r`Provide an example of a language which is *not context-free*. Show that the language you provided is not context-free using the pumping lemma for context-free languages. *(5+10)*`,
              alsoAsked: ["2021–22 Q8"],
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
              prompt: r`Design a pushdown automaton (PDA) that recognizes the language
$$
L = \{a^nb^mc^md^n \mid n \ge 1, m \ge 1\}.
$$
Draw its transition diagram.`,
              alsoAsked: ["2017–18 Q8 (similar)"],
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
              prompt: r`Design a Turing machine (TM) that takes as input two numbers, $w_1$ and $w_2$, in binary, and determines whether the numbers are equal or not. The tape initially contains $w_1cw_2c$ where '$c$' is a tape symbol that is used as a separator. Your TM should compare $w_1$ and $w_2$, write 0 after the second $c$ if they are equal, and write 1 after the second $c$ otherwise. (You can assume that the numbers are of the same length, and use multiple tracks and storage in the state if you wish).`,
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
              prompt: r`What is a multi-tape Turing machine? Explain how a one-tape Turing machine with multiple tracks and storage in the state can simulate a multi-tape Turing machine. *(5+10)*`,
              alsoAsked: ["2019–20 Q10(b)"],
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
              prompt: r`Provide an example of a language which is *not recursively enumerable*. Devise a proof to show that the *Halting* problem is *not recursive*. (You can assume that the Universal language is known to be not recursive)`,
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "i",
              marks: 8,
              topic: "complexity",
              prompt: r`Draw a Venn diagram showing the widely believed relationship among the classes of languages P, NP, NP-complete, recursive, and recursively enumerable.`,
            },
            {
              part: "ii",
              marks: 7,
              topic: "complexity",
              prompt: r`What is the relationship between the classes PSPACE and NPSPACE? Justify your answer briefly.`,
              alsoAsked: ["2022–23 Q13(ii)"],
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
              prompt: r`Briefly explain how Cook's theorem shows that all problems in NP are reducible to the satisfiability problem. Suppose, a non-deterministic Turing machine has a transition rule $\delta(q, t) = \{(q_1, t_1, R), (q_2, t_2, L)\}$, where symbols have their usual meanings. Construct the corresponding rule in the Boolean satisfiability formula according to Cook's construction if the tape head is at the $i$-th cell in the $j$-th step. (You can assume that the tape head is *not* at the leftmost or rightmost non-blank cells). *(8+7)*`,
              alsoAsked: ["2022–23 Q13(i)"],
            },
          ],
        },
      ],
    },
  ],
}

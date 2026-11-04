import type { Paper } from "../types"

const r = String.raw

export const paperB15: Paper = {
  slug: "b15",
  batch: "15 batch",
  course: "CSE 211",
  session: "2016-2017",
  year: 2018,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2016-2017",
  date: "22/02/2018",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this Section. Answer any THREE.",
      questions: [
        {
          no: 1,
          stem: r`In a faraway strange planet Xustaeter, there are three colors of stones, red, green, and blue. When two different colored stones get in contact with each other: (i) these two stones are destroyed, (ii) two more stones of the third color are created.

The planet fails, if, at some point, all stones are of the same color. Then, no more stone creation can take place. We want to represent the planet using a state diagram, where a state label will be a sequence of three integers — the numbers of stones of color red, green and blue. In the state diagram, an R-event occurs when stones of color green and blue touch and are replaced by two red stones. Analogously we define, G-events and B-events.`,
          parts: [
            { part: "a", marks: 5, topic: "dfa", prompt: r`Represent Xustaeter when there are 3 stones in total. Identify the states in/from which the planet must fail. Similarly, identify the can't-fail and might-fail states.` },
            { part: "b", marks: 10, topic: "dfa", prompt: r`Represent Xustaeter using state diagrams when there are 4 stones in total. Again, identify the must-fail, can't-fail and might-fail states.` },
            { part: "c", marks: 6, topic: "dfa", prompt: r`From the diagrams in (b), find the symmetries in the state diagrams which will enable us to reduce the diagram sizes. Propose a reduced state diagram scheme based on this.` },
            { part: "d", marks: 14, topic: "dfa", prompt: r`Using the scheme proposed in (c), draw the state diagram for Xustaeter when there are 6 stones in total. Identify the must-fail, can't-fail and might-fail states.` },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 17,
              topic: "dfa",
              prompt: r`DFA, $D_1$ has a rather strange alphabet $\Sigma = \{a, b, 1, 2\}$, containing both letters and digits. $D_1$ accepts all and only the strings which has number of $a$'s divisible by 3 and has an even sum of the digits. As such, strings like $\varepsilon$, aab12a1, aab1bbaaba2a1, aaba and 121 will be accepted. And strings like, aaab12a1, aab11bbaaba2a1, aaaba and 1121 will be rejected. Draw the state diagram for $D_1$.`,
            },
            {
              part: "b",
              marks: 8,
              topic: "nfa",
              prompt: r`Convert the NFA shown in the following figure to an equivalent DFA. Showing the detailed computations is optional.

The NFA (states $p,q,r,s$; start $p$; accepting $q$) has transitions $p\xrightarrow{0}q$, $p\xrightarrow{\varepsilon}r$, $q\xrightarrow{0}q$, $q\xrightarrow{\varepsilon}r$, $r\xrightarrow{1}q$, $r\xrightarrow{\varepsilon}s$, $s\xrightarrow{0}p$, $s\xrightarrow{0}r$ (drawn on the left of the solution's figure).`,
            },
            { part: "c", marks: 10, topic: "intro", prompt: r`Why is the Kleene star of a null set an empty string? Explain clearly.`, alsoAsked: ["2021–22 Q3(a)", "2022–23 Q3(c)"] },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 20,
              topic: "nfa",
              prompt: r`Draw state diagrams of NFAs to accept the following languages. *(5+8+7)*

(i) The set of strings over alphabet $\{0, 1, \ldots, 9\}$ such that the final digit has appeared before.

(ii) The set of strings over alphabet $\{0, 1, \ldots, 9\}$ such that final digit has *not* appeared before.

(iii) The set of strings of 0's and 1's such that there are at least two 0's separated by a number of positions that is a multiple of 4. In addition to the aforementioned pair of 0's, there may be other 0's in the string. Note that 0 is an allowable multiple of 4. Some of the strings accepted by this NFA are, 00, 10111010, 01010111011.`,
              note: "In (iii), 00 fits the stated definition (0 positions between), but 10111010 and 01010111011 only fit if 'separated by' means the difference of the two positions. The solution follows the definition and gives the other reading as a remark.",
              alsoAsked: ["2017–18 Q3(a) (nonzero gap)"],
            },
            {
              part: "b",
              marks: 15,
              topic: "regex",
              prompt: r`Write down regular expressions for the following: *(4+4+7)*

(i) The set of strings that consist of alternating 0's and 1's.

(ii) The set of strings over alphabet $\{a, b, c\}$ containing at least one $a$ and at least one $b$.

(iii) The set of all strings of 0's and 1's such that every pair of adjacent 0's appears before any pair of adjacent 1's.`,
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "closure",
              prompt: r`We have the NFA $N_1$ accepting the language $A$. When constructing an NFA $N_1^*$ from $N_1$ to accept $A^*$, we add an additional state and make this state the new start state as well as an accepting state. You should be aware of the other edges we add to $N_1^*$.

Hastif Hasty came up with the (apparently) brilliant idea of not adding the new state and making the original start state an accepting state, leaving the newly added edges unchanged when applicable. However, eventually, a flaw was detected in this proposed design by Nutty Nitpicker. Explain clearly under which situations the idea proposed by Hasty will not work.`,
              alsoAsked: ["2023–24 Q3(b)"],
            },
            { part: "b", marks: 13, topic: "closure", prompt: r`Prove that, "The class of regular languages is closed under the concatenation operation".` },
            { part: "c", marks: 12, topic: "pumping-regular", prompt: r`Using pumping Lemma for regular languages, show that the language consisting of all strings of 1's whose length is a prime is not a regular language.`, alsoAsked: ["2019–20 Q1(a)"] },
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
              marks: 15,
              topic: "cfg",
              prompt: r`Give context-free grammars that generate the following languages. In all parts, the alphabet $\Sigma$ is $\{0,1\}$. You only need to write the production rules using conventional notation. *(5×3)*

(i) $\{w \mid \text{the length of } w \text{ is odd}\}$

(ii) $\{w \mid w \text{ contains at least three 1s}\}$

(iii) $\{w \mid \text{the length of } w \text{ is odd and its middle symbol is a } 0\}$`,
              alsoAsked: ["2017–18 Q5(b)"],
            },
            {
              part: "b",
              marks: 20,
              topic: "tm-basics",
              prompt: r`Design a Turing Machine (TM) that takes as input a number $N$ in binary and adds 1 to it. Initially the tape will contain (in its leftmost portion) a # followed by the number $N$ in binary (e.g., #101), and the tape head will be on #. Your TM should halt after converting the $N$ into $N+1$. You may replace the # with 0 or 1 if you need. Also briefly explain the working principle of the TM (For example, by drawing a flow chart or a pseudo code).`,
            },
          ],
        },
        {
          no: 6,
          parts: [
            { part: "a", marks: 15, topic: "pda", prompt: r`Design a PDA to accept the language $L = \{0^n1^m \mid n \le m \le 2n\}$. Provide the transition diagram of your designed PDA. No need to write the transition function. Also, show that your PDA accepts 00111 and that it rejects 0011111. *(10+5)*` },
            {
              part: "b",
              marks: 10,
              topic: "cnf-cyk",
              prompt: r`Convert the following CFG into an equivalent CFG in Chomsky normal form. Show the steps of your conversion.
$$
\begin{aligned}
A &\to BAB \mid B \mid \varepsilon\\
B &\to 00 \mid \varepsilon
\end{aligned}
$$`,
              alsoAsked: ["2014–15 Q5(c)"],
            },
            { part: "c", marks: 10, topic: "tm-basics", prompt: r`Define a Turing Machine for the set of strings with an equal number of 0's and 1's.` },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "undecidability",
              prompt: r`Let $A$ be the language of strings representing undirected connected graphs, i.e., $A = \{\langle G\rangle \mid G \text{ is a connected undirected graph}\}$. Is it possible to design a Turing Machine that can decide $A$? If no, why? If yes, briefly discuss your design and demonstrate with a suitable example.`,
            },
            { part: "b", marks: 10, topic: "pda", prompt: r`Give a PDA that recognizes the language $\{ww^R \mid w \in \{0,1\}^*\}$. Here, $w^R$ means $w$ written backwards.` },
            { part: "c", marks: 10, topic: "pumping-cfl", prompt: r`Use the pumping lemma to show that the language $B = \{a^nb^nc^n \mid n \ge 0\}$ is not context free.`, alsoAsked: ["2023–24 Q7", "2021–22 Q8"] },
          ],
        },
        {
          no: 8,
          parts: [
            { part: "a", marks: 15, topic: "undecidability", prompt: r`Prove that, the following language is undecidable $A_{TM} = \{\langle M, w\rangle \mid M \text{ is a Turing Machine accepting } w\}$.` },
            {
              part: "b",
              marks: 10,
              topic: "cfg",
              prompt: r`Design a context-free grammar (CFG) for $A = \{w \in \{0,1\}^* \mid w = w^R \text{ and the length of } w \text{ is divisible by } 4\}$. You only need to write the production rules using conventional notation.`,
            },
            {
              part: "c",
              marks: 10,
              topic: "cfg",
              prompt: r`Give a context-free grammar, that generates the following parse tree. You only need to write the production rules using conventional notation.

The parse tree (as printed) has root ⟨EXPR⟩ with children ⟨EXPR⟩, +, ⟨TERM⟩. The left ⟨EXPR⟩ → ⟨TERM⟩ → ⟨FACTOR⟩ → a. The right ⟨TERM⟩ has children ⟨TERM⟩, ×, ⟨FACTOR⟩, where ⟨TERM⟩ → ⟨FACTOR⟩ → a and ⟨FACTOR⟩ → a. Its yield is a + a × a.`,
            },
          ],
        },
      ],
    },
  ],
}

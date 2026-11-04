import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB21: Paper = {
  slug: "b21",
  batch: "21 batch",
  course: "CSE 211",
  session: "2022-2023",
  year: 2025,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2022-2023",
  date: "19/01/2025",
  fullMarks: 210,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Question no. 1 is compulsory. Answer any 2 questions from Questions 2-4.",
      questions: [
        {
          no: 1,
          parts: [
            {
              part: "a",
              marks: 10,
              topic: "intro",
              prompt: r`Elucidate the role of public and private keys in asymmetric cryptography. Assess how do they work together to ensure secure communication between two parties. Analyze the role played by the field of Theory of Computation in this scenario.`,
              alsoAsked: ["2019–20 Q1(b) (similar)"],
            },
            {
              part: "b",
              marks: 12,
              topic: "dfa",
              prompt: r`An automaton with an alphabet, $\Sigma = \{R, 0, 1, 2\}$, keeps a running count of the sum of the numerical input symbols it reads, modulo 3. Every time it receives the $R$ symbol, it resets the count to 0. It accepts if the sum is 0, modulo 3, or in other words, if the sum is a multiple of 3. Since it keeps track of sum modulo 3, you designed the automaton with three states. However, your classmate Null Pointer suggested that an alternative design can be carried out using only two states, one for remainder 0, another for remainder nonzero. Comment analytically in detail on this claim.`,
            },
            {
              part: "c",
              marks: 13,
              topic: "dfa",
              prompt: r`Construct deterministic finite automaton accepting the language,
$$
\{w \mid w \in \{a, b\}^* \text{ and } w \text{ has neither } aa \text{ nor } bb \text{ as a substring}\}.
$$
Providing the transition table representation is required.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 20,
              topic: "dfa",
              prompt: r`Describe informally the languages accepted by each of the following finite state automatons:

${fig("b21-2a-i", "b21-2a-ii", "b21-2a-iii", "b21-2a-iv", "b21-2a-v")}`,
              note: "The five diagrams are redrawn from the paper; the state names are added here so the solution can refer to them.",
            },
            {
              part: "b",
              marks: 15,
              topic: "pumping-regular",
              prompt: r`For $\Sigma = \{a, b\}$, let us consider the regular language,
$$
L = \{w \mid w = a^{2+3k} \text{ or } w = b^{10+12k},\ k \ge 0\}.
$$
Argue carefully, with clear reference to the pumping lemma for regular language, whether 3, 5, 9, or 24 can be a pumping length for $L$. Also, find out, with a detailed analysis, the minimum pumping length for the given language.`,
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 15,
              topic: "dfa",
              prompt: r`Construct a deterministic finite automaton that accepts all and only the binary strings such that none of their runs of 0s have an even length $\ge 2$. A "run" of 0s is a string of consecutive 0s. "00" contains exactly one run of 0s (of length 2). "000010" contains two runs of 0s (one of length 4, the other of length 1). For example, "0001100" is not accepted because the last two characters are an even-length run of 0s. But "01110001" is accepted because the first run of 0s has length 1, and the second run of 0s has length 3. "11111" is also accepted because it contains no run of 0s.

Providing only state diagram will suffice but you need to provide your design ideas.`,
            },
            {
              part: "b",
              marks: 12,
              topic: "closure",
              prompt: r`If $M$ is a deterministic finite automaton (DFA) that recognizes language $L$, swapping the accept and non-accept states in $M$ yields a new DFA that recognizes $\overline{L}$. Does this always work for the nondeterministic finite automaton (NFA) as well? Answer by giving an example.`,
              alsoAsked: ["2021–22 Q1(c)"],
            },
            {
              part: "c",
              marks: 8,
              topic: "intro",
              prompt: r`Discuss in detail why is the Kleene star of a null set an empty string.`,
              alsoAsked: ["2016–17 Q2(c)", "2021–22 Q3(a)"],
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
              prompt: r`Consider the two deterministic finite automaton (DFA) $D_1$ and $D_2$ shown in the following diagrams. We want to construct a DFA $D$ using basic principles which accepts $L(D_1) \cup L(D_2)$.

${fig("b21-4a-given")}

(i) What is $L(D_1)$ in plain English?

(ii) For DFA $D$, draw the start state and two states reachable from the start state.`,
            },
            {
              part: "b",
              marks: 15,
              topic: "nfa",
              prompt: r`Construct a nondeterministic finite automaton (NFA) that accepts all and only the binary strings that begin and end with different symbols, and have odd lengths. Showing only the state diagram for this NFA should suffice.`,
            },
            {
              part: "c",
              marks: 10,
              topic: "regex",
              prompt: r`Which of the regular expressions given below the figure represents the following deterministic finite automaton (DFA)? You need to provide explanations for each of the options as to why that particular option is correct or incorrect. These explanations are mandatory for your selection(s) to be acceptable.

${fig("b21-4c-given")}

A. $0^*1(1+00^*1)^*$

B. $0^*1^*1+11^*0^*1$

C. $(0+1)^*1$`,
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
              prompt: r`Find context-free grammars that generate the following languages: *(8+7)*

(i) The set of all strings of balanced parentheses over the alphabet $\{\,(\,,\,)\,\}$. For example, (()()), ((())), $\varepsilon$ are in the language but ((()), ())), )()( are not in the language.

(ii) $\{w \mid w \text{ contains at least two 1s}\}$ where the alphabet is $\{0,1\}$.`,
              alsoAsked: ["2019–20 Q5 (similar)"],
            },
          ],
        },
        {
          no: 6,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cfg",
              prompt: r`Find a context-free grammar that generates the language
$$
L = \{a^nb^nc^md^m \mid n \ge 1, m \ge 1\} \cup \{a^nb^mc^md^n \mid n \ge 1, m \ge 1\}.
$$
Show that the grammar you designed is ambiguous by giving two different parse trees for some string in the language. *(10+5)*`,
              alsoAsked: ["January 2020 Q6"],
            },
          ],
        },
        {
          no: 7,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "cnf-cyk",
              prompt: r`The following are the productions of a grammar $G$ in Chomsky Normal Form:
$$
\begin{aligned}
S &\to AB \mid AY \mid YA \mid 1\\
A &\to ZA \mid YA \mid 0 \mid 1\\
B &\to YA\\
Z &\to 0\\
Y &\to 1
\end{aligned}
$$
Determine whether 0100 is in $L(G)$ using the CYK algorithm (you need to show the table).`,
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
L = \{a^ib^jc^k \mid i \ge 0, j \ge 0, k \ge 0 \text{ and } (i = j \text{ or } i = k)\}.
$$
Draw its transition diagram. Recall that, PDAs are non-deterministic.`,
              alsoAsked: ["January 2020 Q8", "2013–14 Q1(b) (similar)"],
            },
          ],
        },
        {
          no: 9,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "pumping-cfl",
              prompt: r`State and prove the pumping lemma for context-free languages. You can use the theorem that states that if the yield of a parse tree according to a grammar in Chomsky Normal Form is a terminal string $w$ and the length of the longest path in the tree is $n$, then $|w| \le 2^{n-1}$.`,
            },
          ],
        },
        {
          no: 10,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "tm-techniques",
              prompt: r`Design a Turing machine (TM) that takes as input a number $w$ in binary and computes the logical NOT of the number. The tape initially contains $wc$ where '$c$' is a tape symbol that is used as a separator. Your TM should insert the NOT of the number in binary after the $c$ and then terminate. (You can use multiple tracks and storage in the state if you wish).`,
            },
          ],
        },
        {
          no: 11,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "tm-variants",
              prompt: r`Justify whether the following statements are true or false: *(8+7)*

(i) A deterministic Turing machine can simulate $n$ moves of a conventional computer in $P(n)$ moves, where $P(n)$ is some polynomial in $n$.

(ii) A conventional computer can simulate $n$ moves of a non-deterministic Turing machine in $P(n)$ moves, where $P(n)$ is some polynomial in $n$.`,
              alsoAsked: ["2017–18 Q10 (similar)"],
            },
          ],
        },
        {
          no: 12,
          parts: [
            {
              part: "",
              marks: 15,
              topic: "undecidability",
              prompt: r`What is the Diagonalization language? Devise a proof to show that the Diagonalization language is *not recursively enumerable*. *(5+10)*`,
              alsoAsked: ["2006–07 Q4(a)", "2007–08 Q12"],
            },
          ],
        },
        {
          no: 13,
          parts: [
            {
              part: "i",
              marks: 8,
              topic: "complexity",
              prompt: r`Briefly explain how Cook's theorem shows that all problems in NP are reducible to the *satisfiability* problem in polynomial time.`,
              alsoAsked: ["2023–24 Q13"],
            },
            {
              part: "ii",
              marks: 7,
              topic: "complexity",
              prompt: r`What is the relationship between the classes PSPACE and NPSPACE? Justify your answer.`,
              alsoAsked: ["2023–24 Q12(ii)"],
            },
          ],
        },
      ],
    },
  ],
}

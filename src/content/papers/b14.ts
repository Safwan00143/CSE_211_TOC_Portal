import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB14: Paper = {
  slug: "b14",
  batch: "14 batch",
  course: "CSE 211",
  session: "2015-2016",
  year: 2017,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2015-2016",
  date: "25/01/2017",
  fullMarks: 140,
  time: "3 hours",
  sections: [
    {
      name: "Section A",
      instructions: "There are FOUR questions in this section. Answer any THREE.",
      questions: [
        {
          no: 1,
          stem: r`${fig("b14-1a")}`,
          parts: [
            { part: "a", marks: 8.33, topic: "dfa", prompt: r`Formally define a Finite State Machine (FSM). Formally describe the FSM F1 of Figure 1.a.` },
            { part: "b", marks: 4, topic: "dfa", prompt: r`What language does F1 (Figure 1.a) recognize?` },
            { part: "c", marks: 4, topic: "dfa", prompt: r`Suppose your friend slightly changes $\delta$ of F1 (Figure 1.a) by only adding the transition $\delta(d, 1) = d$. If the resulting FSM is F2, then what language does F2 recognize?` },
            {
              part: "d",
              marks: 4,
              topic: "dfa",
              prompt: r`Another friend of yours slightly changes F1 (Figure 1.a) without changing the number of states and the number of transitions. Now, he calmly claims that the resulting FSM, F3, is such that $|L(F3)| = |L(F1)| + 1$, i.e., the cardinality of the language of F3 increases by exactly 1 (because of the change made on F1). Do you think this is possible? Justify your answer.`,
            },
            {
              part: "e",
              marks: 3,
              topic: "dfa",
              prompt: r`Suppose the cardinality of the language represented by the RE $R_1$ is 5. Now, you have designed a DFA $D_1$ equivalent to $R_1$ and have written a C program implementing $D_1$. Subsequently, you have tested the program against 1000 random different strings and for each of those strings your program returns "Accept" indicating that the DFA accepts that string. Assuming that your C implementation is correct your genius little brother claims that your DFA is wrong. Do you agree with him? Justify your answer.`,
            },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 8.33,
              topic: "dfa",
              prompt: r`Design a DFA, M that takes as input a binary string and recognizes numbers that are NOT divisible by 3. For example, M rejects 1111 (because the corresponding numeric value is 15, which is divisible by 3), M accepts 111 (because the corresponding numeric value is 7, which is not divisible by 3) and so on. You need to discuss your intuition/idea behind the design and explain how it will work. Drawing the DFA only will not guarantee full marks.`,
            },
            { part: "b", marks: 15, topic: "closure", prompt: r`Prove that the class of regular languages is closed under the regular operations.` },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 18,
              topic: "regex",
              prompt: r`Compute DFA and Regular Expressions for the following languages:

(i) $L = \{w \mid w \text{ begins with a 1 and ends with a 0}\}$.

(ii) $L = \{w \mid w \text{ has length at least 3 and its third symbol is a 0}\}$.

(iii) $L = \{w \mid w \text{ contains an even number of 0's or exactly two 1's}\}$.

(iv) $L = \{w \mid w \text{ is any string except 11 and 111}\}$.

(v) $L = \{w \mid w \text{ contains at least 2 0's and at most one 1}\}$.`,
            },
            {
              part: "b",
              marks: 5.33,
              topic: "closure",
              prompt: r`Your teacher has proved that if $M$ is a DFA that recognizes language $B$, swapping the accept and non-accept states in $M$ yields a new DFA recognizing the complement of $B$. Now your genius brother comes up with an example that if $M_1$ is an NFA that recognizes language $C$, swapping the accept and non-accept states in $M_1$ doesn't necessarily yield a new NFA that recognizes the complement of $C$. Can you find such an example?`,
              alsoAsked: ["2022–23 Q3(b)", "2021–22 Q1(c)"],
            },
          ],
        },
        {
          no: 4,
          parts: [
            {
              part: "a",
              marks: 7.33,
              topic: "cfg",
              prompt: r`Consider the following context-free Grammar $G$:
$$
\begin{aligned}
R &\to XRX \mid S\\
S &\to aTb \mid bTa\\
T &\to XTX \mid X \mid \varepsilon\\
X &\to a \mid b
\end{aligned}
$$
Now answer all the following questions: (i) What are the variables of $G$? (ii) What are the terminals of $G$? (iii) Which is the start variable of $G$? (iv) Give three strings in $L(G)$. (v) Give three strings not in $L(G)$. (vi) Give a description of $L(G)$.

(vii) Now, write True or False for the following statements (S1–S9):

S1: $T \Rightarrow aba$. S2: $T \overset{*}{\Rightarrow} aba$. S3: $T \Rightarrow T$. S4: $T \overset{*}{\Rightarrow} T$. S5: $XXX \overset{*}{\Rightarrow} aba$. S6: $X \overset{*}{\Rightarrow} aba$. S7: $T \overset{*}{\Rightarrow} XX$. S8: $T \overset{*}{\Rightarrow} XXX$. S9: $S \overset{*}{\Rightarrow} \varepsilon$.`,
            },
            {
              part: "b",
              marks: 10,
              topic: "cfg",
              prompt: r`Find context free grammars for the following languages:

(i) The set of binary strings containing at least three 1's.

(ii) The set of odd-length binary strings having 0 at the middle.

(iii) The set of binary strings having more 0's than 1's.

(iv) $L = \{w\#x \mid w^R \text{ is a substring of } x \text{ for } w, x \in \{0, 1\}^*\}$.`,
              alsoAsked: ["2016–17 Q5(a)", "2017–18 Q5(b)"],
            },
            { part: "c", marks: 6, topic: "pumping-regular", prompt: r`Use pumping lemma to prove that the languages $A = \{0^n1^n2^n \mid n \ge 0\}$ and $B = \{0^i1^j \mid i > j\}$ are not regular.` },
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
          stem: r`Suppose the PDA $P = (\{q, p\}, \{0, 1\}, \{Z_0, X\}, \delta, q, Z_0, \{p\})$ has the following transition function:

(i) $\delta(q, 0, Z_0) = \{(q, XZ_0)\}$ (ii) $\delta(q, 0, X) = \{(q, XX)\}$ (iii) $\delta(q, 1, X) = \{(q, X)\}$ (iv) $\delta(q, \varepsilon, X) = \{(p, \varepsilon)\}$ (v) $\delta(p, \varepsilon, X) = \{(p, \varepsilon)\}$ (vi) $\delta(p, 1, X) = \{(p, XX)\}$ (vii) $\delta(p, 1, Z_0) = \{(p, \varepsilon)\}$`,
          parts: [
            { part: "a", marks: 8.33, topic: "pda-hmu", prompt: r`Draw the transition diagram for this PDA.` },
            { part: "b", marks: 15, topic: "pda-hmu", prompt: r`For the PDA described in Ques. 5(a), starting from the initial ID $(q, w, Z_0)$, show all the reachable ID's when the input $w$ is: (i) 0011 (ii) 0101 (iii) 1010` },
          ],
        },
        {
          no: 6,
          parts: [
            { part: "a", marks: 13, topic: "pda-hmu", prompt: r`Define a PDA that accepts the language $\{w \in \{a, b\}^* : w \text{ has the same number of } a\text{'s and } b\text{'s}\}$.` },
            {
              part: "b",
              marks: 10.33,
              topic: "pda-hmu",
              prompt: r`Consider a PDA $P_F$ that accepts a language $L$ by final state. Is it always possible to construct another PDA $P_N$ that accepts the same language $L$ by empty stack? If possible, show how the construction is done. Provide definition of both $P_F$ and $P_N$. If it's not possible, justify why.`,
              alsoAsked: ["2019–20 Q10(a)"],
            },
          ],
        },
        {
          no: 7,
          parts: [
            { part: "a", marks: 13, topic: "tm-basics", prompt: r`Design a Turing machine for the language $\{a^nb^nc^n \mid n \ge 1\}$. Also briefly describe its working principle.` },
            {
              part: "b",
              marks: 10.33,
              topic: "undecidability",
              prompt: r`Suppose, you know a particular problem P is undecidable. You want to prove another problem Q is undecidable too. Utilize P and the concept of reduction to prove Q is undecidable.`,
            },
          ],
        },
        {
          no: 8,
          parts: [
            {
              part: "a",
              marks: 13,
              topic: "tm-basics",
              prompt: r`Design a Turing machine that computes the function $a \mathbin{\dot-} b = \max(b - a, 0)$. Initially the tape contains $a$, followed by $b$. Both $a$ and $b$ are represented by consecutive 1's separated by the symbol 0. After computation, the tape will contain only the output $a \mathbin{\dot-} b$, represented by consecutive 1's and surrounded by infinite blanks. Provide brief description of the working principle of your designed Turing machine.`,
              note: "As printed, the function is max(b − a, 0), the reverse of the usual monus m ∸ n = max(m − n, 0). The solution computes it exactly as printed.",
            },
            { part: "b", marks: 10.33, topic: "tm-variants", prompt: r`Describe how multiple tracks and multiple tapes extend the basic Turing machine. Briefly discuss the difference between these extensions.` },
          ],
        },
      ],
    },
  ],
}

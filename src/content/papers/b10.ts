import type { Paper } from "../types"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const paperB10: Paper = {
  slug: "b10",
  batch: "10 batch",
  course: "CSE 211",
  session: "2011-2012",
  year: 2013,
  exam: "L-2/T-2 B. Sc. Engineering Examinations 2011-2012",
  date: "22/07/2013",
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
              marks: 8.33,
              topic: "tm-basics",
              prompt: r`Construct the state transition diagram for a Turing machine to compute the following subtract function: $f(x, y) = x - y$, where $x \ge y$. Assume that the numbers are represented in a modified version of unary number system where each number $N$ is represented by repeating the symbol '1' $N + 1$ times. For example, the number 1 is represented as 11, the number 2 is represented as 111 and the number 0 is represented as 1. The Turing machine should enter the accept state after the computation. We don't care where you leave the head at the end of the computation. Your state diagram does not need to explicitly show the reject state or the transitions into it.`,
              note: "The question does not say how x and y are separated on the tape; the solution assumes the input 1^(x+1) 0 1^(y+1).",
            },
            { part: "b", marks: 7, topic: "tm-techniques", prompt: r`Give the proof idea of the following statement: 'Every Turing machine with multiple tracks in its tape has an equivalent single track Turing machine'.` },
            { part: "c", marks: 8, topic: "undecidability", prompt: r`Briefly explain an encoding technique for Turing machines. With the help of this encoding technique, show that the number of Turing machines is countable. *(6+2)*` },
          ],
        },
        {
          no: 2,
          parts: [
            {
              part: "a",
              marks: 8.33,
              topic: "tm-variants",
              prompt: r`Construct the state transition diagram of a 2-tape Turing machine to decide the following language: $L = \{wcw^R : w \in \{a, b\}^* \text{ and } w^R \text{ is the reverse string of } w\}$. Your state diagram should be as simple as possible and it must use both tapes of the Turing machine. Your state diagram does not need to explicitly show the reject state or the transitions into it.`,
            },
            { part: "b", marks: 8, topic: "tm-variants", prompt: r`Show that a language is recognized by a Turing Machine with a two way infinite tape if and only if it is recognized by a Turing Machine with a one way infinite tape.` },
            {
              part: "c",
              marks: 7,
              topic: "undecidability",
              prompt: r`The halting problem can be described by the following language: $L = \{\langle M,w\rangle : M \text{ is a Turing machine and } M \text{ halts on input string } w\}$. Show that, the language $L$ is Turing-acceptable.`,
              alsoAsked: ["2012–13 Q2(a)"],
            },
          ],
        },
        {
          no: 3,
          parts: [
            {
              part: "a",
              marks: 8.33,
              topic: "tm-basics",
              prompt: r`Give the state diagram of a Turing machine M that does the following on input string '#w' where $w \in \{0, 1\}^*$. Let $n = |w|$ (the length of the string $w$). If $n$ is even, then M converts string #w to the string #0^n (symbol 0 is repeated $n$ times). If $n$ is odd, then M converts #w to the string #1^n. The machine should enter the accept state after the conversion. We don't care where you leave the head at the end of the conversion. However, your state diagram does not need to explicitly show the reject state or the transitions into it.`,
              alsoAsked: ["2012–13 Q3(c)"],
            },
            { part: "b", marks: 8, topic: "undecidability", prompt: r`Prove the following statement: 'The union of two recursively enumerable languages is also recursively enumerable'.` },
            {
              part: "c",
              marks: 7,
              topic: "pda",
              prompt: r`Construct the state diagram of a push down automaton that accepts the following language: $L = \{w : w \in \{a, b\}^* \text{ and length of } w \text{ is odd with middle symbol 'a'}\}$. Example strings in the language $L$ are: aaa, bbabb, baaba, etc.`,
              alsoAsked: ["2012–13 Q4(c)"],
            },
          ],
        },
        {
          no: 4,
          parts: [
            { part: "a", marks: 7, topic: "pda", prompt: r`Construct the state diagram of a push down automaton that recognizes the following language: $L = \{a^ib^jc^k : i + j = k\}$.`, alsoAsked: ["2012–13 Q4(a)"] },
            {
              part: "b",
              marks: 8,
              topic: "pda-hmu",
              prompt: r`Consider the following context free grammar: $\text{CFG} = (V, \Sigma, R, S)$, where $V = \{S, T, X\}$, $\Sigma = \{a, b\}$, the start non-terminal is $S$, and the rules in $R$ are: $S \to aTXb$, $T \to XTS \mid \varepsilon$, $X \to a \mid b$. Convert the CFG to an equivalent push down automata.`,
            },
            {
              part: "c",
              marks: 8.33,
              topic: "undecidability",
              prompt: r`Show that, the following language $L$ is decidable: $L = \{\langle A, B, C\rangle : A, B, C \text{ are DFAs over the same alphabet } \Sigma \text{ and } L(C) = L(A) \cup L(B)\}$.`,
            },
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
            { part: "a", marks: 6, topic: "nfa", prompt: r`Give three differences between DFA and NFA with examples.`, alsoAsked: ["2012–13 Q8(a)"] },
            { part: "b", marks: 12, topic: "closure", prompt: r`Define regular language. Prove that the class of regular languages is closed under the following operations: (i) *star* operation (ii) *concatenation* operation.`, alsoAsked: ["2012–13 Q5(c)"] },
            { part: "c", marks: 5.33, topic: "dfa", prompt: r`Give the state diagram of a DFA that recognizes the following language: $\{w \mid \text{the length of } w \text{ is at most } 5\}$ where $\Sigma = \{0, 1\}$.` },
          ],
        },
        {
          no: 6,
          parts: [
            { part: "a", marks: 13.33, topic: "pumping-regular", prompt: r`Is there any technique to test whether a given language $L$ is regular or not? State and prove it.`, alsoAsked: ["2012–13 Q6(b)"] },
            {
              part: "b",
              marks: 10,
              topic: "pumping-regular",
              prompt: r`Prove that the following languages are not regular: (i) $L_1 = \{www \mid w \in \{0,1\}^*\}$ (ii) $L_2 = \{1^{n^2} \mid n \ge 0\}$`,
              alsoAsked: ["2014–15 Q2(a)"],
            },
          ],
        },
        {
          no: 7,
          parts: [
            { part: "a", marks: 8, topic: "regex", prompt: r`Construct an NFA that recognizes the language $(01 \cup 001 \cup 010)^*$.` },
            { part: "b", marks: 8, topic: "nfa", prompt: r`Convert the NFA derived in 7(a) into an equivalent DFA. Give the state diagram of this DFA with only states reachable from the start-state.` },
            {
              part: "c",
              marks: 7.33,
              topic: "regex",
              prompt: r`The state diagram of a finite automaton is given below. Derive the regular expression for it.

${fig("b10-7c")}`,
            },
          ],
        },
        {
          no: 8,
          parts: [
            { part: "a", marks: 6, topic: "cfg", prompt: r`Formally define context-free grammar. What is ambiguous grammar? Give an example.` },
            {
              part: "b",
              marks: 10,
              topic: "cfg",
              prompt: r`Design a context-free grammar for each of the following languages: (i) $\{0^n1^n \cup 1^n0^n \mid n \ge 0\}$ (ii) $\{w \mid w \in \{0, 1\}^* \text{ and } w \text{ contains at least three 1's}\}$`,
            },
            {
              part: "c",
              marks: 7.33,
              topic: "cfg",
              prompt: r`The set of rules $R$ of a context-free grammar $(\{E, T, F\}, \{a, b, +, *, (, )\}, R, E)$ is given below:
$$
\begin{aligned}
E &\to E+T \mid T\\
T &\to E*F \mid F\\
F &\to (E) \mid a \mid b
\end{aligned}
$$
Show the steps of derivation of the expression ((a+b)*b). Also, show the parse-tree for it.`,
              note: "The rule T → E*F is printed as is; the usual expression grammar has T → T*F. The derivation below uses the rule as printed (the same steps work with T → T*F after one extra T ⇒ ... step).",
            },
          ],
        },
      ],
    },
  ],
}

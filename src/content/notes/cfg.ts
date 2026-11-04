import { derivation } from "@/lib/derivations"
import { gExpr } from "../machines/notes-cfg"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

export const cfgNote = r`
## From recognising to generating

A finite automaton asks: *is this string accepted?* A grammar asks: *how could this string be built?* The generator view suits anything with recursive structure: nested brackets ([]{()}), nested calls (encrypt(hash(msg))), mirrored data (101#101). In each, a large valid object contains smaller valid objects.

Properly nested parentheses ($\varepsilon$, (), ()(), (()), (()()), …) are captured by three construction rules:
$$
S\to SS\mid(S)\mid\varepsilon.
$$
The empty string is balanced; wrapping a balanced string keeps it balanced; concatenating two balanced strings keeps them balanced. A derivation of (()()):
$$
\begin{aligned}
S &\Rightarrow (S) \Rightarrow (SS) \Rightarrow ((S)S) \Rightarrow (()S) \Rightarrow (()(S)) \Rightarrow (()()).
\end{aligned}
$$
A grammar has finitely many rules, but recursion lets them be reused without limit.

## Formal definition

A **context-free grammar** is a 4-tuple $G=(V,\Sigma,R,S)$ where

- $V$ is a finite set of **variables** (nonterminals),
- $\Sigma$ is a finite set of **terminals**, disjoint from $V$,
- $R$ is a finite set of **productions** (rules), each of the form $A\to\alpha$ with $A\in V$ and $\alpha\in(V\cup\Sigma)^*$,
- $S\in V$ is the **start variable**.

Variables are placeholders for pieces not yet expanded ($S$, $E$, $T$, $F$, ⟨Stmt⟩); terminals are the symbols of the final string (0, 1, +, (, if). Unless stated otherwise, the head of the first rule is the start variable.

**Example.** Mixed brackets: $S\to SS\mid(S)\mid[S]\mid\{S\}\mid\varepsilon$ is $G=(\{S\},\{(,),[,],\{,\}\},R,S)$ with the five rules in $R$.

### Why "context-free"?

A rule $A\to\alpha$ may replace **any** occurrence of $A$, whatever symbols surround it. The replacement does not depend on the context. In a **context-sensitive** grammar a rule can look like $xAy\to x\alpha y$: $A$ may be rewritten only when it sits between $x$ and $y$. For example, $aB\to ab$ would let $B$ become b only right after an a. Context-free rules have a single variable on the left and nothing else, which is exactly what makes parse trees and the pumping lemma for CFLs work.

## Derivations and the language of a grammar

A **sentential form** is any string of variables and terminals that can appear during a derivation. One step $uAv\Rightarrow u\alpha v$ applies a rule $A\to\alpha$. $\overset{*}{\Rightarrow}$ means zero or more steps.

With $S\to0S1\mid\#$: $S\Rightarrow0S1\Rightarrow00S11\Rightarrow00\#11$.

The **language** of $G$ is
$$
L(G)=\{w\in\Sigma^* \mid S\overset{*}{\Rightarrow}w\}.
$$
A language is **context-free** if some CFG generates it. A grammar is a description; its language is the set of strings it describes.

### Leftmost and rightmost derivations

When a sentential form has several variables we may choose which to expand.

- **Leftmost derivation** ($\underset{lm}{\Rightarrow}$): always replace the leftmost variable.
- **Rightmost derivation** ($\underset{rm}{\Rightarrow}$): always replace the rightmost variable.

With $E\to E+T\mid T$, $T\to T*F\mid F$, $F\to(E)\mid a$, a leftmost derivation of a+a*a:
${derivation(gExpr, "a+a*a", "lm")}
and a rightmost derivation:
${derivation(gExpr, "a+a*a", "rm")}
The expansion order changed; the structure did not. In both, a*a is built inside one $T$.

## Parse trees

A derivation is a sequence, but what it builds is a tree. A **parse tree** for $G=(V,\Sigma,R,S)$:

1. The root is labelled $S$ (or the variable whose derivation we show).
2. Every internal node is labelled by a variable.
3. Every leaf is labelled by a terminal or by $\varepsilon$.
4. If a node labelled $A$ has children $X_1,X_2,\dots,X_k$ from left to right, then $A\to X_1X_2\cdots X_k$ is a rule. A node using $A\to\varepsilon$ has a single child $\varepsilon$.

The **yield** of a parse tree is its leaves read left to right, ignoring $\varepsilon$.

${fig("cfg-tree-nested")}

${fig("cfg-tree-mirror")}

**Derivations and parse trees are equivalent.** For a variable $A$ and terminal string $w$, these are equivalent:

1. $A\overset{*}{\Rightarrow}w$;
2. $A\underset{lm}{\overset{*}{\Rightarrow}}w$;
3. $A\underset{rm}{\overset{*}{\Rightarrow}}w$;
4. there is a parse tree with root $A$ and yield $w$.

Each parse tree corresponds to exactly one leftmost derivation (expand the leftmost unexpanded node each time) and exactly one rightmost derivation. Proofs are by induction on derivation length or tree height.

### Recursive inference versus derivation

The two directions of reasoning about a CFG (HMU, Section 5.1):

| | Recursive inference | Derivation |
|---|---|---|
| Direction | bottom-up, from the body to the head | top-down, from the head to the body |
| Starts from | terminal strings known to be in some variable's language | the start variable |
| Step | if $A\to X_1\cdots X_k$ and each $X_i$ derives $w_i$, conclude $w_1\cdots w_k$ is in $A$'s language | replace a variable by a rule body |
| Ends with | "$w$ is in the language of $S$" | the terminal string $w$ |
| Algorithm that uses it | CYK (bottom-up parsing) | top-down parsing |

Both establish the same facts: $w$ is inferred to be in $A$'s language exactly when $A\overset{*}{\Rightarrow}w$, exactly when some parse tree with root $A$ yields $w$. They differ only in the order the tree is built.

## Designing CFGs

**Checklist.**

1. What is the smallest valid string?
2. How is a larger valid string built from smaller ones?
3. Is there a natural first/last pair to generate together (wrapping)?
4. Is the language a union of simpler languages?
5. Is part of it regular?
6. Which variables stand for meaningful syntactic categories?
7. Why can no invalid string be generated?

### Balanced mixed brackets

$S\to SS\mid(S)\mid[S]\mid\{S\}\mid\varepsilon$. Derivation of []{()}: $S\Rightarrow SS\Rightarrow[S]S\Rightarrow[]S\Rightarrow[]\{S\}\Rightarrow[]\{(S)\}\Rightarrow[]\{()\}$.

**Soundness:** every rule preserves proper nesting. **Completeness:** every nonempty balanced string is either one bracket pair around a balanced inside, or a concatenation of two shorter balanced strings. ([)] cannot be generated, because each opening bracket is closed by its own wrapping rule.

### Equal numbers of 0's and 1's, any order

$$
S\to0S1S\mid1S0S\mid\varepsilon.
$$
Each nonempty rule adds one 0 and one 1, so every generated string is balanced. Derivation of 0101: $S\Rightarrow0S1S\Rightarrow01S\Rightarrow010S1S\Rightarrow0101S\Rightarrow0101$.

**Completeness.** Let $w$ be nonempty with equal counts, starting with 0. Scan until the first prefix with equal counts; it must end with a 1. So $w=0x1y$ where $x$ (between them) and $y$ (the rest) both have equal counts and are shorter, and $S\to0S1S$ builds $w$ by induction. A string starting with 1 uses $S\to1S0S$.

### Mirrored packets and palindromes

$\{w\#w^R\}$: $S\to0S0\mid1S1\mid\#$. Choose the middle marker, then wrap equal symbols around it.

All palindromes over $\{0,1\}$:
$$
P\to0P0\mid1P1\mid0\mid1\mid\varepsilon.
$$
$\varepsilon$ ends an even palindrome; 0 or 1 ends an odd one. For **even** palindromes only, drop $0\mid1$; with alphabet $\{0,1,a\}$, add $aPa$.

**Proof that the palindrome grammar is correct** (HMU, Theorem 5.1). *Every palindrome is generated*, by induction on $|w|$: if $|w|\le1$, use $P\to\varepsilon$, $0$ or $1$. If $|w|\ge2$, $w$ begins and ends with the same symbol, $w=0x0$ or $1x1$, and $x$ is a shorter palindrome, so $P\Rightarrow0P0\overset{*}{\Rightarrow}0x0$. *Every generated string is a palindrome*, by induction on derivation length: a one-step derivation gives $\varepsilon$, 0 or 1. A longer one starts $P\Rightarrow0P0$ (or $1P1$) and the inner $P$ derives a palindrome $x$ in fewer steps, so $0x0$ is a palindrome.

### Two independent matching layers

$\{a^nb^mc^md^n \mid n,m\ge0\}$:
$$
S\to aSd\mid T,\qquad T\to bTc\mid\varepsilon.
$$
The outer recursion matches a's with d's; the inner one matches b's with c's. Derivation of $a^2b^3c^3d^2$: $S\Rightarrow aSd\Rightarrow aaSdd\Rightarrow aaTdd\Rightarrow aabTcdd\Rightarrow aabbTccdd\Rightarrow aabbbTcccdd\Rightarrow aabbbcccdd$.

Use one variable per independent obligation, and nest them when one equality sits inside another.

### One of two equalities: a union

$\{a^ib^jc^k \mid i=j \text{ or } j=k\}$:
$$
\begin{aligned}
S&\to S_1\mid S_2\\
S_1&\to AC, & A&\to aAb\mid\varepsilon, & C&\to cC\mid\varepsilon \quad(i=j)\\
S_2&\to DB, & D&\to aD\mid\varepsilon, & B&\to bBc\mid\varepsilon \quad(j=k)
\end{aligned}
$$
This grammar is ambiguous: a string with $i=j=k$ (such as abc) has a tree through each branch.

### Unequal numbers of 0's and 1's

$$
\begin{aligned}
U&\to A\mid B\\
A&\to E0E\mid E0A\quad(\text{more 0's})\\
B&\to E1E\mid E1B\quad(\text{more 1's})\\
E&\to0E1E\mid1E0E\mid\varepsilon\quad(\text{equal})
\end{aligned}
$$
For 0010: $U\Rightarrow A\Rightarrow E0A\Rightarrow0A\Rightarrow0E0E\Rightarrow00E\Rightarrow001E0E\Rightarrow0010E\Rightarrow0010$.

### Syntactic categories

Binary trees in prefix form: $T\to x\mid n(T,T)$ gives x, n(x,x), n(n(x,x),x), ….

A tiny query language, generating select(name,where(age>18)):
$$
\begin{aligned}
Q&\to \text{select}(F,W), & F&\to\text{name}\mid\text{age}\mid\text{dept}, & W&\to\text{all}\mid\text{where}(P),\\
P&\to F\,O\,V, & O&\to\ >\ \mid\ =\ \mid\ <, & V&\to 18\mid30\mid\text{cse}.
\end{aligned}
$$
Variables often stand for syntactic categories rather than counters.

### From a DFA to a CFG: every regular language is context-free

${fig("cfg-dfa101")}

**Construction.** Given a DFA $M=(Q,\Sigma,\delta,q_0,F)$:

1. make one variable $R_q$ for each state $q$, with $R_{q_0}$ as the start variable;
2. for every transition $\delta(q,a)=r$, add $R_q\to aR_r$;
3. for every accepting state $q\in F$, add $R_q\to\varepsilon$.

For the 101 DFA:
$$
\begin{aligned}
R_0&\to0R_0\mid1R_1, & R_1&\to1R_1\mid0R_2,\\
R_2&\to0R_0\mid1R_3, & R_3&\to0R_3\mid1R_3\mid\varepsilon.
\end{aligned}
$$
$R_{q_0}\overset{*}{\Rightarrow}wR_q$ exactly when the DFA reaches $q$ after reading $w$, so $R_{q_0}\overset{*}{\Rightarrow}w$ exactly when it reaches an accepting state. Hence $L(G)=L(M)$, and **every regular language is context-free**.

### A tempting non-example

For $\{ww \mid w\in\{0,1\}^*\}$, students often write $S\to0S0\mid1S1\mid\varepsilon$. That generates $\{ww^R\}$, the mirror, not the copy. Wrapping remembers the first half in reverse, which is exactly why a stack handles mirrors but not copies. ($\{ww\}$ is not context-free at all.)

### Design patterns

| Pattern | Typical rule form |
|---|---|
| Wrapping | $S\to aSb$ |
| Concatenation | $S\to SS$ or $S\to AB$ |
| Optional structure | $A\to\alpha\mid\varepsilon$ |
| Union of cases | $S\to S_1\mid S_2$ |
| Regular part | DFA states become variables |
| Syntactic categories | one variable per category |

## Ambiguity

A string $w$ is **derived ambiguously** in $G$ if it has two or more different parse trees, equivalently two or more different leftmost derivations, or two or more different rightmost derivations. $G$ is **ambiguous** if it derives at least one string ambiguously.

Two different derivations alone do **not** show ambiguity: a leftmost and a rightmost derivation of the same tree are different sequences. Count parse trees, or leftmost derivations.

Ambiguity belongs to the grammar, not the language: the same language may have both ambiguous and unambiguous grammars.

### The expression grammar

$E\to E+E\mid E*E\mid(E)\mid a$ treats + and * as equals, so a+a*a has two trees:

${fig("cfg-amb-expr")}

**Removing the ambiguity** with precedence levels: $F$ (factor) cannot be split by an operator, $T$ (term) is a product of factors, $E$ (expression) is a sum of terms.
$$
E\to E+T\mid T,\qquad T\to T*F\mid F,\qquad F\to(E)\mid a.
$$
Now * is forced below +, so a+a*a can only mean a+(a*a). Left recursion ($E\to E+T$) also makes + and * group to the left.

${fig("cfg-tree-expr")}

### Dangling else

$S\to\text{if } E \text{ then } S\mid\text{if } E \text{ then } S \text{ else } S\mid\text{other}$. The string *if E then if E then other else other* has two trees:

${fig("cfg-amb-if")}

**Repair:** separate matched statements (every if has its else) from unmatched ones.
$$
\begin{aligned}
S&\to M\mid U\\
M&\to\text{other}\mid\text{if } E \text{ then } M \text{ else } M\\
U&\to\text{if } E \text{ then } S\mid\text{if } E \text{ then } M \text{ else } U
\end{aligned}
$$
This encodes the usual convention: every else attaches to the nearest unmatched if.

### Structural ambiguity in balanced parentheses

$S\to SS\mid(S)\mid\varepsilon$ generates the right language but is ambiguous, because concatenation can be grouped in different ways:

${fig("cfg-amb-balanced")}

($S\to(S)S\mid\varepsilon$ generates the same language unambiguously: the first symbol's matching bracket fixes the split.)

### Inherent ambiguity

A context-free language is **inherently ambiguous** if **every** CFG for it is ambiguous. The standard example:
$$
L=\{a^nb^nc^md^m \mid n,m\ge1\}\cup\{a^nb^mc^md^n \mid n,m\ge1\}.
$$
A grammar for it:
$$
\begin{aligned}
S&\to AB\mid C, & A&\to aAb\mid ab, & B&\to cBd\mid cd,\\
C&\to aCd\mid aDd, & D&\to bDc\mid bc.
\end{aligned}
$$
$A B$ matches a with b and c with d; $C$ matches a with d and b with c.

${fig("cfg-inherent")}

**Why every grammar is ambiguous** (the idea; the full proof is in HMU Section 5.4.4). Strings $a^nb^nc^nd^n$ lie in both halves. Any grammar must generate the first half by matching a's with b's (and c's with d's), and the second half by matching a's with d's (and b's with c's). For $a^nb^nc^nd^n$ with $n$ large, a grammar can be shown to produce both kinds of tree, so some such strings always have two parse trees.

**Ambiguous grammar versus inherently ambiguous language:**

- If one string of the grammar has two parse trees, the grammar is ambiguous, even if all other strings have one tree.
- If every string has exactly one parse tree, the grammar is unambiguous; the language may still have other, ambiguous grammars.
- A language is inherently ambiguous only if no unambiguous grammar exists at all.

## Where the next topics go

Grammars can also be simplified (removing useless symbols, ε-productions and unit productions), put into Chomsky normal form, and tested for membership with the CYK algorithm: Atif Sir's part covers these. Some languages, such as $\{a^nb^nc^n\}$, have no CFG at all: the next topic proves this with the pumping lemma for context-free languages.
`

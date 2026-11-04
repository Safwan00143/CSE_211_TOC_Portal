import { pdaAcceptingTrace, pdaTraceTex, type CFG, type PdaHmu } from "@/lib/automata"
import { gExprAmbI, parenCfg, pdaEqualAb, pdaExpr, pdaParen, pdaWwr } from "../machines/notes-pda-hmu"

const r = String.raw
const fig = (...ids: string[]) => "```fig\n" + ids.join("\n") + "\n```"

const tex = (q: string) => q.replace(/^([a-z])_?(\d+|f)$/, "$1_{$2}")
const trace = (m: PdaHmu, w: string, bound?: (left: number) => number) => {
  const t = pdaAcceptingTrace(m, w, bound)
  if (!t) throw new Error(`${w} not accepted`)
  return pdaTraceTex(t, tex)
}
/** "[q0Z0q1]" → "[q_0Z_0q_1]" and terminals escaped, for the PDA-to-CFG grammar. */
const tripleTex = (g: CFG) => {
  const sym = (s: string) => (s.startsWith("[") ? s.replace(/q(\d)/g, "q_$1").replace(/Z0/g, "Z_0") : s)
  const lines = Object.entries(g.rules)
    .filter(([, bs]) => bs.length)
    .map(([A, bs]) => `${sym(A)} &\\to ${bs.map((b) => (b.length ? b.map(sym).join("\\,") : "\\varepsilon")).join(" \\mid ")}`)
  return `$$\n\\begin{aligned}\n${lines.join(" \\\\\n")}\n\\end{aligned}\n$$`
}
const exprRules = Object.entries(gExprAmbI.rules)
  .map(([A, bs]) => `${A}\\to ${bs.map((b) => b.join("")).join("\\mid ")}`)
  .join(",\\quad ")

export const pdaHmuNote = r`
## The PDA in HMU form

Atif Sir follows Hopcroft, Motwani and Ullman. A **pushdown automaton** is an ε-NFA with a stack: it reads input one symbol at a time (or makes a spontaneous ε-move), looks at the **top** of the stack, and in one transition

1. consumes the input symbol it uses (nothing, if the move is on $\varepsilon$),
2. goes to a new state (possibly the same one),
3. **replaces the top stack symbol by any string**: $\varepsilon$ is a pop, the same symbol leaves the stack unchanged, another single symbol changes the top, and two or more symbols push.

Unlike a general computer, it accesses its memory only last-in-first-out, so some languages a program can recognise, such as $\{0^n1^n2^n \mid n\ge1\}$, are beyond any PDA. PDAs recognise **exactly** the context-free languages.

## Formal definition

$$
P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)
$$

- $Q$: finite set of states;
- $\Sigma$: finite set of input symbols;
- $\Gamma$: finite stack alphabet, the symbols allowed on the stack;
- $\delta$: transition function. $\delta(q,a,X)$, with $q\in Q$, $a\in\Sigma$ or $a=\varepsilon$, and $X\in\Gamma$, is a finite set of pairs $(p,\gamma)$: the new state $p$ and the string $\gamma$ that **replaces** $X$ on top of the stack;
- $q_0$: start state;
- $Z_0\in\Gamma$: **start symbol**. Initially the stack holds exactly one $Z_0$;
- $F\subseteq Q$: accepting (final) states.

If $\gamma=\varepsilon$ the stack is popped; if $\gamma=X$ it is unchanged; if $\gamma=YZ$ then $X$ is replaced by $Z$ and $Y$ is pushed on top.

**Differences from Hakim Sir's (Sipser's) form.** HMU always reads exactly one top symbol $X$ (there is no "pop nothing") and replaces it by a whole string $\gamma$, and the stack starts with $Z_0$. Sipser's 6-tuple pops at most one symbol, pushes at most one, and starts with an empty stack. The two models recognise the same languages.

**No mixing and matching.** If $\delta(q,a,X)=\{(p,YZ),(r,\varepsilon)\}$, a move must take one pair whole: go to $p$ and replace $X$ by $YZ$, **or** go to $r$ and pop. It cannot go to $p$ and pop.

## Example: even-length palindromes

$L_{wwr}=\{ww^R \mid w\in(0+1)^*\}$, the even-length palindromes. Plan:

1. In $q_0$ ("middle not yet seen") read symbols and push a copy of each.
2. At any time, guess that the middle has been reached and move to $q_1$ on ε, leaving the stack alone. Being nondeterministic, the PDA also keeps the other guess (staying in $q_0$).
3. In $q_1$ compare each input symbol with the top: if they match, pop; if not, this branch dies.
4. When $Z_0$ is exposed in $q_1$, the input read so far is $ww^R$: move to $q_2$ and accept.

$P=(\{q_0,q_1,q_2\},\{0,1\},\{0,1,Z_0\},\delta,q_0,Z_0,\{q_2\})$ with

1. $\delta(q_0,0,Z_0)=\{(q_0,0Z_0)\}$ and $\delta(q_0,1,Z_0)=\{(q_0,1Z_0)\}$: push the first symbol, keeping $Z_0$ below.
2. $\delta(q_0,0,0)=\{(q_0,00)\}$, $\delta(q_0,0,1)=\{(q_0,01)\}$, $\delta(q_0,1,0)=\{(q_0,10)\}$, $\delta(q_0,1,1)=\{(q_0,11)\}$: keep pushing.
3. $\delta(q_0,\varepsilon,Z_0)=\{(q_1,Z_0)\}$, $\delta(q_0,\varepsilon,0)=\{(q_1,0)\}$, $\delta(q_0,\varepsilon,1)=\{(q_1,1)\}$: guess the middle, stack untouched.
4. $\delta(q_1,0,0)=\{(q_1,\varepsilon)\}$, $\delta(q_1,1,1)=\{(q_1,\varepsilon)\}$: match and pop.
5. $\delta(q_1,\varepsilon,Z_0)=\{(q_2,Z_0)\}$: bottom reached, accept.

$Z_0$ is needed so that after popping all of $w$ there is still something on the stack to allow the move to $q_2$.

**Diagram notation.** States are nodes, an arrow marks the start, accepting states are double circles, and an arc from $q$ to $p$ labelled $a,X/\gamma$ means $(p,\gamma)\in\delta(q,a,X)$. The diagram does not show which symbol is the start symbol; by convention it is $Z_0$.

${fig("hmu-wwr")}

## Instantaneous descriptions

A PDA's configuration needs the state, the stack and the remaining input. An **instantaneous description** (ID) is a triple $(q,w,\gamma)$: state $q$, remaining input $w$, stack contents $\gamma$ **with the top at the left**.

**The move relation $\vdash$.** If $(p,\alpha)\in\delta(q,a,X)$, then for all strings $w$ and $\beta$:
$$
(q,aw,X\beta)\vdash(p,w,\alpha\beta).
$$
Consuming $a$ (which may be $\varepsilon$) and replacing the top $X$ by $\alpha$ takes $q$ to $p$; the rest of the input $w$ and the rest of the stack $\beta$ are carried along. $\overset{*}{\vdash}$ means zero or more moves.

**On input 1111** the PDA for $L_{wwr}$ starts in $(q_0,1111,Z_0)$ and can guess wrongly many times: guessing the middle at once leads to $(q_2,1111,Z_0)$, which is not accepting because input remains; guessing after one 1 dies when the input cannot be matched. The correct guess, after two 1's:
${trace(pdaWwr, "1111")}

**Three principles about IDs** (data the PDA never looks at cannot affect it):

1. If a computation is legal, adding the same string to the **end of the input** in every ID gives a legal computation.
2. Adding the same stack symbols **below the stack** in every ID gives a legal computation.
3. If some tail of the input is never consumed, removing that tail from every ID gives a legal computation.

**IDs for finite automata?** An FA's ID would be $(q,w)$, but it adds nothing: $\hat\delta(q,w)=p$ iff $(q,wx)\overset{*}{\vdash}(p,x)$ for all $x$.

## Worked PDAs

### Balanced parentheses

Push every (; on ) pop the matching (; when only $Z_0$ is left the prefix is balanced.

$P=(\{q_0,q_1\},\{(,)\},\{(,Z_0\},\delta,q_0,Z_0,\{q_1\})$ with

- $\delta(q_0,(,Z_0)=\{(q_0,(Z_0)\}$: first ( (or after a perfectly matched prefix),
- $\delta(q_0,(,()=\{(q_0,((\}$: store another (,
- $\delta(q_0,),()=\{(q_0,\varepsilon)\}$: a left–right match,
- $\delta(q_0,\varepsilon,Z_0)=\{(q_1,Z_0)\}$: accept.

${fig("hmu-paren")}

${trace(pdaParen, "(()(()))")}

For ()) the PDA reaches $(q_0,),Z_0)$ with no move on ) and $Z_0$, so it rejects; )()( has no move at all from the start.

### Equal numbers of a's and b's

$P=(\{q,f\},\{a,b\},\{a,b,Z_0\},\delta,q,Z_0,\{f\})$ keeps either a stack of a's (excess a's) or a stack of b's (excess b's), with $Z_0$ at the bottom:

1. $\delta(q,a,Z_0)=(q,aZ_0)$, 2. $\delta(q,a,a)=(q,aa)$, 3. $\delta(q,a,b)=(q,\varepsilon)$,
4. $\delta(q,b,Z_0)=(q,bZ_0)$, 5. $\delta(q,b,b)=(q,bb)$, 6. $\delta(q,b,a)=(q,\varepsilon)$,
7. $\delta(q,\varepsilon,Z_0)=(f,Z_0)$.

${fig("hmu-equal-ab")}

${trace(pdaEqualAb, "abbaba")}

## Two ways to accept

Let $P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)$.

**By final state:**
$$
L(P)=\{w \mid (q_0,w,Z_0)\overset{*}{\vdash}(q,\varepsilon,\alpha) \text{ for some } q\in F \text{ and any } \alpha\}.
$$
**By empty stack:**
$$
N(P)=\{w \mid (q_0,w,Z_0)\overset{*}{\vdash}(q,\varepsilon,\varepsilon) \text{ for some } q\}.
$$
For $N(P)$ the accepting states do not matter and $F$ may be omitted.

> **Theorem.** $L$ has a PDA accepting it by final state if and only if $L$ has a PDA accepting it by empty stack.

### From empty stack to final state

Given $P_N=(Q,\Sigma,\Gamma,\delta_N,q_0,Z_0)$, build $P_F$:

1. Add a new bottom marker $X_0\notin\Gamma$, which is $P_F$'s start symbol.
2. Add a new start state $p_0$ whose only move is $\delta_F(p_0,\varepsilon,X_0)=\{(q_0,Z_0X_0)\}$: push $Z_0$ and enter $q_0$.
3. Keep all of $\delta_N$.
4. Add a new accepting state $p_f$ and, for **every** state $q$, $\delta_F(q,\varepsilon,X_0)=\{(p_f,\varepsilon)\}$.

$X_0$ is exposed exactly when $P_N$ would have emptied its stack, so $P_F$ reaches $p_f$ exactly then. Applied to the parenthesis PDA after changing its last move to $\delta(q_0,\varepsilon,Z_0)=\{(q_1,\varepsilon)\}$ (so it accepts by empty stack):

${fig("hmu-empty-to-final")}

### From final state to empty stack

Given $P_F=(Q,\Sigma,\Gamma,\delta_F,q_0,Z_0,F)$, build $P_N$:

1. Add a new bottom marker $X_0$ and a new start state $p_0$ with $\delta_N(p_0,\varepsilon,X_0)=\{(q_0,Z_0X_0)\}$. **Why?** $P_F$ might empty its own stack by accident without being in an accepting state; $X_0$ underneath stops that from counting as acceptance.
2. Keep all of $\delta_F$.
3. From every accepting state $q\in F$, for every stack symbol $Y\in\Gamma\cup\{X_0\}$, add $\delta_N(q,\varepsilon,Y)\ni(p,\varepsilon)$: move to a new draining state $p$.
4. In $p$, pop everything: $\delta_N(p,\varepsilon,Y)=\{(p,\varepsilon)\}$ for every $Y\in\Gamma\cup\{X_0\}$.

${fig("hmu-final-to-empty")}

## PDAs and grammars are equivalent

The following three classes are the same:

1. the context-free languages (defined by CFGs),
2. the languages accepted by final state by some PDA,
3. the languages accepted by empty stack by some PDA.

### From a grammar to a PDA (empty stack)

**Idea.** The PDA simulates **leftmost derivations**. Consider a left-sentential form $xA\alpha$: $x$ is the terminal prefix already matched with the input, $A$ the leftmost variable, $\alpha$ the rest. The PDA keeps $A\alpha$ on its stack. In ID $(q,y,A\alpha)$ it guesses a production $A\to\beta$ and moves to $(q,y,\beta\alpha)$. When a terminal is on top, it must match the next input symbol.

**Construction.** For $G=(V,T,P,S)$, let $P=(\{q\},T,V\cup T,\delta,q,S)$ with

1. for each variable $A$: $\delta(q,\varepsilon,A)=\{(q,\beta) \mid A\to\beta \text{ is a production of } G\}$;
2. for each terminal $a$: $\delta(q,a,a)=\{(q,\varepsilon)\}$.

> **Theorem.** If $P$ is constructed from $G$ this way, then $N(P)=L(G)$.

**Example.** The grammar $${exprRules}$ gives the one-state PDA:

${fig("hmu-expr-pda")}

On a+a*b the PDA follows a leftmost derivation: each ε-move expands the variable on top, each matching move consumes an input symbol. One accepting sequence of IDs:
${trace(pdaExpr, "a+a*b", (left) => left + 1)}

### From a PDA (empty stack) to a grammar

Atif Sir states the theorem and skips the proof: if $P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0)$, there is a CFG $G$ with $L(G)=N(P)$. The construction (HMU, Section 6.3.2):

**Variables.** The start symbol $S$, and every triple $[pXq]$ with $p,q\in Q$, $X\in\Gamma$. $[pXq]$ stands for the event "starting in $p$ with $X$ on top, $P$ eventually has a **net popping** of $X$ and ends in state $q$", and generates exactly the input consumed during that event.

**Productions.**

1. For every state $p$: $S\to[q_0Z_0p]$.
2. If $\delta(q,a,X)$ contains $(r,Y_1Y_2\cdots Y_k)$ (where $a\in\Sigma$ or $a=\varepsilon$, and $k$ may be 0), then **for every list of states $r_1,\dots,r_k$**:
$$
[qXr_k]\to a\,[rY_1r_1][r_1Y_2r_2]\cdots[r_{k-1}Y_kr_k].
$$
When $k=0$ the rule is $[qXr]\to a$.

The middle states $r_1,\dots,r_{k-1}$ are guesses of where the PDA is when each $Y_i$ has finally been popped.

**Example.** Atif Sir's parenthesis PDA with the last move changed to empty the stack:
$\delta(q_0,(,Z_0)=\{(q_0,(Z_0)\}$, $\delta(q_0,(,()=\{(q_0,((\}$, $\delta(q_0,),()=\{(q_0,\varepsilon)\}$, $\delta(q_0,\varepsilon,Z_0)=\{(q_1,\varepsilon)\}$.

The rules start
$$
S\to[q_0Z_0q_0]\mid[q_0Z_0q_1],\quad [q_0Z_0q_1]\to(\,[q_0(q_0][q_0Z_0q_1]\ \mid\ (\,[q_0(q_1][q_1Z_0q_1],\ \dots
$$
Generating every rule and removing useless variables leaves
${tripleTex(parenCfg.trimmed)}
which generates exactly the balanced strings (checked by machine on all strings up to length 10). For example, ()() comes from $S\Rightarrow[q_0Z_0q_1]\Rightarrow([q_0(q_0][q_0Z_0q_1]\Rightarrow()[q_0Z_0q_1]\Rightarrow\cdots\Rightarrow()()$.

## Deterministic PDAs

$P=(Q,\Sigma,\Gamma,\delta,q_0,Z_0,F)$ is **deterministic** (a DPDA) if

1. $\delta(q,a,X)$ has **at most one** member for every $q\in Q$, $a\in\Sigma$ or $a=\varepsilon$, and $X\in\Gamma$; and
2. if $\delta(q,a,X)$ is nonempty for some $a\in\Sigma$, then $\delta(q,\varepsilon,X)$ is empty.

That is, at most one choice at every step.

**What DPDAs accept.**

- By **empty stack**, a DPDA's languages have the **prefix property**: no two different strings $x$, $y$ in $L$ with one a prefix of the other. This is quite limiting.
- By **final state**, DPDAs accept the **deterministic context-free languages** (DCFLs). These properly include the regular languages and are properly included in the CFLs.
- Every DCFL has an unambiguous grammar. (But the DCFLs are not exactly the CFLs that lack inherent ambiguity.)
- $L_{wwr}$ is a CFL with **no** DPDA: without a marker the middle must be guessed. With a centre marker, $L_{wcwr}=\{wcw^R \mid w\in(0+1)^*\}$ has a DPDA: push until c, then pop and match.

**Example DPDA for $wcw^R$.** $\delta(q_0,a,X)=\{(q_0,aX)\}$ for $a\in\{0,1\}$ and every $X$; $\delta(q_0,c,X)=\{(q_1,X)\}$; $\delta(q_1,0,0)=\delta(q_1,1,1)=\{(q_1,\varepsilon)\}$; $\delta(q_1,\varepsilon,Z_0)=\{(q_2,Z_0)\}$, accepting in $q_2$. Every situation has at most one move, and no state has both an ε-move and an input move on the same top.

**LR($k$) grammars**, used by parser generators in compilers, generate exactly the DPDA languages. LR($k$) means Left-to-right input, Rightmost derivation (in reverse), $k$ symbols of lookahead: the parser can decide which production to reduce by looking ahead $k$ symbols.

## Beyond context-free: the Chomsky hierarchy

- **Context-free** rules: $A\to\alpha$, one variable on the left.
- **Context-sensitive** rules: $\alpha A\beta\to\alpha\gamma\beta$, where $A$ may be rewritten only in the context $\alpha\_\beta$ ($\alpha$ and $\beta$ may be empty).
- **Unrestricted** grammars generate exactly the languages recognised by Turing machines (recursively enumerable, or Turing-recognisable).

regular $\subset$ context-free $\subset$ context-sensitive $\subset$ recursively enumerable.
`

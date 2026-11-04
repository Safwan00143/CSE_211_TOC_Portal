/*
  Runs every automaton, grammar and regex registered in src/content/machines
  against a direct test of its intended language, on every string up to the
  check's maxLen (plus any extra strings). Prints each mismatch with a few
  counterexamples and exits non-zero if any check fails.

    npm run verify            all checks
    npm run verify -- b22     only checks whose id contains "b22"
*/
import { allStrings, cfgGenerates, faAccepts, isCnf, isDfa, parseCount, pdaAccepts, regexMatcher, tapeContents, tmRun } from "../src/lib/automata"
import { checks, facts } from "../src/content/machines"
import { mustFail } from "../src/content/machines/kit-demo"
import { pumpingClaims } from "../src/content/machines/pumping"
import { survivingSplits } from "../src/lib/pumping"
import { isDeterministic } from "../src/content/machines/notes-pda-hmu"
import { tmMonus } from "../src/content/machines/notes-tm"
import type { Check } from "../src/content/machines/types"

const filter = process.argv[2]
const selected = filter ? checks.filter((c) => c.id.includes(filter)) : checks

const ids = new Set<string>()
for (const c of checks) {
  if (ids.has(c.id)) console.log(`DUPLICATE check id: ${c.id}`)
  ids.add(c.id)
}

function runner(c: Check): (w: string) => boolean | string {
  if ("regex" in c) return regexMatcher(c.regex, { plusIsSymbol: c.plusIsSymbol })
  if ("grammar" in c) return (w) => cfgGenerates(c.grammar, w)
  const m = c.machine
  if (m.kind === "fa") return (w) => faAccepts(m, w)
  if (m.kind === "tm") {
    return (w) => {
      const r = tmRun(m, w)
      if (r.result === "timeout") return "timeout"
      if (c.output && r.result === "accept") return tapeContents(m, r.tape).join("")
      return r.result === "accept"
    }
  }
  return (w) => pdaAccepts(m, w, c.stackBound)
}

function problemsOf(c: Check): string[] {
  const problems: string[] = []
  if (c.dfa && "machine" in c && (c.machine.kind !== "fa" || !isDfa(c.machine))) problems.push("not a complete DFA")
  if ("grammar" in c && c.cnf && !isCnf(c.grammar)) problems.push("grammar is not in CNF")
  if (c.deterministic && "machine" in c && (c.machine.kind !== "pda-hmu" || !isDeterministic(c.machine))) problems.push("PDA is not deterministic")
  if ("grammar" in c) {
    for (const w of c.ambiguousOn ?? []) {
      const n = parseCount(c.grammar, w)
      if (n < 2) problems.push(`"${w}" was claimed ambiguous but has ${n} parse tree(s)`)
    }
    if (c.unambiguous) {
      const amb = allStrings(c.alphabet, c.maxLen).filter((w) => parseCount(c.grammar, w) > 1)
      if (amb.length) problems.push(`claimed unambiguous, but ${amb.slice(0, 3).map((w) => `"${w || "ε"}"`).join(", ")} have 2+ parse trees`)
    }
  }
  const run = runner(c)
  const words = [...allStrings(c.alphabet, c.maxLen), ...(c.extra ?? [])]
  const bad: string[] = []
  for (const w of words) {
    const got = run(w)
    if (c.output) {
      // A function TM is only specified on its domain (inL); other inputs are not compared.
      if (!c.inL(w)) continue
      const want = c.output(w)
      if (got !== want) bad.push(`"${w}": got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`)
    } else if (got !== c.inL(w)) {
      bad.push(`"${w || "ε"}": machine says ${got}, language says ${c.inL(w)}`)
    }
  }
  if (bad.length) problems.push(`${bad.length} of ${words.length} strings disagree, e.g.\n      ${bad.slice(0, 5).join("\n      ")}`)
  // A function TM compared on an empty domain would pass vacuously.
  if (c.output && !words.some((w) => c.inL(w))) problems.push("no input lies in the domain, so nothing was compared")
  return problems
}

// The harness must catch known-wrong machines before its passes mean anything.
const wrongMonus: Check = {
  id: "selftest-tm-output",
  machine: tmMonus,
  alphabet: ["0", "1"],
  maxLen: 5,
  inL: (w) => /^0*10*$/.test(w),
  output: (w) => "0".repeat(w.length - 1), // m + n instead of m ∸ n
}
for (const c of [...mustFail, wrongMonus]) {
  if (problemsOf(c).length === 0) {
    console.log(`HARNESS BROKEN: ${c.id} should fail but passed`)
    process.exit(2)
  }
}
console.log(`harness self-test: all ${mustFail.length + 1} deliberate errors caught\n`)

let failed = 0
for (const c of selected) {
  const problems = problemsOf(c)
  const words = allStrings(c.alphabet, c.maxLen).length + (c.extra?.length ?? 0)
  if (problems.length) {
    failed++
    console.log(`FAIL ${c.id}\n    ${problems.join("\n    ")}`)
  } else {
    console.log(`ok   ${c.id}  (${words} strings)`)
  }
}

/* Pumping-lemma arguments: every legal split must fail for the proof's chosen i. */
const claims = filter ? pumpingClaims.filter((c) => c.id.includes(filter)) : pumpingClaims
// The brute force must reject a wrong argument: 0^n1^n pumped with i = 1 never leaves the language.
if (!survivingSplits({ ...pumpingClaims[0], i: () => 1 }, 3).length) {
  console.log("HARNESS BROKEN: pumping brute force accepted i = 1")
  process.exit(2)
}
let pumpFailed = 0
for (const c of claims) {
  const ps = c.ps ?? [1, 2, 3, 4, 5, 6]
  const bad = ps.flatMap((p) => survivingSplits(c, p).map((s) => `p=${p}: ${s}`))
  if (bad.length) {
    pumpFailed++
    console.log(`FAIL ${c.id}  (splits that stay in L)\n      ${bad.slice(0, 5).join("\n      ")}`)
  } else console.log(`ok   ${c.id}  (all splits fail for p = ${ps.join(", ")})`)
}

/* Other claims: each recomputes itself. */
const selectedFacts = filter ? facts.filter((f) => f.id.includes(filter)) : facts
let factFailed = 0
for (const f of selectedFacts) {
  const problem = f.problem()
  if (problem) {
    factFailed++
    console.log(`FAIL ${f.id}  (${f.claim})\n      ${problem}`)
  } else console.log(`ok   ${f.id}  (${f.claim})`)
}

console.log(
  `\n${selected.length - failed} of ${selected.length} checks passed; ${claims.length - pumpFailed} of ${claims.length} pumping arguments hold; ${selectedFacts.length - factFailed} of ${selectedFacts.length} facts hold.`,
)
if (failed || pumpFailed || factFailed) process.exit(1)

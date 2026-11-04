import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PracticeBody } from "@/components/practice-body"
import { bookProblems } from "@/content/book"
import { questions } from "@/content/questions"

/*
  Each solution is pre-rendered as its own static page. The practice list fetches
  it the first time a student opens the solution and shows only the #solution
  block, so hidden solutions never weigh down the practice page.
*/
export const dynamicParams = false

export function generateStaticParams() {
  const params = [...questions.filter((q) => q.solution), ...bookProblems].map((q) => ({ slug: q.topic, id: q.id }))
  // A static export needs at least one page per dynamic route.
  return params.length ? params : [{ slug: "dfa", id: "none" }]
}

export const metadata: Metadata = { title: "Solution", robots: { index: false } }

export default async function Solution({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { id } = await params
  const q = questions.find((x) => x.id === id && x.solution)
  const b = bookProblems.find((x) => x.id === id)
  if (!q && !b) notFound()
  return (
    <div id="solution" className="mx-auto max-w-3xl px-4 py-10">
      {q ? <PracticeBody text={q.solution!} figs={q.solutionFigs} /> : <PracticeBody text={b!.solution} figs={b!.solutionFigs} />}
    </div>
  )
}

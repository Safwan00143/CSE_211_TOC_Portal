import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PaperView, type PaperViewSection } from "@/components/paper-view"
import { PracticeBody } from "@/components/practice-body"
import { formatMarks, getPaper, partKey, papers } from "@/content/papers"
import { getTopic } from "@/content/topics"
import { toHref } from "@/lib/static-path"

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const paper = getPaper((await params).slug)
  return { title: paper ? `${paper.course} ${paper.batch} term final` : "Past paper" }
}

export default async function PaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const paper = getPaper((await params).slug)
  if (!paper) notFound()

  const sections: PaperViewSection[] = paper.sections.map((s) => ({
    name: s.name,
    instructions: s.instructions,
    questions: s.questions.map((q) => ({
      no: q.no,
      marks: formatMarks(Math.round(q.parts.reduce((n, p) => n + p.marks, 0) * 100) / 100),
      stem: q.stem ? <PracticeBody text={q.stem} className="prose-prompt" /> : undefined,
      parts: q.parts.map((p) => ({
        key: partKey(q, p),
        part: p.part,
        marks: formatMarks(p.marks),
        topic: getTopic(p.topic)?.title ?? p.topic,
        topicHref: `/practice/${p.topic}`,
        prompt: <PracticeBody text={p.prompt} className="prose-prompt" />,
        solutionUrl: p.solution ? toHref(`/papers/${paper.slug}/solution/${partKey(q, p)}`) : undefined,
      })),
    })),
  }))

  return (
    <div className="mx-auto max-w-[52rem] px-4 pt-10 sm:px-6 sm:pt-14">
      <Link href="/papers" className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> All papers
      </Link>

      <header className="mt-6 mb-8 border-b border-border pb-8">
        <p className="text-[13px] tabular-nums text-primary">
          {paper.course} · Theory of Computation · {paper.session.replace("-", "–")}
        </p>
        <h1 className="mt-3 text-4xl font-medium leading-tight sm:text-[2.75rem]">{paper.batch} term final</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">{paper.exam}</p>
        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 text-sm">
          {[
            ["Date", paper.date],
            ["Time", paper.time],
            ["Full marks", String(paper.fullMarks)],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 font-medium tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-[13.5px] leading-relaxed text-muted-foreground">
          The figures in the margin of the original paper are shown here as marks. Use separate scripts for each
          section.
        </p>
      </header>

      <PaperView sections={sections} />
    </div>
  )
}

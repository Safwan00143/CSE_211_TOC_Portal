import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { paperParts, papers } from "@/content/papers"

export const metadata: Metadata = { title: "Past papers" }

export default function PapersIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="max-w-2xl">
        <p className="text-[13px] font-medium text-primary">Past papers</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight">Whole term-final papers</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Each paper exactly as it was set, question by question, with a full worked solution under every part. Sit
          it like the real exam, then open the solutions. The same questions also appear on the topic pages under
          Practice. Newest first.
        </p>
      </div>

      {papers.length === 0 && <p className="mt-10 text-muted-foreground">Papers are being added.</p>}

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {papers.map((p) => {
          const parts = paperParts(p)
          const done = parts.filter(({ part }) => part.solution).length
          return (
            <li key={p.slug}>
              <Link
                href={`/papers/${p.slug}`}
                className="group block rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <p className="text-[13px] tabular-nums text-muted-foreground">
                  {p.course} · {p.session.replace("-", "–")} · held {p.date}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-medium">{p.batch} term final</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.exam}</p>
                <p className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                  {p.sections.reduce((n, s) => n + s.questions.length, 0)} questions · {parts.length} parts · {p.fullMarks} marks
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </p>
                {done < parts.length && (
                  <p className="mt-2 text-[12.5px] text-muted-foreground">
                    {done} of {parts.length} solutions written
                  </p>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

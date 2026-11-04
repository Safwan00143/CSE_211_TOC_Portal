"use client"

import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "glisse"
import { BlurFade } from "@/components/ui/blur-fade"
import { loadSolution } from "@/components/practice-list"
import { cn } from "@/lib/utils"

export type PaperViewPart = {
  key: string
  part: string
  marks: string
  topic: string
  topicHref: string
  prompt: ReactNode
  solutionUrl?: string
}
export type PaperViewQuestion = { no: number; marks: string; stem?: ReactNode; parts: PaperViewPart[] }
export type PaperViewSection = { name: string; instructions: string; questions: PaperViewQuestion[] }

/** A whole paper in printed order; every part has its own show/hide solution toggle. */
export function PaperView({ sections }: { sections: PaperViewSection[] }) {
  const keys = sections.flatMap((s) => s.questions.flatMap((q) => q.parts.map((p) => p.key)))
  const [open, setOpen] = useState<Set<string>>(new Set())
  const allOpen = open.size === keys.length

  const toggle = (key: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md sm:mx-0 sm:rounded-b-xl sm:px-5">
        <nav aria-label="Questions" className="flex flex-wrap items-center gap-1">
          {sections.flatMap((s) => s.questions).map((q) => (
            <a
              key={q.no}
              href={`#q${q.no}`}
              className="grid size-8 place-items-center rounded-full text-sm tabular-nums text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {q.no}
            </a>
          ))}
        </nav>
        <Button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(keys))} icon={allOpen ? <EyeOff className="size-4" /> : <Eye className="size-4" />}>
          {allOpen ? "Hide all solutions" : "Show all solutions"}
        </Button>
      </div>

      {sections.map((s) => (
        <section key={s.name} className="mb-14">
          <header className="mb-6">
            <h2 className="font-heading text-2xl font-medium">{s.name}</h2>
            <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">{s.instructions}</p>
          </header>

          {s.questions.map((q) => (
            <article key={q.no} id={`q${q.no}`} className="mb-6 scroll-mt-32 rounded-xl border border-border bg-card px-5 py-7 sm:px-8">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-xl font-medium">Question {q.no}</h3>
                <span className="text-[13px] tabular-nums text-muted-foreground">{q.marks} marks</span>
              </div>
              {q.stem && <div className="mb-6">{q.stem}</div>}

              <ol>
                {q.parts.map((p) => (
                  <PartRow key={p.key} part={p} open={open.has(p.key)} onToggle={() => toggle(p.key)} />
                ))}
              </ol>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}

function PartRow({ part, open, onToggle }: { part: PaperViewPart; open: boolean; onToggle: () => void }) {
  const [html, setHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  // Fetch the solution the first time the part is opened, whether by its own button or "Show all".
  useEffect(() => {
    if (!open || html !== null) return
    let live = true
    setFailed(false)
    loadSolution(part.solutionUrl).then(
      (h) => live && setHtml(h),
      () => live && setFailed(true),
    )
    return () => {
      live = false
    }
  }, [open, html, part.solutionUrl])

  return (
    <li id={`q${part.key}`} className="scroll-mt-32 border-t border-border py-6 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
        {part.part && <span className="font-heading text-base font-medium text-foreground">({part.part})</span>}
        <span className="tabular-nums">{part.marks} marks</span>
        <span aria-hidden>·</span>
        <Link href={part.topicHref} className="rounded-md bg-muted px-2 py-0.5 text-xs text-foreground/70 hover:text-foreground">
          {part.topic}
        </Link>
      </div>

      {part.prompt}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${part.key}-solution`}
        className={cn(
          "mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
          open ? "bg-muted text-foreground hover:bg-muted/70" : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {open ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        {open ? "Hide solution" : "Show solution"}
      </button>

      {open && (
        <BlurFade duration={0.35} offset={8} blur="4px">
          <div id={`${part.key}-solution`} className="mt-7 border-l-2 border-primary/50 pl-5 sm:pl-7">
            <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.14em] text-primary">Solution</p>
            {html !== null ? (
              <div dangerouslySetInnerHTML={{ __html: html }} />
            ) : !part.solutionUrl ? (
              <p className="text-sm text-muted-foreground">The worked solution for this part is still being written.</p>
            ) : failed ? (
              <p className="text-sm text-destructive">Could not load the solution. Check your connection and try again.</p>
            ) : (
              <p role="status" className="flex items-center gap-2 text-[13px] text-muted-foreground">
                <span className="size-3.5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                Loading solution…
              </p>
            )}
          </div>
        </BlurFade>
      )}
    </li>
  )
}

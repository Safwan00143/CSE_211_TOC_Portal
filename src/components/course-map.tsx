import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { questionsFor } from "@/content/questions"
import { topics } from "@/content/topics"

const parts = [
  { id: "A", title: "Part A · Hakim Sir", subtitle: "Finite automata, regular languages, grammars and PDAs" },
  { id: "B", title: "Part B · Atif Sir", subtitle: "Normal forms, PDAs, Turing machines, decidability, complexity" },
] as const

/** The full topic list. `mode` decides where each row links. */
export function CourseMap({ mode = "both" }: { mode?: "both" | "learn" | "practice" }) {
  return (
    <div className="space-y-14">
      {parts.map((part) => (
        <div key={part.id}>
          <div className="flex items-baseline justify-between gap-4 border-b border-foreground/15 pb-3">
            <h3 className="text-base font-medium">{part.title}</h3>
            <p className="text-[13px] text-muted-foreground">{part.subtitle}</p>
          </div>
          <ul>
            {topics
              .filter((t) => t.part === part.id)
              .map((t) => {
                const n = topics.indexOf(t) + 1
                const count = questionsFor(t.slug).length
                const primaryHref = mode === "practice" ? `/practice/${t.slug}` : `/learn/${t.slug}`
                return (
                  <li key={t.slug} className="group border-b border-border">
                    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 py-5 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:items-center">
                      <span className="pt-0.5 font-heading text-sm tabular-nums text-muted-foreground sm:pt-0">
                        {String(n).padStart(2, "0")}
                      </span>
                      <Link href={primaryHref} className="min-w-0">
                        <span className="flex items-center gap-1.5 font-heading text-[17px] font-medium transition-colors group-hover:text-primary">
                          {t.title}
                          <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 block text-[14px] leading-relaxed text-muted-foreground">{t.short}</span>
                      </Link>
                      <div className="col-start-2 mt-3 flex items-center gap-4 text-[13px] sm:col-start-auto sm:mt-0 sm:justify-end">
                        <span className="hidden text-muted-foreground md:inline">{t.lectures}</span>
                        {mode === "both" && count > 0 && (
                          <Link
                            href={`/practice/${t.slug}`}
                            className="rounded-full bg-accent px-3 py-1 font-medium tabular-nums text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            {count} {count === 1 ? "question" : "questions"}
                          </Link>
                        )}
                        {mode === "practice" && (
                          <span className="tabular-nums text-muted-foreground">
                            {count} {count === 1 ? "question" : "questions"}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
          </ul>
        </div>
      ))}
    </div>
  )
}

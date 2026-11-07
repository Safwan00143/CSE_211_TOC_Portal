import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Presentation } from "lucide-react"
import { decksFor } from "@/content/slides"
import { assetHref } from "@/lib/static-path"
import { Markdown } from "@/components/markdown"
import { notes, outline } from "@/content/notes"
import { questionsFor } from "@/content/questions"
import { getTopic, topics } from "@/content/topics"

export function generateStaticParams() {
  return topics.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const topic = getTopic((await params).slug)
  return { title: topic?.title }
}

export default async function LearnTopic({ params }: { params: Promise<{ slug: string }> }) {
  const topic = getTopic((await params).slug)
  if (!topic) notFound()

  const i = topics.indexOf(topic)
  const prev = topics[i - 1]
  const next = topics[i + 1]
  const note = notes[topic.slug] ?? ""
  const sections = outline(note)
  const count = questionsFor(topic.slug).length
  const deckList = decksFor(topic.slug)

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-12 xl:transition-[grid-template-columns,column-gap] xl:duration-300 xl:group-data-[right=closed]/shell:grid-cols-[minmax(0,1fr)_2.5rem] xl:group-data-[right=closed]/shell:gap-4">
      <article className="min-w-0 max-w-[44rem] group-data-[left=closed]/shell:max-w-none xl:group-data-[right=closed]/shell:max-w-none">
        <header className="mb-12 border-b border-border pb-10">
          <p className="text-[13px] text-muted-foreground">
            <span className="tabular-nums text-primary">Topic {String(i + 1).padStart(2, "0")}</span>
            <span className="mx-2" aria-hidden>·</span>
            {topic.lectures}
          </p>
          <h1 className="mt-3 text-4xl font-medium leading-tight sm:text-[2.75rem]">{topic.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{topic.short}</p>
          <p className="mt-3 text-[13.5px] text-muted-foreground">{topic.notation}</p>
          {count > 0 && (
            <Link
              href={`/practice/${topic.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline hover:underline-offset-4"
            >
              {count} past {count === 1 ? "question" : "questions"} on this topic
              <ArrowRight className="size-4" />
            </Link>
          )}
          {deckList.length > 0 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {deckList.map((d) => (
                <a
                  key={d.file}
                  href={assetHref(`/slides/${d.file}`)}
                  className="group flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
                >
                  <Presentation className="size-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block font-medium">Animated slides: {d.title}</span>
                    <span className="block text-[12.5px] text-muted-foreground">
                      {d.slides} slides · {d.source} · works on phones
                    </span>
                  </span>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          )}
        </header>

        {note ? (
          <Markdown>{note}</Markdown>
        ) : (
          <p className="text-muted-foreground">The note for this topic is being written.</p>
        )}

        {count > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <p className="text-[13px] text-muted-foreground">Ready to test yourself?</p>
            <Link
              href={`/practice/${topic.slug}`}
              className="group mt-3 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Practise {count} {count === 1 ? "question" : "questions"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}

        <nav className="mt-14 grid grid-cols-2 gap-6 border-t border-border pt-8 text-sm" aria-label="Topic pages">
          <div>
            {prev && (
              <Link href={`/learn/${prev.slug}`} className="group block">
                <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <ArrowLeft className="size-3.5" /> Previous
                </span>
                <span className="mt-1 block font-heading font-medium group-hover:text-primary">{prev.title}</span>
              </Link>
            )}
          </div>
          <div className="text-right">
            {next && (
              <Link href={`/learn/${next.slug}`} className="group block">
                <span className="flex items-center justify-end gap-1.5 text-[13px] text-muted-foreground">
                  Next <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-1 block font-heading font-medium group-hover:text-primary">{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      </article>

      <aside className="hidden min-w-0 transition-opacity duration-200 xl:block xl:overflow-clip xl:group-data-[right=closed]/shell:invisible xl:group-data-[right=closed]/shell:opacity-0">
        <div className="sticky top-[7.5rem]">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">On this page</p>
          <ul className="space-y-2 border-l border-border">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="-ml-px block border-l border-transparent pl-3 text-[13px] leading-snug text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

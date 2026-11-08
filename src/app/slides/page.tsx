import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Hand, Keyboard, LayoutGrid, Smartphone } from "lucide-react"
import { decks } from "@/content/slides"
import { getTopic } from "@/content/topics"
import { assetHref } from "@/lib/static-path"

export const metadata: Metadata = { title: "Animated slides" }

const tips = [
  { icon: Keyboard, title: "Computer", text: "→ and ← step through each animation. G opens the list of slides, F goes full screen, S changes the speed." },
  { icon: Hand, title: "Phone and iPad", text: "Swipe left or right, or use the large arrows. The caption sits in a panel below the animation, at a readable size." },
  { icon: Smartphone, title: "Turn sideways", text: "Slides with sliders, inputs or dominoes are easiest in landscape. Everything also works upright." },
  { icon: LayoutGrid, title: "Jump anywhere", text: "The ☰ button lists every slide by section. Links remember the exact frame, so you can share or bookmark one." },
]

export default function SlidesIndex() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="max-w-2xl">
        <p className="text-[13px] font-medium text-primary">Animated slides</p>
        <h1 className="mt-3 text-4xl font-medium leading-tight">Watch the ideas move</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          Step-by-step animated explanations of Atif Sir&rsquo;s lectures and of past term-final questions, one caption per step. Many slides let you type
          your own input, drag a slider or click a table, and every machine in them is checked by code. Each deck is a
          single file that also works offline.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {decks.map((d) => (
          <li key={d.file} className="flex">
            <div className="flex w-full flex-col rounded-xl border border-border bg-card p-6">
              <p className="text-[13px] text-muted-foreground">
                {d.teacher} · {d.source}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-medium leading-snug">{d.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.summary}</p>
              <ul className="mt-4 space-y-1.5 text-[13.5px]">
                {d.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {d.topics.map((t) => (
                  <Link key={t} href={`/learn/${t}`} className="rounded-full border border-border px-3 py-1 text-[12.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                    {getTopic(t)?.title}
                  </Link>
                ))}
              </div>
              <div className="mt-auto pt-6">
                <a
                  href={assetHref(`/slides/${d.file}`)}
                  className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  Open {d.slides} slides
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-medium">How to use them</h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tips.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <Icon className="size-5 text-primary" aria-hidden />
              <p className="mt-3 font-medium">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

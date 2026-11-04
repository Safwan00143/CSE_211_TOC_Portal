import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DotPattern } from "@/components/ui/dot-pattern"
import { BlurFade } from "@/components/ui/blur-fade"
import { CourseMap } from "@/components/course-map"
import { questions } from "@/content/questions"
import { papers } from "@/content/papers"
import { topics } from "@/content/topics"

export default function Home() {
  const worked = questions.filter((q) => q.solution).length

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <DotPattern
          width={22}
          height={22}
          cr={1}
          className="text-foreground/[0.09] [mask-image:radial-gradient(520px_circle_at_75%_20%,white,transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
          <BlurFade>
            <p className="text-[13px] font-medium tracking-wide text-primary">CSE 211 · Theory of Computation</p>
          </BlurFade>
          <BlurFade delay={0.05}>
            <h1 className="mt-5 max-w-3xl text-[2.4rem] font-medium leading-[1.08] sm:text-6xl">
              Learn each topic, then test yourself on real term finals.
            </h1>
          </BlurFade>
          <BlurFade delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Notes built from Hakim Sir&rsquo;s and Atif Sir&rsquo;s slides, in their own notation, and every past term-final
              question sorted by topic. Every automaton and grammar in a solution is checked by code. Solutions stay
              hidden until you ask for them.
            </p>
          </BlurFade>
          <BlurFade delay={0.15}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={`/learn/${topics[0].slug}`}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start learning
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Practise questions
              </Link>
            </div>
          </BlurFade>

          <dl className="mt-16 flex flex-wrap gap-x-12 gap-y-6">
            {[
              [String(topics.length), "topics"],
              [String(worked), "worked questions"],
              [String(papers.length), "exam sessions"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-3xl font-light tabular-nums">{value}</dd>
                <dd className="mt-1 text-[13px] text-muted-foreground">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl font-medium">Course map</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Topics follow the order of the slides. Part A is Hakim Sir&rsquo;s half, Part B is Atif Sir&rsquo;s. Each topic has
              notes to read and a set of past questions to try.
            </p>
          </div>
          <CourseMap />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <h2 className="text-2xl font-medium">How to practise</h2>
          <ol className="grid gap-10 sm:grid-cols-3">
            {[
              ["Read the notes", "Each topic page covers the definitions, constructions and proofs the questions rely on."],
              ["Attempt on paper", "Questions show the session, number and marks, just like the exam. Work them out before looking."],
              ["Reveal and compare", "Open the solution, check each step, and mark it solved. Progress is saved in your browser."],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="font-heading text-sm tabular-nums text-primary">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}

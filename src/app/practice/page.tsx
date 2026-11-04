import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { CourseMap } from "@/components/course-map"
import { questions } from "@/content/questions"
import { papers } from "@/content/papers"

export const metadata: Metadata = { title: "Practice" }

export default function PracticeIndex() {
  const worked = questions.filter((q) => q.solution).length

  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6 sm:pt-20">
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <p className="text-[13px] font-medium text-primary">Practice</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight">Past questions by topic</h1>
          <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              {questions.length} term-final questions from {papers.length} papers; {worked} have full worked solutions so
              far.
            </p>
            <p>Pick a topic, try each question on paper, then reveal the solution.</p>
          </div>
          <Link
            href="/papers"
            className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline hover:underline-offset-4"
          >
            Or sit a whole paper
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <CourseMap mode="practice" />
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRoute } from "@/lib/use-route"
import { topics } from "@/content/topics"
import { cn } from "@/lib/utils"

/** Topic list for the left rail on desktop, and a disclosure on small screens. */
export function TopicNav({ base }: { base: "/learn" | "/practice" }) {
  const pathname = useRoute()
  const current = topics.find((t) => pathname === `${base}/${t.slug}`)

  const list = (
    <ul className="space-y-0.5">
      {topics.map((t, i) => {
        const href = `${base}/${t.slug}`
        const active = pathname === href
        return (
          <li key={t.slug}>
            {(i === 0 || topics[i - 1].part !== t.part) && (
              <p className={cn("px-3 pb-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground", i > 0 && "pt-5")}>
                Part {t.part}
              </p>
            )}
            <Link
              href={href}
              className={cn(
                "flex gap-2.5 rounded-lg px-3 py-1.5 text-[13.5px] leading-snug transition-colors",
                active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="w-4 shrink-0 tabular-nums opacity-60">{i + 1}</span>
              {t.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      <details className="group mb-8 border-y border-border lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm">
          <span className="text-muted-foreground">
            Topic <span className="tabular-nums">{current ? topics.indexOf(current) + 1 : ""}</span> of {topics.length}
          </span>
          <span className="text-primary group-open:hidden">All topics</span>
          <span className="hidden text-primary group-open:inline">Close</span>
        </summary>
        <div className="pb-4">{list}</div>
      </details>
      <nav className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto pb-8 lg:block" aria-label="Topics">
        {list}
      </nav>
    </>
  )
}

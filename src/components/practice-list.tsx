"use client"

import { useState } from "react"
import { Check, Eye, EyeOff } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { toggleSolved, useSolved } from "@/lib/progress"
import { cn } from "@/lib/utils"

export type PracticeItem = {
  id: string
  /** Shown as the badge, and used for the filter chips when a list has more than one. */
  group: string
  /** Badge text when it should differ from the filter group, e.g. the batch. */
  badge?: string
  /** Highlight the badge (term finals, the main textbook). */
  primary?: boolean
  /** Small text after the badge, e.g. session and question label. */
  meta: string[]
  alsoAsked?: string[]
  note?: string
  prompt: React.ReactNode
  /** Static page holding the solution, fetched the first time it is opened so pages stay light. Undefined while the solution is still being written. */
  solutionUrl?: string
}

const solutionCache = new Map<string, Promise<string>>()

export function loadSolution(url: string | undefined) {
  if (!url) return Promise.reject(new Error("pending"))
  let p = solutionCache.get(url)
  if (!p) {
    // Revalidate so an edited solution never shows a stale copy; unchanged pages come back as a quick 304.
    p = fetch(url, { cache: "no-cache" }).then((r) => {
      if (!r.ok) throw new Error(String(r.status))
      return r.text()
    }).then((page) => {
      // The URL is a full static page; keep only its solution block.
      const body = new DOMParser().parseFromString(page, "text/html").getElementById("solution")
      if (!body) throw new Error("no solution block")
      return body.innerHTML
    })
    p.catch(() => solutionCache.delete(url))
    solutionCache.set(url, p)
  }
  return p
}

export function PracticeList({ items, filterLabel }: { items: PracticeItem[]; filterLabel: string }) {
  const solved = useSolved()
  const [filter, setFilter] = useState("All")
  const groups = [...new Set(items.map((i) => i.group))]
  const filters = groups.length > 1 ? ["All", ...groups] : []
  const shown = filter === "All" ? items : items.filter((i) => i.group === filter)
  const done = items.filter((i) => solved.has(i.id)).length

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-1" role="tablist" aria-label={filterLabel}>
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full px-3 py-1 text-[13px] transition-colors",
                filter === f ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
              <span className="ml-1.5 tabular-nums opacity-60">
                {f === "All" ? items.length : items.filter((i) => i.group === f).length}
              </span>
            </button>
          ))}
        </div>
        <Progress done={done} total={items.length} />
      </div>

      <ol className="mt-6">
        {shown.map((item, i) => (
          <QuestionRow key={item.id} item={item} index={i + 1} solved={solved.has(item.id)} />
        ))}
      </ol>
    </div>
  )
}

function Progress({ done, total }: { done: number; total: number }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
      <span className="tabular-nums">
        <span className="font-medium text-foreground">{done}</span> of {total} solved
      </span>
      <span className="h-1 w-24 overflow-hidden rounded-full bg-muted" aria-hidden>
        <span
          className="block h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </span>
    </div>
  )
}

function QuestionRow({ item, index, solved }: { item: PracticeItem; index: number; solved: boolean }) {
  const [open, setOpen] = useState(false)
  const [html, setHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next && html === null) {
      setFailed(false)
      loadSolution(item.solutionUrl).then(setHtml, () => setFailed(true))
    }
  }

  return (
    <li id={item.id} className="mb-5 scroll-mt-24 rounded-xl border border-border bg-card px-5 py-8 sm:px-8">
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[3.5rem_minmax(0,1fr)]">
        <div className="flex items-baseline gap-3 md:block">
          <span className="font-heading text-2xl font-light tabular-nums text-muted-foreground/70">
            {String(index).padStart(2, "0")}
          </span>
          {solved && (
            <span className="inline-flex items-center gap-1 text-xs text-primary md:mt-2 md:flex">
              <Check className="size-3.5" /> solved
            </span>
          )}
        </div>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-xs font-medium",
                item.primary ? "bg-accent text-accent-foreground" : "bg-muted text-foreground/70",
              )}
            >
              {item.badge ?? item.group}
            </span>
            {item.meta.map((m, i) => (
              <span key={i} className="flex items-center gap-x-3 tabular-nums">
                {i > 0 && <span aria-hidden>·</span>}
                {m}
              </span>
            ))}
          </div>

          {item.prompt}

          {item.note && <p className="mt-4 text-[13.5px] italic text-muted-foreground">{item.note}</p>}
          {item.alsoAsked && (
            <p className="mt-4 text-[13px] text-muted-foreground">
              Also asked in {item.alsoAsked.join(", ")}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={`${item.id}-solution`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                open
                  ? "bg-muted text-foreground hover:bg-muted/70"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
            >
              {open ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {open ? "Hide solution" : "Show solution"}
            </button>
            <button
              type="button"
              onClick={() => toggleSolved(item.id)}
              aria-pressed={solved}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors",
                solved ? "text-primary hover:bg-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Check className="size-4" />
              {solved ? "Marked solved" : "Mark as solved"}
            </button>
          </div>

          {open && (
            <BlurFade duration={0.35} offset={8} blur="4px">
              <div id={`${item.id}-solution`} className="mt-8 border-l-2 border-primary/50 pl-5 sm:pl-7">
                <p className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.14em] text-primary">
                  Solution
                </p>
                {html !== null ? (
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                ) : !item.solutionUrl ? (
                  <p className="text-sm text-muted-foreground">The worked solution for this question is still being written.</p>
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
        </div>
      </div>
    </li>
  )
}

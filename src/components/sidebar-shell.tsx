"use client"

import { useSyncExternalStore } from "react"
import { useRoute } from "@/lib/use-route"
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react"
import { cn } from "@/lib/utils"

/*
  Which side panels are open. Remembered per browser; every read and write is
  guarded, so blocked storage just means both start open.
*/
type Panels = { left: boolean; right: boolean }
const KEY = "cse211-panels-v1"
const OPEN: Panels = { left: true, right: true }
const listeners = new Set<() => void>()
let cache: Panels | null = null

function read(): Panels {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(KEY)
    cache = raw ? { ...OPEN, ...(JSON.parse(raw) as Partial<Panels>) } : OPEN
  } catch {
    cache = OPEN
  }
  return cache
}

function toggle(side: keyof Panels) {
  cache = { ...read(), [side]: !read()[side] }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    // Storage unavailable: the toggle still works for this visit.
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/**
 * Page frame with a collapsible topic list on the left. Lesson pages also get a
 * toggle for their right-hand outline; the outline itself lives in the page and
 * hides through the `group/shell` data attributes set here.
 */
export function SidebarShell({ left, children }: { left: React.ReactNode; children: React.ReactNode }) {
  const panels = useSyncExternalStore(subscribe, read, () => OPEN)
  const hasRight = /^\/learn\/[^/]+$/.test(useRoute())
  const L = panels.left ? PanelLeftClose : PanelLeftOpen
  const R = panels.right ? PanelRightClose : PanelRightOpen

  return (
    <div
      data-left={panels.left ? "open" : "closed"}
      data-right={panels.right ? "open" : "closed"}
      className="group/shell mx-auto max-w-6xl px-4 pt-6 transition-[max-width,padding] duration-300 data-[left=closed]:max-w-[92rem] sm:px-6 lg:pt-8 lg:data-[left=closed]:px-16 xl:data-[left=closed]:px-20"
    >
      <div className="mb-4 hidden items-center justify-between lg:flex">
        <PanelButton onClick={() => toggle("left")} pressed={!panels.left} label={panels.left ? "Hide topics" : "Show topics"}>
          <L className="size-4" />
        </PanelButton>
        {hasRight && (
          <PanelButton onClick={() => toggle("right")} pressed={!panels.right} label={panels.right ? "Hide outline" : "Show outline"} className="hidden xl:inline-flex">
            <R className="size-4" />
          </PanelButton>
        )}
      </div>
      <div className="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14 lg:transition-[grid-template-columns,column-gap] lg:duration-300 lg:group-data-[left=closed]/shell:grid-cols-[0rem_minmax(0,1fr)] lg:group-data-[left=closed]/shell:gap-0">
        <aside className="min-w-0 transition-opacity duration-200 lg:overflow-clip lg:group-data-[left=closed]/shell:invisible lg:group-data-[left=closed]/shell:opacity-0">
          {left}
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}

function PanelButton({ onClick, pressed, label, className, children }: { onClick: () => void; pressed: boolean; label: string; className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      title={label}
      className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground", className)}
    >
      {children}
      {label}
    </button>
  )
}

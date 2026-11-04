"use client"

import { useEffect, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type Tab = { id: string; label: string; count: number; content: ReactNode }

/** Term-final questions and book problems live on separate tabs so the two never mix. */
export function PracticeTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs.find((t) => t.count > 0)?.id ?? tabs[0].id)

  // Deep links such as #book open the matching tab.
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (tabs.some((t) => t.id === hash)) setActive(hash)
  }, [tabs])

  const pick = (id: string) => {
    setActive(id)
    try {
      history.replaceState(null, "", `#${id}`)
    } catch {
      // Ignore: the tab still switches.
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Question sets" className="mb-8 inline-flex rounded-full border border-border p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            onClick={() => pick(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition-colors",
              active === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            <span className="ml-2 tabular-nums opacity-70">{t.count}</span>
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  )
}

"use client"

import { useEffect, useState, type ReactNode } from "react"
import { SegmentedControl } from "glisse"

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
      {/* Liquid Glass segmented control: the thumb springs between the two sets. */}
      <SegmentedControl
        aria-label="Question sets"
        className="practice-sets mb-8"
        value={active}
        onValueChange={pick}
        items={tabs.map((t) => ({
          value: t.id,
          label: (
            <>
              {t.label}
              <span className="ml-2 tabular-nums opacity-60">{t.count}</span>
            </>
          ),
        }))}
      />
      {tabs.map((t) => (
        <section key={t.id} aria-label={t.label} hidden={active !== t.id}>
          {t.content}
        </section>
      ))}
    </div>
  )
}

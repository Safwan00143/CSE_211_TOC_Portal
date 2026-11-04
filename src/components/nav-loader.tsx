"use client"

import { useEffect, useRef, useState } from "react"
import { useRoute } from "@/lib/use-route"
import { AnimatePresence, motion } from "motion/react"
import { useTheme } from "next-themes"
import GridLoader from "@/components/ui/grid-loader"

const SEQUENCE = ["solo-center", "plus-hollow", "plus-full", "corners", "border"] as const

/**
 * Shows the moment an internal link is clicked and stays until the new page is on screen,
 * so a slow page switch never looks like nothing happened.
 */
export function NavLoader() {
  const pathname = useRoute()
  const { resolvedTheme } = useTheme()
  const [pendingFrom, setPendingFrom] = useState<string | null>(null)
  // Remember the route (not the raw URL), so the static build compares like with like.
  const route = useRef(pathname)
  useEffect(() => {
    route.current = pathname
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Capture phase: next/link calls preventDefault before a bubbling listener would see the click.
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname === location.pathname) return
      setPendingFrom(route.current)
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [])

  // Done once the route has changed; the timeout is a fallback if navigation is abandoned.
  const pending = pendingFrom !== null && pendingFrom === pathname
  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => setPendingFrom(null), 15000)
    return () => clearTimeout(t)
  }, [pending])

  return (
    <AnimatePresence>
      {pending && (
        <motion.div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.08, duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-primary/15">
            <div className="loading-bar h-full w-1/3 bg-primary" />
          </div>
          <div className="absolute inset-0 bg-background/55 backdrop-blur-[2px]" />
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 rounded-2xl border border-border bg-background/90 px-7 py-5 shadow-sm">
            <GridLoader
              mode="sequence"
              sequence={[...SEQUENCE]}
              speed="fast"
              size={30}
              gap={3}
              rounded
              color={resolvedTheme === "dark" ? "#86c2b1" : "#2f6b5f"}
            />
            <span className="text-[13px] text-muted-foreground">Loading page…</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

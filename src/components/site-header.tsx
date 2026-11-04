"use client"

import Link from "next/link"
import { useRoute } from "@/lib/use-route"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/papers", label: "Papers" },
]

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 28 28" className="size-7" aria-hidden>
        <rect width="28" height="28" rx="8" className="fill-primary" />
        {/* Two states and a transition: the smallest automaton. */}
        <circle cx="8.5" cy="14" r="3.6" fill="none" className="stroke-primary-foreground" strokeWidth="1.6" />
        <circle cx="19.5" cy="14" r="3.6" fill="none" className="stroke-primary-foreground" strokeWidth="1.6" />
        <circle cx="19.5" cy="14" r="1.6" className="fill-primary-foreground" />
        <path d="M12.3 14h3.2" className="stroke-primary-foreground" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="hidden whitespace-nowrap font-heading text-[15px] font-medium tracking-tight sm:inline">
        Theory <span className="text-muted-foreground">of</span> Computation
      </span>
      <span className="whitespace-nowrap font-heading text-[15px] font-medium tracking-tight sm:hidden">CSE 211</span>
    </span>
  )
}

export function SiteHeader() {
  const pathname = useRoute()
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Home">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors sm:px-3.5",
                  active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <span className="mx-1 h-5 w-px bg-border" aria-hidden />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

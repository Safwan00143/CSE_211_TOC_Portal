"use client"

import Link from "next/link"
import { TabBar } from "glisse"
import { useRoute } from "@/lib/use-route"
import { ThemeToggle } from "./theme-toggle"

const nav = [
  { value: "/learn", href: "/learn", label: "Learn" },
  { value: "/practice", href: "/practice", label: "Practice" },
  { value: "/papers", href: "/papers", label: "Papers" },
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
      <span className="whitespace-nowrap font-heading text-[15px] font-medium tracking-tight max-[419px]:hidden sm:hidden">CSE 211</span>
    </span>
  )
}

export function SiteHeader() {
  const pathname = useRoute()
  const active = nav.find((item) => pathname.startsWith(item.href))?.value ?? null
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="Home" className="shrink-0">
          <Wordmark />
        </Link>
        <nav className="flex items-center gap-2" aria-label="Sections">
          {/* Liquid Glass tab bar: the selection slides between sections and follows a drag. */}
          <TabBar aria-label="Sections" className="site-tabs" items={nav} value={active} link={Link} />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

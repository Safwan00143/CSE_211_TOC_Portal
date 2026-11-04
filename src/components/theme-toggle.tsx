"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      aria-label="Toggle colour theme"
    >
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.75} />
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.75} />
    </button>
  )
}

"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "glisse"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const dark = resolvedTheme === "dark"
  return (
    <Button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle colour theme"
      icon={
        <>
          <Sun className="hidden size-[18px] dark:block" strokeWidth={1.75} />
          <Moon className="size-[18px] dark:hidden" strokeWidth={1.75} />
        </>
      }
    />
  )
}

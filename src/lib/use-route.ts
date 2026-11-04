"use client"

import { usePathname } from "next/navigation"
import { STATIC_EXPORT } from "./static-path"

/**
 * The current route, e.g. "/learn/dfa". In the flat static build the browser
 * reports the file's own URL (".../learn--dfa.html"), so turn it back into
 * the route the page was built for; otherwise the first render would differ
 * from the pre-rendered HTML.
 */
export function useRoute(): string {
  const pathname = usePathname()
  if (!STATIC_EXPORT || !pathname.endsWith(".html")) return pathname
  const file = pathname.slice(pathname.lastIndexOf("/") + 1, -".html".length)
  return file === "home" ? "/" : `/${file.split("--").join("/")}`
}

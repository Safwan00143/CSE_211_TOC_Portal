import type { AnchorHTMLAttributes } from "react"
import { toHref } from "./static-path"

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | { pathname?: string; hash?: string }
  prefetch?: boolean | null
  replace?: boolean
  scroll?: boolean
}

/**
 * Stand-in for next/link in the flat static build: a plain anchor to the
 * page's file, so every click is an ordinary page load.
 */
export default function StaticLink({ href, ...props }: Props) {
  // Router-only options mean nothing for a plain anchor.
  const rest = { ...props }
  delete rest.prefetch
  delete rest.replace
  delete rest.scroll
  const path = typeof href === "string" ? href : `${href.pathname ?? ""}${href.hash ? `#${href.hash}` : ""}`
  return <a href={toHref(path)} {...rest} />
}

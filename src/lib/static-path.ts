/*
  The site can also be built as a flat folder of static files (for publishing
  where only plain files are served). In that build every route becomes one
  file at the top level, e.g. /learn/dfa → learn--dfa.html, and links
  point at those files with relative URLs.
*/
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1"

/** File name of a route in the flat static build. */
export function routeFile(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "")
  return clean ? `${clean.split("/").join("--")}.html` : "home.html"
}

/** A route as a link target: unchanged normally, the flat file name in the static build. */
export function toHref(path: string): string {
  if (!STATIC_EXPORT || !path.startsWith("/")) return path
  const [route, hash] = path.split("#")
  return routeFile(route) + (hash ? `#${hash}` : "")
}

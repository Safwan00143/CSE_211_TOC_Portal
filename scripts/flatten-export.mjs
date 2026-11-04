// Turns the static export in out/ into a flat folder of files in artifact/:
//   out/learn/signals.html → artifact/learn--signals.html   (see src/lib/static-path.ts)
// and makes every asset path relative, so the site works from any folder.
// Run after: NEXT_PUBLIC_STATIC_EXPORT=1 next build
import fs from "node:fs"
import path from "node:path"

const OUT = "out"
const DEST = "artifact"
fs.rmSync(DEST, { recursive: true, force: true })
fs.mkdirSync(DEST, { recursive: true })

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]))
const rel = (f) => path.relative(OUT, f).split(path.sep).join("/")

// Pin the base URL to the page's own folder before anything else loads, so relative
// links, fetches and script chunks resolve the same even if the router rewrites the URL.
const BASE = `<script>(function(){var b=document.createElement("base");b.href=location.href.replace(/[?#].*$/,"").replace(/[^/]*$/,"");document.head.prepend(b)})()</script>`
const relNext = (s) => s.replace(/(?<![.\w])\/_next\//g, "./_next/")

let pages = 0
let assets = 0
for (const file of walk(OUT)) {
  const r = rel(file)
  if (r.endsWith(".html")) {
    if (r === "404.html" || r.startsWith("_not-found")) continue
    const route = r.replace(/\.html$/, "").replace(/(^|\/)index$/, "")
    const name = route ? `${route.split("/").join("--")}.html` : "home.html"
    const html = relNext(fs.readFileSync(file, "utf8")).replace("<head>", `<head>${BASE}`)
    fs.writeFileSync(path.join(DEST, name), html)
    pages++
  } else if (r.startsWith("_next/")) {
    if (/\.(map|txt)$/.test(r) || /KaTeX_[^/]+\.(ttf|woff)$/.test(r)) continue
    const target = path.join(DEST, r)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    if (r.endsWith(".js")) fs.writeFileSync(target, relNext(fs.readFileSync(file, "utf8")))
    else if (r.endsWith(".css")) fs.writeFileSync(target, fs.readFileSync(file, "utf8").replace(/\/_next\/static\/media\//g, "../media/"))
    else fs.copyFileSync(file, target)
    assets++
  } else if (/\.(ico|png|svg)$/.test(r) && !r.includes("/")) {
    fs.copyFileSync(file, path.join(DEST, r))
    assets++
  }
}
const size = walk(DEST).reduce((a, f) => a + fs.statSync(f).size, 0)
console.log(`pages ${pages}, assets ${assets}, total ${(size / 1048576).toFixed(1)} MB`)

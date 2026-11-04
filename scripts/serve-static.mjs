// Minimal static server for checking the flat export: serves this folder at http://localhost:4310/
import http from "node:http"
import fs from "node:fs"
import path from "node:path"
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".ico": "image/x-icon" }
http
  .createServer((req, res) => {
    const p = path.join(process.cwd(), decodeURIComponent(new URL(req.url, "http://x").pathname))
    fs.readFile(p, (err, data) => {
      if (err) return res.writeHead(404).end("not found")
      res.writeHead(200, { "content-type": types[path.extname(p)] ?? "application/octet-stream" }).end(data)
    })
  })
  .listen(4310)

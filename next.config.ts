import path from "node:path"
import type { NextConfig } from "next"

// NEXT_PUBLIC_STATIC_EXPORT=1 builds a plain folder of static files (see scripts/flatten-export.mjs).
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1"

// NEXT_DIST_DIR lets a check build write elsewhere, so it never disturbs a running `npm run dev` in .next.
const distDir = process.env.NEXT_DIST_DIR || undefined

const nextConfig: NextConfig = staticExport
  ? {
      distDir,
      output: "export",
      images: { unoptimized: true },
      webpack(config) {
        // Plain anchors instead of client-side navigation: every page is its own file.
        config.resolve.alias = { ...config.resolve.alias, "next/link$": path.resolve("src/lib/static-link.tsx") }
        return config
      },
    }
  : { distDir }

export default nextConfig

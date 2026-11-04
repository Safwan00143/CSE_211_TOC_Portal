import type { Metadata } from "next"
import { figures } from "@/figures"
import { FigureFrame } from "@/figures/figure"

export const metadata: Metadata = { title: "All figures", robots: { index: false } }

/** Every figure in the registry on one page, for checking layout in both themes and at phone width. */
export default function FiguresGallery() {
  const ids = Object.keys(figures)
  return (
    <div className="mx-auto max-w-[52rem] px-4 pt-10 sm:px-6">
      <h1 className="text-3xl font-medium">All figures</h1>
      <p className="mt-2 text-sm text-muted-foreground">{ids.length} figures in the registry.</p>
      {ids.map((id) => (
        <section key={id} id={id} className="mt-10 scroll-mt-20">
          <p className="font-mono text-[12px] text-muted-foreground">{id}</p>
          <FigureFrame id={id} entry={figures[id]} />
        </section>
      ))}
    </div>
  )
}

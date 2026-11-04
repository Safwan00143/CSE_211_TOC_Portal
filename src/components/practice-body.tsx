import { Markdown } from "@/components/markdown"
import { figures } from "@/figures"
import { FigureFrame } from "@/figures/figure"

/** A question's prompt or solution: markdown, then any attached figures. */
export function PracticeBody({ text, figs, className }: { text: string; figs?: string[]; className?: string }) {
  return (
    <>
      <Markdown className={className}>{text}</Markdown>
      {figs?.map((id) => (
        <FigureFrame key={id} id={id} entry={figures[id]} />
      ))}
    </>
  )
}

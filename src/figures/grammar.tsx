/* Parse-tree figures computed from the grammar itself, so a drawn tree is always a valid parse tree of its yield. */
import type { Tree } from "@/lib/automata"
import { ParseTree, type TreeNode } from "./kit"

function relabel(t: Tree, map: Record<string, string>): TreeNode {
  return { label: map[t.label] ?? t.label, children: t.children?.map((c) => relabel(c, map)) }
}

/** Draws one parse tree; `leaves` renames terminals for display (e.g. i → "if E then"). */
export function TreeFig({ tree, leaves = {}, gap }: { tree: Tree; leaves?: Record<string, string>; gap?: number }) {
  return <ParseTree tree={relabel(tree, leaves)} gap={gap} />
}

/* Helpers for reusing part of one worked solution inside another. Both throw if the marker is missing,
   so a renamed heading cannot silently drop text. */

function find(text: string, marker: string) {
  const i = text.indexOf(marker)
  if (i < 0) throw new Error(`solution text has no marker ${JSON.stringify(marker)}`)
  return i
}

/** The text from `marker` (inclusive) to the end. */
export const after = (text: string, marker: string) => text.slice(find(text, marker))

/** The text before `marker`. */
export const before = (text: string, marker: string) => text.slice(0, find(text, marker))

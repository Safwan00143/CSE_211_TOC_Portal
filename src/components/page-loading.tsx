/** Shown by Next.js while a lesson or practice page is being prepared. */
export function PageLoading({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" className="min-w-0 max-w-[44rem]">
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary/15">
        <div className="loading-bar h-full w-1/3 bg-primary" />
      </div>
      <p className="flex items-center gap-2 text-[13px] text-primary">
        <span className="size-3.5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        {label}
      </p>
      <div className="mt-5 animate-pulse space-y-4">
        <div className="h-10 w-3/4 rounded-lg bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-px bg-border" />
        <div className="space-y-2.5 pt-4">
          {[100, 94, 97, 60].map((w, i) => (
            <div key={i} className="h-3.5 rounded bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="h-44 rounded-xl bg-muted/70" />
        <div className="space-y-2.5">
          {[96, 88, 70].map((w, i) => (
            <div key={i} className="h-3.5 rounded bg-muted" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  )
}

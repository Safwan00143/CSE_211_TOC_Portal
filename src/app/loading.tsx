import { PageLoading } from "@/components/page-loading"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
      <PageLoading label="Loading…" />
    </div>
  )
}

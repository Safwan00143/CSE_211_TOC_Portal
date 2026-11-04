import { PageLoading } from "@/components/page-loading"

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 lg:pt-14">
      <PageLoading label="Loading questions…" />
    </div>
  )
}

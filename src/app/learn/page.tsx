import { redirect } from "next/navigation"
import { topics } from "@/content/topics"

export default function LearnIndex() {
  redirect(`/learn/${topics[0].slug}`)
}

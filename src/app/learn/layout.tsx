import { SidebarShell } from "@/components/sidebar-shell"
import { TopicNav } from "@/components/topic-nav"

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <SidebarShell left={<TopicNav base="/learn" />}>{children}</SidebarShell>
}

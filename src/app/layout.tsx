import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { SiteHeader } from "@/components/site-header"
import { NavLoader } from "@/components/nav-loader"
import "katex/dist/katex.min.css"
import "./globals.css"

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Theory of Computation — CSE 211",
    template: "%s · Theory of Computation",
  },
  description:
    "Topic-wise notes for CSE 211 (Theory of Computation) with worked solutions to previous term-final questions.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NavLoader />
          <SiteHeader />
          <main>{children}</main>
          <footer className="mt-24 border-t border-border">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-10 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>CSE 211 · Theory of Computation · BUET</p>
              <p>Notes follow the lecture slides. Solutions are worked answers for practice, not official keys.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

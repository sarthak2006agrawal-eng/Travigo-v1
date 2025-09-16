import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { PageTransition } from "@/components/page-transition"
import { ProgressBreadcrumb } from "@/components/progress-breadcrumb"
import "./globals.css"

export const metadata: Metadata = {
  title: "Travigo - AI-Powered Travel Planning",
  description:
    "Plan your perfect trip with AI-powered itinerary generation, interactive maps, and smart travel assistance.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
            <ProgressBreadcrumb />
            <PageTransition>{children}</PageTransition>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

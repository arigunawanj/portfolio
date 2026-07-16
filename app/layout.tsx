import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

import { prisma } from "@/lib/prisma"

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } })
  return {
    title: profile?.metaTitle || "Ari Gunawan Jatmiko | Portfolio",
    description: profile?.metaDescription || "Professional portfolio",
    keywords: profile?.metaKeywords || "",
    icons: {
      icon: profile?.faviconUrl || "/favicon.ico",
      shortcut: profile?.faviconUrl || "/favicon.ico",
      apple: profile?.faviconUrl || "/favicon.ico",
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}

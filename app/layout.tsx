import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cache } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

import { prisma } from "@/lib/prisma"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arigunawanj.com"

const getProfile = cache(() => prisma.siteProfile.findUnique({ where: { id: 1 } }))

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile()
  const title = profile?.metaTitle || "Ari Gunawan Jatmiko | Portfolio"
  const description = profile?.metaDescription || "Professional portfolio"
  const image = profile?.photoUrl || "/foto/10.jpg"

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: profile?.metaKeywords || "",
    authors: profile?.name ? [{ name: profile.name }] : undefined,
    alternates: {
      canonical: siteUrl,
    },
    icons: {
      icon: profile?.faviconUrl || "/favicon.ico",
      shortcut: profile?.faviconUrl || "/favicon.ico",
      apple: profile?.faviconUrl || "/favicon.ico",
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: profile?.name || "Ari Gunawan Jatmiko",
      images: [{ url: image }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()

  const jsonLd = profile
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: profile.name,
        jobTitle: profile.role,
        url: siteUrl,
        image: new URL(profile.photoUrl || "/foto/10.jpg", siteUrl).toString(),
        email: profile.email || undefined,
        sameAs: [
          profile.githubUrl,
          profile.linkedinUrl,
          profile.instagramUrl,
          profile.twitterUrl,
          profile.gitlabUrl,
        ].filter(Boolean),
      }
    : null

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}

import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arigunawanj.com"

  const [profile, latestProject] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 }, select: { updatedAt: true } }),
    prisma.project.findFirst({ where: { published: true }, orderBy: { updatedAt: "desc" }, select: { updatedAt: true } }),
  ])

  const timestamps = [profile?.updatedAt, latestProject?.updatedAt].filter((d): d is Date => Boolean(d))
  const lastModified = timestamps.length > 0 ? new Date(Math.max(...timestamps.map((d) => d.getTime()))) : new Date()

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}

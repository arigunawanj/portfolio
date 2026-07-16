import { prisma } from "@/lib/prisma"
import { AboutCategory } from "@prisma/client"
import AboutClient from "./about-client"

export default async function AboutAdminPage() {
  const [professional, personal, funFacts] = await Promise.all([
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PROFESSIONAL }, orderBy: { order: "asc" } }),
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PERSONAL }, orderBy: { order: "asc" } }),
    prisma.funFact.findMany({ orderBy: { order: "asc" } }),
  ])

  return (
    <AboutClient
      professional={professional}
      personal={personal}
      funFacts={funFacts}
    />
  )
}

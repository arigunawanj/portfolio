import { prisma } from "@/lib/prisma"
import { mapPortfolioData } from "@/lib/portfolio-data"
import { getAppearance } from "@/app/admin/actions/appearance"
import { Portfolio3D } from "@/components/portfolio/portfolio-3d"

export default async function Home() {
  const [profile, projects, experiences, education, certifications, techCategories, aboutTraits, funFacts, appearance] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.techCategory.findMany({ orderBy: { order: "asc" }, include: { skills: { orderBy: { order: "asc" } } } }),
    prisma.aboutTrait.findMany({ orderBy: { order: "asc" } }),
    prisma.funFact.findMany({ orderBy: { order: "asc" } }),
    getAppearance(),
  ])

  const data = mapPortfolioData({ profile, projects, experiences, education, certifications, techCategories, aboutTraits, funFacts })

  return <Portfolio3D data={data} appearance={{ motionLevel: appearance.motionLevel, enable3D: appearance.enable3D, accentColor: appearance.accentColor }} />
}

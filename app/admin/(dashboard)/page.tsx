import { prisma } from "@/lib/prisma"
import DashboardClient from "@/components/admin/dashboard-client"

export default async function AdminDashboard() {
  const [
    projects,
    experience,
    education,
    certifications,
    techCategories,
    traits,
    users,
    profile
  ] = await Promise.all([
    prisma.project.count(),
    prisma.workExperience.count(),
    prisma.education.count(),
    prisma.certification.count(),
    prisma.techCategory.count(),
    prisma.aboutTrait.count(),
    prisma.adminUser.count(),
    prisma.siteProfile.findFirst(),
  ])

  return (
    <DashboardClient
      counts={{
        projects,
        experience,
        education,
        certifications,
        techCategories,
        traits,
        users
      }}
      profile={profile}
    />
  )
}

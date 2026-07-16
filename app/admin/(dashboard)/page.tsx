import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDashboard() {
  const [projects, experience, education, certifications, techCategories, traits, users] = await Promise.all([
    prisma.project.count(),
    prisma.workExperience.count(),
    prisma.education.count(),
    prisma.certification.count(),
    prisma.techCategory.count(),
    prisma.aboutTrait.count(),
    prisma.adminUser.count(),
  ])

  const cards = [
    { label: "Projects", count: projects, href: "/admin/projects" },
    { label: "Work Experience", count: experience, href: "/admin/experience" },
    { label: "Education", count: education, href: "/admin/education" },
    { label: "Certifications", count: certifications, href: "/admin/certifications" },
    { label: "Tech Categories", count: techCategories, href: "/admin/tech-stack" },
    { label: "About Traits", count: traits, href: "/admin/about" },
    { label: "Admin Users", count: users, href: "/admin/users" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="text-base font-medium">{c.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{c.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

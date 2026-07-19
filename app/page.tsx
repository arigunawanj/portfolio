import { prisma } from "@/lib/prisma"
import SiteNav from "@/components/site-nav"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import TechStack from "@/components/tech-stack"
import WorkExperience from "@/components/work-experience"
import Education from "@/components/education"
import Certification from "@/components/certification"
import Contact from "@/components/contact"

export default async function Home() {
  const [profile, projects, experiences, education, certifications, techCategories] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.techCategory.findMany({ orderBy: { order: "asc" }, include: { skills: { orderBy: { order: "asc" } } } }),
  ])

  const technologies = Object.fromEntries(
    techCategories.map((cat) => [
      cat.key,
      {
        icon: cat.icon,
        title: cat.title,
        description: cat.description,
        skills: cat.skills.map((s) => ({ name: s.name, level: s.level })),
      },
    ])
  )

  const mappedProjects = projects.map((p) => ({
    id: p.id,
    title: p.title,
    shortDescription: p.shortDescription,
    description: p.description,
    images: p.images as string[],
    tags: p.tags as string[],
    features: p.features as string[],
    demoLink: p.demoLink ?? "#",
    githubLink: p.githubLink ?? "#",
    fullDescription: p.fullDescription,
    color: p.color,
  }))

  return (
    <div className="relative min-h-screen w-full bg-[#0B1020] text-foreground font-jetbrains overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-grid-subtle pointer-events-none z-0" />
      <div className="fixed inset-0 noise-overlay pointer-events-none z-0" />
      <div className="fixed -top-[300px] left-1/3 w-[600px] h-[600px] bg-[#4F8CFF]/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-[200px] right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/[0.06] rounded-full blur-[120px] pointer-events-none z-0" />

      <SiteNav name={profile?.name || "Ari Gunawan Jatmiko"} />

      <main className="relative z-10">
        {profile && <Hero profile={profile} />}
        <Projects projects={mappedProjects} />
        <TechStack technologies={technologies} />
        <WorkExperience
          experiences={experiences.map((e) => ({
            id: e.id,
            position: e.position,
            company: e.company,
            duration: e.duration,
            location: e.location,
            description: e.description as string[],
            skills: e.skills as string[],
            companyUrl: e.companyUrl ?? "#",
            color: e.color,
          }))}
        />
        <Education
          education={education.map((ed) => ({
            id: ed.id,
            degree: ed.degree,
            institution: ed.institution,
            duration: ed.duration,
            location: ed.location,
            description: ed.description,
            achievements: ed.achievements as string[],
            courses: ed.courses as string[],
            thesis:
              ed.thesisTitle || ed.thesisAdvisor || ed.thesisAbstract
                ? {
                    title: ed.thesisTitle ?? "",
                    advisor: ed.thesisAdvisor ?? "",
                    abstract: ed.thesisAbstract ?? "",
                  }
                : null,
            color: ed.color,
          }))}
        />
        <Certification
          certifications={certifications.map((c) => ({
            id: c.id,
            name: c.name,
            issuer: c.issuer,
            date: c.date,
            description: c.description,
            credentialId: c.credentialId ?? "",
            credentialUrl: c.credentialUrl ?? "#",
            skills: c.skills as string[],
            color: c.color,
            icon: c.icon,
          }))}
        />
        {profile && <Contact profile={profile} />}
      </main>
    </div>
  )
}

import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import Hero from "@/components/hero"
import About from "@/components/about"
import TechStack from "@/components/tech-stack"
import Projects from "@/components/projects"
import WorkExperience from "@/components/work-experience"
import Education from "@/components/education"
import Certification from "@/components/certification"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { AboutCategory } from "@prisma/client"

export default async function Home() {
  const [
    profile,
    projects,
    experiences,
    education,
    certifications,
    techCategories,
    professionalSkills,
    personalTraits,
    funFactRows,
  ] = await Promise.all([
    prisma.siteProfile.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
    prisma.techCategory.findMany({ orderBy: { order: "asc" }, include: { skills: { orderBy: { order: "asc" } } } }),
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PROFESSIONAL }, orderBy: { order: "asc" } }),
    prisma.aboutTrait.findMany({ where: { category: AboutCategory.PERSONAL }, orderBy: { order: "asc" } }),
    prisma.funFact.findMany({ orderBy: { order: "asc" } }),
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoUrl={profile?.logoUrl} siteName={profile?.name} />
      <main>
        {profile && (
          <Hero
            profile={{
              name: profile.name,
              role: profile.role,
              heroBadge: profile.heroBadge,
              heroDescription: profile.heroDescription,
              photoUrl: profile.photoUrl,
              githubUrl: profile.githubUrl,
              linkedinUrl: profile.linkedinUrl,
            }}
          />
        )}
        <About
          professionalSkills={professionalSkills.map((t) => ({ icon: t.icon, title: t.title, description: t.description }))}
          personalTraits={personalTraits.map((t) => ({ icon: t.icon, title: t.title, description: t.description }))}
          funFacts={funFactRows.map((f) => f.text)}
        />
        <TechStack technologies={technologies} />
        <Projects
          projects={projects.map((p) => ({
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
          }))}
        />
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
        {profile && (
          <Contact
            profile={{
              email: profile.email,
              phone: profile.phone,
              location: profile.location,
              githubUrl: profile.githubUrl,
              linkedinUrl: profile.linkedinUrl,
              instagramUrl: profile.instagramUrl,
              gitlabUrl: profile.gitlabUrl,
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  )
}

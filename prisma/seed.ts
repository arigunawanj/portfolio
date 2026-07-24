import { PrismaClient, AboutCategory } from "@prisma/client"
import { projects } from "../data/projects"
import { experiences } from "../data/work-experience"
import { education } from "../data/education"
import { certifications } from "../data/certifications"
import { technologies } from "../data/tech-stack"
import { professionalSkills, personalTraits, funFacts } from "../data/about"

const prisma = new PrismaClient()

async function main() {
  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Ari Gunawan Jatmiko",
      role: "Software Developer",
      heroBadge: "Available for New Projects",
      heroDescription:
        "Specialized in building high-performance web applications that are scalable, secure, and lightning fast. Turning complex problems into elegant digital solutions.",
      photoUrl: "/foto/10.jpg",
      email: "arigunawanjatmiko@gmail.com",
      phone: "+62 81 588 28 916",
      location: "Malang, Indonesia",
      githubUrl: "https://github.com/arigunawanj",
      linkedinUrl: "https://www.linkedin.com/in/arigunawanj/",
      instagramUrl: "http://instagram.com/arigunawanj/",
      gitlabUrl: "https://gitlab.com/arigunawanj",
      metaTitle: "Ari Gunawan Jatmiko | Portfolio",
      metaDescription:
        "Professional portfolio of Ari Gunawan Jatmiko - Full Stack Web Developer",
      faviconUrl: "/favicon.ico",
      logoUrl: "/placeholder-logo.svg",
      metaKeywords: "portfolio, software developer, full stack developer, web developer",
    },
  })

  if ((await prisma.project.count()) === 0) {
    for (const [i, p] of projects.entries()) {
      await prisma.project.create({
        data: {
          title: p.title,
          shortDescription: p.shortDescription,
          description: p.description,
          fullDescription: p.fullDescription,
          images: p.images,
          tags: p.tags,
          features: p.features,
          demoLink: p.demoLink,
          githubLink: p.githubLink,
          color: p.color,
          order: i,
        },
      })
    }
  }

  if ((await prisma.workExperience.count()) === 0) {
    for (const [i, e] of experiences.entries()) {
      await prisma.workExperience.create({
        data: {
          position: e.position,
          company: e.company,
          duration: e.duration,
          location: e.location,
          description: e.description,
          skills: e.skills,
          companyUrl: e.companyUrl,
          color: e.color,
          order: i,
        },
      })
    }
  }

  if ((await prisma.education.count()) === 0) {
    for (const [i, ed] of education.entries()) {
      await prisma.education.create({
        data: {
          degree: ed.degree,
          institution: ed.institution,
          duration: ed.duration,
          location: ed.location,
          description: ed.description,
          achievements: ed.achievements,
          courses: ed.courses,
          thesisTitle: ed.thesis?.title,
          thesisAdvisor: ed.thesis?.advisor,
          thesisAbstract: ed.thesis?.abstract,
          color: ed.color,
          order: i,
        },
      })
    }
  }

  if ((await prisma.certification.count()) === 0) {
    for (const [i, c] of certifications.entries()) {
      await prisma.certification.create({
        data: {
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          description: c.description,
          credentialId: c.credentialId,
          credentialUrl: c.credentialUrl,
          skills: c.skills,
          color: c.color,
          icon: c.icon,
          order: i,
        },
      })
    }
  }

  if ((await prisma.techCategory.count()) === 0) {
    let order = 0
    for (const [key, cat] of Object.entries(technologies)) {
      const created = await prisma.techCategory.create({
        data: {
          key,
          icon: cat.icon,
          title: cat.title,
          description: cat.description,
          order: order++,
        },
      })
      for (const [i, s] of cat.skills.entries()) {
        await prisma.techSkill.create({
          data: {
            categoryId: created.id,
            name: s.name,
            level: s.level,
            order: i,
          },
        })
      }
    }
  }

  if ((await prisma.aboutTrait.count()) === 0) {
    let order = 0
    for (const t of professionalSkills) {
      await prisma.aboutTrait.create({
        data: {
          category: AboutCategory.PROFESSIONAL,
          icon: t.icon,
          title: t.title,
          description: t.description,
          order: order++,
        },
      })
    }
    order = 0
    for (const t of personalTraits) {
      await prisma.aboutTrait.create({
        data: {
          category: AboutCategory.PERSONAL,
          icon: t.icon,
          title: t.title,
          description: t.description,
          order: order++,
        },
      })
    }
  }

  if ((await prisma.funFact.count()) === 0) {
    for (const [i, text] of funFacts.entries()) {
      await prisma.funFact.create({ data: { text, order: i } })
    }
  }

  await prisma.appearance.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  })

  console.log("Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

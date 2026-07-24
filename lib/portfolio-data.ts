export type SkillVM = { name: string; level: number }
export type TechCategoryVM = { key: string; icon: string; title: string; description: string; skills: SkillVM[] }
export type ProjectVM = {
  id: number; title: string; shortDescription: string; description: string
  fullDescription: string; images: string[]; tags: string[]; features: string[]
  demoLink: string; githubLink: string; color: string
}
export type ExperienceVM = {
  position: string; company: string; duration: string; location: string
  description: string[]; skills: string[]; companyUrl: string | null; color: string
}
export type EducationVM = {
  degree: string; institution: string; duration: string; location: string
  description: string; achievements: string[]; courses: string[]; color: string
}
export type CertVM = { name: string; issuer: string; date: string; description: string; credentialUrl: string | null; skills: string[]; icon: string; color: string }
export type AboutTraitVM = { category: string; icon: string; title: string; description: string }
export type ContactVM = {
  name: string; role: string; heroBadge: string; heroDescription: string; photoUrl: string
  email: string; phone: string | null; location: string | null
  githubUrl: string | null; linkedinUrl: string | null; instagramUrl: string | null
  gitlabUrl: string | null; twitterUrl: string | null
}
export type PortfolioData = {
  contact: ContactVM
  tech: TechCategoryVM[]
  projects: ProjectVM[]
  experiences: ExperienceVM[]
  education: EducationVM[]
  certifications: CertVM[]
  aboutTraits: AboutTraitVM[]
  funFacts: string[]
}

const arr = (v: unknown): any[] => (Array.isArray(v) ? v : [])
const str = (v: unknown): string => (typeof v === "string" ? v : "")

export function mapPortfolioData(raw: any): PortfolioData {
  const p = raw.profile
  return {
    contact: {
      name: p?.name ?? "Ari Gunawan Jatmiko",
      role: p?.role ?? "Full Stack Web Developer",
      heroBadge: p?.heroBadge ?? "",
      heroDescription: p?.heroDescription ?? "",
      photoUrl: p?.photoUrl ?? "/foto/10.jpg",
      email: p?.email ?? "",
      phone: p?.phone ?? null,
      location: p?.location ?? null,
      githubUrl: p?.githubUrl ?? null,
      linkedinUrl: p?.linkedinUrl ?? null,
      instagramUrl: p?.instagramUrl ?? null,
      gitlabUrl: p?.gitlabUrl ?? null,
      twitterUrl: p?.twitterUrl ?? null,
    },
    tech: arr(raw.techCategories).map((c: any) => ({
      key: c.key, icon: c.icon, title: c.title, description: c.description,
      skills: arr(c.skills).map((s: any) => ({ name: s.name, level: s.level })),
    })),
    projects: arr(raw.projects).map((p: any) => ({
      id: p.id, title: p.title, shortDescription: p.shortDescription, description: p.description,
      fullDescription: p.fullDescription, images: arr(p.images), tags: arr(p.tags), features: arr(p.features),
      demoLink: p.demoLink || "#", githubLink: p.githubLink || "#", color: p.color,
    })),
    experiences: arr(raw.experiences).map((e: any) => ({
      position: e.position, company: e.company, duration: e.duration, location: e.location,
      description: arr(e.description), skills: arr(e.skills), companyUrl: e.companyUrl ?? null, color: e.color,
    })),
    education: arr(raw.education).map((e: any) => ({
      degree: e.degree, institution: e.institution, duration: e.duration, location: e.location,
      description: str(e.description), achievements: arr(e.achievements), courses: arr(e.courses), color: e.color,
    })),
    certifications: arr(raw.certifications).map((c: any) => ({
      name: c.name, issuer: c.issuer, date: c.date, description: c.description,
      credentialUrl: c.credentialUrl ?? null, skills: arr(c.skills), icon: c.icon, color: c.color,
    })),
    aboutTraits: arr(raw.aboutTraits).map((t: any) => ({
      category: String(t.category), icon: t.icon, title: t.title, description: t.description,
    })),
    funFacts: arr(raw.funFacts).map((f: any) => str(f.text)),
  }
}

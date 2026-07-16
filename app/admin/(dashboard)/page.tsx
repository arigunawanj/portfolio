import { prisma } from "@/lib/prisma"
import DashboardGrid from "@/components/admin/dashboard-grid"
import { Shield, Sparkles, Database, CheckCircle2, Award, Eye, Settings } from "lucide-react"
import Link from "next/link"

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

  const cards = [
    { label: "Projects", count: projects, href: "/admin/projects", color: "from-blue-500 to-cyan-500" },
    { label: "Work Experience", count: experience, href: "/admin/experience", color: "from-purple-500 to-pink-500" },
    { label: "Education", count: education, href: "/admin/education", color: "from-emerald-500 to-teal-500" },
    { label: "Certifications", count: certifications, href: "/admin/certifications", color: "from-amber-500 to-orange-500" },
    { label: "Tech Stack", count: techCategories, href: "/admin/tech-stack", color: "from-violet-500 to-fuchsia-500" },
    { label: "About Traits", count: traits, href: "/admin/about", color: "from-rose-500 to-red-500" },
    { label: "Admin Users", count: users, href: "/admin/users", color: "from-slate-500 to-zinc-500" },
  ]

  // System statistics checks
  const hasSEO = !!(profile?.metaKeywords && profile?.heroDescription)
  const hasSocials = !!(profile?.githubUrl || profile?.linkedinUrl)
  const hasCustomLogo = !!profile?.logoUrl && profile.logoUrl !== "/placeholder-logo.svg"

  return (
    <div className="space-y-8">
      {/* Dynamic Welcoming Cockpit Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/30 via-card/10 to-card/40 p-6 sm:p-8 backdrop-blur-md dark:bg-black/20 dark:border-white/5 shadow-xl">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Greeting text info */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> Antigravity Core
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Hello, <span className="text-gradient">{profile?.name || "Administrator"}</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Your system console is connected. All engines are running smoothly. From here you can sort projects, tweak SEO indexes, and manage content live.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2.5">
              <ButtonAsChildLink href="/admin/profile" label="Configure Branding & SEO" icon={Settings} />
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-9 rounded-xl border border-border/80 bg-background/50 hover:bg-muted text-xs font-bold transition-all"
              >
                <Eye className="h-4 w-4" /> Live Website
              </a>
            </div>
          </div>

          {/* System status widgets */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-1.5 backdrop-blur-sm dark:bg-black/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">System Status</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-black text-foreground">ONLINE</span>
              </div>
              <p className="text-[9px] text-muted-foreground/80">API response: 100%</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-1.5 backdrop-blur-sm dark:bg-black/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SEO Indexing</p>
              <div className="flex items-center gap-1.5">
                {hasSEO ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-black text-foreground">READY</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <span className="text-xs font-black text-foreground">WARN</span>
                  </>
                )}
              </div>
              <p className="text-[9px] text-muted-foreground/80">{hasSEO ? "Meta settings set" : "Fill meta values"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-1.5 backdrop-blur-sm dark:bg-black/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Social Links</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-black text-foreground">{hasSocials ? "LINKED" : "EMPTY"}</span>
              </div>
              <p className="text-[9px] text-muted-foreground/80">{hasSocials ? "GitHub / LinkedIn set" : "No socials configured"}</p>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/40 space-y-1.5 backdrop-blur-sm dark:bg-black/40">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Custom Logo</p>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-black text-foreground">{hasCustomLogo ? "ACTIVE" : "DEFAULT"}</span>
              </div>
              <p className="text-[9px] text-muted-foreground/80">{hasCustomLogo ? "Branded Logo loaded" : "Placeholder logo set"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Portfolio Modules</h2>
        <DashboardGrid cards={cards} />
      </div>
    </div>
  )
}

function ButtonAsChildLink({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 h-9 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold transition-all shadow-md shadow-primary/10 hover:shadow-primary/20"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}

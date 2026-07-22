"use client"

import { motion } from "framer-motion"
import { ArrowRight, Download, MapPin } from "lucide-react"
import { Terminal, TypingAnimation, AnimatedSpan } from "@/components/ui/terminal"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { BorderBeam } from "@/components/ui/border-beam"
import { NumberTicker } from "@/components/ui/number-ticker"

type HeroProfile = {
  name: string
  role: string
  heroBadge: string
  heroDescription: string
  photoUrl: string
  location?: string | null
  githubUrl: string | null
  linkedinUrl: string | null
}

type HeroStats = {
  yearsExperience: number
  projectsShipped: number
  certifications: number
}

const FAVORITE_TECH = ["Next.js", "Laravel", "TypeScript", "React", "Docker", "PostgreSQL", "Redis", "AWS"]

export default function Hero({ profile, stats }: { profile: HeroProfile; stats: HeroStats }) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 font-jetbrains overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Text column */}
        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-7 text-left"
        >
          <Terminal className="max-w-sm mb-6 text-xs" sequence={false}>
            <TypingAnimation duration={50}>$ whoami</TypingAnimation>
            <AnimatedSpan delay={900} className="text-[#4F8CFF] font-bold">
              → {profile.name}
            </AnimatedSpan>
            <AnimatedSpan delay={1200} className="text-muted-foreground">
              role: {profile.role}
            </AnimatedSpan>
            <AnimatedSpan delay={1500} className="text-[#22C55E]">
              ✓ available for new projects
            </AnimatedSpan>
          </Terminal>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-departure font-black text-white leading-tight tracking-tight text-balance">
            {profile.name}
          </h1>
          <p className="text-base md:text-lg font-departure text-[#4F8CFF] font-bold tracking-wide mt-3">
            {profile.role}
          </p>
          {profile.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 font-ibm font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#4F8CFF]" />
              <span>{profile.location}</span>
            </div>
          )}

          <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed font-jetbrains max-w-xl mt-5 text-pretty">
            {profile.heroDescription || "Building scalable products and high-performance applications."}
          </p>

          <div className="flex items-center gap-2 py-1.5 px-3.5 mt-5 bg-[#22C55E]/5 border border-[#22C55E]/15 rounded-lg w-fit">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[11px] font-bold text-[#22C55E] tracking-wider uppercase font-ibm">
              {profile.heroBadge || "Available for Opportunities"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-6">
            <ShimmerButton
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              background="#4F8CFF"
              shimmerColor="#ffffff"
              className="text-sm font-departure font-bold px-5 py-2.5"
            >
              <span className="flex items-center gap-2">
                Explore Projects
                <ArrowRight className="w-4 h-4" />
              </span>
            </ShimmerButton>
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-5 py-2.5 bg-[#161D2F] hover:bg-white/4 border border-white/6 text-white rounded-lg text-sm font-departure font-bold transition-all scale-100 hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              Download CV
              <Download className="w-4 h-4" />
            </a>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-8 mt-8 border-t border-white/5">
            <div>
              <div className="text-2xl font-departure font-black text-white flex items-baseline gap-0.5">
                <NumberTicker value={stats.yearsExperience} className="text-white" />
                <span className="text-[#4F8CFF]">+</span>
              </div>
              <span className="text-[9px] font-bold text-muted-foreground/60 tracking-widest font-departure uppercase">
                Years Experience
              </span>
            </div>
            <div>
              <div className="text-2xl font-departure font-black text-white">
                <NumberTicker value={stats.projectsShipped} className="text-white" />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground/60 tracking-widest font-departure uppercase">
                Projects Shipped
              </span>
            </div>
            <div>
              <div className="text-2xl font-departure font-black text-white">
                <NumberTicker value={stats.certifications} className="text-white" />
              </div>
              <span className="text-[9px] font-bold text-muted-foreground/60 tracking-widest font-departure uppercase">
                Certifications
              </span>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/5">
            <span className="text-[9px] font-bold text-muted-foreground/60 tracking-widest font-departure block mb-2.5">
              FAVORITE TECHNOLOGIES
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FAVORITE_TECH.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 bg-[#121826]/60 border border-white/5 text-[11px] text-muted-foreground hover:text-white hover:border-[#4F8CFF]/30 rounded transition-all font-ibm font-medium cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Photo column */}
        <motion.div
          initial={{ scale: 0.94 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:col-span-5 flex justify-center lg:justify-end"
        >
          <div className="w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 relative flex items-center justify-center select-none">
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-[#4F8CFF]/20 to-[#8B5CF6]/20 blur-2xl" />
            <div className="absolute inset-3 rounded-full border border-dashed border-[#4F8CFF]/30 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-6 rounded-full overflow-hidden border-4 border-[#121826] bg-[#121826] shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative z-10">
              <img
                src={profile.photoUrl || "/placeholder-user.jpg"}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              <BorderBeam size={80} duration={8} colorFrom="#4F8CFF" colorTo="#8B5CF6" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

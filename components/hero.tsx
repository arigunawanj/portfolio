"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Download, MapPin } from "lucide-react"

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

const FAVORITE_TECH = ["Next.js", "Laravel", "TypeScript", "React", "Docker", "PostgreSQL", "Redis", "AWS"]

export default function Hero({ profile }: { profile: HeroProfile }) {
  const [typedText, setTypedText] = useState("")
  const targetCommand = "whoami"

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index++
      setTypedText(targetCommand.substring(0, index))
      if (index >= targetCommand.length) clearInterval(interval)
    }, 90)
    return () => clearInterval(interval)
  }, [])

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
          <div className="flex items-center gap-2 text-xs md:text-sm mb-5 font-departure text-white/50">
            <span className="text-[#22C55E]">ari@portfolio</span>
            <span>:</span>
            <span className="text-[#8B5CF6]">~$</span>
            <span className="text-white font-bold">
              {typedText}
              <span className="terminal-cursor" />
            </span>
          </div>

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

          <div className="flex flex-wrap gap-3 pt-6">
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white rounded-lg text-sm font-departure font-bold shadow-[0_4px_15px_rgba(79,140,255,0.25)] transition-all scale-100 hover:scale-[1.02] active:scale-95"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-5 py-2.5 bg-[#161D2F] hover:bg-white/4 border border-white/6 text-white rounded-lg text-sm font-departure font-bold transition-all scale-100 hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              Download CV
              <Download className="w-4 h-4" />
            </a>
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

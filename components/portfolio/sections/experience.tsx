"use client"

import { motion } from "framer-motion"
import type { ExperienceVM, EducationVM, CertVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"
import { GitCommit, Briefcase, GraduationCap, Award, Calendar, MapPin } from "lucide-react"

export function Experience({ experiences, education, certifications }: { experiences: ExperienceVM[]; education: EducationVM[]; certifications: CertVM[] }) {
  // Update mouse coordinates for cursor spot glowing
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--mouse-x", `${x}px`)
    el.style.setProperty("--mouse-y", `${y}px`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  }

  return (
    <section data-scene="experience" id="experience-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <SectionHead index="03" tag="// git.log --history" title="Block History" />

        {/* Experience Timeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative border-l-2 pl-8 space-y-12 ml-6 sm:ml-8" 
          style={{ borderColor: "var(--pf-line)" }}
        >
          {/* Pulsing indicator at timeline start */}
          <div className="absolute -top-1.5 -left-[7px] w-3 h-3 rounded-full bg-primary animate-ping" />
          
          {experiences.map((e, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="relative group/timeline-item"
            >
              {/* Timeline dot consensus commitment indicator */}
              <span className="absolute -left-[48px] top-6 w-8 h-8 rounded-full border border-primary/20 bg-[#080b11]/90 flex items-center justify-center shadow-lg backdrop-blur-md z-20">
                <GitCommit className="h-4 w-4 text-primary group-hover/timeline-item:rotate-45 transition duration-300" />
              </span>

              <div 
                onMouseMove={handleMouseMove}
                className="pf-panel p-6 rounded-2xl border border-white/5"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.5)",
                  position: "relative"
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 font-mono-pf text-xs">
                  <div className="flex items-center gap-1.5 font-bold" style={{ color: "var(--pf-teal-glow)" }}>
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{e.company}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: "var(--pf-muted-fg)" }}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{e.duration}</span>
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-bold tracking-tight mb-4" style={{ color: "var(--pf-cream)" }}>
                  {e.position}
                </h3>
                
                <ul className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>
                  {e.description.slice(0, 4).map((d, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="font-mono-pf font-black" style={{ color: "var(--pf-coral)" }}>+</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Education & Certifications Side-by-Side grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {/* Education list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="pf-label mb-6 flex items-center gap-2 font-bold">
              <GraduationCap className="h-4 w-4 text-primary animate-pulse" />
              <span>// immutable.education</span>
            </div>
            <div className="space-y-4">
              {education.map((ed, i) => (
                <div 
                  key={i} 
                  onMouseMove={handleMouseMove}
                  className="pf-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between" 
                  style={{ borderRadius: 16 }}
                >
                  <div>
                    <p className="font-bold font-heading text-base" style={{ color: "var(--pf-cream)" }}>{ed.degree}</p>
                    <p className="font-mono-pf text-[11px] mt-2 flex items-center gap-1.5" style={{ color: "var(--pf-teal-glow)" }}>
                      <span>{ed.institution}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between font-mono-pf text-[10px] mt-4 pt-3 border-t border-white/5" style={{ color: "var(--pf-muted-fg)" }}>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {ed.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {ed.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="pf-label mb-6 flex items-center gap-2 font-bold">
              <Award className="h-4 w-4 text-primary animate-pulse" />
              <span>// signed.certifications</span>
            </div>
            <div className="space-y-4">
              {certifications.map((c, i) => (
                <div 
                  key={i} 
                  onMouseMove={handleMouseMove}
                  className="pf-panel p-5 rounded-2xl border border-white/5 flex flex-col justify-between" 
                  style={{ borderRadius: 16 }}
                >
                  <div>
                    <p className="font-bold font-heading text-base" style={{ color: "var(--pf-cream)" }}>{c.name}</p>
                    <p className="font-mono-pf text-[11px] mt-2 flex items-center gap-1.5" style={{ color: "var(--pf-teal-glow)" }}>
                      <span>{c.issuer}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between font-mono-pf text-[10px] mt-4 pt-3 border-t border-white/5" style={{ color: "var(--pf-muted-fg)" }}>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Issued: {c.date}</span>
                    {c.credentialUrl && c.credentialUrl !== "#" && (
                      <a href={c.credentialUrl} target="_blank" rel="noreferrer" className="underline hover:text-primary transition">VERIFY ↗</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

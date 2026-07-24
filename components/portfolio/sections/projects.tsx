"use client"

import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ProjectVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"
import { BorderBeam } from "@/components/ui/border-beam"
import { Github, ExternalLink, Blocks } from "lucide-react"
import { toast } from "sonner"

export function Projects({ 
  projects, 
  onAuditProject 
}: { 
  projects: ProjectVM[]; 
  onAuditProject?: (id: number) => void 
}) {
  const [activeProject, setActiveProject] = useState<ProjectVM | null>(null)

  // Update mouse position CSS variables on hover for spotlight gradients
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
      transition: { staggerChildren: 0.15 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 15 }
    }
  }

  return (
    <section data-scene="projects" id="projects-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead index="02" tag="// ledger.deployments" title="Block Projects" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8"
        >
          {projects.map((p, i) => (
            <motion.article 
              key={p.id} 
              variants={cardVariants}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => onAuditProject?.(p.id)}
              className="group pf-panel pf-brackets overflow-hidden flex flex-col justify-between rounded-3xl border border-white/5 cursor-pointer"
              onClick={() => setActiveProject(p)}
              style={{ 
                borderRadius: 24,
                position: "relative"
              }}
            >
              {/* Highlight Neon Border Effect */}
              {i === 0 && <BorderBeam size={160} duration={8} delay={2} colorFrom="#6366f1" colorTo="#14b8a6" />}

              <div>
                {/* Spotlight glow effect */}
                <div className="pf-spotlight" aria-hidden />

                {/* Hero project preview image */}
                {p.images && p.images[0] && (
                  <div className="relative h-44 w-full overflow-hidden border-b border-white/5" style={{ background: "var(--pf-bg-deep)" }}>
                    <Image 
                      src={p.images[0]} 
                      alt={p.title} 
                      fill 
                      sizes="(max-w-768px) 100vw, 50vw"
                      className="object-cover opacity-40 grayscale contrast-125 saturate-50 group-hover:grayscale-0 group-hover:saturate-100 group-hover:scale-[1.03] group-hover:opacity-85 transition-all duration-700" 
                    />
                  </div>
                )}

                {/* Project Contents */}
                <div className="p-6 space-y-4">
                  <h3 className="font-heading text-2xl font-bold tracking-tight" style={{ color: "var(--pf-cream)" }}>
                    {p.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>
                    {p.shortDescription}
                  </p>
                  
                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tags.slice(0, 5).map((t) => (
                      <span 
                        key={t} 
                        className="font-mono-pf text-[10px] px-2.5 py-0.5 rounded-md border" 
                        style={{ 
                          borderColor: "var(--pf-line)", 
                          color: "var(--pf-teal-glow)",
                          background: "rgba(20, 184, 166, 0.05)"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions Links */}
              <div className="p-6 pt-0 mt-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-5 font-mono-pf text-xs pt-4 border-t" style={{ borderColor: "var(--pf-line)" }}>
                  {p.demoLink && p.demoLink !== "#" && (
                    <a 
                      href={p.demoLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="pf-focusable flex items-center gap-1 cursor-pointer font-bold transition hover:opacity-80" 
                      style={{ color: "var(--pf-coral)" }}
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> LIVE_DEMO
                    </a>
                  )}
                  {p.githubLink && p.githubLink !== "#" && (
                    <a 
                      href={p.githubLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="pf-focusable flex items-center gap-1 cursor-pointer font-bold transition hover:opacity-80" 
                      style={{ color: "var(--pf-sand)" }}
                    >
                      <Github className="h-3.5 w-3.5" /> SOURCE_CODE
                    </a>
                  )}
                  <button 
                    onClick={() => setActiveProject(p)}
                    className="pf-focusable flex items-center gap-1 cursor-pointer font-bold transition hover:opacity-80 ml-auto" 
                    style={{ color: "var(--pf-teal-glow)" }}
                  >
                    <Blocks className="h-3.5 w-3.5 animate-pulse" /> AUDIT_DETAILS
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Project Details Modal Popup */}
      <AnimatePresence>
        {activeProject && (
          <ProjectDetailModal 
            project={activeProject} 
            onClose={() => setActiveProject(null)} 
            onAudit={() => onAuditProject?.(activeProject.id)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

interface ProjectDetailModalProps {
  project: ProjectVM
  onClose: () => void
  onAudit: () => void
}

function ProjectDetailModal({ project, onClose, onAudit }: ProjectDetailModalProps) {
  const [scanStatus, setScanStatus] = useState<"idle" | "scanning" | "success">("idle")
  const [scanProgress, setScanProgress] = useState(0)

  const handleStartScan = () => {
    setScanStatus("scanning")
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          setScanStatus("success")
          onAudit()
          return 100
        }
        return p + 20
      })
    }, 150)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl p-6 rounded-3xl border border-white/10 bg-[#0a0d16] shadow-2xl font-mono-pf text-xs space-y-6 overflow-y-auto max-h-[85vh]"
        style={{ color: "var(--pf-sand)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-white/5 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{project.title}</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">// ledger_index: #{project.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-white/5 cursor-pointer text-muted-foreground hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div className="space-y-2">
            <p className="text-white/80 leading-relaxed font-sans">{project.description || project.shortDescription}</p>
          </div>

          {/* Features checklist */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="font-bold text-primary">// DEPLOYMENT SPECIFICATIONS</p>
              <ul className="space-y-1.5 list-none pl-0">
                {project.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/70">
                    <span className="text-emerald-400 font-bold shrink-0">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Audit Simulator */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-primary">SMART AUDITOR TOOL</span>
            <span className="text-muted-foreground">STATUS: {scanStatus.toUpperCase()}</span>
          </div>

          {scanStatus === "idle" && (
            <button
              onClick={handleStartScan}
              className="w-full h-9 rounded-xl bg-linear-to-r from-primary to-indigo-500 hover:from-primary/95 hover:to-indigo-500/95 text-white font-bold transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:shadow-primary/20"
            >
              SCAN CODE REPOSITORY
            </button>
          )}

          {scanStatus === "scanning" && (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-primary transition-all duration-150" style={{ width: `${scanProgress}%` }} />
              </div>
              <p className="text-[9px] text-muted-foreground animate-pulse text-center">
                Checking repository commits... {scanProgress}%
              </p>
            </div>
          )}

          {scanStatus === "success" && (
            <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] text-center">
              <span>✓ AUDIT VERIFIED. LEDGER SIGNED SUCCESSFULLY</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[10px] font-bold" onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-4">
            {project.demoLink && project.demoLink !== "#" && (
              <a href={project.demoLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                LIVE_DEMO
              </a>
            )}
            {project.githubLink && project.githubLink !== "#" && (
              <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-white hover:underline">
                SOURCE_CODE
              </a>
            )}
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white cursor-pointer">
            CLOSE
          </button>
        </div>
      </motion.div>
    </div>
  )
}

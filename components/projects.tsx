"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, BookOpen, CheckCircle } from "lucide-react"
import SectionHeader from "./section-header"

type Project = {
  id: number
  title: string
  shortDescription: string
  description: string
  images: string[]
  tags: string[]
  features: string[]
  demoLink: string
  githubLink: string
  fullDescription: string
  color: string
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null)

  return (
    <section id="projects" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          command="ls projects/"
          title="Things I've shipped"
          description="A selection of products, platforms, and tools I've built end-to-end — from database schema to deployed UI."
        />

        {projects.length === 0 ? (
          <div className="text-xs text-muted-foreground font-departure">ls: projects/: No projects found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
                className="group flex flex-col rounded-xl border border-white/[0.06] bg-[#161D2F]/40 hover:border-[#4F8CFF]/25 hover:bg-[#161D2F]/60 transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden bg-[#121826]/60 shrink-0">
                  <img
                    src={project.images[0] || "/placeholder.jpg"}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-[1.04] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/10 to-transparent pointer-events-none" />
                  {idx === 0 && (
                    <span className="absolute top-3 left-3 text-[9px] bg-[#4F8CFF]/90 text-white px-2 py-0.5 rounded uppercase font-semibold font-ibm tracking-wider">
                      Featured
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 bg-[#0B1020]/80 backdrop-blur-md border border-white/10 text-[9px] text-white/80 font-ibm font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-sm font-bold text-white font-departure tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-2 flex-1">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-white/[0.05]">
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#4F8CFF]/10 hover:bg-[#4F8CFF] hover:text-white border border-[#4F8CFF]/20 text-[#4F8CFF] text-[10px] font-departure font-bold rounded transition-all active:scale-95"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121826] hover:bg-white/[0.04] border border-white/[0.06] text-white text-[10px] font-departure font-bold rounded transition-all active:scale-95"
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </a>
                    <button
                      onClick={() => setSelectedCaseStudy(project)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#8B5CF6]/10 hover:bg-[#8B5CF6] hover:text-white border border-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-departure font-bold rounded transition-all active:scale-95 ml-auto"
                    >
                      <BookOpen className="w-3 h-3" />
                      Case Study
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Drawer */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0B1020]/90 backdrop-blur-md z-50 flex items-center justify-end"
            onClick={() => setSelectedCaseStudy(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="w-full max-w-2xl h-screen bg-[#121826] border-l border-white/[0.08] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col font-jetbrains"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 bg-[#161D2F] border-b border-white/[0.06] flex items-center justify-between font-departure select-none shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[#8B5CF6]">project:</span>
                  <span className="text-white uppercase font-bold">{selectedCaseStudy.title}</span>
                </div>
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[10px] text-white/70 border border-white/10 active:scale-95 transition-all"
                >
                  ESC CLOSE
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 min-h-0 text-left">
                <div className="w-full rounded-xl overflow-hidden border border-white/[0.05] relative aspect-[16/9]">
                  <img
                    src={selectedCaseStudy.images[0] || "/placeholder.jpg"}
                    alt={selectedCaseStudy.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-transparent" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-departure text-[#4F8CFF] uppercase tracking-wider">
                    The Problem
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains">
                    {selectedCaseStudy.shortDescription}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-departure text-[#8B5CF6] uppercase tracking-wider">
                    The Solution
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains">
                    {selectedCaseStudy.fullDescription || selectedCaseStudy.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold font-departure text-[#22C55E] uppercase tracking-wider">
                    Key Features & Architecture
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCaseStudy.features && selectedCaseStudy.features.length > 0 ? (
                      selectedCaseStudy.features.map((feat, idx) => (
                        <div key={idx} className="p-3 bg-[#161D2F]/50 border border-white/[0.04] rounded-lg flex items-start gap-2.5">
                          <CheckCircle className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                          <span className="text-[11px] text-white/80 leading-normal">{feat}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground col-span-2">No custom features listed.</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold font-departure text-[#F59E0B] uppercase tracking-wider">
                    Technology Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCaseStudy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-[#161D2F] border border-white/[0.06] text-[10px] text-muted-foreground font-ibm font-semibold rounded hover:text-white transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/[0.05] flex gap-3">
                  <a
                    href={selectedCaseStudy.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white text-xs font-departure font-bold rounded transition-all active:scale-95 shadow-md shadow-[#4F8CFF]/15"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Launch Live Site
                  </a>
                  <a
                    href={selectedCaseStudy.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#161D2F] hover:bg-white/[0.04] border border-white/[0.06] text-white text-xs font-departure font-bold rounded transition-all active:scale-95"
                  >
                    <Github className="w-4 h-4" />
                    Inspect Repository
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

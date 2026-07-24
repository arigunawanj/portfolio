"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Github, BookOpen, CheckCircle, Layers, Sparkles, Rocket } from "lucide-react"
import SectionHeader from "./section-header"
import { Safari } from "@/components/ui/safari"
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { getAccentColor } from "@/lib/accent-colors"
import { showRowConnector } from "@/lib/grid-connectors"

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "").split("/")[0] || "preview"
  }
}

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
    <section id="projects" className="relative py-10 font-jetbrains w-full">
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
                className="group relative flex flex-col rounded-xl glass-panel transition-all duration-300"
                style={{ borderColor: `${getAccentColor(idx)}22` }}
              >
                <div
                  className="absolute -top-1 -left-1 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-[2px]"
                  style={{ backgroundColor: getAccentColor(idx) }}
                />
                {showRowConnector(idx, projects.length, 3) && (
                  <div className="hidden lg:block absolute top-8 -right-3.5 z-10 w-3.5 h-px">
                    <div
                      className="w-full h-full"
                      style={{
                        background: `linear-gradient(to right, ${getAccentColor(idx)}66, ${getAccentColor(idx + 1)}66)`,
                      }}
                    />
                    <span
                      className="absolute right-0 top-1/2 -translate-y-1/2 -mr-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: getAccentColor(idx + 1) }}
                    />
                  </div>
                )}
                <div className="relative shrink-0 bg-[#121826]/60 p-3 pb-0">
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    {idx === 0 ? (
                      <span className="text-[9px] bg-[#4F8CFF]/90 text-white px-2 py-0.5 rounded uppercase font-semibold font-ibm tracking-wider">
                        Featured
                      </span>
                    ) : <span />}
                    <div className="flex flex-wrap gap-1 justify-end">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-white/5 border border-white/10 text-[9px] text-white/70 font-ibm font-medium rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-t-lg group-hover:scale-[1.02] transition-transform duration-500 origin-bottom">
                    <Safari
                      url={getDomain(project.demoLink)}
                      imageSrc={project.images[0] || undefined}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-sm font-bold text-white font-departure tracking-wide">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-2 flex-1">
                    {project.shortDescription}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-white/5">
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
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#121826] hover:bg-white/4 border border-white/6 text-white text-[10px] font-departure font-bold rounded transition-all active:scale-95"
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
              className="w-full max-w-2xl h-screen bg-[#121826] border-l border-white/8 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col font-jetbrains"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-3.5 bg-[#161D2F] border-b border-white/6 flex items-center justify-between font-departure select-none shrink-0">
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
                <Safari
                  url={getDomain(selectedCaseStudy.demoLink)}
                  imageSrc={selectedCaseStudy.images[0] || undefined}
                  className="w-full"
                />

                {/* Quick facts */}
                <BentoGrid className="grid-cols-1 sm:grid-cols-3 auto-rows-32 gap-3">
                  <BentoCard
                    name="Tech Stack"
                    className="col-span-1"
                    Icon={Layers}
                    description={`${selectedCaseStudy.tags.length} technologies · ${selectedCaseStudy.tags.slice(0, 2).join(", ")}${selectedCaseStudy.tags.length > 2 ? "…" : ""}`}
                    href={selectedCaseStudy.demoLink}
                    cta="View stack"
                    background={<div className="absolute inset-0 bg-linear-to-br from-[#4F8CFF]/10 to-transparent" />}
                  />
                  <BentoCard
                    name="Features Shipped"
                    className="col-span-1"
                    Icon={Sparkles}
                    description={`${selectedCaseStudy.features.length} key features built and documented`}
                    href={selectedCaseStudy.demoLink}
                    cta="See features"
                    background={<div className="absolute inset-0 bg-linear-to-br from-[#8B5CF6]/10 to-transparent" />}
                  />
                  <BentoCard
                    name="Status"
                    className="col-span-1"
                    Icon={Rocket}
                    description={selectedCaseStudy.demoLink && selectedCaseStudy.demoLink !== "#" ? "Live and deployed" : "In repository"}
                    href={selectedCaseStudy.demoLink !== "#" ? selectedCaseStudy.demoLink : selectedCaseStudy.githubLink}
                    cta="Open"
                    background={<div className="absolute inset-0 bg-linear-to-br from-[#22C55E]/10 to-transparent" />}
                  />
                </BentoGrid>

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
                        <div key={idx} className="p-3 bg-[#161D2F]/50 border border-white/4 rounded-lg flex items-start gap-2.5">
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
                        className="px-2.5 py-1 bg-[#161D2F] border border-white/6 text-[10px] text-muted-foreground font-ibm font-semibold rounded hover:text-white transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-3">
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
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#161D2F] hover:bg-white/4 border border-white/6 text-white text-xs font-departure font-bold rounded transition-all active:scale-95"
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

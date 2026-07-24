"use client"

import { motion } from "framer-motion"
import type { TechCategoryVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"
import { Cpu, Terminal, Network, Shield, Database, Globe } from "lucide-react"
import { TechIcon } from "../tech-icons"

// Map categories to modern developers icons
function getCategoryIcon(key: string) {
  switch (key.toLowerCase()) {
    case "frontend":
      return Globe
    case "backend":
      return Database
    case "blockchain":
    case "web3":
      return Network
    case "devops":
      return Cpu
    case "security":
      return Shield
    default:
      return Terminal
  }
}

export function Tech({ tech, onScanCategory }: { tech: TechCategoryVM[]; onScanCategory?: (key: string) => void }) {
  // Update mouse position CSS variables on hover
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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  }

  return (
    <section data-scene="tech" id="tech-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead index="01" tag="// stack.config" title="Technologies" />
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tech.map((cat, ci) => {
            const IconComponent = getCategoryIcon(cat.key)
            return (
              <motion.div
                key={cat.key}
                variants={cardVariants}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => onScanCategory?.(cat.key)}
                className="pf-panel p-6 flex flex-col justify-between rounded-2xl group border border-white/5"
                style={{ 
                  borderRadius: 20,
                  boxShadow: "0 10px 30px -15px rgba(0,0,0,0.5)"
                }}
              >
                <div>
                  {/* Category Title & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h3 className="font-heading text-lg font-bold" style={{ color: "var(--pf-cream)" }}>
                        {cat.title}
                      </h3>
                    </div>
                    <span className="font-mono-pf text-xs font-bold" style={{ color: "var(--pf-teal-glow)" }}>
                      {String(ci + 1).padStart(2, "0")}
                    </span>
                  </div>
                  
                  <p className="text-xs mb-6 leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>
                    {cat.description}
                  </p>
                </div>

                {/* Skills levels meters */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="group/skill">
                      <div className="flex justify-between font-mono-pf text-[11px] mb-1.5">
                        <span className="flex items-center gap-2 transition-colors group-hover/skill:text-primary" style={{ color: "var(--pf-sand)" }}>
                          <TechIcon name={s.name} className="h-3.5 w-3.5" />
                          <span>{s.name}</span>
                        </span>
                        <span style={{ color: "var(--pf-teal-glow)" }}>{s.level}%</span>
                      </div>
                      
                      {/* Meter gauge */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                        <motion.div 
                          className="h-full rounded-full bg-linear-to-r" 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                          style={{ 
                            backgroundImage: "linear-gradient(90deg, var(--pf-coral), var(--pf-teal-glow))",
                            boxShadow: "0 0 8px rgba(99, 102, 241, 0.4)"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

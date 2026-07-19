"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionHeader from "./section-header"

type Experience = {
  id: number
  position: string
  company: string
  duration: string
  location: string
  description: string[]
  skills: string[]
  companyUrl: string
  color: string
}

export default function WorkExperience({ experiences }: { experiences: Experience[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(experiences[0]?.id ?? null)

  return (
    <section id="experience" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeader
          command="cat experience.log"
          title="Where I've worked"
          description="Roles, responsibilities, and what I actually shipped — not just job titles."
        />

        <div className="space-y-4">
          {experiences.map((experience, index) => {
            const isExpanded = expandedId === experience.id

            return (
              <motion.div
                key={experience.id}
                initial={{ y: 14 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(index, 5) * 0.05 }}
                className={cn(
                  "p-5 rounded-xl border transition-all duration-300",
                  isExpanded
                    ? "bg-[#161D2F] border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    : "border-white/5 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10"
                )}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : experience.id)}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded bg-[#4F8CFF]/10 text-[#4F8CFF] shrink-0 mt-0.5">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-departure text-white tracking-wide flex items-center gap-1.5 flex-wrap">
                        <span>{experience.position}</span>
                        <span className="text-[#8B5CF6]">@</span>
                        <span className="text-white/80">{experience.company}</span>
                      </h3>

                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 font-ibm mt-1.5">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#4F8CFF]" /> {experience.duration}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {experience.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-auto md:ml-0 shrink-0">
                    {experience.companyUrl && experience.companyUrl !== "#" && (
                      <a
                        href={experience.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button className="text-muted-foreground hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-3 border-t border-white/5 space-y-4">
                        <div className="space-y-2 text-xs text-muted-foreground font-jetbrains">
                          <span className="text-[9px] font-bold text-white/50 tracking-widest font-departure block">
                            CONTRIBUTIONS & ACHIEVEMENTS
                          </span>
                          {experience.description.map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                              <CheckCircle className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                              <span>{bullet}</span>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 pt-3 border-t border-white/4">
                          <span className="text-[9px] font-bold text-white/50 tracking-widest font-departure block">
                            TECH STACK USED
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {experience.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 bg-[#121826] border border-white/5 text-[10px] text-muted-foreground/80 font-ibm font-medium rounded hover:text-white transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

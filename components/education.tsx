"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GraduationCap, Calendar, MapPin, BookOpen, Quote, Award, ChevronDown, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionHeader from "./section-header"

type EducationItem = {
  id: number
  degree: string
  institution: string
  duration: string
  location: string
  description: string
  achievements: string[]
  courses: string[]
  images: string[]
  thesis?: { title: string; advisor: string; abstract: string } | null
  color: string
}

export default function Education({ education }: { education: EducationItem[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(education[0]?.id ?? null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  return (
    <section id="education" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <SectionHeader command="cat education.md" title="Academic background" />

        <div className="relative">
          {/* Timeline rail */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-linear-to-b from-[#8B5CF6]/40 via-white/10 to-transparent" />

          <div className="space-y-4">
            {education.map((item, idx) => {
              const isExpanded = expandedId === item.id

              return (
                <motion.div
                  key={item.id}
                  initial={{ y: 14 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
                  className="relative pl-12"
                >
                  {/* Timeline node */}
                  <div
                    className={cn(
                      "absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors",
                      isExpanded
                        ? "bg-[#8B5CF6]/15 border-[#8B5CF6] text-[#8B5CF6]"
                        : "bg-[#161D2F] border-white/15 text-muted-foreground"
                    )}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>

                  <div
                    className={cn(
                      "p-5 rounded-xl border transition-all duration-300",
                      isExpanded
                        ? "bg-[#161D2F] border-white/8 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                        : "border-white/5 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10"
                    )}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div>
                        <h3 className="text-sm font-bold font-departure text-white tracking-wide">
                          {item.degree}
                        </h3>
                        <p className="text-[11px] text-[#8B5CF6] font-medium font-departure mt-0.5">
                          {item.institution}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/80 font-ibm mt-1.5">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#8B5CF6]" /> {item.duration}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                        </div>
                      </div>

                      <button className="text-muted-foreground hover:text-white transition-colors ml-auto md:ml-0 shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
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
                            <p className="text-xs text-muted-foreground leading-relaxed font-jetbrains">
                              {item.description}
                            </p>

                            {item.achievements.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[9px] font-bold text-white/50 tracking-widest font-departure block">
                                  KEY ACHIEVEMENTS
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.achievements.map((ach) => (
                                    <span
                                      key={ach}
                                      className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/5 border border-[#22C55E]/15 text-[10px] text-[#22C55E] font-ibm font-medium rounded"
                                    >
                                      <Award className="w-3 h-3" />
                                      {ach}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.courses.length > 0 && (
                              <div className="space-y-2 pt-3 border-t border-white/4">
                                <span className="text-[9px] font-bold text-white/50 tracking-widest font-departure block">
                                  KEY COURSES
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {item.courses.map((course) => (
                                    <span
                                      key={course}
                                      className="px-2 py-0.5 bg-[#121826] border border-white/5 text-[10px] text-muted-foreground/80 font-ibm font-medium rounded"
                                    >
                                      {course}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {item.thesis && item.thesis.title && (
                              <div className="p-3 bg-[#121826]/60 border border-white/4 rounded-lg space-y-1.5 font-jetbrains text-[10px]">
                                <div className="flex items-center gap-1.5 text-[9px] text-[#22C55E] uppercase font-bold tracking-wider font-ibm">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  <span>Research & Thesis</span>
                                </div>
                                <p className="font-bold text-white/90 leading-snug">
                                  "{item.thesis.title}"
                                </p>
                                {item.thesis.advisor && (
                                  <p className="text-muted-foreground/70">Advisor: {item.thesis.advisor}</p>
                                )}
                                {item.thesis.abstract && (
                                  <p className="text-muted-foreground/80 leading-normal italic">
                                    Abstract: {item.thesis.abstract}
                                  </p>
                                )}
                              </div>
                            )}

                            {item.images.length > 0 && (
                              <div className="space-y-2 pt-3 border-t border-white/4">
                                <span className="text-[9px] font-bold text-white/50 tracking-widest font-departure block">
                                  PHOTOS
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {item.images.map((url, i) => (
                                    <button
                                      key={i}
                                      onClick={() => setLightboxImage(url)}
                                      className="w-20 h-14 rounded-lg overflow-hidden border border-white/10 hover:border-[#8B5CF6]/40 transition-all hover:scale-105"
                                    >
                                      <img src={url} alt={`${item.institution} photo ${i + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Footer Quote block */}
        <div className="pt-5 mt-6 border-t border-white/5 flex items-center gap-3">
          <Quote className="w-4 h-4 text-white/30 hidden md:block" />
          <p className="text-[10px] text-muted-foreground italic leading-relaxed">
            "Education is not the learning of facts, but the training of the mind to think."
            <span className="text-[#4F8CFF] font-bold ml-1 font-departure font-medium">— Albert Einstein</span>
          </p>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[85vh] bg-[#161D2F] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <img src={lightboxImage} alt="Academic photo" className="max-w-full max-h-[80vh] object-contain block" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

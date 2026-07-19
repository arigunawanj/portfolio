"use client"

import { motion } from "framer-motion"
import { GraduationCap, Calendar, BookOpen, Quote } from "lucide-react"
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
  thesis?: { title: string; advisor: string; abstract: string } | null
  color: string
}

export default function Education({ education }: { education: EducationItem[] }) {
  return (
    <section id="education" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        <SectionHeader command="cat education.md" title="Academic background" />

        <div className="space-y-5">
        {education.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ y: 14 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: Math.min(idx, 5) * 0.05 }}
            className="p-5 rounded-xl border border-white/5 bg-[#161D2F]/20 hover:bg-[#161D2F]/40 hover:border-white/10 transition-all duration-300 space-y-3"
          >
            {/* Header tags */}
            <div className="flex items-center justify-between flex-wrap gap-2 text-[10px] text-muted-foreground/80 font-ibm font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1 text-[#8B5CF6]">
                <GraduationCap className="w-3.5 h-3.5" />
                {idx === 0 ? "Postgraduate [S2]" : "Undergraduate [S1]"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#4F8CFF]" />
                {item.duration}
              </span>
            </div>

            {/* Degree Title & Uni */}
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold font-departure text-white tracking-wide">
                {item.degree}
              </h3>
              <p className="text-[11px] text-[#4F8CFF] font-medium font-departure">
                {item.institution}
              </p>
            </div>

            {/* Bio / Description */}
            <p className="text-xs text-muted-foreground leading-relaxed leading-relaxed font-jetbrains">
              {item.description}
            </p>

            {/* Thesis Details (Markdown style layout block) */}
            {item.thesis && item.thesis.title && (
              <div className="p-3 bg-[#121826]/60 border border-white/4 rounded-lg space-y-1.5 font-jetbrains text-[10px]">
                <div className="flex items-center gap-1.5 text-[9px] text-[#22C55E] uppercase font-bold tracking-wider font-ibm">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Research & Thesis</span>
                </div>
                <p className="font-bold text-white/90 leading-snug">
                  "{item.thesis.title}"
                </p>
                {item.thesis.abstract && (
                  <p className="text-muted-foreground/80 leading-normal line-clamp-2 italic">
                    Abstract: {item.thesis.abstract}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        ))}
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
    </section>
  )
}

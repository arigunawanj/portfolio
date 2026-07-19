"use client"

import { motion } from "framer-motion"
import { getIconByName } from "@/helpers/icon-mapping"
import SectionHeader from "./section-header"

type Skill = {
  name: string
  level: number
}

type TechCategoryData = {
  icon: string
  title: string
  description: string
  skills: Skill[]
}

interface TechStackProps {
  technologies: Record<string, TechCategoryData>
}

const getConfidenceTier = (level: number) => {
  if (level >= 90) return { label: "Expert", color: "#22C55E" }
  if (level >= 80) return { label: "Advanced", color: "#4F8CFF" }
  if (level >= 65) return { label: "Intermediate", color: "#F59E0B" }
  return { label: "Exploring", color: "#8B5CF6" }
}

export default function TechStack({ technologies }: TechStackProps) {
  const categories = Object.keys(technologies)

  return (
    <section id="skills" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <SectionHeader
          command="tree skills/"
          title="What I work with"
          description="Tools and languages I reach for daily, grouped by area — with an honest read on how deep that experience goes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((key, catIdx) => {
            const category = technologies[key]
            return (
              <motion.div
                key={key}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: Math.min(catIdx, 5) * 0.05 }}
                className="rounded-xl border border-white/6 bg-[#161D2F]/30 p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-lg bg-[#4F8CFF]/10 text-[#4F8CFF] shrink-0">
                    {getIconByName(category.icon, "w-4 h-4")}
                  </div>
                  <h3 className="text-sm font-bold text-white font-departure tracking-wide">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {category.skills.map((skill) => {
                    const tier = getConfidenceTier(skill.level)
                    return (
                      <div key={skill.name}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-white/85 font-medium">{skill.name}</span>
                          <span
                            className="text-[9px] font-ibm font-bold uppercase tracking-wider"
                            style={{ color: tier.color }}
                          >
                            {tier.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, #4F8CFF, #8B5CF6)` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

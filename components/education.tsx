"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  Star,
  Quote
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

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
  const [activeId, setActiveId] = useState<number | null>(education[0]?.id ?? null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })

  return (
    <section id="education" className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Academic
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Educational <span className="text-gradient">Background</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full glass-card border-primary/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden">
                <CardContent className="p-0">
                  <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors leading-tight">
                          {item.degree}
                        </h3>
                        <p className="text-lg font-bold text-muted-foreground">{item.institution}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-primary">
                        <Calendar className="h-4 w-4" />
                        {item.duration}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-8 font-medium italic">
                      "{item.description}"
                    </p>

                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-primary/5 font-bold h-12 rounded-xl group/btn border border-transparent hover:border-primary/10"
                      onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                    >
                      <span>{activeId === item.id ? "Hide Academic Details" : "View Academic Details"}</span>
                      {activeId === item.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>

                    <AnimatePresence>
                      {activeId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 mt-6 border-t border-border/30 space-y-8">
                            {/* Achievements */}
                            <div className="space-y-4">
                              <h4 className="font-black text-sm uppercase tracking-widest text-primary flex items-center gap-2">
                                <Award className="h-4 w-4" /> Achievements
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                {item.achievements.map((achievement, i) => (
                                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                                    <Star className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-bold text-muted-foreground">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Thesis */}
                            <div className="space-y-4">
                              <h4 className="font-black text-sm uppercase tracking-widest text-purple-500 flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Research / Thesis
                              </h4>
                              <div className="p-6 rounded-2xl glass border-purple-500/10 space-y-4">
                                <p className="font-bold text-foreground leading-tight">{item.thesis.title}</p>
                                <div className="flex items-start gap-3">
                                  <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                                  <p className="text-sm text-muted-foreground leading-relaxed italic">{item.thesis.abstract}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Inspirational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <Card className="glass-card border-primary/10 max-w-3xl">
            <CardContent className="p-8 flex items-center gap-6">
              <div className="p-4 rounded-full bg-primary/10 text-primary hidden md:block">
                <Quote className="h-8 w-8" />
              </div>
              <p className="text-lg md:text-xl font-bold text-muted-foreground text-center md:text-left leading-relaxed">
                "Education is not the learning of facts, but the training of the mind to think."
                <span className="block mt-2 text-primary font-black">— Albert Einstein</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

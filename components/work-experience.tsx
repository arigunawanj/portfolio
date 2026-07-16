"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp, Circle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

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
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })

  return (
    <section id="work-experience" className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Journey
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Work <span className="text-gradient">Experience</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-5xl mx-auto space-y-12 relative">
          {/* Main Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent transform -translate-x-1/2 hidden md:block" />

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "relative flex flex-col md:flex-row gap-8 items-start",
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Timeline Indicator */}
              <div className="absolute left-4 md:left-1/2 top-8 w-4 h-4 bg-background border-4 border-primary rounded-full transform -translate-x-1/2 z-20 hidden md:block" />

              {/* Side Content: Date and Location */}
              <div className={cn(
                "md:w-1/2 flex flex-col gap-2 pt-6",
                index % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
              )}>
                <div className={cn(
                  "flex items-center gap-2 text-primary font-bold text-lg",
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                )}>
                  <Calendar className="h-5 w-5" />
                  {experience.duration}
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-muted-foreground font-medium",
                  index % 2 === 0 ? "md:justify-end" : "md:justify-start"
                )}>
                  <MapPin className="h-4 w-4" />
                  {experience.location}
                </div>
              </div>

              {/* Main Content Card */}
              <div className="md:w-1/2 w-full">
                <Card 
                  className={cn(
                    "glass-card border-primary/5 hover:border-primary/20 transition-all duration-500 shadow-xl shadow-primary/5 group overflow-hidden",
                    expandedId === experience.id ? "ring-2 ring-primary/20" : ""
                  )}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                        <Briefcase className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">
                          {experience.position}
                        </h3>
                        <div className="flex items-center gap-2 text-lg font-bold text-muted-foreground">
                          {experience.company}
                          {experience.companyUrl !== "#" && (
                            <a href={experience.companyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:scale-125 transition-transform">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {experience.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      className="w-full justify-between hover:bg-primary/5 font-bold h-12 rounded-xl group/btn"
                      onClick={() => setExpandedId(expandedId === experience.id ? null : experience.id)}
                    >
                      <span>{expandedId === experience.id ? "Minimize Details" : "View Responsibilities"}</span>
                      {expandedId === experience.id ? <ChevronUp className="h-5 w-5 group-hover/btn:-translate-y-1 transition-transform" /> : <ChevronDown className="h-5 w-5 group-hover/btn:translate-y-1 transition-transform" />}
                    </Button>

                    <AnimatePresence>
                      {expandedId === experience.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 mt-6 border-t border-border/30 space-y-4">
                            {experience.description.map((item, i) => (
                              <div key={i} className="flex items-start gap-4">
                                <div className="mt-1.5 shrink-0">
                                  <Circle className="h-2 w-2 fill-primary text-primary" />
                                </div>
                                <p className="text-muted-foreground leading-relaxed font-medium">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

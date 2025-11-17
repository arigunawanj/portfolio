"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Calendar, MapPin, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { experiences } from "@/data/work-experience"

export default function WorkExperience() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const isMobile = useMediaQuery("(max-width: 768px)")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section id="work-experience" className="py-16 md:py-24 relative overflow-hidden" ref={containerRef}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Experience
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Work Experience</h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <div className="space-y-12 relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/20 to-transparent transform md:translate-x-px hidden sm:block"></div>

          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute left-0 md:left-1/2 top-7 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary transform -translate-x-1/2 hidden sm:block"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.3, delay: index * 0.2 + 0.3 }}
              ></motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start">
                {/* Date and company - alternating sides */}
                <motion.div
                  className={`text-center md:text-right md:pr-12 ${
                    index % 2 === 1 ? "md:order-2 md:pl-12 md:pr-0 md:text-left" : ""
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                >
                  <div className="mb-2 flex items-center justify-center md:justify-end gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm">{experience.duration}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-end gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm">{experience.location}</span>
                  </div>
                </motion.div>

                {/* Job details card */}
                <motion.div
                  className={`${index % 2 === 1 ? "md:order-1" : ""}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={`overflow-hidden bg-gradient-to-br ${experience.color} border-0`}>
                    <CardContent className="p-0">
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-background/50 backdrop-blur-sm p-3 rounded-full">
                            <Briefcase className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold">{experience.position}</h3>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{experience.company}</span>
                              {experience.companyUrl !== "#" && (
                                <a
                                  href={experience.companyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {experience.skills.map((skill, i) => (
                            <Badge key={i} variant="secondary" className="bg-background/50 backdrop-blur-sm text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4 w-full justify-between bg-background/50 backdrop-blur-sm hover:bg-background/70"
                          onClick={() => toggleExpand(experience.id)}
                        >
                          {expandedId === experience.id ? "Hide details" : "Show details"}
                          {expandedId === experience.id ? (
                            <ChevronUp className="h-4 w-4 ml-2" />
                          ) : (
                            <ChevronDown className="h-4 w-4 ml-2" />
                          )}
                        </Button>

                        <AnimatePresence>
                          {expandedId === experience.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t mt-4 border-border/30">
                                <h4 className="font-medium mb-2">Key Responsibilities:</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                  {experience.description.map((item, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: i * 0.1 }}
                                      className="flex items-start gap-2"
                                    >
                                      <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                                      </span>
                                      <span>{item}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


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
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { education } from "@/data/education"

export default function Education() {
  const [activeId, setActiveId] = useState<number | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const isMobile = useMediaQuery("(max-width: 768px)")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleToggle = (id: number) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <section id="education" className="py-16 md:py-24 bg-muted/30 relative overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Floating education icons */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-20 left-20 text-primary/10"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <GraduationCap size={60} />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-20 text-primary/10"
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0, 5, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <BookOpen size={50} />
          </motion.div>
          <motion.div
            className="absolute top-40 right-40 text-primary/10"
            animate={{
              y: [0, 10, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Award size={40} />
          </motion.div>
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Education
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Academic Background</h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                <Card className={`h-full overflow-hidden bg-gradient-to-br ${item.color} border-0`}>
                  <CardContent className="p-0">
                    {/* Top decorative pattern */}
                    <div className="h-3 w-full bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40" />

                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-background/50 backdrop-blur-sm p-3 rounded-full">
                          <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{item.degree}</h3>
                          <p className="font-medium">{item.institution}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-muted-foreground text-sm">{item.description}</p>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                          <Award className="h-3 w-3 mr-1" /> Achievements
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                          <BookOpen className="h-3 w-3 mr-1" /> Courses
                        </Badge>
                        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                          <FileText className="h-3 w-3 mr-1" /> Thesis
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-4 w-full justify-between bg-background/50 backdrop-blur-sm hover:bg-background/70"
                        onClick={() => handleToggle(item.id)}
                      >
                        {activeId === item.id ? "Hide details" : "Show details"}
                        {activeId === item.id ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </Button>

                      <AnimatePresence>
                        {activeId === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t mt-4 border-border/30 space-y-6">
                              {/* Achievements */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Award className="h-4 w-4 text-primary" />
                                  Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {item.achievements.map((achievement, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.3, delay: i * 0.1 }}
                                      className="flex items-start gap-2 text-sm text-muted-foreground"
                                    >
                                      <Star className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                                      <span>{achievement}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>

                              {/* Key Courses */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                  Key Courses
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {item.courses.map((course, i) => (
                                    <motion.div
                                      key={i}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ duration: 0.3, delay: i * 0.1 }}
                                    >
                                      <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">
                                        {course}
                                      </Badge>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Thesis */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" />
                                  Thesis
                                </h4>
                                <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 space-y-2">
                                  <p className="text-sm font-medium">{item.thesis.title}</p>
                                  <p className="text-xs text-muted-foreground">Advisor: {item.thesis.advisor}</p>
                                  <div className="pt-2 border-t border-border/30">
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                      <p className="text-xs text-muted-foreground">{item.thesis.abstract}</p>
                                    </div>
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
            </motion.div>
          ))}
        </div>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm"></div>
            <div className="relative bg-background/50 backdrop-blur-sm border border-border/30 rounded-full px-6 py-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Education is the passport to the future, for tomorrow belongs to those who prepare for it today.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}


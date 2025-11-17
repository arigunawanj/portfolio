"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Award,
  ExternalLink,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  RotateCw,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { certifications } from "@/data/certifications"

export default function Certification() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  // Decorative elements - fewer on mobile
  const decorativeElements = [
    { x: "10%", y: "20%", delay: 0, duration: 8, size: "lg" },
    { x: "85%", y: "15%", delay: 1, duration: 10, size: "md" },
    { x: "75%", y: "80%", delay: 2, duration: 12, size: "lg" },
    { x: "15%", y: "75%", delay: 3, duration: 9, size: "sm" },
  ]

  const displayedElements = isMobile ? decorativeElements.slice(0, 2) : decorativeElements

  return (
    <section id="certification" className="py-16 md:py-24 relative overflow-hidden" ref={containerRef}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {displayedElements.map((el, index) => (
          <motion.div
            key={index}
            className={`absolute ${
              el.size === "sm" ? "w-16 h-16" : el.size === "md" ? "w-24 h-24" : "w-32 h-32"
            } rounded-full opacity-20`}
            style={{
              left: el.x,
              top: el.y,
              background: `radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0) 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: el.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: el.delay,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Certifications
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Certifications</h2>
          <motion.div
            className="w-20 h-1 bg-primary mx-auto"
            initial={{ width: 0 }}
            animate={isInView ? { width: 80 } : { width: 0 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: isMobile ? 0.1 : index * 0.2 }}
              variants={fadeIn}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300, damping: 10 } }}
                className="h-full"
              >
                <Card className={`h-full overflow-hidden bg-gradient-to-br ${cert.color} border-0 relative`}>
                  {/* Shimmering effect overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 3,
                      repeatDelay: 5,
                      ease: "linear",
                    }}
                  />

                  <CardContent className="p-0">
                    {/* Top ribbon */}
                    <div className="relative h-2 w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="p-6 md:p-8">
                      {/* Certificate icon with animated rings */}
                      <div className="relative mb-6 inline-block">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/10"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                          }}
                        />
                        <div className="relative bg-background/50 backdrop-blur-sm p-4 rounded-full">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                            {cert.name}
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Sparkles className="h-4 w-4 text-primary/70" />
                            </motion.div>
                          </h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          <span>{cert.date}</span>
                        </div>

                        <div className="pt-4 border-t border-border/30">
                          <p className="text-sm text-muted-foreground">{cert.description}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Credential ID:</span>
                          <span className="text-muted-foreground font-mono">{cert.credentialId}</span>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-background/50 backdrop-blur-sm hover:bg-background/70"
                          onClick={() => handleToggle(index)}
                        >
                          {activeIndex === index ? "Hide Skills" : "View Skills"}
                          <ChevronRight
                            className={`ml-2 h-4 w-4 transition-transform ${activeIndex === index ? "rotate-90" : ""}`}
                          />
                        </Button>

                        <AnimatePresence>
                          {activeIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-4 border-t border-border/30 space-y-3">
                                <h4 className="font-medium flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary" />
                                  Skills & Competencies
                                </h4>
                                <ul className="grid grid-cols-1 gap-2">
                                  {cert.skills.map((skill, i) => (
                                    <motion.li
                                      key={i}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2, delay: i * 0.1 }}
                                      className="flex items-center gap-2"
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                      <span className="text-sm text-muted-foreground">{skill}</span>
                                    </motion.li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button variant="default" size="sm" className="w-full" asChild>
                          <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Verify Credential
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-sm"></div>
            <div className="relative bg-background/50 backdrop-blur-sm border border-border/30 rounded-full px-6 py-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <p className="text-sm text-muted-foreground">
                Continuous learning and professional development are key to staying at the cutting edge of technology.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
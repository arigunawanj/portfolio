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
  Zap,
} from "lucide-react"
import { certifications } from "@/data/certifications"
import { cn } from "@/lib/utils"

export default function Certification() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.1 })

  return (
    <section id="certification" className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
      {/* Background Decorative Blob */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Achievements
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Professional <span className="text-gradient">Certifications</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full glass-card border-primary/5 hover:border-primary/20 transition-all duration-500 group overflow-hidden">
                <CardContent className="p-8">
                  {/* Icon & Name */}
                  <div className="relative mb-8 flex justify-between items-start">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                      <Award className="h-8 w-8" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="p-2 rounded-full bg-primary/5"
                    >
                      <Sparkles className="h-5 w-5 text-primary/40" />
                    </motion.div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
                      {cert.name}
                    </h3>
                    <p className="text-lg font-bold text-muted-foreground">{cert.issuer}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Calendar className="h-4 w-4" />
                      {cert.date}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/30 space-y-6">
                    <p className="text-muted-foreground font-medium line-clamp-3">
                      {cert.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs font-black text-muted-foreground uppercase tracking-widest bg-muted/30 p-2 rounded-lg border border-border/50">
                      ID: {cert.credentialId}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="ghost" 
                        className="flex-1 h-12 rounded-xl font-bold border border-transparent hover:border-primary/20"
                        onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                      >
                        {activeIndex === index ? "Hide Skills" : "View Skills"}
                        <ChevronRight className={cn("ml-2 h-4 w-4 transition-transform", activeIndex === index ? "rotate-90" : "")} />
                      </Button>
                      
                      <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Verify
                        </a>
                      </Button>
                    </div>

                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 space-y-3">
                            <h4 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Competencies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {cert.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/10 font-bold">
                                  {skill}
                                </Badge>
                              ))}
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
      </div>
    </section>
  )
}
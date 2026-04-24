"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { technologies } from "@/data/tech-stack"
import { getIconByName } from "@/helpers/icon-mapping"
import { cn } from "@/lib/utils"

export default function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(Object.keys(technologies)[0])

  return (
    <section id="tech-stack" className="py-24 relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            My Skills
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Technical <span className="text-gradient">Arsenal</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {Object.entries(technologies).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border flex items-center gap-2",
                selectedCategory === key 
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/30"
              )}
            >
              {getIconByName(category.icon, "h-4 w-4")}
              {category.title}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Detailed View */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {technologies[selectedCategory as keyof typeof technologies].skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card border-primary/5 hover:border-primary/20 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-lg">{skill.name}</h4>
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10">
                              {skill.level}%
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
                              className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Description Card */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              {selectedCategory && (
                <motion.div
                  key={selectedCategory + "-desc"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="glass shadow-2xl border-primary/10 overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-primary to-purple-500" />
                    <CardContent className="p-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                        {getIconByName(technologies[selectedCategory as keyof typeof technologies].icon, "h-8 w-8")}
                      </div>
                      <h3 className="text-2xl font-black mb-4">
                        {technologies[selectedCategory as keyof typeof technologies].title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        {technologies[selectedCategory as keyof typeof technologies].description}
                      </p>
                      
                      <div className="mt-8 pt-8 border-t border-border/30 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium">Industry Standard Practices</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="text-sm font-medium">Scalable Architecture</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-pink-500" />
                          <span className="text-sm font-medium">Performance Optimization</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
            Continuously evolving with the tech landscape to deliver 
            <span className="text-foreground font-bold"> state-of-the-art </span> 
            digital experiences.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

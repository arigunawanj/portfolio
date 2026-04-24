"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Github, Linkedin, Twitter, ChevronDown, MousePointer } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function Hero() {
  const [text, setText] = useState("")
  const fullText = "Software Developer"
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.substring(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
      }
    }, 100)

    return () => clearInterval(typingInterval)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-mesh py-16 md:py-0"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" 
        />
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ opacity, y }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="outline" className="mb-6 px-4 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary animate-pulse">
                Available for New Projects
              </Badge>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight">
                Hi, I'm{" "}
                <span className="text-gradient">
                  Ari Gunawan
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground/80 mb-8 flex items-center justify-center lg:justify-start">
                <span className="relative">
                  {text}
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/20 -z-10" />
                </span>
                <span className="animate-blink ml-2 text-primary">|</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              🚀 Specialized in building 
              <span className="text-foreground font-semibold"> high-performance </span> 
              web applications that are scalable, secure, and lightning fast. 
              Turning complex problems into elegant digital solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="h-14 px-8 text-lg group rounded-2xl shadow-xl shadow-primary/20" onClick={() => scrollToSection("projects")}>
                Explore My Work
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-2 hover:bg-muted/50 transition-all" onClick={() => scrollToSection("contact")}>
                Let's Talk
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex gap-6 mt-12 justify-center lg:justify-start"
            >
              <a href="https://github.com/arigunawanj" target="_blank" rel="noopener noreferrer" 
                className="p-3 rounded-2xl glass-card text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300 shadow-lg">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/arigunawanj/" target="_blank" rel="noopener noreferrer" 
                className="p-3 rounded-2xl glass-card text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-300 shadow-lg">
                <Linkedin className="h-6 w-6" />
              </a>
            </motion.div>
          </motion.div>

          {/* Image content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative order-1 lg:order-2 mx-auto"
          >
            <div
              className={`relative ${
                isMobile ? "w-[280px] h-[280px]" : "w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]"
              }`}
            >
              {/* Outer Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-[60px] animate-pulse"></div>
              
              {/* Spinning border */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
              />

              {/* Main image container */}
              <div className="absolute inset-6 rounded-full overflow-hidden border-8 border-background shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] glass z-10">
                <img
                  src="/foto/10.jpg"
                  alt="Ari Gunawan Jatmiko"
                  className="w-full h-full object-cover scale-110 hover:scale-125 transition-transform duration-700"
                />
              </div>

              {/* Floating tech badges */}
              {!isMobile && (
                <>
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-8 top-1/4 glass-card p-4 rounded-2xl shadow-2xl z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                      <span className="text-sm font-bold tracking-tight">Full Stack Expert</span>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-12 bottom-1/4 glass-card p-4 rounded-2xl shadow-2xl z-20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MousePointer className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">Experience</span>
                        <span className="text-sm font-bold">Senior Developer</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <motion.button
          onClick={() => scrollToSection("about")}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1 group-hover:border-primary/50 transition-colors">
            <motion.div 
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary rounded-full" 
            />
          </div>
        </motion.button>
      </div>
    </section>
  )
}


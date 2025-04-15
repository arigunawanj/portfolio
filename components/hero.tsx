"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
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
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-background to-background/90 py-16 md:py-0"
    >
      {/* Background elements - hidden on very small screens */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-destructive/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text content - order changes based on screen size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ opacity, y }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                Hi, I'm{" "}
                <span className="text-primary">
                  Ari Gunawan<span className="text-destructive"> Jatmiko</span>
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-muted-foreground mb-4 md:mb-6 flex items-center justify-center lg:justify-start">
                <span className="text-foreground">{text}</span>
                <span className="animate-blink ml-1">|</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0"
            >
               ⚡
              <span className="text-blue-500">Performance Addict</span> <br />I
              build websites that don’t just look good—they{" "}
              <strong>load fast, scale well, and never break.</strong> UI/UX?
              Nailed it. Backend? Done. Performance? Lightning fast. ⚡
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="group" onClick={() => scrollToSection("projects")}>
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection("contact")}>
                Contact Me
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex gap-4 mt-6 md:mt-8 justify-center lg:justify-start"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <a href="https://github.com/arigunawanj" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-primary/10 hover:text-primary"
                asChild
              >
                <a href="https://www.linkedin.com/in/arigunawanj/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ scale }}
            className="relative order-1 lg:order-2 mx-auto"
          >
            <div
              className={`relative ${
                isMobile ? "w-[250px] h-[250px]" : isTablet ? "w-[350px] h-[350px]" : "w-[450px] h-[450px]"
              }`}
            >
              {/* Decorative elements - simplified on mobile */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-transparent animate-pulse"></div>

              {!isMobile && (
                <>
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-destructive/10 rounded-full"></div>
                </>
              )}

              {/* Main image container */}
              <div className="absolute inset-4 bg-muted rounded-full overflow-hidden border-4 border-background shadow-2xl">
                <img
                  src="/foto/10.jpg"
                  alt="Ari Gunawan Jatmiko"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges - only on larger screens */}
              {!isMobile && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      repeatDelay: 2,
                    }}
                    className="absolute -right-4 top-1/4 bg-background rounded-lg shadow-lg p-3 hidden md:block"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Available for hire</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 1.4,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      repeatDelay: 3,
                    }}
                    className="absolute -left-6 bottom-1/3 bg-background rounded-lg shadow-lg p-3 hidden md:block"
                  >
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">3+ years experience</span>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 hidden md:block">
        <motion.button
          onClick={() => scrollToSection("about")}
          className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.6,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 1,
          }}
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown className="h-6 w-6 animate-bounce" />
        </motion.button>
      </div>
    </section>
  )
}


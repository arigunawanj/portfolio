"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heart, ArrowUp, Github, Linkedin, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: false, amount: 0.3 })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const socialLinks = [
    { icon: <Github className="h-5 w-5" />, href: "https://github.com/arigunawanj", label: "GitHub" },
    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/in/arigunawanj/", label: "LinkedIn" },
    { icon: <Instagram className="h-5 w-5" />, href: "http://instagram.com/arigunawanj/", label: "Instagram" },
  ]

  return (
    <footer ref={footerRef} className="relative bg-background py-12 border-t border-border/30 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-2xl font-black mb-2">
              Ari Gunawan <span className="text-primary">Jatmiko</span>
            </h3>
            <p className="text-muted-foreground font-medium max-w-xs">
              Building high-performance digital experiences that matter.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-2xl bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all duration-300"
                asChild
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  {link.icon}
                </a>
              </Button>
            ))}
          </div>

          {/* Back to Top */}
          <Button
            onClick={scrollToTop}
            variant="outline"
            className="rounded-2xl h-12 px-6 font-bold border-2 gap-2 group"
          >
            Back to Top
            <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          </Button>
        </div>

        <div className="h-px w-full bg-border/30 my-10" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-muted-foreground">
          <p>© {currentYear} Ari Gunawan Jatmiko. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Made with
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            </motion.span>
            in Malang, Indonesia
          </div>
        </div>
      </div>
    </footer>
  )
}

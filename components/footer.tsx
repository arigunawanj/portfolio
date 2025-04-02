"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Heart, ArrowUp, Github, Linkedin, Instagram, Twitter } from "lucide-react"
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
    { icon: <Github className="h-4 w-4" />, href: "https://github.com/arigunawanj", label: "GitHub" },
    { icon: <Linkedin className="h-4 w-4" />, href: "https://www.linkedin.com/in/arigunawanj/", label: "LinkedIn" },
    // { icon: <Twitter className="h-4 w-4" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram className="h-4 w-4" />, href: "http://instagram.com/awrigun/", label: "Instagram" },
  ]

  return (
    <footer ref={footerRef} className="relative bg-background border-t border-border/30 overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h3 className="text-2xl font-bold">
              <span className="text-primary">Ari Gunawan </span>
              <span className="text-destructive">Jatmiko</span>
            </h3>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex space-x-4 mb-6"
          >
            {socialLinks.map((link, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-muted/50 hover:bg-primary/20 hover:text-primary"
                  asChild
                >
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Divider with animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="h-px w-full max-w-xs bg-border/50 mb-6 origin-center"
          ></motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <p className="text-muted-foreground text-sm mb-2">© {currentYear} Ari Gunawan Jatmiko. All rights reserved.</p>
            <p className="text-muted-foreground text-xs flex items-center justify-center">
              Made with
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  duration: 1.5,
                }}
                className="inline-block mx-1"
              >
                <Heart className="h-3 w-3 text-destructive fill-destructive" />
              </motion.span>
              in Malang, Indonesia
            </p>
          </motion.div>

          {/* Back to top button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute right-4 bottom-4 md:right-8 md:bottom-8"
          >
            <motion.button
              onClick={scrollToTop}
              className="bg-muted/80 hover:bg-primary/20 text-muted-foreground hover:text-primary p-2 rounded-full transition-colors"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}


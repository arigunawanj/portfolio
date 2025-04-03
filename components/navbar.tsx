"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)

      // Determine active section based on scroll position
      const sections = [
        "home",
        "about",
        "tech-stack",
        "projects",
        "work-experience",
        "education",
        "certification",
        "contact",
      ]

      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("mousedown", handleClickOutside)

    // Handle body scroll lock when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false) // Close the mobile menu

    // Small timeout to ensure the mobile menu closes first
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset
        const navbarHeight = 80 // Approximate navbar height

        window.scrollTo({
          top: offsetTop - navbarHeight, // Adjust scroll position to account for navbar height
          behavior: "smooth",
        })
      }
    }, 10)
  }

  const navLinks = [
    { name: "Home", href: "home" },
    { name: "About", href: "about" },
    { name: "Tech Stack", href: "tech-stack" },
    { name: "Projects", href: "projects" },
    { name: "Experience", href: "work-experience" },
    { name: "Education", href: "education" },
    { name: "Certifications", href: "certification" },
    { name: "Contact", href: "contact" },
  ]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "py-2 bg-background/80 backdrop-blur-md shadow-md" : "py-6 bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => scrollToSection("home")}
            className="relative text-xl font-bold z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-primary">Ari Gunawan</span>
            <span className="text-destructive">Jatmiko</span>
            <motion.div
              className="absolute -bottom-1 left-0 h-1 bg-primary rounded-full"
              layoutId="underline"
              initial={{ width: "100%" }}
            />
          </motion.button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center p-1 bg-muted/50 backdrop-blur-sm rounded-full">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      activeSection === link.href ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {activeSection === link.href && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-full"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center ml-4 space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button className="rounded-full">Resume</Button>
            </div>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-full"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 70px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b overflow-auto"
            style={{ maxHeight: "calc(100vh - 70px)" }}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "py-3 px-4 text-left rounded-lg transition-colors w-full", // Increased padding for better touch target
                      activeSection === link.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted/50",
                    )}
                  >
                    {link.name}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4 mt-4 border-t border-border/30"
                >
                  <Button className="w-full">Resume</Button>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


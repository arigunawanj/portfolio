"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "certs", label: "Certifications" },
  { id: "contact", label: "Contact" },
]

export default function SiteNav({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.pageYOffset - 72
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 font-jetbrains transition-all duration-300",
        scrolled
          ? "bg-[#0B1020]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center gap-2 font-departure font-bold text-sm tracking-wide text-white shrink-0"
        >
          <span className="text-[#4F8CFF]">{name.split(" ")[0]?.toLowerCase() || "ari"}</span>
          <span className="text-white/40">@</span>
          <span>{name.split(" ").slice(-1)[0]?.toLowerCase() || "dev"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse ml-1" />
        </button>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={cn(
                "relative px-3.5 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors",
                activeSection === link.id
                  ? "text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {activeSection === link.id && (
                <motion.div
                  layoutId="site-nav-pill"
                  className="absolute inset-0 bg-white/[0.06] border border-white/[0.08] rounded-lg"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 bg-[#4F8CFF] hover:bg-[#4F8CFF]/90 text-white rounded-lg text-xs font-departure font-bold transition-all active:scale-95 shadow-[0_4px_15px_rgba(79,140,255,0.2)]"
          >
            <Download className="w-3.5 h-3.5" />
            Resume
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="lg:hidden p-2 rounded-lg text-white border border-white/[0.08] bg-white/[0.03]"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-[#0B1020]/95 backdrop-blur-xl border-b border-white/[0.08]"
          >
            <nav className="max-w-7xl mx-auto px-5 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={cn(
                    "text-left px-3.5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-colors",
                    activeSection === link.id
                      ? "bg-[#4F8CFF]/10 text-white border border-[#4F8CFF]/20"
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  {link.label}
                </button>
              ))}
              <a
                href="/resume.pdf"
                download
                className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4F8CFF] text-white rounded-lg text-sm font-departure font-bold"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

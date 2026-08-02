"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import type { ContactVM, AboutTraitVM } from "@/lib/portfolio-data"
import { Sparkles, Cpu, Link2, ShieldAlert } from "lucide-react"

export function Hero({ contact, aboutTraits, funFacts }: { contact: ContactVM; aboutTraits: AboutTraitVM[]; funFacts: string[] }) {
  const card = useRef<HTMLDivElement>(null)
  const gloss = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = card.current
    const gl = gloss.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    
    el.style.transform = `perspective(1000px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02, 1.02, 1.02)`
    
    if (gl) {
      const gx = e.clientX - r.left
      const gy = e.clientY - r.top
      gl.style.background = `radial-gradient(circle at ${gx}px ${gy}px, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`
    }
  }

  const reset = () => {
    if (card.current) card.current.style.transform = ""
    if (gloss.current) gloss.current.style.background = ""
  }

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20, duration: 0.6 },
    },
  }

  return (
    <section data-scene="hero" id="hero-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 pt-24 md:pt-0">
      <div className="grid md:grid-cols-[1.15fr_0.85fr] gap-12 items-center max-w-6xl mx-auto w-full">
        {/* Left — terminal readout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Eyebrow badge */}
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary font-mono-pf text-xs uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" /> connected to network
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight pf-glow-text" 
            style={{ color: "var(--pf-cream)" }}
          >
            {contact.name}
          </motion.h1>

          {/* Subheading Role block */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-pf text-sm">
            <span style={{ color: "var(--pf-muted-fg)" }}>validator_role<span style={{ color: "var(--pf-teal-glow)" }}>:</span></span>
            <span style={{ color: "var(--pf-coral)" }}>{contact.role}</span>
            {contact.heroBadge && (
              <span className="inline-flex items-center gap-2 px-3 py-0.5 rounded-md border font-mono-pf text-xs" style={{ borderColor: "var(--pf-line)", color: "var(--pf-sand)", background: "rgba(99, 102, 241, 0.05)" }}>
                <span className="pf-status-dot" /> {contact.heroBadge}
              </span>
            )}
          </motion.div>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="max-w-xl leading-relaxed text-sm border-l-2 pl-4" 
            style={{ color: "var(--pf-muted-fg)", borderColor: "var(--pf-coral)" }}
          >
            {contact.heroDescription}
          </motion.p>

          {/* Web3 Metric Stats - Simplified inline indicators */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono-pf pt-2" 
            style={{ color: "var(--pf-muted-fg)" }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--pf-coral)" }}>◆</span>
              <span>focus:</span>
              <span className="text-white font-bold">Web3 / Full Stack</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--pf-teal-glow)" }}>◆</span>
              <span>stack:</span>
              <span className="text-white font-bold">React · Go · Solidity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--pf-teal-glow)" }}>◆</span>
              <span>consensus:</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-2">
            <a 
              href="#projects-scene" 
              className="pf-focusable cursor-pointer group relative px-6 py-3 font-mono-pf text-sm uppercase tracking-wider transition-all duration-300 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5" 
              style={{ background: "var(--pf-coral)", color: "white" }}
            >
              Examine Blocks <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a 
              href="#contact-scene" 
              className="pf-focusable cursor-pointer px-6 py-3 font-mono-pf text-sm uppercase tracking-wider border rounded-xl transition-all duration-300 hover:bg-white/5 font-bold" 
              style={{ borderColor: "var(--pf-teal-glow)", color: "var(--pf-sand)" }}
            >
              Sign Contract ↗
            </a>
          </motion.div>
        </motion.div>

        {/* Right — bracketed photo terminal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
          className="flex justify-center md:justify-end"
        >
          <div className="relative group/photo">
            <div className="absolute -top-7 left-1 pf-label text-[9px] font-bold flex items-center gap-1.5" style={{ color: "var(--pf-muted-fg)" }}>
              <Cpu className="h-3 w-3 text-primary animate-pulse" />
              <span>NODE_ID: 0x8a92</span>
              <span className="text-primary font-black">…</span>
              <span>b3c7</span>
            </div>
            
            <div
              ref={card}
              onMouseMove={onMove}
              onMouseLeave={reset}
              className="relative pf-brackets pf-scanline overflow-hidden transition-all duration-300 ease-out will-change-transform border bg-linear-to-b from-white/5 to-white/0 shadow-2xl"
              style={{ 
                borderRadius: 24, 
                boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px var(--pf-line)",
                borderColor: "var(--pf-line)"
              }}
            >
              <Image 
                src={contact.photoUrl} 
                alt={contact.name} 
                width={360} 
                height={450} 
                className="object-cover pointer-events-none transition duration-500 scale-102 group-hover/photo:scale-105" 
                priority 
              />
              {/* Glowing cursor reflection overlay */}
              <div ref={gloss} className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300" />
              
              {/* Matrix console footer */}
              <div className="absolute bottom-0 inset-x-0 p-4 font-mono-pf text-[10px] flex justify-between backdrop-blur-md border-t" style={{ background: "rgba(10, 13, 22, 0.85)", borderColor: "var(--pf-line)", color: "var(--pf-sand)" }}>
                <span>./node_identity.jpg</span>
                <span className="flex items-center gap-1.5" style={{ color: "var(--pf-teal-glow)" }}>
                  <span className="pf-status-dot" /> LIVE_STATUS
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

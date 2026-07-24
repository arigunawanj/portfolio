"use client"

import { motion } from "framer-motion"
import type { ContactVM } from "@/lib/portfolio-data"
import { Send, MapPin, Mail, Key } from "lucide-react"

export function Contact({ contact }: { contact: ContactVM }) {
  const links = [
    ["GitHub", contact.githubUrl], ["LinkedIn", contact.linkedinUrl],
    ["Instagram", contact.instagramUrl], ["GitLab", contact.gitlabUrl], ["Twitter", contact.twitterUrl],
  ].filter(([, u]) => !!u) as [string, string][]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--mouse-x", `${x}px`)
    el.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <section data-scene="contact" id="contact-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Eyebrow Label */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3"
        >
          <span className="pf-label pf-cursor text-primary font-bold">&gt; register_consensus --init</span>
        </motion.div>

        {/* Dynamic Web3 Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-heading text-4xl md:text-6xl font-black leading-tight pf-glow-text" 
          style={{ color: "var(--pf-cream)" }}
        >
          Deploy a project<br />on-chain together.
        </motion.h2>

        {/* Location Indicator */}
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-mono-pf text-xs flex items-center justify-center gap-1.5" 
          style={{ color: "var(--pf-muted-fg)" }}
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>{contact.location || "remote / worldwide"}</span>
        </motion.p>

        {/* Smart Contract Signature Box (Mock validation signature layout) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
          onMouseMove={handleMouseMove}
          className="pf-panel p-6 rounded-2xl border border-white/5 text-left max-w-md mx-auto space-y-4 shadow-xl backdrop-blur-md"
          style={{ borderRadius: 20 }}
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="font-mono-pf text-[10px] font-bold text-primary flex items-center gap-1">
              <Key className="h-3.5 w-3.5" /> SECURE_TRANSACTION
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="space-y-2 font-mono-pf text-[11px] text-muted-foreground">
            <p><span className="text-primary font-bold">To:</span> {contact.name}</p>
            <p><span className="text-primary font-bold">Action:</span> initiate_handshake()</p>
            <p><span className="text-primary font-bold">Gas Limit:</span> 21000 GWEI</p>
            <p className="truncate"><span className="text-primary font-bold">Hash:</span> 0x3d0b2fcf...8b40aef5c29019d</p>
          </div>
          
          {contact.email && (
            <a 
              href={`mailto:${contact.email}`} 
              className="pf-focusable cursor-pointer w-full group flex items-center justify-center gap-2 px-5 h-11 font-mono-pf text-xs transition-all duration-300 rounded-xl bg-primary text-white hover:bg-primary/95 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5"
            >
              <Send className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span>SIGN & TRANSMIT EMAIL</span>
            </a>
          )}
        </motion.div>

        {/* Social connections links */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-px flex-wrap border rounded-xl overflow-hidden shadow-lg" 
          style={{ borderColor: "var(--pf-line)", background: "var(--pf-line)" }}
        >
          {links.map(([label, url]) => (
            <a 
              key={label} 
              href={url} 
              target="_blank" 
              rel="noreferrer" 
              className="pf-focusable cursor-pointer px-6 py-3.5 font-mono-pf text-[10px] uppercase tracking-wider font-bold transition hover:bg-white/5" 
              style={{ background: "rgba(10, 13, 22, 0.75)", color: "var(--pf-sand)" }}
            >
              {label} ↗
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

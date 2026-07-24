"use client"

import { useRef } from "react"
import Image from "next/image"
import type { ContactVM, AboutTraitVM } from "@/lib/portfolio-data"

export function Hero({ contact, aboutTraits, funFacts }: { contact: ContactVM; aboutTraits: AboutTraitVM[]; funFacts: string[] }) {
  const card = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`
  }
  const reset = () => { if (card.current) card.current.style.transform = "" }

  return (
    <section data-scene="hero" id="hero-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto w-full">
        <div>
          {contact.heroBadge && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-5" style={{ background: "color-mix(in srgb, var(--pf-coral) 18%, transparent)", color: "var(--pf-coral-soft)" }}>
              {contact.heroBadge}
            </span>
          )}
          <h1 className="font-heading text-5xl md:text-7xl font-bold leading-tight" style={{ color: "var(--pf-cream)" }}>
            {contact.name}
          </h1>
          <p className="mt-3 text-xl md:text-2xl" style={{ color: "var(--pf-coral)" }}>{contact.role}</p>
          <p className="mt-5 max-w-md leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>{contact.heroDescription}</p>
          <div className="mt-8 flex gap-4">
            <a href="#projects-scene" className="px-6 py-3 rounded-xl font-medium transition hover:scale-105" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)" }}>View Projects</a>
            <a href="#contact-scene" className="px-6 py-3 rounded-xl font-medium border transition hover:scale-105" style={{ borderColor: "var(--pf-teal-glow)", color: "var(--pf-sand)" }}>Get in Touch</a>
          </div>
        </div>
        <div className="flex justify-center">
          <div ref={card} onMouseMove={onMove} onMouseLeave={reset} className="relative rounded-2xl overflow-hidden border transition-transform duration-200 will-change-transform" style={{ borderColor: "color-mix(in srgb, var(--pf-teal-glow) 40%, transparent)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
            <Image src={contact.photoUrl} alt={contact.name} width={360} height={440} className="object-cover" priority />
          </div>
        </div>
      </div>
    </section>
  )
}

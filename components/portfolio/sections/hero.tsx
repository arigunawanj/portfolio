"use client"

import { useRef } from "react"
import Image from "next/image"
import type { ContactVM, AboutTraitVM } from "@/lib/portfolio-data"

export function Hero({ contact, aboutTraits, funFacts }: { contact: ContactVM; aboutTraits: AboutTraitVM[]; funFacts: string[] }) {
  const card = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = card.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
  }
  const reset = () => { if (card.current) card.current.style.transform = "" }

  return (
    <section data-scene="hero" id="hero-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
      <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center max-w-6xl mx-auto w-full">
        {/* Left — terminal readout */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="pf-label pf-cursor" style={{ color: "var(--pf-coral)" }}>&gt; whoami</span>
          </div>

          <h1 className="font-heading text-6xl md:text-8xl font-bold leading-[0.92] tracking-tight pf-glow-text" style={{ color: "var(--pf-cream)" }}>
            {contact.name}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono-pf text-sm">
            <span style={{ color: "var(--pf-muted-fg)" }}>role<span style={{ color: "var(--pf-teal-glow)" }}>:</span></span>
            <span style={{ color: "var(--pf-coral)" }}>{contact.role.toLowerCase().replace(/\s+/g, "_")}()</span>
            {contact.heroBadge && (
              <span className="inline-flex items-center gap-2 px-3 py-1 border font-mono-pf text-xs" style={{ borderColor: "var(--pf-line)", color: "var(--pf-sand)" }}>
                <span className="pf-status-dot" /> {contact.heroBadge}
              </span>
            )}
          </div>

          <p className="mt-7 max-w-md leading-relaxed border-l-2 pl-4" style={{ color: "var(--pf-muted-fg)", borderColor: "var(--pf-line)" }}>
            {contact.heroDescription}
          </p>

          {/* Meta chips */}
          <div className="mt-7 grid grid-cols-3 gap-px max-w-md border" style={{ borderColor: "var(--pf-line)", background: "var(--pf-line)" }}>
            {[["FOCUS", "web3 / fullstack"], ["STATUS", "learning"], ["STACK", "ts · sol · rust"]].map(([k, v]) => (
              <div key={k} className="p-3" style={{ background: "var(--pf-bg-deep)" }}>
                <div className="pf-label text-[10px] mb-1">{k}</div>
                <div className="font-mono-pf text-xs" style={{ color: "var(--pf-sand)" }}>{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <a href="#projects-scene" className="pf-focusable cursor-pointer group relative px-6 py-3 font-mono-pf text-sm uppercase tracking-wider transition" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)" }}>
              View Work <span className="inline-block transition group-hover:translate-x-1">→</span>
            </a>
            <a href="#contact-scene" className="pf-focusable cursor-pointer px-6 py-3 font-mono-pf text-sm uppercase tracking-wider border transition hover:border-current" style={{ borderColor: "var(--pf-teal-glow)", color: "var(--pf-sand)" }}>
              Contact ↗
            </a>
          </div>
        </div>

        {/* Right — bracketed photo terminal */}
        <div className="flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -top-6 left-0 pf-label text-[10px]" style={{ color: "var(--pf-muted-fg)" }}>
              0x8f<span style={{ color: "var(--pf-coral)" }}>…</span>a3e1
            </div>
            <div
              ref={card}
              onMouseMove={onMove}
              onMouseLeave={reset}
              className="relative pf-brackets pf-scanline overflow-hidden transition-transform duration-200 will-change-transform"
              style={{ borderRadius: 2, boxShadow: "0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px var(--pf-line)" }}
            >
              <Image src={contact.photoUrl} alt={contact.name} width={380} height={470} className="object-cover" priority />
              <div className="absolute bottom-0 inset-x-0 p-3 font-mono-pf text-[10px] flex justify-between" style={{ background: "linear-gradient(transparent, rgba(15,42,46,0.9))", color: "var(--pf-sand)" }}>
                <span>./portrait.png</span>
                <span style={{ color: "var(--pf-teal-glow)" }}>● live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

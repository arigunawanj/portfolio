"use client"

import type { TechCategoryVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"

export function Tech({ tech }: { tech: TechCategoryVM[] }) {
  return (
    <section data-scene="tech" id="tech-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead index="01" tag="// stack.config" title="Tech Stack" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tech.map((cat, ci) => (
            <div key={cat.key} className="pf-panel p-6" style={{ borderRadius: 2 }}>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold" style={{ color: "var(--pf-sand)" }}>{cat.title}</h3>
                <span className="font-mono-pf text-xs" style={{ color: "var(--pf-teal-glow)" }}>{String(ci + 1).padStart(2, "0")}</span>
              </div>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>{cat.description}</p>
              <div className="space-y-3">
                {cat.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between font-mono-pf text-xs mb-1.5">
                      <span style={{ color: "var(--pf-cream)" }}>{s.name}</span>
                      <span style={{ color: "var(--pf-teal-glow)" }}>{s.level}%</span>
                    </div>
                    <div className="h-1 overflow-hidden" style={{ background: "color-mix(in srgb, var(--pf-teal) 22%, transparent)" }}>
                      <div className="h-full" style={{ width: `${s.level}%`, background: "linear-gradient(90deg, var(--pf-teal-glow), var(--pf-coral))" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

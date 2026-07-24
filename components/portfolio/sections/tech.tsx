"use client"

import type { TechCategoryVM } from "@/lib/portfolio-data"

export function Tech({ tech }: { tech: TechCategoryVM[] }) {
  return (
    <section data-scene="tech" id="tech-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tech.map((cat) => (
            <div key={cat.key} className="rounded-2xl p-6 border transition hover:-translate-y-1" style={{ background: "color-mix(in srgb, var(--pf-bg-panel) 70%, transparent)", borderColor: "color-mix(in srgb, var(--pf-teal) 40%, transparent)" }}>
              <h3 className="font-heading text-xl font-semibold mb-1" style={{ color: "var(--pf-sand)" }}>{cat.title}</h3>
              <p className="text-sm mb-4" style={{ color: "var(--pf-muted-fg)" }}>{cat.description}</p>
              <div className="space-y-3">
                {cat.skills.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1" style={{ color: "var(--pf-cream)" }}>
                      <span>{s.name}</span><span>{s.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "color-mix(in srgb, var(--pf-teal) 25%, transparent)" }}>
                      <div className="h-full rounded-full" style={{ width: `${s.level}%`, background: "var(--pf-coral)" }} />
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

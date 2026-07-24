"use client"

import Image from "next/image"
import type { ProjectVM } from "@/lib/portfolio-data"

export function Projects({ projects }: { projects: ProjectVM[] }) {
  return (
    <section data-scene="projects" id="projects-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <article key={p.id} className="group rounded-2xl overflow-hidden border transition hover:-translate-y-1.5" style={{ background: "color-mix(in srgb, var(--pf-bg-panel) 75%, transparent)", borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
              {p.images[0] && (
                <div className="relative h-48 overflow-hidden">
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover transition group-hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "var(--pf-sand)" }}>{p.title}</h3>
                <p className="text-sm mb-4" style={{ color: "var(--pf-muted-fg)" }}>{p.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.slice(0, 5).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--pf-teal-glow) 20%, transparent)", color: "var(--pf-teal-glow)" }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-sm">
                  {p.demoLink !== "#" && <a href={p.demoLink} target="_blank" rel="noreferrer" style={{ color: "var(--pf-coral)" }}>Demo →</a>}
                  {p.githubLink !== "#" && <a href={p.githubLink} target="_blank" rel="noreferrer" style={{ color: "var(--pf-sand)" }}>Code →</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

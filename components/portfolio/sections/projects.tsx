"use client"

import Image from "next/image"
import type { ProjectVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"

export function Projects({ projects }: { projects: ProjectVM[] }) {
  return (
    <section data-scene="projects" id="projects-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <SectionHead index="02" tag="// deployments" title="Projects" />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <article key={p.id} className="group pf-panel pf-brackets overflow-hidden" style={{ borderRadius: 2 }}>
              {p.images[0] && (
                <div className="relative h-52 overflow-hidden">
                  <Image src={p.images[0]} alt={p.title} fill className="object-cover transition duration-500 group-hover:scale-105" style={{ filter: "saturate(0.9)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--pf-bg-deep) 85%, transparent))" }} />
                  <span className="absolute top-3 left-3 font-mono-pf text-[10px] px-2 py-1" style={{ background: "var(--pf-bg-deep)", color: "var(--pf-teal-glow)" }}>
                    PRJ_{String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "var(--pf-sand)" }}>{p.title}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--pf-muted-fg)" }}>{p.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {p.tags.slice(0, 5).map((t) => (
                    <span key={t} className="font-mono-pf text-[11px] px-2 py-0.5 border" style={{ borderColor: "var(--pf-line)", color: "var(--pf-teal-glow)" }}>{t}</span>
                  ))}
                </div>
                <div className="flex gap-5 font-mono-pf text-sm pt-4 border-t" style={{ borderColor: "var(--pf-line)" }}>
                  {p.demoLink !== "#" && <a href={p.demoLink} target="_blank" rel="noreferrer" className="pf-focusable cursor-pointer hover:opacity-70 transition" style={{ color: "var(--pf-coral)" }}>demo →</a>}
                  {p.githubLink !== "#" && <a href={p.githubLink} target="_blank" rel="noreferrer" className="pf-focusable cursor-pointer hover:opacity-70 transition" style={{ color: "var(--pf-sand)" }}>source →</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

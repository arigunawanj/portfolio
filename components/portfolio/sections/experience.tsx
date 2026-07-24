"use client"

import type { ExperienceVM, EducationVM, CertVM } from "@/lib/portfolio-data"
import { SectionHead } from "./section-head"

export function Experience({ experiences, education, certifications }: { experiences: ExperienceVM[]; education: EducationVM[]; certifications: CertVM[] }) {
  return (
    <section data-scene="experience" id="experience-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <SectionHead index="03" tag="// git log --history" title="Experience" />

        <div className="relative border-l pl-8 space-y-10" style={{ borderColor: "var(--pf-line)" }}>
          {experiences.map((e, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[37px] top-1.5 w-3 h-3 rotate-45" style={{ background: "var(--pf-coral)", boxShadow: "0 0 12px var(--pf-coral)" }} />
              <div className="font-mono-pf text-xs mb-1" style={{ color: "var(--pf-teal-glow)" }}>{e.company} · {e.duration}</div>
              <h3 className="font-heading text-xl font-semibold" style={{ color: "var(--pf-sand)" }}>{e.position}</h3>
              <ul className="mt-2 space-y-1.5 text-sm" style={{ color: "var(--pf-muted-fg)" }}>
                {e.description.slice(0, 3).map((d, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="font-mono-pf" style={{ color: "var(--pf-coral)" }}>+</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="pf-label mb-4">// education</div>
            {education.map((ed, i) => (
              <div key={i} className="mb-3 pf-panel p-4" style={{ borderRadius: 2 }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{ed.degree}</p>
                <p className="font-mono-pf text-xs mt-1" style={{ color: "var(--pf-muted-fg)" }}>{ed.institution} · {ed.duration}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="pf-label mb-4">// certifications</div>
            {certifications.map((c, i) => (
              <div key={i} className="mb-3 pf-panel p-4" style={{ borderRadius: 2 }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{c.name}</p>
                <p className="font-mono-pf text-xs mt-1" style={{ color: "var(--pf-muted-fg)" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

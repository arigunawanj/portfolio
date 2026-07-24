"use client"

import type { ExperienceVM, EducationVM, CertVM } from "@/lib/portfolio-data"

export function Experience({ experiences, education, certifications }: { experiences: ExperienceVM[]; education: EducationVM[]; certifications: CertVM[] }) {
  return (
    <section data-scene="experience" id="experience-scene" className="relative z-10 min-h-screen py-24 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12" style={{ color: "var(--pf-cream)" }}>Experience</h2>
        <div className="relative border-l-2 pl-8 space-y-10" style={{ borderColor: "color-mix(in srgb, var(--pf-teal-glow) 45%, transparent)" }}>
          {experiences.map((e, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rounded-full" style={{ background: "var(--pf-coral)" }} />
              <h3 className="font-heading text-xl font-semibold" style={{ color: "var(--pf-sand)" }}>{e.position}</h3>
              <p className="text-sm" style={{ color: "var(--pf-teal-glow)" }}>{e.company} · {e.duration}</p>
              <ul className="mt-2 space-y-1 text-sm list-disc list-inside" style={{ color: "var(--pf-muted-fg)" }}>
                {e.description.slice(0, 3).map((d, j) => <li key={j}>{d}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--pf-cream)" }}>Education</h3>
            {education.map((ed, i) => (
              <div key={i} className="mb-4 rounded-xl p-4 border" style={{ borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{ed.degree}</p>
                <p className="text-sm" style={{ color: "var(--pf-muted-fg)" }}>{ed.institution} · {ed.duration}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--pf-cream)" }}>Certifications</h3>
            {certifications.map((c, i) => (
              <div key={i} className="mb-4 rounded-xl p-4 border" style={{ borderColor: "color-mix(in srgb, var(--pf-teal) 35%, transparent)" }}>
                <p className="font-semibold" style={{ color: "var(--pf-sand)" }}>{c.name}</p>
                <p className="text-sm" style={{ color: "var(--pf-muted-fg)" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

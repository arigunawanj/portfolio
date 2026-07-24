"use client"

import type { ContactVM } from "@/lib/portfolio-data"

export function Contact({ contact }: { contact: ContactVM }) {
  const links = [
    ["GitHub", contact.githubUrl], ["LinkedIn", contact.linkedinUrl],
    ["Instagram", contact.instagramUrl], ["GitLab", contact.gitlabUrl], ["Twitter", contact.twitterUrl],
  ].filter(([, u]) => !!u) as [string, string][]

  return (
    <section data-scene="contact" id="contact-scene" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="pf-label pf-cursor" style={{ color: "var(--pf-coral)" }}>&gt; connect --init</span>
        </div>
        <h2 className="font-heading text-5xl md:text-7xl font-bold mb-6 tracking-tight pf-glow-text" style={{ color: "var(--pf-cream)" }}>
          Let&apos;s build<br />something on-chain
        </h2>
        <p className="font-mono-pf text-sm mb-10" style={{ color: "var(--pf-muted-fg)" }}>
          <span style={{ color: "var(--pf-teal-glow)" }}>@</span> {contact.location || "remote / worldwide"}
        </p>
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="pf-focusable cursor-pointer group inline-flex items-center gap-3 px-8 py-4 font-mono-pf text-sm md:text-base transition hover:scale-[1.02] mb-10" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)", borderRadius: 2 }}>
            <span className="pf-status-dot" />
            {contact.email}
            <span className="transition group-hover:translate-x-1">→</span>
          </a>
        )}
        <div className="flex justify-center gap-px flex-wrap border" style={{ borderColor: "var(--pf-line)", background: "var(--pf-line)" }}>
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="pf-focusable cursor-pointer px-5 py-3 font-mono-pf text-xs uppercase tracking-wider transition hover:text-current" style={{ background: "var(--pf-bg-deep)", color: "var(--pf-sand)" }}>{label} ↗</a>
          ))}
        </div>
      </div>
    </section>
  )
}

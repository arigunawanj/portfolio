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
        <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6" style={{ color: "var(--pf-cream)" }}>Let&apos;s build something</h2>
        <p className="mb-8" style={{ color: "var(--pf-muted-fg)" }}>{contact.location}</p>
        {contact.email && (
          <a href={`mailto:${contact.email}`} className="inline-block px-8 py-4 rounded-xl font-medium transition hover:scale-105 mb-8" style={{ background: "var(--pf-coral)", color: "var(--pf-bg-deep)" }}>
            {contact.email}
          </a>
        )}
        <div className="flex justify-center gap-6 flex-wrap">
          {links.map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="text-sm transition hover:opacity-70" style={{ color: "var(--pf-sand)" }}>{label}</a>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Mail, Phone, ExternalLink, ArrowUp } from "lucide-react"
import SectionHeader from "./section-header"

type ContactProfile = {
  name: string
  email: string
  phone: string | null
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  gitlabUrl: string | null
}

function extractHandle(url: string, platform: string) {
  try {
    const handle = new URL(url).pathname.split("/").filter(Boolean).pop()
    return handle ? `${platform}.com/${handle}` : url
  } catch {
    return url.replace(/https?:\/\/(www\.)?/, "")
  }
}

export default function Contact({ profile }: { profile: ContactProfile }) {
  const whatsappUrl = profile.phone
    ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`
    : null

  const connections = [
    profile.githubUrl && {
      name: "GitHub",
      url: profile.githubUrl,
      handle: extractHandle(profile.githubUrl, "github"),
      icon: <Github className="w-4 h-4 text-[#4F8CFF]" />
    },
    profile.linkedinUrl && {
      name: "LinkedIn",
      url: profile.linkedinUrl,
      handle: extractHandle(profile.linkedinUrl, "linkedin"),
      icon: <Linkedin className="w-4 h-4 text-[#4F8CFF]" />
    },
    profile.instagramUrl && {
      name: "Instagram",
      url: profile.instagramUrl,
      handle: extractHandle(profile.instagramUrl, "instagram"),
      icon: <Instagram className="w-4 h-4 text-[#8B5CF6]" />
    },
    whatsappUrl && profile.phone && {
      name: "WhatsApp",
      url: whatsappUrl,
      handle: profile.phone,
      icon: <Phone className="w-4 h-4 text-[#22C55E]" />
    },
    profile.email && {
      name: "Email",
      url: `mailto:${profile.email}`,
      handle: profile.email,
      icon: <Mail className="w-4 h-4 text-[#4F8CFF]" />
    }
  ].filter((x): x is Exclude<typeof x, false | null> => Boolean(x))

  const currentYear = new Date().getFullYear()

  return (
    <section id="contact" className="relative py-16 md:py-24 font-jetbrains">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <SectionHeader
          command="connect --with-me"
          title="Let's build something"
          description="Open to full-time roles, freelance work, and interesting collaborations — reach out through any of these."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {connections.map((conn, idx) => (
            <motion.a
              key={conn.name}
              href={conn.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 12 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="group flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-[#161D2F]/30 hover:bg-[#161D2F]/60 hover:border-[#4F8CFF]/25 transition-all duration-300"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-white/5 rounded border border-white/10 group-hover:bg-[#4F8CFF]/10 group-hover:border-[#4F8CFF]/20 transition-all shrink-0">
                  {conn.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-departure tracking-wider">
                    {conn.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground/75 truncate mt-0.5 max-w-[220px] font-mono">
                    {conn.handle}
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#4F8CFF] group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.a>
          ))}
        </div>

        {profile.location && (
          <div className="mt-6 flex items-center justify-between text-[11px] text-muted-foreground/60 font-ibm">
            <span>Based in {profile.location}</span>
            <span className="font-bold text-[#22C55E]">READY FOR REMOTE / HYBRID</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60 font-ibm">
        <span>© {currentYear} {profile.name}. All rights reserved.</span>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          Back to top
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  )
}

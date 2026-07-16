"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Copy,
  Check,
  ExternalLink,
  Instagram,
  Gitlab,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

type ContactProfile = {
  email: string
  phone: string | null
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  instagramUrl: string | null
  gitlabUrl: string | null
}

function extractHandle(url: string) {
  try {
    const segment = new URL(url).pathname.split("/").filter(Boolean).pop()
    return segment ? `@${segment}` : url
  } catch {
    return url
  }
}

export default function Contact({ profile }: { profile: ContactProfile }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      value: profile.email,
      link: `mailto:${profile.email}`,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    profile.phone && {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      value: profile.phone,
      link: `tel:${profile.phone.replace(/\s+/g, "")}`,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    profile.location && {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      value: profile.location,
      link: null,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
  ].filter((x): x is Exclude<typeof x, false | null> => Boolean(x))

  const socialLinks = [
    profile.githubUrl && {
      icon: <Github className="h-6 w-6" />,
      name: "GitHub",
      url: profile.githubUrl,
      color: "hover:text-primary",
      username: extractHandle(profile.githubUrl)
    },
    profile.linkedinUrl && {
      icon: <Linkedin className="h-6 w-6" />,
      name: "LinkedIn",
      url: profile.linkedinUrl,
      color: "hover:text-blue-600",
      username: extractHandle(profile.linkedinUrl)
    },
    profile.instagramUrl && {
      icon: <Instagram className="h-6 w-6" />,
      name: "Instagram",
      url: profile.instagramUrl,
      color: "hover:text-pink-500",
      username: extractHandle(profile.instagramUrl)
    },
    profile.gitlabUrl && {
      icon: <Gitlab className="h-6 w-6" />,
      name: "Gitlab",
      url: profile.gitlabUrl,
      color: "hover:text-orange-500",
      username: extractHandle(profile.gitlabUrl)
    },
  ].filter((x): x is Exclude<typeof x, false | null> => Boolean(x))

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-4 px-4 py-1 border-primary/20 bg-primary/5 text-primary">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-4 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-primary/5 hover:border-primary/20 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className={cn("p-4 rounded-2xl transition-all duration-500", info.bg, info.color)}>
                        {info.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                          {info.title}
                        </p>
                        {info.link ? (
                          <a href={info.link} className="text-lg font-bold truncate block hover:text-primary transition-colors">
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-lg font-bold truncate block">
                            {info.value}
                          </p>
                        )}
                      </div>
                      {info.link && (
                        <button 
                          onClick={() => handleCopy(info.value, info.title)}
                          className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
                        >
                          {copiedField === info.title ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Social Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="block h-full"
                >
                  <Card className="h-full glass-card border-primary/5 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      {social.icon}
                    </div>
                    <CardContent className="p-8">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className={cn("p-4 rounded-2xl bg-muted/50 inline-block mb-6 group-hover:scale-110 transition-transform duration-500", social.color)}>
                            {social.icon}
                          </div>
                          <h3 className="text-2xl font-black mb-2">{social.name}</h3>
                          <p className="text-muted-foreground font-bold">{social.username}</p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
                          Visit Profile
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <div className="glass p-12 rounded-[3rem] border-primary/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
              <Mail size={200} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black mb-6">Want to build something amazing?</h3>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              I'm currently available for freelance work and full-time opportunities. 
              Let's turn your vision into a digital masterpiece.
            </p>
            <Button size="lg" className="h-16 px-12 text-xl rounded-2xl shadow-xl shadow-primary/20 font-black" asChild>
              <a href={`mailto:${profile.email}`}>
                Send Me a Message
                <Mail className="ml-3 h-6 w-6" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { updateProfile } from "../../actions/profile"
import {
  User,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  Gitlab,
  Twitter,
  Globe,
  Save,
  Monitor,
  Terminal,
  Cpu
} from "lucide-react"

interface ProfileClientProps {
  initialData: any
}

const TABS = [
  { id: "identity", label: "Identity", icon: User },
  { id: "hero", label: "Hero Banner", icon: Sparkles },
  { id: "contact", label: "Contact Details", icon: Mail },
  { id: "social", label: "Social Profiles", icon: Github },
  { id: "seo", label: "SEO & Search", icon: Globe },
]

export default function ProfileClient({ initialData }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("identity")
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    heroBadge: initialData?.heroBadge || "",
    heroDescription: initialData?.heroDescription || "",
    photoUrl: initialData?.photoUrl || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    location: initialData?.location || "",
    githubUrl: initialData?.githubUrl || "",
    linkedinUrl: initialData?.linkedinUrl || "",
    instagramUrl: initialData?.instagramUrl || "",
    gitlabUrl: initialData?.gitlabUrl || "",
    twitterUrl: initialData?.twitterUrl || "",
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    faviconUrl: initialData?.faviconUrl || "",
    logoUrl: initialData?.logoUrl || "",
    metaKeywords: initialData?.metaKeywords || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      formData.append(key, val)
    })

    try {
      await updateProfile(formData)
      toast.success("Profile updated successfully!", {
        description: "Public portfolio has been refreshed with your new settings.",
      })
    } catch (error) {
      toast.error("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 font-mono-pf">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">Profile Configuration</h1>
        <p className="text-xs text-muted-foreground mt-1">// manage_site_identity: active</p>
      </div>

      {/* Grid split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Content & Tab Navigation */}
        <div className="xl:col-span-7 space-y-6">
          {/* Tab Navigation Menu (Dock style) */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md">
            {TABS.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? "text-white" 
                      : "text-muted-foreground hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-profile-tab"
                      className="absolute inset-0 bg-primary/15 border-l border-primary rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    />
                  )}
                  <TabIcon className={`h-3.5 w-3.5 relative z-10 ${isActive ? "text-primary animate-pulse" : ""}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form Card (Responsive Light/Dark theme styles) */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border border-white/5 rounded-2xl relative overflow-hidden backdrop-blur-md bg-black/40 group">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              
              <div className="p-6 sm:p-8 space-y-6">
                <AnimatePresence mode="wait">
                  {activeTab === "identity" && (
                    <motion.div
                      key="identity"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Identity.Name</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Identity.Title</Label>
                          <div className="relative">
                            <Sparkles className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="role" name="role" value={form.role} onChange={handleChange} required className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photoUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Photo.Source</Label>
                        <Input id="photoUrl" name="photoUrl" value={form.photoUrl} onChange={handleChange} required className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="logoUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Branding.Logo</Label>
                          <Input id="logoUrl" name="logoUrl" value={form.logoUrl} onChange={handleChange} required className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faviconUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Branding.Favicon</Label>
                          <Input id="faviconUrl" name="faviconUrl" value={form.faviconUrl} onChange={handleChange} required className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "hero" && (
                    <motion.div
                      key="hero"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="heroBadge" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Hero.Badge</Label>
                        <Input id="heroBadge" name="heroBadge" value={form.heroBadge} onChange={handleChange} required className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heroDescription" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Hero.Synopsis</Label>
                        <Textarea id="heroDescription" name="heroDescription" value={form.heroDescription} onChange={handleChange} rows={6} required className="bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all resize-none p-4" />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "contact" && (
                    <motion.div
                      key="contact"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Mail.Endpoint</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Phone.Signature</Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// Geolocation.Coordinates</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                          <Input id="location" name="location" value={form.location} onChange={handleChange} className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "social" && (
                    <motion.div
                      key="social"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="githubUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// URL.GitHub</Label>
                          <div className="relative">
                            <Github className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="githubUrl" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedinUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// URL.LinkedIn</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="linkedinUrl" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="instagramUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// URL.Instagram</Label>
                          <div className="relative">
                            <Instagram className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="instagramUrl" name="instagramUrl" value={form.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gitlabUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// URL.GitLab</Label>
                          <div className="relative">
                            <Gitlab className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                            <Input id="gitlabUrl" name="gitlabUrl" value={form.gitlabUrl} onChange={handleChange} placeholder="https://gitlab.com/..." className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitterUrl" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// URL.Twitter_X</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground/60" />
                          <Input id="twitterUrl" name="twitterUrl" value={form.twitterUrl} onChange={handleChange} placeholder="https://x.com/..." className="pl-10 h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "seo" && (
                    <motion.div
                      key="seo"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="metaTitle" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// SEO.Meta_Title</Label>
                        <Input id="metaTitle" name="metaTitle" value={form.metaTitle} onChange={handleChange} required className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// SEO.Meta_Description</Label>
                        <Textarea id="metaDescription" name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={5} required className="bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all resize-none p-4" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaKeywords" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">// SEO.Meta_Keywords</Label>
                        <Input id="metaKeywords" name="metaKeywords" value={form.metaKeywords} onChange={handleChange} placeholder="portfolio, software, react" className="h-10 bg-slate-950/40 border-white/5 text-xs text-white placeholder-white/15 focus-visible:ring-primary/45 rounded-xl transition-all" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-6 bg-linear-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-600/95 text-white font-bold tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl active:scale-[0.98] h-10 cursor-pointer"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  SIGNING_COMMIT...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-3.5 w-3.5" /> COMMIT_PROFILE_TO_LEDGER
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Right Side: Sticky Browser Shell Preview */}
        <div className="xl:col-span-5 xl:sticky xl:top-8 space-y-4">
          <div className="flex items-center gap-2 px-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <Monitor className="h-4 w-4 text-primary" />
            <span>Node State Preview</span>
          </div>

          {/* Browser Window Mockup Frame */}
          <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative bg-black/60 backdrop-blur-xl">
            {/* Top Bar of the Browser Window */}
            <div className="bg-slate-950/80 px-4 py-3 flex items-center justify-between border-b border-white/5">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              
              {/* Fake Address Bar */}
              <div className="w-full max-w-[200px] mx-auto bg-slate-900/50 border border-white/5 rounded-lg py-1 px-3 text-[9px] text-slate-400 font-mono select-all truncate flex items-center justify-center gap-1.5">
                <span className="text-emerald-400">https://</span>
                <span>localhost:3000</span>
              </div>
              
              {/* Fake Spacer */}
              <div className="w-8" />
            </div>

            {/* Browser Viewport Area (Actual Simulator) */}
            <div className="relative min-h-[460px] bg-slate-950 p-6 space-y-8 select-none text-white overflow-hidden">
              {/* Ambient glows */}
              <div className="absolute top-10 right-[-30px] w-48 h-48 bg-primary/5 rounded-full blur-[60px]" />
              <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 bg-purple-500/5 rounded-full blur-[50px]" />

              {/* simulated header brand navbar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo" className="h-4 w-auto object-contain max-w-[90px]" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                  ) : (
                    <span className="font-extrabold text-xs tracking-tight text-primary">PORTFOLIO</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-[8px] text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Home</span>
                  <span>About</span>
                  <span>Projects</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">CV</span>
                </div>
              </div>

              {/* Main Simulated Hero Section */}
              <div className="flex flex-col items-center text-center space-y-5 relative z-10 pt-4">
                {/* Simulated Badge */}
                {form.heroBadge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[8px] font-extrabold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                    {form.heroBadge}
                  </span>
                )}

                {/* Profile Photo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary to-purple-500 rounded-full blur-md scale-105 animate-pulse opacity-60" />
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-slate-900 bg-slate-900">
                    {form.photoUrl ? (
                      <img src={form.photoUrl} alt={form.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-user.jpg' }} />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center font-bold text-xs text-slate-600">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Role */}
                <div className="space-y-1.5 max-w-[280px]">
                  <h2 className="text-lg font-black text-white tracking-tight leading-none truncate">{form.name || "Ari Gunawan Jatmiko"}</h2>
                  <p className="text-[10px] font-bold text-slate-300 tracking-wide">{form.role || "Software Developer"}</p>
                </div>

                {/* Description */}
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-[320px] bg-slate-900/50 p-3.5 rounded-xl border border-white/5 backdrop-blur-sm min-h-[60px] line-clamp-3">
                  {form.heroDescription || "Specialized in building high-performance web applications..."}
                </p>

                {/* Simulated Ledger Payload */}
                <div className="w-full max-w-[280px] bg-black/40 border border-white/5 rounded-xl p-3 text-[8.5px] font-semibold text-left text-teal-400 space-y-1">
                  <p className="text-[8px] text-primary uppercase font-bold tracking-widest">// onchain_profile_payload</p>
                  <p className="text-white/60">{"{"}</p>
                  <p className="pl-3 truncate">"name": "{form.name}",</p>
                  <p className="pl-3 truncate">"role": "{form.role}",</p>
                  <p className="pl-3 truncate">"email": "{form.email || "null"}",</p>
                  <p className="pl-3">"status": "synchronized"</p>
                  <p className="text-white/60">{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

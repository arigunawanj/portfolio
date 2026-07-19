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
  Monitor
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Profile & Contact</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your personal brand, contact info, social links, and SEO tags.</p>
      </div>

      {/* Grid split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Content & Tab Navigation */}
        <div className="xl:col-span-7 space-y-6">
          {/* Tab Navigation Menu (Dock style) */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/60 border border-border/80 rounded-2xl backdrop-blur-md dark:bg-black/30 dark:border-white/5">
            {TABS.map((tab) => {
              const TabIcon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive 
                      ? "text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-profile-tab"
                      className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/15"
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                    />
                  )}
                  <TabIcon className={`h-4 w-4 relative z-10 ${isActive ? "animate-pulse" : ""}`} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form Card (Responsive Light/Dark theme styles) */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 group">
              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
              
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
                          <Label htmlFor="name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="pl-11 bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary focus-visible:border-primary/50 h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:placeholder-slate-600 dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Role / Professional Title</Label>
                          <div className="relative">
                            <Sparkles className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="role" name="role" value={form.role} onChange={handleChange} required className="pl-11 bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary focus-visible:border-primary/50 h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:placeholder-slate-600 dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="photoUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Profile Photo URL</Label>
                        <Input id="photoUrl" name="photoUrl" value={form.photoUrl} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="logoUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Branding Logo URL</Label>
                          <Input id="logoUrl" name="logoUrl" value={form.logoUrl} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="faviconUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Favicon Icon URL</Label>
                          <Input id="faviconUrl" name="faviconUrl" value={form.faviconUrl} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
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
                        <Label htmlFor="heroBadge" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Hero Banner Badge</Label>
                        <Input id="heroBadge" name="heroBadge" value={form.heroBadge} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="heroDescription" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Hero Description</Label>
                        <Textarea id="heroDescription" name="heroDescription" value={form.heroDescription} onChange={handleChange} rows={6} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
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
                          <Label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Primary Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Current Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="location" name="location" value={form.location} onChange={handleChange} className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
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
                          <Label htmlFor="githubUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">GitHub Link</Label>
                          <div className="relative">
                            <Github className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="githubUrl" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedinUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">LinkedIn Link</Label>
                          <div className="relative">
                            <Linkedin className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="linkedinUrl" name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="instagramUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Instagram Link</Label>
                          <div className="relative">
                            <Instagram className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="instagramUrl" name="instagramUrl" value={form.instagramUrl} onChange={handleChange} placeholder="https://instagram.com/..." className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gitlabUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">GitLab Link</Label>
                          <div className="relative">
                            <Gitlab className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                            <Input id="gitlabUrl" name="gitlabUrl" value={form.gitlabUrl} onChange={handleChange} placeholder="https://gitlab.com/..." className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitterUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Twitter/X Link</Label>
                        <div className="relative">
                          <Twitter className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="twitterUrl" name="twitterUrl" value={form.twitterUrl} onChange={handleChange} placeholder="https://x.com/..." className="pl-11 bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
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
                        <Label htmlFor="metaTitle" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">SEO Meta Title</Label>
                        <Input id="metaTitle" name="metaTitle" value={form.metaTitle} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaDescription" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">SEO Meta Description</Label>
                        <Textarea id="metaDescription" name="metaDescription" value={form.metaDescription} onChange={handleChange} rows={5} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="metaKeywords" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">SEO Keywords (comma separated)</Label>
                        <Input id="metaKeywords" name="metaKeywords" value={form.metaKeywords} onChange={handleChange} placeholder="portfolio, software, react" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white dark:focus-visible:ring-primary/50" />
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
              className="w-full sm:w-auto px-8 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all rounded-xl h-11 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Profile
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Right Side: Sticky Browser Shell Preview */}
        <div className="xl:col-span-5 xl:sticky xl:top-8 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Monitor className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Live Preview Shell</span>
          </div>

          {/* Browser Window Mockup Frame */}
          <div className="bg-background border border-border/80 rounded-2xl overflow-hidden shadow-2xl relative group dark:bg-slate-900 dark:border-slate-800">
            {/* Top Bar of the Browser Window */}
            <div className="bg-muted/50 dark:bg-slate-950/80 px-4 py-3 flex items-center justify-between border-b border-border/40 dark:border-slate-800/80">
              {/* Fake Window Controls */}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              
              {/* Fake Address Bar */}
              <div className="w-full max-w-[260px] mx-auto bg-background border border-border/50 rounded-lg py-1 px-3 text-[10px] text-muted-foreground font-mono select-all truncate flex items-center justify-center gap-1.5 dark:bg-slate-900/50 dark:border-slate-800/50 dark:text-slate-400">
                <span className="text-emerald-500 dark:text-emerald-400">https://</span>
                <span>localhost:3000</span>
              </div>
              
              {/* Fake Spacer */}
              <div className="w-12" />
            </div>

            {/* Browser Viewport Area (Actual Simulator) */}
            <div className="relative min-h-[480px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),transparent)] bg-background p-6 space-y-8 select-none text-foreground overflow-hidden dark:bg-slate-950 dark:text-white dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]">
              {/* Ambient glows */}
              <div className="absolute top-10 right-[-30px] w-48 h-48 bg-primary/10 rounded-full blur-[60px]" />
              <div className="absolute bottom-[-30px] left-[-30px] w-36 h-36 bg-purple-500/10 rounded-full blur-[50px]" />

              {/* simulated header brand navbar */}
              <div className="flex items-center justify-between border-b border-border/40 dark:border-slate-800/40 pb-4 relative z-10">
                <div className="flex items-center gap-2">
                  {form.logoUrl ? (
                    <img src={form.logoUrl} alt="Logo" className="h-5 w-auto object-contain max-w-[90px]" onError={(e) => { (e.target as HTMLElement).style.display = 'none' }} />
                  ) : (
                    <span className="font-extrabold text-xs tracking-tight text-primary">PORTFOLIO</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-[9px] text-muted-foreground font-semibold uppercase tracking-wider dark:text-slate-400">
                  <span>Home</span>
                  <span>About</span>
                  <span>Projects</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:border-primary/30">CV</span>
                </div>
              </div>

              {/* Main Simulated Hero Section */}
              <div className="flex flex-col items-center text-center space-y-5 relative z-10 pt-4">
                {/* Simulated Badge */}
                {form.heroBadge && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2 animate-pulse" />
                    {form.heroBadge}
                  </span>
                )}

                {/* Profile Photo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-tr from-primary to-purple-500 rounded-full blur-md scale-105 animate-pulse opacity-60" />
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-[3px] border-background bg-muted dark:border-slate-900 dark:bg-slate-900">
                    {form.photoUrl ? (
                      <img src={form.photoUrl} alt={form.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-user.jpg' }} />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center font-bold text-xs text-muted-foreground">
                        No Photo
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Role */}
                <div className="space-y-1.5 max-w-[280px]">
                  <h2 className="text-xl font-black text-gradient tracking-tight leading-none truncate">{form.name || "Ari Gunawan Jatmiko"}</h2>
                  <p className="text-xs font-bold text-muted-foreground dark:text-slate-300 tracking-wide">{form.role || "Software Developer"}</p>
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[320px] bg-muted/30 p-3.5 rounded-xl border border-border/40 backdrop-blur-sm min-h-[60px] line-clamp-3 dark:bg-slate-900/50 dark:border-slate-800/40 dark:text-slate-400">
                  {form.heroDescription || "Specialized in building high-performance web applications..."}
                </p>

                {/* Contacts & Location */}
                <div className="grid grid-cols-1 gap-1.5 text-[10px] text-muted-foreground border-t border-border/20 pt-4 w-full max-w-[300px] dark:text-slate-400 dark:border-slate-900">
                  {form.location && (
                    <div className="flex items-center justify-center gap-1.5">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span>{form.location}</span>
                    </div>
                  )}
                  {form.email && (
                    <div className="flex items-center justify-center gap-1.5">
                      <Mail className="h-3 w-3 text-primary" />
                      <span className="truncate max-w-[180px]">{form.email}</span>
                    </div>
                  )}
                  {form.phone && (
                    <div className="flex items-center justify-center gap-1.5">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{form.phone}</span>
                    </div>
                  )}
                </div>

                {/* Social icons */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <SocialIcon url={form.githubUrl} icon={Github} />
                  <SocialIcon url={form.linkedinUrl} icon={Linkedin} />
                  <SocialIcon url={form.instagramUrl} icon={Instagram} />
                  <SocialIcon url={form.gitlabUrl} icon={Gitlab} />
                  <SocialIcon url={form.twitterUrl} icon={Twitter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialIcon({ url, icon: IconComponent }: { url: string; icon: any }) {
  const hasUrl = !!url
  return (
    <div
      className={`p-2 rounded-full border transition-all duration-300 ${
        hasUrl
          ? "bg-primary/10 border-primary/20 text-primary shadow-sm hover:bg-primary hover:text-white dark:border-primary/30 dark:hover:text-white scale-105 cursor-pointer"
          : "bg-muted/30 border-border/30 text-muted-foreground/30 dark:bg-slate-950/40 dark:border-slate-900 dark:text-slate-700"
      }`}
    >
      <IconComponent className="h-3.5 w-3.5" />
    </div>
  )
}

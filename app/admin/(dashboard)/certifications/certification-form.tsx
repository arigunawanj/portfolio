"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Certification } from "@prisma/client"
import {
  FileText,
  Link2,
  Calendar,
  Save,
  Check,
  ShieldAlert,
  Award,
  ExternalLink,
  Globe
} from "lucide-react"

interface CertificationFormProps {
  item?: Certification
  action: (formData: FormData) => void
}

const TABS = [
  { id: "info", label: "Basic Info", icon: FileText },
  { id: "credentials", label: "Credentials & Skills", icon: ShieldAlert },
  { id: "theme", label: "Theme", icon: Link2 },
]

const PREMADE_GRADIENTS = [
  { value: "from-blue-500/20 via-indigo-500/20 to-blue-600/20", label: "Midnight Blue", colors: "from-blue-500 via-indigo-500 to-blue-600" },
  { value: "from-purple-500/20 via-pink-500/20 to-rose-600/20", label: "Sweet Orchid", colors: "from-purple-500 via-pink-500 to-rose-600" },
  { value: "from-emerald-500/20 via-teal-500/20 to-green-600/20", label: "Ocean Teal", colors: "from-emerald-500 via-teal-500 to-green-600" },
  { value: "from-amber-500/20 via-orange-500/20 to-red-600/20", label: "Volcano Red", colors: "from-amber-500 via-orange-500 to-red-600" },
  { value: "from-violet-500/20 via-fuchsia-500/20 to-purple-600/20", label: "Cyber Punk", colors: "from-violet-500 via-fuchsia-500 to-purple-600" },
]

export function CertificationForm({ item, action }: CertificationFormProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [isSaving, setIsSaving] = useState(false)

  const initialSkills = Array.isArray(item?.skills) ? (item!.skills as string[]) : []

  const [form, setForm] = useState({
    name: item?.name || "",
    issuer: item?.issuer || "",
    date: item?.date || "",
    description: item?.description || "",
    credentialId: item?.credentialId || "",
    credentialUrl: item?.credentialUrl || "",
    skills: initialSkills.join(", "),
    icon: item?.icon || "Award",
    color: item?.color || "from-blue-500/20 via-indigo-500/20 to-blue-600/20",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGradientSelect = (val: string) => {
    setForm((prev) => ({ ...prev, color: val }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("issuer", form.issuer)
    formData.append("date", form.date)
    formData.append("description", form.description)
    formData.append("credentialId", form.credentialId)
    formData.append("credentialUrl", form.credentialUrl)
    formData.append("skills", form.skills)
    formData.append("icon", form.icon)
    formData.append("color", form.color)
    formData.append("order", String(item?.order ?? 0))

    try {
      await action(formData)
      toast.success("Certification saved successfully!", {
        description: "Credentials database updated live.",
      })
    } catch (error) {
      toast.error("Failed to save certification.")
    } finally {
      setIsSaving(false)
    }
  }

  const parsedSkills = form.skills.split(",").map((s) => s.trim()).filter(Boolean)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Settings Editor */}
      <div className="xl:col-span-7 space-y-6">
        {/* Tab dock menu */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/65 border border-border/80 rounded-2xl backdrop-blur-md dark:bg-black/30 dark:border-white/5">
          {TABS.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-certification-form-tab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/15"
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
                <TabIcon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 group p-6 sm:p-8">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            <AnimatePresence mode="wait">
              {activeTab === "info" && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Certification Name</Label>
                      <Input id="name" name="name" value={form.name} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuer" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Issuer / Organization</Label>
                      <Input id="issuer" name="issuer" value={form.issuer} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Date Issued (e.g. November 2024)</Label>
                    <Input id="date" name="date" value={form.date} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Description / Skills Acquired</Label>
                    <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>
                </motion.div>
              )}

              {activeTab === "credentials" && (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="credentialId" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Credential ID</Label>
                      <Input id="credentialId" name="credentialId" value={form.credentialId} onChange={handleChange} placeholder="Optional" className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="credentialUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Verification URL</Label>
                      <Input id="credentialUrl" name="credentialUrl" value={form.credentialUrl} onChange={handleChange} placeholder="Optional verification link..." className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Associated Skills (Comma separated)</Label>
                    <Input id="skills" name="skills" value={form.skills} onChange={handleChange} placeholder="Cloud, Cybersecurity, React" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Lucide Icon name</Label>
                    <Input id="icon" name="icon" value={form.icon} onChange={handleChange} className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>
                </motion.div>
              )}

              {activeTab === "theme" && (
                <motion.div
                  key="theme"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Preset Gradients */}
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Color Gradient Theme</Label>
                    <div className="flex flex-wrap gap-2.5">
                      {PREMADE_GRADIENTS.map((g) => {
                        const isSelected = form.color === g.value
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => handleGradientSelect(g.value)}
                            className={`w-9 h-9 rounded-full bg-linear-to-tr ${g.colors} border-2 flex items-center justify-center transition-all ${
                              isSelected 
                                ? "border-slate-950 scale-110 shadow dark:border-white" 
                                : "border-transparent hover:scale-105"
                            }`}
                            title={g.label}
                          >
                            {isSelected && <Check className="h-4 w-4 text-white drop-shadow" />}
                          </button>
                        )
                      })}
                    </div>
                    
                    <div className="pt-2">
                      <Input id="color" name="color" value={form.color} onChange={handleChange} className="bg-background/50 border-border/80 text-foreground h-9 text-xs rounded-xl dark:bg-slate-950/40 dark:border-slate-850" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Action */}
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
                Saving Certification...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Certification
              </span>
            )}
          </Button>
        </form>
      </div>

      {/* Right Column: Live Mockup Simulator */}
      <div className="xl:col-span-5 xl:sticky xl:top-8 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Live Card Simulator</span>
        </div>

        {/* Certificate Card Mockup */}
        <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 flex items-stretch select-none">
          <div className={`w-1.5 bg-linear-to-b ${form.color} rounded-l-2xl shrink-0 self-stretch`} />

          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 min-w-0">
            {/* Award icon mockup */}
            <div className="relative w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 self-center">
              <Award className="h-5 w-5" />
            </div>

            {/* Details area */}
            <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
              <div>
                <h3 className="font-extrabold text-sm text-foreground">
                  {form.name || "Certification Title Placeholder"}
                </h3>
                
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80 mt-1">
                  <span className="font-bold text-primary">{form.issuer || "Issuing Body"}</span>
                  <span className="text-slate-350 dark:text-slate-500">|</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {form.date || "Date"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground/95 line-clamp-2 leading-relaxed bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/20">
                {form.description || "Brief detail preview on the certificate's subject matter..."}
              </p>

              {/* credential values */}
              {form.credentialId && (
                <p className="text-[10px] text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded border border-border/30 truncate">
                  ID: {form.credentialId}
                </p>
              )}

              {/* tags list */}
              {parsedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {parsedSkills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick verification indicator link */}
            {form.credentialUrl && (
              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-border/30 pt-3 sm:pt-0 sm:pl-4">
                <a
                  href={form.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Verify</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

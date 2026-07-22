"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { WorkExperience } from "@prisma/client"
import {
  FileText,
  LayoutGrid,
  Link2,
  Calendar,
  MapPin,
  Globe,
  Briefcase,
  Save,
  Check,
  Plus,
  Trash2,
  ListTodo,
  Image as ImageIcon
} from "lucide-react"

interface ExperienceFormProps {
  item?: WorkExperience
  action: (formData: FormData) => void
}

const TABS = [
  { id: "info", label: "Basic Info", icon: FileText },
  { id: "details", label: "Job Details", icon: LayoutGrid },
  { id: "theme", label: "Links & Theme", icon: Link2 },
]

const PREMADE_GRADIENTS = [
  { value: "from-blue-500/20 to-indigo-500/20", label: "Blue Indigo", colors: "from-blue-500 to-indigo-500" },
  { value: "from-purple-500/20 to-pink-500/20", label: "Purple Pink", colors: "from-purple-500 to-pink-500" },
  { value: "from-emerald-500/20 to-green-500/20", label: "Emerald Green", colors: "from-emerald-500 to-green-500" },
  { value: "from-amber-500/20 to-red-500/20", label: "Amber Red", colors: "from-amber-500 to-red-500" },
  { value: "from-violet-500/20 to-fuchsia-500/20", label: "Violet Fuchsia", colors: "from-violet-500 to-fuchsia-500" },
]

export function ExperienceForm({ item, action }: ExperienceFormProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [isSaving, setIsSaving] = useState(false)

  const initialDescription = Array.isArray(item?.description) ? (item!.description as string[]) : []
  const initialSkills = Array.isArray(item?.skills) ? (item!.skills as string[]) : []
  const initialImages = Array.isArray(item?.images) ? (item!.images as string[]) : []

  const [form, setForm] = useState({
    position: item?.position || "",
    company: item?.company || "",
    duration: item?.duration || "",
    location: item?.location || "",
    skills: initialSkills.join(", "),
    companyUrl: item?.companyUrl || "",
    color: item?.color || "from-blue-500/20 to-indigo-500/20",
  })

  // Description bullets list
  const [bulletsList, setBulletsList] = useState<string[]>(initialDescription)
  const [newBulletText, setNewBulletText] = useState("")

  // Real work photos list
  const [imagesList, setImagesList] = useState<string[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGradientSelect = (val: string) => {
    setForm((prev) => ({ ...prev, color: val }))
  }

  const addBullet = () => {
    if (!newBulletText.trim()) return
    setBulletsList((prev) => [...prev, newBulletText.trim()])
    setNewBulletText("")
  }

  const removeBullet = (idx: number) => {
    setBulletsList((prev) => prev.filter((_, i) => i !== idx))
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return
    setImagesList((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl("")
  }

  const removeImage = (idx: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append("position", form.position)
    formData.append("company", form.company)
    formData.append("duration", form.duration)
    formData.append("location", form.location)
    formData.append("description", bulletsList.join("\n"))
    formData.append("skills", form.skills)
    formData.append("images", imagesList.join("\n"))
    formData.append("companyUrl", form.companyUrl)
    formData.append("color", form.color)
    formData.append("order", String(item?.order ?? 0))

    try {
      await action(formData)
      toast.success("Work experience entry saved successfully!", {
        description: "Employment details updated live.",
      })
    } catch (error) {
      toast.error("Failed to save experience entry.")
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
                    layoutId="active-experience-form-tab"
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

        {/* Form panel card */}
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
                      <Label htmlFor="position" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Position / Job Title</Label>
                      <Input id="position" name="position" value={form.position} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Company Name</Label>
                      <Input id="company" name="company" value={form.company} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Duration (e.g. Jan 2024 - Present)</Label>
                      <Input id="duration" name="duration" value={form.duration} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Location (e.g. Jakarta, Indonesia)</Label>
                      <Input id="location" name="location" value={form.location} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Interactive Bullet descriptions manager */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <ListTodo className="h-3.5 w-3.5 text-primary" /> Job Description Bullets
                    </Label>

                    {/* Add Inline Form */}
                    <div className="flex gap-2">
                      <Input
                        value={newBulletText}
                        onChange={(e) => setNewBulletText(e.target.value)}
                        placeholder="Add a new responsibility bullet..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addBullet()
                          }
                        }}
                        className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl dark:bg-slate-950/40 dark:border-slate-850 dark:text-white"
                      />
                      <Button
                        type="button"
                        onClick={addBullet}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl"
                        title="Add bullet point"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Bullet List */}
                    <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {bulletsList.map((bullet, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between p-2.5 bg-background border border-border/60 rounded-xl dark:bg-slate-950/20 dark:border-white/5"
                          >
                            <span className="text-xs text-foreground truncate flex-1 pr-4">{bullet}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBullet(idx)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {bulletsList.length === 0 && (
                        <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-xl">
                          No bullet points configured. Add one above.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Skills Acquired / Used (Comma separated)</Label>
                    <Input id="skills" name="skills" value={form.skills} onChange={handleChange} placeholder="React, Next.js, PostgreSQL" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
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
                  {/* Real work photos manager */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" /> Work Photos (optional, real photos only)
                    </Label>

                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste real photo URL here..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addImage()
                          }
                        }}
                        className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl dark:bg-slate-950/40 dark:border-slate-850 dark:text-white"
                      />
                      <Button
                        type="button"
                        onClick={addImage}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl"
                        title="Add photo link"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {imagesList.map((url, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-video bg-muted border border-border/60 rounded-xl overflow-hidden group/image shadow-sm"
                          >
                            <img src={url} alt={`Work photo ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg" }} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImage(idx)}
                                className="h-8 w-8 rounded-lg"
                                title="Remove photo"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {imagesList.length === 0 && (
                        <div className="col-span-full text-center py-6 text-xs text-muted-foreground italic bg-muted/20 border border-dashed rounded-xl">
                          No photos added. This section stays hidden on the live site until you add real ones here.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyUrl" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Company Website Link</Label>
                    <Input id="companyUrl" name="companyUrl" value={form.companyUrl} onChange={handleChange} placeholder="https://company.com..." className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  {/* Gradient Selector */}
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Experience Node Gradient Theme</Label>
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
                    
                    {/* Fallback custom input */}
                    <div className="pt-2">
                      <Input id="color" name="color" value={form.color} onChange={handleChange} placeholder="Custom classes (e.g. from-blue-500/20 to-indigo-500/20)" className="bg-background/50 border-border/80 text-foreground h-9 text-xs rounded-xl dark:bg-slate-950/40 dark:border-slate-850" />
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
                Saving Experience...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Experience Entry
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

        {/* Outer Visual Card Mockup (Matches reordered item layouts) */}
        <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 flex items-stretch select-none">
          {/* Accent Color Band */}
          <div className={`w-1.5 bg-linear-to-b ${form.color} rounded-l-2xl shrink-0 self-stretch`} />

          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 min-w-0">
            {/* Job Icon Placeholder */}
            <div className="relative w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 self-center">
              <Briefcase className="h-5 w-5" />
            </div>

            {/* Details Area */}
            <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-baseline gap-1.5 flex-wrap">
                  <span>{form.position || "Job Position Title"}</span>
                  <span className="text-muted-foreground font-semibold text-xs">at</span>
                  <span className="text-primary font-bold text-xs">{form.company || "Company Name"}</span>
                </h3>
                
                {/* Meta info row */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground/80 mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    {form.duration || "Duration"}
                  </span>
                  {form.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-primary/70" />
                      {form.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Description bullet preview */}
              {bulletsList.length > 0 && (
                <p className="text-xs text-muted-foreground/90 line-clamp-2 italic bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/20">
                  • {bulletsList[0]}
                </p>
              )}

              {/* Skill Tag pills */}
              {parsedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {parsedSkills.slice(0, 4).map((skill, i) => (
                    <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                      {skill}
                    </span>
                  ))}
                  {parsedSkills.length > 4 && (
                    <span className="text-[9px] font-bold text-muted-foreground px-1 py-0.5">
                      +{parsedSkills.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Indicators */}
            {form.companyUrl && (
              <div className="flex sm:flex-col items-center gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-border/30 pt-3 sm:pt-0 sm:pl-4">
                <a
                  href={form.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                >
                  <Globe className="h-3 w-3" />
                  <span>Site</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

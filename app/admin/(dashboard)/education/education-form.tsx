"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Education } from "@prisma/client"
import {
  FileText,
  LayoutGrid,
  Link2,
  Calendar,
  MapPin,
  Save,
  Check,
  Plus,
  Trash2,
  ListTodo,
  BookOpen,
  GraduationCap,
  Globe
} from "lucide-react"

interface EducationFormProps {
  item?: Education
  action: (formData: FormData) => void
}

const TABS = [
  { id: "info", label: "Basic Info", icon: FileText },
  { id: "thesis", label: "Thesis Info", icon: BookOpen },
  { id: "curriculum", label: "Achievements & Courses", icon: LayoutGrid },
]

const PREMADE_GRADIENTS = [
  { value: "from-blue-500/20 to-indigo-500/20", label: "Blue Indigo", colors: "from-blue-500 to-indigo-500" },
  { value: "from-purple-500/20 to-pink-500/20", label: "Purple Pink", colors: "from-purple-500 to-pink-500" },
  { value: "from-emerald-500/20 to-green-500/20", label: "Emerald Green", colors: "from-emerald-500 to-green-500" },
  { value: "from-amber-500/20 to-red-500/20", label: "Amber Red", colors: "from-amber-500 to-red-500" },
  { value: "from-violet-500/20 to-fuchsia-500/20", label: "Violet Fuchsia", colors: "from-violet-500 to-fuchsia-500" },
]

export function EducationForm({ item, action }: EducationFormProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [isSaving, setIsSaving] = useState(false)

  const initialAchievements = Array.isArray(item?.achievements) ? (item!.achievements as string[]) : []
  const initialCourses = Array.isArray(item?.courses) ? (item!.courses as string[]) : []

  const [form, setForm] = useState({
    degree: item?.degree || "",
    institution: item?.institution || "",
    duration: item?.duration || "",
    location: item?.location || "",
    description: item?.description || "",
    thesisTitle: item?.thesisTitle || "",
    thesisAdvisor: item?.thesisAdvisor || "",
    thesisAbstract: item?.thesisAbstract || "",
    color: item?.color || "from-blue-500/20 to-indigo-500/20",
  })

  // Dynamic lists
  const [achievementsList, setAchievementsList] = useState<string[]>(initialAchievements)
  const [newAchievementText, setNewAchievementText] = useState("")

  const [coursesList, setCoursesList] = useState<string[]>(initialCourses)
  const [newCourseText, setNewCourseText] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleGradientSelect = (val: string) => {
    setForm((prev) => ({ ...prev, color: val }))
  }

  const addAchievement = () => {
    if (!newAchievementText.trim()) return
    setAchievementsList((prev) => [...prev, newAchievementText.trim()])
    setNewAchievementText("")
  }

  const removeAchievement = (idx: number) => {
    setAchievementsList((prev) => prev.filter((_, i) => i !== idx))
  }

  const addCourse = () => {
    if (!newCourseText.trim()) return
    setCoursesList((prev) => [...prev, newCourseText.trim()])
    setNewCourseText("")
  }

  const removeCourse = (idx: number) => {
    setCoursesList((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append("degree", form.degree)
    formData.append("institution", form.institution)
    formData.append("duration", form.duration)
    formData.append("location", form.location)
    formData.append("description", form.description)
    formData.append("thesisTitle", form.thesisTitle)
    formData.append("thesisAdvisor", form.thesisAdvisor)
    formData.append("thesisAbstract", form.thesisAbstract)
    formData.append("achievements", achievementsList.join("\n"))
    formData.append("courses", coursesList.join("\n"))
    formData.append("color", form.color)
    formData.append("order", String(item?.order ?? 0))

    try {
      await action(formData)
      toast.success("Education entry saved successfully!", {
        description: "Academic profile updated live.",
      })
    } catch (error) {
      toast.error("Failed to save education entry.")
    } finally {
      setIsSaving(false)
    }
  }

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
                    layoutId="active-education-form-tab"
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
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

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
                      <Label htmlFor="degree" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Academic Degree (e.g. Bachelor)</Label>
                      <Input id="degree" name="degree" value={form.degree} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Institution / University</Label>
                      <Input id="institution" name="institution" value={form.institution} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Duration (e.g. 2018 - 2022)</Label>
                      <Input id="duration" name="duration" value={form.duration} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Location (e.g. Malang, Indonesia)</Label>
                      <Input id="location" name="location" value={form.location} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Overview / Description</Label>
                    <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>
                </motion.div>
              )}

              {activeTab === "thesis" && (
                <motion.div
                  key="thesis"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="thesisTitle" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Thesis Title</Label>
                      <Input id="thesisTitle" name="thesisTitle" value={form.thesisTitle} onChange={handleChange} placeholder="Optional" className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thesisAdvisor" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Thesis Advisor</Label>
                      <Input id="thesisAdvisor" name="thesisAdvisor" value={form.thesisAdvisor} onChange={handleChange} placeholder="Optional" className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thesisAbstract" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Thesis Abstract</Label>
                    <Textarea id="thesisAbstract" name="thesisAbstract" value={form.thesisAbstract} onChange={handleChange} rows={5} placeholder="Optional abstract content..." className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>
                </motion.div>
              )}

              {activeTab === "curriculum" && (
                <motion.div
                  key="curriculum"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Achievements builder */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <ListTodo className="h-3.5 w-3.5 text-primary" /> Key Achievements (Prizes, GPA, honors...)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newAchievementText}
                        onChange={(e) => setNewAchievementText(e.target.value)}
                        placeholder="Add an achievement..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addAchievement()
                          }
                        }}
                        className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl dark:bg-slate-950/40 dark:border-slate-850 dark:text-white"
                      />
                      <Button type="button" onClick={addAchievement} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {achievementsList.map((ach, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between p-2 bg-background border border-border/60 rounded-xl dark:bg-slate-950/20 dark:border-white/5">
                            <span className="text-xs text-foreground truncate flex-1 pr-4">{ach}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeAchievement(idx)} className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Courses builder */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-primary" /> Key Elective Courses
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={newCourseText}
                        onChange={(e) => setNewCourseText(e.target.value)}
                        placeholder="Add a course name..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCourse()
                          }
                        }}
                        className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl dark:bg-slate-950/40 dark:border-slate-850 dark:text-white"
                      />
                      <Button type="button" onClick={addCourse} size="icon" className="h-10 w-10 shrink-0 rounded-xl">
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {coursesList.map((course, idx) => (
                          <motion.div key={idx} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-between p-2 bg-background border border-border/60 rounded-xl dark:bg-slate-950/20 dark:border-white/5">
                            <span className="text-xs text-foreground truncate flex-1 pr-4">{course}</span>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeCourse(idx)} className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Gradient pill selector */}
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Timeline Node Gradient Theme</Label>
                    <div className="flex flex-wrap gap-2.5">
                      {PREMADE_GRADIENTS.map((g) => {
                        const isSelected = form.color === g.value
                        return (
                          <button
                            key={g.value}
                            type="button"
                            onClick={() => handleGradientSelect(g.value)}
                            className={`w-9 h-9 rounded-full bg-gradient-to-tr ${g.colors} border-2 flex items-center justify-center transition-all ${
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
                Saving Education...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Education Entry
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

        {/* Mock Academic Node Card */}
        <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 flex items-stretch select-none">
          <div className={`w-1.5 bg-gradient-to-b ${form.color} rounded-l-2xl shrink-0 self-stretch`} />

          <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 min-w-0">
            {/* Degree icon */}
            <div className="relative w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 self-center">
              <GraduationCap className="h-5 w-5" />
            </div>

            {/* Details area */}
            <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
              <div>
                <h3 className="font-extrabold text-sm text-foreground flex items-baseline gap-1.5 flex-wrap">
                  <span>{form.degree || "Degree Title Placeholder"}</span>
                  <span className="text-muted-foreground font-semibold text-xs">at</span>
                  <span className="text-primary font-bold text-xs">{form.institution || "University Name"}</span>
                </h3>
                
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

              {/* description overview */}
              <p className="text-xs text-muted-foreground/95 line-clamp-2 leading-relaxed bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/20">
                {form.description || "Overview text showing details of your studies..."}
              </p>

              {/* thesis indicators */}
              {form.thesisTitle && (
                <div className="text-[10px] text-muted-foreground bg-primary/5 border border-primary/15 rounded-lg p-2 space-y-0.5">
                  <p className="font-bold text-foreground truncate">Thesis: {form.thesisTitle}</p>
                  {form.thesisAdvisor && <p className="text-[9px]">Advisor: {form.thesisAdvisor}</p>}
                </div>
              )}

              {/* achievements tag highlights */}
              {achievementsList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {achievementsList.slice(0, 3).map((ach, i) => (
                    <span key={i} className="text-[8px] font-black tracking-wide uppercase px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                      🏆 {ach}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

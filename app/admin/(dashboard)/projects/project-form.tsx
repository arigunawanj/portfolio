"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Project } from "@prisma/client"
import {
  FileText,
  LayoutGrid,
  Link2,
  Globe,
  Github,
  EyeOff,
  Image as ImageIcon,
  Save,
  Check,
  Plus,
  Trash2,
  ListTodo
} from "lucide-react"

interface ProjectFormProps {
  project?: Project
  action: (formData: FormData) => void
}

const TABS = [
  { id: "info", label: "Basic Info", icon: FileText },
  { id: "details", label: "Detailed Bio", icon: LayoutGrid },
  { id: "media", label: "Media & Theme", icon: Link2 },
]

const PREMADE_GRADIENTS = [
  { value: "from-blue-500/20 to-cyan-500/20", label: "Blue Cyan", colors: "from-blue-500 to-cyan-500" },
  { value: "from-purple-500/20 to-indigo-500/20", label: "Purple Indigo", colors: "from-purple-500 to-indigo-500" },
  { value: "from-pink-500/20 to-rose-500/20", label: "Pink Rose", colors: "from-pink-500 to-rose-500" },
  { value: "from-emerald-500/20 to-teal-500/20", label: "Emerald Teal", colors: "from-emerald-500 to-teal-500" },
  { value: "from-amber-500/20 to-orange-500/20", label: "Amber Orange", colors: "from-amber-500 to-orange-500" },
  { value: "from-violet-500/20 to-fuchsia-500/20", label: "Violet Fuchsia", colors: "from-violet-500 to-fuchsia-500" },
]

export function ProjectForm({ project, action }: ProjectFormProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [isSaving, setIsSaving] = useState(false)

  const initialImages = Array.isArray(project?.images) ? (project!.images as string[]) : []
  const initialTags = Array.isArray(project?.tags) ? (project!.tags as string[]) : []
  const initialFeatures = Array.isArray(project?.features) ? (project!.features as string[]) : []

  const [form, setForm] = useState({
    title: project?.title || "",
    shortDescription: project?.shortDescription || "",
    description: project?.description || "",
    fullDescription: project?.fullDescription || "",
    tags: initialTags.join(", "),
    demoLink: project?.demoLink || "",
    githubLink: project?.githubLink || "",
    color: project?.color || "from-blue-500/20 to-cyan-500/20",
    published: project?.published ?? true,
  })

  // Dynamic interactive lists states
  const [imagesList, setImagesList] = useState<string[]>(initialImages)
  const [newImageUrl, setNewImageUrl] = useState("")

  const [featuresList, setFeaturesList] = useState<string[]>(initialFeatures)
  const [newFeatureText, setNewFeatureText] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, published: e.target.checked }))
  }

  const handleGradientSelect = (val: string) => {
    setForm((prev) => ({ ...prev, color: val }))
  }

  // Features list actions
  const addFeature = () => {
    if (!newFeatureText.trim()) return
    setFeaturesList((prev) => [...prev, newFeatureText.trim()])
    setNewFeatureText("")
  }

  const removeFeature = (idx: number) => {
    setFeaturesList((prev) => prev.filter((_, i) => i !== idx))
  }

  // Images list actions
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
    formData.append("title", form.title)
    formData.append("shortDescription", form.shortDescription)
    formData.append("description", form.description)
    formData.append("fullDescription", form.fullDescription)
    formData.append("images", imagesList.join("\n"))
    formData.append("tags", form.tags)
    formData.append("features", featuresList.join("\n"))
    formData.append("demoLink", form.demoLink)
    formData.append("githubLink", form.githubLink)
    formData.append("color", form.color)
    formData.append("published", String(form.published))
    formData.append("order", String(project?.order ?? 0))

    try {
      await action(formData)
      toast.success("Project saved successfully!", {
        description: "Portfolio changes have been synchronized live.",
      })
    } catch (error) {
      toast.error("Failed to save project.")
    } finally {
      setIsSaving(false)
    }
  }

  const thumbnail = imagesList.length > 0 ? imagesList[0] : null
  const parsedTags = form.tags.split(",").map((t) => t.trim()).filter(Boolean)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Settings Editor */}
      <div className="xl:col-span-7 space-y-6">
        {/* Dock Tabs Navigation */}
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
                    layoutId="active-project-form-tab"
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

        {/* Editor Form Card */}
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
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Project Title</Label>
                    <Input id="title" name="title" value={form.title} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Short Description</Label>
                    <Input id="shortDescription" name="shortDescription" value={form.shortDescription} onChange={handleChange} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Medium Description</Label>
                    <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
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
                  <div className="space-y-2">
                    <Label htmlFor="fullDescription" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Full In-Depth Description</Label>
                    <Textarea id="fullDescription" name="fullDescription" value={form.fullDescription} onChange={handleChange} rows={6} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  {/* Interactive Key Features List */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <ListTodo className="h-3.5 w-3.5 text-primary" /> Key Features
                    </Label>
                    
                    {/* Add Inline Form */}
                    <div className="flex gap-2">
                      <Input
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        placeholder="Add a new feature bullet..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addFeature()
                          }
                        }}
                        className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl dark:bg-slate-950/40 dark:border-slate-850 dark:text-white"
                      />
                      <Button
                        type="button"
                        onClick={addFeature}
                        size="icon"
                        className="h-10 w-10 shrink-0 rounded-xl"
                        title="Add feature"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Features List */}
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      <AnimatePresence initial={false}>
                        {featuresList.map((feat, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center justify-between p-2.5 bg-background border border-border/60 rounded-xl dark:bg-slate-950/20 dark:border-white/5"
                          >
                            <span className="text-xs text-foreground truncate flex-1 pr-4">{feat}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFeature(idx)}
                              className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {featuresList.length === 0 && (
                        <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/20 border border-dashed rounded-xl">
                          No features added yet. Add feature points above.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "media" && (
                <motion.div
                  key="media"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Interactive Image Manager */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-primary" /> Project Images
                    </Label>
                    
                    {/* Add URL field */}
                    <div className="flex gap-2">
                      <Input
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL here..."
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
                        title="Add image link"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Image Thumbnail Grid */}
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
                            <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-image.jpg" }} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImage(idx)}
                                className="h-8 w-8 rounded-lg"
                                title="Remove Image"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">
                              #{idx + 1}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {imagesList.length === 0 && (
                        <div className="col-span-full text-center py-6 text-xs text-muted-foreground italic bg-muted/20 border border-dashed rounded-xl">
                          No images configured. Paste an image URL above.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Tech Stack Tags (Comma separated)</Label>
                    <Input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="React, Node.js, Tailwind" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="demoLink" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Live Demo Link</Label>
                      <Input id="demoLink" name="demoLink" value={form.demoLink} onChange={handleChange} className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="githubLink" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">GitHub Link</Label>
                      <Input id="githubLink" name="githubLink" value={form.githubLink} onChange={handleChange} className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                    </div>
                  </div>

                  {/* Gradient Pill Selector */}
                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Card Color Gradient Theme</Label>
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
                    
                    {/* Fallback Custom color field */}
                    <div className="pt-2">
                      <Input id="color" name="color" value={form.color} onChange={handleChange} placeholder="Custom classes (e.g. from-blue-500/20 to-cyan-500/20)" className="bg-background/50 border-border/80 text-foreground h-9 text-xs rounded-xl dark:bg-slate-950/40 dark:border-slate-850" />
                    </div>
                  </div>

                  {/* Published Checkbox Toggle */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      id="published"
                      name="published"
                      type="checkbox"
                      checked={form.published}
                      onChange={handleCheckboxChange}
                      className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <Label htmlFor="published" className="text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none">
                      Publish Project (Make visible on live site)
                    </Label>
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
                Saving Project...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Project Settings
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
            {/* Image Thumbnail wrapper */}
            <div className="relative w-24 h-16 sm:w-28 sm:h-20 bg-muted/40 border border-border/40 rounded-xl overflow-hidden shrink-0 self-center">
              {thumbnail ? (
                <img src={thumbnail} alt={form.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900/10 dark:bg-slate-900/50 text-muted-foreground/40">
                  <ImageIcon className="h-4 w-4" />
                </div>
              )}
              {!form.published && (
                <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-[1px] flex items-center justify-center">
                  <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                </div>
              )}
            </div>

            {/* Middle Details */}
            <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
              <div>
                <h3 className="font-extrabold text-sm text-foreground truncate">
                  {form.title || "Project Title Placeholder"}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 min-h-[32px] leading-relaxed">
                  {form.shortDescription || "Write a brief description to see it render live on the card mockup..."}
                </p>
              </div>
              
              {parsedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {parsedTags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                      {tag}
                    </span>
                  ))}
                  {parsedTags.length > 3 && (
                    <span className="text-[9px] font-bold text-muted-foreground px-1 py-0.5">
                      +{parsedTags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Indicators */}
            <div className="flex sm:flex-col items-center gap-2 shrink-0 self-stretch sm:self-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-border/30 pt-3 sm:pt-0 sm:pl-4">
              <div className="flex flex-row sm:flex-col gap-1.5">
                <LinkCheck hasUrl={!!form.githubLink} icon={Github} label="Repo" />
                <LinkCheck hasUrl={!!form.demoLink} icon={Globe} label="Live" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LinkCheck({ hasUrl, icon: Icon, label }: { hasUrl: boolean; icon: any; label: string }) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wide px-2 py-1 rounded-lg border ${
        hasUrl 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
          : "bg-muted/40 border-border/30 text-muted-foreground/30 dark:text-slate-700"
      }`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  )
}

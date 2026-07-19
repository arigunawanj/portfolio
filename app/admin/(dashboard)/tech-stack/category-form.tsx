"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { TechCategory } from "@prisma/client"
import { Save, Globe, GripVertical, Terminal } from "lucide-react"

interface CategoryFormProps {
  item?: TechCategory
  action: (formData: FormData) => void
}

export function CategoryForm({ item, action }: CategoryFormProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    key: item?.key || "",
    icon: item?.icon || "",
    title: item?.title || "",
    description: item?.description || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData()
    formData.append("key", form.key)
    formData.append("icon", form.icon)
    formData.append("title", form.title)
    formData.append("description", form.description)
    formData.append("order", String(item?.order ?? 0))

    try {
      await action(formData)
      toast.success("Tech Category saved successfully!")
    } catch (error) {
      toast.error("Failed to save category.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form Editor */}
      <div className="xl:col-span-7 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 p-6 sm:p-8">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="key" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Slug Key (e.g. backend)</Label>
                  <Input id="key" name="key" value={form.key} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Lucide Icon (e.g. Database)</Label>
                  <Input id="icon" name="icon" value={form.icon} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Title</Label>
                <Input id="title" name="title" value={form.title} onChange={handleChange} required className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Description</Label>
                <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={4} required className="bg-background border-border/80 text-foreground focus-visible:ring-primary rounded-xl transition-all resize-none p-4 dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all rounded-xl h-11 active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? "Saving Category..." : "Save Category"}
          </Button>
        </form>
      </div>

      {/* Right Column: Live Mockup Preview */}
      <div className="xl:col-span-5 xl:sticky xl:top-8 space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Live Card Simulator</span>
        </div>

        <div className="bg-card text-card-foreground backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm overflow-hidden select-none">
          <div className="p-4 border-b border-border/40 flex items-center gap-3 bg-muted/20">
            <div className="text-muted-foreground p-2 hover:bg-muted/50 rounded-xl transition-all">
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-primary/10 text-primary font-bold text-xs uppercase tracking-wide px-2">
                {form.key || "key"}
              </span>
              <h3 className="font-bold text-base text-foreground">{form.title || "Category Title"}</h3>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed bg-muted/10 p-3 rounded-lg border border-border/20">
              {form.description || "Category description explaining the technologies in this category..."}
            </p>
            
            <div className="text-center py-4 text-xs text-muted-foreground/60 border border-dashed rounded-lg bg-background/50">
              Skills under this category will list here
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

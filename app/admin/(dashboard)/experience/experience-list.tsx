"use client"

import { useState } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteExperience, updateExperienceOrder } from "../../actions/experience"
import {
  GripVertical,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Briefcase,
  Search,
  CheckCircle2,
  Building,
  Wrench
} from "lucide-react"

interface ExperienceListClientProps {
  initialExperiences: any[]
}

export default function ExperienceListClient({ initialExperiences }: ExperienceListClientProps) {
  const [items, setItems] = useState(initialExperiences)
  const [search, setSearch] = useState("")

  const handleReorder = async (newOrder: any[]) => {
    setItems(newOrder)
    const ids = newOrder.map((e) => e.id)
    
    toast.promise(updateExperienceOrder(ids), {
      loading: "Saving new order...",
      success: "Experiences order updated successfully!",
      error: "Failed to update experiences order.",
    })
  }

  // Count stats metrics
  const totalCount = initialExperiences.length
  const uniqueCompanies = new Set(initialExperiences.map((e) => e.company)).size
  const totalSkills = new Set(
    initialExperiences.flatMap((e) => (Array.isArray(e.skills) ? (e.skills as string[]) : []))
  ).size

  // Filter items matching search string (position, company, or skills)
  const filteredItems = items.filter((e) => {
    const searchString = search.toLowerCase()
    const matchesPosition = e.position.toLowerCase().includes(searchString)
    const matchesCompany = e.company.toLowerCase().includes(searchString)
    const skills = Array.isArray(e.skills) ? (e.skills as string[]) : []
    const matchesSkills = skills.some((s) => s.toLowerCase().includes(searchString))
    return matchesPosition || matchesCompany || matchesSkills
  })

  return (
    <div className="space-y-6">
      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Roles</span>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Unique Companies</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{uniqueCompanies}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Building className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tech Skill Tags</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{totalSkills}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Wrench className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Interactive Search Filters */}
      <div className="flex items-center gap-3 bg-muted/30 border border-border/40 p-3 rounded-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles by title, company, or skill..."
            className="pl-10 pr-4 bg-background border-border/80 text-xs h-9 rounded-xl focus-visible:ring-primary dark:bg-slate-950/40"
          />
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/80 hidden sm:block uppercase tracking-wider px-2">
          💡 Drag handle (<GripVertical className="inline h-3.5 w-3.5" />) to sort
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
          No experience records matched your criteria. Try adjusting your query.
        </div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3.5">
          {filteredItems.map((e) => (
            <ExperienceItem
              key={e.id}
              e={e}
              onDelete={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}

function ExperienceItem({ e, onDelete }: { e: any; onDelete: (id: number) => void }) {
  const dragControls = useDragControls()
  const skills = Array.isArray(e.skills) ? (e.skills as string[]) : []
  const description = Array.isArray(e.description) ? (e.description as string[]) : []
  const colorGradient = e.color || "from-blue-500/20 to-indigo-500/20"

  return (
    <Reorder.Item
      value={e}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ 
        scale: 1.015, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 relative overflow-hidden backdrop-blur-md flex items-stretch select-none"
    >
      {/* Accent Gradient Left Strip */}
      <div className={`w-1.5 bg-gradient-to-b ${colorGradient} rounded-l-2xl shrink-0 self-stretch`} />

      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 min-w-0">
        {/* Grip handle & Logo Icon Mockup */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <div
            onPointerDown={(evt) => dragControls.start(evt)}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-xl transition-all shrink-0 touch-none"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Job Icon Placeholder */}
          <div className="relative w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-baseline gap-1.5 flex-wrap">
              <span>{e.position}</span>
              <span className="text-muted-foreground font-semibold text-xs">at</span>
              <span className="text-primary font-bold text-xs">{e.company}</span>
            </h3>
            
            {/* Meta info row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/80 mt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {e.duration}
              </span>
              {e.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {e.location}
                </span>
              )}
            </div>
          </div>

          {/* Description bullet preview */}
          {description.length > 0 && (
            <p className="text-xs text-muted-foreground/90 line-clamp-1 italic bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/20">
              • {description[0]}
            </p>
          )}

          {/* Skill Tag pills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="text-[9px] font-bold text-muted-foreground px-1 py-0.5">
                  +{skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center justify-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/30">
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
            <Link href={`/admin/experience/${e.id}`}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
          <form
            action={async () => {
              if (confirm(`Are you sure you want to delete this entry for "${e.position}" at "${e.company}"?`)) {
                try {
                  await deleteExperience(e.id)
                  onDelete(e.id)
                  toast.success("Work experience entry deleted!")
                } catch (err) {
                  toast.error("Failed to delete experience.")
                }
              }
            }}
            className="inline"
          >
            <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Reorder.Item>
  )
}

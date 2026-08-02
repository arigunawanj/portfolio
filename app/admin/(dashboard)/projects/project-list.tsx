"use client"

import { useEffect, useRef, useState } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteProject, importProjects, updateProjectOrder } from "../../actions/projects"
import {
  GripVertical,
  Edit2,
  Trash2,
  EyeOff,
  Globe,
  Github,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  FolderDot,
  FileEdit,
  Download,
  Upload
} from "lucide-react"

interface ProjectListClientProps {
  initialProjects: any[]
}

export default function ProjectListClient({ initialProjects }: ProjectListClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [search, setSearch] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const skipNextOrderSaveRef = useRef(true)

  // Only one updateProjectOrder request may be in flight at a time. Concurrent
  // requests can resolve out of order (dev server / network jitter), letting an
  // earlier, stale request overwrite a later, correct one. Queue instead.
  const savingRef = useRef(false)
  const pendingIdsRef = useRef<number[] | null>(null)

  const persistOrder = (ids: number[]) => {
    if (savingRef.current) {
      pendingIdsRef.current = ids
      return
    }
    savingRef.current = true
    const request = updateProjectOrder(ids)
    toast.promise(request, {
      loading: "Saving new order...",
      success: "Sorting order updated successfully!",
      error: "Failed to update sorting order.",
    })
    request.catch(() => {}).finally(() => {
      savingRef.current = false
      if (pendingIdsRef.current) {
        const next = pendingIdsRef.current
        pendingIdsRef.current = null
        persistOrder(next)
      }
    })
  }

  useEffect(() => {
    skipNextOrderSaveRef.current = true
    setProjects(initialProjects)
  }, [initialProjects])

  // Debounces off the committed `projects` state (not a callback param) so the
  // persisted order always matches what's actually rendered, even though
  // framer-motion's Reorder fires onReorder many times mid-drag.
  useEffect(() => {
    if (skipNextOrderSaveRef.current) {
      skipNextOrderSaveRef.current = false
      return
    }
    const timeout = setTimeout(() => {
      persistOrder(projects.map((p) => p.id))
    }, 500)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `projects-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      await importProjects(items)
      toast.success(`Imported ${items.length} project(s) successfully!`, {
        description: "Existing projects were updated, new ones were added.",
      })
      router.refresh()
    } catch (error) {
      toast.error("Failed to import JSON.", {
        description: error instanceof Error ? error.message : "Invalid file format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleReorder = (newOrder: any[]) => {
    setProjects(newOrder)
  }

  // Count stats
  const totalCount = initialProjects.length
  const publishedCount = initialProjects.filter((p) => p.published).length
  const draftCount = initialProjects.filter((p) => !p.published).length

  // Filter project cards matching search string (title or tags)
  const filteredProjects = projects.filter((p) => {
    const searchString = search.toLowerCase()
    const matchesTitle = p.title.toLowerCase().includes(searchString)
    const tags = Array.isArray(p.tags) ? (p.tags as string[]) : []
    const matchesTags = tags.some((tag) => tag.toLowerCase().includes(searchString))
    return matchesTitle || matchesTags
  })

  return (
    <div className="space-y-6">
      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Projects</span>
            <p className="text-2xl font-black text-foreground">{totalCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <FolderDot className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Published Live</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{publishedCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/40 flex items-center justify-between shadow-sm dark:bg-black/35">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Draft Sandbox</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{draftCount}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <FileEdit className="h-5 w-5" />
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
            placeholder="Search projects by title or tag..."
            className="pl-10 pr-4 bg-background border-border/80 text-xs h-9 rounded-xl focus-visible:ring-primary dark:bg-slate-950/40"
          />
        </div>
        <div className="text-[10px] font-bold text-muted-foreground/80 hidden sm:block uppercase tracking-wider px-2">
          💡 Drag handle (<GripVertical className="inline h-3.5 w-3.5" />) to sort
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isImporting}
            onClick={() => fileInputRef.current?.click()}
            className="h-9 rounded-xl text-xs gap-1.5"
          >
            <Upload className="h-3.5 w-3.5" /> {isImporting ? "Importing..." : "Import JSON"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="h-9 rounded-xl text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export JSON
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
          No projects matched your criteria. Try adjusting your search query.
        </div>
      ) : (
        <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="space-y-3.5">
          {filteredProjects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              onDelete={(id) => {
                setProjects((prev) => prev.filter((p) => p.id !== id))
              }}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  )
}

function ProjectItem({ project, onDelete }: { project: any; onDelete: (id: number) => void }) {
  const dragControls = useDragControls()
  const images = Array.isArray(project.images) ? (project.images as string[]) : []
  const thumbnail = images.length > 0 ? images[0] : null
  const tags = Array.isArray(project.tags) ? (project.tags as string[]) : []
  const colorGradient = project.color || "from-blue-500/20 to-cyan-500/20"

  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={dragControls}
      layout="position"
      whileDrag={{
        scale: 1.015, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 relative overflow-hidden backdrop-blur-md flex items-stretch select-none"
    >
      {/* Accent Color Left Band */}
      <div className={`w-1.5 bg-linear-to-b ${colorGradient} rounded-l-2xl shrink-0 self-stretch`} />

      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 min-w-0">
        {/* Grip & Image */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          {/* Grip handle */}
          <div
            onPointerDown={(e) => dragControls.start(e)}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-xl transition-all shrink-0 touch-none"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          <div className="relative w-24 h-16 sm:w-28 sm:h-20 bg-muted/40 border border-border/40 rounded-xl overflow-hidden shrink-0">
            {thumbnail ? (
              <img src={thumbnail} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900/10 dark:bg-slate-900/50 text-muted-foreground/50">
                <ImageIcon className="h-4 w-4" />
              </div>
            )}
            {!project.published && (
              <div className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-[9px] font-black text-rose-400 dark:text-rose-400 uppercase tracking-widest flex items-center gap-1">
                  <EyeOff className="h-3 w-3" /> Draft
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
          <div>
            <h3 className="font-extrabold text-sm text-foreground truncate">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{project.shortDescription}</p>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 4).map((tag, i) => (
                <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-[9px] font-bold text-muted-foreground px-1 py-0.5">
                  +{tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Target Link Config Check */}
        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-center justify-between sm:justify-start w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/30">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-muted/40 border border-border/40 rounded-xl text-xs">
            <LinkIndicator hasUrl={!!project.githubLink} icon={Github} label="Repo" />
            <div className="w-px h-3.5 bg-border/80" />
            <LinkIndicator hasUrl={!!project.demoLink} icon={Globe} label="Live" />
          </div>

          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
              <Link href={`/admin/projects/${project.id}`}>
                <Edit2 className="h-4 w-4" />
              </Link>
            </Button>
            <form
              action={async () => {
                if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                  try {
                    await deleteProject(project.id)
                    onDelete(project.id)
                    toast.success("Project deleted successfully!")
                  } catch (error) {
                    toast.error("Failed to delete project.")
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
      </div>
    </Reorder.Item>
  )
}

function LinkIndicator({ hasUrl, icon: Icon, label }: { hasUrl: boolean; icon: any; label: string }) {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1 ${
        hasUrl ? "text-emerald-500" : "text-muted-foreground/30"
      }`}
      title={hasUrl ? `${label} link configured` : `No ${label} link`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </div>
  )
}

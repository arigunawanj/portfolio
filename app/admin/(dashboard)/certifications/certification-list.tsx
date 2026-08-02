"use client"

import { useEffect, useRef, useState } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteCertification, updateCertificationOrder } from "../../actions/certifications"
import { GripVertical, Edit2, Trash2, Calendar, Award, ExternalLink } from "lucide-react"

interface CertificationListClientProps {
  initialCertifications: any[]
}

export default function CertificationListClient({ initialCertifications }: CertificationListClientProps) {
  const [items, setItems] = useState(initialCertifications)
  const skipNextOrderSaveRef = useRef(true)

  // Only one updateCertificationOrder request may be in flight at a time. Concurrent
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
    const request = updateCertificationOrder(ids)
    toast.promise(request, {
      loading: "Saving new order...",
      success: "Certifications order updated successfully!",
      error: "Failed to update certifications order.",
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

  // Debounces off the committed `items` state (not a callback param) so the
  // persisted order always matches what's actually rendered, even though
  // framer-motion's Reorder fires onReorder many times mid-drag.
  useEffect(() => {
    if (skipNextOrderSaveRef.current) {
      skipNextOrderSaveRef.current = false
      return
    }
    const timeout = setTimeout(() => {
      persistOrder(items.map((e) => e.id))
    }, 500)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const handleReorder = (newOrder: any[]) => {
    setItems(newOrder)
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/40 border border-border/40 rounded-xl text-xs text-muted-foreground flex items-center gap-2">
        💡 <span>Drag the grab handle (<GripVertical className="inline h-3.5 w-3.5" />) next to any item to reorder it dynamically.</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
          No certifications found. Create a new entry to get started.
        </div>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3.5">
          {items.map((e) => (
            <CertificationItem
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

function CertificationItem({ e, onDelete }: { e: any; onDelete: (id: number) => void }) {
  const dragControls = useDragControls()
  const skills = Array.isArray(e.skills) ? (e.skills as string[]) : []
  const colorGradient = e.color || "from-blue-500/20 via-indigo-500/20 to-blue-600/20"

  return (
    <Reorder.Item
      value={e}
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
      {/* Accent Gradient Left Strip */}
      <div className={`w-1.5 bg-linear-to-b ${colorGradient} rounded-l-2xl shrink-0 self-stretch`} />

      <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 min-w-0">
        {/* Grip handle & Logo Icon Mockup */}
        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <div
            onPointerDown={(evt) => dragControls.start(evt)}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-xl transition-all shrink-0 touch-none"
          >
            <GripVertical className="h-5 w-5" />
          </div>

          {/* Award Icon Placeholder */}
          <div className="relative w-12 h-12 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* Details Area */}
        <div className="flex-1 min-w-0 space-y-2 py-1 w-full">
          <div>
            <h3 className="font-extrabold text-sm text-foreground flex items-baseline gap-1.5 flex-wrap">
              <span>{e.name}</span>
            </h3>
            
            {/* Meta info row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/80 mt-1">
              <span className="font-bold text-primary">{e.issuer}</span>
              <span className="text-slate-350 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {e.date}
              </span>
              {e.credentialId && (
                <>
                  <span className="text-slate-350 dark:text-slate-600">|</span>
                  <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border/20">
                    ID: {e.credentialId}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description overview preview */}
          {e.description && (
            <p className="text-xs text-muted-foreground/90 line-clamp-1 leading-relaxed bg-muted/20 px-2.5 py-1.5 rounded-lg border border-border/20">
              {e.description}
            </p>
          )}

          {/* Skills associated tags list */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {skills.slice(0, 4).map((skill, i) => (
                <span key={i} className="text-[9px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 text-primary">
                  {skill}
                </span>
              ))}
              {skills.length > 4 && (
                <span className="text-[9px] font-bold text-muted-foreground px-1 py-0.5">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Controls & Verification Site Link */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center justify-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/30">
          {e.credentialUrl && e.credentialUrl !== "#" && (
            <a
              href={e.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 transition-all mr-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Verify</span>
            </a>
          )}
          
          <Button asChild variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
            <Link href={`/admin/certifications/${e.id}`}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
          <form
            action={async () => {
              if (confirm(`Are you sure you want to delete "${e.name}"?`)) {
                try {
                  await deleteCertification(e.id)
                  onDelete(e.id)
                  toast.success("Certification deleted successfully!")
                } catch (err) {
                  toast.error("Failed to delete certification.")
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

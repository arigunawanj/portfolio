"use client"

import { useState, useEffect, useRef } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  createSkill,
  deleteCategory,
  deleteSkill,
  updateSkill,
  updateCategoryOrder,
  updateSkillOrder,
} from "../../actions/tech-stack"
import {
  GripVertical,
  Plus,
  Code2,
  Database,
  Layout,
  Terminal,
  Cpu,
  Settings,
  Smartphone,
  Check,
  Trash2
} from "lucide-react"

interface Skill {
  id: number
  categoryId: number
  name: string
  level: number
  order: number
}

interface Category {
  id: number
  key: string
  icon: string
  title: string
  description: string
  order: number
  skills: Skill[]
}

interface TechStackClientProps {
  initialCategories: Category[]
}

const CATEGORY_ICONS: Record<string, any> = {
  frontend: Layout,
  backend: Database,
  database: Database,
  mobile: Smartphone,
  devops: Terminal,
  language: Code2,
  tools: Settings,
  tool: Settings,
}

export default function TechStackClient({ initialCategories }: TechStackClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const skipNextOrderSaveRef = useRef(true)

  useEffect(() => {
    skipNextOrderSaveRef.current = true
    setCategories(initialCategories)
  }, [initialCategories])

  // Only one updateCategoryOrder request may be in flight at a time. Concurrent
  // requests can resolve out of order (dev server / network jitter), letting an
  // earlier, stale request overwrite a later, correct one. Queue instead.
  const categorySavingRef = useRef(false)
  const categoryPendingIdsRef = useRef<number[] | null>(null)

  const persistCategoryOrder = (ids: number[]) => {
    if (categorySavingRef.current) {
      categoryPendingIdsRef.current = ids
      return
    }
    categorySavingRef.current = true
    const request = updateCategoryOrder(ids)
    toast.promise(request, {
      loading: "Saving category order...",
      success: "Category order updated successfully!",
      error: "Failed to update category order.",
    })
    request.catch(() => {}).finally(() => {
      categorySavingRef.current = false
      if (categoryPendingIdsRef.current) {
        const next = categoryPendingIdsRef.current
        categoryPendingIdsRef.current = null
        persistCategoryOrder(next)
      }
    })
  }

  // Keyed on category ids only (not the whole `categories` array) so nested
  // skill-order edits don't spuriously retrigger a category-order save.
  const categoryIdsKey = categories.map((cat) => cat.id).join(",")

  // Debounces off the committed state (not a callback param) so the persisted
  // order always matches what's actually rendered, even though framer-motion's
  // Reorder fires onReorder many times mid-drag.
  useEffect(() => {
    if (skipNextOrderSaveRef.current) {
      skipNextOrderSaveRef.current = false
      return
    }
    const timeout = setTimeout(() => {
      persistCategoryOrder(categoryIdsKey.split(",").filter(Boolean).map(Number))
    }, 500)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdsKey])

  const handleCategoryReorder = (newOrder: Category[]) => {
    setCategories(newOrder)
  }

  // Per-category debounce + single-flight queue for skill order, since each
  // category's skill list reorders independently of the others.
  const skillSavingRef = useRef<Map<number, boolean>>(new Map())
  const skillPendingRef = useRef<Map<number, number[]>>(new Map())
  const skillTimeoutRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const persistSkillOrder = (categoryId: number, ids: number[]) => {
    if (skillSavingRef.current.get(categoryId)) {
      skillPendingRef.current.set(categoryId, ids)
      return
    }
    skillSavingRef.current.set(categoryId, true)
    const request = updateSkillOrder(ids)
    toast.promise(request, {
      loading: "Saving skill order...",
      success: "Skills order updated successfully!",
      error: "Failed to update skills order.",
    })
    request.catch(() => {}).finally(() => {
      skillSavingRef.current.set(categoryId, false)
      const pending = skillPendingRef.current.get(categoryId)
      if (pending) {
        skillPendingRef.current.delete(categoryId)
        persistSkillOrder(categoryId, pending)
      }
    })
  }

  const handleSkillReorder = (categoryId: number, newSkillOrder: Skill[]) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === categoryId) {
          return { ...cat, skills: newSkillOrder }
        }
        return cat
      })
    )

    const existingTimeout = skillTimeoutRef.current.get(categoryId)
    if (existingTimeout) clearTimeout(existingTimeout)
    skillTimeoutRef.current.set(
      categoryId,
      setTimeout(() => {
        persistSkillOrder(categoryId, newSkillOrder.map((s) => s.id))
      }, 500)
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/40 border border-border/40 rounded-xl text-xs text-muted-foreground flex items-center gap-2">
        💡 <span>Drag the grab handle (<GripVertical className="inline h-3.5 w-3.5" />) next to any category card or skill block to reorder them.</span>
      </div>

      <Reorder.Group axis="y" values={categories} onReorder={handleCategoryReorder} className="space-y-6">
        {categories.map((cat) => (
          <CategoryItem
            key={cat.id}
            cat={cat}
            onSkillReorder={(newSkills) => handleSkillReorder(cat.id, newSkills)}
            onDeleteCategory={(id) => setCategories((prev) => prev.filter((c) => c.id !== id))}
            onSkillDelete={(skillId) => {
              setCategories((prev) =>
                prev.map((c) => {
                  if (c.id === cat.id) {
                    return { ...c, skills: c.skills.filter((s) => s.id !== skillId) }
                  }
                  return c
                })
              )
            }}
          />
        ))}
      </Reorder.Group>
    </div>
  )
}

function CategoryItem({
  cat,
  onSkillReorder,
  onDeleteCategory,
  onSkillDelete,
}: {
  cat: Category
  onSkillReorder: (newSkills: Skill[]) => void
  onDeleteCategory: (id: number) => void
  onSkillDelete: (skillId: number) => void
}) {
  const categoryDragControls = useDragControls()
  const IconComponent = CATEGORY_ICONS[cat.key.toLowerCase()] || Cpu

  return (
    <Reorder.Item
      value={cat}
      dragListener={false}
      dragControls={categoryDragControls}
      layout="position"
      whileDrag={{
        scale: 1.015, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300 overflow-hidden select-none"
    >
      {/* Category Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between flex-wrap gap-3 bg-muted/20">
        <div className="flex items-center gap-3">
          {/* Grip handle */}
          <div
            onPointerDown={(e) => categoryDragControls.start(e)}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 hover:bg-muted/50 rounded-xl transition-all touch-none"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wide px-2">
                  {cat.key}
                </span>
                <h3 className="font-extrabold text-sm text-foreground">{cat.title}</h3>
              </div>
              {cat.description && (
                <p className="text-[11px] text-muted-foreground/80 mt-0.5 line-clamp-1">{cat.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-primary/10 hover:text-primary text-xs font-bold">
            <Link href={`/admin/tech-stack/${cat.id}`}>Edit Category</Link>
          </Button>
          <form
            action={async () => {
              if (confirm(`Are you sure you want to delete category "${cat.title}" and all its skills?`)) {
                try {
                  await deleteCategory(cat.id)
                  onDeleteCategory(cat.id)
                  toast.success("Category deleted!")
                } catch (error) {
                  toast.error("Failed to delete category.")
                }
              }
            }}
          >
            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-bold">
              Delete Category
            </Button>
          </form>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Skills list reordering */}
        <Reorder.Group
          axis="y"
          values={cat.skills}
          onReorder={onSkillReorder}
          className="space-y-2.5"
        >
          {cat.skills.map((skill) => (
            <SkillItem key={skill.id} skill={skill} onSkillDelete={onSkillDelete} />
          ))}
        </Reorder.Group>

        {cat.skills.length === 0 && (
          <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/15 border border-dashed rounded-xl">
            No skills listed under this category yet. Add one below.
          </p>
        )}

        {/* Add New Skill Form */}
        <form
          action={async (formData: FormData) => {
            const name = String(formData.get("name"))
            const level = Number(formData.get("level"))
            
            const actionData = new FormData()
            actionData.append("name", name)
            actionData.append("level", String(level))
            actionData.append("order", String(cat.skills.length)) // append to end

            try {
              await createSkill(cat.id, actionData)
              toast.success(`Skill "${name}" added successfully!`)
              const form = document.getElementById(`add-skill-form-${cat.id}`) as HTMLFormElement
              form?.reset()
            } catch (error) {
              toast.error("Failed to add skill.")
            }
          }}
          id={`add-skill-form-${cat.id}`}
          className="flex items-center gap-2 pt-3 border-t border-border/30 flex-wrap sm:flex-nowrap"
        >
          <Input name="name" placeholder="Add new skill name..." required className="flex-1 min-w-[140px] bg-background/35 h-9 rounded-xl text-xs" />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Level</span>
            <Input name="level" type="number" placeholder="Lvl" min={0} max={100} defaultValue={80} className="w-16 h-9 bg-background/35 text-center rounded-xl text-xs" />
          </div>
          <Button type="submit" size="sm" className="h-9 ml-auto sm:ml-0 rounded-xl text-xs font-bold">
            <Plus className="h-4 w-4 mr-1" /> Add Skill
          </Button>
        </form>
      </div>
    </Reorder.Item>
  )
}

function SkillItem({
  skill,
  onSkillDelete,
}: {
  skill: Skill
  onSkillDelete: (id: number) => void
}) {
  const skillDragControls = useDragControls()
  const [skillName, setSkillName] = useState(skill.name)
  const [skillLevel, setSkillLevel] = useState(skill.level)

  return (
    <Reorder.Item
      value={skill}
      dragListener={false}
      dragControls={skillDragControls}
      layout="position"
      whileDrag={{
        scale: 1.015, 
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="p-3 bg-background border border-border/40 rounded-2xl hover:border-primary/10 transition-all select-none space-y-2 group"
    >
      <div className="flex items-center gap-3">
        {/* Skill grip handle */}
        <div
          onPointerDown={(e) => skillDragControls.start(e)}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 hover:bg-muted rounded-lg transition-all touch-none shrink-0"
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Skill form inline */}
        <form
          action={async (formData: FormData) => {
            const actionData = new FormData()
            actionData.append("name", skillName)
            actionData.append("level", String(skillLevel))
            actionData.append("order", String(skill.order))

            try {
              await updateSkill(skill.id, actionData)
              toast.success("Skill updated successfully!")
            } catch (error) {
              toast.error("Failed to save skill.")
            }
          }}
          className="flex-1 flex items-center gap-3 flex-wrap sm:flex-nowrap"
        >
          <Input name="name" value={skillName} onChange={(e) => setSkillName(e.target.value)} placeholder="Skill name" className="flex-1 min-w-[140px] bg-background/50 h-9 rounded-xl text-xs border-border/60" required />
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Level</span>
            <Input name="level" type="number" value={skillLevel} onChange={(e) => setSkillLevel(Number(e.target.value))} min={0} max={100} className="w-16 h-9 bg-background/50 text-center rounded-xl text-xs border-border/60" required />
          </div>
          
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            <Button type="submit" size="icon" variant="outline" className="h-9 w-9 rounded-xl" title="Save changes">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </Button>
            <Button
              formAction={async () => {
                if (confirm(`Delete skill "${skill.name}"?`)) {
                  try {
                    await deleteSkill(skill.id)
                    onSkillDelete(skill.id)
                    toast.success("Skill deleted!")
                  } catch (error) {
                    toast.error("Failed to delete skill.")
                  }
                }
              }}
              size="icon"
              variant="destructive"
              className="h-9 w-9 rounded-xl"
              title="Delete skill"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Visual Progress bar mockup */}
      <div className="pl-8 pr-1 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-muted/60 rounded-full overflow-hidden border border-border/10">
          <div
            className="h-full bg-linear-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(skillLevel, 0), 100)}%` }}
          />
        </div>
        <span className="text-[9px] font-bold text-primary tracking-wider">{skillLevel}%</span>
      </div>
    </Reorder.Item>
  )
}

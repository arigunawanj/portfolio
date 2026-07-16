"use client"

import { useState, useEffect } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateTrait, deleteTrait, createTrait, updateTraitOrder } from "../../actions/about"
import { GripVertical } from "lucide-react"

interface Trait {
  id: number
  icon: string
  title: string
  description: string
  order: number
}

interface TraitsListClientProps {
  title: string
  category: "PROFESSIONAL" | "PERSONAL"
  initialTraits: Trait[]
}

export default function TraitsListClient({ title, category, initialTraits }: TraitsListClientProps) {
  const [traits, setTraits] = useState<Trait[]>(initialTraits)

  useEffect(() => {
    setTraits(initialTraits)
  }, [initialTraits])

  const handleReorder = async (newOrder: Trait[]) => {
    setTraits(newOrder)
    const ids = newOrder.map((t) => t.id)
    
    toast.promise(updateTraitOrder(ids), {
      loading: "Saving new order...",
      success: `${title} order updated!`,
      error: "Failed to update order.",
    })
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {traits.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg">
            No items yet. Add one below.
          </div>
        ) : (
          <Reorder.Group axis="y" values={traits} onReorder={handleReorder} className="space-y-3">
            {traits.map((t) => (
              <TraitItem
                key={t.id}
                t={t}
                onDelete={(id) => setTraits((prev) => prev.filter((item) => item.id !== id))}
              />
            ))}
          </Reorder.Group>
        )}

        {/* Add New Item Form */}
        <form
          action={async (formData: FormData) => {
            const actionData = new FormData()
            actionData.append("icon", String(formData.get("icon")))
            actionData.append("title", String(formData.get("title")))
            actionData.append("description", String(formData.get("description")))
            actionData.append("order", String(traits.length))
            
            try {
              await createTrait(category as any, actionData)
              toast.success("Created successfully!")
              const form = document.getElementById(`add-form-${category}`) as HTMLFormElement
              form?.reset()
            } catch (error) {
              toast.error("Failed to create.")
            }
          }}
          id={`add-form-${category}`}
          className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start pt-4 border-t border-border/40"
        >
          <div className="md:col-span-2 space-y-1">
            <Input name="icon" placeholder="New Icon" required className="bg-background/30" />
          </div>
          <div className="md:col-span-3 space-y-1">
            <Input name="title" placeholder="New Title" required className="bg-background/30 font-medium" />
          </div>
          <div className="md:col-span-5 space-y-1">
            <Textarea name="description" placeholder="New Description" required rows={2} className="bg-background/30 min-h-[40px] resize-y" />
          </div>
          <Button type="submit" size="sm" className="md:col-span-2 h-10 w-full mt-auto">
            Add New
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function TraitItem({ t, onDelete }: { t: Trait; onDelete: (id: number) => void }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={t}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ 
        scale: 1.015, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="flex items-start gap-2 p-3 bg-card/50 border border-border/40 rounded-xl hover:border-primary/10 transition-all select-none group"
    >
      {/* Grip Handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted/55 mt-1 transition-all touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <form
        action={async (formData: FormData) => {
          const actionData = new FormData()
          actionData.append("icon", String(formData.get("icon")))
          actionData.append("title", String(formData.get("title")))
          actionData.append("description", String(formData.get("description")))
          actionData.append("order", String(t.order)) // keep current order
          
          try {
            await updateTrait(t.id, actionData)
            toast.success("Saved successfully!")
          } catch (error) {
            toast.error("Failed to save.")
          }
        }}
        className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2"
      >
        <div className="md:col-span-2">
          <Input name="icon" defaultValue={t.icon} placeholder="Icon name" className="bg-background/40" />
        </div>
        <div className="md:col-span-3">
          <Input name="title" defaultValue={t.title} placeholder="Title" className="bg-background/40 font-medium" />
        </div>
        <div className="md:col-span-5">
          <Textarea name="description" defaultValue={t.description} placeholder="Description" rows={2} className="bg-background/40 min-h-[40px] resize-y" />
        </div>
        
        <div className="md:col-span-2 flex gap-1 justify-end h-10 mt-auto">
          <Button type="submit" size="sm" variant="outline" className="h-full px-3">
            Save
          </Button>
          <Button
            formAction={async () => {
              if (confirm(`Delete "${t.title}"?`)) {
                try {
                  await deleteTrait(t.id)
                  onDelete(t.id)
                  toast.success("Deleted successfully!")
                } catch (error) {
                  toast.error("Failed to delete.")
                }
              }
            }}
            size="sm"
            variant="destructive"
            className="h-full px-3"
          >
            Delete
          </Button>
        </div>
      </form>
    </Reorder.Item>
  )
}

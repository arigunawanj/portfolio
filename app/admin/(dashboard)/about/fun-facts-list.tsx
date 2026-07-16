"use client"

import { useState, useEffect } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createFunFact, deleteFunFact, updateFunFact, updateFunFactOrder } from "../../actions/about"
import { GripVertical } from "lucide-react"

interface FunFact {
  id: number
  text: string
  order: number
}

interface FunFactsListClientProps {
  initialFunFacts: FunFact[]
}

export default function FunFactsListClient({ initialFunFacts }: FunFactsListClientProps) {
  const [items, setItems] = useState<FunFact[]>(initialFunFacts)

  useEffect(() => {
    setItems(initialFunFacts)
  }, [initialFunFacts])

  const handleReorder = async (newOrder: FunFact[]) => {
    setItems(newOrder)
    const ids = newOrder.map((f) => f.id)
    
    toast.promise(updateFunFactOrder(ids), {
      loading: "Saving new order...",
      success: "Fun facts order updated!",
      error: "Failed to update order.",
    })
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Fun Facts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-lg">
            No fun facts yet. Add one below.
          </div>
        ) : (
          <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
            {items.map((f) => (
              <FunFactItem
                key={f.id}
                f={f}
                onDelete={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
              />
            ))}
          </Reorder.Group>
        )}

        {/* Add New Item Form */}
        <form
          action={async (formData: FormData) => {
            const actionData = new FormData()
            actionData.append("text", String(formData.get("text")))
            actionData.append("order", String(items.length))
            
            try {
              await createFunFact(actionData)
              toast.success("Created successfully!")
              const form = document.getElementById("add-funfact-form") as HTMLFormElement
              form?.reset()
            } catch (error) {
              toast.error("Failed to create.")
            }
          }}
          id="add-funfact-form"
          className="flex gap-2 items-center pt-4 border-t border-border/40"
        >
          <Input name="text" placeholder="New Fun Fact text" required className="flex-1 bg-background/30 font-medium" />
          <Button type="submit" size="sm" className="h-10 px-6">
            Add New
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function FunFactItem({ f, onDelete }: { f: FunFact; onDelete: (id: number) => void }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      value={f}
      dragListener={false}
      dragControls={dragControls}
      whileDrag={{ 
        scale: 1.015, 
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        borderColor: "var(--primary)"
      }}
      className="flex items-center gap-2 p-3 bg-card/50 border border-border/40 rounded-xl hover:border-primary/10 transition-all select-none group"
    >
      {/* Grip handle */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted/55 transition-all touch-none"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <form
        action={async (formData: FormData) => {
          const actionData = new FormData()
          actionData.append("text", String(formData.get("text")))
          actionData.append("order", String(f.order)) // keep current order
          
          try {
            await updateFunFact(f.id, actionData)
            toast.success("Saved successfully!")
          } catch (error) {
            toast.error("Failed to save.")
          }
        }}
        className="flex-1 flex gap-2 items-center"
      >
        <Input name="text" defaultValue={f.text} placeholder="Fun fact text" className="flex-1 bg-background/40 font-medium" />
        
        <Button type="submit" size="sm" variant="outline">
          Save
        </Button>
        <Button
          formAction={async () => {
            if (confirm(`Delete this fun fact?`)) {
              try {
                await deleteFunFact(f.id)
                onDelete(f.id)
                toast.success("Deleted successfully!")
              } catch (error) {
                toast.error("Failed to delete.")
              }
            }
          }}
          size="sm"
          variant="destructive"
        >
          Delete
        </Button>
      </form>
    </Reorder.Item>
  )
}

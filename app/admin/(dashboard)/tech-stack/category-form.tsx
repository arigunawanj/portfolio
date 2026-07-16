import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { TechCategory } from "@prisma/client"

export function CategoryForm({
  item,
  action,
}: {
  item?: TechCategory
  action: (formData: FormData) => void
}) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="key">Key (unique slug)</Label>
          <Input id="key" name="key" defaultValue={item?.key} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (lucide name)</Label>
          <Input id="icon" name="icon" defaultValue={item?.icon} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={item?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={item?.description} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="order">Order</Label>
        <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { WorkExperience } from "@prisma/client"

export function ExperienceForm({
  item,
  action,
}: {
  item?: WorkExperience
  action: (formData: FormData) => void
}) {
  const description = Array.isArray(item?.description) ? (item!.description as string[]) : []
  const skills = Array.isArray(item?.skills) ? (item!.skills as string[]) : []

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" defaultValue={item?.position} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={item?.company} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" defaultValue={item?.duration} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={item?.location} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (one bullet per line)</Label>
        <Textarea id="description" name="description" rows={5} defaultValue={description.join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input id="skills" name="skills" defaultValue={skills.join(", ")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="companyUrl">Company URL</Label>
        <Input id="companyUrl" name="companyUrl" defaultValue={item?.companyUrl ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color gradient classes</Label>
          <Input id="color" name="color" defaultValue={item?.color ?? "from-blue-500/20 to-indigo-500/20"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" defaultValue={item?.order ?? 0} />
        </div>
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

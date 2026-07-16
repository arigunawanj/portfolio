import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Education } from "@prisma/client"

export function EducationForm({
  item,
  action,
}: {
  item?: Education
  action: (formData: FormData) => void
}) {
  const achievements = Array.isArray(item?.achievements) ? (item!.achievements as string[]) : []
  const courses = Array.isArray(item?.courses) ? (item!.courses as string[]) : []

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input id="degree" name="degree" defaultValue={item?.degree} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Input id="institution" name="institution" defaultValue={item?.institution} required />
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
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={item?.description} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="achievements">Achievements (one per line)</Label>
        <Textarea id="achievements" name="achievements" defaultValue={achievements.join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="courses">Courses (one per line)</Label>
        <Textarea id="courses" name="courses" defaultValue={courses.join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thesisTitle">Thesis Title</Label>
        <Input id="thesisTitle" name="thesisTitle" defaultValue={item?.thesisTitle ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thesisAdvisor">Thesis Advisor</Label>
        <Input id="thesisAdvisor" name="thesisAdvisor" defaultValue={item?.thesisAdvisor ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="thesisAbstract">Thesis Abstract</Label>
        <Textarea id="thesisAbstract" name="thesisAbstract" defaultValue={item?.thesisAbstract ?? ""} />
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Project } from "@prisma/client"

export function ProjectForm({
  project,
  action,
}: {
  project?: Project
  action: (formData: FormData) => void
}) {
  const images = Array.isArray(project?.images) ? (project!.images as string[]) : []
  const tags = Array.isArray(project?.tags) ? (project!.tags as string[]) : []
  const features = Array.isArray(project?.features) ? (project!.features as string[]) : []

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={project?.title} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="shortDescription">Short Description</Label>
        <Textarea id="shortDescription" name="shortDescription" defaultValue={project?.shortDescription} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={project?.description} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullDescription">Full Description</Label>
        <Textarea id="fullDescription" name="fullDescription" rows={5} defaultValue={project?.fullDescription} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="images">Images (one URL per line)</Label>
        <Textarea id="images" name="images" defaultValue={images.join("\n")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma separated)</Label>
        <Input id="tags" name="tags" defaultValue={tags.join(", ")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea id="features" name="features" defaultValue={features.join("\n")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="demoLink">Demo Link</Label>
          <Input id="demoLink" name="demoLink" defaultValue={project?.demoLink ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubLink">GitHub Link</Label>
          <Input id="githubLink" name="githubLink" defaultValue={project?.githubLink ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color gradient classes</Label>
          <Input id="color" name="color" defaultValue={project?.color ?? "from-blue-500/20 to-cyan-500/20"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" defaultValue={project?.order ?? 0} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="published" name="published" defaultChecked={project?.published ?? true} />
        <Label htmlFor="published">Published</Label>
      </div>
      <Button type="submit">Save</Button>
    </form>
  )
}

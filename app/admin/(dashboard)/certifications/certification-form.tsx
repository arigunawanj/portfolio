import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import type { Certification } from "@prisma/client"

export function CertificationForm({
  item,
  action,
}: {
  item?: Certification
  action: (formData: FormData) => void
}) {
  const skills = Array.isArray(item?.skills) ? (item!.skills as string[]) : []

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={item?.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer">Issuer</Label>
          <Input id="issuer" name="issuer" defaultValue={item?.issuer} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" defaultValue={item?.date} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={item?.description} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID</Label>
          <Input id="credentialId" name="credentialId" defaultValue={item?.credentialId ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL</Label>
          <Input id="credentialUrl" name="credentialUrl" defaultValue={item?.credentialUrl ?? ""} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input id="skills" name="skills" defaultValue={skills.join(", ")} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="color">Color gradient classes</Label>
          <Input id="color" name="color" defaultValue={item?.color ?? "from-blue-500/20 via-indigo-500/20 to-blue-600/20"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon (lucide name)</Label>
          <Input id="icon" name="icon" defaultValue={item?.icon ?? "Zap"} />
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

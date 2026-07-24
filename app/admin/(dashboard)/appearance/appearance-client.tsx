"use client"

import { updateAppearance } from "@/app/admin/actions/appearance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type Appearance = { palette: string; motionLevel: string; enable3D: boolean; accentColor: string; headingFont: string }

export default function AppearanceClient({ initialData }: { initialData: Appearance }) {
  async function action(formData: FormData) {
    await updateAppearance(formData)
    toast.success("Appearance updated")
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Appearance</h1>
      <form action={action} className="space-y-6">
        <div>
          <Label htmlFor="palette">Palette</Label>
          <select id="palette" name="palette" defaultValue={initialData.palette} className="w-full mt-1 rounded-lg border bg-background p-2">
            <option value="teal-coral">Teal + Coral</option>
          </select>
        </div>
        <div>
          <Label htmlFor="motionLevel">Motion Level</Label>
          <select id="motionLevel" name="motionLevel" defaultValue={initialData.motionLevel} className="w-full mt-1 rounded-lg border bg-background p-2">
            <option value="full">Full</option>
            <option value="reduced">Reduced</option>
            <option value="off">Off</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="enable3D" name="enable3D" defaultChecked={initialData.enable3D} />
          <Label htmlFor="enable3D">Enable 3D background</Label>
        </div>
        <div>
          <Label htmlFor="accentColor">Accent Color</Label>
          <Input id="accentColor" name="accentColor" type="color" defaultValue={initialData.accentColor} className="h-12 w-24" />
        </div>
        <div>
          <Label htmlFor="headingFont">Heading Font</Label>
          <Input id="headingFont" name="headingFont" defaultValue={initialData.headingFont} />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}

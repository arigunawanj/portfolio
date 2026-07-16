import { prisma } from "@/lib/prisma"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateProfile } from "../../actions/profile"

export default async function ProfileAdminPage() {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile & Contact</h1>
      <form action={updateProfile} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={profile?.name} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role / Title</Label>
            <Input id="role" name="role" defaultValue={profile?.role} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroBadge">Hero Badge Text</Label>
          <Input id="heroBadge" name="heroBadge" defaultValue={profile?.heroBadge} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heroDescription">Hero Description</Label>
          <Textarea id="heroDescription" name="heroDescription" defaultValue={profile?.heroDescription} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="photoUrl">Photo URL</Label>
          <Input id="photoUrl" name="photoUrl" defaultValue={profile?.photoUrl} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={profile?.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={profile?.location ?? ""} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input id="githubUrl" name="githubUrl" defaultValue={profile?.githubUrl ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input id="linkedinUrl" name="linkedinUrl" defaultValue={profile?.linkedinUrl ?? ""} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagramUrl">Instagram URL</Label>
            <Input id="instagramUrl" name="instagramUrl" defaultValue={profile?.instagramUrl ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gitlabUrl">GitLab URL</Label>
            <Input id="gitlabUrl" name="gitlabUrl" defaultValue={profile?.gitlabUrl ?? ""} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter/X URL</Label>
          <Input id="twitterUrl" name="twitterUrl" defaultValue={profile?.twitterUrl ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaTitle">SEO Meta Title</Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={profile?.metaTitle} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">SEO Meta Description</Label>
          <Textarea id="metaDescription" name="metaDescription" defaultValue={profile?.metaDescription} required />
        </div>
        <Button type="submit">Save</Button>
      </form>
    </div>
  )
}

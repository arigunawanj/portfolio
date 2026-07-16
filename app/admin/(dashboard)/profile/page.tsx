import { prisma } from "@/lib/prisma"
import ProfileClient from "./profile-client"

export default async function ProfileAdminPage() {
  const profile = await prisma.siteProfile.findUnique({ where: { id: 1 } })

  return <ProfileClient initialData={profile} />
}

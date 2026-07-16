import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { updateUser } from "../../../actions/users"
import { EditUserForm } from "./edit-user-form"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.adminUser.findUnique({ where: { id: Number(id) } })
  if (!user) notFound()

  const boundUpdate = updateUser.bind(null, user.id)

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">Edit User</h1>
      <EditUserForm username={user.username} action={boundUpdate} />
    </div>
  )
}

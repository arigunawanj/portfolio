import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EducationForm } from "../education-form"
import { updateEducation } from "../../../actions/education"

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.education.findUnique({ where: { id: Number(id) } })
  if (!item) notFound()

  const boundUpdate = updateEducation.bind(null, item.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Education</h1>
      <EducationForm item={item} action={boundUpdate} />
    </div>
  )
}

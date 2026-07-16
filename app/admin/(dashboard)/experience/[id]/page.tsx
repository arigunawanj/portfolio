import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ExperienceForm } from "../experience-form"
import { updateExperience } from "../../../actions/experience"

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.workExperience.findUnique({ where: { id: Number(id) } })
  if (!item) notFound()

  const boundUpdate = updateExperience.bind(null, item.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Experience</h1>
      <ExperienceForm item={item} action={boundUpdate} />
    </div>
  )
}

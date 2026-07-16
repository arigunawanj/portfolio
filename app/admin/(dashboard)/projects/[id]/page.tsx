import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "../project-form"
import { updateProject } from "../../../actions/projects"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!project) notFound()

  const boundUpdate = updateProject.bind(null, project.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm project={project} action={boundUpdate} />
    </div>
  )
}

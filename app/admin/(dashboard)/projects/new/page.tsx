import { ProjectForm } from "../project-form"
import { createProject } from "../../../actions/projects"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Project</h1>
      <ProjectForm action={createProject} />
    </div>
  )
}

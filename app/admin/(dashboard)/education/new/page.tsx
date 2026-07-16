import { EducationForm } from "../education-form"
import { createEducation } from "../../../actions/education"

export default function NewEducationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Education</h1>
      <EducationForm action={createEducation} />
    </div>
  )
}

import { ExperienceForm } from "../experience-form"
import { createExperience } from "../../../actions/experience"

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Experience</h1>
      <ExperienceForm action={createExperience} />
    </div>
  )
}

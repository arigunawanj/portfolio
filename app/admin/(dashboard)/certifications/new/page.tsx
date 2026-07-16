import { CertificationForm } from "../certification-form"
import { createCertification } from "../../../actions/certifications"

export default function NewCertificationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Certification</h1>
      <CertificationForm action={createCertification} />
    </div>
  )
}

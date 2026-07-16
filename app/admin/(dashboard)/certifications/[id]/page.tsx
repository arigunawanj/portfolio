import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CertificationForm } from "../certification-form"
import { updateCertification } from "../../../actions/certifications"

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.certification.findUnique({ where: { id: Number(id) } })
  if (!item) notFound()

  const boundUpdate = updateCertification.bind(null, item.id)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Certification</h1>
      <CertificationForm item={item} action={boundUpdate} />
    </div>
  )
}

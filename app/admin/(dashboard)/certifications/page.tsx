import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import CertificationListClient from "./certification-list"

export default async function CertificationsAdminPage() {
  const items = await prisma.certification.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Certifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your certificates, awards, and credentials.</p>
        </div>
        <Button asChild className="rounded-lg shadow-lg shadow-primary/10">
          <Link href="/admin/certifications/new">New Entry</Link>
        </Button>
      </div>
      <CertificationListClient initialCertifications={items} />
    </div>
  )
}

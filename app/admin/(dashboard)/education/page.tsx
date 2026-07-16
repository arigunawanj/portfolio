import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import EducationListClient from "./education-list"

export default async function EducationAdminPage() {
  const items = await prisma.education.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Education</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your academic degrees, institutions, and accomplishments.</p>
        </div>
        <Button asChild className="rounded-lg shadow-lg shadow-primary/10">
          <Link href="/admin/education/new">New Entry</Link>
        </Button>
      </div>
      <EducationListClient initialEducation={items} />
    </div>
  )
}

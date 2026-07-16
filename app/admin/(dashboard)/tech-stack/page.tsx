import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import TechStackClient from "./tech-stack-client"

export default async function TechStackAdminPage() {
  const categories = await prisma.techCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Tech Stack Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your programming languages, frameworks, libraries, and dev tools.</p>
        </div>
        <Button asChild className="rounded-lg shadow-lg shadow-primary/10">
          <Link href="/admin/tech-stack/new">New Category</Link>
        </Button>
      </div>

      <TechStackClient initialCategories={categories} />
    </div>
  )
}

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import ExperienceListClient from "./experience-list"
import { Plus } from "lucide-react"

export default async function ExperienceAdminPage() {
  const items = await prisma.workExperience.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden dark:bg-black/20 dark:border-white/5">
        <div className="space-y-1 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Work Experience</h1>
          <p className="text-sm text-muted-foreground">Manage your employment history and job descriptions.</p>
        </div>
        <Button asChild className="rounded-xl shrink-0 shadow-lg shadow-primary/10 hover:shadow-primary/20">
          <Link href="/admin/experience/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Entry
          </Link>
        </Button>
      </div>

      <ExperienceListClient initialExperiences={items} />
    </div>
  )
}

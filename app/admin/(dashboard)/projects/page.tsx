import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteProject } from "../../actions/projects"

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/new">New Project</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.order}</TableCell>
              <TableCell>{p.title}</TableCell>
              <TableCell>{p.published ? "Yes" : "No"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/projects/${p.id}`}>Edit</Link>
                </Button>
                <form
                  action={async () => {
                    "use server"
                    await deleteProject(p.id)
                  }}
                  className="inline"
                >
                  <Button variant="destructive" size="sm" type="submit">
                    Delete
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteEducation } from "../../actions/education"

export default async function EducationAdminPage() {
  const items = await prisma.education.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <Button asChild>
          <Link href="/admin/education/new">New Entry</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Degree</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.order}</TableCell>
              <TableCell>{e.degree}</TableCell>
              <TableCell>{e.institution}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/education/${e.id}`}>Edit</Link>
                </Button>
                <form
                  action={async () => {
                    "use server"
                    await deleteEducation(e.id)
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

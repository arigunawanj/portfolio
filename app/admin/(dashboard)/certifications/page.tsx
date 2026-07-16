import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteCertification } from "../../actions/certifications"

export default async function CertificationsAdminPage() {
  const items = await prisma.certification.findMany({ orderBy: { order: "asc" } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Certifications</h1>
        <Button asChild>
          <Link href="/admin/certifications/new">New Entry</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Issuer</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.order}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.issuer}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/certifications/${c.id}`}>Edit</Link>
                </Button>
                <form
                  action={async () => {
                    "use server"
                    await deleteCertification(c.id)
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

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteUser } from "../../actions/users"

export default async function UsersAdminPage() {
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } })
  const canDelete = users.length > 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Users</h1>
        <Button asChild>
          <Link href="/admin/users/new">New User</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.createdAt.toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${u.id}`}>Edit / Change Password</Link>
                </Button>
                {canDelete && (
                  <form
                    action={async () => {
                      "use server"
                      await deleteUser(u.id)
                    }}
                    className="inline"
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!canDelete && (
        <p className="text-sm text-muted-foreground">
          Only one admin user exists — add another before you can delete this one.
        </p>
      )}
    </div>
  )
}

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { deleteUser } from "../../actions/users"
import { Shield, Plus, Calendar, Trash2, Edit, UserCheck } from "lucide-react"

export default async function UsersAdminPage() {
  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } })
  const canDelete = users.length > 1

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/20 border border-border/40 p-6 rounded-2xl backdrop-blur-md relative overflow-hidden dark:bg-black/20 dark:border-white/5">
        <div className="space-y-1 relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Admin Users</h1>
          <p className="text-sm text-muted-foreground">Manage administrative accounts and credentials.</p>
        </div>
        <Button asChild className="rounded-xl shrink-0">
          <Link href="/admin/users/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Admin User
          </Link>
        </Button>
      </div>

      {/* Users Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((u) => {
          return (
            <div
              key={u.id}
              className="bg-card text-card-foreground border border-border/70 rounded-2xl p-5 shadow-sm hover:border-primary/20 transition-all duration-300 relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 group flex flex-col justify-between"
            >
              {/* Header inside card */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-foreground truncate">{u.username}</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">Control Staff</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg">
                    <Link href={`/admin/users/${u.id}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  
                  {canDelete ? (
                    <form
                      action={async () => {
                        "use server"
                        await deleteUser(u.id)
                      }}
                      className="inline"
                    >
                      <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <span className="text-[10px] text-muted-foreground/50 px-1" title="Cannot delete sole account">Locked</span>
                  )}
                </div>
              </div>

              {/* Footer info inside card */}
              <div className="border-t border-border/30 pt-3.5 mt-5 flex items-center justify-between text-xs text-muted-foreground/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Created {u.createdAt.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <UserCheck className="h-3.5 w-3.5" />
                  Active
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {!canDelete && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs flex items-center gap-2">
          🛡️ <span>Only one admin user exists. You must create another admin account before this account can be deleted.</span>
        </div>
      )}
    </div>
  )
}

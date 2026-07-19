"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createUser } from "../../../actions/users"
import { ShieldAlert, UserPlus, ArrowLeft } from "lucide-react"

export default function NewUserPage() {
  const [state, formAction, pending] = useActionState(createUser, undefined)

  return (
    <div className="max-w-md mx-auto space-y-6 pt-4">
      {/* Back button link */}
      <div>
        <Link href="/admin/users" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-all">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Users
        </Link>
      </div>

      {/* Main Glass Card Form Container */}
      <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 p-6 sm:p-8">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Title details */}
        <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">New Admin User</h1>
            <p className="text-xs text-muted-foreground">Register a new login account.</p>
          </div>
        </div>

        {/* Input fields */}
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Username</Label>
            <Input id="username" name="username" required autoComplete="off" className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Password</Label>
            <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
            <p className="text-[10px] text-muted-foreground/80">At least 8 characters required.</p>
          </div>

          {state?.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2.5 pt-2">
            <Button type="submit" disabled={pending} className="flex-1 rounded-xl h-10">
              {pending ? "Creating..." : "Create User"}
            </Button>
            <Button asChild variant="outline" className="rounded-xl h-10">
              <Link href="/admin/users">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

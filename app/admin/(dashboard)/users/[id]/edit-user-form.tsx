"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ShieldAlert, KeyRound } from "lucide-react"

type ActionState = { error?: string } | undefined

export function EditUserForm({
  username,
  action,
}: {
  username: string
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
}) {
  const [state, formAction, pending] = useActionState(action, undefined)

  return (
    <div className="bg-card text-card-foreground border border-border/70 rounded-2xl shadow-xl relative overflow-hidden backdrop-blur-md dark:bg-black/40 dark:border-white/5 p-6 sm:p-8">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      {/* Title block */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4 mb-6">
        <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary shrink-0">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Edit Account</h1>
          <p className="text-xs text-muted-foreground">Modify username or change login passwords.</p>
        </div>
      </div>

      {/* Input controls */}
      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">Username</Label>
          <Input id="username" name="username" defaultValue={username} required autoComplete="off" className="bg-background border-border/80 text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider dark:text-slate-400">New Password</Label>
          <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" className="bg-background border-border/80 text-foreground focus-visible:ring-primary h-10 rounded-xl transition-all dark:bg-slate-950/40 dark:border-slate-850 dark:text-white" />
          <p className="text-[10px] text-muted-foreground/80">Leave empty if you wish to retain current password.</p>
        </div>

        {state?.error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2.5 pt-2">
          <Button type="submit" disabled={pending} className="flex-1 rounded-xl h-10">
            {pending ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild variant="outline" className="rounded-xl h-10">
            <Link href="/admin/users">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

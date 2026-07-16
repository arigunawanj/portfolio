"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" defaultValue={username} required autoComplete="off" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input id="password" name="password" type="password" minLength={8} autoComplete="new-password" />
        <p className="text-xs text-muted-foreground">Leave blank to keep the current password.</p>
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin/users">Cancel</Link>
        </Button>
      </div>
    </form>
  )
}

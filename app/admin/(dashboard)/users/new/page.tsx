"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createUser } from "../../../actions/users"

export default function NewUserPage() {
  const [state, formAction, pending] = useActionState(createUser, undefined)

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-2xl font-bold">New Admin User</h1>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" name="username" required autoComplete="off" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create User"}
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/users">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}

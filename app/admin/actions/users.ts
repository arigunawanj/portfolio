"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function isUniqueConstraintError(err: unknown) {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002"
}

export async function createUser(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!username || password.length < 8) {
    return { error: "Username required, password must be at least 8 characters." }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await prisma.adminUser.create({ data: { username, passwordHash } })
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: "That username is already taken." }
    }
    throw err
  }

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function updateUser(id: number, _prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!username) {
    return { error: "Username is required." }
  }
  if (password && password.length < 8) {
    return { error: "New password must be at least 8 characters." }
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: {
        username,
        ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
      },
    })
  } catch (err) {
    if (isUniqueConstraintError(err)) {
      return { error: "That username is already taken." }
    }
    throw err
  }

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function deleteUser(id: number) {
  const count = await prisma.adminUser.count()
  if (count <= 1) {
    throw new Error("Cannot delete the last remaining admin user.")
  }
  await prisma.adminUser.delete({ where: { id } })
  revalidatePath("/admin/users")
}

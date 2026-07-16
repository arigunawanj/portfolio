"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function readCategoryForm(formData: FormData) {
  return {
    key: String(formData.get("key") ?? ""),
    icon: String(formData.get("icon") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    order: Number(formData.get("order") ?? 0),
  }
}

export async function createCategory(formData: FormData) {
  await prisma.techCategory.create({ data: readCategoryForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
  redirect("/admin/tech-stack")
}

export async function updateCategory(id: number, formData: FormData) {
  await prisma.techCategory.update({ where: { id }, data: readCategoryForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
  redirect("/admin/tech-stack")
}

export async function deleteCategory(id: number) {
  await prisma.techCategory.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

export async function createSkill(categoryId: number, formData: FormData) {
  await prisma.techSkill.create({
    data: {
      categoryId,
      name: String(formData.get("name") ?? ""),
      level: Number(formData.get("level") ?? 0),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

export async function updateSkill(id: number, formData: FormData) {
  await prisma.techSkill.update({
    where: { id },
    data: {
      name: String(formData.get("name") ?? ""),
      level: Number(formData.get("level") ?? 0),
      order: Number(formData.get("order") ?? 0),
    },
  })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

export async function deleteSkill(id: number) {
  await prisma.techSkill.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

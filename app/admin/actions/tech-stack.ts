"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

interface ImportSkillInput {
  id?: number
  name: string
  level: number
  order?: number
}

interface ImportCategoryInput {
  id?: number
  key: string
  icon: string
  title: string
  description: string
  order?: number
  skills?: ImportSkillInput[]
}

export async function importCategories(items: ImportCategoryInput[]) {
  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const data = {
        key: item.key,
        icon: item.icon,
        title: item.title,
        description: item.description,
        order: item.order ?? 0,
      }

      const category = item.id
        ? await tx.techCategory.upsert({
            where: { id: item.id },
            update: data,
            create: { id: item.id, ...data },
          })
        : await tx.techCategory.create({ data })

      for (const skill of item.skills ?? []) {
        const skillData = {
          categoryId: category.id,
          name: skill.name,
          level: skill.level,
          order: skill.order ?? 0,
        }

        if (skill.id) {
          await tx.techSkill.upsert({
            where: { id: skill.id },
            update: skillData,
            create: { id: skill.id, ...skillData },
          })
        } else {
          await tx.techSkill.create({ data: skillData })
        }
      }
    }
  })

  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

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

export async function updateCategoryOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.techCategory.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

export async function updateSkillOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.techSkill.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/tech-stack")
}

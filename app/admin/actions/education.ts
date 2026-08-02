"use server"

import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

function linesToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

function readForm(formData: FormData) {
  return {
    degree: String(formData.get("degree") ?? ""),
    institution: String(formData.get("institution") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    location: String(formData.get("location") ?? ""),
    description: String(formData.get("description") ?? ""),
    achievements: linesToArray(formData.get("achievements")),
    courses: linesToArray(formData.get("courses")),
    images: linesToArray(formData.get("images")),
    thesisTitle: String(formData.get("thesisTitle") ?? "") || null,
    thesisAdvisor: String(formData.get("thesisAdvisor") ?? "") || null,
    thesisAbstract: String(formData.get("thesisAbstract") ?? "") || null,
    color: String(formData.get("color") ?? "from-blue-500/20 to-indigo-500/20"),
    order: Number(formData.get("order") ?? 0),
  }
}

export async function createEducation(formData: FormData) {
  await prisma.education.create({ data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/education")
  redirect("/admin/education")
}

export async function updateEducation(id: number, formData: FormData) {
  await prisma.education.update({ where: { id }, data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/education")
  redirect("/admin/education")
}

export async function deleteEducation(id: number) {
  await prisma.education.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/education")
}

interface ImportEducationInput {
  id?: number
  degree: string
  institution: string
  duration: string
  location: string
  description: string
  achievements: unknown
  courses: unknown
  images?: unknown
  thesisTitle?: string | null
  thesisAdvisor?: string | null
  thesisAbstract?: string | null
  color?: string
  order?: number
}

export async function importEducation(items: ImportEducationInput[]) {
  const ops = items.map((item) => {
    const data = {
      degree: item.degree,
      institution: item.institution,
      duration: item.duration,
      location: item.location,
      description: item.description,
      achievements: (item.achievements ?? []) as Prisma.InputJsonValue,
      courses: (item.courses ?? []) as Prisma.InputJsonValue,
      images: (item.images ?? []) as Prisma.InputJsonValue,
      thesisTitle: item.thesisTitle ?? null,
      thesisAdvisor: item.thesisAdvisor ?? null,
      thesisAbstract: item.thesisAbstract ?? null,
      color: item.color ?? "from-blue-500/20 to-indigo-500/20",
      order: item.order ?? 0,
    }

    if (item.id) {
      return prisma.education.upsert({
        where: { id: item.id },
        update: data,
        create: { id: item.id, ...data },
      })
    }

    return prisma.education.create({ data })
  })

  await prisma.$transaction(ops)
  revalidatePath("/")
  revalidatePath("/admin/education")
}

export async function updateEducationOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.education.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/education")
}

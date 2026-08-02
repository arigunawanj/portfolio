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

function csvToArray(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

function readForm(formData: FormData) {
  return {
    position: String(formData.get("position") ?? ""),
    company: String(formData.get("company") ?? ""),
    duration: String(formData.get("duration") ?? ""),
    location: String(formData.get("location") ?? ""),
    description: linesToArray(formData.get("description")),
    skills: csvToArray(formData.get("skills")),
    images: linesToArray(formData.get("images")),
    companyUrl: String(formData.get("companyUrl") ?? "") || null,
    color: String(formData.get("color") ?? "from-blue-500/20 to-indigo-500/20"),
    order: Number(formData.get("order") ?? 0),
  }
}

export async function createExperience(formData: FormData) {
  await prisma.workExperience.create({ data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/experience")
  redirect("/admin/experience")
}

export async function updateExperience(id: number, formData: FormData) {
  await prisma.workExperience.update({ where: { id }, data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/experience")
  redirect("/admin/experience")
}

export async function deleteExperience(id: number) {
  await prisma.workExperience.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/experience")
}

interface ImportExperienceInput {
  id?: number
  position: string
  company: string
  duration: string
  location: string
  description: unknown
  skills: unknown
  images?: unknown
  companyUrl?: string | null
  color?: string
  order?: number
}

export async function importExperiences(items: ImportExperienceInput[]) {
  const ops = items.map((item) => {
    const data = {
      position: item.position,
      company: item.company,
      duration: item.duration,
      location: item.location,
      description: (item.description ?? []) as Prisma.InputJsonValue,
      skills: (item.skills ?? []) as Prisma.InputJsonValue,
      images: (item.images ?? []) as Prisma.InputJsonValue,
      companyUrl: item.companyUrl ?? null,
      color: item.color ?? "from-blue-500/20 to-indigo-500/20",
      order: item.order ?? 0,
    }

    if (item.id) {
      return prisma.workExperience.upsert({
        where: { id: item.id },
        update: data,
        create: { id: item.id, ...data },
      })
    }

    return prisma.workExperience.create({ data })
  })

  await prisma.$transaction(ops)
  revalidatePath("/")
  revalidatePath("/admin/experience")
}

export async function updateExperienceOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.workExperience.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/experience")
}

"use server"

import { prisma } from "@/lib/prisma"
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

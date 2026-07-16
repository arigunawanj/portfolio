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
    title: String(formData.get("title") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    fullDescription: String(formData.get("fullDescription") ?? ""),
    images: linesToArray(formData.get("images")),
    tags: csvToArray(formData.get("tags")),
    features: linesToArray(formData.get("features")),
    demoLink: String(formData.get("demoLink") ?? "") || null,
    githubLink: String(formData.get("githubLink") ?? "") || null,
    color: String(formData.get("color") ?? "from-blue-500/20 to-cyan-500/20"),
    published: formData.get("published") === "on",
    order: Number(formData.get("order") ?? 0),
  }
}

export async function createProject(formData: FormData) {
  await prisma.project.create({ data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/projects")
  redirect("/admin/projects")
}

export async function updateProject(id: number, formData: FormData) {
  await prisma.project.update({ where: { id }, data: readForm(formData) })
  revalidatePath("/")
  revalidatePath("/admin/projects")
  redirect("/admin/projects")
}

export async function deleteProject(id: number) {
  await prisma.project.delete({ where: { id } })
  revalidatePath("/")
  revalidatePath("/admin/projects")
}

export async function updateProjectOrder(ids: number[]) {
  const updates = ids.map((id, index) =>
    prisma.project.update({
      where: { id },
      data: { order: index },
    })
  )
  await prisma.$transaction(updates)
  revalidatePath("/")
  revalidatePath("/admin/projects")
}
